/* global Set */

import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'Components/loaders/loader';
import { ProjectAvatar } from 'Components/images/avatar';
import { useTrackedFunc } from '../segment-analytics';
import { NestedPopoverTitle } from './popover-nested';
import { getAvatarThumbnailUrl, getDisplayName } from '../../models/user';

const TeamUserRemoveButton = ({ userAvatar, userLogin, userStyle, removeUser }) => {
  const onClick = useTrackedFunc(removeUser, 'Remove from Team submitted');
  return (
    <button className="button-small has-emoji" onClick={onClick} type="button">
      Remove <img className="emoji avatar" src={userAvatar} alt={userLogin} style={userStyle} />
    </button>
  );
};
TeamUserRemoveButton.propTypes = {
  userAvatar: PropTypes.string.isRequired,
  userLogin: PropTypes.string.isRequired,
  userStyle: PropTypes.object.isRequired,
  removeUser: PropTypes.func.isRequired,
};

class TeamUserRemovePop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProjects: new Set(),
    };
    this.selectAllProjects = this.selectAllProjects.bind(this);
    this.unselectAllProjects = this.unselectAllProjects.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  removeUser() {
    this.props.togglePopover();
    this.props.removeUser(Array.from(this.state.selectedProjects));
  }

  selectAllProjects() {
    const userTeamProjects = this.props.userTeamProjects.data || [];
    this.setState({
      selectedProjects: new Set(userTeamProjects.map((p) => p.id)),
    });
  }

  unselectAllProjects() {
    this.setState({
      selectedProjects: new Set(),
    });
  }

  handleCheckboxChange(evt) {
    const { checked, value } = evt.target;
    this.setState(({ selectedProjects }) => {
      selectedProjects = new Set(selectedProjects);
      if (checked) {
        selectedProjects.add(value);
      } else {
        selectedProjects.delete(value);
      }
      return { selectedProjects };
    });
  }

  render() {
    const userTeamProjects = this.props.userTeamProjects.data || [];
    const allProjectsSelected = userTeamProjects.every((p) => this.state.selectedProjects.has(p.id));
    const userAvatarStyle = { backgroundColor: this.props.user.color };

    let projects = null;
    if (this.props.userTeamProjects.status === 'loading') {
      projects = <Loader />;
    } else if (userTeamProjects.length > 0) {
      projects = (
        <>
          <p className="action-description">Also remove them from these projects</p>
          <div className="projects-list">
            {userTeamProjects.map((project) => (
              <label key={project.id} htmlFor={`remove-user-project-${project.id}`}>
                <input
                  className="checkbox-project"
                  type="checkbox"
                  id={`remove-user-project-${project.id}`}
                  checked={this.state.selectedProjects.has(project.id)}
                  value={project.id}
                  onChange={this.handleCheckboxChange}
                />
                <ProjectAvatar {...project} />
                {project.domain}
              </label>
            ))}
          </div>
          {userTeamProjects.length > 1 && (
            <button className="button-small" type="button" onClick={allProjectsSelected ? this.unselectAllProjects : this.selectAllProjects}>
              {allProjectsSelected ? 'Unselect All' : 'Select All'}
            </button>
          )}
        </>
      );
    }

    return (
      <dialog className="pop-over team-user-info-pop team-user-remove-pop">
        <NestedPopoverTitle>Remove {getDisplayName(this.props.user)}</NestedPopoverTitle>

        {projects && (
          <section className="pop-over-actions" id="user-team-projects">
            {projects}
          </section>
        )}

        <section className="pop-over-actions danger-zone">
          <TeamUserRemoveButton
            userAvatar={getAvatarThumbnailUrl(this.props.user)}
            userLogin={this.props.user.login}
            userStyle={userAvatarStyle}
            removeUser={this.removeUser}
          />
        </section>
      </dialog>
    );
  }
}
TeamUserRemovePop.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    login: PropTypes.string,
    thanksCount: PropTypes.number.isRequired,
    isOnTeam: PropTypes.bool,
    color: PropTypes.string,
  }).isRequired,
  userTeamProjects: PropTypes.shape({
    status: PropTypes.string.isRequired,
    data: PropTypes.array,
  }).isRequired,
  team: PropTypes.shape({
    projects: PropTypes.array.isRequired,
  }).isRequired,
  removeUser: PropTypes.func.isRequired,
};

export default TeamUserRemovePop;
