import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import {Button, Icon, Loader, TextInput } from '@fogcreek/shared-components';

import SignInButton from 'Components/buttons/sign-in-button';
import Link from 'Components/link';
import Notification from 'Components/notification';
import TwoFactorForm from 'Components/sign-in/two-factor-form';
import { PopoverWithButton, MultiPopover, MultiPopoverTitle, PopoverDialog, PopoverActions, PopoverInfo } from 'Components/popover';
import useEmail from 'Hooks/use-email';
import useLocalStorage from 'State/local-storage';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { captureException } from 'Utils/sentry';

import styles from './styles.styl';
import { emoji } from '../global.styl';

const SignInCodeSection = ({ onClick }) => (
  <PopoverActions type="secondary">
    <Button size="small" variant="secondary" matchBackground onClick={onClick}>
      Use a sign in code
    </Button>
  </PopoverActions>
);

const ForgotPasswordHandler = ({ align }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
  const [{ status, errorMessage }, setState] = useState({ status: 'active', errorMessage: null });

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({ status: 'working', error: null });

    try {
      await api.post('email/sendResetPasswordEmail', { emailAddress: email });
      setState({ status: 'done', error: null });
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      setState({ status: 'done', errorMessage: message || 'Something went wrong' });
    }
  };

  const isWorking = status === 'working';
  const isDone = status === 'done';
  const isEnabled = email.length > 0 && !isWorking;
  return (
    <PopoverDialog align={align}>
      <MultiPopoverTitle>Forgot Password</MultiPopoverTitle>
      <PopoverActions>
        {!isDone && (
          <form onSubmit={onSubmit}>
            <TextInput
              type="email"
              label="Email address"
              value={email}
              onChange={setEmail}
              placeholder="your@email.com"
              error={validationError}
              disabled={isWorking}
              testingId="reset-password-email"
            />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Send Reset Password Link
              </Button>
            </div>
          </form>
        )}
        {isDone && !errorMessage && (
          <>
            <Notification type="success" persistent>
              Almost Done
            </Notification>
            <div>Reset your password by clicking the link sent to {email}.</div>
          </>
        )}
        {isDone && errorMessage && (
          <>
            <Notification type="error" persistent>
              Error
            </Notification>
            <div>{errorMessage}</div>
          </>
        )}
      </PopoverActions>
    </PopoverDialog>
  );
};

const EmailHandler = ({ align, showView }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
  const [isFocused, setIsFocused] = useState(true);
  const [{ status, submitError }, setStatus] = useState({ status: 'ready' });
  const isEnabled = email.length > 0;

  async function onSubmit(e) {
    e.preventDefault();

    setStatus({ status: 'loading' });
    try {
      await api.post('/email/sendLoginEmail', { emailAddress: email });
      setStatus({ status: 'done' });
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
    <PopoverDialog align={align}>
      <MultiPopoverTitle>
        Email Sign In&nbsp;<Icon className={emoji} icon="email" />
      </MultiPopoverTitle>
      <PopoverActions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }}>
            <TextInput
              type="email"
              label="Email address"
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
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Send Link
              </Button>
            </div>
          </form>
        )}
        {status === 'loading' && <Loader style={{ width: '25px' }} />}
        {status === 'done' && (
          <>
            <Notification persistent type="success">
              Almost Done
            </Notification>
            <div>Finish signing in from the email sent to {email}.</div>
          </>
        )}
        {status === 'error' && (
          <>
            <Notification persistent type="error">
              Error
            </Notification>
            <div>{submitError}</div>
          </>
        )}
      </PopoverActions>
      {status === 'done' && <SignInCodeSection onClick={showView.signInCode} />}
    </PopoverDialog>
  );
};

const SignInWithCode = ({ align, showTwoFactor }) => {
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
        showTwoFactor(data.tfaToken);
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
    <PopoverDialog align={align}>
      <MultiPopoverTitle>Use a sign in code</MultiPopoverTitle>
      <PopoverActions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }} data-cy="sign-in-code-form">
            Paste your temporary sign in code below
            <TextInput
              value={code}
              onChange={setCode}
              type="text"
              label="sign in code"
              placeholder="cute-unique-cosmos"
              autoFocus
              testingId="sign-in-code"
            />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Sign In
              </Button>
            </div>
          </form>
        )}
        {status === 'loading' && <Loader />}
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
            <div>Code not found or already used. Try signing in with email.</div>
          </>
        )}
      </PopoverActions>
    </PopoverDialog>
  );
};

const TwoFactorSignIn = ({ align, token }) => (
  <PopoverDialog align={align}>
    <MultiPopoverTitle>
      Two factor auth <Icon className={emoji} icon="key" />
    </MultiPopoverTitle>
    <PopoverActions>
      <TwoFactorForm initialToken={token} />
    </PopoverActions>
  </PopoverDialog>
);

const PasswordLoginSection = ({ showTwoFactor, showForgotPassword }) => {
  const [emailAddress, setEmail, emailValidationError] = useEmail();
  const [password, setPassword] = useState('');
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const api = useAPI();
  const { login } = useCurrentUser();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setWorking(true);
    setErrorMessage(null);

    try {
      const { data } = await api.post('user/login', { emailAddress, password });
      // leave working=true because logging in will hide the sign in pop
      if (data.tfaToken) {
        showTwoFactor(data.tfaToken);
      } else {
        login(data);
      }
    } catch (error) {
      let message = error.response && error.response.data && error.response.data.message;
      if (!message || error.response.status === 401) {
        message = 'Failed to sign in, try again?';
      }
      setErrorMessage(message);
      setWorking(false);
    }
  };

  return (
    <PopoverActions>
      {!!errorMessage && (
        <Notification type="error" persistent>
          {errorMessage}
        </Notification>
      )}
      <form data-cy="sign-in-form" onSubmit={handleSubmit}>
        <TextInput
          placeholder="your@email.com"
          label="email"
          value={emailAddress}
          error={emailValidationError}
          onChange={setEmail}
          disabled={working}
          testingId="sign-in-email"
        />
        <TextInput
          placeholder="password"
          type="password"
          label="password"
          value={password}
          onChange={setPassword}
          disabled={working}
          testingId="sign-in-password"
        />
        <div className={styles.submitWrap}>
          <Button size="small" disabled={!emailAddress || !password || emailValidationError || working} onClick={handleSubmit}>
            Sign in
          </Button>
        </div>
      </form>
      <div className={styles.submitWrap}>
        <Button size="small" variant="secondary" onClick={showForgotPassword}>
          Forgot Password
        </Button>
      </div>
    </PopoverActions>
  );
};

export const SignInPopBase = withRouter(({ location, align }) => {
  const userPasswordEnabled = useDevToggle('User Passwords');
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
  const [tfaToken, setTfaToken] = React.useState('');

  const onClick = () =>
    setDestination({
      expires: dayjs()
        .add(10, 'minutes')
        .toISOString(),
      to: {
        pathname: location.pathname,
        search: location.search,
      },
    });

  const setDestinationAnd = (next) => () => {
    onClick();
    next();
  };

  const setTwoFactorAnd = (next) => (token) => {
    setTfaToken(token);
    next();
  };

  return (
    <MultiPopover
      views={{
        email: (showView) => <EmailHandler align={align} showView={showView} />,
        signInCode: (showView) => <SignInWithCode align={align} showTwoFactor={setTwoFactorAnd(showView.twoFactor)} />,
        twoFactor: () => <TwoFactorSignIn align={align} token={tfaToken} />,
        forgotPassword: () => <ForgotPasswordHandler align={align} />,
      }}
    >
      {(showView) => (
        <PopoverDialog focusOnDialog align={align}>
          <PopoverInfo>
            <Icon className={emoji} icon="carpStreamer" /> New to Glitch? Create an account by signing in.
          </PopoverInfo>
          <PopoverInfo>
            <div className={styles.termsAndConditions}>
              By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and{' '}
              <Link to="/legal/#privacy">Privacy Statement</Link>
            </div>
          </PopoverInfo>
          {userPasswordEnabled && (
            <PasswordLoginSection showTwoFactor={setTwoFactorAnd(showView.twoFactor)} showForgotPassword={showView.forgotPassword} />
          )}
          <PopoverActions>
            <SignInButton companyName="facebook" onClick={onClick} />
            <SignInButton companyName="github" onClick={onClick} />
            <SignInButton companyName="google" onClick={onClick} />
            <Button size="small" onClick={setDestinationAnd(showView.email)}>
              Sign in with Email <Icon className={emoji} icon="email" />
            </Button>
          </PopoverActions>
          <SignInCodeSection onClick={setDestinationAnd(showView.signInCode)} />
        </PopoverDialog>
      )}
    </MultiPopover>
  );
});

const SignInPopContainer = ({ align }) => (
  <PopoverWithButton buttonProps={{ size: 'small' }} buttonText="Sign in">
    {() => <SignInPopBase align={align} />}
  </PopoverWithButton>
);

SignInPopContainer.propTypes = {
  align: PropTypes.string.isRequired,
};

export default SignInPopContainer;
