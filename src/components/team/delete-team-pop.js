import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Loader } from '@fogcreek/shared-components';

import { PopoverWithButton, PopoverDialog, PopoverActions, PopoverTitle, ActionDescription } from 'Components/popover';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import { useAPIHandlers } from 'State/api';
import { useNotifications } from 'State/notifications';
// import { teamAdmins } from 'Models/team';

const illustration = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fdelete-team.svg?1531267699621';

const DeleteTeamPop = withRouter(({ history, team }) => {
  const { deleteItem } = useAPIHandlers();
  const { createNotification } = useNotifications();
  const [teamIsDeleting, setTeamIsDeleting] = useState(false);

  async function deleteTeam() {
    if (teamIsDeleting) return;
    setTeamIsDeleting(true);
    try {
      await deleteItem({ team });
      history.push('/');
    } catch (error) {
      console.error('deleteTeam', error, error.response);
      createNotification('Something went wrong, try refreshing?', { type: 'error' });
      setTeamIsDeleting(false);
    }
  }

  return (
    <PopoverDialog focusOnDialog align="left">
      <PopoverTitle>Delete {team.name}</PopoverTitle>
      <PopoverActions>
        <Image height="98px" width="auto" src={illustration} alt="" />
        <ActionDescription>
          Deleting {team.name} will remove this team page. No projects will be deleted, but only current project members will be able to edit them.
        </ActionDescription>
      </PopoverActions>
      <PopoverActions type="dangerZone">
        <Button size="small" type="dangerZone" emoji="bomb" onClick={deleteTeam}>
          Delete {team.name}
          {teamIsDeleting && <Loader style={{ width: '25px' }} />}
        </Button>
      </PopoverActions>
      {/* temp hidden until the email part of this is ready
        <PopoverInfo>
          <UsersList users={teamAdmins({ team })}/>
          <InfoDescription>This will also email all team admins, giving them an option to undelete it later</InfoDescription>
        </section>
      */}
    </PopoverDialog>
  );
});

DeleteTeamPop.propTypes = {
  team: PropTypes.object.isRequired,
};

const DeleteTeam = ({ team }) => (
  <PopoverWithButton buttonProps={{ size: 'small', type: 'dangerZone', emoji: 'bomb' }} buttonText={`Delete ${team.name}`}>
    {() => <DeleteTeamPop team={team} />}
  </PopoverWithButton>
);

DeleteTeam.propTypes = {
  team: PropTypes.object.isRequired,
};

export default DeleteTeam;
