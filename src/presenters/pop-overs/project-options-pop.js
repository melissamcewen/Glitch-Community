import React from 'react';
import PropTypes from 'prop-types';

import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import PopoverWithButton from './popover-with-button';
import { NestedPopover } from './popover-nested';
import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

const isTeamProject = ({ currentUser, project }) => {
  for (const team of currentUser.teams) {
    if (project.teamIds.includes(team.id)) {
      return true;
    }
  }
  return false;
};

const promptThenLeaveProject = ({ event, project, leaveProject, currentUser }) => {
  if (isTeamProject({ currentUser, project })) {
    leaveProject(project.id, event);
    return;
  }

  const prompt = `Once you leave this project, you'll lose access to it unless someone else invites you back. \n\n Are sure you want to leave ${
    project.domain
  }?`;
  if (window.confirm(prompt)) {
    leaveProject(project.id, event);
  }
};

const determineProjectOptionsFunctions = ({ currentUser, project, projectOptions }) => {
  const isAnon = !(currentUser && currentUser.login);
  const projectUserIds = project && project.users && Array.isArray(project.users) && project.users.map((projectUser) => projectUser.id);
  const isProjectMember = currentUser && projectUserIds && projectUserIds.includes(currentUser.id);
  const currentUserProjectPermissions = currentUser && project && project.permissions && project.permissions.find((p) => p.userId === currentUser.id);
  const isProjectAdmin = currentUserProjectPermissions && currentUserProjectPermissions.accessLevel === 30;
  const {
    isAuthorized,
    featureProject,
    addPin,
    removePin,
    displayNewNote,
    addProjectToCollection,
    joinTeamProject,
    leaveTeamProject,
    leaveProject,
    removeProjectFromTeam,
    deleteProject,
    removeProjectFromCollection,
  } = projectOptions;

  return {
    featureProject: featureProject && !project.private && !isAnon && isAuthorized ? () => featureProject(project.id) : null,
    addPin: addPin && !isAnon && isAuthorized ? () => addPin(project.id) : null,
    removePin: removePin && !isAnon && isAuthorized ? () => removePin(project.id) : null,
    displayNewNote:
      !(project.note || project.isAddingANewNote) && displayNewNote && !isAnon && isAuthorized ? () => displayNewNote(project.id) : null,
    addProjectToCollection: addProjectToCollection && !isAnon ? addProjectToCollection : null,
    joinTeamProject: joinTeamProject && !isProjectMember && !isAnon && isAuthorized ? () => joinTeamProject(project.id, currentUser.id) : null,
    leaveTeamProject:
      leaveTeamProject && isProjectMember && !isAnon && !isProjectAdmin && isAuthorized ? () => leaveTeamProject(project.id, currentUser.id) : null,
    leaveProject:
      leaveProject && project.users.length > 1 && isProjectMember && !isProjectAdmin && isAuthorized
        ? (event) => promptThenLeaveProject({ event, project, leaveProject, currentUser })
        : null,
    removeProjectFromTeam:
      removeProjectFromTeam && !removeProjectFromCollection && !isAnon && isAuthorized ? () => removeProjectFromTeam(project.id) : null,
    deleteProject: !removeProjectFromCollection && deleteProject && isProjectAdmin ? () => deleteProject(project.id) : null,
    removeProjectFromCollection: removeProjectFromCollection && !isAnon && isAuthorized ? () => removeProjectFromCollection(project) : null,
  };
};

const PopoverButton = ({ onClick, text, emoji }) => (
  <Button type="tertiary" size="small" hasEmoji onClick={onClick}>
    {text} <Emoji name={emoji} />
  </Button>
);
PopoverButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
};

const ProjectOptionsContent = (props) => {
  function toggleAndCB(cb) {
    props.togglePopover();
    cb();
  }

  const onClickLeaveTeamProject = useTrackedFunc(props.leaveTeamProject, 'Leave Project clicked');
  const onClickLeaveProject = useTrackedFunc(props.leaveProject, 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc(() => toggleAndCB(props.deleteProject), 'Delete Project clicked');

  const showPinOrFeatureSection = props.addPin || props.removePin || props.featureProject;
  const showDangerZone = props.removeProjectFromTeam || props.deleteProject || props.removeProjectFromCollection;

  return (
    <dialog className="pop-over project-options-pop" ref={props.focusFirstElement}>
      {showPinOrFeatureSection && (
        <section className="pop-over-actions">
          {props.featureProject && <PopoverButton onClick={() => toggleAndCB(props.featureProject)} text="Feature" emoji="clapper" />}
          {props.addPin && <PopoverButton onClick={() => toggleAndCB(props.addPin)} text="Pin " emoji="pushpin" />}
          {props.removePin && <PopoverButton onClick={() => toggleAndCB(props.removePin)} text="Un-Pin " emoji="pushpin" />}
        </section>
      )}

      {props.displayNewNote && (
        <section className="pop-over-actions">
          <PopoverButton onClick={() => toggleAndCB(props.displayNewNote)} text="Add Note" emoji="spiral_note_pad" />
        </section>
      )}

      {props.addProjectToCollection && (
        <section className="pop-over-actions">
          <PopoverButton onClick={props.addToCollectionPopover} text="Add to Collection " emoji="framed-picture" />
        </section>
      )}

      {props.joinTeamProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={props.joinTeamProject} text="Join Project " emoji="rainbow" />
        </section>
      )}

      {props.leaveTeamProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={onClickLeaveTeamProject} text="Leave Project " emoji="wave" />
        </section>
      )}

      {props.leaveProject && (
        <section className="pop-over-actions collaborator-actions">
          <PopoverButton onClick={onClickLeaveProject} text="Leave Project " emoji="wave" />
        </section>
      )}

      {showDangerZone && (
        <section className="pop-over-actions danger-zone last-section">
          {props.removeProjectFromTeam && (
            <PopoverButton onClick={() => toggleAndCB(props.removeProjectFromTeam)} text="Remove Project " emoji="thumbs_down" />
          )}

          {props.deleteProject && <PopoverButton onClick={onClickDeleteProject} text="Delete Project " emoji="bomb" />}

          {props.removeProjectFromCollection && (
            <PopoverButton onClick={props.removeProjectFromCollection} text="Remove from Collection" emoji="thumbs_down" />
          )}
        </section>
      )}
    </dialog>
  );
};

ProjectOptionsContent.propTypes = {
  addPin: PropTypes.func,
  addProjectToCollection: PropTypes.func,
  deleteProject: PropTypes.func,
  displayNewNote: PropTypes.func,
  featureProject: PropTypes.func,
  joinTeamProject: PropTypes.func,
  leaveProject: PropTypes.func,
  leaveTeamProject: PropTypes.func,
  removePin: PropTypes.func,
  removeProjectFromTeam: PropTypes.func,
  togglePopover: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};
ProjectOptionsContent.defaultProps = {
  addPin: null,
  addProjectToCollection: null,
  deleteProject: null,
  displayNewNote: null,
  featureProject: null,
  joinTeamProject: null,
  leaveProject: null,
  leaveTeamProject: null,
  removePin: null,
  removeProjectFromTeam: null,
};

export default function ProjectOptionsPop(props) {
  const { currentUser } = useCurrentUser();
  const projectOptions = determineProjectOptionsFunctions({ currentUser, ...props });
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);

  if (noProjectOptions) {
    return null;
  }

  return (
    <PopoverWithButton
      buttonClass="project-options button-borderless button-small"
      buttonText={<div className="down-arrow" aria-label="options" />}
      containerClass="project-options-pop-btn"
    >
      {({ togglePopover, focusFirstElement }) => (
        <NestedPopover
          alternateContent={() => (
            <AddProjectToCollectionBase
              {...props}
              {...projectOptions}
              togglePopover={togglePopover}
              focusFirstElement={focusFirstElement}
              currentUser={currentUser}
            />
          )}
        >
          {(addToCollectionPopover) => (
            <ProjectOptionsContent
              {...props}
              {...projectOptions}
              addToCollectionPopover={addToCollectionPopover}
              togglePopover={togglePopover}
              focusFirstElement={focusFirstElement}
            />
          )}
        </NestedPopover>
      )}
    </PopoverWithButton>
  );
}

ProjectOptionsPop.propTypes = {
  project: PropTypes.object.isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptionsPop.defaultProps = {
  projectOptions: {},
};
