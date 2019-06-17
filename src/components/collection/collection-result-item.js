import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import { ProfileItem } from 'Components/profile-list';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from 'Components/containers/results-list';
import VisibilityContainer from 'Components/visibility-container';
import VisuallyHidden from 'Components/containers/visually-hidden';
import { createAPIHook } from 'State/api';
import { getSingleItem } from 'Shared/api';

import CollectionAvatar from '../../presenters/includes/collection-avatar';
import styles from './collection-result-item.styl';

const useCurator = createAPIHook(async (api, collection) => {
  if (collection.userIDs.length) {
    const id = collection.userIDs[0];
    const user = await getSingleItem(api, `/v1/users/by/id?id=${id}`, id);
    return { user };
  }
  if (collection.teamIDs.length) {
    const id = collection.teamIDs[0];
    const team = await getSingleItem(api, `/v1/teams/by/id?id=${id}`, id);
    return { team };
  }
  return {};
});

const ProfileItemWithData = ({ collection }) => {
  const { value: curator } = useCurator(collection);
  return (
    <>
      {curator ? (<VisuallyHidden>by</VisuallyHidden>) : null}
      <ProfileItem {...curator} size="small" />
    </>
  );
};

const ProfileItemWrap = ({ collection }) => (
  <div className={styles.profileItemWrap}>
    <VisibilityContainer>
      {({ wasEverVisible }) => (
        wasEverVisible ? <ProfileItemWithData collection={collection} /> : <ProfileItem size="small" />
      )}
    </VisibilityContainer>
  </div>
);

const CollectionResultItem = ({ onClick, collection, active }) => (
  <ResultItem
    active={active}
    onClick={onClick}
    href={`/@${collection.fullUrl}`}
  >
    <div className={styles.avatarWrap}>
      <CollectionAvatar color={collection.coverColor} />
    </div>
    <ResultInfo>
      <VisuallyHidden>Add to collection</VisuallyHidden>
      <ResultName>{collection.name}</ResultName>
      {collection.description.length > 0 && (
        <ResultDescription>
          <VisuallyHidden>with description</VisuallyHidden>
          <Markdown renderAsPlaintext>{collection.description}</Markdown>
        </ResultDescription>
      )}
      <ProfileItemWrap collection={collection} />
    </ResultInfo>
  </ResultItem>
);

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  active: PropTypes.bool,
};

CollectionResultItem.defaultProps = {
  active: false,
};

export default CollectionResultItem;
