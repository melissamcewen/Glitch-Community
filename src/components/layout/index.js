import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactKonami from 'react-konami';

import Header from 'Components/header';
import Footer from 'Components/footer';
import AccountSettingsContainer from 'Components/account-settings-overlay';
import NewStuffContainer from 'Components/new-stuff';
import ErrorBoundary from 'Components/error-boundary';
import styles from './styles.styl';

const Layout = withRouter(({ children, searchQuery, history }) => (
  <div className={styles.content}>
    <Helmet title="Glitch" />
    <NewStuffContainer>
      {(showNewStuffOverlay) => (
        <AccountSettingsContainer>
          {(showAccountSettingsOverlay) => (
            <div className={styles.headerWrap}>
              <Header searchQuery={searchQuery} showAccountSettingsOverlay={showAccountSettingsOverlay} showNewStuffOverlay={showNewStuffOverlay} />
            </div>
          )}
        </AccountSettingsContainer>
      )}
    </NewStuffContainer>
    <ErrorBoundary>{children}</ErrorBoundary>
    <Footer />
    <ErrorBoundary fallback={null}>
      <ReactKonami easterEgg={() => history.push('/secret')} />
    </ErrorBoundary>
  </div>
));

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  searchQuery: PropTypes.string,
};
Layout.defaultProps = {
  searchQuery: '',
};

export default Layout;
