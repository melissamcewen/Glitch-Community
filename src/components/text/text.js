import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './text.styl';

const cx = classNames.bind(styles);

/**
 * Text Component
 */
const Text = ({ children, className, fontSize, defaultMargin }) => {
  const textClassName = cx({
    p: true,
    defaultMargin,
  });
  
  // classNames(styles.projectsContainer, styles.empty)
  return <p style={{ '--fontSize': fontSize }} className={`${className || ''} ${textClassName}`}>{children}</p>;
};

Text.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
  /** use the browser-defined paragraph margins? */
  defaultMargin: PropTypes.bool,
};

Text.defaultProps = {
  fontSize: 'inherit',
  defaultMargin: false,
}

export default Text;
