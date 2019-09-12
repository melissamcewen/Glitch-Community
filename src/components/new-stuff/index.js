import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, CheckboxButton, Icon } from '@fogcreek/shared-components';

import { Overlay, OverlaySection, OverlayTitle, OverlayBackground } from 'Components/overlays';
import { PopoverContainer } from 'Components/popover';

import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import useUserPref from 'State/user-prefs';

import pupdates from '../../curated/pupdates.json';
import NewStuffArticle from './new-stuff-article';
import NewStuffPrompt from './new-stuff-prompt';
import NewStuffPup from './new-stuff-pup';

import styles from './styles.styl';
import { emoji } from '../global.styl';

const pupdatesArray = pupdates.pupdates;
const latestId = Math.max(...pupdatesArray.map(({ id }) => id));

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

export const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff, closePopover }) => {
  const { first, last } = usePreventTabOut();

  return (
    <Overlay className={styles.newStuffOverlay} ariaModal ariaLabelledBy="newStuff">
      <OverlaySection type="info">
        <div className={styles.newStuffAvatar}>
          <NewStuffPup />
        </div>
        <OverlayTitle id="newStuff">New Stuff</OverlayTitle>
        <div className={styles.newStuffToggle}>
          <CheckboxButton size="small" value={showNewStuff} onChange={setShowNewStuff} ref={first}>
            Keep showing me these
          </CheckboxButton>
        </div>
      </OverlaySection>
      <OverlaySection type="actions">
        {newStuff.map(({ id, ...props }) => (
          <NewStuffArticle key={id} {...props} />
        ))}
        <Button onClick={closePopover} ref={last}>
          Back to Glitch <Icon className={emoji} icon="carpStreamer" />
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
  const [log, setLog] = useState(pupdatesArray);
  const track = useTracker('pupdates');

  const renderOuter = ({ visible, openPopover }) => {
    const pupVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;
    const show = () => {
      track();
      openPopover();
      const unreadStuff = pupdatesArray.filter(({ id }) => id > newStuffReadId);
      setLog(unreadStuff.length ? unreadStuff : pupdatesArray);
      setNewStuffReadId(latestId);
    };

    return (
      <>
        {children(show)}
        {pupVisible && <NewStuffPrompt onClick={show} />}
        {visible && <OverlayBackground />}
      </>
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
