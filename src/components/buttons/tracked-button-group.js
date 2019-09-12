import React from 'react';
import PropTypes from 'prop-types';
import TrackedButton from 'Components/buttons/tracked-button';

const TrackedButtonGroup = ({ actions }) =>
  Object.entries(actions)
    .filter(([, onClick]) => onClick)
    .map(([label, onClick]) => (
      <TrackedButton key={label} size="small" variant="secondary" label={label} onClick={onClick}>
        {label}
      </TrackedButton>
    ));

TrackedButtonGroup.propTypes = {
  actions: PropTypes.object.isRequired,
};

export default TrackedButtonGroup;
