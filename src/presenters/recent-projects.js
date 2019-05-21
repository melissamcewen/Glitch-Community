import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectsList from 'Components/containers/projects-list';
import Loader from 'Components/loader';
import CoverContainer from 'Components/containers/cover-container';
import { UserLink } from 'Components/link';
import { getAvatarStyle } from 'Models/user';

import { useCurrentUser } from '../state/current-user';
import ProjectsLoader from './projects-loader';
import SignInPop from './pop-overs/sign-in-pop';

const SignInNotice = () => (
  <div className="anon-user-sign-up">
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
    <div className="clear-session">
      <button type="button" onClick={clickClearSession} className="button-small has-emoji button-tertiary button-on-secondary-background">
        Clear Session <span className="emoji balloon" />
      </button>
    </div>
  );
};

const RecentProjectsContainer = ({ children, user, clearUser }) => (
  <section className="profile recent-projects">
    <Heading tagName="h2">
      <UserLink user={user}>Your Projects →</UserLink>
    </Heading>
    {!user.login && <SignInNotice />}
    <CoverContainer type="user" item={user}>
      <div className="profile-avatar">
        <div className="user-avatar-container">
          <UserLink user={user}>
            <div className={`user-avatar ${!user.login ? 'anon-user-avatar' : ''}`} style={getAvatarStyle(user)} alt="" />
          </UserLink>
        </div>
      </div>
      <article className="recent-projects__projects-wrap">{children}</article>
      {!user.login && <ClearSession clearUser={clearUser} />}
    </CoverContainer>
  </section>
);
RecentProjectsContainer.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
  }).isRequired,
  clearUser: PropTypes.func.isRequired,
};

const RecentProjects = () => {
  const { currentUser: user, fetched, clear } = useCurrentUser();

  return (
    <RecentProjectsContainer user={user} clearUser={clear}>
      {fetched ? (
        <ProjectsLoader projects={user.projects.slice(0, 3)}>{(projects) => <ProjectsList layout="row" projects={projects} />}</ProjectsLoader>
      ) : (
        <div className="recent-projects-loader-wrapper">
          <Loader />
        </div>
      )}
    </RecentProjectsContainer>
  );
};

export default RecentProjects;
