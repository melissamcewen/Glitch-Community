import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Markdown from 'Components/text/markdown';
import Button from 'Components/buttons/button';
import { ProjectAvatar } from 'Components/images/avatar';
import ProfileList from 'Components/profile/profile-list';
import { ProjectLink } from '../../presenters/includes/link';
import ProjectOptionsPop from '../../presenters/pop-overs/project-options-pop';
import styles from './project-item.styl';

const PrivateIcon = () => <span className="project-badge private-project-badge" aria-label="private" />;

const getLinkBodyStyles = (project) =>
  classnames(styles.linkBody, {
    [styles.private]: project.private,
  });

const hasOptions = (projectOptions) => Object.keys(projectOptions).length > 0;

const ProjectItem = ({ project, projectOptions }) => (
  <div className={styles.container}>
    <header className={styles.header}>
      <div className={classnames(styles.userListContainer, { [styles.spaceForOptions]: hasOptions(projectOptions) })}>
        <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} users={project.users} teams={project.teams} />
      </div>
      <div className={styles.projectOptionsContainer}>
        <ProjectOptionsPop project={project} projectOptions={projectOptions} />
      </div>
    </header>
    <ProjectLink className={getLinkBodyStyles(project)} project={project}>
      <div className={styles.projectHeader}>
        <div className={styles.avatarWrap}>
          <ProjectAvatar {...project} />
        </div>
        <div className={styles.nameWrap}>
          <Button decorative>
            {project.private && <PrivateIcon />} <span className={styles.projectDomain}>{project.domain}</span>
          </Button>
        </div>
      </div>
      <div className={styles.description}>
        <Markdown length={80}>{project.description || ' '}</Markdown>
      </div>
    </ProjectLink>
  </div>
);

ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
};

ProjectItem.defaultProps = {
  projectOptions: {},
};

export default ProjectItem;
