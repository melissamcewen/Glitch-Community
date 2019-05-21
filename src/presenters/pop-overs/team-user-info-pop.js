import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { userIsTeamAdmin, userIsOnlyTeamAdmin } from 'Models/team';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink } from 'Components/link';
import { UserAvatar } from 'Components/images/avatar';
import Thanks from 'Components/thanks';
import { useTrackedFunc } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import { NestedPopover } from './popover-nested';
import { useNotifications } from '../notifications';
import TeamUserRemovePop from './team-user-remove-pop';
import PopoverWithButton from './popover-with-button';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return ' (admin)';
  }
  return '';
};

// Remove from Team 👋

const RemoveFromTeam = ({ onClick }) => {
  const onClickTracked = useTrackedFunc(onClick, 'Remove from Team clicked');
  return (
    <section className="pop-over-actions danger-zone">
      <button className="button-small has-emoji button-tertiary button-on-secondary-background" onClick={onClickTracked}>
        Remove from Team <span className="emoji wave" role="img" aria-label="" />
      </button>
    </section>
  );
};

// Admin Actions Section ⏫⏬

const AdminActions = ({ user, team, updateUserPermissions }) => {
  const onClickRemoveAdmin = useTrackedFunc(() => updateUserPermissions(user.id, MEMBER_ACCESS_LEVEL), 'Remove Admin Status clicked');
  const onClickMakeAdmin = useTrackedFunc(() => updateUserPermissions(user.id, ADMIN_ACCESS_LEVEL), 'Make an Admin clicked');
  if (userIsOnlyTeamAdmin({ user, team })) return null;

  return (
    <section className="pop-over-actions admin-actions">
      <p className="action-description">Admins can update team info, billing, and remove users</p>
      {userIsTeamAdmin({ user, team }) ? (
        <button className="button-small button-tertiary has-emoji" onClick={onClickRemoveAdmin}>
          Remove Admin Status <span className="emoji fast-down" />
        </button>
      ) : (
        <button className="button-small button-tertiary has-emoji" onClick={onClickMakeAdmin}>
          Make an Admin <span className="emoji fast-up" />
        </button>
      )}
    </section>
  );
};

AdminActions.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  team: PropTypes.object.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};

// Thanks 💖

const ThanksCount = ({ count }) =>
  count > 0 ? (
    <section className="pop-over-info">
      <Thanks count={count} />
    </section>
  ) : null;

// Team User Info 😍

const TeamUserInfo = ({ showRemove, user, team, updateUserPermissions, removeUser, userTeamProjects, focusFirstElement }) => {
  const { currentUser } = useCurrentUser();
  const userAvatarStyle = { backgroundColor: user.color };

  const currentUserIsTeamAdmin = userIsTeamAdmin({ user: currentUser, team });
  const selectedUserIsTeamAdmin = userIsTeamAdmin({ user, team });
  const selectedUserIsOnlyAdmin = userIsOnlyTeamAdmin({ user, team });
  const teamHasOnlyOneMember = team.users.length === 1;

  const currentUserHasRemovePriveleges = currentUserIsTeamAdmin || (currentUser && currentUser.id === user.id);
  const canCurrentUserRemoveUser = currentUserHasRemovePriveleges && !teamHasOnlyOneMember && !selectedUserIsOnlyAdmin;

  // if user is a member of no projects, skip the confirm step
  function onRemove() {
    if (userTeamProjects.status === 'ready' && userTeamProjects.data.length === 0) {
      removeUser();
    } else {
      showRemove();
    }
  }

  return (
    <dialog className="pop-over team-user-info-pop" ref={focusFirstElement}>
      <section className="pop-over-info user-info">
        <UserLink user={user}>
          <img className="avatar" src={getAvatarThumbnailUrl(user)} alt={user.login} style={userAvatarStyle} />
        </UserLink>
        <div className="info-container">
          <p className="name" title={user.name}>
            {user.name || 'Anonymous'}
          </p>
          {user.login && (
            <p className="user-login" title={user.login}>
              @{user.login}
            </p>
          )}
          {selectedUserIsTeamAdmin && (
            <div className="status-badge">
              <TooltipContainer
                id={`admin-badge-tooltip-${user.login}`}
                type="info"
                target={<span className="status admin">Team Admin</span>}
                tooltip="Can edit team info and billing"
              />
            </div>
          )}
        </div>
      </section>
      <ThanksCount count={user.thanksCount} />
      {currentUserIsTeamAdmin && <AdminActions user={user} team={team} updateUserPermissions={updateUserPermissions} />}
      {canCurrentUserRemoveUser && <RemoveFromTeam onClick={onRemove} />}
    </dialog>
  );
};

// Team User Remove 💣

// Team User Info or Remove
// uses removeTeamUserVisible state to toggle between showing user info and remove views

const TeamUserInfoAndRemovePop = ({ user, team, removeUserFromTeam, updateUserPermissions, togglePopover, focusFirstElement }) => {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const [userTeamProjects, setUserTeamProjects] = useState({ status: 'loading', data: null });
  useEffect(() => {
    api.get(`users/${user.id}`).then(({ data }) => {
      setUserTeamProjects({
        status: 'ready',
        data: data.projects.filter((userProj) => team.projects.some((teamProj) => teamProj.id === userProj.id)),
      });
    });
  }, [user.id]);

  function removeUser(selectedProjects = []) {
    createNotification(`${getDisplayName(user)} removed from Team`);
    removeUserFromTeam(user.id, Array.from(selectedProjects));
  }

  return (
    <NestedPopover
      alternateContent={() => (
        <TeamUserRemovePop
          user={user}
          removeUser={removeUser}
          userTeamProjects={userTeamProjects}
          togglePopover={togglePopover}
          focusFirstElement={focusFirstElement}
        />
      )}
    >
      {(showRemove) => (
        <TeamUserInfo
          user={user}
          team={team}
          updateUserPermissions={updateUserPermissions}
          removeUser={removeUser}
          userTeamProjects={userTeamProjects}
          showRemove={showRemove}
          focusFirstElement={focusFirstElement}
        />
      )}
    </NestedPopover>
  );
};

TeamUserInfoAndRemovePop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    color: PropTypes.string,
  }).isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired,
  }).isRequired,
  togglePopover: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

const TeamUsers = ({ team, removeUserFromTeam, updateUserPermissions }) => (
  <ul className="users">
    {team.users.map((user) => (
      <li key={user.id}>
        <PopoverWithButton
          buttonClass="user button-unstyled tooltip-container-button"
          buttonText={<UserAvatar user={user} suffix={adminStatusDisplay(team.adminIds, user)} withinButton />}
        >
          {({ togglePopover, focusFirstElement }) => (
            <TeamUserInfoAndRemovePop
              team={team}
              removeUserFromTeam={removeUserFromTeam}
              user={user}
              updateUserPermissions={updateUserPermissions}
              togglePopover={togglePopover}
              focusFirstElement={focusFirstElement}
            />
          )}
        </PopoverWithButton>
      </li>
    ))}
  </ul>
);

TeamUsers.propTypes = {
  team: PropTypes.object.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};


export default TeamUsers;
