import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import Image from 'Components/images/image';
import MaskImage from 'Components/images/mask-image';
import { BookmarkAvatar } from 'Components/images/avatar';

import { withState } from '../../../stories/util';

storiesOf('Image', module)
  .add('regular', () => <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />)
  .add('background Image', () => (
    <Image backgroundImage src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" />
  ))
  .add('srcSet', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg"
      srcSet={[
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg?x=2 1000w',
        'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg?x=1 2000w',
      ]}
      alt="Glitch Logo"
    />
  ))
  .add('width & height', () => (
    <Image src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg" alt="Glitch Logo" width="200" height="200" />
  ))
  .add('width & height with background image', () => (
    <Image
      src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg"
      backgroundImage
      alt="Glitch Logo"
      width="200px"
      height="200px"
    />
  ));

storiesOf('MaskImage', module)
  .add('random mask', () => <MaskImage src="https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg" />)
  .add(
    'select mask',
    withState('mask1', ({ state, setState }) => (
      <div>
        <MaskImage maskClass={state} src="https://glitch.com/culture/content/images/2018/10/react-starter-kit-1.jpg" />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="mask1">Mask 1</option>
          <option value="mask2">Mask 2</option>
          <option value="mask3">Mask 3</option>
          <option value="mask4">Mask 4</option>
        </select>
      </div>
    )),
  );

storiesOf('BookmarkAvatar', module).add('regular', () => (
  <div style={{ height: '100px', width: '100px' }}>
    <BookmarkAvatar />
  </div>
));
