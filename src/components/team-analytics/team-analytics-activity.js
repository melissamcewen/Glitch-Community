// transforms the individual data points (buckets) we get from the api into grouped 'bins' of data
// each bin is then rendered as a point on the graph

import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { isEmpty } from 'lodash';
import groupByTime from 'group-by-time';
import { histogram as d3Histogram } from 'd3-array';
import { createAPIHook } from 'State/api';

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
  return [timestamps, appViews, remixes];
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

  // eslint-disable-next-line no-unused-vars
  const chart = c3.generate({
    size: {
      height: 200,
    },
    data: {
      x: 'x',
      xFormat: dateFormat(currentTimeFrame),
      columns,
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: dateFormat(currentTimeFrame),
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
};

function TeamAnalyticsActivity({ activeFilter, analytics, currentTimeFrame }) {
  const { value: c3 } = useC3();
  useEffect(() => {
    if (!c3) return;
    renderChart(activeFilter, c3, analytics, currentTimeFrame);
  }, [activeFilter, analytics, currentTimeFrame, c3]);
  return null;
}

TeamAnalyticsActivity.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  analytics: PropTypes.object.isRequired,
  currentTimeFrame: PropTypes.string.isRequired,
};

export default TeamAnalyticsActivity;
