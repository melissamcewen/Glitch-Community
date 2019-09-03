import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@fogcreek/shared-components';

import { getDisplayName } from 'Models/user';
import { userIsTeamAdmin, userIsOnlyTeamAdmin } from 'Models/team';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserAvatar, ProjectAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import Thanks from 'Components/thanks';
import { PopoverContainer, PopoverDialog, PopoverActions, PopoverInfo, MultiPopover, MultiPopoverTitle, ActionDescription } from 'Components/popover';
import Button from 'Components/buttons/button';
import TransparentButton from 'Components/buttons/transparent-button';

import { useTrackedFunc, useTracker } from 'State/segment-analytics';
import { createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { getAllPages } from 'Shared/api';

import styles from './styles.styl';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

const ProjectsList = ({ options, value, onChange }) => (
  <div className={styles.projectsList}>
    {options.map((project) => (
      <label key={project.id}>
        <input
          type="checkbox"
          checked={value.includes(project.id)}
          value={project.id}
          onChange={(e) => {
            const next = new Set(value);
            if (e.target.checked) {
              next.add(e.target.value);
            } else {
              next.delete(e.target.value);
            }
            onChange(Array.from(next));
          }}
        />
        <div className={styles.projectAvatarWrap}>
          <ProjectAvatar project={project} />
        </div>
        {project.domain}
      </label>
    ))}
  </div>
);

const AdminBadge = () => (
  <div className={styles.statusBadge}>
    <TooltipContainer type="info" target={<span className={styles.adminStatus}>Team Admin</span>} tooltip="Can edit team info and billing" />
  </div>
);

// Team User Remove 💣

function TeamUserRemovePop({ user, onRemoveUser, userTeamProjects }) {
  const [selectedProjectIDs, setSelectedProjects] = useState([]);
  function selectAllProjects() {
    setSelectedProjects(userTeamProjects.map((p) => p.id));
  }

  function unselectAllProjects() {
    setSelectedProjects([]);
  }

  const allProjectsSelected = userTeamProjects.every((p) => selectedProjectIDs.includes(p.id));
  const projectsToRemove = userTeamProjects.filter((p) => selectedProjectIDs.includes(p.id));

  return (
    <PopoverDialog align="left" focusOnPopover>
      <MultiPopoverTitle>Remove {getDisplayName(user)}</MultiPopoverTitle>

      {!userTeamProjects && (
        <PopoverActions>
          <Loader />
        </PopoverActions>
      )}
      {userTeamProjects && userTeamProjects.length > 0 && (
        <PopoverActions>
          <ActionDescription>Also remove them from these projects</ActionDescription>
          <ProjectsList options={userTeamProjects} value={selectedProjectIDs} onChange={setSelectedProjects} />
          {userTeamProjects.length > 1 && allProjectsSelected && (
            <Button size="small" onClick={unselectAllProjects}>
              Unselect All
            </Button>
          )}
          {userTeamProjects.length > 1 && !allProjectsSelected && (
            <Button size="small" onClick={selectAllProjects}>
              Select All
            </Button>
          )}
        </PopoverActions>
      )}

      <PopoverActions type="dangerZone">
        <Button type="dangerZone" onClick={() => onRemoveUser(projectsToRemove)}>
          Remove{' '}
          <span className={styles.tinyAvatar}>
            <UserAvatar user={user} withinButton />
          </span>
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
}

// Team User Info 😍

const TeamUserInfo = ({ user, team, onMakeAdmin, onRemoveAdmin, onRemoveUser }) => {
  const { currentUser } = useCurrentUser();
  const currentUserIsTeamAdmin = userIsTeamAdmin({ user: currentUser, team });
  const selectedUserIsTeamAdmin = userIsTeamAdmin({ user, team });
  const selectedUserIsOnlyAdmin = userIsOnlyTeamAdmin({ user, team });
  const teamHasOnlyOneMember = team.users.length === 1;
  const isCurrentUser = currentUser && currentUser.id === user.id;
  const currentUserHasRemovePriveleges = currentUserIsTeamAdmin || isCurrentUser;
  const canCurrentUserRemoveUser = currentUserHasRemovePriveleges && !teamHasOnlyOneMember && !selectedUserIsOnlyAdmin;

  return (
    <PopoverDialog align="left">
      <PopoverInfo>
        <div className={styles.userProfile}>
          <UserLink user={user}>
            <UserAvatar user={user} hideTooltip />
          </UserLink>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name || 'Anonymous'}</div>
            {user.login && <div className={styles.userLogin}>@{user.login}</div>}
            {selectedUserIsTeamAdmin && <AdminBadge />}
          </div>
        </div>
      </PopoverInfo>
      {user.thanksCount > 0 && (
        <PopoverInfo>
          <Thanks count={user.thanksCount} />
        </PopoverInfo>
      )}
      {currentUserIsTeamAdmin && !selectedUserIsOnlyAdmin && (
        <PopoverActions>
          <ActionDescription>Admins can update team info, billing, and remove users</ActionDescription>
          {selectedUserIsTeamAdmin ? (
            <Button size="small" type="tertiary" emoji="fastDown" onClick={onRemoveAdmin}>
              Remove Admin Status
            </Button>
          ) : (
            <Button size="small" type="tertiary" emoji="fastUp" onClick={onMakeAdmin}>
              Make an Admin
            </Button>
          )}
        </PopoverActions>
      )}
      {canCurrentUserRemoveUser && (
        <PopoverActions type="dangerZone">
          <Button type="dangerZone" emoji="wave" onClick={onRemoveUser}>
            {isCurrentUser ? 'Leave Team' : 'Remove from Team'}
          </Button>
        </PopoverActions>
      )}
    </PopoverDialog>
  );
};

const useProjects = createAPIHook(async (api, userID, team) => {
  const userProjects = await getAllPages(api, `/v1/users/by/id/projects?id=${userID}&limit=100`);
  return userProjects.filter((userProj) => team.projects.some((teamProj) => teamProj.id === userProj.id));
});

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return ' (admin)';
  }
  return '';
};

const TeamUserPop = ({ team, user, removeUserFromTeam, updateUserPermissions }) => {
  const { createNotification } = useNotifications();
  const userTeamProjectsResponse = useProjects(user.id, team);
  const userTeamProjects = userTeamProjectsResponse.status === 'ready' ? userTeamProjectsResponse.value : null;

  const removeUser = useTrackedFunc(async (selectedProjects = []) => {
    await removeUserFromTeam(user, selectedProjects);
    createNotification(`${getDisplayName(user)} removed from Team`);
  }, 'Remove from Team submitted');

  const trackRemoveClicked = useTracker('Remove from Team clicked');

  // if user is a member of no projects, skip the confirm step
  const onOrShowRemoveUser = (showRemove, togglePopover) => {
    if (userTeamProjects && userTeamProjects.length === 0) {
      removeUser();
      togglePopover();
    } else {
      trackRemoveClicked();
      showRemove();
    }
  };

  const onRemoveAdmin = useTrackedFunc(() => updateUserPermissions(user, MEMBER_ACCESS_LEVEL), 'Remove Admin Status clicked');
  const onMakeAdmin = useTrackedFunc(() => updateUserPermissions(user, ADMIN_ACCESS_LEVEL), 'Make an Admin clicked');

  return (
    <PopoverContainer>
      {({ visible, togglePopover, toggleAndCall }) => (
        <div style={{ position: 'relative' }}>
          <TransparentButton onClick={togglePopover}>
            <UserAvatar user={user} suffix={adminStatusDisplay(team.adminIds, user)} withinButton />
          </TransparentButton>

          {visible && (
            <MultiPopover
              views={{
                remove: () => <TeamUserRemovePop user={user} userTeamProjects={userTeamProjects} onRemoveUser={toggleAndCall(removeUser)} />,
              }}
            >
              {(showViews) => (
                <TeamUserInfo
                  user={user}
                  team={team}
                  onRemoveAdmin={toggleAndCall(onRemoveAdmin)}
                  onMakeAdmin={toggleAndCall(onMakeAdmin)}
                  onRemoveUser={() => onOrShowRemoveUser(showViews.remove, togglePopover)}
                />
              )}
            </MultiPopover>
          )}
        </div>
      )}
    </PopoverContainer>
  );
};

TeamUserPop.propTypes = {
  team: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  updateUserPermissions: PropTypes.func.isRequired,
};

export default TeamUserPop;
