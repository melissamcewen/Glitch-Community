import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Loader } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import TextInput from 'Components/inputs/text-input';
import Notification from 'Components/notification';
import useEmail from 'Hooks/use-email';
import { useAPI } from 'State/api';
import { captureException } from 'Utils/sentry';

import styles from './styles.styl';
import { emoji } from '../global.styl';

const GetMagicCode = ({ onCodeSent }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
  const [isFocused, setIsFocused] = useState(true);
  const [{ status, submitError }, setStatus] = useState({ status: 'ready' });
  const isEnabled = email.length > 0;

  async function onSubmit(e) {
    e.preventDefault();

    setStatus({ status: 'loading' });
    try {
      const data = { emailAddress: email };
      await api.post('/email/sendLoginEmail', data);
      onCodeSent(data);
    } catch (error) {
      if (error && error.response) {
        if (error.response.status === 429) {
          setStatus({ status: 'error', submitError: 'Sign in code sent recently. Please check your email.' });
        } else if (error.response.status === 400) {
          setStatus({ status: 'error', submitError: 'Email address is invalid.' });
        } else {
          captureException(error);
          setStatus({ status: 'error', submitError: 'Something went wrong, email not sent.' });
        }
      } else {
        captureException(error);
        setStatus({ status: 'error', submitError: 'Something went wrong, email not sent.' });
      }
    }
  }

  return (
    <div>
      <Text>Send a temporary code to your email.</Text>
      {status === 'ready' && (
        <form onSubmit={onSubmit} style={{ marginBottom: 10 }}>
          <TextInput
            type="email"
            labelText="Email address"
            value={email}
            onChange={setEmail}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            placeholder="new@user.com"
            error={isEnabled && !isFocused && validationError}
            autoFocus
            testingId="sign-in-email"
          />
          <div className={styles.submitWrap}>
            <Button disabled={!isEnabled || validationError} onClick={onSubmit}>
              Send a Code <Icon className={emoji} icon="loveLetter" />
            </Button>
          </div>
        </form>
      )}
      {status === 'loading' && <Loader />}
      {status === 'error' && (
        <>
          <Notification persistent type="error">
            Error
          </Notification>
          <div>{submitError}</div>
        </>
      )}
    </div>
  );
};

GetMagicCode.propTypes = {
  onCodeSent: PropTypes.func.isRequired,
};

export default GetMagicCode;
