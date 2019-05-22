import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
import Markdown from 'Components/text/markdown';
import ProfileList from 'Components/profile-list';
import { getLink } from 'Models/project';
import { createAPIHook } from 'State/api';
import { getAllPages } from 'Shared/api';

import ProjectAvatar from '../../presenters/includes/project-avatar';
import styles from './project-result-item.styl';

const useMembers = createAPIHook(async (api, project) => {
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${project.id}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${project.id}`),
  ]);
  return { users, teams };
});

const ProjectResultItem = ({ project, onClick }) => {
  const { value: members } = useMembers(project);
  return (
    <div className={classnames(styles.projectResult, project.isPrivate && styles.private)}>
      <TransparentButton onClick={onClick}>
        <div className={styles.resultWrap}>
          <ProjectAvatar {...project} />
          <div className={styles.resultInfo}>
            <div className={styles.resultName}>{project.domain}</div>
            {project.description.length > 0 && (
              <div className={styles.resultDescription}>
                <Markdown renderAsPlaintext>{project.description}</Markdown>
              </div>
            )}
            <ProfileList {...members} layout="row" />
          </div>
        </div>
      </TransparentButton>
      <Button size="small" href={getLink(project)}>
        View →
      </Button>
    </div>
  );
};

ProjectResultItem.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProjectResultItem;
