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

  useEffect(() => {
    const keyHandler = (event) => {
      if (['Escape', 'Esc'].includes(event.key)) {
        event.preventDefault();
        setTooltipIsActive(false);
      }
    };
    window.addEventListener('keyup', keyHandler);
    return () => window.removeEventListener('keyup', keyHandler);
  }, [tooltipIsActive]);

  const tooltipContainerClassName = cx({
    'tooltip-container': true,
  });
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

  let tooltipNode = null;
  if (!fallback) {
    tooltipNode = (
      <div role={role} id={id} className={tooltipClassName} style={{ opacity: shouldShowTooltip ? 1 : 0 }}>
        {type === 'info' || shouldShowTooltip ? tooltip : null}
      </div>
    );
  }

  return (
    <div className={tooltipContainerClassName}>
      <div
        onMouseEnter={() => setTooltipIsActive(true)}
        onMouseLeave={() => setTooltipIsActive(false)}
        onFocus={() => setTooltipIsActive(true)}
        onBlur={() => setTooltipIsActive(false)}
      >
        {extendedTarget}
      </div>
      {tooltipNode}
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
