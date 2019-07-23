// 💭 based on frontend/utils/assets in the editor

/* eslint-disable no-param-reassign */

import { useMemo } from 'react';
import quantize from 'quantize';
import { useAPI, entityPath } from 'State/api';
import S3Uploader from './s3-uploader';

export const COVER_SIZES = {
  large: 1000,
  medium: 700,
  small: 450,
};
export const AVATAR_SIZES = {
  large: 300,
  medium: 150,
  small: 60,
};

export const blobToImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
    return image;
  });

// Reduces the width/height and draws a new image until it reaches
// the final size. It loops by waiting for the onload to fire on the updated
// image and exits as soon as the new width/height are less than or equal to the
// final size.
const drawCanvasThumbnail = (image, type, max) => {
  let { width, height } = image;
  const quality = 0.92;
  let sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceContext = sourceCanvas.getContext('2d');
  sourceContext.drawImage(image, 0, 0, width, height);
  while (width > max && height > max) {
    width *= 0.75;
    height *= 0.75;
    const targetCanvas = document.createElement('canvas');
    const targetContext = targetCanvas.getContext('2d');
    targetCanvas.width = width;
    targetCanvas.height = height;
    targetContext.drawImage(sourceCanvas, 0, 0, width, height);
    sourceCanvas = targetCanvas;
  }
  return new Promise((resolve) =>
    sourceCanvas.toBlob(
      (blob) => {
        blob.width = width;
        blob.height = height;
        return resolve(blob);
      },
      type,
      quality,
    ),
  );
};

// Takes an HTML5 File and returns a promise for an HTML5 Blob that is fulfilled
// with a thumbnail for the image. If the image is small enough the original
// blob is returned. Width and height metadata are added to the blob.
export function resizeImage(file, max) {
  return blobToImage(file).then((image) => {
    file.width = image.width;
    file.height = image.height;
    if (image.width < max && image.height < max) {
      return file;
    }
    return drawCanvasThumbnail(image, file.type, max);
  });
}

// Takes an image object and returns an approximate average color
// Used to set background colors as an avatar image fallback
// Works by sampling the top-left 11x11 pixels and quantizing
// them into 5 colors and returning the most common color
// Returns '' if any pixels were transparent
export function getDominantColor(image) {
  const { width, height } = image;
  const PIXELS_FROM_EDGE = 11;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, width, height);
  let transparentPixels = false;
  let colors = [];
  const outlyingColors = [];
  const outlyingColorsList = JSON.stringify([[255, 255, 255], [0, 0, 0]]);
  /*
  Iterate through edge pixels and get the average color, then conditionally
  handle edge colors and transparent images
  */
  for (let x = 0; x < PIXELS_FROM_EDGE; x += 1) {
    for (let y = 0; y < PIXELS_FROM_EDGE; y += 1) {
      const pixelData = context.getImageData(x, y, 1, 1).data;
      if (pixelData[3] < 255) {
        // alpha pixels
        transparentPixels = true;
        break;
      }
      const color = [
        pixelData[0], // r
        pixelData[1], // g
        pixelData[2], // b
      ];
      const colorList = JSON.stringify(color);
      if (outlyingColorsList.includes(colorList)) {
        outlyingColors.push(color);
      } else {
        colors.push(color);
      }
    }
  }
  if (outlyingColors.length > colors.length) {
    colors = outlyingColors;
  }
  if (transparentPixels) {
    return '';
  }
  const colorMap = quantize(colors, 5);
  const [r, g, b] = Array.from(colorMap.palette()[0]);
  return `rgb(${r},${g},${b})`;
}

export function requestFile(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event) => {
    const file = event.target.files[0];
    console.log('☔️☔️☔️ input onchange', file);
    callback(file);
  };
  input.click();
  console.log('input created: ', input);
}

export function uploadAsset(blob, policy, key, progressHandler, options = {}) {
  const [promise, progress] = S3Uploader(policy).upload({ key, blob, ...options });
  if (progressHandler) progress(progressHandler);
  return promise;
}

export const useAssetPolicy = () => {
  const api = useAPI();
  return useMemo(
    () => ({
      getCoverImagePolicy: (args) => api.get(`/${entityPath(args)}/cover/policy`),
      getAvatarImagePolicy: (args) => api.get(`/${entityPath(args)}/avatar/policy`),
    }),
    [api],
  );
};

export function uploadAssetSizes(blob, policy, sizes, progressHandler) {
  const upload = uploadAsset(blob, policy, 'original', progressHandler);

  const scaledUploads = Object.keys(sizes).map((tag) => resizeImage(blob, sizes[tag]).then((resized) => uploadAsset(resized, policy, tag)));

  return Promise.all([upload, ...scaledUploads]);
}

/* eslint-enable no-param-reassign */
