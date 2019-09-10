import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { parseOneAddress } from 'email-addresses';
import randomColor from 'randomcolor';

import { UserAvatar } from 'Components/images/avatar';
import WhitelistedDomainIcon from 'Components/whitelisted-domain';
import Thanks from 'Components/thanks';
import { PopoverWithButton, PopoverDialog, PopoverSearch, PopoverInfo, InfoDescription } from 'Components/popover';
import { ResultItem, ResultInfo, ResultName, ResultDescription } from 'Components/containers/results-list';
import { getDisplayName } from 'Models/user';
import { captureException } from 'Utils/sentry';
import { useTracker } from 'State/segment-analytics';
import useDevToggle from 'State/dev-toggles';
import { useAlgoliaSearch } from 'State/search';

import useDebouncedValue from '../../hooks/use-debounced-value';

const WhitelistEmailDomain = ({ result: domain, active, onClick }) => (
  <ResultItem onClick={onClick} active={active}>
    <WhitelistedDomainIcon domain={domain} />
    <ResultInfo>Allow anyone with an @{domain} email to join</ResultInfo>
  </ResultItem>
);

const UserResult = ({ result: user, active, onClick }) => (
  <ResultItem onClick={onClick} active={active}>
    <UserAvatar user={user} hideTooltip />
    <ResultInfo>
      <ResultName>{getDisplayName(user)}</ResultName>
      {!!user.name && <ResultDescription>@{user.login}</ResultDescription>}
      <Thanks short count={user.thanksCount} />
    </ResultInfo>
  </ResultItem>
);

const InviteByEmail = ({ result: email, active, onClick }) => {
  const { current: color } = useRef(randomColor({ luminosity: 'light' }));
  return (
    <ResultItem onClick={onClick} active={active}>
      <UserAvatar user={{ color }} hideTooltip />
      <ResultInfo>
        <ResultName>Invite {email}</ResultName>
      </ResultInfo>
    </ResultItem>
  );
};

const getDomain = (query) => {
  if (!query) return null;
  const email = parseOneAddress(query.replace('@', 'test@'));
  if (email && email.domain.includes('.')) {
    return email.domain.toLowerCase();
  }
  return null;
};

function useCheckedDomains(query) {
  const [checkedDomains, setCheckedDomains] = useState({ 'gmail.com': false, 'yahoo.com': false });
  useEffect(() => {
    const domain = getDomain(query);
    if (!domain || domain in checkedDomains) return undefined;

    let isCurrentRequest = true;
    axios.get(`https://freemail.glitch.me/${domain}`).then(({ data }) => {
      if (!isCurrentRequest) return;
      setCheckedDomains((domains) => ({ ...domains, [domain]: !data.free }));
    }, captureException);

    return () => {
      isCurrentRequest = false;
    };
  }, [query, checkedDomains]);
  return checkedDomains;
}

function AddTeamUserPop({ members, inviteEmail, inviteUser, setWhitelistedDomain, whitelistedDomain }) {
  const [value, onChange] = useState('');
  const debouncedValue = useDebouncedValue(value, 200);
  const checkedDomains = useCheckedDomains(debouncedValue);
  const allowEmailInvites = useDevToggle('Email Invites');

  const { user: retrievedUsers, status } = useAlgoliaSearch(
    debouncedValue,
    {
      filterTypes: ['user'],
    },
    [],
  );

  const results = useMemo(() => {
    const memberSet = new Set(members);
    const filteredUsers = retrievedUsers.filter((user) => !memberSet.has(user.id)).slice(0, 10);
    const out = [];

    const email = parseOneAddress(debouncedValue);
    if (email && allowEmailInvites) {
      out.push({
        id: 'invite-by-email',
        result: email.address,
        onClick: () => inviteEmail(email.address),
        component: InviteByEmail,
      });
    }

    if (setWhitelistedDomain && !whitelistedDomain) {
      const domain = getDomain(debouncedValue);
      if (domain && checkedDomains[domain]) {
        out.push({
          id: 'whitelist-email-domain',
          result: domain,
          onClick: () => setWhitelistedDomain(domain),
          component: WhitelistEmailDomain,
        });
      }
    }

    // now add the actual search results
    out.push(
      ...filteredUsers.map((user) => ({
        id: user.id,
        result: user,
        onClick: () => inviteUser(user),
        component: UserResult,
      })),
    );

    return out;
  }, [debouncedValue, retrievedUsers, members, whitelistedDomain]);

  return (
    <PopoverDialog align="left">
      <PopoverSearch
        value={value}
        onChange={onChange}
        results={results}
        status={status}
        onSubmit={(result) => result.onClick()}
        labelText="User name"
        placeholder="Search for a user"
        renderItem={({ item: { onClick, result, component: Component }, active }) => <Component active={active} result={result} onClick={onClick} />}
      />
      {!value && !!setWhitelistedDomain && !whitelistedDomain && (
        <PopoverInfo>
          <InfoDescription>You can also whitelist with @example.com</InfoDescription>
        </PopoverInfo>
      )}
    </PopoverDialog>
  );
}

AddTeamUserPop.propTypes = {
  inviteEmail: PropTypes.func.isRequired,
  inviteUser: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setWhitelistedDomain: PropTypes.func,
  whitelistedDomain: PropTypes.string,
};

AddTeamUserPop.defaultProps = {
  setWhitelistedDomain: () => {},
  whitelistedDomain: '',
};

const AddTeamUser = ({ members, whitelistedDomain, inviteEmail, inviteUser, setWhitelistedDomain }) => {
  const track = useTracker('Add to Team clicked');
  return (
    <PopoverWithButton buttonProps={{ size: 'small', variant: 'secondary' }} buttonText="Add" onOpen={track}>
      {({ toggleAndCall }) => (
        <AddTeamUserPop
          members={members}
          whitelistedDomain={whitelistedDomain}
          setWhitelistedDomain={toggleAndCall(setWhitelistedDomain)}
          inviteUser={toggleAndCall(inviteUser)}
          inviteEmail={toggleAndCall(inviteEmail)}
        />
      )}
    </PopoverWithButton>
  );
};
AddTeamUser.propTypes = {
  members: PropTypes.array.isRequired,
  whitelistedDomain: PropTypes.string,
  inviteEmail: PropTypes.func,
  inviteUser: PropTypes.func,
  setWhitelistedDomain: PropTypes.func,
};
AddTeamUser.defaultProps = {
  whitelistedDomain: null,
  setWhitelistedDomain: null,
  inviteUser: null,
  inviteEmail: null,
};

export default AddTeamUser;
