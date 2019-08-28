/* eslint-disable no-bitwise */
import { hex as getHexContrastRatio } from 'wcag-contrast';
import randomColor from 'randomcolor';

export const getContrastWithLightText = (hex) => getHexContrastRatio(hex, '#fff');

export const getContrastWithDarkText = (hex) => getHexContrastRatio(hex, '#222');

export const isDarkColor = (hex) => {
  if (!hex.startsWith('#')) return false;
  const contrastWithLightText = getContrastWithLightText(hex);
  const contrastWithDarkText = getContrastWithDarkText(hex);
  return contrastWithLightText > contrastWithDarkText;
};

// from https://stackoverflow.com/a/21648508/1720985
export const hexToRgbA = (hex) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.5)`;
  }
  return false;
};

export const isGoodColorContrast = (hex) => getContrastWithDarkText(hex) >= 4.5 || getContrastWithLightText(hex) >= 4.5;

export function pickRandomColors(count) {
  const newColors = randomColor({ luminosity: 'light', count });
  if (newColors.every((color) => isGoodColorContrast(color))) {
    return newColors;
  }
  return pickRandomColors(count);
}

export function pickRandomColor() {
  const [newColor] = pickRandomColors(1);
  return newColor;
}
