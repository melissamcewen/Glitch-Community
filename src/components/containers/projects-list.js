import React, { useEffect, useState, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import classNames from 'classnames/bind';

import Text from 'Components/text/text';
import Button from 'Components/buttons/button';
import Badge from 'Components/badges/badge';
import TextInput from 'Components/inputs/text-input';
import Heading from 'Components/text/heading';
import Image from 'Components/images/image';
import ProjectItem from 'Components/project/project-item';
import Note from 'Components/collection/note';
import Grid from 'Components/containers/grid';
import Row from 'Components/containers/row';
import { LiveMessage } from 'react-aria-live';

import styles from './projects-list.styl';

const containers = {
  row: (props) => <Row className={styles.projectsRow} {...props} />,
  grid: (props) => <Grid className={styles.projectsGrid} {...props} />,
  gridCompact: (props) => <Grid className={styles.projectsGridCompact} {...props} />,
};

const ProjectsUL = ({ collection, projects, sortable, onReorder, noteOptions, layout, projectOptions }) => {
  const Container = containers[layout];
  return (
    <Container itemClassName={styles.projectsItem} items={projects} sortable={sortable} onReorder={onReorder}>
      {(project) => (
        <>
          {collection && (
            <div className={styles.projectsContainerNote}>
              <Note
                project={project}
                collection={collection}
                isAuthorized={noteOptions.isAuthorized}
                hideNote={noteOptions.hideNote}
                updateNote={noteOptions.updateNote}
              />
            </div>
          )}
          <ProjectItem key={project.id} project={project} projectOptions={projectOptions} />
        </>
      )}
    </Container>
  );
};

const arrowSrc = 'https://cdn.glitch.com/11efcb07-3386-43b6-bab0-b8dc7372cba8%2Fleft-arrow.svg?1553883919269';

const paginationReducer = (oldState, action) => {
  switch (action.type) {
    case 'next':
      return {
        page: oldState.page + 1,
        totalPages: oldState.totalPages,
        announce: `Showing page ${oldState.page + 1} of ${oldState.totalPages}`,
      };
    case 'previous':
      return {
        page: oldState.page - 1,
        totalPages: oldState.totalPages,
        announce: `Showing page ${oldState.page - 1} of ${oldState.totalPages}`,
      };
    case 'expand':
      return {
        expanded: true,
        totalPages: oldState.totalPages,
        announce: 'Showing all pages',
      };
    case 'restart':
      return {
        ...oldState,
        page: 1,
        announce: `Showing page 1 of ${action.totalPages}`,
      };
    default:
      return {};
  }
};

const PaginationController = ({ enabled, projects, projectsPerPage, children }) => {
  const numProjects = projects.length;
  const numPages = Math.ceil(projects.length / projectsPerPage);

  const [state, dispatchState] = useReducer(paginationReducer, {
    page: 1,
    totalPages: numPages,
    announce: '',
  });
  const prevButtonRef = useRef();
  const nextButtonRef = useRef();

  const canPaginate = enabled && !state.expanded && projectsPerPage < numProjects;

  const onNextButtonClick = () => {
    if (state.page + 1 === numPages) {
      prevButtonRef.current.focus();
    }

    dispatchState({ type: 'next' });
  };

  const onPreviousButtonClick = () => {
    if (state.page - 1 === 1) {
      nextButtonRef.current.focus();
    }

    dispatchState({ type: 'previous' });
  };

  if (canPaginate) {
    const startIdx = (state.page - 1) * projectsPerPage;
    projects = projects.slice(startIdx, startIdx + projectsPerPage);
  }

  useEffect(() => {
    dispatchState({ type: 'restart', totalPages: numPages });
  }, [numProjects]);

  return (
    <>
      {children(projects)}
      {canPaginate && (
        <div className={styles.viewControls}>
          <div className={styles.paginationControls}>
            <Button ref={prevButtonRef} type="tertiary" disabled={state.page === 1} onClick={onPreviousButtonClick}>
              <Image alt="Previous" className={styles.paginationArrow} src={arrowSrc} />
            </Button>
            {state.announce && <LiveMessage message={state.announce} aria-live="assertive" />}
            <div data-cy="page-numbers" className={styles.pageNumbers}>
              {state.page} / {numPages}
            </div>
            <Button ref={nextButtonRef} type="tertiary" disabled={state.page === numPages} onClick={onNextButtonClick}>
              <Image alt="Next" className={classNames(styles.paginationArrow, styles.next)} src={arrowSrc} />
            </Button>
          </div>
          <Button data-cy="show-all" type="tertiary" onClick={() => dispatchState({ type: 'expand' })}>
            Show all <Badge>{numProjects}</Badge>
          </Button>
        </div>
      )}
    </>
  );
};

const FilterController = ({ enabled, placeholder, projects, children }) => {
  const [filter, setFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  function filterProjects() {
    setIsDoneFiltering(false);
    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredProjects(projects.filter((p) => p.domain.includes(lowercaseFilter) || p.description.toLowerCase().includes(lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredProjects([]);
    }
  }

  useEffect(() => filterProjects(), [projects]);
  useEffect(() => debounce(filterProjects, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  const displayedProjects = filtering ? filteredProjects : projects;

  return children({
    filterInput: enabled && (
      <TextInput
        data-cy="projects-filter"
        className={styles.headerSearch}
        name="filter"
        onChange={setFilter}
        opaque
        placeholder="find a project"
        labelText="project search"
        type="search"
        value={filter}
      />
    ),
    renderProjects: (renderFn) => {
      if (displayedProjects.length) return renderFn(displayedProjects);

      if (filtering) {
        return (
          <div className={styles.filterResultsPlaceholder}>
            <Image alt="" src="https://cdn.glitch.com/c117d5df-3b8d-4389-9e6b-eb049bcefcd6%2Fcompass-not-found.svg?1554146070630" />
            <Text>No projects found</Text>
          </div>
        );
      }
      return placeholder;
    },
  });
};

function ProjectsList({
  projects,
  layout,
  title,
  placeholder,
  enableFiltering,
  enablePagination,
  enableSorting,
  onReorder,
  projectsPerPage,
  collection,
  noteOptions,
  projectOptions,
  dataCy,
  nextSectionId,
  sectionId,
}) {
  return (
    <FilterController enabled={enableFiltering} placeholder={placeholder} projects={projects}>
      {({ filterInput, renderProjects }) => (
        <article id={sectionId} className={classNames(styles.projectsContainer)} data-cy={dataCy}>
          <div className={styles.header}>
            {title && <Heading tagName="h2">{title}</Heading>}
            {filterInput}
            <Button href={`#${nextSectionId}`} className={styles.visibleOnFocus}>Skip to Next Section</Button>
          </div>
          {renderProjects((filteredProjects) => (
            <PaginationController enabled={enablePagination} projects={filteredProjects} projectsPerPage={projectsPerPage}>
              {(paginatedProjects) => (
                <ProjectsUL
                  projects={paginatedProjects}
                  collection={collection}
                  noteOptions={noteOptions}
                  layout={layout}
                  sortable={enableSorting && paginatedProjects.length === projects.length}
                  onReorder={onReorder}
                  projectOptions={projectOptions}
                />
              )}
            </PaginationController>
          ))}
        </article>
      )}
    </FilterController>
  );
}

ProjectsList.propTypes = {
  projects: PropTypes.array.isRequired,
  layout: PropTypes.oneOf(['row', 'grid', 'gridCompact']).isRequired,
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.node,
  placeholder: PropTypes.node,
  enableFiltering: PropTypes.bool,
  enablePagination: PropTypes.bool,
  enableSorting: (props) => props.enableSorting && props.layout === 'row' && new Error('Sortable rows are not supported'),
  projectsPerPage: PropTypes.number,
  collection: PropTypes.object,
  noteOptions: PropTypes.object,
  projectOptions: PropTypes.object,
  dataCy: PropTypes.string,
  nextSectionId: PropTypes.string,
};

ProjectsList.defaultProps = {
  title: null,
  placeholder: null,
  enableFiltering: false,
  enablePagination: false,
  enableSorting: false,
  projectsPerPage: 6,
  collection: null,
  noteOptions: {},
  projectOptions: {},
  dataCy: null,
  nextSectionId: '',
};

export default ProjectsList;
