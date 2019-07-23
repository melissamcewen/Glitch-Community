import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import PaginationController from 'Components/pagination-controller';
import FilterController from 'Components/filter-controller';
import ProjectItem from 'Components/project/project-item';
import Note from 'Components/collection/note';
import Grid from 'Components/containers/grid';
import Row from 'Components/containers/row';
import classNames from 'classnames/bind';

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
}) {
  const matchFn = (project, filter) => project.domain.includes(filter) || project.description.toLowerCase().includes(filter);
  return (
    <FilterController matchFn={matchFn} enabled={enableFiltering} placeholder={placeholder} searchPrompt="find a project" label="project search" items={projects}>
      {({ filterInput, filterHeaderStyles, renderItems }) => (
        <article className={classNames(styles.projectsContainer)} data-cy={dataCy}>
          <div className={filterHeaderStyles}>
            {title && <Heading tagName="h2">{title}</Heading>}
            {filterInput}
          </div>
          {renderItems((filteredProjects) => (
            <PaginationController
              enabled={enablePagination}
              items={filteredProjects}
              itemsPerPage={projectsPerPage}
            >
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
};

export default ProjectsList;
