import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import dayjs from 'dayjs';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useLocalStorage from 'State/local-storage';

import Button from 'Components/buttons/button';
import Notification from 'Components/notification';
import Text from 'Components/text/text';

import AuthLayout from 'Components/layout/auth-layout';
import NewPasswordInput from 'Components/new-password-input';
import { EmailTokenLoginPage } from './callbacks';

import styles from './reset-password.styl';

const ResetPasswordLogin = ({ loginToken, resetPasswordToken }) => {
  const [ready, setReady] = React.useState(false);
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
  React.useEffect(() => {
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: '/login/reset-password',
        search: `resetPasswordToken=${resetPasswordToken}`,
      },
    });
    setReady(true);
  }, []);
  return ready ? <EmailTokenLoginPage token={loginToken} /> : null;
};

const ResetPasswordForm = ({ resetPasswordToken }) => {
  const api = useAPI();
  const [password, setPassword] = React.useState(null);
  const [state, setState] = React.useState({});

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ working: true });
    try {
      await api.post('/user/updatePasswordWithToken', {
        token: resetPasswordToken,
        password,
      });
      setState({ done: true });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.status === 401) {
        setState({ error: 'This password reset request has already been used' });
      } else {
        setState({ error: 'Something went wrong setting your password' });
      }
    }
  };

  if (state.done) {
    return <Redirect to="/" />;
  }

  return (
    <AuthLayout>
      <Text>Enter a new password</Text>
      {state.error ? (
        <>
          <Notification type="error" persistent>
            Error
          </Notification>
          <Text>{state.error}</Text>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <NewPasswordInput disabled={state.working} onChange={setPassword} />
          <div className={styles.submitWrap}>
            <Button size="small" disabled={!password || state.working} submit>
              Set Password
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

const ResetPasswordPage = ({ loginToken, resetPasswordToken }) => {
  const { currentUser } = useCurrentUser();
  if (loginToken && resetPasswordToken) {
    return <ResetPasswordLogin loginToken={loginToken} resetPasswordToken={resetPasswordToken} />;
  }
  if (resetPasswordToken && currentUser && currentUser.login) {
    return <ResetPasswordForm resetPasswordToken={resetPasswordToken} />;
  }
  // Something went wrong
  return <Redirect to="/" />;
};

ResetPasswordPage.propTypes = {
  loginToken: PropTypes.string,
  resetPasswordToken: PropTypes.string.isRequired,
};

ResetPasswordPage.defaultProps = {
  loginToken: null,
};

export default ResetPasswordPage;
