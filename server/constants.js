const { envs, tagline } = require('../shared/constants');

// in the backend, just switch between staging and production
// the client supports RUNNING_ON = development
const currentEnv = 'local';//process.env.RUNNING_ON === 'staging' ? 'staging' : 'production';
module.exports = {
  ...envs,
  current: envs[currentEnv],
  currentEnv,
  tagline,
};
