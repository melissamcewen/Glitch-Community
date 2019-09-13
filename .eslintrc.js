// Add new aliases in shared/aliases.js. This file will automatically pull them here so Babel doesn't complain about them.
// More details at https://www.npmjs.com/package/eslint-import-resolver-alias

const aliases = require('./aliases');

module.exports = {
  settings: {
    'import/resolver': {
      alias: Object.entries(aliases.client),
    },
  },
};
