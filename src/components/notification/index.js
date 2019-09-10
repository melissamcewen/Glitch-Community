import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LiveMessage } from 'react-aria-live';
import { Button } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import classNames from 'classnames/bind';
import styles from './styles.styl';

const cx = classNames.bind(styles);

const Notification = ({ children, type, persistent, inline, remove }) => {
  const el = useRef(null);
  const [message, setMessage] = useState('');

  useEffect(
    () => {
      if (el.current.children && el.current.children.length) {
        const textNodes = [...el.current.children].filter((child) => ['p', 'P'].includes(child.tagName));
        const messageStr = textNodes.reduce((str, node) => str + node.innerText, '');
        if (messageStr.length) {
          setMessage(`${type}: ${messageStr}`);
        }
      } else if (el.current.innerText.length) {
        setMessage(`${type}: ${el.current.innerText}`);
      }
    },
    [el.current],
  );

  const className = cx({
    notification: true,
    success: type === 'success',
    error: type === 'error',
    persistent,
    inline,
  });

  return (
    <>
      <LiveMessage aria-live="polite" message={message} />
      <aside ref={el} className={className} onAnimationEnd={remove}>
        {children}
      </aside>
    </>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'error']),
  persistent: PropTypes.bool,
  inline: PropTypes.bool,
};

Notification.defaultProps = {
  type: 'info',
  persistent: false,
  inline: false,
};

export const AddProjectToCollectionMsg = ({ projectDomain, collectionName, url }) => (
  <>
    <Text>
      {`Added ${projectDomain} `}
      {collectionName && `to collection ${collectionName}`}
    </Text>
    {url && (
      <Button as="a" href={url} rel="noopener noreferrer" size="small" variant="secondary">
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

export default Notification;
