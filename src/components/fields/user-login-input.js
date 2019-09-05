import React from 'react';
import PropTypes from 'prop-types';

import OptimisticTextInput from './optimistic-text-input';

const UserLoginInput = ({ login, onChange }) => (
  <OptimisticTextInput
    labelText="User Login"
    value={login}
    onChange={onChange}
    placeholder="Nickname?"
    prefix="@"
    style={{ fontWeight: 'bold' }}
  />
);

UserLoginInput.propTypes = {
  login: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UserLoginInput;
