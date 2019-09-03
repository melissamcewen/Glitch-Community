import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@fogcreek/shared-components';

import Emoji from 'Components/images/emoji';
import TextInput from 'Components/inputs/text-input';
import ResultsList from 'Components/containers/results-list';
import { PopoverActions, PopoverInfo, PopoverSection, InfoDescription } from './base';

function useActiveIndex(items, onSelect) {
  const inputRef = useRef();
  const [activeIndex, setActiveIndex] = useState(-1);

  // reset activeIndex & focus when items change
  useEffect(() => {
    setActiveIndex(-1);
    inputRef.current.focus();
  }, [items]);

  // focus input when there's no active index
  useEffect(() => {
    if (activeIndex === -1) {
      inputRef.current.focus();
    }
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev < 0) {
            return items.length - 1;
          }
          return prev - 1;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => {
          if (prev === items.length - 1) {
            return -1;
          }
          return prev + 1;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[activeIndex]) {
          onSelect(items[activeIndex]);
        }
      }
    };

    // TODO: should these be bound to a container instead of the window?
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [items, activeIndex]);

  return { inputRef, activeIndex };
}

const PopoverLoader = () => (
  <PopoverActions>
    <Loader style={{ width: '25px' }} />
  </PopoverActions>
);

const NothingFound = () => (
  <PopoverActions>
    <InfoDescription>
      Nothing found <Emoji name="sparkles" />
    </InfoDescription>
  </PopoverActions>
);

function PopoverSearch({
  value,
  onChange,
  results,
  status,
  onSubmit,
  renderItem,
  renderNoResults,
  renderMessage,
  renderLoader,
  renderError,
  labelText,
  placeholder,
}) {
  const message = renderMessage();

  const { inputRef, activeIndex } = useActiveIndex(results, onSubmit);
  return (
    <>
      <PopoverInfo>
        <TextInput
          ref={inputRef}
          autoFocus
          labelText={labelText}
          value={value}
          onChange={onChange}
          opaque
          placeholder={placeholder}
          type="search"
        />
      </PopoverInfo>
      {results.length > 0 && (
        <PopoverSection>
          <ResultsList scroll items={results}>
            {(item, i) => renderItem({ item, onSubmit, active: i === activeIndex })}
          </ResultsList>
          {message}
        </PopoverSection>
      )}
      {status === 'loading' && value.length > 0 && results.length === 0 && renderLoader()}
      {status === 'ready' && value.length > 0 && results.length === 0 && renderNoResults()}
      {status === 'error' && renderError()}
    </>
  );
}

PopoverSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  status: PropTypes.oneOf(['init', 'loading', 'ready', 'error']).isRequired,
  onSubmit: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  renderNoResults: PropTypes.func,
  renderMessage: PropTypes.func,
  renderLoader: PropTypes.func,
  renderError: PropTypes.func,
  labelText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

PopoverSearch.defaultProps = {
  renderLoader: () => <PopoverLoader />,
  renderNoResults: () => <NothingFound />,
  renderMessage: () => null,
  renderError: () => null,
  placeholder: null,
};

export default PopoverSearch;
