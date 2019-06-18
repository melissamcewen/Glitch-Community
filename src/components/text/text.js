import React from 'react';
import PropTypes from 'prop-types';
import styles from './text.styl';

/**
 * Text Component
 */
const Text = ({ children, defaultMargin }) => <p className={styles.p}>{children}</p>;

Text.propTypes = {
  /** element(s) to display in the tag */
  children: PropTypes.node.isRequired,
};

export default Text;
