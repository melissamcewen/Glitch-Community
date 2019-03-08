import React from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';

import { getFromApi, joinIdsToQueryString } from '../../shared/api';
import asyncMap from '../utils/async-map';

import { CurrentUserConsumer, normalizeProjects } from './current-user';

function listToObject(list, val) {
  return list.reduce((data, key) => ({ ...data, [key]: val }), {});
}

function keyByVal(list, key) {
  return list.reduce((data, val) => ({ ...data, [val[key]]: val }), {});
}

class ProjectsLoader extends React.Component {
  constructor(props) {
    super(props);
    // state is { [project id]: project|null|undefined }
    // undefined means we haven't seen that project yet
    // null means the project is still getting loaded
    this.state = {};
  }

  componentDidMount() {
    this.ensureProjects(this.props.projects);
  }

  componentDidUpdate() {
    this.ensureProjects(this.props.projects);
  }

  async loadUsersForProject(project) {
    const userIds = project.permissions.map((permission) => permission.userId);
    const users = await getFromApi(this.props.api, `v1/users/by/id?${joinIdsToQueryString(userIds)}`);
    return {
      ...project,
      users: Object.values(users),
    };
  }

  async loadProjects(...projectIds) {
    if (!projectIds.length) return;

    // The response is as state expects { [project_id]: { ...project }, [project_id_2]: { ...project } }
    let projects = await getFromApi(this.props.api, `v1/projects/by/id?${joinIdsToQueryString(projectIds)}`);
    // We need an array of just the project objects to map over [{ ...project } , { ...project }]
    projects = Object.values(projects);
    // We're going to map over it and load the users for each project (async/await and maps don't play well together)
    // So we're hiding the bad parts in asyncMap
    projects = awasyncMap(projects, this.loadUsersForProject);
    // Put the projects back together the way state expects
    projects = keyByVal(projects, 'id');

    this.setState(projects);
  }

  ensureProjects(projects) {
    const ids = projects.map(({ id }) => id);

    const discardedProjects = Object.keys(this.state).filter((id) => this.state[id] && !ids.includes(id));
    if (discardedProjects.length) {
      this.setState(listToObject(discardedProjects, undefined));
    }

    const unloadedProjects = ids.filter((id) => this.state[id] === undefined);
    if (unloadedProjects.length) {
      this.setState(listToObject(unloadedProjects, null));
      chunk(unloadedProjects, 100).forEach((currentChunk) => this.loadProjects(...currentChunk));
    }
  }

  render() {
    const { children, projects } = this.props;
    const loadedProjects = projects.map((project) => this.state[project.id] || project);
    return (
      <CurrentUserConsumer>
        {(currentUser) => children(normalizeProjects(loadedProjects, currentUser), this.loadProjects.bind(this))}
      </CurrentUserConsumer>
    );
  }
}

ProjectsLoader.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

export default ProjectsLoader;
