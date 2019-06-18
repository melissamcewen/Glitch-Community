/* Used in project previews for collection-items */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Badge from 'Components/badges/badge';
import { FALLBACK_AVATAR_URL, getAvatarUrl } from 'Models/project';
import { ProjectLink } from 'Components/link';

import styles from './project-item.styl';

const ProfileAvatar = ({ project }) => <Image className={styles.avatar} src={getAvatarUrl(project.id)} defaultSrc={FALLBACK_AVATAR_URL} alt="" />;

const getLinkBodyStyles = (project) => classnames(styles.linkBodySmall, { [styles.private]: project.private });

const ProjectItemSmall = ({ project }) => (
  <div className={styles.projectItemSmall}>
    <ProjectLink className={getLinkBodyStyles(project)} project={project}>
      <div className={styles.projectHeader}>
        <span className={styles.avatarWrap}>
          <ProfileAvatar project={project} />
        </span>
        <Text className={styles.projectName}>{project.domain}</Text>
        {project.private && (
          <Badge type="private" aria-label="private">
            {' '}
          </Badge>
        )}
      </div>
    </ProjectLink>
  </div>
);

ProjectItemSmall.propTypes = {
  project: PropTypes.shape({
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
  }).isRequired,
};

export default ProjectItemSmall;
