import React from 'react';
import PropTypes from 'prop-types';

import { Overlay, OverlaySection, OverlayTitle } from 'Components/overlays';
import NewStuffArticle from 'Components/new-stuff/new-stuff-article';
import NewStuffPrompt from 'Components/new-stuff/new-stuff-prompt';
import NewStuffPup from 'Components/new-stuff/new-stuff-pup';
import CheckboxButton from 'Components/buttons/checkbox-button';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import PopoverContainer from '../pop-overs/popover-container';
import useUserPref from '../includes/user-prefs';

import newStuffLog from '../../curated/new-stuff-log';

const latestId = Math.max(...newStuffLog.map(({ id }) => id));

const NewStuffOverlay = ({ setShowNewStuff, showNewStuff, newStuff }) => (
  <Overlay className="new-stuff-overlay">
    <OverlaySection type="info">
      <div className="new-stuff-avatar"><NewStuffPup /></div>
      <OverlayTitle>New Stuff</OverlayTitle>
      <div className="new-stuff-toggle">
        <CheckboxButton value={showNewStuff} onChange={setShowNewStuff}>Keep showing me these</CheckboxButton>
      </div>
    </OverlaySection>
    <OverlaySection type="actions">
      {newStuff.map(({ id, ...props }) => <NewStuffArticle key={id} {...props} />)}
    </OverlaySection>
  </Overlay>
);
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
        {visible && <div className="overlay-background" role="presentation" />}
      </>
    );
  };

  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible }) => (visible ? <NewStuffOverlay showNewStuff={showNewStuff} setShowNewStuff={setShowNewStuff} newStuff={log} /> : null)}
    </PopoverContainer>
  );
};
NewStuff.propTypes = {
  children: PropTypes.func.isRequired,
};

export default NewStuff;
