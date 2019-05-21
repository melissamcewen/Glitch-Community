import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { parseOneAddress } from 'email-addresses';
import { debounce } from 'lodash';

import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import Link from 'Components/link';
import { PopoverWithButton, MultiPopover, MultiPopoverTitle, PopoverDialog, PopoverActions, PopoverInfo } from 'Components/popover';
import useLocalStorage from 'State/local-storage';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import useDevToggle from '../../presenters/includes/dev-toggles';
import styles from './styles.styl';

/* global GITHUB_CLIENT_ID, FACEBOOK_CLIENT_ID, APP_URL, API_URL */

function githubAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function facebookAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

function googleAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/google`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/google?${params}`;
}

function slackAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/slack`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/slack?${params}`;
}

const SignInPopButton = ({ company, emoji, href, onClick }) => (
  <Button href={href} onClick={onClick} size="small">
    Sign in with {company} <Emoji name={emoji} />
  </Button>
);

const SignInCodeSection = ({ onClick }) => (
  <PopoverActions type="secondary">
    <Button size="small" type="tertiary" matchBackground onClick={onClick}>
      Use a sign in code
    </Button>
  </PopoverActions>
);

function useEmail() {
  const [email, setEmailValue] = useState('');
  const [validationError, setValidationError] = useState(null);
  const validate = useMemo(
    () =>
      debounce((value) => {
        const isValidEmail = parseOneAddress(value) !== null;
        setValidationError(isValidEmail ? null : 'Enter a valid email address');
      }),
    [],
  );

  const setEmail = (value) => {
    setEmailValue(value);
    validate(value);
  };
  return [email, setEmail, validationError];
}

const EmailHandler = ({ showView }) => {
  const api = useAPI();
  const [email, setEmail, validationError] = useEmail();
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
    <PopoverDialog align="right">
      <MultiPopoverTitle>
        Email Sign In <Emoji name="email" />
      </MultiPopoverTitle>
      <PopoverActions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }}>
            <TextInput type="email" labelText="Email address" value={email} onChange={setEmail} placeholder="new@user.com" error={validationError} />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Send Link
              </Button>
            </div>
          </form>
        )}
        {status === 'done' && (
          <>
            <div className="notification notifyPersistent notifySuccess">Almost Done</div>
            <div>Finish signing in from the email sent to {email}.</div>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="notification notifyPersistent notifyError">Error</div>
            <div>{submitError}</div>
          </>
        )}
      </PopoverActions>
      {status === 'done' && <SignInCodeSection onClick={showView.signInCode} />}
    </PopoverDialog>
  );
};

const SignInWithCode = () => {
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
      login(data);
      setStatus('done');
    } catch (error) {
      if (error && error.response && error.response.status !== 401) {
        captureException(error);
      }
      setStatus('error');
    }
  }

  return (
    <PopoverDialog align="right">
      <MultiPopoverTitle>Use a sign in code</MultiPopoverTitle>
      <PopoverActions>
        {status === 'ready' && (
          <form onSubmit={onSubmit} style={{ marginBottom: 0 }}>
            Paste your temporary sign in code below
            <TextInput value={code} onChange={setCode} type="text" labelText="sign in code" placeholder="cute-unique-cosmos" />
            <div className={styles.submitWrap}>
              <Button size="small" disabled={!isEnabled} onClick={onSubmit}>
                Sign In
              </Button>
            </div>
          </form>
        )}
        {status === 'done' && <div className="notification notifyPersistent notifySuccess">Success!</div>}
        {status === 'error' && (
          <>
            <div className="notification notifyPersistent notifyError">Error</div>
            <div>Code not found or already used. Try signing in with email.</div>
          </>
        )}
      </PopoverActions>
    </PopoverDialog>
  );
};

const SignInPopBase = withRouter(({ location, align }) => {
  const slackAuthEnabled = useDevToggle('Slack Auth');
  const [, setDestination] = useLocalStorage('destinationAfterAuth');
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

  return (
    <MultiPopover
      views={{
        email: (showView) => <EmailHandler showView={showView} />,
        signInCode: () => <SignInWithCode />,
      }}
    >
      {(showView) => (
        <PopoverDialog focusOnDialog align={align}>
          <PopoverInfo type="secondary">
            <Emoji name="carpStreamer" /> New to Glitch? Create an account by signing in.
          </PopoverInfo>
          <PopoverInfo type="secondary">
            <div className={styles.termsAndConditions}>
              By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and{' '}
              <Link to="/legal/#privacy">Privacy Statement</Link>
            </div>
          </PopoverInfo>
          <PopoverActions>
            <SignInPopButton href={facebookAuthLink()} company="Facebook" emoji="facebook" onClick={onClick} />
            <SignInPopButton href={githubAuthLink()} company="GitHub" emoji="octocat" onClick={onClick} />
            <SignInPopButton href={googleAuthLink()} company="Google" emoji="google" onClick={onClick} />
            {slackAuthEnabled && <SignInPopButton href={slackAuthLink()} company="Slack" emoji="slack" onClick={onClick} />}
            <Button size="small" onClick={setDestinationAnd(showView.email)}>
              Sign in with Email <Emoji name="email" />
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
