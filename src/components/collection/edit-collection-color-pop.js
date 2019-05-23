import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import { throttle } from 'lodash';

import TextInput from 'Components/inputs/text-input';
import ColorInput from 'Components/inputs/color';
import Emoji from 'Components/images/emoji';
import Button from 'Components/buttons/button';
import { PopoverWithButton, PopoverDialog, PopoverInfo, PopoverActions } from 'Components/popover';

const validHex = (hex) => /^#?[0-9A-Fa-f]{6}$/.test(hex);

function EditCollectionColorPop({ initialColor, updateColor, togglePopover }) {
  const [color, setColor] = useState(initialColor);
  const [hex, setHex] = useState(initialColor);
  const [hexInvalid, setHexInvalid] = useState(false);

  const changeColor = (value) => {
    setColor(value);
    setHex(value);
    updateColor(value);
  };

  const setRandomColor = () => {
    changeColor(randomColor({ luminosity: 'light' }));
  };

  const onChangeColorPicker = useMemo(() => throttle(changeColor, 100), []);

  const onChangeHex = (value) => {
    setHex(value);
    value = value.trim();
    if (validHex(value)) {
      value = value.replace(/^#/, '');
      setColor(value);
      updateColor(value);
      setHexInvalid(false);
      return;
    }
    setHexInvalid(true);
  };

  const keyPress = (e) => {
    if (e.key === 'Enter') {
      togglePopover();
    } else {
      setHexInvalid(false);
    }
  };

  return (
    <PopoverDialog align="left">
      <PopoverInfo>
        <div className={styles.colorFormWrap}>
        
        </div>
        
        

        <div className="custom-color-input">
          <TextInput
            opaque
            value={hex}
            onChange={(e) => onChangeHex(e.target.value)}
            onKeyPress={keyPress}
            placeholder="Hex"
            labelText="Custom color hex"
            error={hexInvalid ? 'Invalid Hex' : null}
          />
        </div>
      </PopoverInfo>

      <PopoverActions type="secondary">
        <Button size="small" type="tertiary" onClick={setRandomColor}>
          Random <Emoji name="bouquet" />
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
