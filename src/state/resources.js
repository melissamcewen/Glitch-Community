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
          expires,
          ids: [childID]
        }
      } 
    } 
  } 
}
*/

const initialState = mapValues(resourceConfig, () => ({}));

const hasExpired = (row) => 

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
  
  return { status: row.status, value: row.value, requests: [] };
};

const getChildResources = (state, type, id, childType) => {
  if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);
  const childResourceType = resourceConfig[type].refernces[childType];
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);
  
  const parentRow = state[type][id]
  // resource isn't present or list of child IDs are expired; request the children
  if (!parentRow) {
    return { status: status.loading, value: null, requests: [{ type, id, childType }] };
  }

  const childIDsRequest = parentRow.references[childType];
  // resource is present but its children are missing or expired; request all of its children
  if (!childIDsRequest || childIDsRequest.expires < Date.now()) {
    return { status: status.loading, value: null, requests: [{ type, id, childType }] };
  }
  // child IDs request is pending; no request needed but no results yet
  if (childIDsRequest.status === status.loading) {
    return { status: status.loading, value: null, requests: [] }
  }

  // collect all of the associated children from the child resource table
  const resultValues = [];
  const childIDsToRequest = [];
  for (const childID of childIDsRequest.ids) {
    const { value: childValue } = getResource(state, childResourceType, childID);
    if (childValue) {
      resultValues.push(childValue);
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


const storePendingRequests = (state, { type, ids }) => {
  for (const id of ids) {
    const row = getOrInitializeRow(state, type, id)
    row.status = status.loading
    row.expires = null
  }  
}

const storePendingChildRequests = (state, { type, id, childType }) => {
  
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
  row.references[childType] = { status: status.ready, ids: values.map(value => value.id) }
  
  // store children
  storeResources(state, { type: childResourceType, values })
}