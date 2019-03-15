import React from 'react';
import PropTypes from 'prop-types';

import PopoverWithButtonComp from 'Source/components/popovers/popover-with-button';
import AddCollectionProjectPop from '../pop-overs/add-collection-project-pop';

class AddCollectionProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projects: [] };
  }

  async componentDidMount() {
    const { api, collection } = this.props;
    if (collection.teamId > 0) {
      const { data: team } = await api.get(`teams/${collection.teamId}`);
      this.setState({ projects: team.projects });
    }
  }

  render() {
    let initialProjects = [];
    if (this.props.collection.teamId > 0) {
      initialProjects = this.state.projects;
    } else if (this.props.currentUser) {
      initialProjects = this.props.currentUser.projects;
    }
    return (
      <PopoverWithButtonComp buttonText="Add Project" passToggleToPop>
        <AddCollectionProjectPop initialProjects={initialProjects.slice(0, 20)} {...this.props} />
      </PopoverWithButtonComp>
    );
  }
}

AddCollectionProject.propTypes = {
  collection: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  api: PropTypes.func.isRequired,
};

export default AddCollectionProject;
