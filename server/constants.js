const { envs, tagline } = require('../shared/constants');

// in the backend, just switch between staging and production
// the client supports RUNNING_ON = development
const currentEnv = ['local', 'staging'].includes(process.env.RUNNING_ON) ? process.env.RUNNING_ON : 'production';
module.exports = {
  ...envs,
  current: envs[currentEnv],
  currentEnv,
  tagline,
};
