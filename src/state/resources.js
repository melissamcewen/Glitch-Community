import { mapValues } from 'lodash';

const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes
const status = {
  loading: 'loading',
  ready: 'ready',
}

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
      expires, 
      value,
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

/*
get the cached resource + any requests that we need to make
returns {
  status: 'loading' | 'ready'
  value,
  requests: [request],
  _references (used internally by getChildResources)
}
*/
const getResource = (state, type, id) => {
  if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);

  const row = state[type][id];
  // resource is missing or expired; request the resource
  if (!row || row.expires < Date.now()) {
    return { status: status.loading, value: null, requests: [{ type, ids: [id] }] };
  }
  
  return { status: row.status, value: row.value, _references: row.references, requests: [] };
};

const getChildResources = (state, type, id, childType) => {
  const { status, value, _references: references, requests: parentRequests } = getResource(state, type, id);
  // resource isn't ready; request the children (and resource itself, if applicable)
  if (!value) {
    return { status: status.loading, value: null, requests: [...parentRequests, { type, id, childType }] };
  }

  const childResourceType = resourceConfig[type].refernces[childType];
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);

  const childIDsRequest = references[childType];
  // resource is present but its children are missing; request all of its children
  if (!childIDsRequest || !childIDsRequest.ids) {
    return { status: status.loading, value: null, requests: [{ type, id, childType }] };
  }

  // collect all of the associated children from the child resource table
  const resultValues = [];
  const childIDsToRequest = [];
  for (const childID of childIDsRequest.ids) {
    const { value: childValue } = getResource(state, childResourceType, childID);
    if (value) {
      resultValues.push(value);
    } else {
      childIDsToRequest.push(childID);
    }
  }

  // some children are missing/expired; request them in a single batch
  if (childIDsToRequest.length > 0) {
    return { status: status.loading, value: resultValues, requests: [{ type: childResourceType, ids: childIDsToRequest }] };
  }
  return { status: status.ready, value: resultValues, requests: [] };
};

const getOrInitializeRow = (state, type, id) => {
  // create row with reference map if it doesn't exist already
  if (!state[type][id]) {
    state[type][id] = { 
      references: mapValues(resourceConfig[type].references, () => ({})) 
    }
  }
  return state[type][id]
}


// { type, values: [{ id, ...fields }] }
const storeResources = (state, { type, values }) => {
  const expires = Date.now() + DEFAULT_TTL
  for (const value of values) {
    const row = getOrInitializeRow(state, type, value.id)
    row.status = status.ready
    row.expires = expires
    row.value = value
  }
}

const storeChildResources = (state, { type, id, childType, values }) => {
  const childResourceType = resourceConfig[type].references[childType];
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);
  
  // store IDs on parent
  const row = getOrInitializeRow(state, type, id)
  
  
  
  // store children
  storeResources(state, { type: childResourceType, values })
}