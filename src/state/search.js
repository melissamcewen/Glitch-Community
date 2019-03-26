/* eslint-disable prefer-default-export */
import algoliasearch from 'algoliasearch/lite';
import { useState, useEffect } from 'react';

const searchClient = algoliasearch('LAS7VGSQIQ', '27938e7e8e998224b9e1c3f61dd19160');

const searchIndex = searchClient.initIndex('search');

// TODO: all this really ought to be in the raw data
function formatUser (hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    thanksCount: hit.thanks,
    hasCoverImage: false,
    ...hit,
  }
}

function formatTeam (hit) {
  return {
    id: Number(hit.objectID.split('-')[1]),
    hasCoverImage: false,
    hasAvatarImage: false,
    isVerified: false,
    url: '',
    users: [],
    ...hit,
  }
}

function formatProject (hit) {
  return {
    id: hit.objectID.split('-')[1],
    users: [],
    showAsGlitchTeam: false,
    ...hit,
    teams: [],
  }
}

function formatHit(hit) {
  switch (hit.type) {
    case 'user':
      return formatUser(hit)
    case 'team':
      return formatTeam(hit)
    case 'project':
      return formatProject(hit)
    default:
      return hit
  }
}


export function useSearch(query) {
  const [results, setResults] = useState({ hits: [], nbHits: 0 });
  useEffect(() => {
    searchIndex.search({ query, hitsPerPage: 500 }).then((res) => setResults(res));
  }, [query]);
  console.log(results.hits)
  return {
    hits: results.hits.map(formatHit),
  };
}
