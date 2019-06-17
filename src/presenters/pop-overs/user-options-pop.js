import React from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';

import { getAvatarThumbnailUrl as getUserAvatarUrl } from 'Models/user';
import { getLink as getTeamLink, getAvatarUrl as getTeamAvatarUrl } from 'Models/team';
import Image from 'Components/images/image';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import Button from 'Components/buttons/button';
import CheckboxButton from 'Components/buttons/checkbox-button';
import { useTrackedFunc, useTracker } from 'State/segment-analytics';

import PopoverContainer from './popover-container';
import { NestedPopover } from './popover-nested';
import CreateTeamPop from './create-team-pop';

// Create Team button

const CreateTeamButton = ({ showCreateTeam, userIsAnon }) => {
  const onClickCreateTeam = useTrackedFunc(showCreateTeam, 'Create Team clicked');
  if (userIsAnon) {
    return (
      <>
        <p className="description action-description">
          <button onClick={showCreateTeam} className="button-unstyled link" type="button">
            Sign in
          </button>{' '}
          to create teams
        </p>
        <Button size="small" emoji="herb" disabled>
          Create Team
        </Button>
      </>
    );
  }
  return (
    <Button size="small" onClick={onClickCreateTeam} emoji="herb">
      Create Team
    </Button>
  );
};

CreateTeamButton.propTypes = {
  showCreateTeam: PropTypes.func.isRequired,
  userIsAnon: PropTypes.bool.isRequired,
};

// Team List

const TeamList = ({ teams, showCreateTeam, userIsAnon }) => {
  const orderedTeams = orderBy(teams, (team) => team.name.toLowerCase());

  return (
    <section className="pop-over-actions">
      {orderedTeams.map((team) => (
        <div className="button-wrap" key={team.id}>
          <Button
            key={team.id}
            href={getTeamLink(team)}
            type="tertiary"
            size="small"
            image={
              <div style={{ width: '16px', height: '16px', borderRadius: '3px', overflow: 'hidden' }}>
                <Image alt="" src={getTeamAvatarUrl({ ...team, size: 'small' })} style={{ borderRadius: '3px' }} width={16} height={16} />
              </div>
            }
          >
            {team.name}
          </Button>
        </div>
      ))}
      <CreateTeamButton showCreateTeam={showCreateTeam} userIsAnon={userIsAnon} />
    </section>
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
  userIsAnon: PropTypes.bool.isRequired,
};

// User Options 🧕

const UserOptionsPop = ({ togglePopover, showCreateTeam, user, signOut, showNewStuffOverlay, focusFirstElement, superUserHelpers }) => {
  const { superUserFeature, canBecomeSuperUser, toggleSuperUser } = superUserHelpers;

  const trackLogout = useTracker('Logout');

  const clickNewStuff = (event) => {
    togglePopover();
    showNewStuffOverlay();
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

  const userName = user.name || 'Anonymous';
  const userAvatarStyle = { backgroundColor: user.color };

  return (
    <dialog className="pop-over user-options-pop" ref={focusFirstElement}>
      <UserLink user={user} className="user-info">
        <section className="pop-over-actions user-info">
          <img className="avatar" src={getUserAvatarUrl(user)} alt="Your avatar" style={userAvatarStyle} />
          <div className="info-container">
            <p className="name" title={userName}>
              {userName}
            </p>
            {user.login && (
              <p className="user-login" title={user.login}>
                @{user.login}
              </p>
            )}
          </div>
        </section>
      </UserLink>
      <TeamList teams={user.teams} showCreateTeam={showCreateTeam} userIsAnon={!user.login} />
      <section className="pop-over-info">
        {(canBecomeSuperUser || !!superUserFeature) && (
          <div className="user-options-pop-checkbox">
            <CheckboxButton value={!!superUserFeature} onChange={toggleSuperUser} type="tertiary" matchBackground>
              Super User
            </CheckboxButton>
          </div>
        )}
        <Button size="small" type="tertiary" emoji="dogFace" onClick={clickNewStuff}>
          New Stuff
        </Button>
        <div className="button-wrap">
          <Button size="small" type="tertiary" emoji="ambulance" href="https://support.glitch.com">
            Support
          </Button>
        </div>
        <Button size="small" type="tertiary" emoji="balloon" onClick={clickSignout}>
          Sign Out
        </Button>
      </section>
    </dialog>
  );
};

UserOptionsPop.propTypes = {
  togglePopover: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
  showCreateTeam: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

function CheckForCreateTeamHash(props) {
  return props.children(window.location.hash === '#create-team');
}

// Header button and init pop

export default function UserOptionsAndCreateTeamPopContainer(props) {
  const avatarUrl = getUserAvatarUrl(props.user);
  const avatarStyle = { backgroundColor: props.user.color };
  return (
    <CheckForCreateTeamHash>
      {(createTeamOpen) => (
        <PopoverContainer startOpen={createTeamOpen}>
          {({ togglePopover, visible, focusFirstElement }) => {
            const userOptionsButton = (
              <button className="user" onClick={togglePopover} disabled={!props.user.id} type="button">
                <img className="user-avatar" src={avatarUrl} style={avatarStyle} width="30px" height="30px" alt="User options" />
                <div className="user-options-dropdown-wrap">
                  <span className="down-arrow icon" />
                </div>
              </button>
            );

            return (
              <TooltipContainer
                className="button user-options-pop-button"
                target={userOptionsButton}
                tooltip="User options"
                id="user-options-tooltip"
                type="action"
                align={['right']}
              >
                {visible && (
                  <NestedPopover
                    alternateContent={() => <CreateTeamPop {...props} {...{ focusFirstElement }} />}
                    startAlternateVisible={createTeamOpen}
                  >
                    {(showCreateTeam) => <UserOptionsPop {...props} {...{ togglePopover, showCreateTeam, focusFirstElement }} />}
                  </NestedPopover>
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
