import React from 'react';
import { storiesOf } from '@storybook/react';
import { projects, collections } from '../../../stories/data';
import { provideContext } from '../../../stories/util';
import CollectionsList from './index';
import MoreCollections from './more-collections';

const glitchCollections = [
  {
    fullUrl: 'glitch/marketing-emails',
    id: 2519,
    name: 'Marketing Emails',
    url: 'marketing-emails',
    coverColor: '#ff9f7c',
    description: 'HTML email templates',
    avatarUrl: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633',
    avatarThumbnailUrl: null,
    userId: -1,
    teamId: 74,
    featuredProjectId: null,
    createdAt: '2018-12-13T19:59:25.103Z',
    updatedAt: '2019-01-11T10:04:23.768Z',
    deletedAt: null,
    authUserIsTeamMember: false,
    team: {
      id: 74,
      url: 'glitch',
      name: 'Glitch',
    },
    user: null,
  },
  {
    fullUrl: 'glitch/glitch-sites',
    id: 2520,
    name: 'Glitch Sites',
    url: 'glitch-sites',
    coverColor: '#e2f26d',
    description: 'Components of glitch.com',
    avatarUrl: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633',
    avatarThumbnailUrl: null,
    userId: -1,
    teamId: 74,
    featuredProjectId: null,
    createdAt: '2018-12-13T20:02:36.926Z',
    updatedAt: '2019-04-23T10:16:43.659Z',
    deletedAt: null,
    authUserIsTeamMember: false,
    team: {
      id: 74,
      url: 'glitch',
    },
    user: null,
  },
  {
    fullUrl: 'glitch/glitch-this-week-january-11-2019',
    id: 3202,
    name: 'Glitch This Week (January 11, 2019)',
    url: 'glitch-this-week-january-11-2019',
    coverColor: '#9885ea',
    description: 'Just a few projects that caught our eye this week on Glitch.',
    avatarUrl: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633',
    avatarThumbnailUrl: null,
    userId: -1,
    teamId: 74,
    featuredProjectId: null,
    createdAt: '2019-01-08T13:07:10.454Z',
    updatedAt: '2019-04-16T11:14:49.654Z',
    deletedAt: null,
    authUserIsTeamMember: false,
    team: {
      id: 74,
      url: 'glitch',
    },
    user: null,
  },
  {
    fullUrl: 'glitch/glitch-this-week-january-19-2019',
    id: 3529,
    name: 'Glitch This Week (January 19, 2019)',
    url: 'glitch-this-week-january-19-2019',
    coverColor: '#5fcfd3',
    description: 'Just a few projects that caught our eye this week on Glitch.',
    avatarUrl: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fcollection-avatar.svg?1540389405633',
    avatarThumbnailUrl: null,
    userId: -1,
    teamId: 74,
    featuredProjectId: null,
    createdAt: '2019-01-17T12:29:52.342Z',
    updatedAt: '2019-04-16T11:15:25.227Z',
    deletedAt: null,
    authUserIsTeamMember: false,
    team: {
      id: 74,
      url: 'glitch',
    },
    user: null,
  },
];

const mockAPI = {
  get: async (url) => {
    if (/v1\/teams/.test(url)) {
      return { data: { items: glitchCollections } };
    }
    return { data: { items: Object.values(projects) } };
  },
};

storiesOf('Collections', module)
  .add(
    'CollectionsList',
    provideContext({ api: mockAPI }, () => (
      <div style={{ maxWidth: 960, margin: '1em auto' }}>
        <CollectionsList collections={Object.values(collections)} />
      </div>
    )),
  )
  .add(
    'MoreCollections',
    provideContext({ api: mockAPI }, () => (
      <div style={{ maxWidth: 960, margin: '1em auto' }}>
        <MoreCollections collection={glitchCollections[0]} />
      </div>
    )),
  );
