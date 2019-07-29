import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { partition } from 'lodash';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import FeaturedProject from 'Components/project/featured-project';
import ProjectsList from 'Components/containers/projects-list';
import Thanks from 'Components/thanks';
import { TeamProfileContainer } from 'Components/containers/profile';
import CollectionsList from 'Components/collections-list';
import Image from 'Components/images/image';
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
import Link from 'Components/link';
import { getLink, userIsOnTeam, userIsTeamAdmin } from 'Models/team';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { useTeamEditor } from 'State/team';
import useFocusFirst from 'Hooks/use-focus-first';

import styles from './team.styl';

function syncPageToUrl(team) {
  history.replaceState(null, null, getLink(team));
}

const Beta = () => (
  <Link to="/teams/" target="_blank" className={styles.beta}>
    <img src="https://cdn.glitch.com/0c3ba0da-dac8-4904-bb5e-e1c7acc378a2%2Fbeta-flag.svg?1541448893958" alt="" />
    <div>
      <Heading tagName="h4">Teams are in beta</Heading>
      <Text>Learn More</Text>
    </div>
  </Link>
);

const ProjectPals = () => (
  <aside className={styles.addProjectToEmptyTeam}>
    <Image src="https://cdn.glitch.com/02ae6077-549b-429d-85bc-682e0e3ced5c%2Fcollaborate.svg?1540583258925" alt="" />
    <Text>Add projects to share them with your team</Text>
  </aside>
);

const TeamMarketing = () => (
  <section className={styles.teamMarketing}>
    <Text>
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
  <React.Fragment>
    <Text>This team has your name. You should update your info to remain unique <Emoji name="sparkles" /></Text>
    <Button size="small" type="tertiary" href={`/user/${id}`}>
      Your Profile
    </Button>
  </React.Fragment>
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

function TeamPage({ team: initialTeam }) {
  const { currentUser } = useCurrentUser();
  const [team, funcs] = useTeamEditor(initialTeam);
  useTeamNameConflictWarning(team);
  const currentUserIsOnTeam = userIsOnTeam({ team, user: currentUser });
  const currentUserIsTeamAdmin = userIsTeamAdmin({ team, user: currentUser });

  const pinnedSet = new Set(team.teamPins.map(({ projectId }) => projectId));
  // filter featuredProject out of both pinned & recent projects
  const [pinnedProjects, recentProjects] = partition(team.projects.filter(({ id }) => id !== team.featuredProjectId), ({ id }) => pinnedSet.has(id));
  const featuredProject = team.projects.find(({ id }) => id === team.featuredProjectId);

  const updateUrl = (url) => funcs.updateUrl(url).then(() => syncPageToUrl({ ...team, url }));
  useFocusFirst();

  const projectOptions = { ...funcs, team };

  return (
    <main className={styles.container} id="main">
      <section>
        <Beta />
        <TeamProfileContainer
          item={team}
          coverActions={{
            'Upload Cover': currentUserIsTeamAdmin ? funcs.uploadCover : null,
            'Clear Cover': currentUserIsTeamAdmin && team.hasCoverImage ? funcs.clearCover : null,
          }}
          avatarActions={{
            'Upload Avatar': currentUserIsTeamAdmin ? funcs.uploadAvatar : null,
          }}
        >
          <TeamFields team={team} updateName={funcs.updateName} updateUrl={updateUrl} />
          <div className={styles.usersInformation}>
            <TeamUsers
              team={team}
              removeUserFromTeam={funcs.removeUserFromTeam}
              updateUserPermissions={funcs.updateUserPermissions}
              updateWhitelistedDomain={funcs.updateWhitelistedDomain}
              inviteEmail={funcs.inviteEmail}
              inviteUser={funcs.inviteUser}
              joinTeam={funcs.joinTeam}
            />
          </div>
          <Thanks count={team.users.reduce((total, { thanksCount }) => total + thanksCount, 0)} />
          <AuthDescription
            authorized={currentUserIsTeamAdmin}
            description={team.description}
            update={funcs.updateDescription}
            placeholder="Tell us about your team"
          />
        </TeamProfileContainer>
      </section>

      <ErrorBoundary>{currentUserIsOnTeam && <AddTeamProject addProject={funcs.addProject} teamProjects={team.projects} />}</ErrorBoundary>

      {featuredProject && (
        <FeaturedProject
          featuredProject={featuredProject}
          isAuthorized={currentUserIsOnTeam}
          unfeatureProject={funcs.unfeatureProject}
          addProjectToCollection={funcs.addProjectToCollection}
          currentUser={currentUser}
        />
      )}

      {/* Pinned Projects */}
      {pinnedProjects.length > 0 && (
        <ProjectsList
          layout="grid"
          title={
            <React.Fragment>
              Pinned Projects <Emoji inTitle name="pushpin" />
            </React.Fragment>
          }
          projects={pinnedProjects}
          isAuthorized={currentUserIsOnTeam}
          projectOptions={projectOptions}
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
          projectOptions={projectOptions}
        />
      )}

      {team.projects.length === 0 && currentUserIsOnTeam && <ProjectPals />}

      {/* TEAM COLLECTIONS */}
      <CollectionsList
        title="Collections"
        enablePagination
        enableFiltering={team.collections.length > 6}
        collections={team.collections.map((collection) => ({ ...collection, team }))}
        maybeTeam={team}
        isAuthorized={currentUserIsOnTeam}
      />

      {currentUserIsOnTeam && (
        <ErrorBoundary>
          <TeamAnalytics
            id={team.id}
            currentUserIsOnTeam={currentUserIsOnTeam}
            projects={team.projects}
            addProject={funcs.addProject}
            myProjects={currentUser ? currentUser.projects : []}
          />
        </ErrorBoundary>
      )}

      {currentUserIsTeamAdmin && <DeleteTeam team={team} />}

      {!currentUserIsOnTeam && (
        <React.Fragment>
          <ReportButton reportedType="team" reportedModel={team} />
          <TeamMarketing />
        </React.Fragment>
      )}
    </main>
  );
}

TeamPage.propTypes = {
  team: PropTypes.shape({
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
};

const TeamPageContainer = ({ team }) => (
  <AnalyticsContext properties={{ origin: 'team' }} context={{ groupId: team.id.toString() }}>
    <Helmet title={team.name} />
    <TeamPage team={team} />
  </AnalyticsContext>
);

export default TeamPageContainer;
