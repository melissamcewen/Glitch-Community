import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import AnimationContainer from 'Components/animation-container';
import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import { useNotifications } from 'State/notifications';
import styles from './styles.styl';

const NOTIFICATION_TIMEOUT = 2500;

const NotificationWrapper = ({ onRemove, persistent }) => {
  useEffect(() => {
    if (persistent) return undefined;
    const timeout = setTimeout(onRemove, NOTIFICATION_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
};

const NotificationsContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  return (
    <ul className={styles.container}>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <AnimationContainer type="fadeOut" onAnimationEnd={() => removeNotification(notification)}>
            {(animateOutAndRemove) => <NotificationWrapper notification={notification} onRemove={animateOutAndRemove}>
              {notification.content}
            </NotificationWrapper>}
          </AnimationContainer>
        </li>
      ))}
    </ul>
  );
};

export const Notification = ({ children, type }) => (
  <div className={classnames(styles.notification, styles[type])}>{children}</div>
)

Notification.propTypes = ({
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
})

Notification.defaultProps = ({
  type: 'info',
})


export const AddProjectToCollectionMsg = ({ projectDomain, collectionName, url }) => (
  <Notification type="success">
    <Text>
      {`Added ${projectDomain} `}
      {collectionName && `to collection ${collectionName}`}
    </Text>
    {url && (
      <Button href={url} type="tertiary" size="small" matchBackground>
        Take me there
      </Button>
    )}
  </Notification>
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
