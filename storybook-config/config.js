import { configure, addDecorator, addParameters } from '@storybook/react';
import React from 'react';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import convertPlugin from '../shared/dayjs-convert';
import { withInfo } from '@storybook/addon-info';
import { MemoryRouter } from 'react-router-dom';

// initialize globals
window.RUNNING_ON = 'production';


dayjs.extend(relativeTimePlugin);
dayjs.extend(convertPlugin);

const enableLinks = (story) => <MemoryRouter>{story()}</MemoryRouter>;

addParameters({
  options: {
    showPanel: false,
  }
});

addDecorator(
  enableLinks, // make sure this comes first, otherwise some stories break.
  withInfo({
    header: false, // Global configuration for the info addon across all of your stories.
  }),
);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

function loadStories() {
  require('../stories/index.js');
  require('../stories/inputs.js');
  // pulls in all nested stories, ex: src/components/buttons/story.js
  requireAll(require.context("../src/", true, /story.js/));
}

configure(loadStories, module);
