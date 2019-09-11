import React from 'react';
import Text from 'Components/text/text';
import { Button, Icon } from '@fogcreek/shared-components';
import { getEditorUrl } from 'Models/project';
import { emoji } from '../global.styl';

const MadeOnGlitch = () => (
  <>
    <Text defaultMargin>Of course, this site was made on Glitch too.</Text>
    <Button as="a" href={getEditorUrl('community')}>
      View Source
      <Icon className={emoji} icon="carpStreamer" />
    </Button>
  </>
);

export default MadeOnGlitch;
