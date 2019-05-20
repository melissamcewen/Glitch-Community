import React, { createContext, useContext, useState, useMemo } from 'react';
import { uniqueId } from 'lodash';

const Context = createContext();
export const useNotifications = () => useContext(Context);

export const notificationTypes = ['info', 'warning', 'error', 'success'];

const create = ({ content, type, persistent = false }) => ({
  id: uniqueId('notification-'),
  type,
  content,
  persistent,
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
      createPersistentNotification: (content, type = 'info') => addNotification(create({ content, type, persistent: true })),
      removeNotification,
    };
  }, []);

  const context = useMemo(() => ({ notifications, ...funcs }), notifications);

  return <Context.Provider value={context}>{children}</Context.Provider>;
}

function handleError(notify, error) {
  console.error(error);
  notify();
  return Promise.reject(error);
}

function handleErrorForInput(notify, error) {
  if (error && error.response && error.response.data) {
    return Promise.reject(error.response.data.message);
  }
  console.error(error);
  notify();
  return Promise.reject();
}

function handleCustomError(notify, error) {
  console.error(error);
  if (error && error.response && error.response.data) {
    notify(error.response.data.message, 'notifyError');
  }
  return Promise.reject(error);
}

export const useErrorHandlers = () => {
  const { createNotification, createErrorNotification } = useNotifications();
  return {
    handleError: (error) => handleError(createErrorNotification, error),
    handleErrorForInput: (error) => handleErrorForInput(createErrorNotification, error),
    handleCustomError: (error) => handleCustomError(createNotification, error),
  };
};

export default NotificationsProvider;
