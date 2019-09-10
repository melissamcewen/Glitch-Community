/* eslint-disable no-underscore-dangle */

// API _without_ caching, since caching is handled by redux
export const getAPIForToken = memoize((persistentToken) => {
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

export default function createResourceManager() {
  // utilities

  //
  const getChildResourceType = (type, childType) => {
    const childResourceType = resourceConfig[type].references[childType];
    if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`);
    return childResourceType;
  };

  // check if row data is present, but stale, and doesn't yet have a request pending
  const rowNeedsRefresh = (row) => row && row.status === status.ready && row.expires < Date.now();

  /*
getResource gets the cached resource or resources + any requests that we need to make.
returns {
  status: 'loading' | 'ready'
  value,
  requests: [{ type, ids: [id] } | { type, id, childType }],
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

  const getChildResources = (state, type, id, childType) => {
    const childResourceType = getChildResourceType(type, childType);

    const parentRow = state[type][id];
    // resource isn't present; request it + its children
    if (!parentRow) {
      return { status: status.loading, value: null, requests: [{ type, ids: [id] }, { type, id, childType }] };
    }

    const childRow = parentRow.references[childType];
    // resource is present but its children are missing; request all of its children
    if (!childRow) {
      return { status: status.loading, value: null, requests: [{ type, id, childType }] };
    }

    // child IDs request is stale; use IDs but also create a new request
    let refreshChildren = rowNeedsRefresh(childRow);

    // collect all of the associated children from the child resource table
    const childResources = (childRow.ids || []).map((childID) => getBaseResource(state, childResourceType, childID));

    // if _any_ children have pending requests, just reload the whole batch
    if (childResources.some((resource) => resource.requests.length)) {
      refreshChildren = true;
    }

    // return any available children
    const resultValues = childResources.map((resource) => resource.value).filter(Boolean);

    return { status: status.ready, value: resultValues, requests: refreshChildren ? [{ type, id, childType }] : [] };
  };

  const getResource = (state, type, id, childType) => {
    if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);

    // Handle resources with optional references (e.g. collection -> user)
    if (id === -1 || id === null || id === 'nullMyStuff') {
      return { status: status.ready, value: null, requests: [] };
    }

    if (childType) return getChildResources(state, type, id, childType);
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

  const getOrInitializeRowChild = (state, type, id, childType) => {
    const row = getOrInitializeRow(state, type, id);
    if (!row.references[childType]) {
      row.references[childType] = { ids: [] };
    }
    return row.references[childType];
  };

  const storePendingRequest = (state, { type, ids }) => {
    for (const id of ids) {
      const row = getOrInitializeRow(state, type, id);
      row.status = status.loading;
    }
  };

  const storePendingChildRequest = (state, { type, id, childType }) => {
    const rowChild = getOrInitializeRowChild(state, type, id, childType);
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

  const storeChildResources = (state, { type, id, childType, values }) => {
    // store IDs on parent
    const rowChild = getOrInitializeRowChild(state, type, id, childType);
    rowChild.status = status.ready;
    rowChild.expires = Date.now() + DEFAULT_TTL;
    rowChild.ids = values.map((value) => value.id);

    // store children
    const childResourceType = getChildResourceType(type, childType);
    storeResources(state, { type: childResourceType, values });
  };

  // TODO: use this for error handling?
  // function expireChildResources(state, type, id, childType) {
  //   const row = getOrInitializeRow(state, type, id);
  //   if (row.references[childType]) {
  //     row.references[childType].expires = 0;
  //   }
  // }

  const unshift = (list, value) => {
    if (!list.includes(value)) list.unshift(value);
  };

  const push = (list, value) => {
    if (!list.includes(value)) list.push(value);
  };

  const remove = (list, value) => {
    if (list.includes(value)) list.splice(list.indexOf(value), 1);
  };

  const changeRelation = (state, { type: leftType, id: leftID }, { type: rightType, id: rightID }, changeFn) => {
    const { ids: rightIDs } = getOrInitializeRowChild(state, leftType, leftID, rightType);
    const { ids: leftIDs } = getOrInitializeRowChild(state, rightType, rightID, leftType);
    changeFn(leftIDs, leftID);
    changeFn(rightIDs, rightID);
  };

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

  const batchAndDedupeRequests = (requests) => {
    const combined = {};

    // dedupe
    for (const req of requests) {
      const hash = `${req.type} ${req.id || ''} ${req.childType || ''}`;
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
    slice: 'resources',
    initialState: {
      ...mapValues(resourceConfig, () => ({})),
      _requestQueue: [],
      _responseQueue: [],
    },
    reducers: {
      // loading
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
        state._responseQueue.push(response);
      },
      flushedResponseQueue: (state) => {
        for (const response of state._responseQueue) {
          if (response.childType) {
            storeChildResources(state, response);
          } else {
            storeResources(state, response);
          }
        }
        state._responseQueue = [];
      },
    },
  });

  return { getResource, reducer, actions };
}
