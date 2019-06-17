import React from 'react';
import classnames from 'classnames';
import MaskImage from 'Components/images/mask-image';
import { TeamAvatar, UserAvatar, ProjectAvatar } from 'Components/images/avatar';
import Link, { TeamLink, UserLink, ProjectLink } from 'Components/link';
import CollectionAvatar from '../../presenters/includes/collection-avatar';
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
      <TeamAvatar hideTooltip team={{ ...team }} />
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
      <ProjectAvatar project={project} />
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

const SeeAllResults = ({ query, selected }) => (
  <Link to={`/search?q=${query}`} className={classnames(styles.seeAllResults, selected && styles.selected)}>
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

const Result = ({ value, selected }) => {
  const Component = resultComponents[value.type];
  return <li className={classnames(styles.resultItem, selected && styles.selected)}>{Component && <Component value={value} />}</li>;
};

const Autocomplete = ({ query, results, seeAllResultsSelected }) => (
  <div className={styles.container}>
    <ul>
      {results.map(({ id, label, items }) => (
        <li key={id}>
          <header className={styles.resultGroupHeader}>{label}</header>
          <ul>
            {items.map((item) => (
              <Result key={item.id} value={item} selected={item.selected} />
            ))}
          </ul>
        </li>
      ))}
      <li>
        <SeeAllResults query={query} selected={seeAllResultsSelected} />
      </li>
    </ul>
  </div>
);

export default Autocomplete;
