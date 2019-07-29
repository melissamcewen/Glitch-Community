import React from 'react';
import PropTypes from 'prop-types';

import DataLoader from 'Components/data-loader';
import Button from 'Components/buttons/button';
import { useCurrentUser } from 'State/current-user';

import styles from './preview-container.styl';

const PreviewContainer = ({ children, get, onPublish, previewMessage }) => {
  const { currentUser } = useCurrentUser();
  return (
    <DataLoader get={get}>
      {(data) => (
        <React.Fragment>
          <div className={styles.previewBanner}>
            <div className={styles.previewBannerMessage}>
              {previewMessage}
            </div>
            {currentUser.login ? (
              <Button type="cta" onClick={() => onPublish(data)}>
                Publish
              </Button>
            ) : (
              <Button type="cta" decorative disabled>
                Log in to publish
              </Button>
            )}
          </div>
          {children(data)}
        </React.Fragment>
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
