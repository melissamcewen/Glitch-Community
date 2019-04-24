import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import { Redirect } from 'react-router-dom';

import Button from 'Components/buttons/button';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import Emoji from 'Components/images/emoji';
import Heading from 'Components/text/heading';
import Markdown from 'Components/text/markdown';
import NotFound from 'Components/errors/not-found';
import ProjectEmbed from 'Components/project/project-embed';
import ProfileList from 'Components/profile/profile-list';
import ProjectDomainInput from 'Components/fields/project-domain-input';
import PopoverWithButton from '../pop-overs/popover-with-button';
import { getAvatarUrl } from '../../models/project';
import { getSingleItem, getAllPages, allByKeys } from '../../../shared/api';

import { AnalyticsContext } from '../segment-analytics';
import { DataLoader } from '../includes/loader';
import ProjectEditor from '../project-editor';
import Expander from '../includes/expander';
import { AuthDescription } from '../includes/description-field';
import { InfoContainer, ProjectInfoContainer } from '../includes/profile';
import { ShowButton, EditButton } from '../includes/project-actions';

import RelatedProjects from '../includes/related-projects';
import IncludedInCollections from '../includes/included-in-collections';
import { addBreadcrumb } from '../../utils/sentry';

import { useAPI } from '../../state/api';
import useErrorHandlers from './error-handlers';
import { useCurrentUser } from '../../state/current-user';

import { getLink as getUserLink } from './user';

import Layout from '../layout';

function syncPageToDomain(domain) {
  history.replaceState(null, null, `/~${domain}`);
}

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
const ReadmeLoader = ({ domain }) => {
  const api = useAPI();
  return (
    <DataLoader get={() => api.get(`projects/${domain}/readme`)} renderError={ReadmeError}>
      {({ data }) => (
        <Expander height={250}>
          <Markdown>{data.toString()}</Markdown>
        </Expander>
      )}
    </DataLoader>
  );
};
ReadmeLoader.propTypes = {
  domain: PropTypes.string.isRequired,
};

const DeleteProject = ({ project, deleteProject }) => {
  const [done, setDone] = useState(false);
  if (done){
    return <Redirect to={getUserLink(this.props.currentUser)}/>
  }
  return(
     <section>
        <PopoverWithButton
          buttonClass="button-small button-tertiary"
          buttonText={
            <>
              Delete {this.props.project.domain}
              <Emoji name="bomb"/>
            </>
          }
        >
          {({ togglePopover }) => 
            <>
              <dialog className="pop-over delete-project-pop" open>
                <section className="pop-over-actions">
                  <div className="action-description">
                    You can always undelete a project from your profile page.
                  </div>
                  <Button type="dangerZone" small="size" onClick={() => 
                    {
                      deleteProject();
                      setDone(true);
                    }}>
                    Delete {this.props.project.domain} <Emoji name="bomb"/>
                  </Button>
                </section>
              </dialog>
            </>
        }
        </PopoverWithButton>
      </section>
    )
}

DeleteProject.propTypes = {
  project: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
}



const ProjectPage = ({ project, addProjectToCollection, currentUser, isAuthorized, updateDomain, updateDescription, updatePrivate, deleteProject }) => {
  const { domain, users, teams } = project;
  return (
    <main className="project-page">
      <section id="info">
        <InfoContainer>
          <ProjectInfoContainer style={{ backgroundImage: `url('${getAvatarUrl(project.id)}')` }}>
            <Heading tagName="h1">
              {isAuthorized ? (
                <ProjectDomainInput
                  domain={domain}
                  onChange={(newDomain) => updateDomain(newDomain).then(() => syncPageToDomain(newDomain))}
                  privacy={<PrivateToggle isPrivate={project.private} isMember={isAuthorized} setPrivate={updatePrivate} />}
                />
              ) : (
                <>
                  {domain} {project.private && <PrivateBadge />}
                </>
              )}
            </Heading>
            {users.length + teams.length > 0 && (
              <div className="users-information">
                <ProfileList hasLinks teams={teams} users={users} layout="block" />
              </div>
            )}
            <AuthDescription
              authorized={isAuthorized}
              description={project.description}
              update={updateDescription}
              placeholder="Tell us about your app"
            />
            <p className="buttons">
              <ShowButton name={domain} />
              <EditButton name={domain} isMember={isAuthorized} />
            </p>
          </ProjectInfoContainer>
        </InfoContainer>
      </section>
      <div className="project-embed-wrap">
        <ProjectEmbed project={project} isAuthorized={isAuthorized} currentUser={currentUser} addProjectToCollection={addProjectToCollection} />
      </div>
      <section id="readme">
        <ReadmeLoader domain={domain} />
      </section>
      
      { isAuthorized && <DeleteProject project={project} currentUser={currentUser} deleteProject={deleteProject}/> }
          
      <section id="included-in-collections">
        <IncludedInCollections projectId={project.id} />
      </section>
      <section id="related">
        <RelatedProjects ignoreProjectId={project.id} {...{ teams, users }} />
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
  const api = useAPI();
  const { currentUser } = useCurrentUser();

  return (
    <DataLoader get={() => getProject(api, domain)} renderError={() => <NotFound name={domain} />}>
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
