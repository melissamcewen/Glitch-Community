/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { memoize } from 'lodash';
import { createSlice } from 'redux-starter-kit';
import { API_URL } from 'Utils/constants';
import createResourceManager, { allReady } from './resource-manager';

export { allReady };

// API _without_ caching, since caching is handled by redux
const getAPIForToken = memoize((persistentToken) => {
  if (persistentToken) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  }
  return axios.create({
    baseURL: API_URL,
  });
});

const { useResource, getResource, reducer, actions: resourceManagerActions, handlers, changeRelation } = createResourceManager({
  resourceConfig: {
    collections: {
      references: {
        projects: 'projects',
      },
    },
    projects: {
      orderBy: 'domain',
      references: {
        collections: 'collections',
        teams: 'teams',
        users: 'users',
      },
    },
    teams: {
      orderBy: 'url',
      references: {
        collections: 'collections',
        users: 'users',
        projects: 'projects',
        pinnedProjects: 'projects',
      },
    },
    users: {
      orderBy: 'login',
      references: {
        collections: 'collections',
        teams: 'teams',
        projects: 'projects',
        pinnedProjects: 'projects',
        deletedProjects: 'projects',
      },
    },
  },
  getAuthenticatedAPI: (state) => getAPIForToken(state.currentUser.persistentToken),
});

const unshift = (list, value) => {
  if (!list.includes(value)) list.unshift(value);
};

const push = (list, value) => {
  if (!list.includes(value)) list.push(value);
};

const remove = (list, value) => {
  if (list.includes(value)) list.splice(list.indexOf(value), 1);
};

const { reducer: topLevelReducer, actions: topLevelActions } = createSlice({
  reducers: {
    joinTeamProject: (state, { payload: { project } }) => {
      const { currentUser } = state;
      changeRelation(state.resources, { type: 'projects', id: project.id }, { type: 'users', id: currentUser.id }, push);
    },
    leaveProject: (state, { payload: { project } }) => {
      const { currentUser } = state;
      changeRelation(state.resources, { type: 'projects', id: project.id }, { type: 'users', id: currentUser.id }, remove);
    },
    removeUserFromTeamAndProjects: (state, { payload: { user, team, projects } }) => {
      changeRelation(state.resources, { type: 'teams', id: team.id }, { type: 'users', id: user.id }, remove);
      projects.forEach((project) => {
        changeRelation(state.resources, { type: 'projects', id: project.id }, { type: 'users', id: user.id }, remove);
      });
    },
    addProjectToTeam: (state, { payload: { project, team } }) => {
      changeRelation(state.resources, { type: 'projects', id: project.id }, { type: 'teams', id: team.id }, unshift);
    },
    removeProjectFromTeam: (state, { payload: { project, team } }) => {
      changeRelation(state.resources, { type: 'projects', id: project.id }, { type: 'teams', id: team.id }, remove);
    },
    addProjectToCollection: (state, { payload: { project, collection } }) => {
      changeRelation(state.resources, { type: 'collections', id: collection.id }, { type: 'projects', id: project.id }, unshift);
    },
    removeProjectFromCollection: (state, { payload: { project, collection } }) => {
      changeRelation(state.resources, { type: 'collections', id: collection.id }, { type: 'projects', id: project.id }, remove);
    },
    toggleBookmark: (state, { payload: { project } }) => {
      const { collections } = state.currentUser;
      const myStuffID = collections.find((c) => c.isMyStuff).id;
      const { value: myProjects } = getResource(state.resources, 'collections', myStuffID, 'projects');
      if (!myProjects) return;

      const changeFn = myProjects.find((p) => p.id === project.id) ? remove : push;
      changeRelation(state.resources, { type: 'collections', id: myStuffID }, { type: 'projects', id: project.id }, changeFn);
    },
  },
});

export const actions = {
  ...resourceManagerActions,
  ...topLevelActions,
};

export { useResource, getResource, reducer, topLevelReducer, handlers };
