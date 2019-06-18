import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

/**
 * Text Component
 */
const Text = ({ children, className, defaultMargin }) => {
  className = cx({
    p: true,
    defaultMargin,
    {className,
  });
  
  return <p className={className}>{children}</p>;
};

Text.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
  /** use the browser-defined paragraph margins? */
  defaultMargin: PropTypes.bool,
};

Text.defaultProps = {
  defaultMargin: false,
}

export default Text;
