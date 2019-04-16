import React from 'react';
import PropTypes from 'prop-types';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Image from 'Components/images/image';
import DefaultCollectionAvatar from 'Components/collection/defaultAvatar';

import { DEFAULT_TEAM_AVATAR, getAvatarUrl as getTeamAvatarUrl } from 'Models/team';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import styles from './avatar.styl';

// UserAvatar

export const Avatar = ({ name, src, color, srcFallback, type, hideTooltip, withinButton }) => {
  const contents = (
    <Image
      width="32px"
      height="32px"
      src={src}
      defaultSrc={srcFallback}
      alt={name}
      backgroundColor={color}
      className={styles[type]}
    />
  );

  if (!hideTooltip) {
    return <TooltipContainer tooltip={name} target={contents} type="action" id={`avatar-tooltip-${name}`} align={['left']} fallback={withinButton} />;
  }
  return contents;
};

Avatar.propTypes = {
  name: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcFallback: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

Avatar.defaultProps = {
  color: null,
  srcFallback: '',
  hideTooltip: false,
};

export const TeamAvatar = ({ team, hideTooltip }) => (
  <Avatar
    name={team.name}
    src={getTeamAvatarUrl({ ...team, size: 'small' })}
    srcFallback={DEFAULT_TEAM_AVATAR}
    type="team"
    hideTooltip={hideTooltip}
  />
);
TeamAvatar.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    hasAvatarImage: PropTypes.bool.isRequired,
  }).isRequired,
  hideTooltip: PropTypes.bool,
};
TeamAvatar.defaultProps = {
  hideTooltip: false,
};

export const UserAvatar = ({ user, suffix = '', hideTooltip, withinButton }) => (
  <Avatar
    name={getDisplayName(user) + suffix}
    src={getAvatarThumbnailUrl(user)}
    color={user.color}
    srcFallback={ANON_AVATAR_URL}
    type="user"
    hideTooltip={hideTooltip}
    withinButton={withinButton}
  />
);
UserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
    name: PropTypes.string,
    avatarThumbnailUrl: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  suffix: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

UserAvatar.defaultProps = {
  suffix: '',
  hideTooltip: false,
  withinButton: false,
};

/* eslint-disable no-bitwise */
// from https://stackoverflow.com/a/21648508/1720985
const hexToRgbA = (hex) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.5)`;
  }
  return false;
};
/* eslint-enable no-bitwise */

export const CollectionAvatar = (props) => <DefaultCollectionAvatar backgroundFillColor={hexToRgbA(props.color)} />;

CollectionAvatar.propTypes = {
  color: PropTypes.string.isRequired,
};