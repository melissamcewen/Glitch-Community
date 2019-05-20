import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './animations.styl';

const types = ['slideDown', 'slideUp', 'fadeOut'];

/* Usage:
<AnimationContainer type="slideDown" onAnimationEnd={(id) => deleteProject(id)}>
  {(animateOutAndDeleteProject) => (
    <Button onClick={() => animateOutAndDeleteProject(id)}>Delete Project</Button>
  )}
</AnimationContainer>
*/
const AnimationContainer = ({ type, children, className, onAnimationEnd }) => {
  const [state, setState] = useState({ active: false, handlerArgs: [] });
  const ref = useRef();

  return (
    <div
      ref={ref}
      className={classnames(className, state.active && styles[type])}
      onAnimationEnd={(event) => {
        if (event.target === ref.current) {
          onAnimationEnd(...state.handlerArgs);
        }
      }}
    >
      {children((...handlerArgs) => setState({ active: true, handlerArgs }))}
    </div>
  );
};
AnimationContainer.propTypes = {
  type: PropTypes.oneOf(types).isRequired,
  children: PropTypes.func.isRequired,
  onAnimationEnd: PropTypes.func.isRequired,
  className: PropTypes.string,
};

AnimationContainer.defaultProps = {
  className: '',
};

export default AnimationContainer;
