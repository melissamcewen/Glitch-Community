import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@fogcreek/shared-components';

import { useAPI } from 'State/api';
import { captureException } from 'Utils/sentry';

const DataLoader = ({ children, get, renderError, renderLoader, captureException: shouldCaptureException, args }) => {
  const [{ status, value }, setState] = useState({ status: 'loading', value: null });
  const api = useAPI();

  useEffect(() => {
    let isCurrent = true;
    get(api, args).then(
      (data) => {
        if (!isCurrent) return;
        setState({ status: 'ready', value: data });
      },
      (error) => {
        console.error(error);
        if (!isCurrent) return;
        setState({ status: 'error', value: error });
        if (shouldCaptureException) {
          captureException(error);
        }
      },
    );
    return () => {
      isCurrent = false;
      setState({ status: 'loading', value: null });
    };
  }, [api, args]);

  if (status === 'ready') return children(value);
  if (status === 'error') return renderError(value);
  return renderLoader();
};

DataLoader.propTypes = {
  children: PropTypes.func.isRequired,
  get: PropTypes.func.isRequired,
  renderError: PropTypes.func,
  renderLoader: PropTypes.func,
  captureException: PropTypes.func,
  args: PropTypes.any,
};
DataLoader.defaultProps = {
  renderError: () => 'Something went wrong, try refreshing?',
  renderLoader: () => <Loader style={{ width: '25px' }} />,
  captureException: undefined,
  args: undefined,
};
export default DataLoader;
