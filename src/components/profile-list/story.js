import React from 'react';
import { storiesOf } from '@storybook/react';
import ProfileList from './index';
import { users, teams } from '../../../stories/data';

const ProfileListWrap = ({ children }) => <div style={{ width: '25%' }}>{children}</div>;

const usersList = Object.values(users);
const teamsList = Object.values(teams);

storiesOf('ProfileList', module)
  .add('loading', () => (
    <ProfileListWrap>
      <ProfileList users={[]} />
    </ProfileListWrap>
  ))
  .add('row', () => (
    <ProfileListWrap>
      <ProfileList layout="row" teams={teamsList} users={usersList} />
    </ProfileListWrap>
  ))
  .add('grid', () => (
    <ProfileListWrap>
      <ProfileList layout="grid" teams={teamsList} users={usersList} />
    </ProfileListWrap>
  ))
  .add('glitchTeam', () => (
    <ProfileListWrap>
      <ProfileList layout="grid" glitchTeam teams={teamsList} users={usersList} />
    </ProfileListWrap>
  ));
