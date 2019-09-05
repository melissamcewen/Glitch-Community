import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { resetIdCounter } from 'react-tabs';
import { resetUniqueId } from 'Hooks/use-unique-id';
import { GlobalsProvider } from 'State/globals';
import App from './app';

const Page = ({ origin, route, AB_TESTS, API_CACHE, EXTERNAL_ROUTES, HOME_CONTENT, SSR_SIGNED_IN, ZINE_POSTS }) => (
  <StaticRouter location={route}>
    <GlobalsProvider
      origin={origin}
      AB_TESTS={AB_TESTS}
      EXTERNAL_ROUTES={EXTERNAL_ROUTES}
      HOME_CONTENT={HOME_CONTENT}
      SSR_SIGNED_IN={SSR_SIGNED_IN}
      ZINE_POSTS={ZINE_POSTS}
    >
      <App apiCache={API_CACHE} />
    </GlobalsProvider>
  </StaticRouter>
);

const resetState = () => {
  resetIdCounter();
  resetUniqueId();
};

export { Page, resetState };
