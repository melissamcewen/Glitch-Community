import React from 'react';
import classnames from 'classnames';

import TooltipContainer from 'Components/tooltips/tooltip-container';
import HiddenCheckbox from 'Components/fields/hidden-checkbox';

import styles from './styles.styl';

const privateText = 'Only members can view code';
const publicText = 'Visible to everyone';

export const PrivateIcon = ({ className, label, inButton, isPrivate }) => (
  <span
    className={classnames(className, styles.projectBadge, isPrivate ? styles.private : styles.public, inButton && styles.inButton)}
    aria-label={label}
  />
);

PrivateIcon.defaultProps = {
  label: privateText,
};

export const PrivateBadge = () => (
  <TooltipContainer type="info" tooltip={privateText} target={<PrivateIcon isPrivate label={privateText} />} />
);

export const PrivateToggle = ({ isPrivate, setPrivate }) => (
  <TooltipContainer
    type="action"
    tooltip={isPrivate ? privateText : publicText}
    target={
      <HiddenCheckbox value={isPrivate} onChange={setPrivate}>
        <PrivateIcon isPrivate={isPrivate} className={styles.button} label={privateText} />
      </HiddenCheckbox>
    }
  />
);
