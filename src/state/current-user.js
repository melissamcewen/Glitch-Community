import React from 'react';
import PropTypes from 'prop-types';

import { getSingleItem, getAllPages, allByKeys } from 'Shared/api';
import { sortProjectsByLastAccess } from 'Models/project';
import { configureScope, captureException, captureMessage, addBreadcrumb } from 'Utils/sentry';
import useLocalStorage from './local-storage';
import { getAPIForToken } from './api';

export const Context = React.createContext();

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

function identifyUser(user) {
  const analytics = { window };
  if (user) {
    addBreadcrumb({
      level: 'info',
      message: `Current user is ${JSON.stringify(user)}`,
    });
  } else {
    addBreadcrumb({
      level: 'info',
      message: 'logged out',
    });
  }
  try {
    if (analytics && analytics.identify && user && user.login) {
      const emailObj = Array.isArray(user.emails) && user.emails.find((email) => email.primary);
      const email = emailObj && emailObj.email;
      analytics.identify(
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
  if (a && b && a.id === b.id && a.persistentToken === b.persistentToken) {
    return true;
  }
  if (!a && !b) {
    return true;
  }
  return false;
}

// This takes sharedUser and cachedUser
// sharedUser is stored in localStorage['cachedUser']
// cachedUser is stored in localStorage['community-cachedUser']
// sharedUser syncs with the editor and is authoritative on id and persistentToken
// cachedUser mirrors GET /users/{id} and is what we actually display

class CurrentUserManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: false, // Set true on first complete load
      working: false, // Used to prevent simultaneous loading
    };
  }

  componentDidMount() {
    identifyUser(this.props.cachedUser);
    this.load();
  }

  componentDidUpdate(prev) {
    const { cachedUser, sharedUser } = this.props;

    if (!usersMatch(cachedUser, prev.cachedUser)) {
      identifyUser(cachedUser);
    }

    if (!usersMatch(cachedUser, sharedUser) || !usersMatch(sharedUser, prev.sharedUser)) {
      // delay loading a moment so both items from storage have a chance to update
      setTimeout(() => this.load(), 1);
    }

    // hooks for easier debugging
    window.currentUser = cachedUser;
    window.api = this.api();
  }

  async getAnonUser() {
    const { data } = await this.api().post('users/anon');
    return data;
  }

  async getSharedUser() {
    const persistentToken = this.persistentToken();
    if (!persistentToken) {
      return undefined;
    }
    try {
      return await getSingleItem(this.api(), `v1/users/by/persistentToken?persistentToken=${persistentToken}`, persistentToken);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return undefined;
      }
      throw error;
    }
  }

  async getCachedUser() {
    const { sharedUser } = this.props;
    if (!sharedUser) return undefined;
    if (!sharedUser.id || !sharedUser.persistentToken) return 'error';
    try {
      const api = this.api();
      const makeUrl = (type) => `v1/users/by/id/${type}?id=${sharedUser.id}&limit=100`;
      const makeOrderedUrl = (type, order, direction) => `${makeUrl(type)}&orderKey=${order}&orderDirection=${direction}`;
      const {
        baseUser, emails, projects, teams, collections,
      } = await allByKeys({
        baseUser: getSingleItem(api, `v1/users/by/id?id=${sharedUser.id}`, sharedUser.id),
        emails: getAllPages(api, makeUrl('emails')),
        projects: getAllPages(api, makeOrderedUrl('projects', 'domain', 'ASC')),
        teams: getAllPages(api, makeOrderedUrl('teams', 'url', 'ASC')),
        collections: getAllPages(api, makeUrl('collections')),
      });
      const user = { ...baseUser, emails, projects: sortProjectsByLastAccess(projects), teams, collections };
      if (!usersMatch(sharedUser, user)) {
        return 'error';
      }
      return user;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 404)) {
        // 401 means our token is bad, 404 means the user doesn't exist
        return 'error';
      }
      throw error;
    }
  }

  persistentToken() {
    const { sharedUser } = this.props;
    return sharedUser ? sharedUser.persistentToken : null;
  }

  api() {
    return getAPIForToken(this.persistentToken());
  }

  async load() {
    if (this.state.working) return;
    this.setState({ working: true });
    let { sharedUser } = this.props;

    // If we're signed out create a new anon user
    if (!sharedUser) {
      sharedUser = await this.getAnonUser();
      this.props.setSharedUser(sharedUser);
    }

    // Check if we have to clear the cached user
    if (!usersMatch(sharedUser, this.props.cachedUser)) {
      this.props.setCachedUser(undefined);
    }

    const newCachedUser = await this.getCachedUser();
    if (newCachedUser === 'error') {
      // Looks like our sharedUser is bad, make sure it wasn't changed since we read it
      // Anon users get their token and id deleted when they're merged into a user on sign in
      // If it did change then quit out and let componentDidUpdate sort it out
      if (usersMatch(sharedUser, this.props.sharedUser)) {
        // The user wasn't changed, so we need to fix it
        this.setState({ fetched: false });
        const newSharedUser = await this.getSharedUser();
        this.props.setSharedUser(newSharedUser);
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
      }
    } else {
      // The shared user is good, store it
      this.props.setCachedUser(newCachedUser);
      this.setState({ fetched: true });
    }

    this.setState({ working: false });
  }

  async login(user) {
    this.props.setSharedUser(user);
    this.props.setCachedUser(undefined);
  }
  
  isSuperUser() {
    const { sharedUser } = this.props;
    return sharedUser ? sharedUser.persistentToken : null;
  }
  
  superUserHelpers() {
    return {
      toggleSuperUser: async () => {
        const api = useAPI();
        await api.post(`https://support-toggle.glitch.me/support/${superUser ? 'disable' : 'enable'}`);
        window.location.reload();
      },
      canBecomeSuperUser: () => {
        return currentUser && currentUser.projects && currentUser.projects.filter((p) => p.id === 'b9f7fbdd-ac07-45f9-84ea-d484533635ff').length > 0;
      },
      getFeature: () => {
        return currentUser.features && currentUser.features.find((feature) => feature.name === 'super_user');
      }
    }

  };

  update(changes) {
    this.props.setCachedUser({
      ...this.props.cachedUser,
      ...changes,
    });
  }

  async logout() {
    this.props.setSharedUser(undefined);
    this.props.setCachedUser(undefined);
  }

  render() {
    const { children, sharedUser, cachedUser } = this.props;
    return children({
      currentUser: { ...defaultUser, ...sharedUser, ...cachedUser },
      persistentToken: this.persistentToken(),
      fetched: !!cachedUser && this.state.fetched,
      reload: () => this.load(),
      login: (user) => this.login(user),
      update: (changes) => this.update(changes),
      clear: () => this.logout(),
    });
  }
}
CurrentUserManager.propTypes = {
  sharedUser: PropTypes.shape({
    id: PropTypes.number,
    persistentToken: PropTypes.string,
  }),
  cachedUser: PropTypes.object,
  setSharedUser: PropTypes.func.isRequired,
  setCachedUser: PropTypes.func.isRequired,
};

CurrentUserManager.defaultProps = {
  cachedUser: null,
  sharedUser: null,
};

export const CurrentUserProvider = ({ children }) => {
  const [sharedUser, setSharedUser] = useLocalStorage('cachedUser', null);
  const [cachedUser, setCachedUser] = useLocalStorage('community-cachedUser', null);
  return (
    <CurrentUserManager sharedUser={sharedUser} setSharedUser={setSharedUser} cachedUser={cachedUser} setCachedUser={setCachedUser}>
      {(props) => <Context.Provider value={props}>{children}</Context.Provider>}
    </CurrentUserManager>
  );
};
CurrentUserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCurrentUser = () => React.useContext(Context);

export function normalizeUser(user, currentUser) {
  return user.id === (currentUser && currentUser.id) ? currentUser : user;
}

export function normalizeUsers(users, currentUser) {
  return users.map((user) => normalizeUser(user, currentUser));
}

export function normalizeProject({ users, ...project }, currentUser) {
  return { users: users ? normalizeUsers(users, currentUser) : [], ...project };
}

export function normalizeProjects(projects, currentUser) {
  return projects.map((project) => normalizeProject(project, currentUser));
}
