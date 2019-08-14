// Define a bunch of variables split by environment

const envs = {
  production: {
    APP_URL: 'https://glitch.com',
    API_URL: 'https://api.glitch.com/',
    EDITOR_URL: 'https://glitch.com/edit/',
    CDN_URL: 'https://cdn.glitch.com',
    GITHUB_CLIENT_ID: 'b4cb743ed07e20abf0b2',
    FACEBOOK_CLIENT_ID: '660180164153542',
    PROJECTS_DOMAIN: 'glitch.me',
  },
  staging: {
    APP_URL: 'https://staging.glitch.com',
    API_URL: 'https://api.staging.glitch.com/',
    EDITOR_URL: 'https://staging.glitch.com/edit/',
    CDN_URL: 'https://cdn.staging.glitch.com',
    GITHUB_CLIENT_ID: '65efbd87382354ca25e7',
    FACEBOOK_CLIENT_ID: '1858825521057112',
    PROJECTS_DOMAIN: 'staging.glitch.me',
  },
  development: {
    APP_URL: 'https://glitch.development',
    API_URL: 'https://api.glitch.development/',
    EDITOR_URL: 'https://glitch.development/edit/',
    CDN_URL: 'https://s3.amazonaws.com/hyperdev-development',
    GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
    FACEBOOK_CLIENT_ID: '1121393391305429',
    PROJECTS_DOMAIN: 'glitch.development',
  },
  local: {
    APP_URL: 'https://glitch.com',
    API_URL: `https://${process.env.FWD_SUBDOMAIN_PREFIX}-glitch.fwd.wf/`,
    EDITOR_URL: 'https://glitch.com/edit/',
    CDN_URL: 'https://cdn.glitch.com',
    GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
    FACEBOOK_CLIENT_ID: '1121393391305429',
    PROJECTS_DOMAIN: 'glitch.me',
  }
};

const tagline = 'friendly community where everyone can discover & create the best apps on the web.';

module.exports = {
  envs, tagline
};
