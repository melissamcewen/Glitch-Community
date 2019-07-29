import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Emoji from 'Components/images/emoji';

import styles from './password-strength.styl';

const PasswordStrength = ({ strength }) => {
  const labels = {
    0: <React.Fragment><Emoji name="faceExpressionless" /> weak</React.Fragment>,
    1: <React.Fragment><Emoji name="faceSlightlySmiling" /> okay</React.Fragment>,
    2: <React.Fragment><Emoji name="faceSlightlySmiling" /> okay</React.Fragment>,
    3: <React.Fragment><Emoji name="bicep" /> strong</React.Fragment>,
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
