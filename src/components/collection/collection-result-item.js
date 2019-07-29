import React from 'react';
import PropTypes from 'prop-types';

import Markdown from 'Components/text/markdown';
import { ProfileItem } from 'Components/profile-list';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from 'Components/containers/results-list';
import VisibilityContainer from 'Components/visibility-container';
import VisuallyHidden from 'Components/containers/visually-hidden';
import { CollectionAvatar } from 'Components/images/avatar';
import { useCollectionCurator } from 'State/collection';

import styles from './collection-result-item.styl';

const ProfileItemWithData = ({ collection }) => {
  const { value: curator } = useCollectionCurator(collection);
  return (
    <React.Fragment>
      {curator ? (<VisuallyHidden>by</VisuallyHidden>) : null}
      <ProfileItem {...curator} size="small" />
    </React.Fragment>
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
      <CollectionAvatar collection={collection} />
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
