/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { mapValues, memoize, debounce, chunk } from 'lodash';
import { createSlice } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

import { getAllPages } from 'Shared/api';
import { API_URL } from 'Utils/constants';

const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes
const status = {
  loading: 'loading',
  ready: 'ready',
};

const resourceConfig = {
  collections: {
    secondaryKeys: ['fullUrl'],
    references: { projects: 'projects' },
  },
  projects: {
    secondaryKeys: ['domain'],
    orderBy: 'domain',
    references: { collections: 'collections', teams: 'teams', users: 'users' },
  },
  teams: {
    secondaryKeys: ['url'],
    orderBy: 'url',
    references: {
      collections: 'collections',
      users: 'users',
      projects: 'projects',
      pinnedProjects: 'projects',
    },
  },
  users: {
    secondaryKeys: ['login'],
    orderBy: 'login',
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
      expires: timestamp,
      value: Object,
      references: {
        [childType]: {
          status: 'loading' | 'ready',
          expires,
          ids: [childID]
        }
      }
    }
  },
  _requestQueue: [request],
}
*/

const rowIsMissingOrExpired = (row) => {
  if (!row) return true;
  if (row.status === status.loading) return false;
  return row.expires < Date.now();
};

const getChildResourceType = (type, childType) => {
  const childResourceType = resourceConfig[type].references[childType];
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);
  return childResourceType;
};

/*
get the cached resource + any requests that we need to make
returns {
  status: 'loading' | 'ready'
  value,
  requests: [{ type, ids: [id] } | { type, id, childType }],
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
  // resource isn't present; request it + its children
  if (!parentRow) {
    return { status: status.loading, value: null, requests: [{ type, ids: [id] }, { type, id, childType }] };
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
      references: {},
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
    expires: Date.now() + DEFAULT_TTL,
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
  }
  return axios.create({
    baseURL: API_URL,
  });
});

const handleRequest = async (api, { type, childType, id, ids }) => {
  if (childType) {
    const childResourceType = getChildResourceType(type, childType);
    const order = resourceConfig[childResourceType].orderBy;
    const url = `/v1/${type}/by/id/${childType}?id=${id}&limit=100${order ? `&orderKey=${order}&orderDirection=ASC` : ''}`;

    const values = await getAllPages(api, url);
    return { type, id, childType, values };
  }

  const idString = ids.map((itemId) => `id=${itemId}`).join('&');
  const { data } = await api.get(`/v1/${type}/by/id?${idString}`);
  return { type, values: Object.values(data) };
};

export const { reducer, actions } = createSlice({
  slice: 'resources',
  initialState: {
    ...mapValues(resourceConfig, () => ({})),
    _requestQueue: [],
  },
  reducers: {
    requestedResources: (state, { payload: requests }) => {
      for (const request of requests) {
        if (request.childType) {
          storePendingChildRequest(state, request);
        } else {
          storePendingRequest(state, request);
        }
      }
      state._requestQueue.push(...requests);
    },
    flushedRequestQueue: (state) => {
      state._requestQueue = [];
    },
    receivedResources: (state, { payload: response }) => {
      if (response.childType) {
        storeChildResources(state, response);
      } else {
        storeResources(state, response);
      }
    },
  },
});

const batchAndDedupeRequests = (requests) => {
  const combined = {}
  
  // dedupe
  for (const req of requests) {
    const hash = `${req.type} ${req.id || ''} ${req.childType || ''}`
    // consolidate multiple requests for a single resource type
    if (combined[hash] && combined[hash].ids) {
      combined[hash] = { 
        ...combined[hash], 
        ids: combined[hash].ids.concat(req.ids),
      }
    } else {
      combined[hash] = req
    }
  }
  
  // batch
  const out = []
  for (const item of Object.values(combined)) {
    if (item.ids) {
      chunk(item.ids, 100).forEach(idChunk => {
        out.push({ ...item, ids: idChunk })
      })
    } else {
      out.push(item)
    }
  }
  
  return out
}


export const handlers = {
  [actions.requestedResources]: debounce((_, store) => {
    const requests = store.getState().resources._requestQueue;
    const token = store.getState().currentUser.persistentToken;
    store.dispatch(actions.flushedRequestQueue());
    const api = getAPIForToken(token);
    batchAndDedupeRequests(requests).forEach(async (request) => {
      const response = await handleRequest(api, request);
      store.dispatch(actions.receivedResources(response));
    });
  }, 1000),
};

export const useResource = (type, id, childType) => {
  const resourceState = useSelector((state) => state.resources);
  const dispatch = useDispatch();
  const result = childType ? getChildResources(resourceState, type, id, childType) : getResource(resourceState, type, id);

  if (result.requests.length) {
    dispatch(actions.requestedResources(result.requests));
  }
  return result;
};

/*
  combine multiple results into a single result that's ready when all inputs are ready
  (like Promise.all or allByKeys).
  Can take an object or an array.
*/
export const allReady = (reqs) => {
  if (Object.values(reqs).every(req => req.status === status.ready)) {
    return {
      status: status.ready,
      value: Array.isArray(reqs) ? reqs.map((req) => req.value) : mapValues(reqs, (req) => req.value),
    }
  }
  return { status: status.loading }
}
