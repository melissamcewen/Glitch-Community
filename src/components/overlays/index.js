import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './overlays.styl';

export const Overlay = ({ children, className }) => {
  const overlayClass = classNames(styles.overlay, className);
  return (
    <dialog className={overlayClass} open>
      {children}
    </dialog>
  );
};
Overlay.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
Overlay.defaultProps = {
  className: null,
};

export const OverlaySection = ({ children, type }) => {
  const sectionClass = classNames(styles.section, styles[type]);
  return (
    <section className={sectionClass}>
      {children}
    </section>
  );
};
OverlaySection.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['info', 'actions']).isRequired,
};

export const OverlayTitle = ({ children }) => (
  <h1 className={styles.title}>
    {children}
  </h1>
);
OverlayTitle.propTypes = {
  children: PropTypes.node.isRequired,
};
