import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uniq } from 'lodash';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { userIsTeamAdmin, userIsOnTeam, userCanJoinTeam } from 'Models/team';
import { getDisplayName } from 'Models/user';
import { useCurrentUser } from 'State/current-user';
import { useAPIHandlers, createAPIHook } from 'State/api';
import { useNotifications } from 'State/notifications';
import { PopoverContainer, PopoverDialog, PopoverInfo, PopoverActions, InfoDescription } from 'Components/popover';
import AddTeamUserPop from 'Components/team-users/add-team-user';
import Button from 'Components/buttons/button';
import TransparentButton from 'Components/buttons/transparent-button';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import { captureException } from 'Utils/sentry';

import TeamUserPop from './team-user-info';
import styles from './styles.styl';

// Invited user icon and pop

function InvitedUser({ user, team, onRevokeInvite }) {
  const { inviteUserToTeam } = useAPIHandlers();
  const { createNotification } = useNotifications();

  // resend the invite
  const resendInvite = async () => {
    try {
      await inviteUserToTeam({ team, user });
      createNotification(`Resent invite to ${user.name}!`, { type: 'success' });
    } catch (error) {
      captureException(error);
      createNotification('Invite not sent, try again later', { type: 'error' });
    }
  };

  return (
    <PopoverContainer>
      {({ visible, togglePopover }) => (
        <div style={{ position: 'relative' }}>
          <TransparentButton onClick={togglePopover}>
            <UserAvatar user={user} />
          </TransparentButton>

          {visible && (
            <PopoverDialog align="left">
              <PopoverInfo>
                <div className={styles.avatar}>
                  <UserLink user={user}>
                    <UserAvatar user={user} hideTooltip />
                  </UserLink>
                </div>
                <div className={styles.nameLoginWrap}>
                  <h3 className={styles.name} title={user.name}>
                    {user.name || 'Anonymous'}
                  </h3>
                  {user.login && (
                    <p className={styles.userLogin} title={user.login}>
                      @{user.login}
                    </p>
                  )}
                </div>
              </PopoverInfo>

              <PopoverActions>
                <Button onClick={resendInvite} type="tertiary" size="small" emoji="herb">
                  Resend invite
                </Button>
              </PopoverActions>

              <PopoverActions type="dangerZone">
                <Button onClick={onRevokeInvite} type="dangerZone" emoji="wave">
                  Remove
                </Button>
              </PopoverActions>
            </PopoverDialog>
          )}
        </div>
      )}
    </PopoverContainer>
  );
}

InvitedUser.propTypes = {
  user: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  onRevokeInvite: PropTypes.func.isRequired,
};

// Whitelisted domain icon

const WhitelistedDomain = ({ domain, setDomain }) => (
  <PopoverContainer>
    {({ visible, togglePopover }) => (
      <div style={{ position: 'relative' }}>
        <TransparentButton onClick={togglePopover}>
          <TooltipContainer
            type="action"
            tooltip={visible ? null : `Anyone with an @${domain} email can join`}
            target={
              <div className={styles.whitelistedDomainIconWrap}>
                <WhitelistedDomainIcon domain={domain} />
              </div>
            }
          />
        </TransparentButton>
        {visible && (
          <PopoverDialog focusOnDialog align="left">
            <PopoverInfo>
              <InfoDescription>Anyone with an @{domain} email can join</InfoDescription>
            </PopoverInfo>
            {!!setDomain && (
              <PopoverActions type="dangerZone">
                <Button type="dangerZone" size="small" emoji="bomb" onClick={() => setDomain(null)}>
                  Remove {domain}
                </Button>
              </PopoverActions>
            )}
          </PopoverDialog>
        )}
      </div>
    )}
  </PopoverContainer>
);

WhitelistedDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  setDomain: PropTypes.func,
};

WhitelistedDomain.defaultProps = {
  setDomain: null,
};

// Join Team

const JoinTeam = ({ onClick }) => (
  <Button size="small" type="cta" onClick={onClick}>
    Join Team
  </Button>
);

const useInvitees = createAPIHook(async (api, team, currentUserIsOnTeam) => {
  if (!currentUserIsOnTeam) return [];
  if (!team.tokens.length) return [];

  try {
    const idString = team.tokens.map(({ userId }) => `id=${userId}`).join('&');
    const { data } = await api.get(`v1/users/by/id?${idString}`);
    const invitees = Object.values(data);
    return invitees;
  } catch (error) {
    if (!error.response || error.response.status !== 404) {
      captureException(error);
    }
    return [];
  }
});

const TeamUserContainer = ({ team, removeUserFromTeam, updateUserPermissions, updateWhitelistedDomain, inviteEmail, inviteUser, joinTeam }) => {
  const { currentUser } = useCurrentUser();
  const [newlyInvited, setNewlyInvited] = useState([]);
  const [removedInvitees, setRemovedInvitee] = useState([]);
  const { revokeTeamInvite } = useAPIHandlers();
  const { createNotification } = useNotifications();

  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });
  const currentUserCanJoinTeam = userCanJoinTeam({ team, user: currentUser });
  const { value } = useInvitees(team, currentUserIsOnTeam);
  const invitees = (value || []).concat(newlyInvited).filter((el) => (!removedInvitees.includes(el)));

  const members = uniq([...team.users, ...invitees].map((user) => user.id));

  const onInviteUser = async (user) => {
    setNewlyInvited((invited) => [...invited, user]);
    try {
      await inviteUser(user);
      createNotification(`Invited ${getDisplayName(user)}!`, { type: 'success' });
    } catch (error) {
      setNewlyInvited((invited) => invited.filter((u) => u.id !== user.id));
      captureException(error);
      createNotification(`Couldn't invite ${getDisplayName(user)}, Try again later`, { type: 'error' });
    }
  };

  const onInviteEmail = async (email) => {
    try {
      await inviteEmail(email);
      createNotification(`Invited ${email}!`, { type: 'success' });
    } catch (error) {
      captureException(error);
      createNotification(`Couldn't invite ${email}, Try again later`, { type: 'error' });
    }
  };

  return (
    <ul className={styles.container}>
      {team.users.map((user) => (
        <li key={user.id} className={styles.teamMember}>
          <TeamUserPop team={team} user={user} removeUserFromTeam={removeUserFromTeam} updateUserPermissions={updateUserPermissions} />
        </li>
      ))}
      {!!team.whitelistedDomain && (
        <li className={styles.whitelistedDomain}>
          <WhitelistedDomain domain={team.whitelistedDomain} setDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null} />
        </li>
      )}
      {invitees.map((user) => (
        <li key={user.id} className={styles.invitedMember}>
          <InvitedUser
            user={user}
            team={team}
            onRevokeInvite={async () => {
              setRemovedInvitee((removed) => [...removed, user]);
              try {
                await revokeTeamInvite({ team, user });
                createNotification(`Removed ${user.name} from team`);
              } catch (error) {
                captureException(error);
                createNotification("Couldn't revoke invite, Try again later", { type: 'error' });
              }
            }}
          />
        </li>
      ))}
      {currentUserIsOnTeam && (
        <li className={styles.addButtonWrap}>
          <AddTeamUserPop
            inviteEmail={inviteEmail ? onInviteEmail : null}
            inviteUser={inviteUser ? onInviteUser : null}
            setWhitelistedDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null}
            members={members}
            whitelistedDomain={team.whitelistedDomain}
          />
        </li>
      )}
      {currentUserCanJoinTeam && (
        <li className={styles.joinButtonWrap}>
          <JoinTeam onClick={joinTeam} />
        </li>
      )}
    </ul>
  );
};

export default TeamUserContainer;
