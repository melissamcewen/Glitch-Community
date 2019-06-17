import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { useAPI } from '../state/api';
import { useCurrentUser } from '../state/current-user';
import useErrorHandlers from './error-handlers';

class CollectionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.initialCollection,
    };
  }

  currentUserIsAuthor() {
    if (!this.props.currentUser) return false;
    if (this.state.teamId > 0) {
      return this.props.currentUser.teams.some((team) => team.id === this.state.teamId);
    }
    if (this.state.userId > 0) {
      return this.props.currentUser.id === this.state.userId;
    }
    return false;
  }

  async updateFields(changes) {
    // A note here: we don't want to setState with the data from the server from this call, as it doesn't return back the projects in depth with users and notes and things
    // maybe a sign we want to think of something a little more powerful for state management, as we're getting a little hairy here.
    this.setState(changes);
    await this.props.api.patch(`collections/${this.state.id}`, changes);
  }

  async addProjectToCollection(project, collection) {
    if (collection.id === this.state.id) {
      // add project to collection page
      this.setState(({ projects }) => ({
        projects: [project, ...projects],
      }));
    }
    await this.props.api.patch(`collections/${collection.id}/add/${project.id}`);
    if (collection.id === this.state.id) {
      await this.props.api.post(`collections/${collection.id}/project/${project.id}/index/0`);
    }
  }

  async removeProjectFromCollection(project) {
    await this.props.api.patch(`collections/${this.state.id}/remove/${project.id}`);
    this.setState(({ projects }) => ({
      projects: projects.filter((p) => p.id !== project.id),
    }));
  }

  async updateProjectOrder(project, filteredIndex) {
    // the shown projects list doesn't include the featured project, bump the index to include it
    const featuredIndex = this.state.projects.findIndex((p) => p.id === this.state.featuredProjectId);
    const index = (featuredIndex >= 0 && filteredIndex > featuredIndex) ? filteredIndex + 1 : filteredIndex;
    this.setState(({ projects }) => {
      const sortedProjects = projects.filter((p) => p.id !== project.id);
      sortedProjects.splice(index, 0, project);
      return { projects: sortedProjects };
    });
    await this.props.api.post(`collections/${this.state.id}/project/${project.id}/index/${index}`);
  }

  async deleteCollection() {
    await this.props.api.delete(`/collections/${this.state.id}`);
  }

  async updateNote({ note, projectId }) {
    note = _.trim(note);
    await this.props.api.patch(`collections/${this.state.id}/project/${projectId}`, { annotation: note });
    this.updateProject({ note, isAddingANewNote: true }, projectId);
  }

  displayNewNote(projectId) {
    this.updateProject({ isAddingANewNote: true }, projectId);
  }

  hideNote(projectId) {
    this.updateProject({ isAddingANewNote: false }, projectId);
  }

  async featureProject(id) {
    if (this.state.featuredProjectId) {
      // this is needed to force an dismount of an optimistic state value of a note and to ensure the old featured collection goes where it's supposed to.
      this.setState({ featuredProjectId: null });
    }
    await this.updateFields({ featuredProjectId: id });
  }

  updateProject(projectUpdates, projectId) {
    this.setState(({ projects }) => ({
      projects: projects.map((project) => {
        if (project.id === projectId) {
          return { ...project, ...projectUpdates };
        }
        return { ...project };
      }),
    }));
  }

  render() {
    const { handleError, handleErrorForInput, handleCustomError } = this.props;
    const funcs = {
      addProjectToCollection: (project, collection) => this.addProjectToCollection(project, collection).catch(handleCustomError),
      removeProjectFromCollection: (project) => this.removeProjectFromCollection(project).catch(handleError),
      deleteCollection: () => this.deleteCollection().catch(handleError),
      updateNameAndUrl: ({ name, url }) => this.updateFields({ name, url }).catch(handleErrorForInput),
      displayNewNote: (projectId) => this.displayNewNote(projectId),
      updateNote: ({ note, projectId }) => this.updateNote({ note, projectId }),
      hideNote: (projectId) => this.hideNote(projectId),
      updateDescription: (description) => this.updateFields({ description }).catch(handleErrorForInput),
      updateColor: (color) => this.updateFields({ coverColor: color }),
      updateProjectOrder: (project, index) => this.updateProjectOrder(project, index).catch(handleError),
      featureProject: (id) => this.featureProject(id).catch(handleError),
      unfeatureProject: () => this.updateFields({ featuredProjectId: null }).catch(handleError),
    };
    return this.props.children(this.state, funcs, this.currentUserIsAuthor());
  }
}
CollectionEditor.propTypes = {
  api: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  handleError: PropTypes.func.isRequired,
  handleErrorForInput: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
};

CollectionEditor.defaultProps = {
  currentUser: null,
};

const CollectionEditorContainer = ({ children, initialCollection }) => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  const errorFuncs = useErrorHandlers();
  return (
    <CollectionEditor {...{ api, currentUser, initialCollection }} {...errorFuncs}>
      {children}
    </CollectionEditor>
  );
};
CollectionEditorContainer.propTypes = {
  children: PropTypes.func.isRequired,
  initialCollection: PropTypes.object.isRequired,
};

export default CollectionEditorContainer;
