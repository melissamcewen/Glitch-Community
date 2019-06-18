import React from 'react';
import PropTypes from 'prop-types';

import Text from 'Components/text/text';
import styles from './not-found.styl';

const compass = 'https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fcompass.svg?1545073264846';
const needle = 'https://cdn.glitch.com/bc50f686-4c0a-4e20-852f-3999b29e8092%2Fneedle.svg?1545073265096';

const NotFound = ({ name }) => (
  <section>
    <Text defaultMargin>We didn't find {name}</Text>
    <div className={styles.errorImage}>
      <img className={styles.compass} src={compass} alt="" />
      <img className={styles.needle} src={needle} alt="" />
    </div>
  </section>
);

NotFound.propTypes = {
  name: PropTypes.string.isRequired,
};

export default NotFound;
