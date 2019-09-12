const os = require('os');
const { envs, tagline } = require('../shared/constants');

// in the backend, just switch between local, staging and production
// the client supports RUNNING_ON = development
const currentEnv = ['local', 'staging'].includes(process.env.RUNNING_ON) ? process.env.RUNNING_ON : 'production';
const current = envs[currentEnv];

if (currentEnv === 'local') {
  const fwdSubdomainPrefix = process.env.FWD_SUBDOMAIN_PREFIX || process.env.PROJECT_NAME || os.userInfo().username;
  current.API_URL = `https://${fwdSubdomainPrefix}-glitch.fwd.wf/`;
}

module.exports = {
  ...envs,
  current,
  currentEnv,
  tagline,
};
