import React from 'react';
import PropTypes from 'prop-types';

import { EDITOR_URL } from 'Utils/constants';
import SearchForm from 'Components/search-form';
import Button from 'Components/buttons/button';
import SignInPop from 'Components/sign-in-pop';
import UserOptionsPop from 'Components/user-options-pop';
import Link, { TrackedExternalLink } from 'Components/link';
import { useCurrentUser } from 'State/current-user';
import { useGlobals } from 'State/globals';
import NewProjectPop from './new-project-pop';
import Logo from './logo';
import styles from './header.styl';

const ResumeCoding = () => {
  const { location } = useGlobals();
  // project names can't contain ~ so this will work
  const [, projectName] = location.pathname.split('~');
  let editorUrl = EDITOR_URL;
  if (projectName) {
    editorUrl = `${EDITOR_URL}#!/${projectName}`;
  }
  return (
    <TrackedExternalLink name="Resume Coding clicked" to={editorUrl}>
      <Button type="cta" size="small" decorative>
        Resume Coding
      </Button>
    </TrackedExternalLink>
  );
};

const Header = ({ searchQuery, showAccountSettingsOverlay, showNewStuffOverlay }) => {
  const { currentUser } = useCurrentUser();
  const { SSR_SIGNED_IN } = useGlobals();
  // signedIn and signedOut are both false on the server so the sign in button doesn't render
  const fakeSignedIn = !currentUser.id && SSR_SIGNED_IN;
  const signedIn = !!currentUser.login || fakeSignedIn;
  const signedOut = !!currentUser.id && !signedIn;
  const hasProjects = currentUser.projects.length > 0 || fakeSignedIn;
  return (
    <header role="banner" className={styles.header}>
      <Button href="#main" className={styles.visibleOnFocus}>
        Skip to Main Content
      </Button>
      <Link to="/" className={styles.logoWrap}>
        <Logo />
      </Link>

      <nav className={styles.headerActions}>
        <div className={styles.searchWrap}>
          <SearchForm defaultValue={searchQuery} />
        </div>
        <ul className={styles.buttons}>
          {(signedIn || signedOut) && (
            <li className={styles.buttonWrap}>
              <NewProjectPop />
            </li>
          )}
          {hasProjects && (
            <li className={styles.buttonWrap}>
              <ResumeCoding />
            </li>
          )}
          {signedOut && (
            <li className={styles.buttonWrap}>
              <SignInPop align="right" />
            </li>
          )}
          {signedIn && (
            <li className={styles.buttonWrap}>
              <UserOptionsPop showAccountSettingsOverlay={showAccountSettingsOverlay} showNewStuffOverlay={showNewStuffOverlay} />
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
