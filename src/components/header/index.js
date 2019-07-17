import React from 'react';
import PropTypes from 'prop-types';

import { EDITOR_URL } from 'Utils/constants';
import SearchForm from 'Components/search-form';
import Button from 'Components/buttons/button';
import SignInPop from 'Components/sign-in-pop';
import UserOptionsPop from 'Components/user-options-pop';
import Link, { TrackedExternalLink } from 'Components/link';
import { useCurrentUser } from 'State/current-user';
import NewProjectPop from './new-project-pop';
import Logo from './logo';
import styles from './header.styl';

const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" to={EDITOR_URL}>
    <Button type="cta" size="small" decorative>
      Resume Coding
    </Button>
  </TrackedExternalLink>
);

const Header = ({ searchQuery, showAccountSettingsOverlay, showNewStuffOverlay }) => {
  const { currentUser, clear, superUserHelpers } = useCurrentUser();
  return (
    <header role="banner" className={styles.header}>
      {/* https://github.com/ReactTraining/react-router/issues/394 not supported in react router links */}
      <a href="#main" className={styles.visibleOnFocus}>Skip to Main Content</a>
      <Link to="/" className={styles.logoWrap}>
        <Logo />
      </Link>

      <nav className={styles.headerActions}>
        <div className={styles.searchWrap}>
          <SearchForm defaultValue={searchQuery} />
        </div>
        <ul className={styles.buttons}>
          <li className={styles.buttonWrap}>
            <NewProjectPop />
          </li>
          {!!currentUser && !!currentUser.projects.length && (
            <li className={styles.buttonWrap}>
              <ResumeCoding />
            </li>
          )}
          {!(currentUser && currentUser.login) && (
            <li className={styles.buttonWrap}>
              <SignInPop align="right" />
            </li>
          )}
          {!!currentUser && currentUser.login && (
            <li className={styles.buttonWrap}>
              <UserOptionsPop
                user={currentUser}
                signOut={clear}
                showAccountSettingsOverlay={showAccountSettingsOverlay}
                showNewStuffOverlay={showNewStuffOverlay}
                superUserHelpers={superUserHelpers}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  searchQuery: PropTypes.string,
  showAccountSettingsOverlay: PropTypes.func.isRequired,
  showNewStuffOverlay: PropTypes.func.isRequired,
};

Header.defaultProps = {
  searchQuery: '',
};

export default Header;
