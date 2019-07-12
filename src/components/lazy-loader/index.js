import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';


LazyLoader.propTypes = {
  children: PropTypes.func.isRequired,
  ratio: PropTypes.number,
};

LazyLoader.defaultProps = {
  ratio: 0,
};

export default LazyLoader;