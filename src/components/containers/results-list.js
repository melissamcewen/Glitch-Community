import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TransparentButton from 'Components/buttons/transparent-button';
import Button from 'Components/buttons/button';
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
    <div className={classnames(className, styles.resultItem, href && styles.withLink, selected && styles.selected)}>
      <TransparentButton className={styles.resultItemButton} onClick={onClick} ref={buttonRef}>
        <div className={styles.resultWrap}>
          {children}
        </div>
      </TransparentButton>
      {href && (
        <div className={styles.linkButtonWrap}>
          <Button size="small" href={href} newTab>
            View <span aria-hidden="true">→</span>
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
