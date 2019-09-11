/* eslint-disable no-underscore-dangle */
import { mapValues, isEqual } from 'lodash';
import { createSlice } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

import createResourceManager from './resource-manager';

const status = {
  loading: 'loading',
  ready: 'ready',
};

const { getResource, reducer, actions, handlers, changeRelation } = createResourceManager({
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

Object.assign(actions, topLevelActions);

export { getResource, reducer, topLevelReducer, actions, handlers };

export const useResource = (type, id, childType) => {
  // TODO: figure out best balance between cost of `isEqual` vs cost of wasted renders here
  const result = useSelector((state) => getResource(state.resources, type, id, childType), isEqual);
  const dispatch = useDispatch();

  if (result.requests.length) {
    dispatch(actions.requestedResources(result.requests));
  }
  return result;
};

/*
  combine multiple results into a single result that's ready when all inputs are ready
  (like Promise.all or allByKeys).
  Can take an object or an array.
*/
export const allReady = (reqs) => ({
  status: Object.values(reqs).every((req) => req.status === status.ready) ? status.ready : status.loading,
  value: Array.isArray(reqs) ? reqs.map((req) => req.value) : mapValues(reqs, (req) => req.value),
});
