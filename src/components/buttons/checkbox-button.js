import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useUniqueId from 'Hooks/use-unique-id';

import styles from './button.styl';
import checkboxStyles from './checkbox-button.styl';

const CheckboxButton = React.forwardRef(({ children, onChange, value, matchBackground, type }, ref) => {
  const id = useUniqueId();
  const className = classNames(
    { [styles.matchBackground]: matchBackground, [styles.tertiary]: type === 'tertiary' },
    styles.btn,
    styles.small,
    checkboxStyles.label,
  );
  return (
    <label className={className} htmlFor={id}>
      <input id={id} className={checkboxStyles.input} type="checkbox" checked={value} onChange={(evt) => onChange(evt.target.checked)} ref={ref} />
      {children}
    </label>
  );
});

CheckboxButton.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  matchBackground: PropTypes.bool,
  type: PropTypes.string,
};

CheckboxButton.defaultProps = {
  matchBackground: false,
  type: null,
};

export default CheckboxButton;
