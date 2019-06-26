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
import { isDarkColor } from 'Models/collection';
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
    <>
      <div className={styles.projectsContainer}>
        <Row className={styles.projectsList} items={projects} count={3}>
          {(project) => <ProjectItemSmall project={project} />}
        </Row>
      </div>
      <CollectionLink collection={collection} className={styles.footerLink}>
        {`View ${projects.length >= 3 ? 'all' : ''} `}
        <Pluralize count={projects.length} singular="project" />
        <span aria-hidden="true"> →</span>
      </CollectionLink>
    </>
  );
};

const CollectionProjectsLoader = ({ collection, isAuthorized }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) => (wasEverVisible ? <CollectionProjects collection={collection} isAuthorized={isAuthorized} /> : <ProjectsLoading />)}
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

const CollectionItem = ({ collection, deleteCollection, isAuthorized, showCurator }) => (
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
            <div className={styles.description} style={{ color: isDarkColor(collection.coverColor) ? 'white' : '' }}>
              <Markdown length={100}>{collection.description || ' '}</Markdown>
            </div>
          </div>
        </CollectionLink>

        <CollectionProjectsLoader collection={collection} isAuthorized={isAuthorized} />
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
};

CollectionItem.defaultProps = {
  deleteCollection: () => {},
  isAuthorized: false,
  showCurator: false,
};

export default CollectionItem;
