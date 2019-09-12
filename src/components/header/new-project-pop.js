import React from 'react';
import PropTypes from 'prop-types';
import { Button, Loader } from '@fogcreek/shared-components';

import { PopoverWithButton, PopoverDialog, PopoverSection, PopoverActions } from 'Components/popover';
import ResultsList from 'Components/containers/results-list';
import { TrackedExternalLink } from 'Components/link';
import { ProjectAvatar } from 'Components/images/avatar';
import { getRemixUrl } from 'Models/project';
import { useTracker } from 'State/segment-analytics';
import { createAPIHook } from 'State/api';

import styles from './new-project-pop.styl';

const importGitRepo = () => {
  /* eslint-disable no-alert */
  const repoUrl = window.prompt('Paste the full URL of your repository', 'https://github.com/orgname/reponame.git');
  /* eslint-enable no-alert */
  if (!repoUrl) {
    return;
  }
  window.location.href = `/edit/#!/import/git?url=${repoUrl}`;
};

const NewProjectResultItem = ({ project }) => (
  <div className={styles.project}>
    <div className={styles.projectAvatar}>
      <ProjectAvatar project={project} />
    </div>
    <div className={styles.projectInfo}>
      <div className={styles.projectDomain} title={project.domain}>
        {project.domain}
      </div>
      {project.description.length > 0 && <div className={styles.projectDescription}>{project.description}</div>}
    </div>
  </div>
);

const NewProjectPop = ({ projects }) => (
  <PopoverDialog align="right">
    <PopoverSection>
      {projects.length ? (
        <ResultsList items={projects}>
          {(project) => (
            <TrackedExternalLink
              key={project.id}
              to={getRemixUrl(project.domain)}
              name="New Project Clicked"
              properties={{
                baseDomain: project.domain,
                origin: 'community new project pop',
              }}
            >
              <NewProjectResultItem project={project} />
            </TrackedExternalLink>
          )}
        </ResultsList>
      ) : (
        <Loader style={{ width: '25px' }} />
      )}
    </PopoverSection>
    <PopoverActions type="secondary">
      <Button size="small" variant="secondary" onClick={importGitRepo} matchBackground>
        Clone from Git Repo
      </Button>
    </PopoverActions>
  </PopoverDialog>
);
NewProjectPop.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const useNewProjectAPI = createAPIHook(async (api) => {
  const projectIds = [
    '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
    'a0fcd798-9ddf-42e5-8205-17158d4bf5bb', // 'hello-express'
    'cb519589-591c-474f-8986-a513f22dbf88', // 'hello-sqlite'
  ];
  const idString = projectIds.map((id) => `id=${id}`).join('&');
  // always request against the production API, with no token
  // (this is necessary for it to work on glitch.development)
  const { data } = await api.get(`https://api.glitch.com/v1/projects/by/id?${idString}`, {
    headers: {
      Authorization: '',
    },
  });
  return projectIds.map((id) => data[id]);
});

function NewProjectPopButton() {
  const { value } = useNewProjectAPI();
  const projects = value || [];
  const onOpen = useTracker('open new-project pop');

  return (
    <PopoverWithButton onOpen={onOpen} buttonProps={{ size: 'small' }} buttonText="New Project">
      {() => <NewProjectPop projects={projects} />}
    </PopoverWithButton>
  );
}

export default NewProjectPopButton;
