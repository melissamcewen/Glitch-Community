import './polyfills';

// Init our dayjs plugins
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';

import React from 'react';
import ReactDOM, { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import convertPlugin from 'Shared/dayjs-convert';
import { configureScope } from 'Utils/sentry';
import { EDITOR_URL } from 'Utils/constants';
import { GlobalsProvider } from 'State/globals';
import App from './app';

dayjs.extend(relativeTimePlugin);
dayjs.extend(convertPlugin);

// This function is used in index.ejs to set up the app
window.bootstrap = async (container) => {
  if (location.hash.startsWith('#!/')) {
    window.location.replace(EDITOR_URL + window.location.hash);
    return;
  }

  // express sees a//b as the same as a/b, but react-router does not
  // redirect to the single slash url so the site doesn't flicker from ssr to 404
  if (location.pathname.includes('//')) {
    history.replaceState(history.state, '', location.pathname.replace(/\/+/g, '/') + location.search + location.hash);
  }

  // Mark that bootstrapping has occurred,
  // ..and more importantly, use this as an excuse
  // to call into Sentry so that its initialization
  // happens early in our JS bundle.
  configureScope((scope) => {
    scope.setTag('bootstrap', 'true');
  });

  const element = (
    <BrowserRouter>
      <GlobalsProvider
        origin={window.location.origin}
        AB_TESTS={window.AB_TESTS}
        EXTERNAL_ROUTES={window.EXTERNAL_ROUTES}
        HOME_CONTENT={window.HOME_CONTENT}
        SSR_SIGNED_IN={window.SSR_SIGNED_IN}
        ZINE_POSTS={window.ZINE_POSTS}
      >
        <App apiCache={window.API_CACHE} />
      </GlobalsProvider>
    </BrowserRouter>
  );

  if (window.ENVIRONMENT !== 'production') {
    const { default: axe } = await import('react-axe');
    if (!window.axeInitialized) {
      axe(React, ReactDOM, 1000);
      window.axeInitialized = true;
    }
  }
  if (container.hasChildNodes()) {
    hydrate(element, container);
  } else {
    render(element, container);
  }
};
