import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem, { MyStuffItem } from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { useCollectionProjects } from 'State/collection';

import styles from './styles.styl';

const CreateFirstCollection = () => (
  <div className={styles.createFirstCollection}>
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className={styles.createFirstCollectionText}>Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

const nullMyStuffCollection = {
  isBookmarkCollection: true,
  name: 'My Stuff',
  description: 'My place to save cool finds',
  fullUrl: 'sarahzinger/my-stuff',
  coverColor: '#ffccf9',
  projects: []
};




function CollectionsListWithDevToggle(props) {
  /*
    Plan: 
    - add MyStuff to ordered Collections if it doesn't exist yet
    - first collection in orderedCollections should get rendered differently
    - create that component
      - not deletable
      - when empty and not authed it doesn't show up
      - when you click it you create it for real in the database?
  */

  const myStuffEnabled = useDevToggle('My Stuff');
  if (myStuffEnabled) {
    return <CollectionsListWithMyStuff {...props} />
  } 
  
  return <CollectionsList {...props} />
}

function MyStuffCollectionLoader({ collections, myStuffCollection, ...props}) {
  const { value: projects } = useCollectionProjects(myStuffCollection);
  
  if (projects.length > 0) { // or user is authorized
    myStuffCollection.projects = projects;
    collections.unshift(myStuffCollection);
  }
  return <CollectionsList collections={collections} {...props} />;
}

function CollectionsListWithMyStuff({ collections, ...props }) {
  const myStuffCollection = collections.filter((collection) => collection.isBookmarkCollection);
  
  if (myStuffCollection.length > 0) {
    return (
      <MyStuffCollectionLoader myStuffCollection={myStuffCollection} collections={collections} {...props} />
    );
  }
  
  collections.unshift(nullMyStuffCollection);
  return <CollectionsList collections={collections} {...props} />;
}

function CollectionsList({ collections: rawCollections, title, isAuthorized, maybeTeam, showCurator }) {
  const { deleteItem } = useAPIHandlers();
  const { currentUser } = useCurrentUser();
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  function deleteCollection(collection) {
    setDeletedCollectionIds((ids) => [...ids, collection.id]);
    return deleteItem({ collection });
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!currentUser;

  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

  const myStuffEnabled = useDevToggle('My Stuff');

  if (!hasCollections && !canMakeCollections) {
    return null;
  }
  return (
    <article data-cy="collections" className={styles.collections}>
      <Heading tagName="h2">{title}</Heading>
      {canMakeCollections && (
        <>
          <CreateCollectionButton team={maybeTeam} />
          {!hasCollections && <CreateFirstCollection />}
        </>
      )}
      <Grid items={orderedCollections}>
        {(collection) =>
          myStuffEnabled && collection.isBookmarkCollection ? (
            <MyStuffItem collection={collection} />
          ) : (
            <CollectionItem
              collection={collection}
              isAuthorized={isAuthorized}
              deleteCollection={() => deleteCollection(collection)}
              showCurator={showCurator}
            />
          )
        }
      </Grid>
    </article>
  );
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  isAuthorized: PropTypes.bool,
  showCurator: PropTypes.bool,
};

CollectionsList.defaultProps = {
  maybeTeam: undefined,
  isAuthorized: false,
  showCurator: false,
};

export default CollectionsListWithDevToggle;
