import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { getDisplayName } from 'Models/user';
import { userIsTeamAdmin, userIsOnTeam, userCanJoinTeam } from 'Models/team';
import { useTracker } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { createAPIHook } from 'State/api';
import AddTeamUserPop from '../pop-overs/add-team-user-pop';
import PopoverWithButton from '../pop-overs/popover-with-button';
import PopoverContainer from '../pop-overs/popover-container';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop';
import { captureException } from '../../utils/sentry';

// Team Users list (in profile container)

const adminStatusDisplay = (adminIds, user) => {
  if (adminIds.includes(user.id)) {
    return ' (admin)';
  }
  return '';
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
            <TeamUserInfoPop
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

// Whitelisted domain icon

const WhitelistedDomain = ({ domain, setDomain }) => {
  const tooltip = `Anyone with an @${domain} email can join`;
  return (
    <PopoverContainer>
      {({ visible, setVisible }) => (
        <details onToggle={(evt) => setVisible(evt.target.open)} open={visible} className="popover-container whitelisted-domain-container">
          <summary>
            <TooltipContainer
              id="whitelisted-domain-tooltip"
              type="action"
              tooltip={visible ? null : tooltip}
              target={
                <div>
                  <WhitelistedDomainIcon domain={domain} />
                </div>
              }
            />
          </summary>
          <dialog className="pop-over">
            <section className="pop-over-info">
              <p className="info-description">{tooltip}</p>
            </section>
            {!!setDomain && (
              <section className="pop-over-actions danger-zone">
                <button className="button button-small button-tertiary button-on-secondary-background has-emoji" onClick={() => setDomain(null)}>
                  Remove {domain} <span className="emoji bomb" />
                </button>
              </section>
            )}
          </dialog>
        </details>
      )}
    </PopoverContainer>
  );
};

WhitelistedDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  setDomain: PropTypes.func,
};

WhitelistedDomain.defaultProps = {
  setDomain: null,
};

// Add Team User

const AddTeamUser = ({ inviteEmail, inviteUser, setWhitelistedDomain, members, invitedMembers, whitelistedDomain }) => {
  const [invitee, setInvitee] = useState('');
  const [newlyInvited, setNewlyInvited] = useState([]);

  const alreadyInvitedAndNewInvited = uniqBy(invitedMembers.concat(newlyInvited), (user) => user.id);
  const track = useTracker('Add to Team clicked');

  const onSetWhitelistedDomain = async (togglePopover, domain) => {
    togglePopover();
    await setWhitelistedDomain(domain);
  };

  const onInviteUser = async (togglePopover, user) => {
    togglePopover();
    setInvitee(getDisplayName(user));
    setNewlyInvited((invited) => [...invited, user]);
    try {
      await inviteUser(user);
    } catch (error) {
      setInvitee('');
      setNewlyInvited((invited) => invited.filter((u) => u.id !== user.id));
    }
  };

  const onInviteEmail = async (togglePopover, email) => {
    togglePopover();
    setInvitee(email);
    try {
      await inviteEmail(email);
    } catch (error) {
      setInvitee('');
    }
  };

  const removeNotifyInvited = () => {
    setInvitee('');
  };

  return (
    <span className="add-user-container">
      <ul className="users">
        {alreadyInvitedAndNewInvited.map((user) => (
          <li key={user.id}>
            <UserLink user={user} className="user">
              <UserAvatar user={user} />
            </UserLink>
          </li>
        ))}
      </ul>
      <span className="add-user-wrap">
        <PopoverWithButton buttonClass="button-small button-tertiary add-user" buttonText="Add" onOpen={track}>
          {({ togglePopover }) => (
            <AddTeamUserPop
              members={members}
              whitelistedDomain={whitelistedDomain}
              setWhitelistedDomain={setWhitelistedDomain ? (domain) => onSetWhitelistedDomain(togglePopover, domain) : null}
              inviteUser={inviteUser ? (user) => onInviteUser(togglePopover, user) : null}
              inviteEmail={inviteEmail ? (email) => onInviteEmail(togglePopover, email) : null}
            />
          )}
        </PopoverWithButton>
        {!!invitee && (
          <div className="notification notifySuccess inline-notification" onAnimationEnd={removeNotifyInvited}>
            Invited {invitee}
          </div>
        )}
      </span>
    </span>
  );
};
AddTeamUser.propTypes = {
  inviteEmail: PropTypes.func,
  inviteUser: PropTypes.func,
  setWhitelistedDomain: PropTypes.func,
};
AddTeamUser.defaultProps = {
  setWhitelistedDomain: null,
  inviteUser: null,
  inviteEmail: null,
};

// Join Team

const JoinTeam = ({ onClick }) => (
  <button className="button button-small button-cta join-team-button" onClick={onClick}>
    Join Team
  </button>
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
  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });
  const currentUserCanJoinTeam = userCanJoinTeam({ team, user: currentUser });
  const { value } = useInvitees(team, currentUserIsOnTeam);
  const invitees = value || [];

  return (
    <>
      <TeamUsers team={team} removeUserFromTeam={removeUserFromTeam} updateUserPermissions={updateUserPermissions} />
      {!!team.whitelistedDomain && (
        <WhitelistedDomain domain={team.whitelistedDomain} setDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null} />
      )}
      {currentUserIsOnTeam && (
        <AddTeamUser
          inviteEmail={inviteEmail}
          inviteUser={inviteUser}
          setWhitelistedDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null}
          members={team.users.map(({ id }) => id)}
          invitedMembers={invitees}
          whitelistedDomain={team.whitelistedDomain}
        />
      )}
      {currentUserCanJoinTeam && <JoinTeam onClick={joinTeam} />}
    </>
  );
};

export default TeamUserContainer;
