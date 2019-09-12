import React, { useState } from 'react';
import { Button, Icon } from '@fogcreek/shared-components';

import Link from 'Components/link';
import Logo from 'Components/header/logo';
import TransparentButton from 'Components/buttons/transparent-button';
import SignInButton, { companyNames } from 'Components/buttons/sign-in-button';
import Image from 'Components/images/image';
import UseMagicCode from 'Components/sign-in/use-magic-code';
import GetMagicCode from 'Components/sign-in/get-magic-code';

import styles from './sign-in-layout.styl';
import { emoji } from '../global.styl';

const keyImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

const TermsAndConditions = () => (
  <div className={styles.termsAndConditions}>
    By signing into Glitch, you agree to our <Link to="/legal/#tos">Terms of Services</Link> and <Link to="/legal/#privacy">Privacy Statement</Link>
  </div>
);

const savingThisForLater = () => (
  <div className={styles.useCode}>
    <UseMagicCode />
  </div>
);

const SignInLayout = () => {
  const [page, setPage] = useState('main');
  const showMainPage = () => setPage('main');
  const showMagicPage = () => setPage('magic');

  return (
    <div className={styles.layout}>
      <div className={styles.logo}>
        <Link to="/">
          <Logo />
        </Link>
      </div>
      <div className={styles.overlay}>
        <section className={styles.title}>
          {page === 'main' && <h1>Sign In</h1>}
          {page === 'magic' && (
            <TransparentButton onClick={showMainPage}>
              <div className={styles.magicCode}>
                <span className={styles.backArrow}>
                  <span className="left-arrow icon" />
                </span>
                <h1>Magic Code via Email</h1>
              </div>
            </TransparentButton>
          )}
        </section>
        <section className={styles.content}>
          {page === 'main' && (
            <div className={styles.oAuth}>
              <div>
                <div className={styles.signInButtons}>
                  {companyNames.map((companyName) => (
                    <div key={companyName} className={styles.signInButton}>
                      <SignInButton short companyName={companyName} />
                    </div>
                  ))}
                </div>
                <div className={styles.signInButtons}>
                  <Button emoji="loveLetter" onClick={showMagicPage}>
                    Magic Code via Email
                  </Button>
                </div>
              </div>
              <TermsAndConditions />
            </div>
          )}
          {page === 'magic' && (
            <>
              <div className={styles.getCode}>
                <GetMagicCode />
                <TermsAndConditions />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default SignInLayout;
