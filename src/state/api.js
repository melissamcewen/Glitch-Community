/* globals API_URL */
import React, { useState, useEffect, useContext, useRef, createContext } from 'react';
import axios from 'axios';
import { memoize } from 'lodash';
import { useCurrentUser } from './current-user';
import { captureException } from '../utils/sentry';

export const Context = createContext();

export const getAPIForToken = memoize((persistentToken) => {
  const cache 
  
  
  // const cache = { maxAge: 15 * 60 * 1000 }); // 1 minute -- just enough for requests on a single page load
  if (persistentToken) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
      adapter: cache.adapter,
    });
  }
  return axios.create({
    baseURL: API_URL,
    adapter: cache.adapter,
  });
});

export function APIContextProvider({ children }) {
  const { persistentToken } = useCurrentUser();
  const api = getAPIForToken(persistentToken);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function useAPI() {
  return useContext(Context);
}

/*
Create a hook for working with the API via async functions.
Usage:

const useTeamsAPI = createAPIHook(async (api, teamID) => {
  const team = await api.get(`/team/${teamID}`);
  const { projectIDs } = team;
  team.projects = await Promise.all(projectIDs.map(projectID => api.get(`/project/${projectID})`));
  return team;
});

function TeamWithProjects ({ teamID }) {
  const { status, value } = useTeamsAPI(teamID)

  if (status === 'loading') {
    return <Loading />
  }

  // ... render the team ...
}

*/

// we don't want to set "stale" state, e.g. if the user clicks over to a different team's page
// while the first team's data is still loading, we don't want to show the first team's data when it loads.
// this should also avoid errors from setting state on an unmounted component.
function useAsyncEffectState(initialState, handler, asyncFuncArgs) {
  const [state, setState] = useState(initialState);
  const versionRef = useRef(0);
  useEffect(() => {
    const versionWhenEffectStarted = versionRef.current;
    const setStateIfFresh = (value) => {
      if (versionWhenEffectStarted === versionRef.current) {
        setState(value);
      }
    };
    handler(setStateIfFresh, versionWhenEffectStarted);
    return () => {
      versionRef.current += 1;
    };
  }, asyncFuncArgs);
  return state;
}

export const createAPIHook = (asyncFunction, options = {}) => (...args) => {
  const api = useAPI();
  const loading = { status: 'loading' };
  const result = useAsyncEffectState(
    loading,
    async (setResult, version) => {
      // reset to 'loading' if the args change
      if (version > 0) {
        setResult(loading);
      }
      try {
        const value = await asyncFunction(api, ...args);
        setResult({ status: 'ready', value });
      } catch (error) {
        setResult({ status: 'error', value: error });
        if (options.captureException) {
          captureException(error);
        }
      }
    },
    args,
  );
  return result;
};
