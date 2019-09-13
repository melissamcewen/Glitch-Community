const path = require('path');

const makeAliases = (root) => ({
  Components: path.join(__dirname, root, './components'),
  Utils: path.join(__dirname, root, './utils'),
  Curated: path.join(__dirname, root, './curated'),
  Models: path.join(__dirname, root, './models'),
  State: path.join(__dirname, root, './state'),
  Hooks: path.join(__dirname, root, './hooks'),
  Shared: path.join(__dirname, './shared'),
  '@fogcreek/shared-components': path.resolve(__dirname, root, './components/shared-components.js'),
});

const clientPath = './src';
const builtPath = './build/node';

let serverPath = clientPath;
if (process.env.DEPLOY_ENV === 'production' || process.env.DEPLOY_ENV === 'ci') {
  serverPath = builtPath;
}

module.exports = {
  server: makeAliases(serverPath),
  client: makeAliases(clientPath),
};
