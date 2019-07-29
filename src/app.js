import React from 'react';
import { LiveAnnouncer } from 'react-aria-live';

import { AnalyticsContext } from 'State/segment-analytics';
import { CurrentUserProvider } from 'State/current-user';
import { APIContextProvider } from 'State/api';
import { LocalStorageProvider } from 'State/local-storage';
import { ProjectContextProvider } from 'State/project';
import { CollectionContextProvider } from 'State/collection';
import { NotificationsProvider } from 'State/notifications';
import OfflineNotice from 'State/offline-notice';
import SuperUserBanner from 'Components/banners/super-user';
import ErrorBoundary from 'Components/error-boundary';

import Router from './presenters/pages/router';

const App = () => (
  <ErrorBoundary fallback="Something went very wrong, try refreshing?">
    <LiveAnnouncer>
      <NotificationsProvider>
        <LocalStorageProvider>
          <AnalyticsContext context={{ groupId: '0' }}>
            <CurrentUserProvider>
              <APIContextProvider>
                <ProjectContextProvider>
                  <CollectionContextProvider>
                    <React.Fragment>
                      <SuperUserBanner />
                      <OfflineNotice />
                      <Router />
                    </React.Fragment>
                  </CollectionContextProvider>
                </ProjectContextProvider>
              </APIContextProvider>
            </CurrentUserProvider>
          </AnalyticsContext>
        </LocalStorageProvider>
      </NotificationsProvider>
    </LiveAnnouncer>
  </ErrorBoundary>
);

export default App;
