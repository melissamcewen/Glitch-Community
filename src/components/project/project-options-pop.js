import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { addBreadcrumb, captureException } from 'Utils/sentry';

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
  // for some reason project.permissions does not always exist and it's not clear why
  // handling this edge case and logging project to sentry to better understand why.
  // in the future this can be put back to just
  // const projectUserIds = project.permissions.map(({ userId }) => userId);
  let projectUserIds;
  try {
    projectUserIds = project.permissions.map(({ userId }) => userId);
  } catch (error) {
    addBreadcrumb({
      level: 'info',
      message: `project: ${JSON.stringify(project)}`,
    });
    captureException(error);
    projectUserIds = [];
  }
  const isProjectMember = currentUser && projectUserIds.includes(currentUser.id);
  const currentUserProjectPermissions = currentUser && project.permissions.find((p) => p.userId === currentUser.id);
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
      leaveProject && project.permissions.length > 1 && isProjectMember && !isProjectAdmin && isAuthorized
        ? (event) => promptThenLeaveProject({ event, project, leaveProject, currentUser })
        : null,
    removeProjectFromTeam:
      removeProjectFromTeam && !removeProjectFromCollection && !isAnon && isAuthorized ? () => removeProjectFromTeam(project.id) : null,
    deleteProject: !removeProjectFromCollection && deleteProject && isProjectAdmin ? () => deleteProject(project.id) : null,
    removeProjectFromCollection: removeProjectFromCollection && !isAnon && isAuthorized ? () => removeProjectFromCollection(project) : null,
  };
};

/* eslint-disable react/no-array-index-key */
const PopoverMenuItems = ({ children }) =>
  children.map(
    (group, i) =>
      group.some((item) => item.onClick) && (
        <PopoverActions key={i} type={group.some((item) => item.dangerZone) ? 'dangerZone' : undefined}>
          {group.map((item, j) => item.onClick && <PopoverMenuButton key={j} onClick={item.onClick} label={item.label} emoji={item.emoji} />)}
        </PopoverActions>
      ),
  );

const ProjectOptionsContent = ({ projectOptions, addToCollectionPopover }) => {
  const onClickLeaveTeamProject = useTrackedFunc(projectOptions.leaveTeamProject, 'Leave Project clicked');
  const onClickLeaveProject = useTrackedFunc(projectOptions.leaveProject, 'Leave Project clicked');
  const onClickDeleteProject = useTrackedFunc(projectOptions.deleteProject, 'Delete Project clicked');

  return (
    <PopoverDialog align="right">
      <PopoverMenuItems>
        {[
          [
            { onClick: projectOptions.featureProject, label: 'Feature', emoji: 'clapper' },
            { onClick: projectOptions.addPin, label: 'Pin', emoji: 'pushpin' },
            { onClick: projectOptions.removePin, label: 'Un-Pin', emoji: 'pushpin' },
          ],
          [{ onClick: projectOptions.displayNewNote, label: 'Add Note', emoji: 'spiralNotePad' }],
          [{ onClick: addToCollectionPopover, label: 'Add to Collection', emoji: 'framedPicture' }],
          [{ onClick: projectOptions.joinTeamProject, label: 'Join Project', emoji: 'rainbow' }],
          [
            { onClick: onClickLeaveTeamProject, label: 'Leave Project', emoji: 'wave' },
            { onClick: onClickLeaveProject, label: 'Leave Project', emoji: 'wave' },
          ],
          [
            { onClick: projectOptions.removeProjectFromTeam, label: 'Remove Project', emoji: 'thumbsDown', dangerZone: true },
            { onClick: onClickDeleteProject, label: 'Delete Project', emoji: 'bomb', dangerZone: true },
            { onClick: projectOptions.removeProjectFromCollection, label: 'Remove from Collection', emoji: 'thumbsDown', dangerZone: true },
          ],
        ]}
      </PopoverMenuItems>
    </PopoverDialog>
  );
};

export default function ProjectOptionsPop({ project, projectOptions }) {
  const { currentUser } = useCurrentUser();
  projectOptions = determineProjectOptionsFunctions({ currentUser, project, projectOptions });
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);

  if (noProjectOptions) {
    return null;
  }

  const toggleBeforeAction = (togglePopover) =>
    mapValues(
      projectOptions,
      (action) =>
        action &&
        ((...args) => {
          togglePopover();
          action(...args);
        }),
    );

  return (
    <PopoverMenu>
      {({ togglePopover }) => (
        <MultiPopover
          views={{
            addToCollection: ({ createCollection }) => (
              <AddProjectToCollectionBase
                fromProject
                project={project}
                togglePopover={togglePopover}
                addProjectToCollection={projectOptions.addProjectToCollection}
                createCollectionPopover={createCollection}
              />
            ),
            createCollection: () => <CreateCollectionWithProject project={project} addProjectToCollection={projectOptions.addProjectToCollection} />,
          }}
        >
          {({ addToCollection }) => (
            <ProjectOptionsContent projectOptions={toggleBeforeAction(togglePopover)} addToCollectionPopover={addToCollection} />
          )}
        </MultiPopover>
      )}
    </PopoverMenu>
  );
}

ProjectOptionsPop.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    permissions: PropTypes.array.isRequired,
    teamIds: PropTypes.array.isRequired,
    private: PropTypes.bool,
    note: PropTypes.any,
    isAddingNewNote: PropTypes.bool,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectOptionsPop.defaultProps = {
  projectOptions: {},
};
