import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { Overlay, OverlaySection, OverlayTitle, OverlayBackground } from 'Components/overlays';
import CheckboxButton from 'Components/buttons/checkbox-button';
import Button from 'Components/buttons/button';
import { PopoverContainer } from 'Components/popover';

import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import useUserPref from 'State/user-prefs';

import newStuffLog from '../../curated/new-stuff-log';
import NewStuffArticle from './new-stuff-article';
import NewStuffPrompt from './new-stuff-prompt';
import NewStuffPup from './new-stuff-pup';
import styles from './styles.styl';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

function usePreventTabOut() {
  const first = useRef();
  const last = useRef();

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (document.activeElement === first.current && e.shiftKey) {
        last.current.focus();
        e.preventDefault();
      } else if (document.activeElement === last.current && !e.shiftKey) {
        first.current.focus();
        e.preventDefault();
      }
    }
  };

  useEffect(
    () => {
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    },
    [first, last],
  );

  return { first, last };
}

const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff, closePopover }) => {
  const { first, last } = usePreventTabOut();

  return (
    <Overlay className={styles.newStuffOverlay} ariaModal ariaLabelledBy="newStuff">
      <OverlaySection type="info">
        <div className={styles.newStuffAvatar}>
          <NewStuffPup />
        </div>
        <OverlayTitle id="newStuff">New Stuff</OverlayTitle>
        <div className={styles.newStuffToggle}>
          <CheckboxButton value={showNewStuff} onChange={setShowNewStuff} ref={first}>
            Keep showing me these
          </CheckboxButton>
        </div>
      </OverlaySection>
      <OverlaySection type="actions">
        {newStuff.map(({ id, ...props }) => (
          <NewStuffArticle key={id} {...props} />
        ))}
        <Button emoji="carpStreamer" onClick={closePopover} ref={last}>
          Back to Glitch
        </Button>
      </OverlaySection>
    </Overlay>
  );
};
NewStuffOverlay.propTypes = {
  setShowNewStuff: PropTypes.func.isRequired,
  showNewStuff: PropTypes.bool.isRequired,
  newStuff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      link: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

const NewStuff = ({ children }) => {
  const { currentUser } = useCurrentUser();
  const isSignedIn = !!currentUser && !!currentUser.login;
  const [showNewStuff, setShowNewStuff] = useUserPref('showNewStuff', true);
  const [newStuffReadId, setNewStuffReadId] = useUserPref('newStuffReadId', 0);
  const [log, setLog] = useState(newStuffLog);
  const track = useTracker('Pupdate');

  const renderOuter = ({ visible, openPopover }) => {
    const pupVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;
    const show = () => {
      track();
      openPopover();
      const unreadStuff = newStuffLog.filter(({ id }) => id > newStuffReadId);
      setLog(unreadStuff.length ? unreadStuff : newStuffLog);
      setNewStuffReadId(latestId);
    };

    return (
      <React.Fragment>
        {children(show)}
        {pupVisible && <NewStuffPrompt onClick={show} />}
        {visible && <OverlayBackground />}
      </React.Fragment>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible, closePopover }) =>
        visible ? <NewStuffOverlay showNewStuff={showNewStuff} setShowNewStuff={setShowNewStuff} newStuff={log} closePopover={closePopover} /> : null
      }
    </PopoverContainer>
  );
};
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NewStuff;
