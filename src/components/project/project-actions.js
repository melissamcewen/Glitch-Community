import React from 'react';
import PropTypes from 'prop-types';

import Button, { SIZES } from 'Components/buttons/button';
import { PopoverWithButton } from 'Components/popover';
import { getShowUrl, getEditorUrl, getRemixUrl } from '../../models/project';

import LeaveProjectPopover from './leave-project-pop';

export const ShowButton = ({ name, size }) => (
  <Button href={getShowUrl(name)} size={size} emoji="sunglasses" emojiPosition="left">
    Show
  </Button>
);

ShowButton.propTypes = {
  name: PropTypes.string.isRequired,
};

export const EditButton = ({ name, isMember, size }) => (
  <Button href={getEditorUrl(name)} size={size}>
    {isMember ? 'Edit Project' : 'View Source'}
  </Button>
);
EditButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
  size: PropTypes.oneOf(SIZES),
};

EditButton.defaultProps = {
  isMember: false,
  size: null,
};

export const RemixButton = ({ name, isMember }) => (
  <Button href={getRemixUrl(name)} size="small" emoji="microphone">
    {isMember ? 'Remix This' : 'Remix your own'}
  </Button>
);
RemixButton.propTypes = {
  name: PropTypes.string.isRequired,
  isMember: PropTypes.bool,
};

RemixButton.defaultProps = {
  isMember: false,
};

export const MembershipButton = ({ project, isMember, isTeamProject, leaveProject, joinProject }) => {
  if (!isMember) {
    return isTeamProject ? (
      <Button size="small" onClick={joinProject} emoji="rainbow">
        Join Project
      </Button>
    ) : null;
  }

  // let team members leave directly, warn non team members
  if (isTeamProject) return <Button size="small" onClick={() => leaveProject(project)} emoji="wave">Leave Project</Button>;
  return (
    <PopoverWithButton buttonProps={{ emoji: 'wave', size: 'small' }} buttonText="Leave Project">
      {({ togglePopover }) => <LeaveProjectPopover project={project} leaveProject={leaveProject} togglePopover={togglePopover} align="left" />}
    </PopoverWithButton>
  );
};

MembershipButton.propTypes = {
  isMember: PropTypes.bool,
  isTeamProject: PropTypes.bool,
  leaveProject: PropTypes.func,
  joinProject: PropTypes.func,
};

MembershipButton.defaultProps = {
  leaveProject: null,
  joinProject: null,
  isMember: false,
  isTeamProject: false,
};
