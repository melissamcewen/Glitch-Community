import React from 'react';
import PropTypes from 'prop-types';
import styles from './hidden-checkbox.styl';

const HiddenCheckbox = ({ value, onChange, onFocus, onBlur, children }) => (
  <label className={styles.label}>
    <input className={styles.checkbox} type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} onFocus={onFocus} onBlur={onBlur} />
    {children}
  </label>
);

HiddenCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default HiddenCheckbox;
