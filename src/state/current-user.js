import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { memoize } from 'lodash';
import { createSlice, createAction } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

import { getSingleItem, getAllPages, allByKeys } from 'Shared/api';
import { sortProjectsByLastAccess } from 'Models/project';
import { configureScope, captureException, captureMessage, addBreadcrumb } from 'Utils/sentry';
import runLatest from 'Utils/run-latest';
import { getStorage, readFromStorage, writeToStorage } from './local-storage';
import { getAPIForToken } from './api'; // eslint-disable-line import/no-cycle

const getStorageMemo = memoize(getStorage);
const getFromStorage = (key) => readFromStorage(getStorageMemo(), key);
const setStorage = (key, value) => writeToStorage(getStorageMemo(), key, value);

function identifyUser(user) {
  document.cookie = `hasLogin=; expires=${new Date()}`;
  if (user) {
    addBreadcrumb({
      level: 'info',
      message: `Current user is ${JSON.stringify(user)}`,
    });
    if (user.login) {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `hasLogin=true; expires=${expires}`;
    }
  } else {
    addBreadcrumb({
      level: 'info',
      message: 'logged out',
    });
  }
  try {
    if (window.analytics && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find((email) => email.primary);
      const email = emailObj && emailObj.email;
      window.analytics.identify(
        user.id,
        {
          name: user.name,
          login: user.login,
          email,
          created_at: user.createdAt,
        },
        { groupId: '0' },
      );
    }
    if (user) {
      configureScope((scope) => {
        scope.setUser({
          id: user.id,
          login: user.login,
        });
      });
    } else {
      configureScope((scope) => {
        scope.setUser({
          id: null,
          login: null,
        });
      });
    }
  } catch (error) {
    console.error(error);
    captureException(error);
  }
}

// Test if two user objects reference the same person
function usersMatch(a, b) {
  if (!a && !b) return true;
  return a && b && a.id === b.id && a.persistentToken === b.persistentToken;
}

async function getAnonUser() {
  const api = getAPIForToken();
  const { data } = await api.post('users/anon');
  return data;
}

async function getSharedUser(persistentToken) {
  if (!persistentToken) return undefined;
  const api = getAPIForToken(persistentToken);

  try {
    return await getSingleItem(api, `v1/users/by/persistentToken?persistentToken=${persistentToken}`, persistentToken);
  } catch (error) {
    if (error.response && error.response.status === 401) return undefined;
    throw error;
  }
}

async function getCachedUser(sharedUser) {
  if (!sharedUser) return undefined;
  if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
  const api = getAPIForToken(sharedUser.persistentToken);
  try {
    const makeUrl = (type) => `v1/users/by/id/${type}?id=${sharedUser.id}&limit=100&cache=${Date.now()}`;
    const makeOrderedUrl = (type, order, direction) => `${makeUrl(type)}&orderKey=${order}&orderDirection=${direction}&cache=${Date.now()}`;
    const { baseUser, emails, projects, teams, collections } = await allByKeys({
      baseUser: getSingleItem(api, `v1/users/by/id?id=${sharedUser.id}&cache=${Date.now()}`, sharedUser.id),
      emails: getAllPages(api, makeUrl('emails')),
      projects: getAllPages(api, makeOrderedUrl('projects', 'domain', 'ASC')),
      teams: getAllPages(api, makeOrderedUrl('teams', 'url', 'ASC')),
      collections: getAllPages(api, makeUrl('collections')),
    });
    const user = { ...baseUser, emails, projects: sortProjectsByLastAccess(projects), teams, collections };
    if (!usersMatch(sharedUser, user)) return 'error';
    return user;
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 404)) {
      // 401 means our token is bad, 404 means the user doesn't exist
      return 'error';
    }
    throw error;
  }
}
const logSharedUserError = (sharedUser, newSharedUser) => {
  console.log(`Fixed shared cachedUser from ${sharedUser.id} to ${newSharedUser && newSharedUser.id}`);
  addBreadcrumb({
    level: 'info',
    message: `Fixed shared cachedUser. Was ${JSON.stringify(sharedUser)}`,
  });
  addBreadcrumb({
    level: 'info',
    message: `New shared cachedUser: ${JSON.stringify(newSharedUser)}`,
  });
  captureMessage('Invalid cachedUser');
};

// sharedUser syncs with the editor and is authoritative on id and persistentToken
const sharedUserKey = 'cachedUser';
// cachedUser mirrors the v1 API data and is what we actually display
const cachedUserKey = 'community-cachedUser';

// Default values for all of the user fields we need you to have
// We always generate a 'real' anon user, but use this until we do
const defaultUser = {
  id: 0,
  login: null,
  name: null,
  description: '',
  color: '#aaa',
  avatarUrl: null,
  avatarThumbnailUrl: null,
  hasCoverImage: false,
  coverColor: null,
  emails: [],
  features: [],
  projects: [],
  teams: [],
  collections: [],
};

const pageMounted = createAction('app/pageMounted');

export const { reducer, actions } = createSlice({
  slice: 'currentUser',
  initialState: {
    ...defaultUser,
    status: 'loading',
  },
  reducers: {
    loadedFromCache: (_, { payload }) => ({
      ...payload,
      status: 'loading', // because this data is probably stale
    }),
    loadedFresh: (_, { payload }) => ({
      ...payload,
      status: 'ready',
    }),
    loggedIn: () => ({
      ...defaultUser,
      status: 'loading', // because the auth token has been set, but there's no user data yet
    }),
    loggedOut: () => ({
      ...defaultUser,
      status: 'loading', // because we're now fetching a new anonymous user
    }),
    requestedReload: (state) => ({
      ...state,
      status: 'loading',
    }),
    updatedInAnotherTab: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    // TODO: more granular actions for managing user's teams, collections etc
    updated: (state, { payload }) => ({ ...state, ...payload }),
  },
});

// eslint-disable-next-line func-names
const load = runLatest(function* (action, store) {
  let sharedUser = getFromStorage(sharedUserKey);

  // If we're signed out create a new anon user
  if (!sharedUser) {
    sharedUser = yield getAnonUser();
    setStorage(sharedUserKey, sharedUser);
  }

  let newCachedUser = yield getCachedUser(sharedUser);

  while (newCachedUser === 'error') {
    // Looks like our sharedUser is bad
    // Anon users get their token and id deleted when they're merged into a user on sign in
    const prevSharedUser = sharedUser;
    sharedUser = yield getSharedUser(sharedUser.persistentToken);
    setStorage(sharedUserKey, sharedUser);
    logSharedUserError(prevSharedUser, sharedUser);

    newCachedUser = yield getCachedUser(sharedUser);
  }

  // The shared user is good, store it
  setStorage(cachedUserKey, newCachedUser);
  identifyUser(newCachedUser);
  store.dispatch(actions.loadedFresh(newCachedUser));
});

export const handlers = {
  [pageMounted]: async (action, store) => {
    const cachedUser = getFromStorage(cachedUserKey);
    if (cachedUser) {
      identifyUser(cachedUser);
      store.dispatch(actions.loadedFromCache(cachedUser));
    }
    await load(action, store);
  },
  [actions.requestedReload]: load,
  [actions.updated]: (_, store) => {
    setStorage(cachedUserKey, store.getState().currentUser);
  },
  [actions.loggedIn]: async (action, store) => {
    setStorage(sharedUserKey, action.payload);
    setStorage(cachedUserKey, undefined);
    await load(action, store);
  },
  [actions.loggedOut]: async (action, store) => {
    setStorage(sharedUserKey, undefined);
    setStorage(cachedUserKey, undefined);
    await load(action, store);
  },
  [actions.updatedInAnotherTab]: async (action, store) => {
    const sharedUser = getFromStorage(sharedUserKey);
    if (!sharedUser) {
      store.dispatch(actions.loggedOut());
    } else if (!usersMatch(sharedUser, store.getState().currentUser)) {
      store.dispatch(actions.loggedIn(sharedUser));
    }
  },
};

export const useCurrentUser = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();
  return {
    currentUser,
    fetched: currentUser.status === 'ready',
    persistentToken: currentUser.persistentToken,
    reload: () => dispatch(actions.requestedReload()),
    login: (data) => dispatch(actions.loggedIn(data)),
    update: (data) => dispatch(actions.updated(data)),
    clear: () => dispatch(actions.loggedOut()),
  };
};

export const CurrentUserProvider = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(pageMounted());

    const onStorage = (event) => {
      if (!event.key || event.key === sharedUserKey || event.key === cachedUserKey) {
        dispatch(actions.updatedInAnotherTab(getFromStorage(cachedUserKey)));
      }
    };

    window.addEventListener('storage', onStorage, { passive: true });
    return () => {
      window.removeEventListener('storage', onStorage, { passive: true });
    };
  }, []);
  return children;
};
CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const useSuperUserHelpers = () => {
  const { currentUser: cachedUser } = useCurrentUser();
  const superUserFeature = cachedUser && cachedUser.features && cachedUser.features.find((feature) => feature.name === 'super_user');

  return {
    toggleSuperUser: async () => {
      if (!cachedUser) return;
      const api = getAPIForToken(cachedUser.persistentToken);
      await api.post(`https://support-toggle.glitch.me/support/${superUserFeature ? 'disable' : 'enable'}`);
      window.scrollTo(0, 0);
      window.location.reload();
    },
    canBecomeSuperUser:
      cachedUser && cachedUser.projects && cachedUser.projects.some((p) => p.id === 'b9f7fbdd-ac07-45f9-84ea-d484533635ff'),
    superUserFeature,
  };
};
