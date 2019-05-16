// add-collection-project-pop -> Add a project to a collection via the collection page
import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { debounce } from 'lodash';

import Loader from 'Components/loader';
import { useTrackedFunc } from '../segment-analytics';
import ProjectResultItem from '../includes/project-result-item';
import ProjectsLoader from '../projects-loader';
import { useAPI } from '../../state/api';

import { useNotifications, AddProjectToCollectionMsg } from '../notifications';

const ProjectResultsUL = ({ projects, collection, onClick }) => {
  const { createNotification } = useNotifications();
  const onClickTracked = useTrackedFunc(onClick, 'Project Added to Collection', { origin: 'Add Project collection' });
  return (
    <ul className="results">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectResultItem
            domain={project.domain}
            description={project.description}
            users={project.users}
            id={project.id}
            isActive={false}
            collection={collection}
            onClick={() => onClickTracked(project, collection, createNotification)}
            isPrivate={project.private}
          />
        </li>
      ))}
    </ul>
  );
};
ProjectResultsUL.propTypes = {
  projects: PropTypes.array.isRequired,
  collection: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ProjectSearchResults = ({ projects, collection, onClick, projectName, excludedProjectsCount }) => {
  if (projects.length > 0) {
    const collectionProjectIds = collection.projects.map((project) => project.id);
    projects = projects.filter((project) => !collectionProjectIds.includes(project.id));

    return <ProjectResultsUL {...{ projects, collection, onClick }} />;
  }

  if (projectName) {
    return (
      <p className="results-empty">
        {projectName} is already in this collection
        <span role="img" aria-label="">
          💫
        </span>
      </p>
    );
  }

  return (
    <p className="results-empty">
      nothing found{' '}
      <span role="img" aria-label="">
        💫
      </span>
      <br />
      {excludedProjectsCount > 0 && (
        <span>
          Excluded <Pluralize count={excludedProjectsCount} singular="search result" />
        </span>
      )}
    </p>
  );
};

ProjectSearchResults.propTypes = {
  collection: PropTypes.object.isRequired,
  projectName: PropTypes.string,
  excludedProjectsCount: PropTypes.number,
};

ProjectSearchResults.defaultProps = {
  projectName: '',
  excludedProjectsCount: 0,
};

function isUrl(s) {
  try {
    new URL(s); // eslint-disable-line no-new
    return true;
  } catch (_) {
    return false;
  }
}

class AddCollectionProjectPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '', // The actual search text
      maybeRequest: null, // The active request promise
      maybeResults: null, // Null means still waiting vs empty,
      projectName: '', // the project name if the search result is a Url
      excludedProjectsCount: 0, // number of projects omitted from search
    };

    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.startSearch = debounce(this.startSearch.bind(this), 300);
    this.onClick = this.onClick.bind(this);
  }

  onClick(project, collection, createNotification) {
    this.props.togglePopover();

    // add project to page if successful & show notification
    this.props
      .addProjectToCollection(project, collection)
      .then(() => createNotification(<AddProjectToCollectionMsg projectDomain={project.domain} />, 'notifySuccess'));
  }

  handleChange(evt) {
    const query = evt.currentTarget.value.trim();
    this.setState({ query });
    if (query) {
      this.startSearch();
    } else {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
      projectName: '',
      excludedProjectsCount: 0,
    });
  }

  async startSearch() {
    if (!this.state.query) {
      return this.clearSearch();
    }

    // reset the results
    this.setState({ maybeResults: null });

    let searchByUrl = false;
    let { query } = this.state;
    const collectionProjectIds = this.props.collection.projects.map((project) => project.id);

    if (isUrl(query)) {
      searchByUrl = true;
      // check if the query is a URL or a name of a project
      // Project URL pattern: https://add-to-alexa.glitch.me/, https://glitch.com/~add-to-alexa
      const queryUrl = new URL(query);
      if (queryUrl.href.includes('me') && !queryUrl.href.includes('~')) {
        // https://add-to-alexa.glitch.me/
        query = queryUrl.hostname.substring(0, queryUrl.hostname.indexOf('.'));
      } else {
        // https://glitch.com/~add-to-alexa
        query = queryUrl.pathname.substring(queryUrl.pathname.indexOf('~') + 1);
      }
    }

    let request = null;
    if (!searchByUrl) {
      request = this.props.api.get(`projects/search?q=${query}`);
      this.setState({ maybeRequest: request });
    } else {
      request = this.props.api.get(`projects/${query}`);
      this.setState({ maybeRequest: request });
    }
    let { data } = await request;

    if (searchByUrl) {
      data = [data];
    }

    const results = data || [];
    const originalNumResults = results.length;

    let nonCollectionResults = [];
    if (searchByUrl) {
      // get the single result that matches the URL exactly - check with https://community.glitch.me/
      nonCollectionResults = results.filter((result) => result && result.domain === query);

      // check if the project is already in the collection
      if (nonCollectionResults.length > 0 && collectionProjectIds.includes(nonCollectionResults[0].id)) {
        nonCollectionResults = [];
        this.setState({ projectName: query });
      }
    } else {
      // user is searching by project name  - filter out any projects currently in the collection
      nonCollectionResults = results ? results.filter((result) => !collectionProjectIds.includes(result.id)) : [];

      if (nonCollectionResults.length !== originalNumResults) {
        if (originalNumResults === 1) {
          // the single search result is already in the collection
          this.setState({ projectName: query });
        } else {
          // multiple projects have been excluded from the search results
          this.setState({ excludedProjectsCount: originalNumResults });
        }
      }
    }

    this.setState(({ maybeRequest }) => {
      if (request === maybeRequest) {
        return {
          maybeRequest: null,
          maybeResults: nonCollectionResults,
          recentProjects: null,
        };
      }
      return {};
    });
    return null;
  }

  render() {
    // load user's recent projects
    const results = this.state.query ? this.state.maybeResults : this.props.initialProjects;

    const showResults = !!(this.state.query || (results && results.length));
    const isLoading = !!(this.state.maybeRequest || !results);

    return (
      <dialog className="pop-over add-collection-project-pop wide-pop">
        <section className="pop-over-info">
          <input
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={this.state.query}
            onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search by project name or URL"
          />
        </section>
        {showResults && (
          <section className="pop-over-actions last-section results-list">
            {isLoading && <Loader />}

            {!!results && (
              <ProjectsLoader projects={results}>
                {(projects) => (
                  <ProjectSearchResults
                    projects={projects}
                    onClick={this.onClick}
                    collection={this.props.collection}
                    projectName={this.state.projectName}
                    excludedProjectsCount={this.state.excludedProjectsCount}
                  />
                )}
              </ProjectsLoader>
            )}
          </section>
        )}
      </dialog>
    );
  }
}

AddCollectionProjectPop.propTypes = {
  api: PropTypes.func.isRequired,
  collection: PropTypes.object.isRequired,
  initialProjects: PropTypes.array.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  togglePopover: PropTypes.func, // required but added dynamically
};

AddCollectionProjectPop.defaultProps = {
  togglePopover: null,
};

export default (props) => {
  const api = useAPI();
  return <AddCollectionProjectPop {...props} api={api} />;
};
