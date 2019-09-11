/* eslint-disable no-underscore-dangle */
import { mapValues, debounce, chunk, isEqual } from 'lodash';
import { createSlice } from 'redux-starter-kit';
import { useSelector, useDispatch } from 'react-redux';

import { getAllPages } from 'Shared/api';

const DEFAULT_TTL = 1000 * 60 * 5; // 5 minutes

const SLICE = 'resources';

const status = {
  loading: 'loading',
  ready: 'ready',
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
        [referenceType]: {
          status: 'loading' | 'ready',
          expires,
          ids: [referenceID]
        }
      }
    }
  },
  _requestQueue: [request],
  _responseQueue: [response],
}
*/

export default function createResourceManager({ resourceConfig, getAuthenticatedAPI }) {
  const getReferenceResourceType = (type, referenceType) => {
    const referenceResourceType = resourceConfig[type].references[referenceType];
    if (!referenceResourceType) throw new Error(`Unknown reference type "${referenceType}"`);
    return referenceResourceType;
  };

  // check if row data is present, but stale, and doesn't yet have a request pending
  const rowNeedsRefresh = (row) => row && row.status === status.ready && row.expires < Date.now();

  /*
    getResource gets the cached resource or resources + any requests that we need to make.
    returns {
      status: 'loading' | 'ready'
      value,
      requests: [{ type, ids: [id] } | { type, id, referenceType }],
    }
  */

  const getBaseResource = (state, type, id) => {
    const row = state[type][id];
    // resource is missing; request the resource
    if (!row) {
      return { status: status.loading, value: null, requests: [{ type, ids: [id] }] };
    }
    // resource is stale; return it but also create a new request
    if (rowNeedsRefresh(row)) {
      return { status: status.loading, value: row.value, requests: [{ type, ids: [id] }] };
    }

    return { status: row.status, value: row.value, requests: [] };
  };

  const getReferencedResources = (state, type, id, referenceType) => {
    const referenceResourceType = getReferenceResourceType(type, referenceType);

    const parentRow = state[type][id];
    // resource isn't present; request it + its children
    if (!parentRow) {
      return { status: status.loading, value: null, requests: [{ type, ids: [id] }, { type, id, referenceType }] };
    }

    const referencesRow = parentRow.references[referenceType];
    // resource is present but its children are missing; request all of its children
    if (!referencesRow) {
      return { status: status.loading, value: null, requests: [{ type, id, referenceType }] };
    }

    // child IDs request is stale; use IDs but also create a new request
    let refreshReferences = rowNeedsRefresh(referencesRow);

    // collect all of the associated children from the child resource table
    const referencedResources = (referencesRow.ids || []).map((referenceID) => getBaseResource(state, referenceResourceType, referenceID));

    // if _any_ children have pending requests, just reload the whole batch
    if (referencedResources.some((resource) => resource.requests.length)) {
      refreshReferences = true;
    }

    // return any available children
    const resultValues = referencedResources.map((resource) => resource.value).filter(Boolean);

    return { status: status.ready, value: resultValues, requests: refreshReferences ? [{ type, id, referenceType }] : [] };
  };

  const getResource = (state, type, id, referenceType) => {
    if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);

    // Handle resources with optional references (e.g. collection -> user)
    if (id === -1 || id === null || id === 'nullMyStuff') {
      return { status: status.ready, value: null, requests: [] };
    }

    if (referenceType) return getReferencedResources(state, type, id, referenceType);
    return getBaseResource(state, type, id);
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

  const getOrInitializeRowReferences = (state, type, id, referenceType) => {
    const row = getOrInitializeRow(state, type, id);
    if (!row.references[referenceType]) {
      row.references[referenceType] = { ids: [] };
    }
    return row.references[referenceType];
  };

  const storePendingRequest = (state, { type, ids }) => {
    for (const id of ids) {
      const row = getOrInitializeRow(state, type, id);
      row.status = status.loading;
    }
  };

  const storePendingChildRequest = (state, { type, id, referenceType }) => {
    const rowChild = getOrInitializeRowReferences(state, type, id, referenceType);
    rowChild.status = status.loading;
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

  const storeChildResources = (state, { type, id, referenceType, values }) => {
    // store IDs on parent
    const rowChild = getOrInitializeRowReferences(state, type, id, referenceType);
    rowChild.status = status.ready;
    rowChild.expires = Date.now() + DEFAULT_TTL;
    rowChild.ids = values.map((value) => value.id);

    // store children
    const referenceResourceType = getReferenceResourceType(type, referenceType);
    storeResources(state, { type: referenceResourceType, values });
  };

  const handleRequest = async (api, { type, referenceType, id, ids }) => {
    if (referenceType) {
      const referenceResourceType = getReferenceResourceType(type, referenceType);
      const order = resourceConfig[referenceResourceType].orderBy;
      const url = `/v1/${type}/by/id/${referenceType}?id=${id}&limit=100${order ? `&orderKey=${order}&orderDirection=ASC` : ''}`;

      const values = await getAllPages(api, url);
      return { type, id, referenceType, values };
    }

    const idString = ids.map((itemId) => `id=${itemId}`).join('&');
    const { data } = await api.get(`/v1/${type}/by/id?${idString}`);
    return { type, values: Object.values(data) };
  };

  const batchAndDedupeRequests = (requests) => {
    const combined = {};

    // dedupe
    for (const req of requests) {
      const hash = `${req.type} ${req.id || ''} ${req.referenceType || ''}`;
      // consolidate multiple requests for a single resource type
      if (combined[hash] && combined[hash].ids) {
        combined[hash] = {
          ...combined[hash],
          ids: combined[hash].ids.concat(req.ids),
        };
      } else {
        combined[hash] = req;
      }
    }

    // batch
    const out = [];
    for (const item of Object.values(combined)) {
      if (item.ids) {
        chunk(item.ids, 100).forEach((idChunk) => {
          out.push({ ...item, ids: idChunk });
        });
      } else {
        out.push(item);
      }
    }

    return out;
  };

  const { reducer, actions } = createSlice({
    slice: SLICE,
    initialState: {
      ...mapValues(resourceConfig, () => ({})),
      _requestQueue: [],
      _responseQueue: [],
    },
    reducers: {
      // loading
      requestedResources: (state, { payload: requests }) => {
        for (const request of requests) {
          if (request.referenceType) {
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
        state._responseQueue.push(response);
      },
      flushedResponseQueue: (state) => {
        for (const response of state._responseQueue) {
          if (response.referenceType) {
            storeChildResources(state, response);
          } else {
            storeResources(state, response);
          }
        }
        state._responseQueue = [];
      },
    },
  });

  const handlers = {
    [actions.requestedResources]: debounce((_, store) => {
      const requests = store.getState().resources._requestQueue;
      store.dispatch(actions.flushedRequestQueue());
      const api = getAuthenticatedAPI(store.getState());
      batchAndDedupeRequests(requests).forEach(async (request) => {
        const response = await handleRequest(api, request);
        store.dispatch(actions.receivedResources(response));
      });
    }, 1000),
    [actions.receivedResources]: debounce((_, store) => {
      store.dispatch(actions.flushedResponseQueue());
    }, 1000),
  };

  // TODO: use this for error handling?
  function expireChildResources(state, type, id, referenceType) {
    const row = getOrInitializeRow(state, type, id);
    if (row.references[referenceType]) {
      row.references[referenceType].expires = 0;
    }
  }

  const changeRelation = (state, { type: leftType, id: leftID }, { type: rightType, id: rightID }, changeFn) => {
    const { ids: rightIDs } = getOrInitializeRowReferences(state, leftType, leftID, rightType);
    const { ids: leftIDs } = getOrInitializeRowReferences(state, rightType, rightID, leftType);
    changeFn(leftIDs, leftID);
    changeFn(rightIDs, rightID);
  };

  const useResource = (type, id, referenceType) => {
    // TODO: figure out best balance between cost of `isEqual` vs cost of wasted renders here
    const result = useSelector((state) => getResource(state[SLICE], type, id, referenceType), isEqual);
    const dispatch = useDispatch();

    if (result.requests.length) {
      dispatch(actions.requestedResources(result.requests));
    }
    return result;
  };

  return { useResource, getResource, changeRelation, expireChildResources, reducer, actions, handlers };
}

/*
  combine multiple results into a single result that's ready when all inputs are ready
  (like Promise.all or allByKeys).
  Can take an object or an array.
*/
export const allReady = (reqs) => ({
  status: Object.values(reqs).every((req) => req.status === status.ready) ? status.ready : status.loading,
  value: Array.isArray(reqs) ? reqs.map((req) => req.value) : mapValues(reqs, (req) => req.value),
});
