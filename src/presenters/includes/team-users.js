import React from 'react';
import PropTypes from 'prop-types';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { userIsTeamAdmin, userIsOnTeam, userCanJoinTeam } from 'Models/team';
import { useCurrentUser } from 'State/current-user';
import { createAPIHook } from 'State/api';
import AddTeamUserPop from '../pop-overs/add-team-user-pop';
import PopoverContainer from '../pop-overs/popover-container';
import TeamUserInfoPop from '../pop-overs/team-user-info-pop';
import { captureException } from '../../utils/sentry';

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
      <TeamUserInfoPop team={team} removeUserFromTeam={removeUserFromTeam} updateUserPermissions={updateUserPermissions} />
      {!!team.whitelistedDomain && (
        <WhitelistedDomain domain={team.whitelistedDomain} setDomain={currentUserIsTeamAdmin ? updateWhitelistedDomain : null} />
      )}
      {currentUserIsOnTeam && (
        <AddTeamUserPop
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
