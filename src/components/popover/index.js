import React, { useState, useContext, useMemo, createContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { mapValues } from 'lodash';
import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';

import PopoverContainer from './container';
import PopoverDialog from './dialog';
import styles from './styles.styl';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

export { PopoverContainer, PopoverDialog };

const sectionTypes = ['primary', 'secondary', 'dangerZone'];
export const PopoverSection = ({ className, children, type }) => (
  <section className={classnames(styles.popoverSection, styles[type], className)}>{children}</section>
);

PopoverSection.propTypes = {
  type: PropTypes.oneOf(sectionTypes),
  children: PropTypes.node.isRequired,
};

PopoverSection.defaultProps = {
  type: 'primary',
};

export const PopoverActions = ({ ...props }) => <PopoverSection {...props} className={styles.popoverActions} />;
export const PopoverInfo = ({ ...props }) => <PopoverSection {...props} className={styles.popoverInfo} />;

const styled = (Component, baseClassName) => ({ className, ...props }) => <Component className={classnames(className, baseClassName)} {...props} />;
export const PopoverTitle = styled('div', styles.popoverTitle);
export const InfoDescription = styled('p', styles.infoDescription);

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
      <PopoverSection type="secondary">
        <PopoverTitle>
          <div className={styles.backArrow}>
            <div className="left-arrow icon" />
          </div>
          &nbsp;
          {children}
        </PopoverTitle>
      </PopoverSection>
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
