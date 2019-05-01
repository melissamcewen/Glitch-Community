import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isFragment } from 'react-is';

/*
A popover is a light, hollow roll made from an egg batter similar to
that of Yorkshire pudding, typically baked in muffin tins or dedicated
popover pans, which have straight-walled sides rather than angled.

...also it's a [Bootstrap UI pattern](https://www.w3schools.com/bootstrap/bootstrap_popover.asp)
*/

class UnmonitoredComponent extends React.Component {
  handleClickOutside() {
    this.props.onClickOutside();
  }

  render() {
    return this.props.children;
  }
}

const MonitoredComponent = onClickOutside(UnmonitoredComponent);

const PopoverContainer = ({ children, onOpen, outer, startOpen }) => {
  const [visible, setVisibleState] = React.useState(startOpen);
  const setVisible = (newVisible) => {
    if (!visible && newVisible && onOpen) onOpen();
    setVisibleState(newVisible);
  };
  const togglePopover = (event) => {
    setVisible(!visible);
    if (event.detail === 0) {
      // opened on keyboard press - should focus on first tabbable element in pop-over here
    }
  };

  const focusDialog = (element) => {
    if (element) element.focus();
  };

  React.useEffect(() => {
    if (!visible) return undefined;
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setVisible(false);
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [visible]);

  const props = { visible, setVisible, togglePopover, focusDialog };

  const inner = children(props);
  if (isFragment(inner)) {
    console.error('PopoverContainer does not support Fragment as the top level item. Please use a different element.');
  }
  const before = outer ? outer(props) : null;

  return (
    <>
      {before}
      <MonitoredComponent excludeScrollbar onClickOutside={() => setVisible(false)}>
        {inner}
      </MonitoredComponent>
    </>
  );
};
PopoverContainer.propTypes = {
  children: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  outer: PropTypes.func,
  startOpen: PropTypes.bool,
};
PopoverContainer.defaultProps = {
  onOpen: null,
  outer: null,
  startOpen: false,
};

export default PopoverContainer;
