import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon } from '@fogcreek/shared-components';

import { FACEBOOK_CLIENT_ID, GITHUB_CLIENT_ID, APP_URL, API_URL } from 'Utils/constants';
import { emoji as emojiStyle } from '../global.styl';

function facebookAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', FACEBOOK_CLIENT_ID);
  params.append('scope', 'email');
  params.append('redirect_uri', `${APP_URL}/login/facebook`);
  return `https://www.facebook.com/v2.9/dialog/oauth?${params}`;
}

function githubAuthLink() {
  const params = new URLSearchParams();
  params.append('client_id', GITHUB_CLIENT_ID);
  params.append('scope', 'user:email');
  params.append('redirect_uri', `${APP_URL}/login/github`);
  return `https://github.com/login/oauth/authorize?${params}`;
}

function googleAuthLink() {
  const params = new URLSearchParams();
  const callbackURL = `${APP_URL}/login/google`;
  params.append('callbackURL', callbackURL);
  return `${API_URL}/auth/google?${params}`;
}

const companies = {
  facebook: {
    name: 'Facebook',
    emoji: 'facebook',
    href: facebookAuthLink(),
  },
  github: {
    name: 'GitHub',
    emoji: 'octocat',
    href: githubAuthLink(),
  },
  google: {
    name: 'Google',
    emoji: 'google',
    href: googleAuthLink(),
  },
};

export const companyNames = Object.keys(companies);

const SignInButton = ({ companyName, onClick, short }) => {
  const { name, emoji, href } = companies[companyName];

  return (
    <div style={{ marginBottom: '10px' }}>
      <Button as="a" href={href} onClick={onClick} size="small">
        {short ? name : `Sign in with ${name}`} <Icon className={emojiStyle} icon={emoji} />
      </Button>
    </div>
  );
};

SignInButton.propTypes = {
  companyName: PropTypes.oneOf(companyNames).isRequired,
  short: PropTypes.bool,
};

SignInButton.defaultProps = {
  short: false,
};

export default SignInButton;
