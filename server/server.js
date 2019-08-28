const express = require('express');
const compression = require('compression');
const constants = require('./constants');
const moduleAlias = require('module-alias');
const dotenv = require('dotenv');

moduleAlias.addAliases(require('../shared/aliases'));

const sentryHelpers = require('Shared/sentryHelpers');

// https://docs.sentry.io/error-reporting/quickstart/?platform=node
const Sentry = require('@sentry/node');

// required for using .env when not on glitch; no-op when running on glitch
dotenv.config();

try {
  Sentry.init({
    dsn: 'https://4f1a68242b6944738df12eecc34d377c@sentry.io/1246508',
    environment: process.env.NODE_ENV || 'dev',
    beforeSend(event) {
      try {
        return sentryHelpers.beforeSend(process.env.PROJECT_DOMAIN, constants.currentEnv, event);
      } catch (error) {
        console.error(error);
        return event;
      }
    },
    beforeBreadcrumb(breadcrumb) {
      try {
        return sentryHelpers.beforeBreadcrumb(breadcrumb);
      } catch (error) {
        console.error(error);
        return breadcrumb;
      }
    },
  });
  Sentry.configureScope((scope) => {
    scope.setTag('PROJECT_DOMAIN', process.env.PROJECT_DOMAIN);
  });
  // Node doesn't log unhandled promise errors if something is listening for
  // them, which Sentry does. Add our own event listener to keep them logged
  // https://github.com/getsentry/sentry-javascript/issues/1909
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
} catch (error) {
  console.error('Failed to initialize Sentry!', error);
}

// Extend dayjs with our conversion plugin
require('dayjs').extend(require('Shared/dayjs-convert'));

const app = express();
app.enable('trust proxy');

app.use(Sentry.Handlers.requestHandler());

// Accept JSON as req.body
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const bodyParserJSON = bodyParser.json();
app.use((req, res, next) => {
  bodyParserJSON(req, res, (error) => {
    if (error && error.expose && !res.headersSent) {
      res.sendStatus(error.status);
    } else {
      next(error);
    }
  });
});
app.use(compression());

app.get('/edit', function(req, res) {
  res.status(500);
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.send('Sorry, no editor for remixes!');
});

const redirects = require('./redirects');
redirects(app);

const proxy = require('./proxy');
const proxied = proxy(app);

const logger = require('./logger');
app.use(logger);

const router = require('./routes');
app.use('/', router(['/edit', ...proxied]));

// Add an explicit no-cache to 404 responses
// Since this is the last handler it will only be hit when all other handlers miss
app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  return next();
});

app.use(Sentry.Handlers.errorHandler());

// Listen on App port
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}.`);
});
