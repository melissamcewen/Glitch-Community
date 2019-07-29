import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Text from 'Components/text/text';
import { ProjectLink } from 'Components/link';
import { ProjectAvatar } from 'Components/images/avatar';
import Loader from 'Components/loader';
import { createAPIHook } from 'State/api';

import styles from './styles.styl';

const RECENT_REMIXES_COUNT = 100;

// This uses dayjs().fromNow() a bunch of times
// That requires the relativeTime plugin
// Which is added to dayjs elsewhere
const ProjectDetails = ({ projectDetails }) => (
  <article className={styles.projectDetails}>
    <ProjectLink project={projectDetails}>
      <ProjectAvatar project={projectDetails} hasAlt />
    </ProjectLink>
    <table className={styles.projectDetailsTable}>
      <tbody>
        <tr>
          <th>Name</th>
          <td>{projectDetails.domain}</td>
        </tr>
        <tr>
          <th>Created</th>
          <td>{dayjs(projectDetails.createdAt).fromNow()}</td>
        </tr>
        <tr>
          <th>Last viewed</th>
          <td>{dayjs(projectDetails.lastAccess).fromNow()}</td>
        </tr>
        <tr>
          <th>Last edited</th>
          <td>{dayjs(projectDetails.lastEditedAt).fromNow()}</td>
        </tr>
        <tr>
          <th>Last remixed</th>
          <td>{projectDetails.lastRemixedAt ? dayjs(projectDetails.lastRemixedAt).fromNow() : 'never'}</td>
        </tr>
        <tr>
          <th>Total app views</th>
          <td>{projectDetails.numAppVisits}</td>
        </tr>
        <tr>
          <th>Total code views</th>
          <td>{projectDetails.numEditorVisits}</td>
        </tr>
        <tr>
          <th>Total direct remixes</th>
          <td>{projectDetails.numDirectRemixes}</td>
        </tr>
        <tr>
          <th>Total remixes</th>
          <td>{projectDetails.numTotalRemixes}</td>
        </tr>
        {projectDetails.baseProject.domain && (
          <tr>
            <th>Originally remixed from</th>
            <td>
              <ProjectLink project={projectDetails.baseProject}>
                <span className={styles.baseProjectAvatar}>
                  <ProjectAvatar project={projectDetails.baseProject} />
                </span>
                {projectDetails.baseProject.domain}
              </ProjectLink>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </article>
);

const ProjectRemixItem = ({ remix }) => (
  <ProjectLink project={remix}>
    <TooltipContainer
      target={<ProjectAvatar project={remix} hasAlt />}
      align={['left']}
      type="action"
      tooltip={remix.domain}
    />
  </ProjectLink>
);

const useProjectDetails = createAPIHook(async (api, id, currentProjectDomain) => {
  const { data } = await api.get(`analytics/${id}/project/${currentProjectDomain}/overview`);
  return data;
});

function TeamAnalyticsProjectDetails({ activeFilter, id, currentProjectDomain }) {
  const { value: projectDetails } = useProjectDetails(id, currentProjectDomain);
  if (!projectDetails) return <Loader />;

  const projectRemixes = projectDetails.remixes.slice(0, RECENT_REMIXES_COUNT);
  return (
    <React.Fragment>
      <ProjectDetails projectDetails={projectDetails} />
      {activeFilter === 'remixes' && (
        <article>
          <h4>Latest Remixes</h4>
          {projectRemixes.length === 0 && <Text>No remixes yet <span aria-hidden="true">(／_^)／ ●</span></Text>}
          {projectRemixes.map((remix) => (
            <ProjectRemixItem key={remix.id} remix={remix} />
          ))}
        </article>
      )}
    </React.Fragment>
  );
}

TeamAnalyticsProjectDetails.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default TeamAnalyticsProjectDetails;
