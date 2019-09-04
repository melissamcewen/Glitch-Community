import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize, range, flatMap, zipWith } from 'lodash';
import { Loader } from '@fogcreek/shared-components';
import { useSelector, useDispatch } from 'react-redux';

import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import SmallCollectionItem from 'Components/collection/collection-item-small';
import Heading from 'Components/text/heading';
import Row from 'Components/containers/row';
import Arrow from 'Components/arrow';
import { UserLink, TeamLink } from 'Components/link';
import { getDisplayName } from 'Models/user';
import { getSingleItem } from 'Shared/api';
import { useCollectionCurator } from 'State/collection';
import { getResource, allReady, actions as resourceActions } from 'State/resources';

import styles from './styles.styl';

const loadMoreCollectionsFromAuthor = ({ api, collection }) => {
  const authorType = collection.teamId === -1 ? 'user' : 'team';
  const authorEndpoint = `${authorType}s`;
  const authorId = authorType === 'user' ? collection.userId : collection.teamId;

  // get up to 10 collections from the author
  return getSingleItem(api, `v1/${authorEndpoint}/${authorId}/collections?limit=10&orderKey=createdAt&orderDirection=DESC`, 'items');
};

const useCollectionsWithProjects = (collections) => {
  const resourceState = useSelector((state) => state.resources);
  const dispatch = useDispatch();

  collections = collections.filter((coll) => !coll.isMyStuff);
  if (!collections.length) return [];

  const responses = collections.map((collection) => getResource(resourceState, 'collections', collection.id, 'projects'));
  const requests = flatMap(responses, (response) => response.requests);

  if (requests.length > 0) {
    dispatch(resourceActions.requestedResources(requests));
  }

  const allProjects = allReady(responses);
  if (allProjects.status === 'loading') return null;

  return zipWith(collections, allProjects.value, (coll, projects) => ({
    ...coll,
    projects,
  })).filter((coll) => coll.projects.length > 0);
};

// a version of sampleSize that uses the same indices as long as the input array's length is stable
const useSample = (items, size) => {
  const indices = React.useMemo(() => sampleSize(range(items.length), size), [items.length, size]);
  return indices.map((idx) => items[idx]);
};

const MoreCollections = ({ currentCollection, collections }) => {
  const curator = useCollectionCurator(currentCollection);
  const collectionsWithProjects = useCollectionsWithProjects(collections);
  const sampledCollections = useSample(collectionsWithProjects || [], 3);

  if (!collectionsWithProjects) return <Loader style={{ width: '25px' }} />;
  if (!collectionsWithProjects.length) return null;

  const isUserCollection = currentCollection.teamId === -1;
  const type = isUserCollection ? 'user' : 'team';
  return (
    <>
      <div className={styles.moreByLinkWrap}>
        <Heading tagName="h2">
          {curator.status === 'ready' ? (
            <>
              {curator.value.user && (
                <UserLink user={curator.value.user}>
                  More by {getDisplayName(curator.value.user)} <Arrow />
                </UserLink>
              )}
              {curator.value.team && (
                <TeamLink team={curator.value.team}>
                  More from {curator.value.team.name} <Arrow />
                </TeamLink>
              )}
            </>
          ) : (
            <>More collections</>
          )}
        </Heading>
      </div>
      <CoverContainer type={type} item={currentCollection[type]}>
        <Row items={sampledCollections}>{(collection) => <SmallCollectionItem key={collection.id} collection={collection} />}</Row>
      </CoverContainer>
    </>
  );
};

MoreCollections.propTypes = {
  currentCollection: PropTypes.object.isRequired,
  collections: PropTypes.array.isRequired,
};

const MoreCollectionsContainer = ({ collection }) => (
  <DataLoader get={(api) => loadMoreCollectionsFromAuthor({ api, collection })}>
    {(collections) => (collections.length > 0 ? <MoreCollections currentCollection={collection} collections={collections} /> : null)}
  </DataLoader>
);

MoreCollectionsContainer.propTypes = {
  collection: PropTypes.object.isRequired,
};

export default MoreCollectionsContainer;
