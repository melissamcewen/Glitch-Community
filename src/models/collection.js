import { kebabCase } from 'lodash';

import { CDN_URL } from 'Utils/constants';
import { pickRandomColor } from 'Utils/color';

import { getLink as getTeamLink } from './team';
import { getLink as getUserLink } from './user';

import { getCollectionPair } from './words';

export const FALLBACK_AVATAR_URL = 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1541449590339';
export const defaultAvatar = 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633';

export function getAvatarUrl(id) {
  return `${CDN_URL}/collection-avatar/${id}.png`;
}

export function getOwnerLink(collection) {
  if (collection.team) {
    return getTeamLink(collection.team);
  }
  if (collection.user) {
    return getUserLink(collection.user);
  }
  throw new Error(`Collection ${collection.id} has no team or user field!`);
}

export function getLink(collection) {
  if (collection.fullUrl) {
    return `/@${collection.fullUrl}`;
  }
  return `${getOwnerLink(collection)}/${collection.url}`;
}

export async function createCollection(api, name, teamId, createNotification) {
  let description = '';
  let generatedName = false;
  if (!name) {
    // generate a new random name & description
    generatedName = true;
    name = 'radical-mix'; // a default to fall back on
    try {
      name = await getCollectionPair();
    } catch (error) {
      // stick to default
    }
    const [predicate, collectionSynonym] = name.split('-');
    description = `A ${collectionSynonym} of projects that does ${predicate} things`;
  }
  const url = kebabCase(name);
  const avatarUrl = defaultAvatar;
  const coverColor = pickRandomColor();

  try {
    const { data: collection } = await api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
      coverColor,
      teamId,
    });

    return collection;
  } catch (error) {
    let errorMessage = 'Unable to create collection.  Try again?';
    if (!generatedName && error.response && error.response.data) {
      errorMessage = error.response.data.message;
    }
    createNotification(errorMessage, { type: 'error' });
  }
  return null;
}

// Circular dependencies must go below module.exports
// eventually want to handle whether the collection belongs to a team or a user
