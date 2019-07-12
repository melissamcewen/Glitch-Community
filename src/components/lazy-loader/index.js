import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function LazyLoader({ children, delay }) {
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(
    () => {
      const timer = window.setTimeout(() => setShouldLoad(true), delay);
      return () => window.clearTimeout(timer);
    },
    [delay],
  );

  return shouldLoad ? children : null;
}

LazyLoader.propTypes = {
  // time to delay load in ms
  delay: PropTypes.number.isRequired,
};

export default LazyLoader;
