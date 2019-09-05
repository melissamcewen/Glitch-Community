import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const UserNameInput = ({ name, onChange }) => (
  <OptimisticTextInput
    labelText="User Name"
    value={name}
    onChange={onChange}
    placeholder="What's your name?"
    style={{ fontWeight: 'bold' }}
  />
);

UserNameInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UserNameInput;
