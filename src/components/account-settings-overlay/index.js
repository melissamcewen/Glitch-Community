import React, { useState } from 'react';

import Text from 'Components/text/text';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import { Overlay, OverlaySection, OverlayTitle, OverlayBackground } from 'Components/overlays';
import PopoverContainer from 'Components/popover/container';
import { useCurrentUser } from 'State/current-user';

import PasswordSettings from './password-settings';
import TwoFactorSettings from './two-factor-settings';
import styles from './styles.styl';

const AccountSettingsTab = ({ name, children, currentPage, setPage }) => (
  <Button size="small" onClick={() => setPage(name)} active={name === currentPage}>
    {children}
  </Button>
);

const AccountSettingsOverlay = () => {
  const { currentUser } = useCurrentUser();

  const [page, setPage] = useState('password');

  const primaryEmail = currentUser.emails.find((email) => email.primary);

  return (
    <Overlay className="account-settings-overlay">
      <OverlaySection type="info">
        <OverlayTitle>
          Account Settings <Emoji name="key" />
        </OverlayTitle>
      </OverlaySection>

      <OverlaySection type="actions">
        <div className={styles.accountSettings}>
          <div className={styles.accountSettingsActions}>
            <AccountSettingsTab name="password" currentPage={page} setPage={setPage}>
              Password
            </AccountSettingsTab>
            <AccountSettingsTab name="2fa" currentPage={page} setPage={setPage}>
              Two-Factor Authentication
            </AccountSettingsTab>
          </div>
          <div className={styles.accountSettingsContent}>
            {page === 'password' ? <PasswordSettings /> : null}
            {page === '2fa' ? <TwoFactorSettings /> : null}
          </div>
        </div>
      </OverlaySection>
      {!!primaryEmail && (
        <OverlaySection type="info">
          <Text>
            Email notifications are sent to <b>{primaryEmail.email}</b>
          </Text>
        </OverlaySection>
      )}
    </Overlay>
  );
};

const AccountSettingsContainer = ({ children }) => {
  const renderOuter = ({ visible, openPopover }) => (
    <React.Fragment>
      {children(openPopover)}
      {visible && <OverlayBackground />}
    </React.Fragment>
  );
  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible }) => visible ? <AccountSettingsOverlay /> : null}
    </PopoverContainer>
  );
};

export default AccountSettingsContainer;
