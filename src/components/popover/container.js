import React, { useState, useEffect, useMemo, createContext } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

// statuses: 'closed' | 'openedFromKeyboard' | 'openedFromClick'
const usePopoverToggle = ({ startOpen, onOpen, triggerButtonRef }) => {
  const [status, setStatus] = useState(startOpen ? 'openedFromKeyboard' : 'closed');
  const openPopover = (event) => {
    if (event && event.detail === 0) {
      setStatus('openedFromKeyboard');
    } else {
      setStatus('openedFromClick');
    }
    if (onOpen) {
      onOpen();
    }
  };
  const closePopover = () => {
    setStatus('closed');
  };

  const togglePopover = (event) => {
    if (status === 'closed') {
      openPopover(event);
    } else {
      closePopover();
    }
  };

  const toggleAndCall = (func) => {
    if (!func) return null;
    return (...args) => {
      togglePopover();
      return func(...args);
    };
  };

  useEffect(() => {
    if (status === 'closed') return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setStatus('closed');
        if (triggerButtonRef && triggerButtonRef.current) {
          triggerButtonRef.current.focus();
        }
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [status]);

  return useMemo(
    () => ({
      status,
      visible: status !== 'closed',
      setStatus,
      openPopover,
      closePopover,
      togglePopover,
      toggleAndCall,
    }),
    [status],
  );
};

// onClickOutside requires the component to have a prototype, which arrow functions do not have
const IdentityComponent = function IdentityComponent({ children }) { return children; };
const MonitoredComponent = onClickOutside(IdentityComponent, {
  handleClickOutside: (component) => component.props.onClickOutside,
});

export const PopoverToggleContext = createContext(null);

const PopoverContainer = ({ children, onOpen, outer, startOpen, triggerButtonRef }) => {
  const toggleState = usePopoverToggle({ startOpen, onOpen, triggerButtonRef });

  const inner = children(toggleState);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(toggleState) : null;
  return (
    <PopoverToggleContext.Provider value={toggleState}>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={toggleState.closePopover}>
        {inner}
      </MonitoredComponent>
    </PopoverToggleContext.Provider>
  );
};
PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  /* ref to the button that opened the popover. Used to reset focus back to that button after the user closes the popover by pressing escape */
  triggerButtonRef: PropTypes.object,
  onOpen: PropTypes.func,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  onOpen: null,
  outer: null,
  startOpen: false,
  triggerButtonRef: null,
};

export default PopoverContainer;
