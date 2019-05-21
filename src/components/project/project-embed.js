import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Embed from 'Components/project/embed';
import { useTracker } from 'State/segment-analytics';
import ReportButton from '../../presenters/pop-overs/report-abuse-pop';
import { EditButton, RemixButton } from '../../presenters/includes/project-actions';
import AddProjectToCollection from '../../presenters/pop-overs/add-project-to-collection-pop';

import styles from './project-embed.styl';

const cx = classNames.bind(styles);

const ProjectEmbed = ({ project, top, isAuthorized, currentUser, addProjectToCollection }) => {
  const trackRemix = useTracker('Click Remix', {
    baseProjectId: project.id,
    baseDomain: project.domain,
  });

  const BottomLeft = () => {
    if (isAuthorized) {
      return <EditButton name={project.id} isMember={isAuthorized} size="small" />;
    }
    return <ReportButton reportedType="project" reportedModel={project} />;
  };

  const BottomRight = () => (
    <>
      {
        currentUser.login && (
          <AddProjectToCollection
            project={project}
            currentUser={currentUser}
            addProjectToCollection={addProjectToCollection}
            fromProject
          />
        )
      }
      <RemixButton name={project.domain} isMember={isAuthorized} onClick={trackRemix} />
    </>
  );

  return (
    <section className={styles.projectEmbed}>
      {top}
      <div className={styles.embedWrap}>
        <Embed domain={project.domain} />
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.left}>
          <BottomLeft />
        </div>
        <div className={cx({ right: true, buttonWrap: true })}>
          <BottomRight />
        </div>
      </div>
    </section>
  );
};

ProjectEmbed.propTypes = {
  project: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  addProjectToCollection: PropTypes.func,
  top: PropTypes.any,
};

ProjectEmbed.defaultProps = {
  addProjectToCollection: null,
  top: null,
};

export default ProjectEmbed;
