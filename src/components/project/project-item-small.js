/* Used in project previews for collection-items */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import Text from 'Components/text/text';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';
import { ProjectLink } from 'Components/link';

import styles from './project-item.styl';

const ProfileAvatar = ({ project }) => <Image className={styles.avatar} src={getProjectAvatarUrl(project)} defaultSrc={FALLBACK_AVATAR_URL} alt="" />;

const getLinkBodyStyles = (project) => classnames(styles.linkBodySmall, { [styles.private]: project.private });

const ProjectItemSmall = ({ project }) => (
  <div className={styles.projectItemSmall}>
    <ProjectLink className={getLinkBodyStyles(project)} project={project}>
      <div className={styles.projectHeader}>
        <span className={styles.avatarWrap}>
          <ProfileAvatar project={project} />
        </span>
        <Text>
          <span className={styles.projectName}>{project.domain}</span>{' '}
        </Text>
        {project.private && (
          <span className={styles.privateIcon}><Icon icon="private" alt="private" /></span>
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
