import React from 'react';
import PropTypes from 'prop-types';
import { sampleSize, difference } from 'lodash';

import { ProjectsUL } from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import { TeamLink, UserLink } from 'Components/link';
import { getDisplayName } from '../../models/user';
import { useAPI } from '../../state/api';

const PROJECT_COUNT = 3;

const RelatedProjectsBody = ({ projects, type, item }) =>
  projects.length > 0 ? (
    <CoverContainer type={type} item={item}>
      <div className="projects">
        <ProjectsUL projects={projects} />
      </div>
    </CoverContainer>
  ) : null;

RelatedProjectsBody.propTypes = {
  projects: PropTypes.array.isRequired,
};

class RelatedProjects extends React.Component {
  constructor(props) {
    super(props);
    const teams = sampleSize(props.teams, 1);
    const users = sampleSize(props.users, 2 - teams.length);
    this.state = { teams, users };
  }

  async getProjects(id, getPins, getAllProjects) {
    const pins = await getPins(id);
    const pinIds = pins.map((pin) => pin.projectId);
    let ids = sampleSize(difference(pinIds, [this.props.ignoreProjectId]), PROJECT_COUNT);

    if (ids.length < PROJECT_COUNT) {
      const { projects } = await getAllProjects(id);

      const allIds = projects.map((project) => project.id);
      const remainingIds = difference(allIds, [this.props.ignoreProjectId, ...ids]);
      ids = [...ids, ...sampleSize(remainingIds, PROJECT_COUNT - ids.length)];
    }

    if (ids.length) {
      const { data } = await this.props.api.get(`projects/byIds?ids=${ids.join(',')}`);

      return data.length ? data : null;
    }
    return null;
  }

  render() {
    const { api } = this.props;
    const getTeam = (id) => api.get(`teams/${id}`).then(({ data }) => data);
    const getTeamPins = (id) => api.get(`teams/${id}/pinned-projects`).then(({ data }) => data);
    const getUser = (id) => api.get(`users/${id}`).then(({ data }) => data);
    const getUserPins = (id) => api.get(`users/${id}/pinned-projects`).then(({ data }) => data);
    const { teams, users } = this.state;
    if (!teams.length && !users.length) {
      return null;
    }
    return (
      <ul className="related-projects">
        {teams.map((team) => (
          <li key={team.id}>
            <DataLoader get={() => this.getProjects(team.id, getTeamPins, getTeam)}>
              {(projects) =>
                projects && (
                  <>
                    <h2>
                      <TeamLink team={team}>More by {team.name} →</TeamLink>
                    </h2>
                    <RelatedProjectsBody projects={projects} type="team" item={team} />
                  </>
                )
              }
            </DataLoader>
          </li>
        ))}
        {users.map((user) => (
          <li key={user.id}>
            <DataLoader get={() => this.getProjects(user.id, getUserPins, getUser)}>
              {(projects) =>
                projects && (
                  <>
                    <h2>
                      <UserLink user={user}>More by {getDisplayName(user)} →</UserLink>
                    </h2>
                    <RelatedProjectsBody projects={projects} type="user" item={user} />
                  </>
                )
              }
            </DataLoader>
          </li>
        ))}
      </ul>
    );
  }
}
RelatedProjects.propTypes = {
  api: PropTypes.func.isRequired,
  ignoreProjectId: PropTypes.string.isRequired,
  teams: PropTypes.array,
  users: PropTypes.array,
};

RelatedProjects.defaultProps = {
  teams: [],
  users: [],
};

export default (props) => {
  const api = useAPI();
  return <RelatedProjects {...props} api={api} />;
};
