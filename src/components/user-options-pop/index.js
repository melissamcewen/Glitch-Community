import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import { Button, CheckboxButton, Icon, UnstyledButton } from '@fogcreek/shared-components';

import { getTeamLink } from 'Models/team';
import { getUserAvatarThumbnailUrl } from 'Models/user';
import Image from 'Components/images/image';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import { MultiPopover, PopoverContainer, PopoverActions, PopoverInfo, PopoverDialog, PopoverTitle, InfoDescription } from 'Components/popover';
import CreateTeamPop from 'Components/create-team-pop';
import { useGlobals } from 'State/globals';
import { useCurrentUser, useSuperUserHelpers } from 'State/current-user';
import { useTrackedFunc, useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';

import styles from './styles.styl';
import { emoji } from '../global.styl';

// Create Team button

const CreateTeamButton = ({ showCreateTeam }) => {
  const onClickCreateTeam = useTrackedFunc(showCreateTeam, 'Create Team clicked');
  return (
    <Button size="small" onClick={onClickCreateTeam}>
      Create Team <Icon className={emoji} icon="herb" />
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
            as="a"
            href={getTeamLink(team)}
            size="small"
            variant="secondary"
          >
            {team.name} <TeamAvatar team={team} size="small" className={emoji} tiny hideTooltip />
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

const UserOptionsPop = ({ togglePopover, showCreateTeam, showAccountSettingsOverlay, showNewStuffOverlay }) => {
  const { currentUser: user, clear: signOut } = useCurrentUser();
  const { superUserFeature, canBecomeSuperUser, toggleSuperUser } = useSuperUserHelpers();

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
            <Image src={getUserAvatarThumbnailUrl(user)} alt="Your avatar" />
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
          <div className={styles.buttonWrap}>
            <CheckboxButton size="small" value={!!superUserFeature} onChange={toggleSuperUser} variant="secondary">
              Super User
            </CheckboxButton>
          </div>
        )}
        <div className={styles.buttonWrap}>
          <Button variant="secondary" size="small" onClick={clickNewStuff}>
            New Stuff <Icon className={emoji} icon="dogFace" />
          </Button>
        </div>
        <div className={styles.buttonWrap}>
          <Button as="a" variant="secondary" size="small" href="https://support.glitch.com">
            Support <Icon className={emoji} icon="ambulance" />
          </Button>
        </div>
        {userPasswordEnabled && (
          <div className={styles.buttonWrap}>
            <Button size="small" variant="secondary" onClick={clickAccountSettings}>
              Account Settings <Icon className={emoji} icon="key" />
            </Button>
          </div>
        )}
        <Button variant="secondary" size="small" onClick={clickSignout}>
          Sign Out <Icon className={emoji} icon="balloon" />
        </Button>
      </PopoverInfo>
    </PopoverDialog>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  showCreateTeam: PropTypes.func.isRequired,
  showAccountSettingsOverlay: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

function CheckForCreateTeamHash(props) {
  const { location } = useGlobals();
  return props.children(location.hash === '#create-team');
}

// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer({ showAccountSettingsOverlay, showNewStuffOverlay }) {
  const { currentUser: user } = useCurrentUser();
  const avatarStyle = { backgroundColor: user.color };
  const buttonRef = useRef();

  return (
    <CheckForCreateTeamHash>
      {(createTeamOpen) => (
        <PopoverContainer startOpen={createTeamOpen} triggerButtonRef={buttonRef}>
          {({ togglePopover, visible }) => {
            const userOptionsButton = (
              <UnstyledButton type="dropDown" onClick={togglePopover} decorative={!user.id} ref={buttonRef}>
                <span className={styles.userOptionsWrap}>
                  <span className={styles.userOptionsButtonAvatar}>
                    <UserAvatar user={user} hideTooltip withinButton style={avatarStyle} />
                  </span>
                  <span className="down-arrow icon" />
                </span>
              </UnstyledButton>
            );

            return (
              <TooltipContainer target={userOptionsButton} tooltip="User options" type="action" align={['right']}>
                {visible && (
                  <MultiPopover
                    views={{
                      createTeam: () => <CreateTeamPop />,
                    }}
                  >
                    {({ createTeam }) => (
                      <UserOptionsPop
                        showAccountSettingsOverlay={showAccountSettingsOverlay}
                        showNewStuffOverlay={showNewStuffOverlay}
                        togglePopover={togglePopover}
                        showCreateTeam={createTeam}
                      />
                    )}
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
