import React from 'react';
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
import { getLink } from 'Models/team';
import { AnalyticsContext } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import TeamEditor from '../team-editor';
import AuthDescription from '../includes/auth-description';
import ErrorBoundary from '../includes/error-boundary';

import NameConflictWarning from '../includes/name-conflict';
import AddTeamProject from '../pop-overs/add-team-project-pop';
import DeleteTeam from '../pop-overs/delete-team-pop';
import TeamUsers from '../includes/team-users';

import ProjectsLoader from '../projects-loader';
import TeamAnalytics from '../includes/team-analytics';
import { TeamMarketing } from '../includes/team-elements';
import ReportButton from '../pop-overs/report-abuse-pop';
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

// Team Page

class TeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.addProjectToCollection = this.addProjectToCollection.bind(this);
  }

  getProjectOptions() {
    const projectOptions = {
      addProjectToCollection: this.addProjectToCollection,
      deleteProject: this.props.deleteProject,
      leaveTeamProject: this.props.leaveTeamProject,
      removeProjectFromTeam: this.props.removeProject,
      joinTeamProject: this.props.joinTeamProject,
      featureProject: this.props.featureProject,
      isAuthorized: this.props.currentUserIsOnTeam,
    };

    return projectOptions;
  }

  async addProjectToCollection(project, collection) {
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
  }

  render() {
    const { team } = this.props;
    const pinnedSet = new Set(team.teamPins.map(({ projectId }) => projectId));
    // filter featuredProject out of both pinned & recent projects
    const [pinnedProjects, recentProjects] = partition(team.projects.filter(({ id }) => id !== team.featuredProjectId), ({ id }) =>
      pinnedSet.has(id),
    );
    const featuredProject = team.projects.find(({ id }) => id === team.featuredProjectId);

    const updateUrl = (url) => this.props.updateUrl(url).then(() => syncPageToUrl({ ...team, url }));

    return (
      <main className={styles.container}>
        <section>
          <Beta />
          <TeamProfileContainer
            item={team}
            coverActions={{
              'Upload Cover': this.props.currentUserIsTeamAdmin ? this.props.uploadCover : null,
              'Clear Cover': this.props.currentUserIsTeamAdmin && team.hasCoverImage ? this.props.clearCover : null,
            }}
            avatarActions={{
              'Upload Avatar': this.props.currentUserIsTeamAdmin ? this.props.uploadAvatar : null,
            }}
          >
            <TeamFields team={team} updateName={this.props.updateName} updateUrl={updateUrl} />
            <div className={styles.usersInformation}>
              <TeamUsers
                team={team}
                removeUserFromTeam={this.props.removeUserFromTeam}
                updateUserPermissions={this.props.updateUserPermissions}
                updateWhitelistedDomain={this.props.updateWhitelistedDomain}
                inviteEmail={this.props.inviteEmail}
                inviteUser={this.props.inviteUser}
                joinTeam={this.props.joinTeam}
              />
            </div>
            <Thanks count={team.users.reduce((total, { thanksCount }) => total + thanksCount, 0)} />
            <AuthDescription
              authorized={this.props.currentUserIsTeamAdmin}
              description={team.description}
              update={this.props.updateDescription}
              placeholder="Tell us about your team"
            />
          </TeamProfileContainer>
        </section>

        <ErrorBoundary>
          {this.props.currentUserIsOnTeam && <AddTeamProject addProject={this.props.addProject} teamProjects={team.projects} />}
        </ErrorBoundary>

        {featuredProject && (
          <FeaturedProject
            featuredProject={featuredProject}
            isAuthorized={this.props.currentUserIsOnTeam}
            unfeatureProject={this.props.unfeatureProject}
            addProjectToCollection={this.props.addProjectToCollection}
            currentUser={this.props.currentUser}
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
            isAuthorized={this.props.currentUserIsOnTeam}
            projectOptions={{
              removePin: this.props.removePin,
              ...this.getProjectOptions(),
            }}
          />
        )}

        {/* Recent Projects */}
        {recentProjects.length > 0 && (
          <ProjectsList
            layout="grid"
            title="Recent Projects"
            projects={recentProjects}
            isAuthorized={this.props.currentUserIsOnTeam}
            enablePagination
            enableFiltering={recentProjects.length > 6}
            projectOptions={{
              addPin: this.props.addPin,
              ...this.getProjectOptions(),
            }}
          />
        )}

        {team.projects.length === 0 && this.props.currentUserIsOnTeam && <ProjectPals />}

        {/* TEAM COLLECTIONS */}
        <ErrorBoundary>
          <DataLoader
            get={(api) => api.get(`collections?teamId=${team.id}`)}
            renderLoader={() => <TeamPageCollections {...this.props} collections={team.collections} />}
          >
            {({ data }) => <TeamPageCollections {...this.props} collections={data} />}
          </DataLoader>
        </ErrorBoundary>

        {this.props.currentUserIsOnTeam && (
          <ErrorBoundary>
            <TeamAnalytics
              id={team.id}
              currentUserIsOnTeam={this.props.currentUserIsOnTeam}
              projects={team.projects}
              addProject={this.props.addProject}
              myProjects={this.props.currentUser ? this.props.currentUser.projects : []}
            />
          </ErrorBoundary>
        )}

        {this.props.currentUserIsTeamAdmin && <DeleteTeam team={team} />}

        {!this.props.currentUserIsOnTeam && (
          <>
            <ReportButton reportedType="team" reportedModel={team} />
            <TeamMarketing />
          </>
        )}
      </main>
    );
  }
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
  api: PropTypes.func.isRequired,
  clearCover: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserIsOnTeam: PropTypes.bool.isRequired,
  currentUserIsTeamAdmin: PropTypes.bool.isRequired,
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

const teamConflictsWithUser = (team, currentUser) => {
  if (currentUser && currentUser.login) {
    return currentUser.login.toLowerCase() === team.url;
  }
  return false;
};

const TeamNameConflict = ({ team }) => {
  const { currentUser } = useCurrentUser();
  return teamConflictsWithUser(team, currentUser) && <NameConflictWarning />;
};
const TeamPageEditor = ({ initialTeam, children }) => (
  <TeamEditor initialTeam={initialTeam}>
    {(team, funcs, ...args) => (
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
            ...args,
          );
        }}
      </ProjectsLoader>
    )}
  </TeamEditor>
);
const TeamPageContainer = ({ team, ...props }) => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  return (
    <AnalyticsContext properties={{ origin: 'team' }} context={{ groupId: team.id.toString() }}>
      <TeamPageEditor initialTeam={team}>
        {(teamFromEditor, funcs, currentUserIsOnTeam, currentUserIsTeamAdmin) => (
          <>
            <Helmet title={teamFromEditor.name} />
            <TeamPage
              api={api}
              team={teamFromEditor}
              {...funcs}
              currentUser={currentUser}
              currentUserIsOnTeam={currentUserIsOnTeam}
              currentUserIsTeamAdmin={currentUserIsTeamAdmin}
              {...props}
            />
            <TeamNameConflict team={teamFromEditor} />
          </>
        )}
      </TeamPageEditor>
    </AnalyticsContext>
  );
};
export default TeamPageContainer;
