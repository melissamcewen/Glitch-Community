import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

/**
 * Text Component
 */
const Text = ({ children, className, size, weight, defaultMargin }) => {
  const textClassName = cx({
    p: true,
    defaultMargin,
  });
  
  // classNames(styles.projectsContainer, styles.empty)
  // `${className || ''} ${textClassName}`
  return <p style={{ '--size': size, '--weight': weight }} className={classNames(textClassName, className)}>{children}</p>;
};

Text.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
  /** use the browser-defined paragraph margins? */
  defaultMargin: PropTypes.bool,
};

Text.defaultProps = {
  size: 'inherit',
  weight: '400',
  defaultMargin: false,
}

export default Text;
