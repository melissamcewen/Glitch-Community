import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import NotificationsContainer from 'Components/notifications';
import { AnalyticsContext } from 'State/segment-analytics';
import { CurrentUserProvider } from 'State/current-user';
import { APIContextProvider } from 'State/api';
import { NotificationsProvider } from 'State/notifications';
import { UserPrefsProvider } from './presenters/includes/user-prefs';
import { DevTogglesProvider } from './presenters/includes/dev-toggles';

import ErrorBoundary from './presenters/includes/error-boundary';
import SuperUserBanner from './presenters/overlays/super-user-banner';
import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <BrowserRouter>
      <NotificationsProvider>
        <UserPrefsProvider>
          <DevTogglesProvider>
            <AnalyticsContext context={{ groupId: '0' }}>
              <CurrentUserProvider>
                <APIContextProvider>
                  <>
                    <NotificationsContainer />
                    <SuperUserBanner />
                    <Router />
                  </>
                </APIContextProvider>
              </CurrentUserProvider>
            </AnalyticsContext>
          </DevTogglesProvider>
        </UserPrefsProvider>
      </NotificationsProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
