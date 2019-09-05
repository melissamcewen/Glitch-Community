import React, { useState } from 'react';
import { Loader, TextInput } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import Notification from 'Components/notification';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';

import styles from './styles.styl';

const UseMagicCode = () => {
  const { login } = useCurrentUser();
  const api = useAPI();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('ready');
  const isEnabled = code.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data } = await api.post(`/auth/email/${code}`);
      if (data.tfaToken) {
        // TODO: Support 2FA here
        setStatus('error');
      } else {
        login(data);
        setStatus('done');
      }
    } catch (error) {
      if (error && error.response && error.response.status !== 401) {
        captureException(error);
      }
      setStatus('error');
    }
  }

  return (
    <div>
      <Text>Now paste the code here to sign in.</Text>
      {status === 'loading' ? (
        <Loader />
      ) : (
        <form onSubmit={onSubmit} style={{ marginBottom: 10 }} data-cy="sign-in-code-form">
          <TextInput
            value={code}
            onChange={setCode}
            type="text"
            label="sign in code"
            placeholder="cute-unique-cosmos"
            testingId="sign-in-code"
          />
          <div className={styles.submitWrap}>
            <Button disabled={!isEnabled} onClick={onSubmit}>
              Sign In
            </Button>
          </div>
        </form>
      )}
      {status === 'done' && (
        <Notification persistent type="success">
          Success!
        </Notification>
      )}
      {status === 'error' && (
        <>
          <Notification persistent type="error">
            Error
          </Notification>
          <Text>Code not found or already used. Try signing in with email.</Text>
        </>
      )}
    </div>
  );
};

export default UseMagicCode;
