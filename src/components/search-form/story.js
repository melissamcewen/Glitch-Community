import React from 'react';
import { storiesOf } from '@storybook/react';
import { users } from '../../../stories/data';
import { provideContext } from '../../../stories/util';
import SearchForm from './index';

const mockAPI = {
  async get(url) {
    return { data: this.responses[url] };
  },
  responses: {
    '/v1/users/by/id/?id=271885': { 271885: users.modernserf },
  },
};

storiesOf('SearchForm', module).add(
  'results',
  provideContext({ currentUser: {}, api: mockAPI }, () => (
    <div style={{ width: 300, position: 'relative' }}>
      <SearchForm defaultValue="" />
    </div>
  )),
);
