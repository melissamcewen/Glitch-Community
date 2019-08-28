import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import { Overlay, OverlaySection, OverlayTitle } from '.';
import TextInput from '../inputs/text-input';

const story = storiesOf('Overlays', module);

story.add('generic', () => (
  <Overlay>
    <OverlaySection type="info">
      <OverlayTitle>Title</OverlayTitle>
    </OverlaySection>
    <OverlaySection type="actions">Content Section 1</OverlaySection>
    <OverlaySection type="actions">Content Section 2</OverlaySection>
  </Overlay>
));

story.add('search bar', () => (
  <Overlay>
    <OverlaySection type="info">
      <TextInput opaque type="search" placeholder="Filter stuff" />
    </OverlaySection>
    <OverlaySection type="actions">Content Section 2</OverlaySection>
  </Overlay>
));

story.add('no title', () => (
  <Overlay>
    <OverlaySection type="actions">Content Section 1</OverlaySection>
    <OverlaySection type="actions">Content Section 2</OverlaySection>
  </Overlay>
));
