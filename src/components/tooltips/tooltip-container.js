import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import useUniqueId from 'Hooks/use-unique-id';
import styles from './tooltip.styl';

const cx = classNames.bind(styles);

export const TYPES = ['action', 'info'];
export const ALIGNMENTS = ['left', 'right', 'center', 'top'];

function TooltipContainer({ type, tooltip, target, align, persistent, children, fallback, newStuff }) {
  const [tooltipIsActive, setTooltipIsActive] = useState(false);

  useEffect(
    () => {
      const keyHandler = (event) => {
        if (['Escape', 'Esc'].includes(event.key)) {
          event.preventDefault();
          setTooltipIsActive(false);
        }
      };
      window.addEventListener('keyup', keyHandler);
      return () => window.removeEventListener('keyup', keyHandler);
    },
    [tooltipIsActive],
  );

  const id = useUniqueId();

  const tooltipClassName = cx({
    tooltip: true,
    top: align.includes('top'),
    left: align.includes('left'),
    right: align.includes('right'),
    newStuff,
    persistent,
    fallback,
  });
  const tooltipFallbackClassName = fallback ? styles.fallback : '';

  let role;
  let extendedTarget;

  if (fallback && target.type === 'img') {
    extendedTarget = (
      <div data-tooltip={tooltip} className={tooltipFallbackClassName}>
        {target}
      </div>
    );
  } else if (type === 'action') {
    // action tooltips are visible on hover and focus, click triggers a separate action
    // they should always be populated with their content, even when they are "hidden"
    role = 'tooltip';
    extendedTarget = React.cloneElement(target, {
      'aria-labelledby': id,
      'data-tooltip': tooltip,
      className: `${target.props.className} ${tooltipFallbackClassName}`,
    });
  } else if (type === 'info') {
    // info tooltips are visible on hover and focus, they provide supplementary info
    // they should be empty when not "visible", and populated when they are
    role = 'status';
    extendedTarget = React.cloneElement(target, {
      'aria-describedby': id,
      'data-tooltip': tooltip,
      className: `${target.props.className} ${tooltipFallbackClassName}`,
    });
  }

  const shouldShowTooltip = tooltip && (tooltipIsActive || persistent);

  function cancelClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  let tooltipNode = null;
  /*
   To select tooltip text, the user needs to click on the tooltip. Some tooltips are within buttons, links,
   or other click targets, so we need prevent those click events from propagating. The click handler on the
   tooltip cancels the click, so we don't need to expose that event via a keyboard handler.
  */
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  if (!fallback) {
    tooltipNode = (
      <div role={role} id={id} className={tooltipClassName} style={{ opacity: shouldShowTooltip ? 1 : 0 }} onClick={cancelClick}>
        {type === 'info' || shouldShowTooltip ? tooltip : null}
      </div>
    );
  }

  return (
    <div className={styles.tooltipContainer} onMouseEnter={() => setTooltipIsActive(true)} onMouseLeave={() => setTooltipIsActive(false)}>
      <div onFocus={() => setTooltipIsActive(true)} onBlur={() => setTooltipIsActive(false)}>
        {extendedTarget}
      </div>
      {align.includes('top') && (
        <span aria-hidden="true" onClick={cancelClick} className={cx({ invisibleHoverTarget: true, top: align.includes('top'), persistent })} />
      )}
      {tooltipNode}
      {!align.includes('top') && (
        <span aria-hidden="true" onClick={cancelClick} className={cx({ invisibleHoverTarget: true, top: align.includes('top'), persistent })} />
      )}
      {children}
    </div>
  );
}

TooltipContainer.propTypes = {
  children: PropTypes.node,
  /* the type of tooltip */
  type: PropTypes.oneOf(TYPES).isRequired,
  /* tooltip text */
  tooltip: PropTypes.string,
  /* the focus/hover target of the tooltip */
  target: PropTypes.node.isRequired,
  /* how to align the tooltip */
  align: PropTypes.arrayOf(PropTypes.oneOf(ALIGNMENTS)),
  /* whether to persistently show the tooltip */
  persistent: PropTypes.bool,
  /* whether to use CSS tooltips as a fallback (for < FF 66) */
  fallback: PropTypes.bool,
};

TooltipContainer.defaultProps = {
  align: ['center'],
  children: null,
  tooltip: '',
  persistent: false,
  fallback: false,
};

export default TooltipContainer;
