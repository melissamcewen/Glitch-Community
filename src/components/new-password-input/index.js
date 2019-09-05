import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { TextInput } from '@fogcreek/shared-components';

import useDebouncedValue from 'Hooks/use-debounced-value';
import PasswordStrength from './password-strength';

import styles from './new-password-input.styl';

// top worst passwords from Splashdata (https://en.wikipedia.org/wiki/List_of_the_most_common_passwords#cite_note-splashdata2018-10)
// edited to only include those with at least 8-character
// users aren't allowed to set their password to any of these items
const weakPWs = [
  'password',
  '123456789',
  '12345678',
  '11111111',
  'sunshine',
  'iloveyou',
  'princess',
  'football',
  '!@#$%^&*',
  'aa123456',
  'password1',
  'qwerty123',
];

const matchErrorMsg = 'Passwords do not match';
const weakPWErrorMsg = 'Password is too common';

const pwMinCharCount = 8;

const NewPasswordInput = ({ disabled, onChange }) => {
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const passwordConfirmError = useDebouncedValue(password && password2 && password !== password2, 500);

  // if password is part of weak pw list, show it as weak
  // has capital letter(s) = +1
  // has number(s) = +1
  // has special characters = +1
  // total = strength with 3=strong (💪), 1-2= ok (🙂), 0 = weak (😑)
  let weakPasswordError = false;
  let pwStrength = 0;
  if (!weakPWs.includes(password)) {
    const hasCapScore = /^(?=.*[A-Z])/.test(password) ? 1 : 0;
    const hasNumScore = /^(?=.*\d)/.test(password) ? 1 : 0;
    const hasCharScore = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 1 : 0;
    pwStrength = hasCapScore + hasNumScore + hasCharScore;
  } else {
    weakPasswordError = true;
  }

  React.useEffect(() => {
    if (password.length >= pwMinCharCount && !weakPasswordError && password === password2) {
      onChange(password);
    } else {
      onChange(null);
    }
  }, [password, password2, weakPasswordError]);

  return (
    <>
      <TextInput
        value={password}
        type="password"
        label="password"
        placeholder="new password"
        onChange={setPassword}
        disabled={disabled}
        error={weakPasswordError ? weakPWErrorMsg : null}
      />

      {password.length >= pwMinCharCount ? (
        <PasswordStrength strength={pwStrength} />
      ) : (
        password.length > 0 && (
          <div className={styles.passwordLength}>
            <span>
              <Pluralize count={pwMinCharCount - password.length} singular="character" /> to go....
            </span>
          </div>
        )
      )}

      <TextInput
        value={password2}
        type="password"
        labelText="confirm new password"
        placeholder="confirm new password"
        onChange={setPassword2}
        disabled={disabled}
        error={passwordConfirmError ? matchErrorMsg : null}
      />
    </>
  );
};

NewPasswordInput.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

NewPasswordInput.defaultProps = {
  disabled: false,
};

export default NewPasswordInput;
