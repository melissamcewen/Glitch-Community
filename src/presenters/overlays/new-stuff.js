import React from 'react';
import PropTypes from 'prop-types';

import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import NewStuffArticle from 'Components/new-stuff/new-stuff-article';
import NewStuffPrompt from 'Components/new-stuff/new-stuff-prompt';
import NewStuffPup from 'Components/new-stuff/new-stuff-pup';
import Button from 'Components/buttons/button';
import CheckboxButton from 'Components/buttons/checkbox-button';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import useUserPref from 'State/user-prefs';
import PopoverContainer from '../pop-overs/popover-container';

import newStuffLog from '../../curated/new-stuff-log';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

function usePreventTabOut() {
  const first = React.useRef();
  const last = React.useRef();

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

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [first, last]);

  return { first, last };
}

const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff, setVisible }) => {
  const { first, last } = usePreventTabOut();

  return (
    <Overlay className="new-stuff-overlay" ariaModal ariaLabelledBy="newStuff">
      <OverlaySection type="info">
        <div className="new-stuff-avatar">
          <NewStuffPup />
        </div>
        <OverlayTitle id="newStuff">New Stuff</OverlayTitle>
        <div className="new-stuff-toggle">
          <CheckboxButton value={showNewStuff} onChange={setShowNewStuff} ref={first}>
            Keep showing me these
          </CheckboxButton>
        </div>
      </OverlaySection>
      <OverlaySection type="actions">
        {newStuff.map(({ id, ...props }) => (
          <NewStuffArticle key={id} {...props} />
        ))}
        <Button emoji="carpStreamer" onClick={() => setVisible(false)} ref={last}>
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
  const [log, setLog] = React.useState(newStuffLog);
  const track = useTracker('Pupdate');

  const renderOuter = ({ visible, setVisible }) => {
    const pupVisible = isSignedIn && showNewStuff && newStuffReadId < latestId;
    const show = () => {
      track();
      setVisible(true);
      const unreadStuff = newStuffLog.filter(({ id }) => id > newStuffReadId);
      setLog(unreadStuff.length ? unreadStuff : newStuffLog);
      setNewStuffReadId(latestId);
    };

    return (
      <>
        {children(show)}
        {pupVisible && <NewStuffPrompt onClick={show} />}
        {visible && <div className="overlay-background" role="presentation" tabIndex={-1} />}
      </>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible, setVisible }) =>
        visible ? <NewStuffOverlay showNewStuff={showNewStuff} setShowNewStuff={setShowNewStuff} newStuff={log} setVisible={setVisible} /> : null
      }
    </PopoverContainer>
  );
};
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NewStuff;
