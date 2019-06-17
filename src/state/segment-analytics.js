/* global analytics */

import React from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { captureException } from 'Utils/sentry';

const Context = React.createContext({ properties: {}, context: {} });

const resolveProperties = (properties, inheritedProperties) => {
  if (isFunction(properties)) {
    return properties(inheritedProperties);
  }
  return { ...inheritedProperties, ...properties };
};

// stick this in the tree to add a property value to any tracking calls within it
export const AnalyticsContext = ({ children, properties, context }) => {
  const inherited = React.useContext(Context);
  return (
    <Context.Provider
      value={{
        properties: resolveProperties(properties, inherited.properties),
        context: resolveProperties(context, inherited.context),
      }}
    >
      {children}
    </Context.Provider>
  );
};
AnalyticsContext.propTypes = {
  children: PropTypes.node.isRequired,
  properties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  context: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};
AnalyticsContext.defaultProps = {
  properties: {},
  context: {},
};

export const useTracker = (name, properties, context) => {
  const inherited = React.useContext(Context);
  return () => {
    try {
      analytics.track(name, resolveProperties(properties, inherited.properties), resolveProperties(context, inherited.context));
    } catch (error) {
      /*
      From Segment: "We currently return a 200 response for all API requests so debugging should be done in the Segment Debugger.
      The only exception is if the request is too large / json is invalid it will respond with a 400."
      If it was not a 400, it wasn't our fault so don't track it.
      */
      if (error && error.response && error.response.status === 400) {
        captureException(error);
      }
    }
  };
};

export const useTrackedFunc = (func, name, properties, context) => {
  const track = useTracker(name, properties, context);
  if (!func) return func;
  return (...funcArgs) => {
    track();
    return func(...funcArgs);
  };
};

export const useTrackedLink = (name, properties) => {
  const inherited = React.useContext(Context);

  const nameRef = React.useRef(name);
  const propertiesRef = React.useRef(properties);
  const inheritedRef = React.useRef(inherited.properties);
  React.useEffect(() => {
    nameRef.current = name;
    propertiesRef.current = properties;
    inheritedRef.current = inherited.properties;
  }, [name, properties, inherited.properties]);

  const ref = React.useRef(null);
  React.useEffect(() => {
    try {
      // we only call this on first render, use refs to keep the name/properties up to date
      analytics.trackLink(ref.current, () => nameRef.current, () => resolveProperties(propertiesRef.current, inheritedRef.current));
    } catch (error) {
      captureException(error);
    }
  }, []);
  return ref;
};
