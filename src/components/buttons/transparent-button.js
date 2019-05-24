import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './button.styl';

/**
Transparent buttons are useful for making a whole container clickable, without breaking accessibility.
This should be used for containers that have descriptive text contents, not icon buttons.
*/

const TransparentButton = ({ label, children, onClick, className }) => (
  <button type="button" onClick={onClick} className={classnames(styles.transparentButton, className)} aria-label={label}>
    {children}
  </button>
);

TransparentButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
};

TransparentButton.defaultProps = {
  className: '',
  label: null,
};

export default TransparentButton;
