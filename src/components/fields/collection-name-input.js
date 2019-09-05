import React from 'react';
import PropTypes from 'prop-types';

import OptimisticWrappingTextInput from './optimistic-wrapping-text-input';

const CollectionNameInput = ({ name, onChange }) => (
  <OptimisticWrappingTextInput
    labelText="Collection Name"
    value={name}
    onChange={onChange}
    placeholder="Name your collection"
    style={{ fontWeight: 'bold' }}
  />
);

CollectionNameInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CollectionNameInput;
