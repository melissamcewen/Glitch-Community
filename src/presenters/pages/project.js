import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import Helmet from 'react-helmet';

import Button from 'Components/buttons/button';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import Heading from 'Components/text/heading';
import Loader from 'Components/loader';
import Markdown from 'Components/text/markdown';
import NotFound from 'Components/errors/not-found';
import CollectionItem from 'Components/collection/collection-item';
import ProjectEmbed from 'Components/project/project-embed';
import ProfileList from 'Components/profile-list';
import ProjectDomainInput from 'Components/fields/project-domain-input';
import { ProjectProfileContainer } from 'Components/containers/profile';
import DataLoader from 'Components/data-loader';
import Row from 'Components/containers/row';
import RelatedProjects from 'Components/related-projects';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';
import { getLink as getUserLink } from 'Models/user';
import { addBreadcrumb } from 'Utils/sentry';

import { PopoverWithButton } from 'Components/popover';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';
import ProjectEditor from '../project-editor';
import Expander from '../includes/expander';
import AuthDescription from '../includes/auth-description';
import { ShowButton, EditButton } from '../includes/project-actions';
import Layout from '../layout';

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

const getIncludedCollections = async (api, projectId) => {
  const collections = await getAllPages(api, `/v1/projects/by/id/collections?id=${projectId}&limit=100&orderKey=createdAt&orderDirection=DESC`);
  const selectedCollections = sampleSize(collections, 3);
  const populatedCollections = await Promise.all(
    selectedCollections.map(async (collection) => {
      const { projects, user, team } = await allByKeys({
        projects: getAllPages(api, `/v1/collections/by/id/projects?id=${collection.id}&limit=100&orderKey=projectOrder&orderDirection=ASC`),
        user: collection.user && getSingleItem(api, `v1/users/by/id?id=${collection.user.id}`, collection.user.id),
        team: collection.team && getSingleItem(api, `v1/teams/by/id?id=${collection.team.id}`, collection.team.id),
      });
      return { ...collection, projects, user, team };
    }),
  );
  return populatedCollections.filter((c) => c.team || c.user);
};

const IncludedInCollections = ({ projectId }) => (
  <DataLoader get={(api) => getIncludedCollections(api, projectId)} renderLoader={() => null}>
    {(collections) =>
      collections.length > 0 && (
        <>
          <Heading tagName="h2">Included in Collections</Heading>
          <Row items={collections}>{(collection) => <CollectionItem collection={collection} showCurator />}</Row>
        </>
      )
    }
  </DataLoader>
);

const PrivateTooltip = 'Only members can view code';
const PublicTooltip = 'Visible to everyone';

const PrivateBadge = () => (
  <TooltipContainer
    type="info"
    id="private-project-badge-tooltip"
    tooltip={PrivateTooltip}
    target={<span className="project-badge private-project-badge" />}
  />
);

const PrivateToggle = ({ isPrivate, setPrivate }) => {
  const tooltip = isPrivate ? PrivateTooltip : PublicTooltip;
  const classBase = 'button-tertiary button-on-secondary-background project-badge';
  const className = isPrivate ? 'private-project-badge' : 'public-project-badge';

  return (
    <TooltipContainer
      type="action"
      id="toggle-private-button-tooltip"
      target={<button onClick={() => setPrivate(!isPrivate)} className={`${classBase} ${className}`} type="button" />}
      tooltip={tooltip}
    />
  );
};
PrivateToggle.propTypes = {
  isPrivate: PropTypes.bool.isRequired,
  setPrivate: PropTypes.func.isRequired,
};

const ReadmeError = (error) =>
  error && error.response && error.response.status === 404 ? (
    <>
      This project would be even better with a <code>README.md</code>
    </>
  ) : (
    <>We couldn{"'"}t load the readme. Try refreshing?</>
  );
const ReadmeLoader = ({ domain }) => (
  <DataLoader get={(api) => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
    {({ data }) => (
      <Expander height={250}>
        <Markdown>{data.toString()}</Markdown>
      </Expander>
    )}
  </DataLoader>
);

ReadmeLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

function DeleteProjectButton({ projectDomain, deleteProject, currentUser }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (done) {
      window.location = getUserLink(currentUser);
    }
  }, [done, currentUser]);

  return (
    <section>
      <PopoverWithButton
        buttonText="Delete Project"
        buttonProps={{ emoji: 'bomb', type: 'dangerZone', size: 'small' }}
      >
        {({ togglePopover, focusFirstElement }) => (
          <>
            <dialog className="pop-over delete-project-pop" open ref={focusFirstElement} tabIndex="0">
              <section className="pop-over-actions">
                <div className="action-description">You can always undelete a project from your profile page.</div>
              </section>
              <section className="pop-over-actions danger-zone">
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
              </section>
            </dialog>
          </>
        )}
      </PopoverWithButton>
    </section>
  );
}

DeleteProjectButton.propTypes = {
  currentUser: PropTypes.object.isRequired,
  deleteProject: PropTypes.func.isRequired,
};

const ProjectPage = ({
  project,
  addProjectToCollection,
  currentUser,
  isAuthorized,
  updateDomain,
  updateDescription,
  updatePrivate,
  deleteProject,
  uploadAvatar,
}) => {
  const { domain, users, teams, suspendedReason } = project;
  return (
    <main className="project-page">
      <section id="info">
        <ProjectProfileContainer
          currentUser={currentUser}
          project={project}
          isAuthorized={isAuthorized}
          avatarActions={{
            'Upload Avatar': isAuthorized ? uploadAvatar : null,
          }}
        >
          <Heading tagName="h1">
            {isAuthorized ? (
              <ProjectDomainInput
                domain={domain}
                onChange={(newDomain) => updateDomain(newDomain).then(() => syncPageToDomain(newDomain))}
                privacy={<PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate} />}
              />
            ) : (
              <>
                {!currentUser.isSupport && suspendedReason ? 'suspended project' : domain} {project.private && <PrivateBadge />}
              </>
            )}
          </Heading>
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
            <span className="project-page__profile-button">
              <ShowButton name={domain} />
            </span>
            <span className="project-page__profile-button">
              <EditButton name={domain} isMember={isAuthorized} />
            </span>
          </div>
        </ProjectProfileContainer>
      </section>
      <div className="project-embed-wrap">
        <ProjectEmbed project={project} isAuthorized={isAuthorized} currentUser={currentUser} addProjectToCollection={addProjectToCollection} />
      </div>
      <section id="readme">
        <ReadmeLoader domain={domain} />
      </section>

      {isAuthorized && <DeleteProjectButton projectDomain={project.domain} currentUser={currentUser} deleteProject={deleteProject} />}

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
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    private: PropTypes.bool,
    domain: PropTypes.string.isRequired,
    teams: PropTypes.array.isRequired,
    users: PropTypes.array.isRequired,
  }).isRequired,
  updateDomain: PropTypes.func.isRequired,
  updateDescription: PropTypes.func.isRequired,
  updatePrivate: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
};

async function getProject(api, domain) {
  const data = await allByKeys({
    project: getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain),
    teams: getAllPages(api, `v1/projects/by/domain/teams?domain=${domain}`),
    users: getAllPages(api, `v1/projects/by/domain/users?domain=${domain}`),
  });

  const { project, ...rest } = data;
  addBreadcrumb({
    level: 'info',
    message: `project: ${JSON.stringify(project)}`,
  });
  return { ...project, ...rest };
}

const ProjectPageLoader = ({ domain, ...props }) => {
  const { currentUser } = useCurrentUser();

  return (
    <DataLoader get={(api) => getProject(api, domain)} renderError={() => <NotFound name={domain} />}>
      {(project) =>
        project ? (
          <ProjectEditor initialProject={project}>
            {(currentProject, funcs, userIsMember) => (
              <>
                <Helmet title={currentProject.domain} />
                <ProjectPage project={currentProject} {...funcs} isAuthorized={userIsMember} currentUser={currentUser} {...props} />
              </>
            )}
          </ProjectEditor>
        ) : (
          <NotFound name={domain} />
        )
      }
    </DataLoader>
  );
};
ProjectPageLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

const ProjectPageContainer = ({ name }) => (
  <Layout>
    <AnalyticsContext properties={{ origin: 'project' }}>
      <ProjectPageLoader domain={name} />
    </AnalyticsContext>
  </Layout>
);

export default ProjectPageContainer;
