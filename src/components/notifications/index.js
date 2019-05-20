import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import AnimationContainer from 'Components/animation-container';
import Text from 'Components/text/text';
import { useNotifications } from 'State/notifications';
import styles from './styles.styl';

const NOTIFICATION_TIMEOUT = 2500;

const Notification = ({ notification, onRemove }) => {
  useEffect(() => {
    if (notification.persistent) return undefined;
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
      <Button to={url} type="tertiary" size="small" matchBackground>
        Take me there
      </Button>
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
