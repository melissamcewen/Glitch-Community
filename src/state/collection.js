import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAPI, useAPIHandlers } from 'State/api';
import { useResource, actions, allReady } from 'State/resources';
import useErrorHandlers from 'State/error-handlers';
import { getSingleItem, getAllPages } from 'Shared/api';
import { captureException } from 'Utils/sentry';
import { createCollection, getCollectionLink } from 'Models/collection';
import { AddProjectToCollectionMsg } from 'Components/notification';
import { useNotifications } from 'State/notifications';
import { useCurrentUser } from 'State/current-user';

// used by featured-project and pages/project
export const toggleBookmark = async ({
  api,
  project,
  currentUser,
  createNotification,
  myStuffEnabled,
  addProjectToCollection,
  removeProjectFromCollection,
  setHasBookmarked,
  hasBookmarked,
  dispatch,
}) => {
  try {
    let myStuffCollection = currentUser.collections.find((c) => c.isMyStuff);
    if (hasBookmarked) {
      setHasBookmarked(false);
      await removeProjectFromCollection({ project, collection: myStuffCollection });
      createNotification(`Removed ${project.domain} from collection My Stuff`);
    } else {
      setHasBookmarked(true);
      if (!myStuffCollection) {
        myStuffCollection = await createCollection({ api, name: 'My Stuff', createNotification, myStuffEnabled });
      }
      await addProjectToCollection({ project, collection: myStuffCollection });
      const url = myStuffCollection.fullUrl || `${currentUser.login}/${myStuffCollection.url}`;
      createNotification(<AddProjectToCollectionMsg projectDomain={project.domain} collectionName="My Stuff" url={`/@${url}`} />, {
        type: 'success',
      });
    }
    dispatch(actions.toggleBookmark({ collection: myStuffCollection }));
  } catch (error) {
    captureException(error);
    createNotification('Something went wrong, try refreshing?', { type: 'error' });
  }
};

const createAPICallForCollectionProjects = (encodedFullUrl) =>
  `/v1/collections/by/fullUrl/projects?fullUrl=${encodedFullUrl}&orderKey=projectOrder&limit=100`;

export const getCollectionWithProjects = async (api, { owner, name }) => {
  const fullUrl = encodeURIComponent(`${owner}/${name}`);
  try {
    const [collection, projects] = await Promise.all([
      getSingleItem(api, `/v1/collections/by/fullUrl?fullUrl=${fullUrl}`, `${owner}/${name}`),
      getAllPages(api, createAPICallForCollectionProjects(fullUrl)),
    ]);
    return { ...collection, projects };
  } catch (error) {
    if (error && error.response && error.response.status === 404) return null;
    captureException(error);
    return null;
  }
};

export const useCollectionCurator = (collection) => {
  const resource = collection.teamId > 0 ? 'teams' : 'users'
  const id = collection.teamId > 0 ? collection.teamId : collection.userId
  
  return allReady({
    team: useResource('teams', collection.teamId),
    user: useResource('users', collection.userId)
  });
};

export function userOrTeamIsAuthor({ collection, user }) {
  if (!user) return false;
  if (collection.teamId > 0) {
    return user.teams ? user.teams.some((team) => team.id === collection.teamId) : false;
  }
  if (collection.userId > 0) {
    return user.id === collection.userId;
  }
  return false;
}

export function useCollectionEditor(initialCollection) {
  const [collection, setCollection] = useState(initialCollection);
  const dispatch = useDispatch();

  React.useEffect(() => {
    setCollection(initialCollection);
  }, [initialCollection]);

  const {
    updateItem,
    deleteItem,
    addProjectToCollection,
    orderProjectInCollection,
    removeProjectFromCollection,
    updateProjectInCollection,
  } = useAPIHandlers();
  const api = useAPI();

  const { handleError, handleErrorForInput, handleCustomError } = useErrorHandlers();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();

  async function updateFields(changes) {
    // A note here: we don't want to setState with the data from the server from this call, as it doesn't return back the projects in depth with users and notes and things
    // maybe a sign we want to think of something a little more powerful for state management, as we're getting a little hairy here.
    setCollection((prev) => ({ ...prev, ...changes }));
    await updateItem({ collection }, changes);
  }

  function updateProject(projectUpdates, project) {
    setCollection((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id === project.id) {
          return { ...p, ...projectUpdates };
        }
        return p;
      }),
    }));
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    addProjectToCollection: withErrorHandler(async (project, selectedCollection) => {
      // if it's the same collection as the page you're on, add the project to it
      if (selectedCollection.id === collection.id) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: [project, ...oldCollection.projects],
        }));
      }

      // if you're adding to a project to the my stuff collection, make sure the project shows as bookmarked
      if (selectedCollection.isMyStuff) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: oldCollection.projects.map((p) => {
            if (p.id === project.id) {
              p.authUserHasBookmarked = true;
            }
            return p;
          }),
        }));
      }

      // make backend call
      await addProjectToCollection({ project, collection: selectedCollection });

      // reorder collection if necessary
      if (selectedCollection.id === collection.id) {
        await orderProjectInCollection({ project, collection }, 0);
      }

      dispatch(actions.addProjectToCollection({ project, collection }));
    }, handleCustomError),

    removeProjectFromCollection: withErrorHandler(async (project, selectedCollection) => {
      // if no collection is passed in, assume the current page is the collection we're removing from
      if (!selectedCollection.id) {
        selectedCollection = collection;
      }

      // if collection we're removing from is same as current collection page, remove it from the page
      if (selectedCollection.id === collection.id) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: oldCollection.projects.filter((p) => p.id !== project.id),
        }));
      }

      // if we're unbookmarking a project in a collection, make sure it shows as unbookmarked
      if (selectedCollection.isMyStuff) {
        setCollection((oldCollection) => ({
          ...oldCollection,
          projects: oldCollection.projects.map((p) => {
            if (p.id === project.id) {
              p.authUserHasBookmarked = false;
            }
            return p;
          }),
        }));
      }

      // make api call to remove from collection
      await removeProjectFromCollection({ project, collection: selectedCollection });

      dispatch(actions.removeProjectFromCollection({ project, collction: selectedCollection }));
    }, handleError),

    deleteCollection: () => deleteItem({ collection }).catch(handleError),

    deleteProject: withErrorHandler(async (project) => {
      await deleteItem({ project });
      setCollection((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),

    updateNameAndUrl: ({ name, url }) => updateFields({ name, url }).catch(handleErrorForInput),

    displayNewNote: (projectId) => updateProject({ isAddingANewNote: true }, projectId),

    updateNote: async ({ note, project }) => {
      note = (note || '').trim();
      await updateProjectInCollection({ project, collection }, { annotation: note });
      updateProject({ note, isAddingANewNote: true }, project);
    },

    hideNote: (project) => updateProject({ isAddingANewNote: false }, project),

    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),

    updateColor: (color) => updateFields({ coverColor: color }),

    updateProjectOrder: withErrorHandler(async (project, filteredIndex) => {
      // the shown projects list doesn't include the featured project, bump the index to include it
      const featuredIndex = collection.projects.findIndex((p) => p.id === collection.featuredProjectId);
      const index = featuredIndex >= 0 && filteredIndex > featuredIndex ? filteredIndex + 1 : filteredIndex;
      setCollection((prev) => {
        const sortedProjects = prev.projects.filter((p) => p.id !== project.id);
        sortedProjects.splice(index, 0, project);
        return { ...prev, projects: sortedProjects };
      });
      await orderProjectInCollection({ project, collection }, index);
    }, handleError),

    featureProject: withErrorHandler(async (project) => {
      if (collection.featuredProjectId) {
        // this is needed to force an dismount of an optimistic state value of a note and to ensure the old featured collection goes where it's supposed to.
        setCollection((prev) => ({ ...prev, featuredProjectId: null }));
      }
      await updateFields({ featuredProjectId: project.id });
    }, handleError),

    unfeatureProject: () => updateFields({ featuredProjectId: null }).catch(handleError),

    // used on the collection page
    toggleBookmark: withErrorHandler(async (project) => {
      let myStuffCollection = currentUser.collections.find((c) => c.isMyStuff);
      if (project.authUserHasBookmarked) {
        await funcs.removeProjectFromCollection(project, myStuffCollection);
        createNotification(`Removed ${project.domain} from collection My Stuff`);
      } else {
        if (!myStuffCollection) {
          myStuffCollection = await createCollection({ api, name: 'My Stuff', createNotification, myStuffEnabled: true });
        }
        await funcs.addProjectToCollection(project, myStuffCollection);
        createNotification(
          <AddProjectToCollectionMsg projectDomain={project.domain} collectionName="My Stuff" url={getCollectionLink(myStuffCollection)} />,
          {
            type: 'success',
          },
        );
      }
    }, handleError),
  };
  return [collection, funcs];
}
