import React from 'react';
import PropTypes from 'prop-types';
import { TextArea } from '@fogcreek/shared-components';

import Markdown from '../text/markdown';

import styles from './markdown-input.styl';

const MarkdownInput = ({ allowImages, error, onBlur: outerOnBlur, onChange, placeholder, value }) => {
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = (event) => {
    setFocused(false);
    outerOnBlur(event);
  };
  if (error || focused || !value.trim()) {
    return (
      <TextArea
        autoFocus={focused}
        error={error}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        label={placeholder}
        value={value}
      />
    );
  }
  return (
    <div
      className={styles.fakeInput}
      aria-label={placeholder}
      onBlur={onBlur}
      onFocus={onFocus}
      role="textbox" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
      tabIndex={0}
    >
      <Markdown allowImages={allowImages}>{value}</Markdown>
    </div>
  );
};

MarkdownInput.propTypes = {
  allowImages: PropTypes.bool,
  error: PropTypes.node,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
};

MarkdownInput.defaultProps = {
  allowImages: true,
  error: null,
  onBlur: () => {},
  placeholder: null,
};

export default MarkdownInput;
