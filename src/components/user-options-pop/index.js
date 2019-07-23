import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';

import { getLink as getTeamLink, getAvatarUrl as getTeamAvatarUrl } from 'Models/team';
import { getAvatarThumbnailUrl as getUserAvatarUrl } from 'Models/user';
import Image from 'Components/images/image';
import { UserAvatar } from 'Components/images/avatar';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import Button from 'Components/buttons/button';
import CheckboxButton from 'Components/buttons/checkbox-button';
import { MultiPopover, PopoverContainer, PopoverActions, PopoverInfo, PopoverDialog, PopoverTitle, InfoDescription } from 'Components/popover';
import CreateTeamPop from 'Components/create-team-pop';
import { useTrackedFunc, useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';

import styles from './styles.styl';

// Create Team button

const CreateTeamButton = ({ showCreateTeam }) => {
  const onClickCreateTeam = useTrackedFunc(showCreateTeam, 'Create Team clicked');
  return (
    <Button size="small" onClick={onClickCreateTeam} emoji="herb">
      Create Team
    </Button>
  );
};

CreateTeamButton.propTypes = {
  showCreateTeam: PropTypes.func.isRequired,
};

// Team List

const TeamList = ({ teams, showCreateTeam }) => {
  const orderedTeams = orderBy(teams, (team) => team.name.toLowerCase());

  return (
    <PopoverActions>
      {orderedTeams.map((team) => (
        <div className={styles.buttonWrap} key={team.id}>
          <Button
            href={getTeamLink(team)}
            size="small"
            type="tertiary"
            image={<Image className={styles.teamAvatar} src={getTeamAvatarUrl({ ...team, size: 'small' })} alt="" width={16} height={16} />}
          >
            {team.name}
          </Button>
        </div>
      ))}
      <CreateTeamButton showCreateTeam={showCreateTeam} />
    </PopoverActions>
  );
};

TeamList.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      hasAvatarImage: PropTypes.bool.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showCreateTeam: PropTypes.func.isRequired,
};

// User Options 🧕

const UserOptionsPop = ({ togglePopover, showCreateTeam, user, signOut, showAccountSettingsOverlay, showNewStuffOverlay, superUserHelpers }) => {
  const { superUserFeature, canBecomeSuperUser, toggleSuperUser } = superUserHelpers;

  const trackLogout = useTracker('Logout');

  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
    event.stopPropagation();
  };

  const clickAccountSettings = (event) => {
    togglePopover();
    showAccountSettingsOverlay();
    event.stopPropagation();
  };

  const clickSignout = () => {
    if (!user.login) {
      if (
        // eslint-disable-next-line
        !window.confirm(`You won't be able to sign back in under this same anonymous account.
Are you sure you want to sign out?`)
      ) {
        return;
      }
    }
    togglePopover();
    trackLogout();
    window.analytics.reset();
    signOut();
  };

  const userPasswordEnabled = useDevToggle('User Passwords');

  return (
    <PopoverDialog className={styles.userOptionsPop} align="right">
      <PopoverTitle>
        <UserLink user={user}>
          <div className={styles.userAvatarContainer} style={{ backgroundColor: user.color }}>
            <Image src={getUserAvatarUrl(user)} alt="Your avatar" />
          </div>
          <div className={styles.userInfo}>
            <InfoDescription>{user.name || 'Anonymous'}</InfoDescription>
            {user.login && (
              <div className={styles.userLogin}>
                <InfoDescription>@{user.login}</InfoDescription>
              </div>
            )}
          </div>
        </UserLink>
      </PopoverTitle>

      <TeamList teams={user.teams} showCreateTeam={showCreateTeam} userIsAnon={!user.login} />

      <PopoverInfo>
        {(canBecomeSuperUser || !!superUserFeature) && (
          <div>
            <CheckboxButton value={!!superUserFeature} onChange={toggleSuperUser} type="tertiary" matchBackground>
              Super User
            </CheckboxButton>
          </div>
        )}
        <div className={styles.buttonWrap}>
          <Button type="tertiary" size="small" emoji="dogFace" onClick={clickNewStuff}>
            New Stuff
          </Button>
        </div>
        <div className={styles.buttonWrap}>
          <Button type="tertiary" size="small" emoji="ambulance" href="https://support.glitch.com">
            Support
          </Button>
        </div>
        {userPasswordEnabled && (
          <div className={styles.buttonWrap}>
            <Button size="small" type="tertiary" emoji="key" onClick={clickAccountSettings}>
              Account Settings
            </Button>
          </div>
        )}
        <Button type="tertiary" size="small" emoji="balloon" onClick={clickSignout}>
          Sign Out
        </Button>
      </PopoverInfo>
    </PopoverDialog>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  showCreateTeam: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  showAccountSettingsOverlay: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

function CheckForCreateTeamHash(props) {
  return props.children(window.location.hash === '#create-team');
}

// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer(props) {
  const avatarStyle = { backgroundColor: props.user.color };
  const buttonRef = useRef();

  return (
    <CheckForCreateTeamHash>
      {(createTeamOpen) => (
        <PopoverContainer startOpen={createTeamOpen} triggerButtonRef={buttonRef}>
          {({ togglePopover, visible }) => {
            const userOptionsButton = (
              <Button type="dropDown" onClick={togglePopover} disabled={!props.user.id} ref={buttonRef}>
                <span className={styles.userOptionsWrap}>
                  <span className={styles.userOptionsButtonAvatar}>
                    <UserAvatar user={props.user} withinButton style={avatarStyle} />
                  </span>
                  <span className="down-arrow icon" />
                </span>
              </Button>
            );

            return (
              <TooltipContainer target={userOptionsButton} tooltip="User options" type="action" align={['right']}>
                {visible && (
                  <MultiPopover
                    views={{
                      createTeam: () => <CreateTeamPop />,
                    }}
                  >
                    {({ createTeam }) => <UserOptionsPop {...props} togglePopover={togglePopover} showCreateTeam={createTeam} />}
                  </MultiPopover>
                )}
              </TooltipContainer>
            );
          }}
        </PopoverContainer>
      )}
    </CheckForCreateTeamHash>
  );
}

UserOptionsAndCreateTeamPopContainer.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    teams: PropTypes.array.isRequired,
  }).isRequired,
};
