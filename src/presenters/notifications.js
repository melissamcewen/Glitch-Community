import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';

import Text from 'Components/text/text';

const context = React.createContext();
const { Provider } = context;
export const NotificationConsumer = context.Consumer;
export const useNotifications = () => React.useContext(context);

const Notification = ({ children, className, remove }) => (
  <aside className={`notification ${className}`} onAnimationEnd={remove}>
    {children}
  </aside>
);

function

function reducer (state, action) {
  switch
}


function NotificationsController() {
  const [notifications, setNotifications] = useState([]);
  const context = useMemo(() => {
    function create(content, className = '') {
      const notification = {
        id: uniqueId('notification-'),
        className,
        content,
      };
      setNotifications((oldNotifications) => [...oldNotifications, notification]);
      return notification.id;
    }
    function remove(id) {
      setNotifications((oldNotifications) => oldNotifications.filter((n) => n.id !== id));
    }
    function createError(content = 'Something went wrong. Try refreshing?') {
      return create(content, 'notifyError');
    }
    function createPersistent(content, className = '') {
      const id = create(content, `notifyPersistent ${className}`);
      const updateNotification = (updatedContent) => {
        setNotifications((oldNotifications) => oldNotifications.map((n) => (n.id === id ? { ...n, updatedContent } : n)));
      };
      const removeNotification = () => {
        remove(id);
      };
      return { updateNotification, removeNotification };
    }
  }, []);
}

export class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  create(content, className = '') {
    const notification = {
      id: `${Date.now()}{Math.random()}`,
      className,
      content,
    };
    this.setState(({ notifications }) => ({
      notifications: [...notifications, notification],
    }));
    return notification.id;
  }

  createError(content = 'Something went wrong. Try refreshing?') {
    this.create(content, 'notifyError');
  }

  createPersistent(content, className = '') {
    const id = this.create(content, `notifyPersistent ${className}`);
    const updateNotification = (updatedContent) => {
      this.setState(({ notifications }) => ({
        notifications: notifications.map((n) => (n.id === id ? { ...n, updatedContent } : n)),
      }));
    };
    const removeNotification = () => {
      this.remove(id);
    };
    return {
      updateNotification,
      removeNotification,
    };
  }

  remove(id) {
    this.setState(({ notifications }) => ({
      notifications: notifications.filter((n) => n.id !== id),
    }));
  }

  render() {
    const funcs = {
      createNotification: this.create.bind(this),
      createPersistentNotification: this.createPersistent.bind(this),
      createErrorNotification: this.createError.bind(this),
    };
    const { notifications } = this.state;
    return (
      <>
        <Provider value={funcs}>{this.props.children}</Provider>
        {!!notifications.length && (
          <div className="notifications">
            {notifications.map(({ id, className, content }) => (
              <Notification key={id} className={className} remove={this.remove.bind(this, id)}>
                {content}
              </Notification>
            ))}
          </div>
        )}
      </>
    );
  }
}

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
