// add-project-to-collection-pop -> Add a project to a collection via a project item's menu
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { partition } from 'lodash';
import Badge from 'Components/badges/badge';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import Link from 'Components/link';
import {
  PopoverWithButton,
  MultiPopover,
  MultiPopoverTitle,
  PopoverDialog,
  InfoDescription,
  PopoverInfo,
  PopoverActions,
  PopoverSearch,
} from 'Components/popover';
import Button from 'Components/buttons/button';
import { ProjectAvatar } from 'Components/images/avatar';
import CollectionResultItem from 'Components/collection/collection-result-item';
import { CreateCollectionWithProject } from 'Components/collection/create-collection-pop';
import { AddProjectToCollectionMsg } from 'Components/notification';
import { useTrackedFunc } from 'State/segment-analytics';
import { useAlgoliaSearch } from 'State/search';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import useDevToggle from 'State/dev-toggles';
import { useAPI } from 'State/api';
import { getCollectionsWithMyStuff, createCollection } from 'Models/collection';
import useDebouncedValue from '../../hooks/use-debounced-value';
import styles from './popover.styl';

const collectionTypeOptions = [
  {
    name: 'user',
    contents: 'Your collections',
  },
  {
    name: 'team',
    contents: 'Team collections',
  },
];

const AddProjectPopoverTitle = ({ project }) => (
  <MultiPopoverTitle>
    <ProjectAvatar project={project} tiny />
    &nbsp;Add {project.domain} to collection
  </MultiPopoverTitle>
);
AddProjectPopoverTitle.propTypes = {
  project: PropTypes.object.isRequired,
};

const AddProjectToCollectionResultItem = ({ onClick, collection, active }) => {
  const onClickTracked = useTrackedFunc(
    onClick,
    'Project Added to Collection',
    {},
    {
      groupId: collection.team ? collection.team.id : 0,
    },
  );
  return <CollectionResultItem onClick={onClickTracked} collection={collection} active={active} />;
};

const AlreadyInCollection = ({ project, collections }) => (
  <InfoDescription>
    <strong>{project.domain}</strong> is already in <Pluralize count={collections.length} showCount={false} singular="collection" />{' '}
    {collections
      .slice(0, 3)
      .map((collection) => (
        <Link key={collection.id} to={`/@${collection.fullUrl}`}>
          {collection.name}
        </Link>
      ))
      .reduce((prev, curr) => [prev, ', ', curr])}
    {collections.length > 3 && (
      <>
        , and{' '}
        <div className={styles.moreCollectionsBadge}>
          <Badge>{collections.length - 3}</Badge>
        </div>{' '}
        <Pluralize count={collections.length - 3} singular="other" showCount={false} />
      </>
    )}
  </InfoDescription>
);

const NoResults = ({ project, collectionsWithProject, query }) => {
  if (collectionsWithProject.length) {
    return <AlreadyInCollection project={project} collections={collectionsWithProject} />;
  }
  if (query.length > 0) {
    return <InfoDescription>No matching collections found – add to a new one?</InfoDescription>;
  }
  return <InfoDescription>Create collections to organize your favorite projects.</InfoDescription>;
};

function useCollectionSearch(query, project, collectionType) {
  const { currentUser } = useCurrentUser();
  const debouncedQuery = useDebouncedValue(query, 200);
  const filters = collectionType === 'user' ? { userIDs: [currentUser.id] } : { teamIDs: currentUser.teams.map((team) => team.id) };

  const searchResults = useAlgoliaSearch(debouncedQuery, { ...filters, filterTypes: ['collection'], allowEmptyQuery: true, isMyStuff: true }, [
    collectionType,
  ]);
  const myStuffEnabled = useDevToggle('My Stuff');

  const searchResultsWithMyStuff = useMemo(
    () => {
      const shouldPutMyStuffAtFrontOfList = myStuffEnabled && searchResults.collection && collectionType === 'user' && query.length === 0;
      if (shouldPutMyStuffAtFrontOfList) {
        return getCollectionsWithMyStuff({ collections: searchResults.collection });
      }
      return searchResults.collection;
    },
    [searchResults, query],
  );

  const [collectionsWithProject, collections] = useMemo(
    () => partition(searchResultsWithMyStuff, (result) => result.projects.includes(project.id)).map((list) => list.slice(0, 20)),
    [searchResultsWithMyStuff, project.id, collectionType],
  );

  return { status: searchResults.status, collections, collectionsWithProject };
}

export const AddProjectToCollectionBase = ({ project, fromProject, addProjectToCollection, togglePopover, createCollectionPopover, setInitialCollectionName }) => {
  const [collectionType, setCollectionType] = useState('user');
  const [query, setQuery] = useState('');
  useEffect(() => {
    setInitialCollectionName(query);
  }, [query]);
  const { status, collections, collectionsWithProject } = useCollectionSearch(query, project, collectionType);
  const { currentUser } = useCurrentUser();
  const { createNotification } = useNotifications();
  const api = useAPI();
  const myStuffEnabled = useDevToggle('My Stuff');

  const addProjectTo = async (collection) => {
    const shouldCreateMyStuffCollection = myStuffEnabled && collection.isMyStuff && collection.id === 'nullMyStuff';
    if (shouldCreateMyStuffCollection) {
      collection = await createCollection({ api, name: 'My Stuff', createNotification, myStuffEnabled: true });
      collection.fullUrl = collection.fullUrl || `${currentUser.login}/${collection.url}`;
    }

    await addProjectToCollection(project, collection);
    createNotification(
      <AddProjectToCollectionMsg projectDomain={project.domain} collectionName={collection.name} url={`/@${collection.fullUrl}`} />,
      { type: 'success' },
    );

    togglePopover();
  };

  return (
    <PopoverDialog wide align="right">
      {/* Only show this nested popover title from project-options */}
      {fromProject && <AddProjectPopoverTitle project={project} />}

      {currentUser.teams.length > 0 && (
        <PopoverActions>
          <SegmentedButtons value={collectionType} buttons={collectionTypeOptions} onChange={setCollectionType} />
        </PopoverActions>
      )}

      <PopoverSearch
        value={query}
        onChange={setQuery}
        status={status}
        results={collections}
        onSubmit={addProjectTo}
        placeholder="Filter collections"
        labelText="Filter collections"
        renderItem={({ item: collection, active }) => (
          <AddProjectToCollectionResultItem active={active} onClick={() => addProjectTo(collection)} collection={collection} />
        )}
        renderNoResults={() => (
          <PopoverInfo>
            <NoResults project={project} collectionsWithProject={collectionsWithProject} query={query} />
          </PopoverInfo>
        )}
      />

      <PopoverActions>
        <Button size="small" type="tertiary" onClick={() => createCollectionPopover()}>
          Add to a new collection
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
};

AddProjectToCollectionBase.propTypes = {
  fromProject: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired,
  togglePopover: PropTypes.func.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
  createCollectionPopover: PropTypes.func.isRequired,
};

const AddProjectToCollection = ({ project, addProjectToCollection }) => {
  const [initialCollectionName, setInitialCollectionName] = useState('');
  return (
    <PopoverWithButton buttonProps={{ size: 'small', emoji: 'framedPicture' }} buttonText="Add to Collection">
      {({ togglePopover }) => (
        <MultiPopover
          views={{
            createCollectionPopover: () => (
              <CreateCollectionWithProject
                addProjectToCollection={(...args) => {
                  addProjectToCollection(...args);
                  togglePopover();
                }}
                project={project}
                initialCollectionName={initialCollectionName}
              />
            ),
          }}
        >
          {({ createCollectionPopover }) => (
            <AddProjectToCollectionBase
              addProjectToCollection={addProjectToCollection}
              fromProject={false}
              project={project}
              togglePopover={togglePopover}
              createCollectionPopover={createCollectionPopover}
              setInitialCollectionName={setInitialCollectionName}
            />
          )}
        </MultiPopover>
      )}
    </PopoverWithButton>
  );
};

AddProjectToCollection.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
};

export default AddProjectToCollection;
