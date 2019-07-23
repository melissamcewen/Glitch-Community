// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { getAllPages } from 'Shared/api';
import Loader from 'Components/loader';
import Button from 'Components/buttons/button';
import TransparentButton from 'Components/buttons/transparent-button';
import AnimationContainer from 'Components/animation-container';
import Grid from 'Components/containers/grid';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { getAvatarUrl } from 'Models/project';
import { useAPI } from 'State/api';
import { useTrackedFunc } from 'State/segment-analytics';

import styles from './deleted-projects.styl';

const DeletedProject = ({ project, onClick }) => {
  // non-admin members of projects and super users can't undelete
  if (!onClick) {
    return (
      <div className={styles.deletedProject}>
        <img className={styles.avatar} src={getAvatarUrl(project.id)} alt="" />
        <div className={styles.projectName}>{project.domain}</div>
        <TooltipContainer
          type="action"
          target={
            <div className={styles.buttonWrap}>
              <Button size="small" disabled decorative>
                Undelete
              </Button>
            </div>
          }
          tooltip="Only admins can undelete a project"
        />
      </div>
    );
  }
  return (
    <AnimationContainer type="slideUp" onAnimationEnd={onClick}>
      {(animateAndDeleteProject) => (
        <TransparentButton onClick={animateAndDeleteProject} className={styles.deletedProject}>
          <img className={styles.avatar} src={getAvatarUrl(project.id)} alt="" />
          <span className={styles.projectName}>{project.domain}</span>
          <div className={styles.buttonWrap}>
            <Button size="small" decorative>
              Undelete
            </Button>
          </div>
        </TransparentButton>
      )}
    </AnimationContainer>
  );
};
DeletedProject.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};
DeletedProject.defaultProps = {
  onClick: null,
};

export const DeletedProjectsList = ({ deletedProjects, undelete }) => {
  const undeleteTracked = useTrackedFunc(undelete, 'Undelete clicked');
  return (
    <Grid items={deletedProjects} className={styles.deletedProjectsContainer}>
      {(project) => {
        const canUndelete = project.permission && project.permission.accessLevel === 30 && undelete;
        const onClick = canUndelete ? () => undeleteTracked(project) : null;

        return <DeletedProject project={project} onClick={onClick} />;
      }}
    </Grid>
  );
};

DeletedProjectsList.propTypes = {
  deletedProjects: PropTypes.array.isRequired,
  undelete: PropTypes.func,
};
DeletedProjectsList.defaultProps = {
  undelete: null,
};

function DeletedProjects({ deletedProjects, setDeletedProjects, undelete, user }) {
  const api = useAPI();
  // states: hidden | loading | ready
  const [state, setState] = useState('hidden');
  const clickShow = async () => {
    setState('loading');
    try {
      const items = await getAllPages(api, `v1/users/${user.id}/deletedProjects?limit=100&orderKey=updatedAt&orderDirection=DESC`);
      setDeletedProjects(items);
      setState('ready');
    } catch (e) {
      setState('hidden');
    }
  };
  const clickHide = () => {
    setState('hidden');
  };

  if (state === 'hidden') {
    return (
      <Button type="tertiary" onClick={clickShow}>
        Show
      </Button>
    );
  }
  if (state === 'loading') {
    return <Loader />;
  }
  if (!deletedProjects.length) {
    return 'nothing found';
  }
  return (
    <>
      <DeletedProjectsList deletedProjects={deletedProjects} undelete={undelete} />
      <Button type="tertiary" onClick={clickHide}>
        Hide Deleted Projects
      </Button>
    </>
  );
}

DeletedProjects.propTypes = {
  deletedProjects: PropTypes.array,
  setDeletedProjects: PropTypes.func.isRequired,
  undelete: PropTypes.func,
};

DeletedProjects.defaultProps = {
  deletedProjects: [],
  undelete: null,
};

export default DeletedProjects;
