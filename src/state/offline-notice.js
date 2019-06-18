import React, { useEffect, useState } from 'react';

import { useNotifications } from 'State/notifications';

const PersistentNotification = ({ children }) => {
  const { createNotification } = useNotifications();

  useEffect(
    () => {
      const { removeNotification } = createNotification(children, { type: 'error', persistent: true });
      return removeNotification;
    },
    [children],
  );

  return null;
};

const OfflineNotice = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onNetwork = () => setOnline(navigator.onLine);
    window.addEventListener('offline', onNetwork);
    window.addEventListener('online', onNetwork);
    return () => {
      window.removeEventListener('offline', onNetwork);
      window.removeEventListener('online', onNetwork);
    };
  }, []);

  if (!online) {
    return <PersistentNotification>It looks like you're offline</PersistentNotification>;
  }
  return null;
};

export default OfflineNotice;
