/* globals analytics */

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { captureException } from 'Utils/sentry';
import { APP_URL } from 'Utils/constants';

import useLocalStorage from 'State/local-storage';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import TwoFactorCodePage from '../two-factor-code';
import { EmailErrorPage, OauthErrorPage } from '../error';

// The Editor may embed /login/* endpoints in an iframe in order to share code.
// NotifyParent allows the editor to receive messages from this page.
// We use this to pass on auth success/failure messages.
function notifyParent(message = {}) {
  if (window.parent === window) {
    return;
  }

  // Specifically target our same origin (APP_URL) ;
  // we're only communicating between the editor and its corresponding ~community site,
  // not across other environments.

  // Add 'LoginMessage' to all messages of this type so that the Editor
  // can filter for them specifically.
  message.type = 'LoginMessage';

  window.parent.postMessage(message, APP_URL);
}

const RedirectToDestination = () => {
  const [destination, setDestination] = useLocalStorage('destinationAfterAuth', null);

  React.useEffect(() => {
    setDestination(undefined);
  }, []);

  if (destination && destination.expires > new Date().toISOString()) {
    return <Redirect to={destination.to} />;
  }

  return <Redirect to="/" />;
};

const LoginPage = ({ provider, url }) => {
  const api = useAPI();
  const { login } = useCurrentUser();

  const [state, setState] = React.useState({ status: 'active' });
  const setDone = () => setState({ status: 'done' });
  const setError = (title, message) => setState({ status: 'error', title, message });
  const setTwoFactor = (token) => setState({ status: 'tfa', token });

  const perform = async () => {
    try {
      const { data } = await api.post(url);
      if (data.tfaToken) {
        setTwoFactor(data.tfaToken);
      } else if (!data.id || data.id <= 0) {
        throw new Error(`Bad user id (${data.id}) after ${provider} login`);
      } else {
        console.log('LOGGED IN', data.id);
        login(data);

        setDone();
        analytics.track('Signed In', { provider });
        notifyParent({ success: true, details: { provider } });
      }
    } catch (error) {
      const errorData = error && error.response && error.response.data;
      setError(undefined, errorData && errorData.message);

      if (error && error.response) {
        if (error.response.status === 403) {
          // Our API returns a 403 when the login provider didn't return an email address
          // We can suggest using email for login and avoid capturing this error in Sentry
          const title = 'Missing Email Address';
          const message = `${provider} didn't return an email address for your account.  Try using "Sign in with Email" instead to create an account on Glitch.`;
          setError(title, message);
        } else if (error.response.status !== 401) {
          console.error('Login error.', errorData);
          captureException(error);
        }
      }
      const details = { provider, error: errorData };
      notifyParent({ success: false, details });
    }
  };
  React.useEffect(() => {
    perform();
  }, [provider, url]);

  if (state.status === 'done') {
    return <RedirectToDestination />;
  }
  if (state.status === 'error') {
    const genericTitle = `${provider} Login Problem`;
    const genericDescription = "Hard to say what happened, but we couldn't log you in. Try again?";
    const errorTitle = state.title || genericTitle;
    const errorMessage = state.message || genericDescription;
    if (provider === 'Email') {
      return <EmailErrorPage title={errorTitle} description={errorMessage} />;
    }
    return <OauthErrorPage title={errorTitle} description={errorMessage} />;
  }
  if (state.status === 'tfa') {
    return <TwoFactorCodePage initialToken={state.token} onSuccess={setDone} />;
  }
  return <div className="content" />;
};
LoginPage.propTypes = {
  provider: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export const EmailTokenLoginPage = ({ token }) => {
  const url = `/auth/email/${token}`;
  return <LoginPage provider="Email" url={url} />;
};

const OAuthLoginPage = ({ error, provider, url }) => {
  if (error === 'access_denied') {
    return <RedirectToDestination />;
  }
  return <LoginPage provider={provider} url={url} />;
};
OAuthLoginPage.propTypes = {
  error: PropTypes.string,
};
OAuthLoginPage.defaultProps = {
  error: null,
};

export const FacebookLoginPage = ({ code, error }) => {
  const callbackUrl = `${APP_URL}/login/facebook`;
  const url = `/auth/facebook/${code}?callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <OAuthLoginPage error={error} provider="Facebook" url={url} />;
};

export const GitHubLoginPage = ({ code, error }) => {
  const url = `/auth/github/${code}`;
  return <OAuthLoginPage error={error} provider="GitHub" url={url} />;
};

export const GoogleLoginPage = ({ code, error }) => {
  const callbackUrl = `${APP_URL}/login/google`;
  const url = `/auth/google/callback?code=${code}&callbackURL=${encodeURIComponent(callbackUrl)}`;
  return <OAuthLoginPage error={error} provider="Google" url={url} />;
};
