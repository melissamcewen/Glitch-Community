import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'react-pluralize';
import { sampleSize, flatMap, uniq } from 'lodash';
import Markdown from 'Components/text/markdown';
import Heading from 'Components/text/heading';
import { ProjectsUL } from 'Components/containers/projects-list';
import { ProfileItem } from 'Components/profile/profile-list';
import { CollectionAvatar } from 'Components/images/avatar';
import { captureException } from '../utils/sentry';

import { featuredCollections } from '../curated/collections';
import { isDarkColor } from '../models/collection';

import { getSingleItem, getFromApi, joinIdsToQueryString } from '../../shared/api';
import { CollectionLink } from './includes/link';
import { DataLoader } from './includes/loader';

import { useAPI } from '../state/api';

const CollectionWide = ({ collection }) => {
  const dark = isDarkColor(collection.coverColor) ? 'dark' : '';
  const featuredProjects = sampleSize(collection.projects, 3);
  const featuredProjectsHaveAtLeastOneNote = featuredProjects.filter((p) => !!p.note).length > 0;
  return (
    <article className="collection-wide projects" style={{ backgroundColor: collection.coverColor }}>
      <header className={`collection ${dark}`}>
        <CollectionLink className="collection-image-container" collection={collection}>
          <CollectionAvatar color={collection.coverColor} />
        </CollectionLink>
        <CollectionLink className="collection-name" collection={collection}>
          <Heading tagName="h2">{collection.name}</Heading>
        </CollectionLink>
        <div className="collection-owner">
          <ProfileItem hasLinks team={collection.team} user={collection.user} />
        </div>
        <div className="collection-description">
          <Markdown length={80}>{collection.description}</Markdown>
        </div>
      </header>
      <div className="collection-contents">
        <ProjectsUL projects={featuredProjects} collection={collection} hideProjectDescriptions={featuredProjectsHaveAtLeastOneNote} />
        <CollectionLink collection={collection} className="collection-view-all">
          View all <Pluralize count={collection.projectCount} singular="project" /> <span aria-hidden>→</span>
        </CollectionLink>
      </div>
    </article>
  );
};

CollectionWide.propTypes = {
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string,
    coverColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const loadCollection = async (api, { owner, name }) => {
  try {
    const collection = await getSingleItem(api, `/v1/collections/by/fullUrl?fullUrl=${owner}/${name}`, `${owner}/${name}`);
    collection.projects = await getSingleItem(api, `/v1/collections/by/fullUrl/projects?limit=20&fullUrl=${owner}/${name}`, 'items');
    collection.team = await getSingleItem(api, `/v1/teams/by/id?id=${collection.team.id}`, collection.team.id);
    collection.projectCount = collection.projects.length;
    collection.projects = sampleSize(collection.projects, 3);
    // Gather unique user IDs for all of the projects being loaded, based on permissions
    const uniqueUserIds = uniq(flatMap(collection.projects, ({ permissions }) => permissions.map(({ userId }) => userId)));
    // Load all of the users for this set of projects
    const allUsers = await getFromApi(api, `v1/users/by/id?${joinIdsToQueryString(uniqueUserIds)}`);
    // Go back over the projects and pick users out of the array by ID based on permissions
    collection.projects = collection.projects.map((project) => ({
      ...project,
      users: project.permissions.map(({ userId }) => allUsers[userId]),
    }));
    return collection;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    captureException(error);
  }

  return null;
};

const loadAllCollections = async (api, infos) => {
  // don't await until every request is sent so they can all run at once
  const promises = infos.map((info) => loadCollection(api, info));
  return Promise.all(promises);
};

export const FeaturedCollections = () => {
  const api = useAPI();
  return (
    <DataLoader get={() => loadAllCollections(api, featuredCollections)}>
      {(collections) => collections.filter((c) => !!c).map((collection) => <CollectionWide collection={collection} key={collection.id} />)}
    </DataLoader>
  );
};
export default FeaturedCollections;
