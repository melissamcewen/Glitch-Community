import { Context as GlobalsContext } from 'State/globals';
import { Context as CurrentUserContext } from 'State/current-user';
import { Context as APIContext } from 'State/api';

/* eslint-disable import/prefer-default-export */

import React, { useState } from 'react';

export const withState = (initState, Component) => {
  const WrappedComponent = () => {
    const [state, setState] = useState(initState);
    return <Component state={state} setState={setState} />;
  };
  return () => <WrappedComponent />;
};

export const provideContext = (
  { currentUser = {}, currentUserFetched = true, api = {} } = {},
  Component,
) => () => (
  <GlobalsContext.Provider value={{
    location: new URL(window.location.origin),
    origin: window.location.origin,
    EXTERNAL_ROUTES: [],
    HOME_CONTENT: {},
    SSR_SIGNED_IN: false,
    ZINE_POSTS: [],
  }}>
    <CurrentUserContext.Provider value={{ currentUser, fetched: currentUserFetched }}>
      <APIContext.Provider value={api}>
        <Component />
      </APIContext.Provider>
    </CurrentUserContext.Provider>
  </GlobalsContext.Provider>
);
