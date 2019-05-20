import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sampleSize } from 'lodash';

import ProjectsList from 'Components/containers/projects-list';
import CoverContainer from 'Components/containers/cover-container';
import DataLoader from 'Components/data-loader';
import { TeamLink, UserLink } from 'Components/link';
import { getDisplayName } from 'Models/user';
import styles from './styles.styl';

const PROJECT_COUNT = 3;

const RelatedProjectsBody = ({ projects, type, item }) =>
  projects.length > 0 ? (
    <CoverContainer type={type} item={item}>
      <div className={styles.projectsWrap}>
        <ProjectsList layout="row" projects={projects} fetchMembers />
      </div>
    </CoverContainer>
  ) : null;

RelatedProjectsBody.propTypes = {
  projects: PropTypes.array.isRequired,
};

async function getProjects(api, { type, id, ignoreProjectId }) {
  let [pins, recents] = await Promise.all([
    api.get(`/v1/${type}s/by/id/pinnedProjects?id=${id}`).then((res) => res.data.items),
    api.get(`/v1/${type}s/by/id/projects?id=${id}`).then((res) => res.data.items),
  ]);

  pins = pins.filter((project) => project.id !== ignoreProjectId);
  const sampledPins = sampleSize(pins, PROJECT_COUNT);
  const sampledPinIDs = sampledPins.map((project) => project.id);

  recents = recents.filter((project) => project.id !== ignoreProjectId && !sampledPinIDs.includes(project.id));
  const sampledRecents = sampleSize(recents, PROJECT_COUNT - sampledPins.length);
  return [...sampledPins, ...sampledRecents];
}

function useSample(items, count) {
  const [sample, setSample] = useState([]);
  useEffect(() => {
    setSample(sampleSize(items, count));
  }, [count, ...items.map((item) => item.id)]);
  return sample;
}

function RelatedProjects({ teams: allTeams, users: allUsers, ignoreProjectId }) {
  const teams = useSample(allTeams, 1);
  const users = useSample(allUsers, 2 - teams.length);

  if (!teams.length && !users.length) {
    return null;
  }
  return (
    <ul className={styles.container}>
      {teams.map((team) => (
        <li key={team.id}>
          <DataLoader get={(api) => getProjects(api, { type: 'team', id: team.id, ignoreProjectId })}>
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
          <DataLoader get={(api) => getProjects(api, { type: 'user', id: user.id, ignoreProjectId })}>
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
RelatedProjects.propTypes = {
  ignoreProjectId: PropTypes.string.isRequired,
  teams: PropTypes.array,
  users: PropTypes.array,
};

RelatedProjects.defaultProps = {
  teams: [],
  users: [],
};

export default RelatedProjects;
