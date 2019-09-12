import React from 'react';
import { Button } from '@fogcreek/shared-components';
import { useTrackedFunc } from 'State/segment-analytics';

const TrackedButton = ({ children, label, onClick, ...props }) => {
  const trackedOnClick = useTrackedFunc(onClick, label);
  return (
    <Button {...props} onClick={trackedOnClick}>
      {children}
    </Button>
  );
};

export default TrackedButton;
