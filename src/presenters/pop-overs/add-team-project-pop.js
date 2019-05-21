import React from 'react';
import PropTypes from 'prop-types';

import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';
import ProjectResultItem from '../includes/project-result-item';
import PopoverWithButton from './popover-with-button';

class AddTeamProjectPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      templateProjects: [],
      filteredProjects: [],
      source: 'my-projects', // my-projects, templates
      filterPlaceholder: 'Filter my projects',
    };
    this.onClick = this.onClick.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.filterInputIsBlank = this.filterInputIsBlank.bind(this);
    this.filterInput = React.createRef();
  }

  componentDidMount() {
    this.getTemplateProjects();
    this.filterInput.current.focus();
    this.updateFilter('');
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.source !== this.state.source) {
      this.updateFilter('');
      this.filterInput.current.focus();
    }
  }

  onClick(event, project) {
    event.preventDefault();
    this.props.togglePopover();
    this.props.addProject(project);
  }

  getTemplateProjects() {
    const templateIds = [
      '9cd48134-1624-48f5-beaf-6c1b68bd9217', // 'timelink'
      '712cc905-bfcb-454e-a47a-c729ab63c455', // 'poller'
      '929980a8-32fc-4ae7-a66f-dddb3ae4912c', // 'hello-webpage'
    ];
    const projectsPath = `projects/byIds?ids=${templateIds.join(',')}`;
    this.props.api.get(projectsPath).then(({ data }) => {
      const projects = this.normalizeTemplateProjects(data);
      this.setState({
        templateProjects: projects,
      });
      this.updateFilter('');
    });
  }

  normalizeTemplateProjects = (data) => {
    const projects = data.map((project) => {
      project.users = [];
      return project;
    });
    return projects;
  };

  filterProjects = (query, projects, teamProjects) => {
    query = query.toLowerCase().trim();
    const MAX_PROJECTS = 20;
    const teamProjectIds = teamProjects.map(({ id }) => id);
    const availableProjects = projects.filter(({ id }) => !teamProjectIds.includes(id));
    const filteredProjects = [];
    if (!query) {
      return availableProjects.splice(0, MAX_PROJECTS);
    }
    for (const project of availableProjects) {
      // eslint-disable-line
      if (filteredProjects.length > MAX_PROJECTS) {
        break;
      }
      const titleMatch = project.domain.toLowerCase().includes(query);
      const descMatch = project.description.toLowerCase().includes(query);
      if (titleMatch || descMatch) {
        filteredProjects.push(project);
      }
    }
    return filteredProjects;
  };

  updateFilter(query) {
    let projects = [];
    if (this.state.source === 'templates') {
      projects = this.state.templateProjects;
    } else {
      projects = this.props.myProjects;
    }
    const filteredProjects = this.filterProjects(query, projects, this.props.teamProjects);
    this.setState({
      filteredProjects,
    });
  }

  activeIfSourceIsTemplates() {
    if (this.state.source === 'templates') {
      return 'active';
    }
    return null;
  }

  activeIfSourceIsMyProjects() {
    if (this.state.source === 'my-projects') {
      return 'active';
    }
    return null;
  }

  async remixTemplate(projectId) {
    const remixTemplatePath = `projects/${projectId}/remix`;
    return this.props.api.post(remixTemplatePath);
  }

  async inviteUserToRemix(data) {
    const inviteUserPath = `projects/${data.inviteToken}/join`;
    return this.props.api.post(inviteUserPath);
  }

  sourceIsTemplates() {
    this.setState({
      source: 'templates',
      filterPlaceholder: 'Filter templates',
    });
  }

  sourceIsMyProjects() {
    this.setState({
      source: 'my-projects',
      filterPlaceholder: 'Filter projects',
    });
  }

  filterInputIsBlank() {
    if (this.filterInput.current.value.length === 0) {
      return true;
    }
    return false;
  }

  render() {
    const { filteredProjects } = this.state;

    return (
      <dialog className="pop-over add-team-project-pop wide-pop">
        <section className="pop-over-info">
          <input
            ref={this.filterInput}
            onChange={(event) => {
              this.updateFilter(event.target.value);
            }}
            id="team-project-search"
            className="pop-over-input search-input pop-over-search"
            placeholder={this.state.filterPlaceholder}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          />
        </section>

        <section className="pop-over-actions results-list" data-source="templates">
          <ul className="results">
            {filteredProjects.map((project) => (
              <li key={project.id}>
                <ProjectResultItem
                  onClick={(event) => this.onClick(event, project)}
                  {...project}
                  title={project.domain}
                  isPrivate={project.private}
                />
              </li>
            ))}
          </ul>
          {this.state.filteredProjects.length === 0 && this.filterInputIsBlank && (
            <p className="action-description no-projects-description">Create or Join projects to add them to the team</p>
          )}
        </section>
      </dialog>
    );
  }
}

AddTeamProjectPop.propTypes = {
  myProjects: PropTypes.array.isRequired,
  teamProjects: PropTypes.array.isRequired,
  addProject: PropTypes.func.isRequired,
  togglePopover: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
};

const AddTeamProject = ({ addProject, teamProjects }) => {
  const api = useAPI();
  const { currentUser } = useCurrentUser();
  return (
    <section className="add-project-container">
      {/* Add disabled={props.projectLimitIsReached} once billing is ready */}
      <PopoverWithButton
        buttonClass="add-project has-emoji"
        buttonText={
          <>
            Add Project <span className="emoji bento-box" role="img" aria-label="" />
          </>
        }
      >
        {({ togglePopover }) => (
          <AddTeamProjectPop
            myProjects={currentUser.projects}
            api={api}
            addProject={addProject}
            teamProjects={teamProjects}
            togglePopover={togglePopover}
          />
        )}
      </PopoverWithButton>
    </section>
  );
};
AddTeamProject.propTypes = {
  addProject: PropTypes.func.isRequired,
  teamProjects: PropTypes.array.isRequired,
};

export default AddTeamProject;
