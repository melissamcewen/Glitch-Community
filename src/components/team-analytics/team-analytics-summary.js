import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.styl';

const depluralize = (str) => str.replace(/e?s$/, '');

const SummaryItem = ({ total, type, label }) => (
  <span className={styles.summaryItem}>
    <span className={classnames(styles.total, styles[type])}>{total.toLocaleString('en')}</span>{' '}
    <span className={styles.summaryLabel}>{total === 1 ? depluralize(label) : label}</span>
  </span>
);

SummaryItem.propTypes = {
  total: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default SummaryItem;
