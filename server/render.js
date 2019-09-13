const path = require('path');
const { performance } = require('perf_hooks');
const dayjs = require('dayjs');
const { captureException } = require('@sentry/node');
const createCache = require('./cache');

const setup = () => {
  const src = path.join(__dirname, '../src');
  const build = path.join(__dirname, '../build/node/');
  switch (process.env.DEPLOY_ENV) {
    case 'production':
    case 'ci':
      // use the build created either statically or by a watcher
      return { directory: build, verb: 'load' };
    default:
      // transpile on render to ensure we always use the latest code
      require('@babel/register')({
        only: [(location) => location.startsWith(src)],
        configFile: path.join(__dirname, '../.babelrc.node.js'),
      });
      return { directory: src, verb: 'transpile' };
  }
};
const { directory, verb } = setup();

const [getFromCache, clearCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'render', {});

let isTranspiled = false;
let isFirstTranspile = true;

// clear client code from the require cache whenever it gets changed
// it'll get loaded off the disk again when the render calls require
require('chokidar').watch(directory).on('change', () => {
  if (isTranspiled) {
    // remove everything in the src directory
    Object.keys(require.cache).forEach((location) => {
      if (location.startsWith(directory)) delete require.cache[location];
    });
    // remove all rendered pages from the cache
    clearCache();
    // flag for performance profiling
    isTranspiled = false;
  }
});

const requireClient = () => {
  const startTime = performance.now();
  const required = require(path.join(directory, './server'));
  const endTime = performance.now();
  if (!isTranspiled) console.log(`SSR ${isFirstTranspile ? '' : 're'}${verb} took ${Math.round(endTime - startTime)}ms`);
  isFirstTranspile = false;
  isTranspiled = true;
  return required;
};

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components');
setImmediate(() => {
  try {
    requireClient();
  } catch (error) {
    // try importing right away so we don't have to wait
    // but if this fails not it might just be because the first time build isn't ready
    console.warn('Failed to load client code for ssr. This either means the initial build is not finished or there is a bug in the code');
    captureException(error);
  }
});

const render = async (url, { AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS }) => {
  const { Page, resetState } = requireClient();
  resetState();
  const sheet = new ServerStyleSheet();
  const helmetContext = {};

  // don't use <ReactSyntax /> so babel can stay scoped to the src directory
  const page = React.createElement(Page, {
    origin: url.origin,
    route: url.pathname + url.search + url.hash,
    helmetContext,
    AB_TESTS,
    API_CACHE,
    ZINE_POSTS,
    HOME_CONTENT,
    SSR_SIGNED_IN,
    EXTERNAL_ROUTES,
  });

  const html = ReactDOMServer.renderToString(sheet.collectStyles(page));
  const styleTags = sheet.getStyleTags();
  sheet.seal();
  const context = { AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS };
  return { html, helmet: helmetContext.helmet, context, styleTags };
};

module.exports = (url, context) => {
  const key = [
    context.SSR_SIGNED_IN ? 'signed-in' : 'signed-out',
    ...Object.entries(context.AB_TESTS).map(([test, assignment]) => `${test}=${assignment}`),
    url,
  ];
  return getFromCache(key.join(' '), render, url, context);
};
