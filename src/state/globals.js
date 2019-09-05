import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

export const Context = createContext({});

export const GlobalsProvider = withRouter(({ children, history, location, origin, ...globals }) => {
  const value = useMemo(() => {
    const url = new URL(location.pathname + location.search + location.hash, origin);
    return { history, location: url, origin, ...globals };
  }, [history, location.key, origin, ...Object.values(globals)]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
});

GlobalsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  origin: PropTypes.string.isRequired,
  AB_TESTS: PropTypes.object.isRequired,
  EXTERNAL_ROUTES: PropTypes.array.isRequired,
  HOME_CONTENT: PropTypes.object.isRequired,
  SSR_SIGNED_IN: PropTypes.bool.isRequired,
  ZINE_POSTS: PropTypes.array.isRequired,
};

export const useGlobals = () => useContext(Context);
