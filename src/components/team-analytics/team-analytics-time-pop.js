import React from 'react';
import PropTypes from 'prop-types';
import { PopoverWithButton, PopoverDialog, PopoverSection } from 'Components/popover';
import ResultsList, { ResultItem, ResultInfo } from 'Components/containers/results-list';

const timeFrames = ['Last 4 Weeks', 'Last 2 Weeks', 'Last 24 Hours'].map((id) => ({ id }));

const TeamAnalyticsTimePop = ({ currentTimeFrame, updateTimeFrame }) => (
  <PopoverDialog align="left">
    <PopoverSection>
      <ResultsList items={timeFrames}>
        {({ id: timeFrame }) => (
          <ResultItem onClick={() => updateTimeFrame(timeFrame)} active={currentTimeFrame === timeFrame}>
            <ResultInfo>{timeFrame}</ResultInfo>
          </ResultItem>
        )}
      </ResultsList>
    </PopoverSection>
  </PopoverDialog>
);

const TeamAnalyticsTimePopButton = ({ updateTimeFrame, currentTimeFrame }) => (
  <PopoverWithButton
    buttonProps={{ size: 'small', type: 'tertiary' }}
    buttonText={
      <React.Fragment>
        {currentTimeFrame} <div className="down-arrow" aria-label="options" />
      </React.Fragment>
    }
  >
    {({ toggleAndCall }) => <TeamAnalyticsTimePop updateTimeFrame={toggleAndCall(updateTimeFrame)} currentTimeFrame={currentTimeFrame} />}
  </PopoverWithButton>
);

TeamAnalyticsTimePopButton.propTypes = {
  updateTimeFrame: PropTypes.func.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsTimePopButton;
