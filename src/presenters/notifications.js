import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { uniqueId } from 'lodash';

import AnimationContainer from 'Components/animation-container';
import Text from 'Components/text/text';

const styles = {};

const Context = React.createContext();
export const useNotifications = () => React.useContext(Context);

const notificationTypes = ['info', 'warning', 'error', 'success'];

const create = ({ content, type, custom = false }) => ({
  id: uniqueId('notification-'),
  type,
  content,
  custom,
});

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const funcs = useMemo(() => {
    const addNotification = (notification) => setNotifications((oldNotifications) => [...oldNotifications, notification]);
    const removeNotification = ({ id }) => {
      setNotifications((oldNotifications) => oldNotifications.filter((n) => n.id !== id));
    };
    return {
      createNotification: (content, type = 'info') => addNotification(create({ content, type })),
      createErrorNotification: (content = 'Something went wrong. Try refreshing?') => addNotification(create({ content, type: 'error' })),
      createCustomNotification: (content, type = 'info') => addNotification(create({ content, type, custom: true })),
      removeNotification,
    };
  }, []);

  const context = useMemo(() => ({ notifications, ...funcs }), notifications);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

const NOTIFICATION_TIMEOUT = 5000;

const Notification = ({ notification, onRemove }) => {
  useEffect(() => {
    const timeout = setTimeout(onRemove, NOTIFICATION_TIMEOUT);
    return () => {
      clearTimeout(timeout);
    };
  }, [notification.id]);
  return (
    <TransparentButton onClick={onRemove}>
      <div className={classnames(styles.notification, styles[notification.type])}>{notification.content}</div>}
    </TransparentButton>
  );
};

const NotificationsContainer = () => {
  const { notifications, removeNotification } = useNotifications();
  return (
    <ul className={styles.notificationContainer}>
      {notifications.map((notification) => notification.custom ? (
        <li key={notification.id}>
          <div className={classnames(styles.notification, styles[notification.type])}>
            {notification.content({ remove: () => removeNotification(notification) })}
          </div>}
        </li>
      ) : (
        <li key={notification.id}>
          <AnimationContainer type="slideDown" onAnimationEnd={() => removeNotification(notification)}>
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

