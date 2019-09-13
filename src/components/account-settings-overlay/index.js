import React, { useState } from 'react';
import { Icon, SegmentedButton } from '@fogcreek/shared-components';

import Text from 'Components/text/text';
import { Overlay, OverlaySection, OverlayTitle, OverlayBackground } from 'Components/overlays';
import PopoverContainer from 'Components/popover/container';
import { useCurrentUser } from 'State/current-user';

import PasswordSettings from './password-settings';
import TwoFactorSettings from './two-factor-settings';
import styles from './styles.styl';
import { emoji } from '../global.styl';

const AccountSettingsOverlay = () => {
  const { currentUser } = useCurrentUser();

  const [page, setPage] = useState('password');

  const options = [{ id: 'password', label: 'Password' }, { id: '2fa', label: 'Two-Factor Authentication' }];

  const primaryEmail = currentUser.emails.find((email) => email.primary);

  return (
    <Overlay className="account-settings-overlay">
      <OverlaySection type="info">
        <OverlayTitle>
          Account Settings <Icon icon="key" className={emoji} />
        </OverlayTitle>
      </OverlaySection>

      <OverlaySection type="actions">
        <div className={styles.accountSettings}>
          <div className={styles.accountSettingsActions}>
            <SegmentedButton size="small" value={page} onChange={(id) => setPage(id)} options={options} />
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
    <>
      {children(openPopover)}
      {visible && <OverlayBackground />}
    </>
  );
  return (
    <PopoverContainer outer={renderOuter}>
      {({ visible }) => visible ? <AccountSettingsOverlay /> : null}
    </PopoverContainer>
  );
};

export default AccountSettingsContainer;
