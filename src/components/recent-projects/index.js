import React from 'react';

import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import Loader from 'Components/loader';
import CoverContainer from 'Components/containers/cover-container';
import { UserLink, WrappingLink } from 'Components/link';
import Button from 'Components/buttons/button';
import SignInPop from 'Components/sign-in-pop';
import { getAvatarStyle, getLink } from 'Models/user';
import { useCurrentUser } from 'State/current-user';

import ProjectsLoader from '../../presenters/projects-loader';
import styles from './styles.styl';

const SignInNotice = () => (
  <div className={styles.anonUserSignUp}>
    <span>
      <SignInPop /> to keep your projects.
    </span>
  </div>
);

const ClearSession = ({ clearUser }) => {
  function clickClearSession() {
    if (
      // eslint-disable-next-line
      !window.confirm(`All activity from this anonymous account will be cleared.  Are you sure you want to continue?`)
    ) {
      return;
    }
    clearUser();
  }

  return (
    <div className={styles.clearSession}>
      <Button onClick={clickClearSession} size="small" type="dangerZone" emoji="balloon">
        Clear Session
      </Button>
    </div>
  );
};

const RecentProjects = () => {
  const { currentUser, fetched, clear } = useCurrentUser();
  const isAnonymousUser = !currentUser.login;

  return (
    <section>
      <Heading tagName="h2">
        <UserLink user={currentUser}>Your Projects <span aria-hidden="true">→</span></UserLink>
      </Heading>
      {isAnonymousUser && <SignInNotice />}
      <CoverContainer type="user" item={currentUser}>
        <div className={styles.coverWrap}>
          <div className={styles.avatarWrap}>
            <WrappingLink user={currentUser} href={getLink(currentUser)}>
              <div className={styles.userAvatar} style={getAvatarStyle(currentUser)} />
            </WrappingLink>
          </div>
          <div className={styles.projectsWrap}>
            {fetched ? (
              <ProjectsLoader projects={currentUser.projects.slice(0, 3)}>
                {(projects) => <ProjectsList layout="row" projects={projects} />}
              </ProjectsLoader>
            ) : (
              <Loader />
            )}
          </div>
        </div>
        {isAnonymousUser && <ClearSession clearUser={clear} />}
      </CoverContainer>
    </section>
  );
};

export default RecentProjects;
