import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import TextInput from 'Components/inputs/text-input';
import Loader from 'Components/loader';
import { getPredicates, getTeamPair } from 'Models/words';
import { getLink } from 'Models/team';
import { useAPI } from 'State/api';
import { useTracker } from 'State/segment-analytics';

import { NestedPopoverTitle } from './popover-nested';

// Create Team 🌿

const CreateTeamSubmitButton = () => {
  const onClick = useTracker('Create Team submitted');
  return (
    <button type="submit" className="button-small has-emoji" onClick={onClick}>
      Create Team <span className="emoji thumbs_up" />
    </button>
  );
};

class CreateTeamPopBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: '',
      isLoading: false,
      error: '',
    };
    this.debouncedValidate = _.debounce(this.validate.bind(this), 200);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const teamName = await getTeamPair();
      this.setState((prevState) => (!prevState.teamName ? { teamName } : {}));
    } catch (error) {
      // If something goes wrong just leave the field empty
    }
    this.validate();
  }

  async validate() {
    const name = this.state.teamName;
    if (name) {
      const url = _.kebabCase(name);
      let error = null;

      try {
        const { data } = await this.props.api.get(`userId/byLogin/${url}`);
        if (data !== 'NOT FOUND') {
          error = 'Name in use, try another';
        }
      } catch (exception) {
        if (!(exception.response && exception.response.status === 404)) {
          throw exception;
        }
      }

      try {
        const { data } = await this.props.api.get(`teamId/byUrl/${url}`);
        if (data !== 'NOT FOUND') {
          error = 'Team already exists, try another';
        }
      } catch (exception) {
        if (!(exception.response && exception.response.status === 404)) {
          throw exception;
        }
      }

      if (error) {
        this.setState(({ teamName }) => (name === teamName ? { error } : {}));
      }
    }
  }

  async handleChange(newValue) {
    this.setState({
      teamName: newValue,
      error: '',
    });
    this.debouncedValidate();
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      let description = 'A team that makes things';
      try {
        const predicates = await getPredicates();
        description = `A ${predicates[0]} team that makes ${predicates[1]} things`;
      } catch (error) {
        // Just use the plain description
      }
      const { data } = await this.props.api.post('teams', {
        name: this.state.teamName,
        url: _.kebabCase(this.state.teamName),
        hasAvatarImage: false,
        coverColor: '',
        location: '',
        description,
        backgroundColor: '',
        hasCoverImage: false,
        isVerified: false,
      });
      this.props.history.push(getLink(data));
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      this.setState({
        isLoading: false,
        error: message || 'Something went wrong',
      });
    }
  }

  render() {
    const placeholder = 'Your Team Name';
    return (
      <dialog className="pop-over create-team-pop" ref={this.props.focusFirstElement}>
        <NestedPopoverTitle>
          Create Team <span className="emoji herb" />
        </NestedPopoverTitle>

        <section className="pop-over-info">
          <p className="info-description">Showcase your projects in one place, manage collaborators, and view analytics</p>
        </section>

        <section className="pop-over-actions">
          <form onSubmit={this.handleSubmit}>
            <TextInput
              labelText={placeholder}
              value={this.state.teamName}
              onChange={this.handleChange}
              placeholder={placeholder}
              error={this.state.error}
            />
            <p className="action-description team-url-preview">/@{_.kebabCase(this.state.teamName || placeholder)}</p>

            {this.state.isLoading ? <Loader /> : <CreateTeamSubmitButton />}
          </form>
        </section>
        <section className="pop-over-info">
          <p className="info-description">You can change this later</p>
        </section>
      </dialog>
    );
  }
}

CreateTeamPopBase.propTypes = {
  api: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

const CreateTeamPop = withRouter((props) => {
  const api = useAPI();
  return <CreateTeamPopBase api={api} {...props} />;
});

export default CreateTeamPop;
