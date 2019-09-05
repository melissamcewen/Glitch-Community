// create-collection-pop.jsx -> add a project to a new user or team collection
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { kebabCase, orderBy } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Loader, TextInput } from '@fogcreek/shared-components';

import { UserAvatar, TeamAvatar } from 'Components/images/avatar';
import { AddProjectToCollectionMsg } from 'Components/notification';
import { PopoverDialog, MultiPopoverTitle, PopoverActions, PopoverWithButton } from 'Components/popover';
import Button from 'Components/buttons/button';
import { createCollection } from 'Models/collection';
import { useTracker } from 'State/segment-analytics';
import { useAPI, createAPIHook } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { getAllPages } from 'Shared/api';

import styles from './create-collection-pop.styl';

function Dropdown({ selection, options, onUpdate }) {
  const [reactSelect, setReactSelect] = useState(null);
  useEffect(() => {
    if (reactSelect) return;
    const loadReactSelect = async () => {
      setReactSelect(await import(/* webpackChunkName: "react-select" */ 'react-select'));
    };
    loadReactSelect();
  }, []);

  if (!reactSelect) return <Loader />;

  const Select = reactSelect.default;
  return (
    <Select
      autoWidth
      value={selection}
      options={options}
      className={styles.userOrTeamToggle}
      classNamePrefix="dropdown"
      onChange={onUpdate}
      isSearchable={false}
    />
  );
}

// Format in { value: teamId, label: html elements } format for react-select
const getUserOption = (currentUser) => ({
  value: null,
  label: (
    <span>
      <UserAvatar user={currentUser} hideTooltip /> myself
    </span>
  ),
});

const getTeamOption = (team) => ({
  value: team.id,
  label: (
    <span id={team.id}>
      <TeamAvatar team={team} hideTooltip /> {team.name}
    </span>
  ),
});

function getOptions(currentUser) {
  const orderedTeams = orderBy(currentUser.teams, (team) => team.name.toLowerCase());
  const teamOptions = orderedTeams.map(getTeamOption);
  return [getUserOption(currentUser), ...teamOptions];
}

const useCollections = createAPIHook((api, teamId, currentUser) => {
  if (teamId) {
    return getAllPages(api, `/v1/teams/by/id/collections?id=${teamId}&limit=100`);
  }
  return getAllPages(api, `/v1/users/by/id/collections?id=${currentUser.id}&limit=100`);
});

function CreateCollectionPopBase({ align, title, onSubmit, options }) {
  const api = useAPI();
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();

  const [loading, setLoading] = useState(false);
  // TODO: should this be pre-populated with a friendly name?
  const [collectionName, setCollectionName] = useState('');

  const [selection, setSelection] = useState(options[0]);

  // determine if name is valid
  const { value: collections } = useCollections(selection.value, currentUser);
  const nameAlreadyExists = (collections || []).some((c) => c.url === kebabCase(collectionName));
  const isMyStuffError = kebabCase(collectionName) === 'my-stuff';
  let error = '';
  if (isMyStuffError) {
    error = 'My Stuff is a reserved name';
  }
  if (nameAlreadyExists) {
    error = 'You already have a collection with this name';
  }

  const submitDisabled = loading || collectionName.length === 0 || !!error;

  async function handleSubmit(event) {
    if (submitDisabled) return;
    event.preventDefault();
    setLoading(true);
    const collection = await createCollection({
      api,
      name: collectionName,
      teamId: selection.value,
      createNotification,
    });
    const team = currentUser.teams.find((t) => t.id === selection.value);
    collection.fullUrl = `${team ? team.url : currentUser.login}/${collection.url}`;
    onSubmit(collection);
  }

  return (
    <PopoverDialog wide align={align}>
      {title}

      <PopoverActions>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <TextInput
              value={collectionName}
              onChange={setCollectionName}
              error={error}
              label="New Collection Name"
            />
          </div>

          {options.length > 1 && (
            <div>
              {'for '}
              <Dropdown options={options} selection={selection} onUpdate={(value) => setSelection(value)} />
            </div>
          )}

          {loading ? (
            <Loader />
          ) : (
            <Button size="small" onClick={handleSubmit} disabled={submitDisabled}>
              Create
            </Button>
          )}
        </form>
      </PopoverActions>
    </PopoverDialog>
  );
}

export function CreateCollectionWithProject({ project, addProjectToCollection }) {
  const { createNotification } = useNotifications();
  const { currentUser } = useCurrentUser();
  const options = getOptions(currentUser);
  const track = useTracker('Create Collection clicked', (inherited) => ({
    ...inherited,
    origin: `${inherited.origin} project`,
  }));
  const onSubmit = async (collection) => {
    track();
    if (!collection || !collection.id) return;

    try {
      await addProjectToCollection(project, collection);

      const content = <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />;
      createNotification(content, { type: 'success' });
    } catch (e) {
      createNotification('Unable to add project to collection.', { type: 'error' });
    }
  };
  const title = <MultiPopoverTitle>{`Add ${project.domain} to a new collection`}</MultiPopoverTitle>;

  return <CreateCollectionPopBase align="right" title={title} options={options} onSubmit={onSubmit} />;
}

CreateCollectionWithProject.propTypes = {
  project: PropTypes.object.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

const CreateCollectionPop = withRouter(({ team, history }) => {
  const { currentUser } = useCurrentUser();
  const options = team ? [getTeamOption(team)] : [getUserOption(currentUser)];
  const track = useTracker('Create Collection clicked');
  const onSubmit = (collection) => {
    track();
    if (collection) {
      history.push(`/@${collection.fullUrl}`);
    }
  };

  return (
    <PopoverWithButton buttonText="Create Collection">
      {() => <CreateCollectionPopBase align="left" options={options} onSubmit={onSubmit} />}
    </PopoverWithButton>
  );
});

CreateCollectionPop.propTypes = {
  team: PropTypes.object,
};
CreateCollectionPop.defaultProps = {
  team: null,
};

export default CreateCollectionPop;
