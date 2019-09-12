import PropTypes from 'prop-types';
import React from 'react';
import { sumBy } from 'lodash';
import { Button } from '@fogcreek/shared-components';

import Markdown from 'Components/text/markdown';
import Cover from 'Components/search-result-cover-bar';
import Image from 'Components/images/image';
import Thanks from 'Components/thanks';
import VerifiedBadge from 'Components/verified-badge';
import ProfileList from 'Components/profile-list';
import { WrappingLink } from 'Components/link';
import { getTeamLink, getTeamAvatarUrl, DEFAULT_TEAM_AVATAR } from 'Models/team';
import { createAPIHook } from 'State/api';
import { captureException } from 'Utils/sentry';

import styles from './team-item.styl';

const useTeamUsers = createAPIHook(async (api, teamID) => {
  try {
    const res = await api.get(`/v1/teams/by/id/users?id=${teamID}&limit=10`);
    return res.data.items;
  } catch (e) {
    captureException(e);
    return [];
  }
});

const ProfileAvatar = ({ team }) => <Image className={styles.avatar} src={getTeamAvatarUrl(team)} defaultSrc={DEFAULT_TEAM_AVATAR} alt="" />;

const getTeamThanksCount = (team) => sumBy(team.users, (user) => user.thanksCount);

const TeamItem = ({ team }) => {
  const { value: users } = useTeamUsers(team.id);
  return (
    <WrappingLink className={styles.container} href={getTeamLink(team)}>
      <Cover type="team" item={team} size="medium" />
      <div className={styles.mainContent}>
        <div className={styles.avatarWrap}>
          <ProfileAvatar team={team} />
        </div>
        <div className={styles.body}>
          <div className={styles.itemButtonWrap}>
            <Button as="a" href={getTeamLink(team)}>{team.name}</Button>
            {!!team.isVerified && <VerifiedBadge />}
          </div>
          <div className={styles.usersList}>
            <ProfileList layout="block" users={users} />
          </div>
          <Markdown length={96}>{team.description || ' '}</Markdown>
          <Thanks count={getTeamThanksCount(team)} />
        </div>
      </div>
    </WrappingLink>
  );
};

TeamItem.propTypes = {
  team: PropTypes.shape({
    description: PropTypes.string,
    isVerified: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    users: PropTypes.array,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default TeamItem;
