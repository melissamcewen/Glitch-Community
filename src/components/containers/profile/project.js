import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TrackedButton from 'Components/buttons/tracked-button';
import { getAvatarUrl as getProjectAvatarUrl } from 'Models/project';
import styles from './styles.styl';

const suspendedAvatarUrl = 'https://cdn.glitch.com/2b785d6f-8e71-423f-b484-ec2383060a9b%2Fno-entry.png?1556733100930';

const getAvatarUrl = (isAuthorized, project) => {
  if (project.suspendedReason && !isAuthorized) {
    return suspendedAvatarUrl;
  }
  return getProjectAvatarUrl(project.id).concat('?', project._avatarCache); // eslint-disable-line no-underscore-dangle
};

const ProjectProfileContainer = ({ project, children, avatarActions, isAuthorized }) => (
  <div className={styles.profileWrap}>
    <div className={styles.avatarContainer}>
      <div className={classnames(styles.avatar, styles.project)} style={{ backgroundImage: `url('${getAvatarUrl(isAuthorized, project)}')` }} />
      <div className={styles.avatarButtons}>
        {avatarActions &&
          Object.entries(avatarActions)
            .filter(([, onClick]) => onClick)
            .map(([label, onClick]) => (
              <TrackedButton key={label} size="small" type="tertiary" label={label} onClick={onClick}>
                {label}
              </TrackedButton>
            ))}
      </div>
    </div>
    <div className={styles.profileInfo}>{children}</div>
  </div>
);

ProjectProfileContainer.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  avatarActions: PropTypes.object,
};

ProjectProfileContainer.defaultProps = {
  avatarActions: {},
};

export default ProjectProfileContainer;
