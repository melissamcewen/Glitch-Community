import React, { useState } from 'react';

import Notification from 'Components/notification';

const context = React.createContext();
const { Provider } = context;
export const NotificationConsumer = context.Consumer;
export const useNotifications = () => React.useContext(context);

export const NotificationsProvider = (props) => {
  const [notifications, setNotifications] = useState([]);

  const remove = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
  };

  const create = (content, opts = {}) => {
    const notification = {
      id: `${Date.now()}${Math.random()}`,
      content,
      ...opts,
    };

    setNotifications((prevNotifications) => [...prevNotifications, notification]);
    if (notification.persistent) {
      const updateNotification = (updatedContent) => {
        setNotifications((prevNotifications) => prevNotifications.map((n) => (n.id === notification.id ? { ...n, content: updatedContent } : n)));
      };
      const removeNotification = () => {
        remove(notification.id);
      };
      return {
        updateNotification,
        removeNotification,
      };
    }

    return notification.id;
  };

  const createError = (content = 'Something went wrong. Try refreshing?', opts = {}) => {
    create(content, { type: 'error', ...opts });
  };

  const funcs = {
    createNotification: create,
    createErrorNotification: createError,
  };

  const notificationsStyles = {
    zIndex: '11',
    top: '20px',
    right: '20px',
    position: 'fixed',
  };
  return (
    <>
      <Provider value={funcs}>{props.children}</Provider>
      {!!notifications.length && (
        <div style={notificationsStyles}>
          {notifications.map(({ id, content, ...args }) => (
            <Notification key={id} remove={() => remove(id)} {...args}>
              {content}
            </Notification>
          ))}
        </div>
      )}
    </>
  );
};
