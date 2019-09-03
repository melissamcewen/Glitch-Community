import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { cloneDeep, sumBy } from 'lodash';
import sampleAnalytics, { sampleAnalyticsTime } from 'Curated/sample-analytics';
import { Loader } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import SegmentedButtons from 'Components/buttons/segmented-buttons';
import { createAPIHook } from 'State/api';
import { captureException } from 'Utils/sentry';

import TeamAnalyticsTimePop from './team-analytics-time-pop';
import TeamAnalyticsProjectPop from './team-analytics-project-pop';
import SummaryItem from './team-analytics-summary';
import TeamAnalyticsActivity from './team-analytics-activity';
import Referrers from './team-analytics-referrers';
import TeamAnalyticsProjectDetails from './team-analytics-project-details';

import styles from './styles.styl';

const dateFromTime = (newTime) => {
  const timeMap = {
    'Last 4 Weeks': dayjs()
      .subtract(4, 'weeks')
      .valueOf(),
    'Last 2 Weeks': dayjs()
      .subtract(2, 'weeks')
      .valueOf(),
    'Last 24 Hours': dayjs()
      .subtract(24, 'hours')
      .valueOf(),
  };
  return timeMap[newTime];
};

function getSampleAnalytics() {
  const data = cloneDeep(sampleAnalytics);
  // Update timestamps so they're relative to now
  data.buckets.forEach((bucket) => {
    bucket['@timestamp'] += Date.now() - sampleAnalyticsTime;
  });
  return data;
}

const useAnalyticsData = createAPIHook(async (api, { id, projects, fromDate, currentProjectDomain }) => {
  if (!projects.length) return getSampleAnalytics();

  const path = currentProjectDomain ? `analytics/${id}/project/${currentProjectDomain}?from=${fromDate}` : `analytics/${id}/team?from=${fromDate}`;
  try {
    const { data } = await api.get(path);
    return data;
  } catch (e) {
    captureException(e);
    return null;
  }
});

function useAnalytics(props) {
  // make an object with a stable identity so it can be used as single argumnent to api hook
  const memoProps = useMemo(() => props, Object.values(props));
  return useAnalyticsData(memoProps);
}

function TeamAnalytics({ id, projects }) {
  const [activeFilter, setActiveFilter] = useState('views');

  const [currentTimeFrame, setCurrentTimeFrame] = useState('Last 2 Weeks');
  const fromDate = useMemo(() => dateFromTime(currentTimeFrame), [currentTimeFrame]);

  const [currentProjectDomain, setCurrentProjectDomain] = useState(''); // empty string means all projects

  const { value: analytics } = useAnalytics({ id, projects, fromDate, currentProjectDomain });

  const buckets = analytics ? analytics.buckets : [];
  const { totalAppViews, totalRemixes } = useMemo(
    () => ({
      totalAppViews: sumBy(buckets, (bucket) => bucket.analytics.visits),
      totalRemixes: sumBy(buckets, (bucket) => bucket.analytics.remixes),
    }),
    [buckets],
  );

  // segmented button filters
  const buttons = [{ name: 'views', contents: 'App Views' }, { name: 'remixes', contents: 'Remixes' }];

  if (!analytics) {
    return (
      <section className={styles.container}>
        <Loader style={{ width: '25px' }} />
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h2>
        Analytics
        {projects.length === 0 && <aside className={styles.inlineBanner}>Add projects to see their stats</aside>}
      </h2>

      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.segmentedButtonsWrap}>
            <SegmentedButtons value={activeFilter} buttons={buttons} onChange={setActiveFilter} />
          </div>
          <div className={styles.options}>
            <TeamAnalyticsProjectPop updateProjectDomain={setCurrentProjectDomain} currentProjectDomain={currentProjectDomain} projects={projects} />
            <TeamAnalyticsTimePop updateTimeFrame={setCurrentTimeFrame} currentTimeFrame={currentTimeFrame} />
          </div>
        </section>
      )}

      <div className={styles.content}>
        <section className={styles.section}>
          {activeFilter === 'views' && <SummaryItem total={totalAppViews} type="requests" label="App Views" />}
          {activeFilter === 'remixes' && <SummaryItem total={totalRemixes} type="remixes" label="Remixes" />}
        </section>

        <section className={styles.section}>
          <figure id="chart" className="c3" />
          <TeamAnalyticsActivity activeFilter={activeFilter} analytics={analytics} currentTimeFrame={currentTimeFrame} />
        </section>

        <section className={styles.section}>
          <h3>Referrers</h3>
          {activeFilter === 'views' && <Referrers name="requests" total={totalAppViews} referrers={analytics.referrers} label="views" />}
          {activeFilter === 'remixes' && <Referrers name="remixes" total={totalRemixes} referrers={analytics.remixReferrers} label="remixes" />}
        </section>

        {currentProjectDomain && (
          <section className={styles.section}>
            <h3>Project Details</h3>
            <TeamAnalyticsProjectDetails currentProjectDomain={currentProjectDomain} id={id} activeFilter={activeFilter} />
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.explanation}>
            <Text>
              Because Glitch doesn't inject code or cookies into your projects, we don't collect the data required for unique app views.
              You can get uniques by adding Google Analytics to your project.
            </Text>
          </div>
        </section>
      </div>

      {!projects.length && <div className={styles.placeholderMask} />}
    </section>
  );
}

TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  projects: PropTypes.array.isRequired,
};

export default (props) => {
  if (!props.currentUserIsOnTeam) return null;
  return <TeamAnalytics {...props} />;
};
