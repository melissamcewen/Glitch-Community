function webpackBackgroundProcess() {
  // Launch webpack in a separate process because it blocks a bit
  const { spawn } = require('child_process');
  const env = { ...process.env, NODE_OPTIONS: '--max-old-space-size=512' };
  spawn('webpack', ['--watch', '--info-verbosity', 'verbose'], { env, stdio: 'inherit' });
}

function webpackExpressMiddleware() {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.config.js');
  const compiler = webpack(webpackConfig);

  const webpackMiddleware = require('webpack-dev-middleware');
  const stats = { children: false };
  const middleware = webpackMiddleware(compiler, { stats, writeToDisk: true });

  let ready = false;
  middleware.waitUntilValid(() => {
    ready = true;
  });

  return function(request, response, next) {
    if (ready) {
      return middleware(request, response, next);
    }
    return next();
  };
}

module.exports = function(app) {
  switch (process.env.DEPLOY_ENV) {
    case 'production':
      // Production here is glitch.com/~community!
      // We use a webpack background process to
      // allow for live-edits to be made!
      webpackBackgroundProcess();
      break;
    case 'ci':
      // Do not webpack, we have already built
      break;
    default:
      // Use webpack middlware for dev/staging/etc.
      app.use(webpackExpressMiddleware());
      break;
  }
};
