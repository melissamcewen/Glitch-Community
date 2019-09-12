import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@fogcreek/shared-components';

import styles from './thanks.styl';
import { emoji } from '../global.styl';

const thanksText = (count) => {
  if (count === 1) {
    return 'Thanked once';
  }
  if (count === 2) {
    return 'Thanked twice';
  }
  return `Thanked ${count} times`;
};

const ThanksLong = ({ count }) => (
  <p className={styles.container}>
    {thanksText(count)}
    &nbsp;
    <Icon className={emoji} icon="sparklingHeart" />
  </p>
);

const ThanksShort = ({ count }) => (
  <p className={styles.container}>
    <Icon className={emoji} icon="sparklingHeart" />
    &nbsp;
    {count}
  </p>
);

const Thanks = ({ count, short }) => {
  if (count <= 0) return null;
  if (short) return <ThanksShort count={count} />;
  return <ThanksLong count={count} />;
};

Thanks.propTypes = {
  count: PropTypes.number.isRequired,
  short: PropTypes.bool,
};

Thanks.defaultProps = {
  short: false,
};

export default Thanks;
