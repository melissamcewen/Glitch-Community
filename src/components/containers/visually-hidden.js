import React from 'react';
import PropTypes from 'prop-types';
import { visuallyHidden } from '../global.styl';

const VisuallyHidden = ({ children, as: Component }) => (
  <Component className={visuallyHidden}>{children}</Component>
);
VisuallyHidden.propTypes = {
  children: PropTypes.node.isRequired,
  as: PropTypes.any,
};
VisuallyHidden.defaultProps = {
  as: 'div',
};

export default VisuallyHidden;
