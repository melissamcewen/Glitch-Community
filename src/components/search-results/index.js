import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Badge, Button, Loader, SegmentedButton } from '@fogcreek/shared-components';

import { createAPIHook } from 'State/api';

import Heading from 'Components/text/heading';
import UserItem from 'Components/user/user-item';
import TeamItem from 'Components/team/team-item';
import ProjectItem from 'Components/project/project-item';
import CollectionItemSmall from 'Components/collection/collection-item-small';
import StarterKitItem from 'Components/search/starter-kit-result';
import Grid from 'Components/containers/grid';
import NotFound from 'Components/errors/not-found';
import styles from './search-results.styl';

const FilterContainer = ({ filters, activeFilter, setFilter }) => {
  const buttons = filters.map((filter) => ({
    id: filter.id,
    label: (
      <>
        {filter.label}
        {filter.hits && <Badge>{filter.hits > filter.maxHits ? `${filter.maxHits}+` : filter.hits}</Badge>}
      </>
    ),
  }));

  return <SegmentedButton value={activeFilter} options={buttons} onChange={setFilter} />;
};

const groups = [
  { id: 'team', label: 'Teams' },
  { id: 'user', label: 'Users' },
  { id: 'project', label: 'Projects' },
  { id: 'collection', label: 'Collections' },
];

const useProjectsWithUserData = createAPIHook(async (api, projects) => {
  if (!projects.length) return {};
  const idString = projects.map((p) => `id=${p.id}`).join('&');
  const { data } = await api.get(`/v1/projects/by/id?${idString}&limit=100`);
  return data;
}, { captureException: true });

const resultComponents = {
  team: ({ result }) => <TeamItem team={result} />,
  user: ({ result }) => <UserItem user={result} />,
  project: ({ result, projectsWithUserData }) => <ProjectItem project={projectsWithUserData[result.id] || result} />,
  collection: ({ result }) => <CollectionItemSmall showCurator collection={result} />,
};

const ResultComponent = ({ result, ...props }) => {
  const Component = resultComponents[result.type];
  return <Component result={result} {...props} />;
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

  const { value: projectsWithUserData = {} } = useProjectsWithUserData(searchResults.project);

  return (
    <main className={styles.page} id="main">
      {ready && searchResults.totalHits > 0 && (
        <FilterContainer filters={filters} setFilter={setActiveFilter} activeFilter={activeFilter} />
      )}
      {activeFilter === 'all' && <h1>All results for {query}</h1>}
      {!ready && <Loader style={{ width: '25px' }} />}
      {showTopResults && (
        <article className={classnames(styles.groupContainer, styles.topResults)}>
          <Heading tagName="h2">Top Results</Heading>
          <Grid items={searchResults.starterKit} className={styles.starterKitResultsContainer}>
            {(result) => <StarterKitItem result={result} />}
          </Grid>
          <Grid items={searchResults.topResults} className={styles.resultsContainer}>
            {(result) => <ResultComponent result={result} projectsWithUserData={projectsWithUserData} />}
          </Grid>
        </article>
      )}
      {ready &&
        renderedGroups.map(({ id, label, results, canShowMoreResults }) => (
          <article key={id} className={styles.groupContainer}>
            <Heading tagName="h2">{label}</Heading>
            <Grid items={results} className={styles.resultsContainer}>
              {(result) => <ResultComponent result={result} projectsWithUserData={projectsWithUserData} />}
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
