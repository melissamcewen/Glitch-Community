import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@fogcreek/shared-components';

import usePassivelyTrimmedInput from './use-passively-trimmed-input';
import useOptimisticValue from './use-optimistic-value';

const OptimisticTextInput = ({ value, onChange, onBlur, ...props }) => {
  const [untrimmedValue, onChangeWithTrimmedInputs, onBlurWithTrimmedInputs] = usePassivelyTrimmedInput(value, onChange, onBlur);
  const [optimisticValue, optimisticOnChange, optimisticOnBlur, optimisticError] = useOptimisticValue(
    untrimmedValue,
    onChangeWithTrimmedInputs,
    onBlurWithTrimmedInputs,
  );

  return <TextInput {...props} value={optimisticValue} onChange={optimisticOnChange} onBlur={optimisticOnBlur} error={optimisticError} />;
};

OptimisticTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptimisticTextInput;
