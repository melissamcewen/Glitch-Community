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
      value, 
      expires, 
      references: { 
        [childType]: [id] 
      } 
    } 
  } 
}
*/

const initialState = mapValues(resourceConfig, () => ({}))

// get the cached resource + any requests that we need to make
const getResource = (state, type, id) => {
  if (!resourceConfig[type]) throw new Error(`Unknown resource type "${type}"`);

  const row = state[type][id]
  // if resource is missing or expired, request the resource 
  if (!row || row.expires < Date.now()) {
    return { value: null, row, requests: [{ type, ids: [id] }] }
  }
  return { value: row.value, row, requests: [] }
}

const getChildResources = (state, type, id, childType) => {
  const result = getResource(state, type, id)
  // if resource is missing or expired, request the resource + its children
  if (!result.value) {
    return { value: null, row: result.row, requests: [...result.requests, { type: id, childType }] }
  }
  
  const childResourceType = resourceConfig[type].refernces[childType]
  if (!childResourceType) throw new Error(`Unknown reference type "${childType}"`)
  
  const childIDs = result.row.references
  // todo
  if (!references[childType]) return null
  const 
}
