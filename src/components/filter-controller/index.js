import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import Text from 'Components/text/text';
import { TextInput } from '@fogcreek/shared-components';

import { Aquarium } from 'Components/errors/not-found';

import styles from './styles.styl';

function FilterController({ matchFn, enabled, placeholder, items, children, searchPrompt, label }) {
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDoneFiltering, setIsDoneFiltering] = useState(false);

  const validFilter = filter.length > 1;

  function filterItems() {
    setIsDoneFiltering(false);
    if (validFilter) {
      const lowercaseFilter = filter.toLowerCase();
      setFilteredItems(items.filter((p) => matchFn.call(null, p, lowercaseFilter)));
      setIsDoneFiltering(true);
    } else {
      setFilteredItems([]);
    }
  }

  useEffect(() => filterItems(), [items]);
  useEffect(() => debounce(filterItems, 400)(), [filter]);

  const filtering = validFilter && isDoneFiltering;
  const displayedItems = filtering ? filteredItems : items;

  return children({
    filterInput: enabled && (
      <TextInput
        data-cy="items-filter"
        className={styles.headerSearch}
        name="filter"
        onChange={setFilter}
        opaque
        placeholder={searchPrompt}
        label={label}
        type="search"
        value={filter}
      />
    ),
    filterHeaderStyles: enabled ? styles.header : undefined,
    renderItems: (renderFn) => {
      if (displayedItems.length) return renderFn(displayedItems);

      if (filtering) {
        return (
          <div className={styles.filterResultsPlaceholder}>
            <Aquarium className={styles.aquarium} />
            <Text>No items found</Text>
          </div>
        );
      }
      return placeholder;
    },
  });
}

FilterController.propTypes = {
  matchFn: PropTypes.func.isRequired,
  enabled: PropTypes.bool,
  searchPrompt: PropTypes.string.isRequired,
  // label for assistive technology, e.g., "project search"
  label: PropTypes.string.isRequired,
};

FilterController.defaultProps = {
  enabled: false,
};

export default FilterController;
