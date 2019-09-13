import React from 'react';
import PropTypes from 'prop-types';
import { Button, TextInput } from '@fogcreek/shared-components';

import Notification from 'Components/notification';
import Text from 'Components/text/text';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

const TwoFactorSignIn = ({ initialToken, onSuccess }) => {
  const api = useAPI();
  const { login } = useCurrentUser();
  const [code, setCode] = React.useState('');
  const [token, setToken] = React.useState(initialToken);
  const [status, setStatus] = React.useState({});

  const onChange = (newCode) => {
    setCode(newCode);
    setStatus({});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ working: true });
    try {
      const { data } = await api.post('/user/tfa/verifyCode', { code, token });
      login(data.user);
      onSuccess();
    } catch (error) {
      if (error && error.response && error.response.data && error.response.data.status === 401) {
        setToken(error.response.data.retryToken);
        setStatus({ message: error.response.data.message });
      } else {
        setStatus({ error: true });
      }
    }
  };

  if (status.error) {
    return (
      <>
        <Notification type="error" persistent>Error</Notification>
        We couldn't sign you in
      </>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Notification type="success" persistent>Almost Done</Notification>
      <Text>Enter your two factor auth code to finish signing in</Text>
      <TextInput value={code} onChange={onChange} placeholder="123456 or a backup code" label="code" error={status.message} disabled={status.working} />
      <div className={styles.submitWrap}>
        <Button size="small" disabled={status.working || code.length < 6} onClick={onSubmit}>Sign in</Button>
      </div>
    </form>
  );
};

TwoFactorSignIn.propTypes = {
  initialToken: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
};

TwoFactorSignIn.defaultProps = {
  onSuccess: () => {},
};

export default TwoFactorSignIn;
