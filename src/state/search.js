import algoliasearch from 'algoliasearch/lite';
import { useEffect, useReducer, useMemo } from 'react';
import { mapValues, sumBy, pick } from 'lodash';

import { allByKeys } from 'Shared/api';
import useErrorHandlers from 'State/error-handlers';

import { useAPI } from './api';
import starterKits from '../curated/starter-kits';

// TODO: this is super hacky; this would probably work a lot better with algolia
const normalize = (str) =>
  (str || '')
    .trim()
    .replace(/[^\w\d\s]/g, '')
    .toLowerCase();

function findStarterKits(query) {
  const normalizedQuery = normalize(query);
  return starterKits.filter((kit) => kit.keywords.includes(normalizedQuery)).map((kit) => ({ type: 'starterKit', ...kit }));
}

// top results

// byPriority('domain', 'name') -- first try to match domain, then try matching name, then return `null`
const byPriority = (...prioritizedKeys) => (items, query) => {
  const normalizedQuery = normalize(query);
  for (const key of prioritizedKeys) {
    const match = items.find((item) => normalize(item[key]) === normalizedQuery);
    if (match) return match;
  }
  return null;
};

const findTop = {
  project: byPriority('domain', 'name'),
  team: byPriority('url', 'name'),
  user: byPriority('login', 'name'),
};

const getTopResults = (resultsByType, query) =>
  [findTop.project(resultsByType.project, query), findTop.team(resultsByType.team, query), findTop.user(resultsByType.user, query)].filter(Boolean);

const filterOutBadData = (payload) => {
  const filteredData = { ...payload };
  // sometimes search results are out of sync with db, ensures we don't show teams that don't exist)
  if (filteredData.team) {
    filteredData.team = filteredData.team.filter((t) => !!t.url);
  }
  return filteredData;
};

// search provider logic -- shared between algolia & legacy API
function useSearchProvider(provider, query, params, deps) {
  const { handleError } = useErrorHandlers();
  const emptyResults = mapValues(provider, () => []);
  const initialState = {
    status: 'init',
    totalHits: 0,
    topResults: [],
    ...emptyResults,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'clearQuery':
        return initialState;
      case 'loading':
        return { ...state, status: 'loading' };
      case 'ready': {
        const resultsWithEmpties = { ...emptyResults, ...filterOutBadData(action.payload) };
        return {
          status: 'ready',
          totalHits: sumBy(Object.values(action.payload), (items) => items.length),
          topResults: getTopResults(resultsWithEmpties, query),
          ...resultsWithEmpties,
        };
      }
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (!query && !params.allowEmptyQuery) {
      dispatch({ type: 'clearQuery' });
      return;
    }
    dispatch({ type: 'loading' });
    const selectedProviders = pick(provider, params.filterTypes);

    allByKeys(mapValues(selectedProviders, (index) => index(query, params)))
      .then((res) => {
        dispatch({ type: 'ready', payload: res });
      })
      .catch(handleError);
  }, [query, ...deps]);
  return state;
}

// algolia search

const formatByType = {
  user: (user) => ({
    ...user,
    id: Number(user.objectID.replace('user-', '')),
    thanksCount: user.thanks,
  }),
  team: (team) => ({
    isVerified: false,
    hasAvatarImage: false,
    ...team,
    id: Number(team.objectID.replace('team-', '')),
  }),
  project: (project) => ({
    description: '',
    showAsGlitchTeam: false,
    ...project,
    id: project.objectID.replace('project-', ''),
    users: null,
    teams: null,
    permissions: [],
    teamIds: project.teams,
    private: project.isPrivate,
  }),
  collection: (collection) => ({
    coverColor: '#eee',
    color: '#eee',
    description: '',
    ...collection,
    id: Number(collection.objectID.replace('collection-', '')),
    team: null,
    user: null,
    teamId: collection.team,
    userId: collection.user,
  }),
};

const formatAlgoliaResult = (type) => ({ hits }) =>
  hits.map((value) => ({
    type,
    ...formatByType[type](value),
  }));

const defaultParams = { notSafeForKids: false, filterTypes: ['user', 'team', 'project', 'collection'] };

function createSearchClient(api) {
  const clientPromise = api.get('/search/creds').then(({ data }) => algoliasearch(data.id, data.searchKey));
  return {
    initIndex: (indexName) => {
      const indexPromise = clientPromise.then((client) => client.initIndex(indexName));

      return {
        search: (...args) => indexPromise.then((index) => index.search(...args)),
      };
    },
  };
}

const buildCollectionFilters = ({ teamIDs = [], userIDs = [] }) => {
  if (!teamIDs.length && !userIDs.length) return undefined;
  return [...teamIDs.map((id) => `team=${id}`), ...userIDs.map((id) => `user=${id}`)].join(' OR ');
};

function createAlgoliaProvider(api) {
  const searchClient = createSearchClient(api);
  const searchIndices = {
    team: searchClient.initIndex('search_teams'),
    user: searchClient.initIndex('search_users'),
    project: searchClient.initIndex('search_projects'),
    collection: searchClient.initIndex('search_collections'),
  };

  return {
    ...mapValues(searchIndices, (index, type) => (query) => index.search({ query, hitsPerPage: 100 }).then(formatAlgoliaResult(type))),
    collection: (query, { teamIDs, userIDs }) =>
      searchIndices.collection
        .search({
          query,
          hitsPerPage: 100,
          filters: buildCollectionFilters({ teamIDs, userIDs }),
        })
        .then(formatAlgoliaResult('collection')),
    project: (query, { notSafeForKids }) =>
      searchIndices.project
        .search({
          query,
          hitsPerPage: 100,
          facetFilters: [notSafeForKids ? '' : 'notSafeForKids:false'],
        })
        .then(formatAlgoliaResult('project')),
    starterKit: (query) => Promise.resolve(findStarterKits(query)),
  };
}

export function useAlgoliaSearch(query, params = defaultParams, deps = []) {
  const api = useAPI();
  const algoliaProvider = useMemo(() => createAlgoliaProvider(api), [api]);
  return useSearchProvider(algoliaProvider, query, params, deps);
}

export default useAlgoliaSearch;
