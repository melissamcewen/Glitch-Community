import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Text from 'Components/text/text';
import Loader from 'Components/loaders/loader';
import { ProjectAvatar } from 'Components/images/avatar';
import { ProjectLink } from './link';
import { useAPI } from '../../state/api';

const RECENT_REMIXES_COUNT = 100;

const getProjectDetails = async (id, api, currentProjectDomain) => {
  const path = `analytics/${id}/project/${currentProjectDomain}/overview`;
  try {
    return await api.get(path);
  } catch (error) {
    console.error('getProjectDetails', error);
  }
  return null;
};

const addFallbackSrc = (event) => {
  event.target.src = DEFAULT_PROJECT_AVATAR;
};

// This uses dayjs().fromNow() a bunch of times
// That requires the relativeTime plugin
// Which is added to dayjs elsewhere
const ProjectDetails = ({ projectDetails }) => (
  <article className="project-details">
    <ProjectLink project={projectDetails}>
      <ProjectAvatar projectDetails} />
    </ProjectLink>
    <table>
      <tbody>
        <tr>
          <td className="label">Name</td>
          <td>{projectDetails.domain}</td>
        </tr>
        <tr>
          <td className="label">Created</td>
          <td>{dayjs(projectDetails.createdAt).fromNow()}</td>
        </tr>
        <tr>
          <td className="label">Last viewed</td>
          <td>{dayjs(projectDetails.lastAccess).fromNow()}</td>
        </tr>
        <tr>
          <td className="label">Last edited</td>
          <td>{dayjs(projectDetails.lastEditedAt).fromNow()}</td>
        </tr>
        <tr>
          <td className="label">Last remixed</td>
          <td>{projectDetails.lastRemixedAt ? dayjs(projectDetails.lastRemixedAt).fromNow() : 'never'}</td>
        </tr>
        <tr>
          <td className="label">Total app views</td>
          <td>{projectDetails.numAppVisits}</td>
        </tr>
        <tr>
          <td className="label">Total code views</td>
          <td>{projectDetails.numEditorVisits}</td>
        </tr>
        <tr>
          <td className="label">Total direct remixes</td>
          <td>{projectDetails.numDirectRemixes}</td>
        </tr>
        <tr>
          <td className="label">Total remixes</td>
          <td>{projectDetails.numTotalRemixes}</td>
        </tr>
        {projectDetails.baseProject.domain && (
          <tr>
            <td className="label">Originally remixed from</td>
            <td>
              <ProjectLink project={projectDetails.baseProject}>
                <ProjectAvatar {...projectDetails.baseProject} className="baseproject-avatar" />
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
      id={`project-remix-tooltip-${remix.domain}`}
      target={<ProjectAvatar project={remix} />}
      align={['left']}
      type="action"
      tooltip={remix.domain}
    />
  </ProjectLink>
);

class TeamAnalyticsProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGettingData: true,
      projectDetails: {},
      projectRemixes: [],
    };
  }

  componentDidMount() {
    this.updateProjectDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentProjectDomain !== prevProps.currentProjectDomain) {
      this.updateProjectDetails();
    }
  }

  updateProjectDetails() {
    this.setState({
      isGettingData: true,
    });
    getProjectDetails(this.props.id, this.props.api, this.props.currentProjectDomain).then(({ data }) => {
      this.setState({
        isGettingData: false,
        projectDetails: data,
        projectRemixes: data.remixes.slice(0, RECENT_REMIXES_COUNT),
      });
    });
  }

  render() {
    if (this.state.isGettingData) {
      return <Loader />;
    }

    return (
      <>
        <ProjectDetails projectDetails={this.state.projectDetails} />
        {this.props.activeFilter === 'remixes' && (
          <article className="project-remixes">
            <h4>Latest Remixes</h4>
            <div className="project-remixes-container">
              {this.state.projectRemixes.length === 0 && <Text>No remixes yet (／_^)／ ●</Text>}
              {this.state.projectRemixes.map((remix) => (
                <ProjectRemixItem key={remix.id} remix={remix} />
              ))}
            </div>
          </article>
        )}
      </>
    );
  }
}

TeamAnalyticsProjectDetails.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

export default (props) => {
  const api = useAPI();
  return <TeamAnalyticsProjectDetails {...props} api={api} />;
};
