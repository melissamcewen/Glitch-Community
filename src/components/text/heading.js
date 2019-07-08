import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './heading.styl';

const cx = classNames.bind(styles);

export const TAGS = ['h1', 'h2', 'h3', 'h4'];

/**
 * Heading Component
 */
const Heading = ({ children, className, tagName: TagName, ariaLabel }) => {
  const headingClassNameObj = {
    heading: true,
  };

  headingClassNameObj[TagName] = true;
  return <TagName aria-label={ariaLabel} className={classNames(cx(headingClassNameObj), className)}>{children}</TagName>;
};

Heading.propTypes = {
  /** element(s) to display in the heading */
  children: PropTypes.node.isRequired,
  /** heading tag to be rendered */
  tagName: PropTypes.oneOf(TAGS).isRequired,
  ariaLabel: PropTypes.string,
};

Heading.defaultProps = {
  ariaLabel: null,
}

export default Heading;
