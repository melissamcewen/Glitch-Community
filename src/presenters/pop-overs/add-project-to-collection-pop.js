// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React from 'react';
import PropTypes from 'prop-types';
import { orderBy, remove } from 'lodash';
import Loader from 'Components/loaders/loader';
import { ProjectAvatar } from 'Components/images/avatar';
import { captureException } from '../../utils/sentry';

import { useTrackedFunc } from '../segment-analytics';
import { useAPI } from '../../state/api';
import { useCurrentUser } from '../../state/current-user';

import CreateCollectionPop from './create-collection-pop';
import CollectionResultItem from '../includes/collection-result-item';

import { NestedPopover, NestedPopoverTitle } from './popover-nested';

const NoSearchResultsPlaceholder = <p className="info-description">No matching collections found – add to a new one?</p>;

const NoCollectionPlaceholder = <p className="info-description">Create collections to organize your favorite projects.</p>;

const AddProjectPopoverTitle = ({ project }) => (
  <NestedPopoverTitle>
    <ProjectAvatar {...project} /> Add {project.domain} to collection
  </NestedPopoverTitle>
);
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

const AddProjectToCollectionResultItem = ({ onClick, collection, ...props }) => {
  const onClickTracked = useTrackedFunc(onClick, 'Project Added to Collection', {}, {
    groupId: collection.team ? collection.team.id : 0,
  });
  return (
    <CollectionResultItem
      onClick={onClickTracked}
      collection={collection}
      {...props}
    />
  );
};

class AddProjectToCollectionPopContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '', // value of filter input field
      filteredCollections: this.props.collections, // collections filtered from search query
    };
    this.updateFilter = this.updateFilter.bind(this);
    this.renderCollectionsThatDontHaveProject = this.renderCollectionsThatDontHaveProject.bind(this);
  }

  updateFilter(query) {
    query = query.toLowerCase().trim();
    const filteredCollections = this.props.collections.filter((collection) => collection.name.toLowerCase().includes(query));
    this.setState({ filteredCollections, query });
  }

  // filter out collections that already contain the selected project
  renderCollectionsThatDontHaveProject(collection) {
    if (!collection.projects) {
      return null;
    }
    const currentProjectNotIncluded = collection.projects.every((project) => project.id !== this.props.project.id);

    if (!currentProjectNotIncluded) {
      return null;
    }

    return (
      <li key={collection.id}>
        <AddProjectToCollectionResultItem
          onClick={this.props.addProjectToCollection}
          project={this.props.project}
          collection={collection}
          togglePopover={this.props.togglePopover}
          currentUser={this.props.currentUser}
        />
      </li>
    );
  }

  render() {
    const { filteredCollections, query } = this.state;
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {/* Only show this nested popover title from project-options */}
        {!this.props.fromProject && <AddProjectPopoverTitle project={this.props.project} />}

        {this.props.collections.length > 3 && (
          <section className="pop-over-info">
            <input
              className="pop-over-input search-input pop-over-search"
              onChange={(evt) => {
                this.updateFilter(evt.target.value);
              }}
              placeholder="Filter collections"
              aria-label="Filter collections"
            />
          </section>
        )}

        {filteredCollections.length ? (
          <section className="pop-over-actions results-list">
            <ul className="results">{filteredCollections.map(this.renderCollectionsThatDontHaveProject)}</ul>
          </section>
        ) : (
          <section className="pop-over-info">{query ? NoSearchResultsPlaceholder : NoCollectionPlaceholder}</section>
        )}

        <section className="pop-over-actions">
          <button className="create-new-collection button-small button-tertiary" onClick={this.props.createCollectionPopover}>
            Add to a new collection
          </button>
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPopContents.propTypes = {
  addProjectToCollection: PropTypes.func,
  collections: PropTypes.array,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func, // required but added dynamically
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

AddProjectToCollectionPopContents.defaultProps = {
  addProjectToCollection: null,
  collections: [],
  currentUser: null,
  togglePopover: null,
  fromProject: false,
};

class AddProjectToCollectionPop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maybeCollections: null, // null means still loading
    };
  }

  async componentDidMount() {
    this.loadCollections();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async loadCollections() {
    try {
      const { data: allCollections } = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}&includeTeams=true`);
      const deletedCollectionIds = []; // collections from deleted teams
      // add user / team to each collection
      allCollections.forEach((collection) => {
        if (collection.teamId === -1) {
          collection.user = this.props.currentUser;
        } else {
          collection.team = this.props.currentUser.teams.find((userTeam) => userTeam.id === collection.teamId);
          if (!collection.team) {
            deletedCollectionIds.push(collection.id);
          }
        }
      });

      // remove deleted collections
      remove(allCollections, (collection) => deletedCollectionIds.includes(collection.id));

      const orderedCollections = orderBy(allCollections, (collection) => collection.updatedAt, ['desc']);

      if (!this.unmounted) {
        this.setState({ maybeCollections: orderedCollections });
      }
    } catch (error) {
      captureException(error);
    }
  }

  render() {
    const { maybeCollections } = this.state;
    return (
      <NestedPopover
        alternateContent={() => (
          <CreateCollectionPop {...this.props} collections={this.state.maybeCollections} togglePopover={this.props.togglePopover} />
        )}
        startAlternateVisible={false}
      >
        {(createCollectionPopover) => {
          if (maybeCollections) {
            return (
              <AddProjectToCollectionPopContents {...this.props} collections={maybeCollections} createCollectionPopover={createCollectionPopover} />
            );
          }
          return (
            <dialog className="pop-over add-project-to-collection-pop wide-pop">
              {!this.props.fromProject && <AddProjectPopoverTitle project={this.props.project} />}
              <div className="loader-container">
                <Loader />
              </div>
            </dialog>
          );
        }}
      </NestedPopover>
    );
  }
}

AddProjectToCollectionPop.propTypes = {
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const AddProjectToCollectionPopWrap = (props) => {
  const { currentUser } = useCurrentUser();
  const api = useAPI();
  return <AddProjectToCollectionPop {...props} currentUser={currentUser} api={api} />;
};

export default AddProjectToCollectionPopWrap;
