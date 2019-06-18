/**
 * Login page for Glitch VS Code Plugin
 */
import React from 'react';
import PropTypes from 'prop-types';

import PopoverContainer from 'Components/popover/container';
import Text from 'Components/text/text';
import { SignInPopBase as SignInPop } from 'Components/sign-in-pop';
import { useCurrentUser } from 'State/current-user';

import styles from './vscode-auth.styl';

const VSCodeAuth = ({ insiders, openProject }) => {
  const { currentUser } = useCurrentUser();
  const { persistentToken, login } = currentUser;
  const isSignedIn = persistentToken && login;

  const redirectMessage = "You are being redirected. (If you aren't sent back to VSCode, try the \"Glitch: Sign In With Email\" command.)";
  const signInMessage = 'Please Sign In to continue.';

  if (isSignedIn) {
    setTimeout(() => {
      const scheme = insiders ? 'vscode-insiders' : 'vscode';
      window.location.assign(`${scheme}://glitch.glitch/token?token=${persistentToken}&openProject=${openProject}`);
    }, 3000);
  }

  return (
    <div className={styles.content}>
      <Text defaultMargin>{isSignedIn ? redirectMessage : signInMessage}</Text>
      {!isSignedIn &&
        <PopoverContainer>
          {() => <SignInPop align="none" />}
        </PopoverContainer>
      }
    </div>
  );
};

VSCodeAuth.propTypes = {
  insiders: PropTypes.bool,
  openProject: PropTypes.bool,
};

VSCodeAuth.defaultProps = {
  insiders: false,
  openProject: false,
};

export default VSCodeAuth;
