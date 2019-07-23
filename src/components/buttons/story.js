import React from 'react';
import { storiesOf } from '@storybook/react';
import 'Components/global.styl';

import Button from './button';
import CheckboxButton from './checkbox-button'
import BookmarkButton from './bookmark-button'
import Emoji from 'Components/images/emoji';
import Image from 'Components/images/image';
import { withState } from '../../../stories/util';

const helloAlert = () => {
  alert('hello');
};

storiesOf('Button', module)
  .add('regular', () => <Button onClick={helloAlert}>Hello Button</Button>)
  .add('cta', () => (
    <Button type="cta" onClick={helloAlert}>
      CTA Button!
    </Button>
  ))
  .add('small', () => (
    <Button size="small" onClick={helloAlert}>
      Small Button
    </Button>
  ))
  .add('tertiary', () => (
    <Button type="tertiary" size="small" onClick={helloAlert}>
      Tertiary (Small) Button
    </Button>
  ))
  .add('danger zone (red on hover)', () => (
    <Button type="dangerZone" size="small" onClick={helloAlert}>
      Destructive Action
    </Button>
  ))
  .add('link (click to a different page)', () => <Button href="https://support.glitch.com">Support</Button>)
  .add('with emoji', () => (
    <Button emoji="sunglasses" imagePosition="left">
      Show
    </Button>
  ))
  .add('with an image', () => <Button image={<Image width={16} height={16} src="https://cdn.glitch.com/team-avatar/74/small?689" alt="" />}>Glitch</Button>)
  .add(`match background`, () => (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#F5F5F5' }}>
      <Button onClick={helloAlert} matchBackground={true}>
        Support <Emoji name="ambulance" />
      </Button>
    </div>
  ))
  .add(
    `checkbox`,
    withState(false, ({ state, setState }) => (
      <>
        <CheckboxButton value={state} onChange={setState}>
          Click to toggle!
        </CheckboxButton>
        <p>
          <label>
            <input type="checkbox" checked={state} onChange={(evt) => setState(evt.target.checked)} />← linked state
          </label>
        </p>
      </>
    )),
  )
  .add('BookmarkButton', () => (
    <BookmarkButton />
  ))