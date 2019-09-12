import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { mapValues, flatMap } from 'lodash';

import { PopoverContainer } from 'Components/popover';
import { getProjectLink } from 'Models/project';
import { getUserLink } from 'Models/user';
import { getTeamLink } from 'Models/team';
import { useAlgoliaSearch } from 'State/search';
import useDebouncedValue from 'Hooks/use-debounced-value';

import TextInput from '../inputs/text-input';
import AutocompleteSearch from './autocomplete';
import styles from './search-form.styl';

const createSlice = (handlers) => {
  const actions = mapValues(handlers, (_, type) => (payload) => ({ type, payload }));
  const reducer = (state, action) => {
    if (handlers[action.type]) return handlers[action.type](state, action);
    return state;
  };
  return { actions, reducer };
};

const resultGroups = [
  { id: 'top', label: 'Top Results', getItems: (results) => [...results.starterKit, ...results.topResults] },
  { id: 'team', label: 'Teams' },
  { id: 'user', label: 'Users' },
  { id: 'project', label: 'Projects' },
  { id: 'collection', label: 'Collections' },
];

const MAX_RESULTS_PER_TYPE = 3;

const formatResults = (results) => {
  const notTopResult = (result) => !results.topResults.includes(result);
  const getItemsFor = (group) => {
    if (group.getItems) return group.getItems(results);
    if (!results[group.id]) return [];
    return results[group.id].filter(notTopResult).slice(0, MAX_RESULTS_PER_TYPE);
  };
  return resultGroups.map((group) => ({ ...group, items: getItemsFor(group) })).filter((group) => group.items.length > 0);
};

const resultsWithSelection = (results, selectedResult) => {
  if (!selectedResult) return results;
  return results.map((group) => ({
    ...group,
    items: group.items.map((item) => (item === selectedResult ? { ...item, selected: true } : item)),
  }));
};

const urlForItem = {
  starterKit: (starterKit) => starterKit.url,
  team: getTeamLink,
  user: getUserLink,
  project: getProjectLink,
  collection: (collection) => `/@${collection.fullUrl}`,
  seeAllResults: (_, query) => `/search?q=${query}`,
};

const seeAllResultsSelected = { type: 'seeAllResults' };

function getOffsetSelectedResult({ results, selectedResult }, offset) {
  const flatResults = flatMap(results, ({ items }) => items);
  if (!selectedResult && offset < 0) {
    return seeAllResultsSelected;
  }
  if (selectedResult === seeAllResultsSelected && offset < 0) {
    return flatResults[flatResults.length + offset];
  }
  if ((!selectedResult || selectedResult === seeAllResultsSelected) && offset > 0) {
    return flatResults[offset - 1];
  }

  const nextIndex = flatResults.indexOf(selectedResult) + offset;
  return flatResults[nextIndex] || seeAllResultsSelected;
}

const { actions, reducer } = createSlice({
  queryChanged: (state, { payload }) => ({
    ...state,
    query: payload,
  }),
  resultsChanged: (state, { payload }) => ({
    ...state,
    selectedResult: null,
    results: formatResults(payload),
  }),
  arrowUp: (state) => ({
    ...state,
    selectedResult: getOffsetSelectedResult(state, -1),
  }),
  arrowDown: (state) => ({
    ...state,
    selectedResult: getOffsetSelectedResult(state, 1),
  }),
});

const AlgoliaSearchController = withRouter(({ history, visible, openPopover, defaultValue }) => {
  const initialState = {
    selectedResult: null,
    query: defaultValue,
    results: [],
  };
  const [{ query, results, selectedResult }, dispatch] = useReducer(reducer, initialState);
  const debouncedQuery = useDebouncedValue(query, 500);
  const algoliaResults = useAlgoliaSearch(debouncedQuery);

  useEffect(
    () => {
      // use last complete results
      if (algoliaResults.status === 'ready') {
        dispatch(actions.resultsChanged(algoliaResults));
      }
    },
    [algoliaResults],
  );

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      dispatch(actions.arrowUp());
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      dispatch(actions.arrowDown());
    }
  };
  const onSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    if (selectedResult) {
      history.push(urlForItem[selectedResult.type](selectedResult, query));
    } else {
      history.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const onChange = (value) => dispatch(actions.queryChanged(value));

  return (
    <form className={styles.container} role="search" onSubmit={onSubmit} autoComplete="off" autoCapitalize="off" action="/search" method="get">
      <TextInput
        labelText="Search Glitch"
        name="q"
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={openPopover}
        opaque
        placeholder="bots, apps, users"
        type="search"
        value={query}
      />
      {query && visible && (
        <div className={styles.popOver}>
          <AutocompleteSearch
            query={query}
            results={resultsWithSelection(results, selectedResult)}
            seeAllResultsSelected={selectedResult === seeAllResultsSelected}
          />
        </div>
      )}
    </form>
  );
});

function SearchForm({ defaultValue }) {
  return (
    <PopoverContainer>
      {({ visible, openPopover }) => <AlgoliaSearchController visible={visible} openPopover={openPopover} defaultValue={defaultValue} />}
    </PopoverContainer>
  );
}

SearchForm.propTypes = {
  defaultValue: PropTypes.string,
};
SearchForm.defaultProps = {
  defaultValue: '',
};

export default SearchForm;
