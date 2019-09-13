import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '@fogcreek/shared-components';

import TransparentButton from 'Components/buttons/transparent-button';
import Arrow from 'Components/arrow';
import styles from './results-list.styl';

const ResultsList = ({ scroll, items, className, children }) => (
  <div className={classnames(scroll && styles.scrollContainer, className)}>
    <ul className={styles.resultsList}>
      {items.map((item, i) => (
        <li key={item.id} className={classnames(styles.resultItemWrap)}>
          {children(item, i)}
        </li>
      ))}
    </ul>
  </div>
);

ResultsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.node.isRequired })).isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  scroll: PropTypes.bool,
};

ResultsList.defaultProps = {
  className: '',
  scroll: false,
};

export default ResultsList;

export const ResultItem = ({ className, onClick, href, children, active, selected }) => {
  const buttonRef = useRef();
  useEffect(() => {
    if (active) {
      setTimeout(() => {
        buttonRef.current.focus();
      }, 0);
    }
  }, [active]);

  return (
    <div className={classnames(className, styles.resultItem, href && styles.withLink, { [styles.selected]: active || selected })}>
      <TransparentButton className={styles.resultItemButton} onClick={onClick} ref={buttonRef}>
        <span className={styles.resultWrap}>
          {children}
        </span>
      </TransparentButton>
      {href && (
        <div className={styles.linkButtonWrap}>
          <Button as="a" size="small" href={href} target="blank">
            View <Arrow />
          </Button>
        </div>
      )}
    </div>
  );
};

const withClass = (Component, baseClassName) => ({ children, className, ...props }) => (
  <Component className={classnames(className, baseClassName)} {...props}>
    {children}
  </Component>
);

export const ResultInfo = withClass('div', styles.resultInfo);
export const ResultName = withClass('div', styles.resultName);
export const ResultDescription = withClass('div', styles.resultDescription);
