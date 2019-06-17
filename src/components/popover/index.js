import React, { useState, useContext, useMemo, createContext } from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';

import PopoverContainer from './container';
import PopoverDialog from './dialog';
import PopoverSearch from './search';
import { PopoverSection, PopoverActions, PopoverInfo, PopoverTitle, InfoDescription, ActionDescription } from './base';
import styles from './styles.styl';
import globalStyles from '../global.styl';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

export {
  PopoverContainer,
  PopoverDialog,
  PopoverSearch,
  PopoverSection,
  PopoverActions,
  PopoverInfo,
  PopoverTitle,
  InfoDescription,
  ActionDescription,
};

const MultiPopoverContext = createContext();

export const MultiPopover = ({ views, initialView, children }) => {
  const [activeView, setActiveView] = useState(initialView);
  const multiPopoverState = useMemo(() => ({ activeView, setActiveView }), [activeView]);
  const activeViewFunc = activeView ? views[activeView] : children;
  const showViewMap = mapValues(views, (_, viewName) => () => setActiveView(viewName));

  return <MultiPopoverContext.Provider value={multiPopoverState}>{activeViewFunc(showViewMap)}</MultiPopoverContext.Provider>;
};

MultiPopover.propTypes = {
  views: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
  initialView: PropTypes.string,
};

MultiPopover.defaultProps = {
  initialView: null,
};

export const MultiPopoverTitle = ({ children }) => {
  const { setActiveView, defaultView } = useContext(MultiPopoverContext);
  return (
    <TransparentButton onClick={() => setActiveView(defaultView)} aria-label="go back">
      <PopoverTitle>
        <div className={styles.backArrow}>
          <div className="left-arrow icon" />
        </div>
        &nbsp;
        {children}
      </PopoverTitle>
    </TransparentButton>
  );
};
MultiPopoverTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

export const PopoverWithButton = ({ buttonProps, buttonText, children: renderChildren, onOpen }) => (
  <div className={styles.popoverWithButtonWrap}>
    <PopoverContainer onOpen={onOpen}>
      {(popoverProps) => (
        <div>
          <div className={styles.buttonWrap}>
            <Button {...buttonProps} onClick={popoverProps.togglePopover}>
              {buttonText}
            </Button>
          </div>
          {popoverProps.visible && renderChildren(popoverProps)}
        </div>
      )}
    </PopoverContainer>
  </div>
);

PopoverWithButton.propTypes = {
  buttonProps: PropTypes.object,
  buttonText: PropTypes.node.isRequired,
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
};

PopoverWithButton.defaultProps = {
  buttonProps: {},
  onOpen: null,
};

export const PopoverMenu = ({ label, children: renderChildren, onOpen }) => (
  <div className={styles.popoverMenuWrap}>
    <PopoverContainer onOpen={onOpen}>
      {(popoverProps) => (
        <div>
          <div className={styles.buttonWrap}>
            <TransparentButton onClick={popoverProps.togglePopover}>
              <div className={styles.arrowPadding}>
                <div className={styles.downArrow} />
              </div>
              <div className={globalStyles.visuallyHidden}>{label}</div>
            </TransparentButton>
          </div>
          {popoverProps.visible && renderChildren(popoverProps)}
        </div>
      )}
    </PopoverContainer>
  </div>
);

PopoverMenu.propTypes = {
  label: PropTypes.string,
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
};

PopoverMenu.defaultProps = {
  label: 'options',
  onOpen: null,
};

// Use with PopoverMenu so that popover can correctly adjust to fit the content
export const PopoverMenuButton = ({ label, emoji, onClick }) => (
  <div className={styles.menuButtonWrap}>
    <Button size="small" type="tertiary" emoji={emoji} onClick={onClick}>
      <div className={styles.popoverButtonContent}>
        {label}
      </div>
    </Button>
  </div>
);

PopoverMenuButton.propTypes = {
  label: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
