import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { AvatarBase, UserAvatar, TeamAvatar } from 'Components/images/avatar';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import { UserLink, TeamLink } from 'Components/link';
import { getDisplayName } from 'Models/user';

import styles from './profile-list.styl';

const UserItem = ({ user }) => {
  const tooltipTarget = (
    <UserLink user={user} draggable={false}>
      <UserAvatar user={user} hideTooltip />
    </UserLink>
  );
  return <TooltipContainer type="info" tooltip={getDisplayName(user)} target={tooltipTarget} />;
};

const TeamItem = ({ team }) => {
  const tooltipTarget = (
    <TeamLink team={team} draggable={false}>
      <TeamAvatar team={team} hideTooltip />
    </TeamLink>
  );
  return <TooltipContainer type="info" tooltip={team.name} target={tooltipTarget} />;
};

// NOTE: ResizeObserver is not widely supported
// see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
// window 'resize' event is mostly adequate for this use case,
// but continue to use clip-path to handle edge cases
const useResizeObserver = () => {
  const ref = useRef();
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const setWidthOfRef = () => {
      if (ref.current) {
        const boundingClientRect = ref.current.getBoundingClientRect();
        if (boundingClientRect) {
          setWidth(boundingClientRect.width);
        }
      }
    };
    const debouncedSetWidth = debounce(setWidthOfRef, 100);
    setWidthOfRef();

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(debouncedSetWidth);
      observer.observe(ref.current);

      return () => {
        observer.unobserve(ref.current);
      };
    }
    window.addEventListener('resize', debouncedSetWidth);
    return () => {
      window.removeEventListener('resize', debouncedSetWidth);
    };
  }, [ref, setWidth]);
  return { ref, width };
};

const parametersForSize = {
  large: {
    avatarWidth: 32,
    userOffset: -7,
    teamOffset: 7,
  },
  small: {
    avatarWidth: 22,
    userOffset: -5,
    teamOffset: 2,
  },
};

const RowContainer = ({ size, users, teams }) => {
  const { ref, width } = useResizeObserver();
  const { avatarWidth, userOffset, teamOffset } = parametersForSize[size];
  const maxTeams = Math.floor(width / (avatarWidth + teamOffset));
  const remainingWidth = width - (avatarWidth + teamOffset) * teams.length - teamOffset;
  const maxUsers = Math.floor((remainingWidth + userOffset) / (avatarWidth + userOffset));

  return (
    <ul ref={ref} className={classnames(styles.container, styles.row, styles[size])}>
      {teams.slice(0, maxTeams).map((team) => (
        <li key={`team-${team.id}`} className={styles.teamItem}>
          <TeamItem team={team} />
        </li>
      ))}
      {users.slice(0, maxUsers).map((user) => (
        <li key={`user-${user.id}`} className={styles.userItem}>
          <UserItem user={user} />
        </li>
      ))}
    </ul>
  );
};

const BlockContainer = ({ size, users, teams }) => (
  <>
    {teams.length > 0 && (
      <ul className={classnames(styles.container, styles[size])}>
        {teams.map((team) => (
          <li key={`team-${team.id}`} className={styles.teamItem}>
            <TeamItem team={team} />
          </li>
        ))}
      </ul>
    )}
    {users.length > 0 && (
      <ul className={classnames(styles.container, styles[size])}>
        {users.map((user) => (
          <li key={`user-${user.id}`} className={styles.userItem}>
            <UserItem user={user} />
          </li>
        ))}
      </ul>
    )}
  </>
);

const GLITCH_TEAM_AVATAR = 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fglitch-team-avatar.svg?1489266029267';
const GLITCH_TEAM_URL = 'glitch';

const GlitchTeamList = ({ size }) => {
  const tooltipTarget = <TeamLink team={{ url: GLITCH_TEAM_URL }} draggable={false}><AvatarBase name="Glitch Team" src={GLITCH_TEAM_AVATAR} color="#74ecfc" type="team" hideTooltip /></TeamLink>;
  return (
    <ul className={classnames(styles.container, styles[size])}>
      <li className={styles.teamItem}>
        <TooltipContainer type="info" tooltip="Glitch Team" target={tooltipTarget} />
      </li>
    </ul>
  );
};

const PlaceholderList = ({ size }) => (
  <ul className={classnames(styles.container, styles[size])}>
    <li className={styles.userItem}>
      <div className={styles.placeholder} />
    </li>
  </ul>
);

const maybeList = (item) => (item ? [item] : []);

export const ProfileItem = ({ user, team, glitchTeam, size }) => (
  <ProfileList layout="block" users={maybeList(user)} teams={maybeList(team)} glitchTeam={glitchTeam} size={size} />
);

const ProfileList = React.memo(({ size, users, teams, layout, glitchTeam }) => {
  if (glitchTeam) {
    return <GlitchTeamList />;
  }

  if (!users.length && !teams.length) {
    return <PlaceholderList size={size} />;
  }

  if (layout === 'row') {
    return <RowContainer size={size} users={users} teams={teams} />;
  }

  return <BlockContainer size={size} users={users} teams={teams} />;
});

ProfileList.propTypes = {
  layout: PropTypes.oneOf(['row', 'block']).isRequired,
  size: PropTypes.oneOf(['small', 'large']),
  users: PropTypes.array,
  teams: PropTypes.array,
  glitchTeam: PropTypes.bool,
};

ProfileList.defaultProps = {
  size: 'large',
  users: [],
  teams: [],
  glitchTeam: false,
};

export default ProfileList;
