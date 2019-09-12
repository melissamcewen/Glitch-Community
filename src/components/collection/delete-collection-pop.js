import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Loader } from '@fogcreek/shared-components';

import { getCollectionOwnerLink, getCollectionLink } from 'Models/collection';
import Image from 'Components/images/image';
import { PopoverDialog, PopoverActions, PopoverTitle, ActionDescription, PopoverMenuButton } from 'Components/popover';
import { useCollectionEditor } from 'State/collection';
import { useNotifications } from 'State/notifications';

const DeleteCollectionPop = withRouter(({ location, history, collection, animateAndDeleteCollection }) => {
  const [coll, baseFuncs] = useCollectionEditor(collection);
  const { createNotification } = useNotifications();
  const [collectionIsDeleting, setCollectionIsDeleting] = useState(false);
  const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

  async function deleteThisCollection() {
    if (collectionIsDeleting) return;
    setCollectionIsDeleting(true);
    try {
      if (location.pathname === getCollectionLink(coll)) {
        baseFuncs.deleteCollection();
        history.push(getCollectionOwnerLink(collection));
      } else {
        animateAndDeleteCollection(collection.id);
      }
    } catch (error) {
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
      setCollectionIsDeleting(false);
    }
  }

  return (
    <PopoverDialog focusOnDialog align="left">
      <PopoverTitle>Delete {collection.name}</PopoverTitle>
      <PopoverActions>
        <Image height="98px" width="auto" src={illustration} alt="" />
        <ActionDescription>
          Deleting {collection.name} will remove this collection. No projects will be deleted.
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <PopoverMenuButton size="small" label={`Delete ${collection.name}`} type="dangerZone" emoji="bomb" onClick={deleteThisCollection}>
          {collectionIsDeleting && <Loader style={{ width: '25px' }} />}
        </PopoverMenuButton>
      </PopoverActions>
    </PopoverDialog>
  );
});

const DeleteCollection = ({ collection, deleteCollection }) => (
  <DeleteCollectionPop collection={collection} animateAndDeleteCollection={deleteCollection} />
);

DeleteCollection.propTypes = {
  collection: PropTypes.shape({
    team: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default DeleteCollection;
