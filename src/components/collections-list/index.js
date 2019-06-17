import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import Heading from 'Components/text/heading';
import CollectionItem from 'Components/collection/collection-item';
import Grid from 'Components/containers/grid';
import CreateCollectionButton from 'Components/collection/create-collection-pop';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const CreateFirstCollection = () => (
  <div className={styles.createFirstCollection}>
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt="" />
    <p className={styles.createFirstCollectionText}>Create collections to organize your favorite projects.</p>
    <br />
  </div>
);

function CollectionsList({ collections: rawCollections, title, isAuthorized, maybeTeam, showCurator }) {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  const [deletedCollectionIds, setDeletedCollectionIds] = useState([]);

  function deleteCollection(id) {
    setDeletedCollectionIds((ids) => [...ids, id]);
    return api.delete(`/collections/${id}`);
  }

  const collections = rawCollections.filter(({ id }) => !deletedCollectionIds.includes(id));
  const hasCollections = !!collections.length;
  const canMakeCollections = isAuthorized && !!currentUser;

  const orderedCollections = orderBy(collections, (collection) => collection.updatedAt, 'desc');

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
        {(collection) => (
          <CollectionItem collection={collection} isAuthorized={isAuthorized} deleteCollection={deleteCollection} showCurator={showCurator} />
        )}
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

export default CollectionsList;
