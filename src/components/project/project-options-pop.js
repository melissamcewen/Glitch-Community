import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { PopoverMenu, MultiPopover, PopoverDialog, PopoverActions, PopoverMenuButton } from 'Components/popover';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { useTrackedFunc } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { userIsProjectTeamMember } from 'Models/project';

import LeaveProjectPopover from './leave-project-pop';
import { AddProjectToCollectionBase } from './add-project-to-collection-pop';

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

const ProjectOptionsContent = ({ project, projectOptions, addToCollectionPopover, leaveProjectPopover, leaveProjectDirect }) => {
  const { currentUser } = useCurrentUser();
  const onClickDeleteProject = useTrackedFunc(projectOptions.deleteProject, 'Delete Project clicked');
  const trackedLeaveProjectDirect = useTrackedFunc(leaveProjectDirect, 'Leave Project clicked');
  const onClickLeaveProject = userIsProjectTeamMember({ currentUser, project }) ? trackedLeaveProjectDirect : leaveProjectPopover;

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
          [{ onClick: leaveProjectDirect && onClickLeaveProject, label: 'Leave Project', emoji: 'wave' }],
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
  const noProjectOptions = Object.values(projectOptions).every((option) => !option);

  if (noProjectOptions) return null;

  const toggleBeforeAction = (togglePopover, action) =>
    action &&
    ((...args) => {
      togglePopover();
      action(...args);
    });
  const toggleBeforeActions = (togglePopover) => mapValues(projectOptions, (action) => toggleBeforeAction(togglePopover, action));

  return (
    <PopoverMenu label={`Project Options for ${project.domain}`}>
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
            leaveProject: () => <LeaveProjectPopover project={project} leaveProject={projectOptions.leaveProject} togglePopover={togglePopover} />,
          }}
        >
          {({ addToCollection, leaveProject }) => (
            <ProjectOptionsContent
              project={project}
              projectOptions={toggleBeforeActions(togglePopover)}
              addToCollectionPopover={addToCollection}
              leaveProjectPopover={leaveProject}
              leaveProjectDirect={toggleBeforeAction(togglePopover, projectOptions.leaveProject)}
            />
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
