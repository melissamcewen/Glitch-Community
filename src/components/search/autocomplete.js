import React, { useState, useEffect } from 'react';
import MaskImage from 'Components/images/mask-image';
import { TeamAvatar, UserAvatar, ProjectAvatar } from 'Components/images/avatar';
import { Link, TeamLink, UserLink, ProjectLink } from '../../presenters/includes/link';
import CollectionAvatar from '../../presenters/includes/collection-avatar';
import { useAlgoliaSearch } from '../../state/search';
import styles from './autocomplete.styl';

const StarterKitResult = ({ value: starterKit }) => (
  <a href={starterKit.url} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <MaskImage src={starterKit.imageURL} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{starterKit.name}</div>
      <div className={styles.infoSecondary}>{starterKit.description}</div>
    </div>
  </a>
);

const TeamResult = ({ value: team }) => (
  <TeamLink team={team} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <TeamAvatar hideTooltip team={{ ...team, hasAvatarImage: true }} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{team.name}</div>
      <div className={styles.infoSecondary}>@{team.url}</div>
    </div>
  </TeamLink>
);

const UserResult = ({ value: user }) => (
  <UserLink user={user} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <UserAvatar hideTooltip user={user} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{user.name}</div>
      <div className={styles.infoSecondary}>@{user.login}</div>
    </div>
  </UserLink>
);

const ProjectResult = ({ value: project }) => (
  <ProjectLink project={project} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <ProjectAvatar {...project} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{project.domain}</div>
      <div className={styles.infoSecondary}>{project.description}</div>
    </div>
  </ProjectLink>
);

const CollectionLink = ({ collection, children, ...props }) => (
  <a href={`/@${collection.fullUrl}`} {...props}>
    {children}
  </a>
);

const CollectionResult = ({ value: collection }) => (
  <CollectionLink collection={collection} className={styles.resultContainer}>
    <div className={styles.avatarContainer}>
      <CollectionAvatar {...collection} />
    </div>
    <div className={styles.infoContainer}>
      <div className={styles.infoPrimary}>{collection.name}</div>
      <div className={styles.infoSecondary}>@{collection.fullUrl}</div>
    </div>
  </CollectionLink>
);

const SeeAllResults = ({ query }) => (
  <Link to={`/search?q=${query}`} className={styles.seeAllResults}>
    See all results →
  </Link>
);

const resultComponents = {
  starterKit: StarterKitResult,
  team: TeamResult,
  user: UserResult,
  project: ProjectResult,
  collection: CollectionResult,
};

const Result = ({ value }) => {
  const Component = resultComponents[value.type];
  if (!Component) return null;
  return <Component value={value} />;
};

const resultGroups = [
  { id: 'team', label: 'Teams' },
  { id: 'user', label: 'Users' },
  { id: 'project', label: 'Projects' },
  { id: 'collection', label: 'Collections' },
];

const MAX_RESULTS_PER_TYPE = 3;

export const AutocompleteResults = ({ query, results }) => {
  const notTopResult = (result) => !results.topResults.includes(result);
  const resultGroupsWithItems = resultGroups
    .map((group) => ({ ...group, items: results[group.id].filter(notTopResult).slice(0, MAX_RESULTS_PER_TYPE) }))
    .filter((group) => group.items.length > 0);
  const topResultItems = [...results.starterKit, ...results.topResults];
  return (
    <div className={styles.container}>
      <ul>
        {topResultItems.length > 0 && (
          <li>
            <header className={styles.resultGroupHeader}>Top Results</header>
            <ul>
              {topResultItems.map((item) => (
                <li key={item.id} className={styles.resultItem}>
                  <Result value={item} />
                </li>
              ))}
            </ul>
          </li>
        )}
        {resultGroupsWithItems.map(({ id, label, items }) => (
          <li key={id}>
            <header className={styles.resultGroupHeader}>{label}</header>
            <ul>
              {items.map((item) => (
                <li key={item.id} className={styles.resultItem}>
                  <Result value={item} />
                </li>
              ))}
            </ul>
          </li>
        ))}
        <li>
          <SeeAllResults query={query} />
        </li>
      </ul>
    </div>
  );
};

// when results are loading, show the previous set of results instead.
function useLastCompleteSearchResult(query) {
  const results = useAlgoliaSearch(query);
  const [lastCompleteResults, setLastCompleteResults] = useState(results);
  useEffect(() => {
    if (results.status === 'ready') {
      setLastCompleteResults(results);
    }
  }, [results.status]);
  return lastCompleteResults;
}

const Autocomplete = ({ query }) => {
  const results = useLastCompleteSearchResult(query);
  if (query && results.totalHits > 0 && results.status === 'ready') {
    return (
      <div className={styles.popOver}>
        <AutocompleteResults query={query} results={results} />
      </div>
    );
  }
  return null;
};

export default Autocomplete;
