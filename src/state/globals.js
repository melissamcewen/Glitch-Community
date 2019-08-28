import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

export const Context = createContext({});

export const GlobalsProvider = withRouter(({ children, history, location, origin, SSR_SIGNED_IN, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES }) => {
  const value = useMemo(() => {
    const url = new URL(location.pathname + location.search + location.hash, origin);
    return { history, location: url, origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES, SSR_SIGNED_IN };
  }, [history, location.key, origin, ZINE_POSTS, HOME_CONTENT, EXTERNAL_ROUTES, SSR_SIGNED_IN]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
});

GlobalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  ZINE_POSTS: PropTypes.array.isRequired,
  HOME_CONTENT: PropTypes.object.isRequired,
  EXTERNAL_ROUTES: PropTypes.array.isRequired,
};

export const useGlobals = () => useContext(Context);
