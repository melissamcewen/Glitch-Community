import React from 'react';
import classNames from 'classnames/bind';

import { useCurrentUser } from 'State/current-user';

import useLocalStorage from 'State/local-storage';

import styles from './super-user.styl';

const cx = classNames.bind(styles);

const SuperUserBanner = () => {
  const { superUserHelpers } = useCurrentUser();
  const { superUserFeature, canBecomeSuperUser, toggleSuperUser } = superUserHelpers;
  const [showSupportBanner, setShowSupportBanner] = useLocalStorage('showSupportBanner', false);
  
  if (superUserFeature || canBecomeSuperUser) {
    const expirationDate = superUserFeature && new Date(superUserFeature.expiresAt).toUTCString();
    const displayText = `SUPER USER MODE ${superUserFeature ? `ENABLED UNTIL: ${expirationDate}` : 'DISABLED'} `;

    if (superUserFeature || showSupportBanner) {
      const className = cx({ container: true, isDisabled: !superUserFeature });
      return (
        <div className={className}>
          {displayText}
          <button onClick={toggleSuperUser}>Click to {superUserFeature ? 'disable' : 'enable'}</button>
          {!superUserFeature && <button onClick={() => setShowSupportBanner(false)}>Hide</button>}
        </div>
      );
    }
  }

  return null;
};

export default SuperUserBanner;
