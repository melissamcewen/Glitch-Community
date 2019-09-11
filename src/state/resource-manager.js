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
  // lookup the resource type for a reference
  // e.g. `getReferenceResourceType('user', 'pinnedProjects') -> 'projects'`.
  const getReferenceResourceType = (type, referenceType) => {
    const referenceResourceType = resourceConfig[type].references[referenceType];
    if (!referenceResourceType) throw new Error(`Unknown reference type "${referenceType}"`);
    return referenceResourceType;
  };

  // check if row data is present, but stale, and doesn't yet have a request pending
  const rowNeedsRefresh = (row) => row && row.status === status.ready && row.expires < Date.now();

  /*
    get the cached resource or resources + any requests that we need to make.
    returns {
      status: 'loading' | 'ready',
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
    // parent resource isn't present; request it + its references
    if (!parentRow) {
      return { status: status.loading, value: null, requests: [{ type, ids: [id] }, { type, id, referenceType }] };
    }

    const referencesRow = parentRow.references[referenceType];
    // resource is present but its references are missing; request its references
    if (!referencesRow) {
      return { status: status.loading, value: null, requests: [{ type, id, referenceType }] };
    }

    // reference request is stale; use reference IDs but also create a new request
    let refreshReferences = rowNeedsRefresh(referencesRow);

    // collect all of the referenced resources from the reference type's table
    const referencedResources = (referencesRow.ids || []).map((referenceID) => getBaseResource(state, referenceResourceType, referenceID));

    // if _any_ referenced resources have pending requests, just reload the whole batch
    if (referencedResources.some((resource) => resource.requests.length)) {
      refreshReferences = true;
    }

    // return any available referenced resources
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
  

  /*
  Lookup a resource or a set of references, or create an empty data structure, 
  so it can be updated in the cache.
  */
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

  /*
  Update the cache to reflect that resources are being loaded. 
  */
  const storePendingRequest = (state, { type, ids, id, refrenceType }) => {
    // handle references request
    if (referenceType) {
      const rowReferences = getOrInitializeRowReferences(state, type, id, referenceType);
      rowReferences.status = status.loading;
    // handle base request
    } else {
      for (const id of ids) {
        const row = getOrInitializeRow(state, type, id);
        row.status = status.loading;
      }
    }
  };
  
  /*
  Update the cache with values returned from the API.
  */
  const storeBaseResources = (state, { type, idvalues }) => {
    const expires = Date.now() + DEFAULT_TTL;
    for (const value of values) {
      const row = getOrInitializeRow(state, type, value.id);
      row.status = status.ready;
      row.expires = expires;
      row.value = value;
    }
  };

  const storeReferenceResources = (state, { type, id, referenceType, values }) => {
    // store reference IDs
    const rowReferences = getOrInitializeRowReferences(state, type, id, referenceType);
    rowReferences.status = status.ready;
    rowReferences.expires = Date.now() + DEFAULT_TTL;
    rowReferences.ids = values.map((value) => value.id);

    // store resources
    const referenceResourceType = getReferenceResourceType(type, referenceType);
    storeBaseResources(state, { type: referenceResourceType, values });
  };
  
  const storeResources = (state, response) => {
    if (response.referenceType) {
      storeReferenceResources(state, response)
    } else {
      storeBaseResources(state, response)
    }
  }

  /* 
  Process a request for the API and return a formatted response.
  */
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

  /*
  combine all pending requests into their most efficient form:
  - remove duplicates
  - consolidate multiple requests for a single resource into one request
  - split single requests into batches if there are too many items to process at once
  */
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
          storePendingRequest(state, request);
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
          storeResources(state, response);
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

  /*
  Mark a resource or set of references as expired.
  These will remain in the cache, but will be fetched fresh from the API on the next request.
  This may be useful for 
  */
  // TODO: use this for error handling?
  function expireResource(state, type, id, referenceType) {
    const row = getOrInitializeRow(state, type, id);
    
    if (referenceType) {
      row.references[referenceType].expires = 0;
    } else {
      row.expires = 0;
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

  return { useResource, getResource, changeRelation, expireResource, reducer, actions, handlers };
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
