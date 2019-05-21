import { configure, addDecorator, addParameters } from '@storybook/react';
import React from 'react';
import dayjs from 'dayjs';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import convertPlugin from '../shared/dayjs-convert';
import { withInfo } from '@storybook/addon-info';
import { MemoryRouter } from 'react-router-dom';

// initialize globals
window.CDN_URL = 'https://cdn.glitch.com';
window.EDITOR_URL = 'https://glitch.com/edit/';
window.APP_URL = 'https://glitch.com';


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

function loadStories() {
  require('../stories/index.js');
  require('../stories/inputs.js');
  require('Components/overlays/story');
  require('Components/new-stuff/story');

  // You can require as many stories as you need.
}

configure(loadStories, module);
