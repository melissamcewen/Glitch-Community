import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AnalyticsContext } from 'State/segment-analytics';
import SuperUserBanner from 'Components/banners/super-user';

import ErrorBoundary from './presenters/includes/error-boundary';
import { CurrentUserProvider } from './state/current-user';
import { APIContextProvider } from './state/api';
import { UserPrefsProvider } from './presenters/includes/user-prefs';
import { DevTogglesProvider } from './presenters/includes/dev-toggles';
import { Notifications } from './presenters/notifications';

import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <Notifications>
        <UserPrefsProvider>
          <DevTogglesProvider>
            <AnalyticsContext context={{ groupId: '0' }}>
              <CurrentUserProvider>
                <APIContextProvider>
                  <>
                    <SuperUserBanner />
                    <Router />
                  </>
                </APIContextProvider>
              </CurrentUserProvider>
            </AnalyticsContext>
          </DevTogglesProvider>
        </UserPrefsProvider>
      </Notifications>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
