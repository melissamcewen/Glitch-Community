/* global EDITOR_URL */
import React from 'react';
import PropTypes from 'prop-types';

import SearchForm from 'Components/search-form';
import Button from 'Components/buttons/button';
import Link, { TrackedExternalLink } from 'Components/link';
import UserOptionsPop from '../../presenters/pop-overs/user-options-pop';
import SignInPop from '../../presenters/pop-overs/sign-in-pop';
import NewProjectPop from './new-project-pop';
import { useCurrentUser } from '../../state/current-user';
import Logo from './logo';
import styles from './header.styl';

const ResumeCoding = () => (
  <TrackedExternalLink name="Resume Coding clicked" to={EDITOR_URL}>
    <Button type="cta" size="small" decorative>
      Resume Coding
    </Button>
  </TrackedExternalLink>
);

const Header = ({ searchQuery, showNewStuffOverlay }) => {
  const { currentUser, clear, superUserHelpers } = useCurrentUser();
  return (
    <header role="banner" className={styles.header}>
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
              <SignInPop />
            </li>
          )}
          {!!currentUser && currentUser.login && (
            <li className={styles.buttonWrap}>
              <UserOptionsPop user={currentUser} signOut={clear} showNewStuffOverlay={showNewStuffOverlay} superUserHelpers={superUserHelpers} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  searchQuery: PropTypes.string,
  showNewStuffOverlay: PropTypes.func,
};

Header.defaultProps = {
  searchQuery: '',
  showNewStuffOverlay: () => {},
};

export default Header;
