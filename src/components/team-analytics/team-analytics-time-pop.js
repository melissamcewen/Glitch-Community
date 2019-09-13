import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import popoverStyles from 'Components/popover/styles.styl';
import styles from './styles.styl';

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'];

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => (
  <div className={styles.timeFramePopWrap}>
    <Button as="span" size="small" variant="secondary">
      <select className={styles.timeFrameSelect} value={currentTimeFrame} onChange={(e) => updateTimeFrame(e.target.value)}>
        {timeFrames.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <span className={`${popoverStyles.downArrow} ${styles.downArrow}`} />
    </Button>
  </div>
);

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
