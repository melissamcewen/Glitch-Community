const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: ['eslint:recommended', 'plugin:jsx-a11y/recommended', 'plugin:react/recommended', 'airbnb'],
  env: {
    es6: true, // We are writing ES6 code
    browser: true, // for the browser
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false, // import/export must happen at the top level.
  },
  plugins: [
    'jsx-a11y', // https://www.npmjs.com/package/eslint-plugin-jsx-a11y
    'react-hooks', // https://www.npmjs.com/package/eslint-plugin-react-hooks
  ],
  rules: {
    // Overrides/additions to eslint:recommended:
    'no-console': OFF,
    'no-else-return': ERROR,
    indent: ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'no-debugger': WARN,
    'jsx-a11y/label-has-for': OFF, // It's been deprecated. -- https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-for.md
    'arrow-parens': [ERROR, 'always'],
    'operator-linebreak': [ERROR, 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'jsx-a11y/label-has-associated-control': [ERROR, {
      assert: "either",
      depth: 3,
    }],
    // disabled for prettier compatibility
    'implicit-arrow-linebreak': OFF,
    'object-curly-newline': OFF,
    'no-confusing-arrow': OFF,
    'function-paren-newline': OFF,
    // allow for focusing on pop-overs
    'jsx-a11y/no-noninteractive-tabindex': [
      'error', {
        tags: ['dialog'],
      },
    ],
    // Overrides of react/recommended:
    'react/no-unescaped-entities': ['error', { forbid: [`"`, '>', '}'] }], // permit ' in jsx html,
    'react/prop-types': [OFF], // disabled so we can use composed prop-types
    'react/forbid-prop-types': [OFF],
    'react/destructuring-assignment': [OFF, 'always'],
    'react/no-multi-comp': [OFF], // someday on
    'react/jsx-wrap-multilines': [
      ERROR,
      {
        declaration: 'parens',
        assignment: 'parens',
        return: 'parens',
        arrow: 'parens',
        condition: 'ignore',
        logical: 'ignore',
        prop: 'ignore',
      },
    ],
    'no-param-reassign': [OFF],
    'react/jsx-no-bind': [OFF],
    'no-restricted-syntax': [OFF],
    'no-restricted-globals': [ERROR, 'event'],
    'no-alert': [OFF],
    'react/button-has-type': [OFF], // TODO turn back on when button componentization is done
    'max-len': [
      'error',
      150,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    // React hooks config
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-one-expression-per-line': [OFF],
    'react/jsx-filename-extension': [ERROR, { extensions: ['.js'] }]
  },
  settings: {
    'import/ignore': ['sentry'],
  },
};
