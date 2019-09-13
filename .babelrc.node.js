const stylus = require('stylus');

module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { node: true }, useBuiltIns: false }],
  ],
  plugins: [
    'styled-components',
    '@babel/syntax-dynamic-import',
    ['module-resolver', {
      alias: { '@sentry/browser': '@sentry/node' },
    }],
    ['css-modules-transform', {
      preprocessCss: (data, filename) => stylus.render(data, { filename }),
      extensions: ['.styl'],
    }],
  ],
  babelrc: false,
};
