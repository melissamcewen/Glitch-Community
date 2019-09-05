import React, { useState } from 'react';
import { TextInput } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Button from 'Components/buttons/button';
import Notification from 'Components/notification';
import NewPasswordInput from 'Components/new-password-input';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';

import styles from './styles.styl';

const ResetPassword = () => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();

  const [status, setStatus] = React.useState({});
  const primaryEmail = currentUser.emails.find((email) => email.primary);
  const resetPassword = async (event) => {
    event.preventDefault();
    setStatus({ working: true });
    try {
      await api.post('email/sendResetPasswordEmail', {
        emailAddress: primaryEmail.email,
      });
      setStatus({ done: true });
    } catch (error) {
      console.error(error);
      captureException(error);
      setStatus({ error: true });
    }
  };

  return (
    <>
      <Heading tagName="h2">Reset Password</Heading>
      <Button type="tertiary" size="small" disabled={status.working} onClick={resetPassword}>Send Reset Password Email</Button>
      {status.done && <Notification type="success" persistent>Sent a reset code to {primaryEmail.email}</Notification>}
      {status.error && <Notification type="error" persistent>Something went wrong, check your inbox?</Notification>}
    </>
  );
};

const PasswordSettings = () => {
  const api = useAPI();
  const { currentUser, reload } = useCurrentUser();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState(null);
  const [passwordVersion, setPasswordVersion] = useState(1);

  const [status, setStatus] = useState({});
  const andClearState = (func) => (...args) => {
    func(...args);
    setStatus({});
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setStatus({ working: true });
    try {
      await api.post('user/updatePassword', {
        oldPassword,
        newPassword,
      });
      setStatus({ done: true });
      setOldPassword('');
      setPasswordVersion((v) => v + 1);
      await reload();
    } catch (error) {
      console.error(error);
      setStatus({ error: true });
    }
  };

  const canSubmit = !status.working && !!newPassword && (!!oldPassword || !currentUser.passwordEnabled);

  return (
    <>
      <Heading tagName="h2">{currentUser.passwordEnabled ? 'Change Password' : 'Set Password'}</Heading>

      <form className={styles.accountSettingsForm} onSubmit={updatePassword}>
        {currentUser.passwordEnabled && (
          <TextInput type="password" label="current password" value={oldPassword} disabled={status.working} onChange={setOldPassword} />
        )}

        <NewPasswordInput key={passwordVersion} disabled={status.working} onChange={andClearState(setNewPassword)} />

        <Button type="tertiary" size="small" disabled={!canSubmit} submit>
          Set Password
        </Button>

        {status.done && <Notification type="success" persistent>Successfully set new password</Notification>}
        {status.error && <Notification type="error" persistent>We couldn't set the password</Notification>}
      </form>

      {currentUser.passwordEnabled && <ResetPassword />}
    </>
  );
};

export default PasswordSettings;
