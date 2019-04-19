import React from 'react';
import PropTypes from 'prop-types';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import Image from 'Components/images/image';

import { DEFAULT_PROJECT_AVATAR, getAvatarUrl as getProjectAvatarUrl } from 'Models/project';
import { DEFAULT_TEAM_AVATAR, getAvatarUrl as getTeamAvatarUrl } from 'Models/team';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import styles from './avatar.styl';

export const Avatar = ({ name, src, color, srcFallback, type, hideTooltip, withinButton, size }) => {
  const contents = (
    <Image width={`${size}px`} height={`${size}px`} src={src} defaultSrc={srcFallback} alt={name} backgroundColor={color} className={`avatar ${styles[type]}`} />
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
  size: PropTypes.number.isRequired,
  color: PropTypes.string,
  hideTooltip: PropTypes.bool,
  withinButton: PropTypes.bool,
};

Avatar.defaultProps = {
  color: null,
  srcFallback: '',
  size: 32,
  hideTooltip: false,
};

// Project avatar

export const ProjectAvatar = ({ id, size }) => (
  <Avatar name="" src={getProjectAvatarUrl(id)} srcFallback={DEFAULT_PROJECT_AVATAR} type="project" hideTooltip size={size} />
);
ProjectAvatar.propTypes = {
  id: PropTypes.string.isRequired,
};
ProjectAvatar.defaultProps = {
  size: 42,
};

// Team avatar

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

// UserAvatar

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
