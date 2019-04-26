import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { orderBy, partition } from 'lodash';

import Heading from 'Components/text/heading';
import FeaturedProject from 'Components/project/featured-project';
import Thanks from 'Components/blocks/thanks';
import UserNameInput from 'Components/fields/user-name-input';
import UserLoginInput from 'Components/fields/user-login-input';

import { getAvatarStyle, getLink } from '../../models/user';

import { AnalyticsContext } from '../segment-analytics';
import { useCurrentUser } from '../../state/current-user';
import { AuthDescription } from '../includes/description-field';
import UserEditor from '../user-editor';

import DeletedProjects from '../deleted-projects';
import EntityPageProjects from '../entity-page-projects';
import CollectionsList from '../collections-list';
import { ProfileContainer, ImageButtons } from '../includes/profile';
import ProjectsLoader from '../projects-loader';
import ReportButton from '../pop-overs/report-abuse-pop';

function syncPageToLogin(login) {
  history.replaceState(null, null, getLink({ login }));
}

const NameAndLogin = ({ name, login, isAuthorized, updateName, updateLogin }) => {
  if (!login) {
    return <Heading tagName="h1">Anonymous</Heading>;
  }

  if (!isAuthorized) {
    if (!name) {
      return <Heading tagName="h1">@{login}</Heading>;
    }
    return (
      <>
        <Heading tagName="h1">{name}</Heading>
        <Heading tagName="h2">@{login}</Heading>
      </>
    );
  }
  const editableName = name !== null ? name : '';
  return (
    <>
      <Heading tagName="h1">
        <UserNameInput name={editableName} onChange={updateName} />
      </Heading>
      <Heading tagName="h2">
        <UserLoginInput login={login} onChange={updateLogin} />
      </Heading>
    </>
  );
};
NameAndLogin.propTypes = {
  name: PropTypes.string,
  login: PropTypes.string,
  isAuthorized: PropTypes.bool.isRequired,
  updateName: PropTypes.func.isRequired,
  updateLogin: PropTypes.func.isRequired,
};

NameAndLogin.defaultProps = {
  name: '',
  login: '',
};

// has science gone too far?
const UserPage = ({
  user: {
    // has science gone too far?
    _deletedProjects,
    featuredProjectId,
    ...user
  },
  isAuthorized,
  maybeCurrentUser,
  updateDescription,
  updateName,
  updateLogin,
  uploadCover,
  clearCover,
  uploadAvatar,
  addPin,
  removePin,
  leaveProject,
  deleteProject,
  undeleteProject,
  featureProject,
  unfeatureProject,
  setDeletedProjects,
  addProjectToCollection,
}) => {
  const pinnedSet = new Set(user.pins.map(({ id }) => id));
  // filter featuredProject out of both pinned & recent projects
  const [pinnedProjects, recentProjects] = partition(user.projects.filter(({ id }) => id !== featuredProjectId), ({ id }) => pinnedSet.has(id));
  const featuredProject = user.projects.find(({ id }) => id === featuredProjectId);

  return (
    <main className="profile-page user-page">
      <section>
        <ProfileContainer
          avatarStyle={getAvatarStyle(user)}
          type="user"
          item={user}
          coverButtons={
            isAuthorized &&
            !!user.login && <ImageButtons name="Cover" uploadImage={uploadCover} clearImage={user.hasCoverImage ? clearCover : null} />
          }
          avatarButtons={isAuthorized && !!user.login && <ImageButtons name="Avatar" uploadImage={uploadAvatar} />}
          teams={user.teams}
        >
          <NameAndLogin
            name={user.name}
            login={user.login}
            {...{ isAuthorized: isAuthorized || maybeCurrentUser.isSupport, updateName }}
            updateLogin={(login) => updateLogin(login).then(() => syncPageToLogin(login))}
          />
          <Thanks count={user.thanksCount} />
          <AuthDescription
            authorized={isAuthorized && !!user.login}
            description={user.description}
            update={updateDescription}
            placeholder="Tell us about yourself"
          />
        </ProfileContainer>
      </section>

      {featuredProject && (
        <FeaturedProject
          featuredProject={featuredProject}
          isAuthorized={isAuthorized}
          unfeatureProject={unfeatureProject}
          addProjectToCollection={addProjectToCollection}
          currentUser={maybeCurrentUser}
        />
      )}

      {/* Pinned Projects */}
      <EntityPageProjects
        projects={pinnedProjects}
        isAuthorized={isAuthorized}
        removePin={removePin}
        featureProject={featureProject}
        projectOptions={{
          leaveProject,
          deleteProject,
          addProjectToCollection,
        }}
        currentUser={maybeCurrentUser}
      />

      {!!user.login && (
        <CollectionsList
          title="Collections"
          collections={user.collections.map((collection) => ({
            ...collection,
            user,
          }))}
          isAuthorized={isAuthorized}
          maybeCurrentUser={maybeCurrentUser}
        />
      )}

      {/* Recent Projects */}
      <EntityPageProjects
        projects={recentProjects}
        isAuthorized={isAuthorized}
        addPin={addPin}
        featureProject={featureProject}
        projectOptions={{
          leaveProject,
          deleteProject,
          addProjectToCollection,
        }}
        currentUser={maybeCurrentUser}
        enableFiltering={recentProjects.length > 6}
        enablePagination
      />
      {isAuthorized && <DeletedProjects setDeletedProjects={setDeletedProjects} deletedProjects={_deletedProjects} undelete={undeleteProject} />}
      {!isAuthorized && <ReportButton reportedType="user" reportedModel={user} />}
    </main>
  );
};

UserPage.propTypes = {
  clearCover: PropTypes.func.isRequired,
  maybeCurrentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  leaveProject: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    id: PropTypes.number.isRequired,
    thanksCount: PropTypes.number.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    avatarUrl: PropTypes.string,
    color: PropTypes.string.isRequired,
    coverColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    pins: PropTypes.array.isRequired,
    projects: PropTypes.array.isRequired,
    teams: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    _deletedProjects: PropTypes.array.isRequired,
  }).isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  featureProject: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
};

const UserPageContainer = ({ user }) => {
  const { currentUser: maybeCurrentUser } = useCurrentUser();
  return (
    <AnalyticsContext properties={{ origin: 'user' }}>
      <UserEditor initialUser={user}>
        {(userFromEditor, funcs, isAuthorized) => (
          <>
            <Helmet title={userFromEditor.name || (userFromEditor.login ? `@${userFromEditor.login}` : `User ${userFromEditor.id}`)} />
            <ProjectsLoader projects={orderBy(userFromEditor.projects, (project) => project.updatedAt, ['desc'])}>
              {(projects) => <UserPage {...{ isAuthorized, maybeCurrentUser }} user={{ ...userFromEditor, projects }} {...funcs} />}
            </ProjectsLoader>
          </>
        )}
      </UserEditor>
    </AnalyticsContext>
  );
};
export default UserPageContainer;
