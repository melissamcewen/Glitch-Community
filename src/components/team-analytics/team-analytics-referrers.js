import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sumBy } from 'lodash';
import { Progress } from '@fogcreek/shared-components';

import styles from './styles.styl';

const MAX_REFERRERS = 4;

const ReferrerItem = ({ count, total, description }) => {
  if (count <= 0) return null;

  const progress = Math.max(Math.round((count / total) * 100), 3);
  return (
    <li>
      {count.toLocaleString('en')} – {description}
      <Progress value={progress} max={100}>{progress}%</Progress>
    </li>
  );
};

const filterReferrers = (referrers) => referrers.filter((referrer) => !referrer.self).slice(0, MAX_REFERRERS);

const ReferrersColumn = ({ total, referrers, name, label }) => (
  <article className={classnames(styles.referrersColumn, styles[name])}>
    {total === 0 ? (
      'none'
    ) : (
      <ul className={styles.referrersList}>
        <ReferrerItem count={total - sumBy(referrers, (referrer) => referrer[name])} total={total} description={`direct ${label}`} />
        {filterReferrers(referrers).map((referrer) => (
          <ReferrerItem key={referrer.domain} count={referrer[name]} total={total} description={referrer.domain} />
        ))}
      </ul>
    )}
  </article>
);

ReferrersColumn.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  referrers: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

export default ReferrersColumn;
