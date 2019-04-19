import React from 'react';
import PropTypes from 'prop-types';

import randomColor from 'randomcolor';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import Thanks from 'Components/blocks/thanks';
import { UserAvatar } from 'Components/images/avatar';

import { WhitelistedDomainIcon } from './team-elements';

const UserResultItem = ({ user, action }) => {
  const name = getDisplayName(user);
  const { login, thanksCount } = user;

  const handleClick = (event) => {
    action(event);
  };

  return (
    <button onClick={handleClick} className="button-unstyled result result-user">
      <UserAvatar src={getAvatarThumbnailUrl(user)} alt="TODO tbv" />
      <div className="result-info">
        <div className="result-name" title={name}>
          {name}
        </div>
        {!!user.name && <div className="result-description">@{login}</div>}
        <Thanks short count={thanksCount} />
      </div>
    </button>
  );
};

UserResultItem.propTypes = {
  user: PropTypes.shape({
    avatarThumbnailUrl: PropTypes.string,
    name: PropTypes.string,
    login: PropTypes.string.isRequired,
    thanksCount: PropTypes.number.isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};

export default UserResultItem;

export class InviteByEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: randomColor({ luminosity: 'light' }) };
  }

  render() {
    const style = { backgroundColor: this.state.color };
    return (
      <button onClick={this.props.onClick} className="button-unstyled result">
        <img className="avatar" src={ANON_AVATAR_URL} style={style} alt="" />
        <UserAvatar src={ANON_AVATAR_URL} />
        <div className="result-name">Invite {this.props.email}</div>
      </button>
    );
  }
}

InviteByEmail.propTypes = {
  email: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const WhitelistEmailDomain = ({ domain, onClick }) => (
  <button onClick={onClick} className="button-unstyled result">
    <WhitelistedDomainIcon domain={domain} />
    <div>Allow anyone with an @{domain} email to join</div>
  </button>
);

WhitelistEmailDomain.propTypes = {
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
