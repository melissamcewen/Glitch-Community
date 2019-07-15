const { envs } = require('Shared/constants');
/* global RUNNING_ON */

let envFromOrigin = 'production';
if (origin.contains('staging.glitch.com')) {
  envFromOrigin = 'staging';
} else if (origin.contains('glitch.development')) {
  envFromOrigin = 'development';
}

const currentEnv = envs[RUNNING_ON] ? RUNNING_ON : envFromOrigin;

const {
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  PROJECTS_DOMAIN,
} = envs[currentEnv];

export {
  currentEnv,
  APP_URL,
  API_URL,
  EDITOR_URL,
  CDN_URL,
  GITHUB_CLIENT_ID,
  FACEBOOK_CLIENT_ID,
  PROJECTS_DOMAIN,
};
