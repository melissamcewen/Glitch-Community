import { mapValues } from 'lodash';

const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

const resourceConfig = {
  collections: {
    references: { projects: 'projects' },
  },
  projects: {
    references: { collections: 'collections', teams: 'teams', users: 'users' },
  },
  teams: {
    references: {
      collections: 'collections',
      users: 'users',
      projects: 'projects',
      pinnedProjects: 'projects',
    },
  },
  users: {
    references: {
      collections: 'collections',
      teams: 'teams',
      projects: 'projects',
      pinnedProjects: 'projects',
      deletedProjects: 'projects',
    },
  },
};

/*
state shape:
{
  [type]: { 
    [id]: {
      status: 'loading' | 'ready'
      value,
      expires, 
      references: { 
        [childType]: {
          status: 'loading' | 'ready',
          ids: [childID]
        }
      } 
    } 
  } 
}
*/

const initialState = mapValues(resourceConfig, () => ({}));

// get the cached resource + any requests that we need to make
const getResource = (state, type, id) => {
  if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);

  const row = state[type][id];
  // resource is missing or expired; request the resource
  if (!row || row.expires < Date.now()) {
    return { status: 'loading', value: null, requests: [{ type, ids: [id] }] };
  }
  // resource is pending; don't make a request
  if (row.status)
  
  return { status: 'loading', value: row.value, row, requests: [] };
};

const getChildResources = (state, type, id, childType) => {
  const { value, row } = getResource(state, type, id);
  // resource is missing or expired; request the resource + its children
  if (!value) {
    return { value: null, requests: [{ type, ids: [id] }, { type, id, childType }] };
  }

  const childResourceType = resourceConfig[type].refernces[childType];
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);

  const childIDs = row.references[childType];
  // resource is present but its children are missing; request all of its children
  if (!childIDs) {
    return { value: null, requests: [{ type, id, childType }] };
  }

  // collect all of the associated children from the child resource table
  const resultValues = [];
  const childIDsToRequest = [];
  for (const childID of childIDs) {
    const { value: childValue } = getResource(state, childResourceType, childID);
    if (value) {
      resultValues.push(value);
    } else {
      childIDsToRequest.push(childID);
    }
  }

  // some children are missing/expired; request them in a single batch
  if (childIDsToRequest.length > 0) {
    return { value: resultValues, requests: [{ type: childResourceType, ids: childIDsToRequest }] };
  }
  return { value: resultValues, requests: [] };
};
