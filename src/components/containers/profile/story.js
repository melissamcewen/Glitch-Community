import React from 'react';
import { storiesOf } from '@storybook/react';
import ProfileContainer from './index';
import { users, teams } from '../../../../stories/data';

storiesOf('ProfileContainer', module)
  .add('user', () => (
    <ProfileContainer item={users.modernserf} type="user" teams={Object.values(teams)}>
      <p>The profile content goes here.</p>
    </ProfileContainer>
  ))
  .add('team', () => (
    <ProfileContainer item={teams['example-team']} type="team">
      <p>The profile content goes here.</p>
    </ProfileContainer>
  ));
