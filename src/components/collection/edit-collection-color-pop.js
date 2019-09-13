import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { Button, Icon, TextInput } from '@fogcreek/shared-components';

import { isGoodColorContrast, pickRandomColor } from 'Utils/color';
import ColorInput from 'Components/inputs/color';
import { PopoverWithButton, PopoverDialog, PopoverInfo, PopoverActions } from 'Components/popover';

import styles from './edit-collection-color-pop.styl';
import { emoji } from '../global.styl';

const formatAndValidateHex = (hex) => {
  if (!hex) return null;
  hex = hex.trim();
  if (!hex.startsWith('#')) {
    hex = `#${hex}`;
  }
  // #ff00ff
  if (/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
    return hex;
  }
  // #f0f
  if (/^#?[0-9A-Fa-f]{3}$/.test(hex)) {
    const [, r, g, b] = hex.split('');
    return ['#', r, r, g, g, b, b].join('');
  }
  return null;
};

function EditCollectionColorPop({ initialColor, updateColor, togglePopover }) {
  const [color, setColor] = useState(initialColor);
  const [hex, setHex] = useState(initialColor);
  const [error, setError] = useState(false);

  const changeColor = (value) => {
    setColor(value);
    setHex(value);
    updateColor(value);
  };

  const setRandomColor = () => {
    changeColor(pickRandomColor());
  };

  const onChangeColorPicker = useMemo(() => throttle(changeColor, 100), []);

  const onChangeHex = (value) => {
    setHex(value);

    const formatted = formatAndValidateHex(value);
    if (!formatted) {
      setError('Invalid Hex');
      return;
    }

    const hexIsGoodColorContrast = isGoodColorContrast(value);
    if (!hexIsGoodColorContrast) {
      setError('This color might make text hard to read. Try another!');
      return;
    }

    setColor(formatted);
    updateColor(formatted);
    setError(false);
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      togglePopover();
    } else {
      setError(false);
    }
  };

  return (
    <PopoverDialog align="left" className={styles.container}>
      <PopoverInfo>
        <div className={styles.colorFormWrap}>
          <ColorInput value={color} onChange={onChangeColorPicker} />
          <div className={styles.hexWrap}>
            <TextInput
              autoFocus
              opaque
              value={hex}
              onChange={onChangeHex}
              onKeyPress={keyPress}
              placeholder="Hex"
              label="Custom color hex"
              error={error}
            />
          </div>
        </div>
      </PopoverInfo>

      <PopoverActions type="secondary">
        <Button size="small" variant="secondary" onClick={setRandomColor}>
          Random
          <Icon className={emoji} icon="bouquet" />
        </Button>
      </PopoverActions>
    </PopoverDialog>
  );
}

const EditCollectionColor = ({ update, initialColor }) => (
  <PopoverWithButton containerClass="edit-collection-color-btn" buttonClass="add-project" buttonText="Color">
    {({ togglePopover }) => <EditCollectionColorPop updateColor={update} initialColor={initialColor} togglePopover={togglePopover} />}
  </PopoverWithButton>
);

EditCollectionColor.propTypes = {
  update: PropTypes.func.isRequired,
  initialColor: PropTypes.string.isRequired,
};

export default EditCollectionColor;
