import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { partition } from 'lodash';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import FeaturedProject from 'Components/project/featured-project';
import ProjectsList from 'Components/containers/projects-list';
import Thanks from 'Components/thanks';
import DataLoader from 'Components/data-loader';
import { TeamProfileContainer } from 'Components/containers/profile';
import CollectionsList from 'Components/collections-list';
import Emoji from 'Components/images/emoji';
import TeamFields from 'Components/fields/team-fields';
import ReportButton from 'Components/report-abuse-pop';
import DeleteTeam from 'Components/team/delete-team-pop';
import AddTeamProject from 'Components/team/add-team-project-pop';
import TeamUsers from 'Components/team-users';
import Button from 'Components/buttons/button';
import TeamAnalytics from 'Components/team-analytics';
import AuthDescription from 'Components/fields/auth-description';
import ErrorBoundary from 'Components/error-boundary';
import { getLink, userIsOnTeam, userIsTeamAdmin } from 'Models/team';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { useTeamEditor } from 'State/team';

import ProjectsLoader from '../projects-loader';
import styles from './team.styl';

function syncPageToUrl(team) {
  history.replaceState(null, null, getLink(team));
}

const TeamPageCollections = ({ collections, team, currentUser, currentUserIsOnTeam }) => (
  <CollectionsList
    title="Collections"
    collections={collections.map((collection) => ({ ...collection, team }))}
    maybeCurrentUser={currentUser}
    maybeTeam={team}
    isAuthorized={currentUserIsOnTeam}
  />
);

const Beta = () => (
  <a href="/teams/" target="_blank" className={styles.beta}>
    <img src="https://cdn.glitch.com/0c3ba0da-dac8-4904-bb5e-e1c7acc378a2%2Fbeta-flag.svg?1541448893958" alt="" />
    <div>
      <Heading tagName="h4">Teams are in beta</Heading>
      <Text>Learn More</Text>
    </div>
  </a>
);

const ProjectPals = () => (
  <aside className="inline-banners add-project-to-empty-team-banner">
    <div className="description-container">
      <img className="project-pals" src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925" alt="" />
      <div className="description">Add projects to share them with your team</div>
    </div>
  </aside>
);

const TeamMarketing = () => (
  <section className={styles.teamMarketing}>
    <Text defaultMargin>
      <img
        className={styles.forPlatformsIcon}
        src="https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188"
        alt=""
      />
      Want your own team page, complete with detailed app analytics?
    </Text>
    <Button href="/teams" emoji="fishingPole">
      About Teams
    </Button>
  </section>
);

const NameConflictWarning = ({ id }) => (
  <>
    <Text>This team has your name. You should update your info to remain unique <Emoji name="sparkles" /></Text>
    <Button size="small" type="tertiary" href={`/user/${id}`}>
      Your Profile
    </Button>
  </>
);

const teamConflictsWithUser = (team, currentUser) => {
  if (currentUser && currentUser.login) {
    return currentUser.login.toLowerCase() === team.url;
  }
  return false;
};

const useTeamNameConflictWarning = (team) => {
  const { currentUser } = useCurrentUser();
  const { createNotification } = useNotifications();
  useEffect(() => {
    if (teamConflictsWithUser(team, currentUser)) {
      const notification = createNotification(<NameConflictWarning id={currentUser.id} />, { persistent: true });
      return () => {
        notification.removeNotification();
      };
    }
    return undefined;
  }, [currentUser, team]);
};

// Team Page

function TeamPage(props) {
  const { currentUser } = useCurrentUser();
  const { team } = props;
  useTeamNameConflictWarning(team);
  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });

  const pinnedSet = new Set(team.teamPins.map(({ projectId }) => projectId));
  // filter featuredProject out of both pinned & recent projects
  const [pinnedProjects, recentProjects] = partition(team.projects.filter(({ id }) => id !== team.featuredProjectId), ({ id }) => pinnedSet.has(id));
  const featuredProject = team.projects.find(({ id }) => id === team.featuredProjectId);

  const updateUrl = (url) => props.updateUrl(url).then(() => syncPageToUrl({ ...team, url }));

  const projectOptions = {
    addProjectToCollection: props.addProjectToCollection,
    deleteProject: props.deleteProject,
    leaveTeamProject: props.leaveTeamProject,
    removeProjectFromTeam: props.removeProject,
    joinTeamProject: props.joinTeamProject,
    featureProject: props.featureProject,
    isAuthorized: currentUserIsOnTeam,
  };

  return (
    <main className={styles.container}>
      <section>
        <Beta />
        <TeamProfileContainer
          item={team}
          coverActions={{
            'Upload Cover': currentUserIsTeamAdmin ? props.uploadCover : null,
            'Clear Cover': currentUserIsTeamAdmin && team.hasCoverImage ? props.clearCover : null,
          }}
          avatarActions={{
            'Upload Avatar': currentUserIsTeamAdmin ? props.uploadAvatar : null,
          }}
        >
          <TeamFields team={team} updateName={props.updateName} updateUrl={updateUrl} />
          <div className={styles.usersInformation}>
            <TeamUsers
              team={team}
              removeUserFromTeam={props.removeUserFromTeam}
              updateUserPermissions={props.updateUserPermissions}
              updateWhitelistedDomain={props.updateWhitelistedDomain}
              inviteEmail={props.inviteEmail}
              inviteUser={props.inviteUser}
              joinTeam={props.joinTeam}
            />
          </div>
          <Thanks count={team.users.reduce((total, { thanksCount }) => total + thanksCount, 0)} />
          <AuthDescription
            authorized={currentUserIsTeamAdmin}
            description={team.description}
            update={props.updateDescription}
            placeholder="Tell us about your team"
          />
        </TeamProfileContainer>
      </section>

      <ErrorBoundary>{currentUserIsOnTeam && <AddTeamProject addProject={props.addProject} teamProjects={team.projects} />}</ErrorBoundary>

      {featuredProject && (
        <FeaturedProject
          featuredProject={featuredProject}
          isAuthorized={currentUserIsOnTeam}
          unfeatureProject={props.unfeatureProject}
          addProjectToCollection={props.addProjectToCollection}
          currentUser={currentUser}
        />
      )}

      {/* Pinned Projects */}
      {pinnedProjects.length > 0 && (
        <ProjectsList
          layout="grid"
          title={
            <>
              Pinned Projects <Emoji inTitle name="pushpin" />
            </>
          }
          projects={pinnedProjects}
          isAuthorized={currentUserIsOnTeam}
          projectOptions={{
            removePin: props.removePin,
            ...projectOptions,
          }}
        />
      )}

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <ProjectsList
          layout="grid"
          title="Recent Projects"
          projects={recentProjects}
          isAuthorized={currentUserIsOnTeam}
          enablePagination
          enableFiltering={recentProjects.length > 6}
          projectOptions={{
            addPin: props.addPin,
            ...projectOptions,
          }}
        />
      )}

      {team.projects.length === 0 && currentUserIsOnTeam && <ProjectPals />}

      {/* TEAM COLLECTIONS */}
      <ErrorBoundary>
        <DataLoader
          get={(api) => api.get(`collections?teamId=${team.id}`)}
          renderLoader={() => <TeamPageCollections {...props} collections={team.collections} />}
        >
          {({ data }) => <TeamPageCollections {...props} collections={data} />}
        </DataLoader>
      </ErrorBoundary>

      {currentUserIsOnTeam && (
        <ErrorBoundary>
          <TeamAnalytics
            id={team.id}
            currentUserIsOnTeam={currentUserIsOnTeam}
            projects={team.projects}
            addProject={props.addProject}
            myProjects={currentUser ? currentUser.projects : []}
          />
        </ErrorBoundary>
      )}

      {currentUserIsTeamAdmin && <DeleteTeam team={team} />}

      {!currentUserIsOnTeam && (
        <>
          <ReportButton reportedType="team" reportedModel={team} />
          <TeamMarketing />
        </>
      )}
    </main>
  );
}

TeamPage.propTypes = {
  team: PropTypes.shape({
    _cacheAvatar: PropTypes.number.isRequired,
    _cacheCover: PropTypes.number.isRequired,
    adminIds: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
    hasCoverImage: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
    teamPins: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
    whitelistedDomain: PropTypes.string,
    featuredProjectId: PropTypes.string,
  }).isRequired,
  addPin: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  updateWhitelistedDomain: PropTypes.func.isRequired,
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  removeUserFromTeam: PropTypes.func.isRequired,
  removePin: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  updateUrl: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  uploadCover: PropTypes.func.isRequired,
  featureProject: PropTypes.func.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

const TeamPageEditor = ({ initialTeam, children }) => {
  const [team, funcs] = useTeamEditor(initialTeam);
  return (
    <ProjectsLoader projects={team.projects}>
      {(projects, reloadProjects) => {
        // Inject page specific changes to the editor
        // Mainly url updating and calls to reloadProjects

        const removeUserFromTeam = async (user, projectIds) => {
          await funcs.removeUserFromTeam(user, projectIds);
          reloadProjects(...projectIds);
        };

        const joinTeamProject = async (projectId) => {
          await funcs.joinTeamProject(projectId);
          reloadProjects(projectId);
        };

        const leaveTeamProject = async (projectId) => {
          await funcs.leaveTeamProject(projectId);
          reloadProjects(projectId);
        };

        return children(
          { ...team, projects },
          {
            ...funcs,
            removeUserFromTeam,
            joinTeamProject,
            leaveTeamProject,
          },
        );
      }}
    </ProjectsLoader>

  );
};
const TeamPageContainer = ({ team }) => (
  <AnalyticsContext properties={{ origin: 'team' }} context={{ groupId: team.id.toString() }}>
    <TeamPageEditor initialTeam={team}>
      {(teamFromEditor, funcs) => (
        <>
          <Helmet title={teamFromEditor.name} />
          <TeamPage team={teamFromEditor} {...funcs} />
        </>
      )}
    </TeamPageEditor>
  </AnalyticsContext>
);

export default TeamPageContainer;
