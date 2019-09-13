import React, { useMemo } from 'react';
import { pickBy } from 'lodash';

import { useCurrentUser } from 'State/current-user';
import { useAPIHandlers, useAPI } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import { userOrTeamIsAuthor, useCollectionReload } from 'State/collection';
import { useProjectReload, useProjectMembers } from 'State/project';
import { userIsOnTeam } from 'Models/team';
import { userIsProjectMember, userIsProjectAdmin, userIsOnlyProjectAdmin } from 'Models/project';
import { useNotifications } from 'State/notifications';
import { createCollection } from 'Models/collection';
import { AddProjectToCollectionMsg } from 'Components/notification';

const bind = (fn, ...args) => {
  if (!fn) return null;
  return (...restArgs) => fn(...args, ...restArgs);
};

const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

const useDefaultProjectOptions = () => {
  const { addProjectToCollection, joinTeamProject, removeUserFromProject, removeProjectFromCollection } = useAPIHandlers();
  const { currentUser } = useCurrentUser();
  const { handleError, handleCustomError } = useErrorHandlers();
  const reloadProjectMembers = useProjectReload();
  const reloadCollectionProjects = useCollectionReload();
  const { createNotification } = useNotifications();
  const api = useAPI();

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
    // toggleBookmark is defined here and on state/collection and are very similar. Their only differences are how they modify state.
    // we'll probably want to revisit condensing these when we have a centralized state object to work off of.
    toggleBookmark: withErrorHandler(async (project, hasBookmarked, setHasBookmarked) => {
      let myStuffCollection = currentUser.collections.find((c) => c.isMyStuff);
      if (hasBookmarked) {
        if (setHasBookmarked) setHasBookmarked(false);
        await removeProjectFromCollection({ project, collection: myStuffCollection });
        createNotification(`Removed ${project.domain} from collection My Stuff`);
      } else {
        if (setHasBookmarked) setHasBookmarked(true);
        if (!myStuffCollection) {
          myStuffCollection = await createCollection({ api, name: 'My Stuff', createNotification, myStuffEnabled: true });
        }
        await addProjectToCollection({ project, collection: myStuffCollection });
        reloadCollectionProjects([myStuffCollection]);
        const url = myStuffCollection.fullUrl || `${currentUser.login}/${myStuffCollection.url}`;
        createNotification(
          <AddProjectToCollectionMsg projectDomain={project.domain} collectionName="My Stuff" url={`/@${url}`} />,
          { type: 'success' },
        );
      }
    }, handleError),
  };
};

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
  const { value: members } = useProjectMembers(project.id);
  const isProjectMember = userIsProjectMember({ members, user: currentUser });
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
    featureProject: isLoggedIn && !project.private && isProfileOwner && bind(projectOptions.featureProject, project),
    addPin: isLoggedIn && isProfileOwner && !isPinned && bind(projectOptions.addPin, project),
    removePin: isProfileOwner && isPinned && bind(projectOptions.removePin, project),
    displayNewNote: !project.note && !project.isAddingANewNote && canAddNote && bind(projectOptions.displayNewNote, project),
    joinTeamProject: !isProjectMember && !!projectTeam && bind(projectOptions.joinTeamProject, project, projectTeam),
    leaveProject: isProjectMember && !isOnlyProjectAdmin && bind(projectOptions.leaveProject, project),
    removeProjectFromTeam: isTeamMember && bind(projectOptions.removeProjectFromTeam, project),
    deleteProject: isProjectAdmin && bind(projectOptions.deleteProject, project),
    removeProjectFromCollection: isCollectionOwner && bind(projectOptions.removeProjectFromCollection, project),
    toggleBookmark: isLoggedIn && projectOptions.toggleBookmark,
  });
};
