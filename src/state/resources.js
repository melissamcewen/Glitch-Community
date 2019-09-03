import axios from 'axios';
import { mapValues, memoize } from 'lodash';
import { createSlice } from 'redux-starter-kit'
import { useSelector, useDispatch } from 'react-redux'

import runLatest from 'Utils/run-latest';
import { API_URL } from 'Utils/constants';

const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes
const status = {
  loading: 'loading',
  ready: 'ready',
};

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

const { reducer, actions } = createSlice({
  slice: 'resource',
  initialState: {
    ...mapValues(resourceConfig, () => ({})),
    _lastRequestAt: 0,
    _requestQueue: [],
  },
  reducers: {
    requestedResources: (state, { payload: requests }) => {
      for (const request of requests) {
        if (request.childType) {
          storePendingChildRequest(request)
        } else {
          storePendingRequest(request)
        }
      }
      state._requestQueue.push(...requests)
    },
    flushedRequestQueue: (state) => {
      state._requestQueue = []
    },
    receivedResources: (state, { payload: response }) => {
      if (response.childType) {
        storeChildResources(response)
      } else {
        storeResources(response)
      }
    },
  }
})

const handlers = {
  requestedResources: runLatest(function* (action, store) {
    yield * sleep(1000)
    
  }),
}

const rowIsMissingOrExpired = (row) => {
  if (!row) return true;
  if (row.status === status.loading) return false;
  return row.expires < Date.now();
};

const getChildResourceType = (type, childType) => {
  const childResourceType = resourceConfig[type].refernces[childType];
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);
  return childResourceType;
};

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
  if (rowIsMissingOrExpired(row)) {
    return { status: status.loading, value: null, requests: [{ type, ids: [id] }] };
  }

  return { status: row.status, value: row.value, requests: [] };
};

const getChildResources = (state, type, id, childType) => {
  if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);
  const childResourceType = getChildResourceType(type, childType);

  const parentRow = state[type][id];
  // resource isn't present or list of child IDs are expired; request the children
  if (!parentRow) {
    return { status: status.loading, value: null, requests: [{ type, id, childType }] };
  }

  const childIDsRequest = parentRow.references[childType];
  // resource is present but its children are missing or expired; request all of its children
  if (rowIsMissingOrExpired(childIDsRequest)) {
    return { status: status.loading, value: null, requests: [{ type, id, childType }] };
  }
  // child IDs request is pending; no request needed but no results yet
  if (childIDsRequest.status === status.loading) {
    return { status: status.loading, value: null, requests: [] };
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
      references: mapValues(resourceConfig[type].references, () => ({})),
    };
  }
  return state[type][id];
};

const storePendingRequest = (state, { type, ids }) => {
  for (const id of ids) {
    const row = getOrInitializeRow(state, type, id);
    row.status = status.loading;
    row.expires = null;
    row.value = null;
  }
};

const storePendingChildRequest = (state, { type, id, childType }) => {
  const row = getOrInitializeRow(state, type, id);
  row.references[childType] = { status: status.loading, ids: [] };
};

// { type, values: [{ id, ...fields }] }
const storeResources = (state, { type, values }) => {
  const expires = Date.now() + DEFAULT_TTL;
  for (const value of values) {
    const row = getOrInitializeRow(state, type, value.id);
    row.status = status.ready;
    row.expires = expires;
    row.value = value;
  }
};

const storeChildResources = (state, { type, id, childType, values }) => {
  const childResourceType = getChildResourceType(type, childType);
  // store IDs on parent
  const row = getOrInitializeRow(state, type, id);
  row.references[childType] = {
    status: status.ready,
    expirses: Date.now() + DEFAULT_TTL,
    ids: values.map((value) => value.id),
  };

  // store children
  storeResources(state, { type: childResourceType, values });
};

// API _without_ caching, since caching is handled by redux
const getAPIForToken = memoize((persistentToken) => {
  if (persistentToken) {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: persistentToken,
      },
    });
  } else {
    return axios.create({
      baseURL: API_URL,
    });
  }
})

const useResource = (type, id, childType) => {
  const state = useSelector(state => state.resources)
  const dispatch = useDispatch()
  const { status, value, requests } = childType ? getChildResources(state, type, id, childType) : getResource(state, type, id)
  
  if (requests.length) {
    setTimeout(() => {
      dispatch(actions.requestedResources(requests))  
    }, 0)
  }
  return { status, value }
}

const sleep = (timeout) => new Promise()