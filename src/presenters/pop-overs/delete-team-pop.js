import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Loader from 'Components/loader';
// import { teamAdmins } from 'Models/team';
import { useNotifications } from '../notifications';
import { useAPI } from '../../state/api';
import PopoverWithButton from './popover-with-button';

const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

const DeleteTeamPop = withRouter(({ history, team, focusFirstElement }) => {
  const api = useAPI();
  const { createErrorNotification } = useNotifications();
  const [teamIsDeleting, setTeamIsDeleting] = useState(false);

  async function deleteTeam() {
    if (teamIsDeleting) return;
    setTeamIsDeleting(true);
    try {
      await api.delete(`teams/${team.id}`);
      history.push('/');
    } catch (error) {
      console.error('deleteTeam', error, error.response);
      createErrorNotification('Something went wrong, try refreshing?');
      setTeamIsDeleting(false);
    }
  }

  return (
    <dialog className="pop-over delete-team-pop" open ref={focusFirstElement} tabIndex="0">
      <section className="pop-over-info">
        <div className="pop-title">Delete {team.name}</div>
      </section>
      <section className="pop-over-actions">
        <img className="illustration" src={illustration} aria-label="illustration" alt="" />
        <div className="action-description">
          Deleting {team.name} will remove this team page. No projects will be deleted, but only current project members will be able to edit them.
        </div>
      </section>
      <section className="pop-over-actions danger-zone">
        <button type="button" className="button-small has-emoji" onClick={deleteTeam}>
          Delete {team.name}&nbsp;
          <span className="emoji bomb" role="img" aria-label="bomb emoji" />
          {teamIsDeleting && <Loader />}
        </button>
      </section>

      {/* temp hidden until the email part of this is ready
        <section className="pop-over-info">
          <UsersList users={teamAdmins({ team })}/>
          <p className="info-description">This will also email all team admins, giving them an option to undelete it later</p>
        </section>
         */}
    </dialog>
  );
});

DeleteTeamPop.propTypes = {
  team: PropTypes.object.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

const DeleteTeam = ({ team }) => (
  <section>
    <PopoverWithButton
      buttonClass="button-small button-tertiary has-emoji danger-zone"
      buttonText={
        <>
          Delete {team.name}
          &nbsp;
          <span className="emoji bomb" role="img" aria-label="" />
        </>
      }
    >
      {({ togglePopover, focusFirstElement }) => <DeleteTeamPop team={team} togglePopover={togglePopover} focusFirstElement={focusFirstElement} />}
    </PopoverWithButton>
  </section>
);

DeleteTeam.propTypes = {
  team: PropTypes.object.isRequired,
};

export default DeleteTeam;
