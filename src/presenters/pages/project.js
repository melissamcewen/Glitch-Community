import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import Helmet from 'react-helmet';

import Button from 'Components/buttons/button';
import Heading from 'Components/text/heading';
import Loader from 'Components/loader';
import Markdown from 'Components/text/markdown';
import NotFound from 'Components/errors/not-found';
import CollectionItem from 'Components/collection/collection-item';
import ProjectEmbed from 'Components/project/project-embed';
import ProfileList from 'Components/profile-list';
import OptimisticTextInput from 'Components/fields/optimistic-text-input';
import { ProjectProfileContainer } from 'Components/containers/profile';
import DataLoader from 'Components/data-loader';
import Row from 'Components/containers/row';
import RelatedProjects from 'Components/related-projects';
import Expander from 'Components/containers/expander';
import { PopoverWithButton, PopoverDialog, PopoverActions, ActionDescription } from 'Components/popover';
import { ShowButton, EditButton } from 'Components/project/project-actions';
import AuthDescription from 'Components/fields/auth-description';
import Layout from 'Components/layout';
import { PrivateBadge, PrivateToggle } from 'Components/private-badge';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { useProjectEditor, getProjectByDomain } from 'State/project';
import { getLink as getUserLink } from 'Models/user';
import { userIsProjectMember } from 'Models/project';
import { addBreadcrumb } from 'Utils/sentry';
import { getAllPages } from 'Shared/api';
import useFocusFirst from 'Hooks/use-focus-first';

import styles from './project.styl';

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const filteredCollections = (collections) => collections.filter((c) => c.user || c.team);

const IncludedInCollections = ({ projectId }) => (
  <DataLoader get={(api) => getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100`)} renderLoader={() => null}>
    {(collections) =>
      collections.length > 0 && (
        <>
          <Heading tagName="h2">Included in Collections</Heading>
          <Row items={filteredCollections(collections)}>{(collection) => <CollectionItem collection={collection} showCurator />}</Row>
        </>
      )
    }
  </DataLoader>
);

const ReadmeError = (error) =>
  error && error.response && error.response.status === 404 ? (
    <>
      This project would be even better with a <code>README.md</code>
    </>
  ) : (
    <>We couldn{"'"}t load the readme. Try refreshing?</>
  );
const ReadmeLoader = withRouter(({ domain, location }) => (
  <DataLoader get={(api) => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({ data }) =>
      location.hash ? (
        <Markdown linkifyHeadings>{data.toString()}</Markdown>
      ) : (
        <Expander height={location.hash ? Infinity : 250}>
          <Markdown linkifyHeadings>{data.toString()}</Markdown>
        </Expander>
      )
    }
  </DataLoader>
));

ReadmeLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

function DeleteProjectPopover({ projectDomain, deleteProject }) {
  const { currentUser } = useCurrentUser();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(
    () => {
      if (done) {
        window.location = getUserLink(currentUser);
      }
    },
    [done, currentUser],
  );

  return (
    <section>
      <PopoverWithButton buttonProps={{ size: 'small', type: 'dangerZone', emoji: 'bomb' }} buttonText="Delete Project">
        {({ togglePopover }) => (
          <PopoverDialog align="left" wide>
            <PopoverActions>
              <ActionDescription>You can always undelete a project from your profile page.</ActionDescription>
            </PopoverActions>
            <PopoverActions type="dangerZone">
              {loading ? (
                <Loader />
              ) : (
                <Button
                  type="tertiary"
                  size="small"
                  emoji="bomb"
                  onClick={() => {
                    setLoading(true);
                    deleteProject().then(() => {
                      togglePopover();
                      setDone(true);
                    });
                  }}
                >
                  Delete {projectDomain}
                </Button>
              )}
            </PopoverActions>
          </PopoverDialog>
        )}
      </PopoverWithButton>
    </section>
  );
}

DeleteProjectPopover.propTypes = {
  deleteProject: PropTypes.func.isRequired,
};

const ProjectPage = ({ project: initialProject }) => {
  const [project, { updateDomain, updateDescription, updatePrivate, deleteProject, uploadAvatar }] = useProjectEditor(initialProject);
  useFocusFirst();
  const { currentUser } = useCurrentUser();
  const isAuthorized = userIsProjectMember({ project, user: currentUser });
  const { domain, users, teams, suspendedReason } = project;
  const updateDomainAndSync = (newDomain) => updateDomain(newDomain).then(() => syncPageToDomain(newDomain));
  return (
    <main id="main">
      <section id="info">
        <ProjectProfileContainer
          currentUser={currentUser}
          project={project}
          isAuthorized={isAuthorized}
          avatarActions={{
            'Upload Avatar': isAuthorized ? uploadAvatar : null,
          }}
        >
          {isAuthorized ? (
            <div className={styles.headingWrap}>
              <Heading tagName="h1">
                <OptimisticTextInput
                  labelText="Project Domain"
                  value={project.domain}
                  onChange={updateDomainAndSync}
                  placeholder="Name your project"
                />
              </Heading>
              <PrivateToggle isPrivate={project.private} setPrivate={updatePrivate} />
            </div>
          ) : (
            <div className={styles.headingWrap}>
              <Heading tagName="h1">{!currentUser.isSupport && suspendedReason ? 'suspended project' : domain}</Heading>
              {project.private && <PrivateBadge />}
            </div>
          )}
          {users.length + teams.length > 0 && (
            <div>
              <ProfileList hasLinks teams={teams} users={users} layout="block" />
            </div>
          )}
          <AuthDescription
            authorized={isAuthorized}
            description={!currentUser.isSupport && !isAuthorized && suspendedReason ? 'suspended project' : project.description}
            update={updateDescription}
            placeholder="Tell us about your app"
          />
          <div>
            <span className={styles.profileButton}>
              <ShowButton name={domain} />
            </span>
            <span className={styles.profileButton}>
              <EditButton name={domain} isMember={isAuthorized} />
            </span>
          </div>
        </ProjectProfileContainer>
      </section>
      <div className={styles.projectEmbedWrap}>
        <ProjectEmbed project={project} />
      </div>
      <section id="readme">
        <ReadmeLoader domain={domain} />
      </section>

      {isAuthorized && <DeleteProjectPopover projectDomain={project.domain} currentUser={currentUser} deleteProject={deleteProject} />}

      <section id="included-in-collections">
        <IncludedInCollections projectId={project.id} />
      </section>
      <section id="related">
        <RelatedProjects project={project} />
      </section>
    </main>
  );
};
ProjectPage.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
};

async function addProjectBreadcrumb(projectWithMembers) {
  const { users, teams, ...project } = projectWithMembers;
  addBreadcrumb({
    level: 'info',
    message: `project: ${JSON.stringify(project)}`,
  });
  return projectWithMembers;
}

const ProjectPageContainer = ({ name: domain }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'project' }}>
      <DataLoader get={(api) => getProjectByDomain(api, domain).then(addProjectBreadcrumb)} renderError={() => <NotFound name={domain} />}>
        {(project) =>
          project ? (
            <>
              <Helmet title={project.domain} />
              <ProjectPage project={project} />
            </>
          ) : (
            <NotFound name={domain} />
          )
        }
      </DataLoader>
    </AnalyticsContext>
  </Layout>
);

export default ProjectPageContainer;
