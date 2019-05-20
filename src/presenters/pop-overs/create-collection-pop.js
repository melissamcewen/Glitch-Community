// create-collection-pop.jsx -> add a project to a new user or team collection
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { kebabCase, orderBy } from 'lodash';

import Loader from 'Components/loader';
import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TextInput from 'Components/inputs/text-input';
import { AddProjectToCollectionMsg } from 'Components/notifications';
import { getLink, createCollection } from 'Models/collection';
import { useTracker } from 'State/segment-analytics';
import { useAPI } from 'State/api';
import { useNotifications } from 'State/notifications';

import { NestedPopoverTitle } from './popover-nested';
import Dropdown from './dropdown';

// getTeamOptions: Format teams in { value: teamId, label: html elements } format for react-select
function getTeamOptions(teams) {
  const orderedTeams = orderBy(teams, (team) => team.name.toLowerCase());

  const teamOptions = orderedTeams.map((team) => {
    const option = {};
    const label = (
      <span id={team.id}>
        {team.name}
        <TeamAvatar team={team} hideTooltip />
      </span>
    );
    option.value = team.id;
    option.label = label;
    return option;
  });
  return teamOptions;
}

const SubmitButton = ({ disabled }) => {
  const track = useTracker('Create Collection clicked', (inherited) => ({
    ...inherited,
    origin: `${inherited.origin} project`,
  }));
  return (
    <div className="button-wrap">
      <button type="submit" onClick={track} className="create-collection button-small" disabled={disabled}>
        Create
      </button>
    </div>
  );
};
SubmitButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
};

class CreateCollectionPop extends React.Component {
  constructor(props) {
    super(props);

    const currentUserOptionLabel = (
      <span>
        myself
        <UserAvatar user={this.props.currentUser} hideTooltip />
      </span>
    );
    const currentUserOption = { value: null, label: currentUserOptionLabel };

    this.options = [currentUserOption].concat(getTeamOptions(this.props.currentUser.teams));

    this.state = {
      loading: false,
      query: '', // The entered collection name
      selection: currentUserOption, // the selected option from the dropdown
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSelection = this.setSelection.bind(this);
  }

  setSelection(option) {
    this.setState({
      selection: option,
    });
  }

  async handleSubmit(event, createNotification) {
    event.preventDefault();
    this.setState({ loading: true });
    // create the new collection with createCollection(api, name, teamId, notification)
    const collectionResponse = await createCollection(this.props.api, this.state.query, this.state.selection.value, createNotification);
    // add the project to the collection
    if (collectionResponse && collectionResponse.id) {
      const collection = collectionResponse;
      // add the selected project to the collection
      try {
        if (this.props.addProjectToCollection) {
          // custom add project to collection function from user page
          this.props.addProjectToCollection(this.props.project, collection);
        } else {
          // default API call to add project to collection
          this.props.api.patch(`collections/${collection.id}/add/${this.props.project.id}`);
        }
        if (this.state.selection.value) {
          const team = this.props.currentUser.teams.find(({ id }) => id === this.state.selection.value);
          collection.team = team;
        }
        collection.user = this.props.currentUser;

        const newCollectionUrl = getLink(collection);

        if (this.props.removeProjectFromTeam) {
          // coming from team page -> redirect to newly created collection
          this.setState({ newCollectionUrl });
        } else {
          // show notification
          const content = (
            <AddProjectToCollectionMsg projectDomain={this.props.project.domain} collectionName={collection.name} url={newCollectionUrl} />
          );
          createNotification(content, 'success');
        }
        this.props.togglePopover();
      } catch (error) {
        createNotification('Unable to add project to collection.', 'error');
        this.props.togglePopover();
      }
    } else {
      // error messaging is handled in createCollection
      this.props.togglePopover();
    }
  }

  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }

  render() {
    const { error, query } = this.state;
    const { collections, createNotification, focusFirstElement } = this.props;
    const { teams } = this.props.currentUser;
    let queryError; // if user already has a collection with the specified name

    const submitEnabled = this.state.query.length > 0;
    const placeholder = 'New Collection Name';

    // determine if entered name already exists for selected user / team
    const selectedOwnerCollections = this.state.selection.value
      ? collections.filter(({ teamId }) => teamId === this.state.selection.value)
      : collections.filter(({ userId }) => userId === this.props.currentUser.id);

    if (!!collections && selectedOwnerCollections.some((c) => c.url === kebabCase(query))) {
      queryError = 'You already have a collection with this name';
    }
    if (this.state.newCollectionUrl) {
      return <Redirect to={this.state.newCollectionUrl} />;
    }

    return (
      <dialog className="pop-over create-collection-pop wide-pop" ref={focusFirstElement}>
        <NestedPopoverTitle>{`Add ${this.props.project.domain} to a new collection`}</NestedPopoverTitle>

        <section className="pop-over-actions">
          <form onSubmit={(event) => this.handleSubmit(event, createNotification)}>
            <TextInput
              value={query}
              onChange={this.handleChange}
              placeholder={placeholder}
              error={error || queryError}
              labelText={placeholder}
            />

            {teams && teams.length > 0 && (
              <div>
                {'for '}
                <Dropdown containerClass="user-or-team-toggle" options={this.options} selection={this.state.selection} onUpdate={this.setSelection} />
              </div>
            )}

            {!this.state.loading ? (
              <SubmitButton disabled={!!queryError || !submitEnabled} />
            ) : (
              <Loader />
            )}
          </form>
        </section>
      </dialog>
    );
  }
}

CreateCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  focusFirstElement: PropTypes.func.isRequired,
};

CreateCollectionPop.defaultProps = {
  addProjectToCollection: null,
};

export default (props) => {
  const api = useAPI();
  const { createNotification } = useNotifications();
  return <CreateCollectionPop {...props} api={api} createNotification={createNotification} />;
};
