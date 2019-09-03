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

const getResourceRow = (state, type, id) => {
  const row = state[type][id]
  if (!row || row.expires < Date.now()) return null
  return row
}
  
const getResourceValue = (state, type, id) => {
  const row = getResourceRow(state, type, id)
  return row ? row.value : null
}

const getChildResources = (state, type, id, childType) => {
  const row = getResourceRow(state, type, id)
  if (!row) return null
    
}
