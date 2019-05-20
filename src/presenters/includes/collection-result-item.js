import React from 'react';
import PropTypes from 'prop-types';

import { getLink as getCollectionLink } from 'Models/collection';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import Markdown from 'Components/text/markdown';
import { AddProjectToCollectionMsg } from 'Components/notifications';
import { useNotifications } from 'State/notifications';
import CollectionAvatar from './collection-avatar';

const CollectionResultItem = ({ onClick, project, collection, isActive, togglePopover }) => {
  const { createNotification } = useNotifications();
  let resultClass = 'button-unstyled result result-collection';
  if (isActive) {
    resultClass += ' active';
  }

  const collectionPath = getCollectionLink(collection);

  return (
    <div>
      <button
        className={resultClass}
        onClick={() => {
          // add project to collection
          onClick(project, collection).then(() => {
            // show notification
            const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={collectionPath} />;
            createNotification(content, 'success');
          });

          togglePopover();
        }}
        data-project-id={project.id}
      >
        <div className="avatar" id={`avatar-collection-${collection.id}`}>
          <CollectionAvatar color={collection.coverColor} />
        </div>
        <div className="results-info">
          <div className="result-name" title={collection.name}>
            {collection.name}
          </div>
          {collection.description.length > 0 && (
            <div className="result-description">
              <Markdown renderAsPlaintext>{collection.description}</Markdown>
            </div>
          )}
          {collection.team && <TeamAvatar team={collection.team} />}
          {collection.user && <UserAvatar user={collection.user} />}
        </div>
      </button>
      <a href={collectionPath} className="view-result-link button button-small button-link" target="_blank" rel="noopener noreferrer">
        View →
      </a>
    </div>
  );
};

CollectionResultItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
};

CollectionResultItem.defaultProps = {
  isActive: false,
};

export default CollectionResultItem;
