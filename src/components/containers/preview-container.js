import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import DataLoader from 'Components/data-loader';
import { useCurrentUser } from 'State/current-user';

import styles from './preview-container.styl';

const PreviewContainer = ({ children, get, onPublish, previewMessage }) => {
  const { currentUser } = useCurrentUser();
  return (
    <DataLoader get={get}>
      {(data) => (
        <>
          <div className={styles.previewBanner}>
            <div className={styles.previewBannerMessage}>
              {previewMessage}
            </div>
            {currentUser.login ? (
              <Button variant="cta" onClick={() => onPublish(data)}>
                Publish
              </Button>
            ) : (
              <Button as="span" variant="cta" disabled>
                Log in to publish
              </Button>
            )}
          </div>
          {children(data)}
        </>
      )}
    </DataLoader>
  );
};

PreviewContainer.propTypes = {
  get: PropTypes.func.isRequired,
  onPublish: PropTypes.func.isRequired,
  previewMessage: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
};

export default PreviewContainer;
