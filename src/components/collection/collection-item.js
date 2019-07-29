import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import classNames from 'classnames';

import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import { ProfileItem } from 'Components/profile-list';
import Loader from 'Components/loader/';
import { CollectionLink } from 'Components/link';
import Row from 'Components/containers/row';
import ProjectItemSmall from 'Components/project/project-item-small';
import AnimationContainer from 'Components/animation-container';
import { CollectionAvatar } from 'Components/images/avatar';
import VisibilityContainer from 'Components/visibility-container';
import Arrow from 'Components/arrow';
import { isDarkColor } from 'Utils/color';
import { useCollectionProjects, useCollectionCurator } from 'State/collection';

import CollectionOptions from './collection-options-pop';

import styles from './collection-item.styl';

const collectionColorStyles = (collection) => ({
  backgroundColor: collection.coverColor,
  border: collection.coverColor,
});

const ProjectsLoading = () => (
  <div className={classNames(styles.projectsContainer, styles.empty)}>
    <Loader />
  </div>
);

const CollectionProjects = ({ collection, isAuthorized }) => {
  const { value: projects } = useCollectionProjects(collection);
  if (!projects) return <ProjectsLoading />;

  if (projects.length === 0 && isAuthorized) {
    return (
      <div className={classNames(styles.projectsContainer, styles.empty)}>
        <Text>
          This collection is empty – add some projects <Emoji name="index" />
        </Text>
      </div>
    );
  }
  if (projects.length === 0 && !isAuthorized) {
    return (
      <div className={classNames(styles.projectsContainer, styles.empty)}>
        <Text>No projects to see in this collection just yet.</Text>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className={styles.projectsContainer}>
        <Row className={styles.projectsList} items={projects} count={3}>
          {(project) => <ProjectItemSmall project={project} />}
        </Row>
      </div>
      <CollectionLink collection={collection} className={styles.footerLink}>
        {`View ${projects.length >= 3 ? 'all' : ''} `}
        <Pluralize count={projects.length} singular="project" /> <Arrow />
      </CollectionLink>
    </React.Fragment>
  );
};

const CollectionProjectsLoader = ({ collection, isAuthorized, showLoader }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) =>
      showLoader && !wasEverVisible ? <ProjectsLoading /> : <CollectionProjects collection={collection} isAuthorized={isAuthorized} />
    }
  </VisibilityContainer>
);

const CollectionCurator = ({ collection }) => {
  const { value: curator } = useCollectionCurator(collection);
  return <ProfileItem {...curator} />;
};

export const CollectionCuratorLoader = ({ collection }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) => (wasEverVisible ? <CollectionCurator collection={collection} /> : <ProfileItem />)}
  </VisibilityContainer>
);

// TODO: add onclick that creates the new my stuff collection, ensure button is accessible
const CreateMyStuffOnClickComponent = ({ children, ...props }) => <div {...props}>{children}</div>;

// TODO: add to storybook
export const MyStuffItem = ({ collection }) => {
  const CollectionLinkComponent = collection.fullUrl ? CollectionLink : CreateMyStuffOnClickComponent;

  return (
    <div className={styles.collectionItem}>
      <div className={styles.header} />
      <CollectionLinkComponent collection={collection} className={classNames(styles.linkBody)} style={collectionColorStyles(collection)}>
        <div className={styles.avatarContainer}>
          {/* TODO replace with my stuff icon */}
          <CollectionAvatar collection={collection} />
        </div>
        <div className={styles.nameDescriptionContainer}>
          <div className={styles.itemButtonWrap}>
            <Button decorative>{collection.name}</Button>
          </div>
          <div className={classNames(styles.description, { [styles.dark]: isDarkColor(collection.coverColor) })}>
            <Markdown length={100}>{collection.description || ' '}</Markdown>
          </div>
        </div>
      </CollectionLinkComponent>
      {collection.projects.length === 0 && (
        <div className={classNames(styles.projectsContainer, styles.empty)}>
          <Text>(placeholder image coming soon) Quickly add any app on Glitch to your My Stuff collection</Text>
        </div>
      )}
    </div>
  );
};

const CollectionItem = ({ collection, deleteCollection, isAuthorized, showCurator, showLoader }) => (
  <AnimationContainer type="slideDown" onAnimationEnd={deleteCollection}>
    {(animateAndDeleteCollection) => (
      <div className={styles.collectionItem}>
        {(showCurator || isAuthorized) && (
          <div className={styles.header}>
            <div className={styles.curator}>{showCurator && <CollectionCuratorLoader collection={collection} />}</div>
            {isAuthorized && <CollectionOptions collection={collection} deleteCollection={animateAndDeleteCollection} />}
          </div>
        )}
        <CollectionLink
          collection={collection}
          className={classNames(styles.linkBody, { [styles.showCurator]: showCurator })}
          style={collectionColorStyles(collection)}
        >
          <div className={styles.avatarContainer}>
            <CollectionAvatar collection={collection} />
          </div>
          <div className={styles.nameDescriptionContainer}>
            <div className={styles.itemButtonWrap}>
              <Button decorative>{collection.name}</Button>
            </div>
            <div className={classNames(styles.description, { [styles.dark]: isDarkColor(collection.coverColor) })}>
              <Markdown length={100}>{collection.description || ' '}</Markdown>
            </div>
          </div>
        </CollectionLink>

        <CollectionProjectsLoader collection={collection} isAuthorized={isAuthorized} showLoader={showLoader} />
      </div>
    )}
  </AnimationContainer>
);

CollectionItem.propTypes = {
  collection: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
  }).isRequired,
  deleteCollection: PropTypes.func,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
  showLoader: PropTypes.bool,
};

CollectionItem.defaultProps = {
  deleteCollection: () => {},
  isAuthorized: false,
  showCurator: false,
  showLoader: true,
};

export default CollectionItem;
