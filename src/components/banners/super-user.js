import React from 'react';
import { useSuperUserHelpers } from 'State/current-user';
import { Button } from '@fogcreek/shared-components';

import styles from './super-user.styl';

const SuperUserBanner = () => {
  const { superUserFeature, toggleSuperUser } = useSuperUserHelpers();

  if (!superUserFeature) return null;

  const expirationDate = superUserFeature && new Date(superUserFeature.expiresAt).toLocaleString();
  const displayText = `SUPER USER MODE ENABLED UNTIL: ${expirationDate} `;
  return (
    <div className={styles.container}>
      {displayText}
      <Button onClick={toggleSuperUser}>Click to disable</Button>
    </div>
  );
};

export default SuperUserBanner;
