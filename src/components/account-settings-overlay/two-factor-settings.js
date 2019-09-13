import React, { useEffect, useState } from 'react';
import { Button, Loader, TextInput } from '@fogcreek/shared-components';

import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Notification from 'Components/notification';

import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';

import styles from './styles.styl';

function TwoFactorSettings() {
  const { currentUser, reload } = useCurrentUser();
  const { twoFactorEnabled } = currentUser;

  const api = useAPI();
  const [working, setWorking] = useState(false);
  const [secret, setSecret] = useState(undefined);
  const [code, setCode] = useState('');
  const [done, setDone] = useState(false);
  const [backupCodes, setBackupCodes] = useState(null);

  const [QRCode, setQRCode] = useState(null);
  useEffect(() => {
    if (QRCode) return;
    const loadQRCode = async () => {
      setQRCode(await import(/* webpackChunkName: "qrcode-bundle" */ 'qrcode'));
    };
    loadQRCode();
  }, []);

  const disableTwoFactor = async (evt) => {
    evt.preventDefault();
    setDone(false);
    setWorking(true);
    try {
      await api.post('user/tfa/disable');
      await reload();
      setDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  };

  const generateSecret = async (evt) => {
    evt.preventDefault();
    setDone(false);
    setWorking(true);
    try {
      const response = await api.post('user/tfa/generateSecret');
      const qrcode = await QRCode.toDataURL(response.data.twoFactorKeyUri);
      setSecret(qrcode);
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  };

  const verifyCode = async (evt) => {
    evt.preventDefault();
    setWorking(true);
    try {
      await api.post('user/tfa/verifyInitialCode', { code });
      await reload();
      setSecret(undefined);
      setCode('');
      setDone(true);
    } catch (error) {
      console.error(error);
    } finally {
      setWorking(false);
    }
  };

  const getBackupCodes = async () => {
    if (twoFactorEnabled) {
      const { data } = await api.get(`users/${currentUser.id}/tfa/backupCodes?cache=${Date.now()}`);
      setBackupCodes(data.backupCodes);
    } else {
      setBackupCodes(null);
    }
  };

  useEffect(() => {
    getBackupCodes();
  }, [currentUser.id, twoFactorEnabled]);

  const resetBackupCodes = async () => {
    setBackupCodes(null);
    await api.post('user/tfa/resetBackupCodes');
    await getBackupCodes();
  };

  return (
    <>
      <Heading tagName="h2">Two-Factor Authentication</Heading>
      <Text>Protect your account with an additional layer of security.</Text>
      {twoFactorEnabled ? (
        <>
          {done && (
            <Notification type="success" persistent>
              Successfully enabled two-factor authentication
            </Notification>
          )}
          <Button variant="secondary" size="small" disabled={working} onClick={disableTwoFactor}>
            Disable Authenticator App
          </Button>
          <Heading tagName="h3">Backup Codes</Heading>
          <Text>Keep these somewhere safe in case you lose your authenticator</Text>
          {backupCodes ? (
            <>
              {backupCodes.length > 0 && (
                <ul className={styles.backupCodes}>
                  {backupCodes.map((backupCode) => (
                    <li className={styles.backupCode} key={backupCode}>
                      {backupCode}
                    </li>
                  ))}
                </ul>
              )}
              <Button type="tertiary" size="small" onClick={resetBackupCodes}>
                Generate New Codes
              </Button>
            </>
          ) : (
            <Loader style={{ width: '25px' }} />
          )}
        </>
      ) : (
        <>
          {done && (
            <Notification type="success" persistent>
              Successfully disabled two-factor authentication
            </Notification>
          )}
          <Button variant="secondary" size="small" disabled={!!secret || working} onClick={generateSecret}>
            Enable Authenticator App
          </Button>
          {secret && (
            <form className={styles.accountSettingsForm} onSubmit={verifyCode}>
              <img alt="QR Code" src={secret} />
              <TextInput
                label="Enter Authenticator Code"
                maxLength={6}
                value={code}
                disabled={working}
                onChange={setCode}
              />
              <Button type="tertiary" size="small" disabled={code.length < 6 || working} submit>
                Verify Initial Code
              </Button>
            </form>
          )}
        </>
      )}
    </>
  );
}

export default TwoFactorSettings;
