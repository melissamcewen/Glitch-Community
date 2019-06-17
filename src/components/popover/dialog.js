import React, { useState, useEffect, useLayoutEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { debounce } from 'lodash';

import { PopoverToggleContext } from './container';
import styles from './styles.styl';

const useOpenedFromKeyboardFocus = (focusOnDialog) => {
  const ref = useRef();
  const { status: popoverStatus } = useContext(PopoverToggleContext);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || popoverStatus !== 'openedFromKeyboard') return;
    // focus on the dialog if there is only a destructible item in the popover that shouldn't automatically be focused on
    if (focusOnDialog) {
      dialog.focus();
    } else {
      const focusableElements =
        'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled])';
      const focusableDialogElement = dialog.querySelector(focusableElements);
      if (focusableDialogElement) {
        focusableDialogElement.focus();
      }
    }
  }, [popoverStatus]);
  return { ref };
};

const usePositionAdjustment = ({ margin }) => {
  const [offset, setOffset] = useState({ top: 0, left: 0 });
  const ref = useRef();
  useLayoutEffect(() => {
    const setPosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect) {
          if (rect.left < margin) {
            setOffset((prevOffset) => ({ ...prevOffset, left: margin - rect.left }));
          } else if (rect.right > window.innerWidth - margin) {
            setOffset((prevOffset) => ({ ...prevOffset, left: window.innerWidth - margin - rect.right }));
          } else {
            setOffset((prevOffset) => ({ ...prevOffset, left: 0 }));
          }
        }
      }
    };
    const debounced = debounce(setPosition, 300);
    window.addEventListener('resize', debounced);
    setPosition();
    return () => window.removeEventListener('resize', debounced);
  }, [margin]);
  return { ref, offset };
};

const mergeRefs = (...refs) => (element) => {
  refs.forEach((ref) => {
    ref.current = element;
  });
};

const alignTypes = ['none', 'left', 'right', 'topLeft', 'topRight'];
const PopoverDialog = ({ children, align, wide, className, focusOnDialog }) => {
  const { ref: positionRef, offset } = usePositionAdjustment({ margin: 12 });
  const { ref: focusRef } = useOpenedFromKeyboardFocus(focusOnDialog);
  const focusProps = focusOnDialog ? { tabIndex: 0 } : {};
  return (
    <div className={classnames(styles.popoverWrap, wide && styles.wide, align !== 'none' && styles[align], className)}>
      <dialog ref={mergeRefs(positionRef, focusRef)} className={styles.popover} style={offset} {...focusProps}>
        {children}
      </dialog>
    </div>
  );
};

PopoverDialog.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(alignTypes).isRequired,
  wide: PropTypes.bool,
  className: PropTypes.string,
  focusOnDialog: PropTypes.bool,
};
PopoverDialog.defaultProps = {
  wide: false,
  className: '',
  focusOnDialog: false,
};

export default PopoverDialog;
