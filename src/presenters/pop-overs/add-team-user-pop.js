import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { debounce, uniqBy } from 'lodash';
import { parseOneAddress } from 'email-addresses';
import randomColor from 'randomcolor';

import Thanks from 'Components/thanks';
import Loader from 'Components/loader';
import { UserAvatar } from 'Components/images/avatar';
import { UserLink } from 'Components/link';
import TransparentButton from 'Components/buttons/transparent-button';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import { ANON_AVATAR_URL, getAvatarThumbnailUrl, getDisplayName } from 'Models/user';
import { useAPI } from 'State/api';
import { useTracker } from 'State/segment-analytics';
import { captureException } from 'Utils/sentry';
import useDevToggle from '../includes/dev-toggles';
import PopoverWithButton from './popover-with-button';


const WhitelistEmailDomain = ({ domain, onClick }) => (
  <TransparentButton onClick={onClick} className="result">
    <div className="add-team-user-pop__whitelist-email-domain">
      <div className="add-team-user-pop__whitelist-email-image">
        <WhitelistedDomainIcon domain={domain} />
      </div>
      <div>Allow anyone with an @{domain} email to join</div>
    </div>
  </TransparentButton>
);

const UserResultItem = ({ user, action }) => {
  const name = getDisplayName(user);

  return (
    <TransparentButton onClick={action} className="result result-user">
      <img className="avatar" src={getAvatarThumbnailUrl(user)} alt="" />
      <div className="result-info">
        <div className="result-name" title={name}>
          {name}
        </div>
        {!!user.name && <div className="result-description">@{user.login}</div>}
        <Thanks short count={user.thanksCount} />
      </div>
    </TransparentButton>
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

const InviteByEmail = ({ email, onClick }) => {
  const { current: backgroundColor } = useRef(randomColor({ luminosity: 'light' }));
  return (
    <TransparentButton onClick={onClick} className="result result-user">
      <img className="avatar" src={ANON_AVATAR_URL} style={{ backgroundColor }} alt="" />
      <div className="result-info">
        <div className="result-name">Invite {email}</div>
      </div>
    </TransparentButton>
  );
};

InviteByEmail.propTypes = {
  email: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const getDomain = (query) => {
  const email = parseOneAddress(query.replace('@', 'test@'));
  if (email && email.domain.includes('.')) {
    return email.domain.toLowerCase();
  }
  return null;
};

const rankSearchResult = (result, query) => {
  // example result:
  /*
  login: "judeallred"
  name: "Jude Allred"
  */
  const lowerQuery = query.toLowerCase();
  let points = 0;

  const login = result.login || '';
  const lowerLogin = login.toLowerCase();
  const name = result.name || '';
  const lowerName = name.toLowerCase();

  // Big point items -- exact matches:
  if (lowerLogin === lowerQuery) {
    points += 9000; // exact match on login name :over nine thousand!:
  }

  if (lowerName === lowerQuery) {
    points += 50; // Exact match on name, case insensitive.

    if (name === query) {
      points += 10; // Bonus case-sensitive match
    }
  }

  // Points for matching either of login or name.
  // Bonus if startsWith.
  [lowerLogin, lowerName].forEach((lowerField) => {
    if (lowerField.includes(lowerQuery)) {
      points += 10;

      if (lowerField.startsWith(lowerQuery)) {
        points += 5;
      }
    }
  });

  return points;
};

class AddTeamUserPop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '', // The actual search text
      maybeRequest: null, // The active request promise
      maybeResults: null, // Null means still waiting vs empty
      validDomains: {}, // Null means loading that domain
    };

    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.debouncedSearch = debounce(this.debouncedSearch.bind(this), 300);
  }

  handleChange(evt) {
    const query = evt.currentTarget.value.trimStart();
    this.setState({ query });
    if (query) {
      this.debouncedSearch();
    } else {
      this.clearSearch();
    }
  }

  clearSearch() {
    this.setState({
      maybeRequest: null,
      maybeResults: null,
    });
  }

  debouncedSearch() {
    const query = this.state.query.trim();
    if (!query) {
      this.clearSearch();
      return;
    }
    this.startSearch(query);
    this.validateDomain(query);
  }

  async startSearch(query) {
    const request = this.props.api.get(`users/search?q=${query}`);
    this.setState({ maybeRequest: request });

    const { data } = await request;
    const nonMemberResults = data.filter((user) => !this.props.members.includes(user.id));
    const rankedResults = nonMemberResults.sort((a, b) => rankSearchResult(b, query) - rankSearchResult(a, query));

    this.setState(({ maybeRequest }) => {
      if (request === maybeRequest) {
        return {
          maybeRequest: null,
          maybeResults: rankedResults,
        };
      }
      return {};
    });
  }

  async validateDomain(query) {
    const domain = getDomain(query);
    if (!domain || this.state.validDomains[domain] !== undefined) {
      return;
    }

    this.setState((prevState) => ({
      validDomains: { ...prevState.validDomains, [domain]: null },
    }));

    let valid = !['gmail.com', 'yahoo.com'].includes(domain); // Used if we can't reach freemail

    try {
      const { data } = await axios.get(`https://freemail.glitch.me/${domain}`);
      valid = !data.free;
    } catch (error) {
      captureException(error);
    }

    this.setState((prevState) => ({
      validDomains: { ...prevState.validDomains, [domain]: valid },
    }));
  }

  render() {
    const { inviteEmail, inviteUser, setWhitelistedDomain, whitelistedDomain } = this.props;
    const { maybeRequest, maybeResults, query } = this.state;
    const isLoading = !!maybeRequest || !maybeResults;
    const results = [];

    const email = parseOneAddress(query);
    if (email && this.props.allowEmailInvites) {
      results.push({
        key: 'invite-by-email',
        item: <InviteByEmail email={email.address} onClick={() => inviteEmail(email.address)} />,
      });
    }

    if (setWhitelistedDomain && !whitelistedDomain) {
      const domain = getDomain(query);
      if (domain && this.state.validDomains[domain]) {
        results.push({
          key: 'whitelist-email-domain',
          item: <WhitelistEmailDomain domain={domain} onClick={() => setWhitelistedDomain(domain)} />,
        });
      }
    }

    // now add the actual search results
    if (maybeResults) {
      results.push(
        ...maybeResults.map((user) => ({
          key: user.id,
          item: <UserResultItem user={user} action={() => inviteUser(user)} />,
        })),
      );
    }

    return (
      <dialog className="pop-over add-team-user-pop">
        <section className="pop-over-info">
          <input
            id="team-user-search"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={query}
            onChange={this.handleChange}
            className="pop-over-input search-input pop-over-search"
            placeholder="Search for a user"
          />
        </section>
        {!!query && <Results isLoading={isLoading} results={results} />}
        {!query && !!setWhitelistedDomain && !whitelistedDomain && <aside className="pop-over-info">You can also whitelist with @example.com</aside>}
      </dialog>
    );
  }
}
AddTeamUserPop.propTypes = {
  api: PropTypes.func.isRequired,
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setWhitelistedDomain: PropTypes.func,
  whitelistedDomain: PropTypes.string,
  allowEmailInvites: PropTypes.bool.isRequired,
};

AddTeamUserPop.defaultProps = {
  setWhitelistedDomain: () => {},
  whitelistedDomain: '',
};

const Results = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <section className="pop-over-actions last-section">
        <Loader />
      </section>
    );
  }

  if (results.length === 0) {
    return (
      <section className="pop-over-actions last-section">
        Nothing found{' '}
        <span role="img" aria-label="">
          💫
        </span>
      </section>
    );
  }

  return (
    <section className="pop-over-actions last-section results-list">
      <ul className="results">
        {results.map(({ key, item }) => (
          <li key={key}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

Results.propTypes = {
  results: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

const AddTeamUser = ({ inviteEmail, inviteUser, setWhitelistedDomain, members, invitedMembers, whitelistedDomain }) => {
  const [invitee, setInvitee] = useState('');
  const [newlyInvited, setNewlyInvited] = useState([]);

  const alreadyInvitedAndNewInvited = uniqBy(invitedMembers.concat(newlyInvited), (user) => user.id);
  const track = useTracker('Add to Team clicked');
  const api = useAPI();
  const allowEmailInvites = useDevToggle('Email Invites');

  const onSetWhitelistedDomain = async (togglePopover, domain) => {
    togglePopover();
    await setWhitelistedDomain(domain);
  };

  const onInviteUser = async (togglePopover, user) => {
    togglePopover();
    setInvitee(getDisplayName(user));
    setNewlyInvited((invited) => [...invited, user]);
    try {
      await inviteUser(user);
    } catch (error) {
      setInvitee('');
      setNewlyInvited((invited) => invited.filter((u) => u.id !== user.id));
    }
  };

  const onInviteEmail = async (togglePopover, email) => {
    togglePopover();
    setInvitee(email);
    try {
      await inviteEmail(email);
    } catch (error) {
      setInvitee('');
    }
  };

  const removeNotifyInvited = () => {
    setInvitee('');
  };

  return (
    <span className="add-user-container">
      <ul className="users">
        {alreadyInvitedAndNewInvited.map((user) => (
          <li key={user.id}>
            <UserLink user={user} className="user">
              <UserAvatar user={user} />
            </UserLink>
          </li>
        ))}
      </ul>
      <span className="add-user-wrap">
        <PopoverWithButton buttonClass="button-small button-tertiary add-user" buttonText="Add" onOpen={track}>
          {({ togglePopover }) => (
            <AddTeamUserPop
              api={api}
              allowEmailInvites={allowEmailInvites}
              members={members}
              whitelistedDomain={whitelistedDomain}
              setWhitelistedDomain={setWhitelistedDomain ? (domain) => onSetWhitelistedDomain(togglePopover, domain) : null}
              inviteUser={inviteUser ? (user) => onInviteUser(togglePopover, user) : null}
              inviteEmail={inviteEmail ? (email) => onInviteEmail(togglePopover, email) : null}
            />
          )}
        </PopoverWithButton>
        {!!invitee && (
          <div className="notification notifySuccess inline-notification" onAnimationEnd={removeNotifyInvited}>
            Invited {invitee}
          </div>
        )}
      </span>
    </span>
  );
};
AddTeamUser.propTypes = {
  inviteEmail: PropTypes.func,
  inviteUser: PropTypes.func,
  setWhitelistedDomain: PropTypes.func,
};
AddTeamUser.defaultProps = {
  setWhitelistedDomain: null,
  inviteUser: null,
  inviteEmail: null,
};

export default AddTeamUser;
