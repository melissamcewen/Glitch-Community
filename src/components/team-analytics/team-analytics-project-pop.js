import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ProjectResultItem from 'Components/project/project-result-item';
import { ResultItem, ResultInfo, ResultName } from 'Components/containers/results-list';
import { PopoverWithButton, PopoverDialog, PopoverSearch } from 'Components/popover';

import styles from './styles.styl';


const AllProjectsItem = ({ active, selected, onClick }) => (
  <ResultItem onClick={onClick} active={active} selected={selected} className={styles.allProjects}>
    <img src="https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png?1502469566743" alt="" className={styles.bentoBox} />
    <ResultInfo>
      <ResultName>All Projects</ResultName>
    </ResultInfo>
  </ResultItem>
);

const ProjectSearch = ({ projects, updateProjectDomain, currentProjectDomain }) => {
  const [filter, setFilter] = useState('');

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(({ domain }) => domain.toLowerCase().includes(filter.toLowerCase()));
    if (!filter) {
      filtered.unshift({ id: 'all-projects', domain: '' });
    }
    return filtered;
  }, [projects, filter]);

  return (
    <PopoverDialog align="left" wide>
      <PopoverSearch
        value={filter}
        onChange={setFilter}
        status="ready"
        results={filteredProjects}
        onSubmit={(project) => updateProjectDomain(project.domain)}
        labelText="Filter projects"
        placeholder="Filter projects"
        renderItem={({ item: project, active }) =>
          project.domain ? (
            <ProjectResultItem
              project={project}
              onClick={() => updateProjectDomain(project.domain)}
              active={active}
              selected={currentProjectDomain === project.domain}
            />
          ) : (
            <AllProjectsItem active={active} selected={currentProjectDomain === ''} onClick={() => updateProjectDomain('')} />
          )
        }
      />
    </PopoverDialog>
  );
};

const Dropdown = () => <span className="down-arrow" aria-label="options" />;

const TeamAnalyticsProjectPop = ({ projects, updateProjectDomain, currentProjectDomain }) => (
  <PopoverWithButton
    buttonProps={{ size: 'small', variant: 'secondary' }}
    buttonText={
      currentProjectDomain ? (
        <>
          Project: {currentProjectDomain} <Dropdown />
        </>
      ) : (
        <>
          All Projects <Dropdown />
        </>
      )
    }
  >
    {({ toggleAndCall }) => (
      <ProjectSearch projects={projects} updateProjectDomain={toggleAndCall(updateProjectDomain)} currentProjectDomain={currentProjectDomain} />
    )}
  </PopoverWithButton>
);

TeamAnalyticsProjectPop.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      domain: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  updateProjectDomain: PropTypes.func.isRequired,
  currentProjectDomain: PropTypes.string.isRequired,
};

export default TeamAnalyticsProjectPop;
