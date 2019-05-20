import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { uniqueId } from 'lodash';

import AnimationContainer from 'Components/animation-container';
import Text from 'Components/text/text';
import { useNotifications } from 'State/notifications'; 

const styles = {};

const NOTIFICATION_TIMEOUT = 2500;

const Notification = ({ notification, onRemove }) => {
  useEffect(() => {
    if (notification.persistent) return;
    const timeout = setTimeout(onRemove, NOTIFICATION_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const children = typeof notification.content === 'function' ? notification.content({ onRemove }) : notification.content;

  return <div className={classnames(styles.notification, styles[notification.type])}>{children}</div>;
};

const NotificationsContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  return (
    <ul className={styles.container}>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <AnimationContainer type="fadeOut" onAnimationEnd={() => removeNotification(notification)}>
            {(animateOutAndRemove) => <Notification notification={notification} onRemove={animateOutAndRemove} />}
          </AnimationContainer>
        </li>
      ))}
    </ul>
  );
};

export const AddProjectToCollectionMsg = ({ projectDomain, collectionName, url }) => (
  <>
    <Text>
      {`Added ${projectDomain} `}
      {collectionName && `to collection ${collectionName}`}
    </Text>
    {url && (
      <a href={url} rel="noopener noreferrer" className="button button-small button-tertiary button-in-notification-container notify-collection-link">
        Take me there
      </a>
    )}
  </>
);

AddProjectToCollectionMsg.propTypes = {
  projectDomain: PropTypes.string.isRequired,
  collectionName: PropTypes.string,
  url: PropTypes.string,
};

AddProjectToCollectionMsg.defaultProps = {
  url: null,
  collectionName: null,
};

export default NotificationsContainer;