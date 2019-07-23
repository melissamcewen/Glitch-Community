import { useMemo } from 'react';
import { pickBy } from 'lodash';

import { useCurrentUser } from 'State/current-user';
import { useAPIHandlers } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import { userOrTeamIsAuthor, useCollectionReload } from 'State/collection';
import { useProjectReload } from 'State/project';
import { userIsOnTeam } from 'Models/team';
import { userIsProjectMember, userIsProjectAdmin, userIsOnlyProjectAdmin } from 'Models/project';
import { getSingleItem } from 'Shared/api';
import { captureException } from 'Utils/sentry';

const bind = (fn, ...args) => {
  if (!fn) return null;
  return (...restArgs) => fn(...args, ...restArgs);
};

const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

const useDefaultProjectOptions = () => {
  const { addProjectToCollection, joinTeamProject, removeUserFromProject } = useAPIHandlers();
  const { currentUser } = useCurrentUser();
  const { handleError, handleCustomError } = useErrorHandlers();
  const reloadProjectMembers = useProjectReload();
  const reloadCollectionProjects = useCollectionReload();
  return {
    addProjectToCollection: withErrorHandler(async (project, collection) => {
      await addProjectToCollection({ project, collection });
      reloadCollectionProjects([collection]);
    }, handleCustomError),
    joinTeamProject: withErrorHandler(async (project, team) => {
      await joinTeamProject({ team, project });
      reloadProjectMembers([project.id]);
    }, handleError),
    leaveProject: withErrorHandler(async (project) => {
      await removeUserFromProject({ project, user: currentUser });
      reloadProjectMembers([project.id]);
    }, handleError),
  };
};

export async function getProjectPermissions(api, domain) {
  try {
    const project = await getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain);
    return project ? project.permissions : [];
  } catch (error) {
    captureException(error);
    return [];
  }
}

// eslint-disable-next-line import/prefer-default-export
export const useProjectOptions = (project, { user, team, collection, ...options } = {}) => {
  const { currentUser } = useCurrentUser();
  const defaultProjectOptions = useDefaultProjectOptions();
  const projectOptions = { ...defaultProjectOptions, ...options };

  const isPinned = useMemo(() => {
    if (user) return user.pins.some(({ id }) => id === project.id);
    if (team) return team.teamPins.some(({ projectId }) => projectId === project.id);
    return false;
  }, [user, team, project]);

  const isLoggedIn = !!currentUser.login;
  const isProjectMember = userIsProjectMember({ project, user: currentUser });
  const isProjectAdmin = userIsProjectAdmin({ project, user: currentUser });
  const isOnlyProjectAdmin = userIsOnlyProjectAdmin({ project, user: currentUser });

  const isUser = user && user.id === currentUser.id;
  const isCollectionOwner = collection && userOrTeamIsAuthor({ collection, user: currentUser });
  const isTeamMember = team && userIsOnTeam({ team, user: currentUser });
  const projectTeam = currentUser.teams.find((t) => project.teamIds.includes(t.id));
  const isProfileOwner = isUser || isCollectionOwner || isTeamMember;
  const canAddNote = collection ? isCollectionOwner : isProjectAdmin;

  return pickBy({
    addProjectToCollection: isLoggedIn && projectOptions.addProjectToCollection,
    featureProject: !project.private && isProfileOwner && bind(projectOptions.featureProject, project),
    addPin: isProfileOwner && !isPinned && bind(projectOptions.addPin, project),
    removePin: isProfileOwner && isPinned && bind(projectOptions.removePin, project),
    displayNewNote: !project.note && !project.isAddingANewNote && canAddNote && bind(projectOptions.displayNewNote, project),
    joinTeamProject: !isProjectMember && !!projectTeam && bind(projectOptions.joinTeamProject, project, projectTeam),
    leaveProject: isProjectMember && !isOnlyProjectAdmin && bind(projectOptions.leaveProject, project),
    removeProjectFromTeam: isTeamMember && bind(projectOptions.removeProjectFromTeam, project),
    deleteProject: isProjectAdmin && bind(projectOptions.deleteProject, project),
    removeProjectFromCollection: isCollectionOwner && bind(projectOptions.removeProjectFromCollection, project),
  });
};
