import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import Heading from 'Components/text/heading';
import UserItem from 'Components/user/user-item';
import TeamItem from 'Components/team/team-item';
import ProjectItem from 'Components/project/project-item';
import CollectionItemSmall from 'Components/collection/collection-item-small';
import StarterKitItem from 'Components/search/starter-kit-result';
import Grid from 'Components/containers/grid';
import NotFound from 'Components/errors/not-found';
import Loader from 'Components/loader';
import { captureException } from 'Utils/sentry';

import { useAPI, createAPIHook } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

import styles from './search-results.styl';

const FilterContainer = ({ filters, activeFilter, setFilter, query }) => {
  const buttons = filters.map((filter) => ({
    name: filter.id,
    contents: (
      <>
        {filter.label}
        {filter.hits && <Badge>{filter.hits > filter.maxHits ? `${filter.maxHits}+` : filter.hits}</Badge>}
      </>
    ),
  }));

  return (
    <>
      <SegmentedButtons value={activeFilter} buttons={buttons} onChange={setFilter} />
      {activeFilter === 'all' && <h1>All results for {query}</h1>}
    </>
  );
};

// Search results from algolia do not contain their associated users or teams,
// so those need to be fetched after the search results have loaded.
const useTeamUsers = createAPIHook(async (api, teamID) => {
  try {
    const res = await api.get(`/v1/teams/by/id/users?id=${teamID}`);
    return res.data.items;
  } catch (e) {
    captureException(e);
    return [];
  }
});

function TeamWithDataLoading({ team }) {
  const { value: users } = useTeamUsers(team.id);
  return <TeamItem team={{ ...team, users }} />;
}

const TeamResult = ({ result }) => {
  if (!result.users) {
    return <TeamWithDataLoading team={result} />;
  }
  return <TeamItem team={result} />;
};

const useUsers = createAPIHook(async (api, userIDs) => {
  if (!userIDs.length) {
    return undefined;
  }
  const idString = userIDs.map((id) => `id=${id}`).join('&');
  try {
    const { data } = await api.get(`/v1/users/by/id/?${idString}`);
    return Object.values(data);
  } catch (error) {
    captureException(error);
    return [];
  }
});

const useTeams = createAPIHook(async (api, teamIDs) => {
  if (!teamIDs.length) {
    return undefined;
  }
  const idString = teamIDs.map((id) => `id=${id}`).join('&');
  try {
    const { data } = await api.get(`/v1/teams/by/id/?${idString}`);
    return Object.values(data);
  } catch (error) {
    captureException(error);
    return [];
  }
});

function ProjectWithDataLoading({ project, ...props }) {
  const { value: users } = useUsers(project.userIDs);
  const { value: teams } = useTeams(project.teamIDs);
  const projectWithData = { ...project, users, teams };
  return <ProjectItem project={projectWithData} {...props} />;
}

function ProjectResult({ result }) {
  const { currentUser } = useCurrentUser();
  const api = useAPI();

  const props = { project: result, projectOptions: {} };
  if (currentUser.login) {
    props.projectOptions.addProjectToCollection = (project, collection) => api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  if (!result.users) {
    return <ProjectWithDataLoading {...props} />;
  }

  return <ProjectItem {...props} />;
}

function CollectionWithDataLoading({ collection }) {
  const { value: users = [] } = useUsers(collection.userIDs);
  const { value: teams = [] } = useTeams(collection.teamIDs);
  const collectionWithData = { ...collection, user: users[0], team: teams[0] };
  return <CollectionItemSmall showCurator collection={collectionWithData} />;
}

function CollectionResult({ result }) {
  if (!result.user && !result.team) {
    return <CollectionWithDataLoading collection={result} />;
  }
  return <CollectionItemSmall showCurator collection={result} />;
}

const groups = [
  { id: 'team', label: 'Teams' },
  { id: 'user', label: 'Users' },
  { id: 'project', label: 'Projects' },
  { id: 'collection', label: 'Collections' },
];

const resultComponents = {
  team: TeamResult,
  user: ({ result }) => <UserItem user={result} />,
  project: ProjectResult,
  collection: CollectionResult,
};

const ResultComponent = ({ result }) => {
  const Component = resultComponents[result.type];
  return <Component result={result} />;
};

const ShowAllButton = ({ label, onClick }) => (
  <div className={styles.showAllButton}>
    <Button onClick={onClick}>Show All {label}</Button>
  </div>
);

const MAX_UNFILTERED_RESULTS = 20;

const groupIsInFilter = (id, activeFilter) => activeFilter === 'all' || activeFilter === id;

const isSingleTopResult = (results, topResults, activeFilter) => results.length === 1 && topResults.includes(results[0]) && activeFilter === 'all';

function getResultsForGroup({ searchResults, group, activeFilter }) {
  const resultsForGroup = searchResults[group.id];
  const noResults = { results: [], canShowMoreResults: false };

  if (resultsForGroup.length === 0) return noResults;
  if (!groupIsInFilter(group.id, activeFilter)) return noResults;
  if (isSingleTopResult(resultsForGroup, searchResults.topResults, activeFilter)) return noResults;

  const maxResultCount = activeFilter === group.id ? Infinity : MAX_UNFILTERED_RESULTS;
  const visibleResults = resultsForGroup.slice(0, maxResultCount);
  return {
    results: visibleResults,
    canShowMoreResults: visibleResults.length < resultsForGroup.length,
  };
}

function SearchResults({ query, searchResults, activeFilter, setActiveFilter }) {
  if (!searchResults[activeFilter] || searchResults[activeFilter].length <= 0) {
    activeFilter = 'all';
  }
  const ready = searchResults.status === 'ready';
  const noResults = ready && searchResults.totalHits === 0;
  const showTopResults = ready && searchResults.starterKit.length + searchResults.topResults.length > 0 && activeFilter === 'all';

  const filters = [
    { id: 'all', label: 'All' },
    ...groups
      .map((group) => ({
        ...group,
        hits: searchResults[group.id].length,
        maxHits: activeFilter === group.id ? Infinity : MAX_UNFILTERED_RESULTS,
      }))
      .filter((group) => group.hits > 0),
  ];

  const renderedGroups = groups
    .map((group) => ({
      ...group,
      ...getResultsForGroup({ searchResults, group, activeFilter }),
    }))
    .filter((group) => group.results.length > 0);

  return (
    <main className={styles.page}>
      {!ready && (
        <>
          <Loader />
          <h1>All results for {query}</h1>
        </>
      )}
      {ready && searchResults.totalHits > 0 && (
        <FilterContainer filters={filters} setFilter={setActiveFilter} activeFilter={activeFilter} query={query} />
      )}
      {showTopResults && (
        <article className={classnames(styles.groupContainer, styles.topResults)}>
          <Heading tagName="h2">Top Results</Heading>
          <Grid items={searchResults.starterKit} className={styles.starterKitResultsContainer}>
            {(result) => <StarterKitItem result={result} />}
          </Grid>
          <Grid items={searchResults.topResults} className={styles.resultsContainer}>
            {(result) => <ResultComponent result={result} />}
          </Grid>
        </article>
      )}
      {ready &&
        renderedGroups.map(({ id, label, results, canShowMoreResults }) => (
          <article key={id} className={styles.groupContainer}>
            <Heading tagName="h2">{label}</Heading>
            <Grid items={results} className={styles.resultsContainer}>
              {(result) => <ResultComponent result={result} />}
            </Grid>
            {canShowMoreResults && <ShowAllButton label={label} onClick={() => setActiveFilter(id)} />}
          </article>
        ))}
      {noResults && <NotFound name="any results" />}
    </main>
  );
}

SearchResults.propTypes = {
  query: PropTypes.string.isRequired,
  searchResults: PropTypes.shape({
    status: PropTypes.oneOf(['init', 'loading', 'ready']).isRequired,
    totalHits: PropTypes.number.isRequired,
    topResults: PropTypes.array.isRequired,
    team: PropTypes.array.isRequired,
    user: PropTypes.array.isRequired,
    project: PropTypes.array.isRequired,
    collection: PropTypes.array.isRequired,
    starterKit: PropTypes.array.isRequired,
  }).isRequired,
  activeFilter: PropTypes.string.isRequired,
  setActiveFilter: PropTypes.func.isRequired,
};

export default SearchResults;
