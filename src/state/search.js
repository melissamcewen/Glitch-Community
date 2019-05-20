/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useEffect, useReducer, useMemo } from 'react';
import { mapValues, sumBy } from 'lodash';
import { allByKeys } from 'Shared/api';
import { useAPI } from 'State/api';
import { useErrorHandlers } from 'State/notifications';
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

// search provider logic -- shared between algolia & legacy API
function useSearchProvider(provider, query, params) {
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
        const resultsWithEmpties = { ...emptyResults, ...action.payload };
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
    if (!query) {
      dispatch({ type: 'clearQuery' });
      return;
    }
    dispatch({ type: 'loading' });
    allByKeys(mapValues(provider, (index) => index(query, params)))
      .then((res) => {
        dispatch({ type: 'ready', payload: res });
      })
      .catch(handleError);
  }, [query, params]);
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
    userIDs: project.members,
    teamIDs: project.teams,
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
    teamIDs: collection.team > 0 ? [collection.team] : [],
    userIDs: collection.user > 0 ? [collection.user] : [],
  }),
};

const formatAlgoliaResult = (type) => ({ hits }) =>
  hits.map((value) => ({
    type,
    ...formatByType[type](value),
  }));

const defaultParams = { notSafeForKids: false };

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

export function useAlgoliaSearch(query, params = defaultParams) {
  const api = useAPI();
  const algoliaProvider = useMemo(() => createAlgoliaProvider(api), [api]);
  return useSearchProvider(algoliaProvider, query, params);
}

// legacy search

const formatLegacyResult = (type) => ({ data }) => data.map((value) => ({ type, ...value }));

const getLegacyProvider = (api) => ({
  team: (query) => api.get(`teams/search?q=${query}`).then(formatLegacyResult('team')),
  user: (query) => api.get(`users/search?q=${query}`).then(formatLegacyResult('user')),
  project: (query) => api.get(`projects/search?q=${query}`).then(formatLegacyResult('project')),
  collection: () => Promise.resolve([]),
  starterKit: (query) => Promise.resolve(findStarterKits(query)),
});

export function useLegacySearch(query) {
  const api = useAPI();
  const legacyProvider = getLegacyProvider(api);
  return useSearchProvider(legacyProvider, query);
}
