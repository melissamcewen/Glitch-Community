import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@fogcreek/shared-components';

import useUniqueId from 'Hooks/use-unique-id';
import styles from './skip-section-buttons.styl';

const SkipSectionButtons = ({ children, sectionName }) => {
  const beforeRef = useRef();
  const afterRef = useRef();

  const beforeId = useUniqueId();
  const afterId = useUniqueId();

  const moveFocusToAfter = () => {
    afterRef.current.focus();
  };

  const moveFocusToBefore = () => {
    beforeRef.current.focus();
  };

  return (
    <div>
      <Button ref={beforeRef} onClick={moveFocusToAfter} id={beforeId} className={styles.visibleOnFocus}>
        Skip to After {sectionName}
      </Button>
      {children}
      <Button ref={afterRef} onClick={moveFocusToBefore} id={afterId} className={styles.visibleOnFocus}>
        Skip to Before {sectionName}
      </Button>
    </div>
  );
};


SkipSectionButtons.propTypes = {
  sectionName: PropTypes.string,
};

SkipSectionButtons.defaultProps = {
  sectionName: 'This Section',
};

export default SkipSectionButtons;
