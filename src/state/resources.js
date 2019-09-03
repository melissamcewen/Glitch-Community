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

const getResourceRow = (state, type, id) => state[type][id]
const getResourceValue = (state, type, id) => 


const getChildResources = (state, type, id, childType) => {
  const row = state[type]
}

function createResourceState (config) {
  const initialState = {}
  for (const [key, { references }] of Object.values(config)) {
    initialState[key] = { values: {}, references: {} }
    initialState.references[]
  }
}