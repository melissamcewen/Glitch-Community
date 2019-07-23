const path = require('path');
const appConfig = require('../webpack.config.js');
const AutoprefixerStylus = require('autoprefixer-stylus');

module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.styl$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader?modules',
        options: {
          sourceMap: true,
          modules: {
            localIdentName: '[name]__[local]___[hash:base64:5]',
          }
        },

      },
      {
        loader: 'stylus-loader',
        options: {        
          use: [AutoprefixerStylus()],
        },
      },
    ],
    include: path.resolve(__dirname, '..'),
  });
  
  config.resolve = {
    extensions: appConfig.resolve.extensions,
    alias: {
      ...appConfig.resolve.alias,
      ...config.resolve.alias,
    },
  },
  
  config.context = appConfig.context;

  config.mode = 'development';

  // Return the altered config
  return config;
};
