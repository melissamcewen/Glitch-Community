import { Context as CurrentUserContext } from '../src/state/current-user';
import { Context as APIContext } from '../src/state/api';
import { Context as UserPrefsContext } from '../src/presenters/includes/user-prefs';
import { Context as DevTogglesContext } from '../src/presenters/includes/dev-toggles';

/* eslint-disable import/prefer-default-export */

import React, { useState } from 'react';

export const withState = (initState, Component) => {
  const WrappedComponent = () => {
    const [state, setState] = useState(initState);
    return <Component state={state} setState={setState} />;
  };
  return () => <WrappedComponent />;
};

const log = console.log.bind(console);

const defaultUserPrefs = {
  prefs: {},
  set: log,
};

const defaultDevToggles = {
  enabledToggles: [],
  toggleData: log,
  setEnabledToggles: log,
};

export const provideContext = (
  { userPrefs = defaultUserPrefs, devToggles = defaultDevToggles, currentUser = {}, currentUserFetched = true, api = {} } = {},
  Component,
) => () => (
  <UserPrefsContext.Provider value={userPrefs}>
    <DevTogglesContext.Provider value={devToggles}>
      <CurrentUserContext.Provider value={{ currentUser, fetched: currentUserFetched }}>
        <APIContext.Provider value={api}>
          <Component />
        </APIContext.Provider>
      </CurrentUserContext.Provider>
    </DevTogglesContext.Provider>
  </UserPrefsContext.Provider>
);
