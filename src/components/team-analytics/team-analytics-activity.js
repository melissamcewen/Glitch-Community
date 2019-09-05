// transforms the individual data points (buckets) we get from the api into grouped 'bins' of data
// each bin is then rendered as a point on the graph

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'lodash';
import groupByTime from 'group-by-time';
import { histogram as d3Histogram } from 'd3-array';
import { createAPIHook } from 'State/api';
import Button from 'Components/buttons/button';
import styles from './styles.styl';

const useC3 = createAPIHook(async () => import(/* webpackChunkName: "c3-bundle" */ 'c3'));

const createHistogram = (bins) => {
  const histogram = [];
  bins = bins || [];
  bins.forEach((bin) => {
    let totalAppViews = 0;
    let totalRemixes = 0;
    let timestamp;
    // let codeViews = []
    bin.forEach((data) => {
      if (!timestamp) {
        timestamp = data['@timestamp'];
      }
      totalRemixes += data.analytics.remixes;
      totalAppViews += data.analytics.visits;
      // referrers.push(data.analytics.referrers)
    });
    histogram.push({
      time: timestamp,
      appViews: totalAppViews,
      remixes: totalRemixes,
    });
  });
  return histogram;
};

const groupByRegularIntervals = d3Histogram().value((data) => data['@timestamp']);

const createBins = (buckets, currentTimeFrame) => {
  if (currentTimeFrame === 'Last 24 Hours') {
    return groupByRegularIntervals(buckets);
  }
  const bins = groupByTime(buckets, '@timestamp', 'day'); // supports 'day', 'week', 'month'
  return Object.values(bins);
};

const chartColumns = (analytics, currentTimeFrame) => {
  const { buckets } = analytics;
  const bins = createBins(buckets, currentTimeFrame);
  const histogram = createHistogram(bins);
  const timestamps = ['x'];
  const remixes = ['Remixes'];
  const appViews = ['Total App Views'];
  // let codeViews = ['Code Views']
  histogram.shift();
  histogram.forEach((bucket) => {
    timestamps.push(bucket.time);
    appViews.push(bucket.appViews);
    remixes.push(bucket.remixes);
  });
  const results = [timestamps, appViews, remixes];
  return results;
};

const dateFormat = (currentTimeFrame) => {
  if (currentTimeFrame === 'Last 24 Hours') {
    return '%H:%M %p';
  }
  return '%b %d';
};

const renderChart = (activeFilter, c3, analytics, currentTimeFrame) => {
  let columns = [];
  if (!isEmpty(analytics)) {
    columns = chartColumns(analytics, currentTimeFrame);
  }

  const tableRows = [];
  const dateFormatToUse = dateFormat(currentTimeFrame);
  // first entry in each array is the label, so start at 1
  for (let i = 1; i < columns[0].length; i += 1) {
    const date = new Date(columns[0][i]);
    tableRows.push(
      <tr key={columns[0][i]} className={styles.analyticsRow}>
        <td>{date.toDateString(dateFormatToUse)}</td>
        <td className={`${styles.centerText} ${styles.bigRightPadding}`}>{columns[1][i]}</td>
        <td className={styles.centerText}>{columns[2][i]}</td>
      </tr>,
    );
  }

  const table = (
    <table className={styles.analyticsTable}>
      <thead>
        <tr className={styles.analyticsRow}>
          <th className={styles.leftText}>Date</th>
          <th className={styles.bigRightPadding}>App Views</th>
          <th>Remixes</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </table>
  );

  // eslint-disable-next-line no-unused-vars
  const chart = c3.generate({
    size: {
      height: 200,
    },
    data: {
      x: 'x',
      xFormat: dateFormatToUse,
      columns,
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: dateFormatToUse,
        },
      },
      y: {
        min: 0,
        padding: { bottom: 0 },
      },
    },
    point: {
      r: 3,
    },
    legend: {
      show: false,
    },
    tooltip: {
      format: {
        value: (value, ratio, id) => {
          if (id === 'Total App Views') return `${value} views`;
          if (id === 'Remixes') return `${value} remixes`;
          return null;
        },
      },
    },
  });

  if (activeFilter === 'views') {
    chart.hide(['Remixes']);
  } else if (activeFilter === 'remixes') {
    chart.hide(['Total App Views']);
  }
  return table;
};

function TeamAnalyticsActivity({ activeFilter, analytics, currentTimeFrame }) {
  const { value: c3 } = useC3();
  const [tableData, setTable] = useState(null);
  const [showingTable, setShowingTable] = useState(false);
  useEffect(() => {
    if (!c3) return;
    setTable(renderChart(activeFilter, c3, analytics, currentTimeFrame));
  }, [activeFilter, analytics, currentTimeFrame, c3]);
  const buttonLabel = showingTable ? 'Hide Analytics in Table Format' : 'Show Analytics in Table Format';
  return (
    <>
      <Button type="tertiary" onClick={() => setShowingTable(!showingTable)}>{buttonLabel}</Button>
      {showingTable && tableData}
    </>
  );
}

TeamAnalyticsActivity.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  analytics: PropTypes.object.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsActivity;
