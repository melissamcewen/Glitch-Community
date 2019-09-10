import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import styles from './password-strength.styl';
import { emoji } from '../global.styl';

const PasswordStrength = ({ strength }) => {
  const labels = {
    0: <><Icon className={emoji} icon="faceExpressionless" /> weak</>,
    1: <><Icon className={emoji} icon="faceSlightlySmiling" /> okay</>,
    2: <><Icon className={emoji} icon="faceSlightlySmiling" /> okay</>,
    3: <><Icon className={emoji} icon="bicep" /> strong</>,
  };
  return (
    <div className={styles.container}>
      <progress value={Math.max(strength, 1)} max="3" className={classNames(styles.meter, styles[`score${strength}`])} />
      <span className={styles.word}>
        {labels[strength]}
      </span>
    </div>
  );
};

PasswordStrength.propTypes = {
  strength: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
};

export default PasswordStrength;
