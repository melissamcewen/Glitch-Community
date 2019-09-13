/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import * as styled from 'styled-components';
import styled__default, { createGlobalStyle, css, keyframes } from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

const CodeExample = styled__default.pre`
  font-family: var(--fonts-mono);
  font-size: var(--fontSizes-big);
  background-color: var(--colors-secondaryBackground);
  padding: var(--space-2);
`;

const _jsxFileName = "/Users/justinfalcone/src/shared-components/lib/icon.js";
const IconBase = styled__default.img`
  display: inline-block;
  height: 0.875em;
  width: auto;
  vertical-align: top;
`;

const SVGBase = styled__default.svg`
  display: inline-block;
  height: 0.875em;
  width: auto;
  color: inherit;
  vertical-align: top;
`;

const Arrow = ({ rotate, ...props }) => (
  React.createElement(SVGBase, { viewBox: "0 0 64 64"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 22}}
    , React.createElement('polygon', {
      points: "64,32 48,48 48,36 0,36 0,28 48,28 48,16"      ,
      transform: `translate(32,32) rotate(${rotate}) translate(-32,-32)`,
      fill: "currentColor", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 23}}
    )
  )
);

const Chevron = ({ rotate, ...props }) => (
  React.createElement(SVGBase, { viewBox: "0 0 64 64"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 32}}
    , React.createElement('path', {
      d: "M20,8 L44,32 L20,56"  ,
      transform: `translate(32,32) rotate(${rotate}) translate(-32,-32)`,
      stroke: "currentColor",
      strokeWidth: "10",
      fill: "none", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 33}}
    )
  )
);

const svgs = {
  arrowDown: (props) => React.createElement(Arrow, { rotate: "90", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 44}} ),
  arrowLeft: (props) => React.createElement(Arrow, { rotate: "180", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 45}} ),
  arrowRight: (props) => React.createElement(Arrow, { rotate: "0", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 46}} ),
  arrowUp: (props) => React.createElement(Arrow, { rotate: "-90", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 47}} ),
  chevronDown: (props) => React.createElement(Chevron, { rotate: "90", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 48}} ),
  chevronLeft: (props) => React.createElement(Chevron, { rotate: "180", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 49}} ),
  chevronRight: (props) => React.createElement(Chevron, { rotate: "0", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 50}} ),
  chevronUp: (props) => React.createElement(Chevron, { rotate: "-90", ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 51}} ),
  collapse: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 14 12"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 53}}
      , React.createElement('rect', { x: "0.5", y: "0.5", width: "13", height: "11", rx: "3", stroke: "currentColor", strokeWidth: "1", fill: "none", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 54}} )
      , React.createElement('polygon', { fill: "currentColor", points: "8.5,3 8.5,9 4.5,6"  , __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 55}} )
    )
  ),
  eye: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 19 14"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 59}}
      , React.createElement('path', {
        d: "M1.785 7.451c8.071 10.224 14.687 2.044 16.1.032.168-.241.161-.575-.021-.806-8.07-10.223-14.687-2.045-16.1-.032-.168.241-.161.575.021.806z"     ,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 60}}
      )
      , React.createElement('path', {
        d: "M7.116 7.056c0-1.547 1.254-2.8 2.8-2.8 1.547 0 2.8 1.254 2.8 2.8 0 1.547-1.254 2.8-2.8 2.8-1.547 0-2.8-1.254-2.8-2.8z"              ,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        'stroke-inejoin': "round", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 68}}
      )
      , React.createElement('path', {
        d: "M8.637 7.868c0-1.082.976-1.96 2.178-1.96 1.203 0 2.179.877 2.179 1.96 0 1.082-.976 1.96-2.179 1.96-1.203 0-2.178-.877-2.178-1.96"            ,
        fill: "currentColor", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 76}}
      )
    )
  ),
  octocat: (props) => (
    React.createElement(SVGBase, { viewBox: "-194 298 16 15"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 83}}
      , React.createElement('path', {
        fill: "currentColor",
        d: "M-186,298.7c2,0,3.6,0.7,5,2s2,3,2,5c0,1.6-0.5,2.9-1.4,4.1s-2,2-3.4,2.5c-0.2,0-0.3,0-0.4-0.1 c-0.1-0.1-0.1-0.2-0.1-0.3l0-1.9c0-0.3,0-0.6-0.1-0.8s-0.2-0.4-0.3-0.5c0.8-0.1,1.5-0.3,2.2-0.8s1-1.4,1-2.7 c0-0.4-0.1-0.7-0.2-1c-0.1-0.3-0.3-0.6-0.5-0.8c0.1-0.1,0.1-0.3,0.1-0.6c0-0.3,0-0.7-0.2-1.2c0,0-0.2,0-0.5,0 c-0.3,0-0.8,0.3-1.5,0.7c-0.6-0.2-1.1-0.2-1.7-0.2c-0.6,0-1.2,0.1-1.8,0.2c-0.7-0.4-1.2-0.7-1.5-0.7c-0.3,0-0.5,0-0.5,0 c-0.2,0.5-0.2,0.9-0.2,1.2c0,0.3,0.1,0.5,0.1,0.6c-0.2,0.2-0.4,0.5-0.5,0.8c-0.1,0.3-0.2,0.7-0.2,1c0,1.3,0.4,2.2,1,2.7 c0.6,0.5,1.4,0.7,2.2,0.8c-0.1,0.1-0.2,0.2-0.3,0.4s-0.1,0.3-0.2,0.6c-0.2,0.1-0.5,0.2-0.9,0.2c-0.4,0-0.8-0.3-1.1-0.8 c0,0-0.1-0.1-0.3-0.3c-0.2-0.2-0.4-0.3-0.8-0.4c0,0-0.1,0-0.3,0s-0.1,0.2,0.2,0.4c0,0,0.1,0.1,0.3,0.2c0.2,0.2,0.3,0.4,0.5,0.8 c0,0.1,0.1,0.3,0.4,0.6c0.3,0.3,1,0.4,1.9,0.2l0,1.3c0,0.1,0,0.2-0.1,0.3c-0.1,0.1-0.2,0.1-0.4,0.1c-1.4-0.5-2.6-1.3-3.4-2.5 s-1.3-2.6-1.4-4.1c0-2,0.7-3.6,2-5C-189.6,299.4-188,298.7-186,298.7L-186,298.7z"







        , __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 84}}
      )
    )
  ),
  private: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 10 12"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 99}}
      , React.createElement('path', {
        d: "M0 7.006c0-1.108.887-2.006 2-2.006h6.001c1.104 0 2 .887 2 2.006v2.988c0 1.108-.887 2.006-2 2.006h-6.001c-1.104 0-2-.887-2-2.006v-2.988zm5 1.994c.46 0 .833-.373.833-.833 0-.46-.373-.833-.833-.833-.46 0-.833.373-.833.833 0 .46.373.833.833.833z"                  ,
        fill: "currentColor", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 100}}
      )
      , React.createElement('path', {
        d: "M2.235 6.632v-2.995c0-1.107.898-2.005 1.995-2.005h1.451c1.102 0 1.995.895 1.995 1.99v2.768"      ,
        stroke: "currentColor",
        fill: "none",
        strokeWidth: "1.5", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 104}}
      )
    )
  ),
  public: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 10 12"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 113}}
      , React.createElement('path', {
        d: "M0 7.006C0 5.898.887 5 2 5h6.001c1.104 0 2 .887 2 2.006v2.988a1.998 1.998 0 0 1-2 2.006H2c-1.104 0-2-.887-2-2.006V7.006zM5 9a.833.833 0 1 0 0-1.666A.833.833 0 0 0 5 9z"                          ,
        fill: "currentColor",
        fillRule: "nonzero", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 114}}
      )
      , React.createElement('path', {
        d: "M2.235 6.632V3.637c0-1.107.898-2.005 1.995-2.005h1.451a1.998 1.998 0 0 1 1.995 1.99"        ,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 119}}
      )
    )
  ),
  rewind: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 14 10"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 128}}
      , React.createElement('path', { d: "M6.901 0v9.804L0 4.902zM13.901 0v9.804L7 4.902z"    , fill: "currentColor", fillRule: "evenodd", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 129}} )
    )
  ),
  search: (props) => (
    React.createElement(SVGBase, { viewBox: "284.5 6 15 14"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 133}}
      , React.createElement('path', {
        fill: "currentColor",
        d: "M294.5,14.6 L294.5,14.6 C295.9,12.4 295.5,9.5 293.8,7.6 C292.7,6.5 291.4,6 290.0,6 C288.6,6 287.2,6.6 286.2,7.6 C284.1,9.8 284.1,13.4 286.2,15.6 C287.2,16.6 288.5,17.2 290.0,17.2 C291.0,17.2 292.0,16.9 292.9,16.3 L295.4,19.0 C296.0,19.6 296.9,19.6 297.4,19.0 L298.0,18.4 L294.5,14.6 L294.5,14.6 Z M287.8,13.8 C286.7,12.6 286.6,10.7 287.7,9.4 C287.7,9.3 287.8,9.3 287.8,9.3 C288.4,8.7 289.1,8.3 290.0,8.3 C290.8,8.3 291.6,8.7 292.1,9.3 C293.3,10.5 293.3,12.6 292.1,13.8 C291.6,14.4 290.8,14.8 290.0,14.8 C289.1,14.8 288.4,14.4 287.8,13.8 L287.8,13.8 Z"                                                   ,
        transform: "translate(291.7, 13) scale(-1, 1) translate(-291.7, -13)"     , __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 134}}
      )
    )
  ),
  sunglasses: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 29 15"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 142}}
      , React.createElement('path', { d: "M2.805 8.461l6.219-6.218s.882-.93 2.226-.462m8.41 7.36l6.898-6.898s.882-.93 2.226-.462"    , stroke: "currentColor", strokeWidth: "1.5", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 143}} )
      , React.createElement('path', { d: "M8.991 8.514l-.001.002.484.761c.599-.599 2.121-.559 2.745.017l.482-.801c-1.045-.996-2.694-.995-3.71.021"   , fill: "currentColor", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 144}} )
      , React.createElement('path', {
        d: "M5.199 5.411c-2.416 0-4.375 1.958-4.375 4.375 0 2.416 1.959 4.375 4.375 4.375 2.417 0 4.375-1.959 4.375-4.375 0-2.417-1.958-4.375-4.375-4.375zm1.703 4.375c-.032-.785-.675-1.414-1.468-1.414h-.002v-1h.002c1.344 0 2.436 1.078 2.468 2.414h-1z"                     ,
        fill: "currentColor", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 145}}
      )
      , React.createElement('path', {
        d: "M16.356 5.411c-2.417 0-4.375 1.958-4.375 4.375 0 2.416 1.958 4.375 4.375 4.375 2.416 0 4.375-1.959 4.375-4.375 0-2.417-1.959-4.375-4.375-4.375zm1.702 4.375c-.032-.785-.675-1.414-1.467-1.414h-.003v-1h.003c1.344 0 2.435 1.078 2.467 2.414h-1z"                     ,
        fill: "currentColor", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 149}}
      )
    )
  ),
  x: (props) => (
    React.createElement(SVGBase, { viewBox: "0 0 64 64"   , ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 156}}
      , React.createElement('path', { d: "M8,8 L56,56 M8,56 L56,8"   , stroke: "currentColor", fill: "none", strokeWidth: "12", __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 157}} )
    )
  ),
};

const icons = {
  ambulance: 'https://cdn.glitch.com/cc880f8d-a84f-4909-b676-497522a8c625%2Fambulance.png',
  backhandIndex: 'https://cdn.glitch.com/064b323a-e0b3-43bc-a6e8-79163b0b5d7a%2Fbackhand-index.png?v=1565763350486',
  balloon: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fballoon.png',
  bentoBox: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png',
  bicep: 'https://cdn.glitch.com/a7b5cfd3-307b-4b99-bc1c-ca96f720521a%2Fbiceps.png',
  bomb: 'https://cdn.glitch.com/f34c5d19-c958-40f6-b11f-7a4542a5ae5f%2Fbomb.png',
  bouquet: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fbouquet.png',
  carpStreamer: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fcarp_streamer.png',
  clapper: 'https://cdn.glitch.com/25a45fb6-d565-483a-87d2-f944befeb36b%2Fclapper.png',
  creditCard: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fcredit-card.png',
  crystalBall: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fcrystal-ball_1f52e.png',
  diamondSmall: 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fdiamond-small.svg',
  dogFace: 'https://cdn.glitch.com/03736932-82dc-40e8-8dc7-93330c933143%2Fdog-face.png',
  email: 'https://cdn.glitch.com/aebac4f9-ae14-4d54-aa60-de46dac3b603%2Femail.png',
  eyes: 'https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Feyes.png',
  facebook: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffacebook-logo.png',
  faceExpressionless: 'https://cdn.glitch.com/a7b5cfd3-307b-4b99-bc1c-ca96f720521a%2Fface-expressionless.png?1555609837739',
  faceSlightlySmiling: 'https://cdn.glitch.com/a7b5cfd3-307b-4b99-bc1c-ca96f720521a%2Fface-slightly-smiling.png?1555609837380',
  fastDown: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffast_down.png',
  fastUp: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffast_up.png',
  fireEngine: 'https://cdn.glitch.com/39e02e0b-2b15-4c60-a7f0-1aa4d05cce4a%2FfireEngine.png',
  fishingPole: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Ffishing_pole.png',
  framedPicture: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fframed_picture.png',
  google: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FgoogleLogo.png',
  herb: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fherb.png',
  key: 'https://cdn.glitch.com/006d6bcf-f2b7-4a29-b55d-c097b491e09c%2Fkey.png?1555429359426',
  mailboxOpen: 'https://cdn.glitch.com/006d6bcf-f2b7-4a29-b55d-c097b491e09c%2Fopen-mailbox.png?1555429351403',
  horizontalTrafficLight: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fhorizontal-traffic-light_1f6a5.png',
  index: 'https://cdn.glitch.com/997e1260-f54f-47ad-936b-1eca8e555a51%2Findex.png?1555620428434',
  keyboard: 'https://cdn.glitch.com/3e774f68-7017-4c21-bced-dc0e98e90643%2Fkeyboard.png?v=1568124469960',
  loveLetter: 'https://cdn.glitch.com/7ce3d054-7a26-40e1-9268-4189fc526e5b%2Flove-letter.png?v=1562660085578',
  microphone: 'https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Fmicrophone.png',
  mouse: 'https://cdn.glitch.com/3e774f68-7017-4c21-bced-dc0e98e90643%2Fmouse.png?v=1568124470101',
  new: 'https://cdn.glitch.com/3e774f68-7017-4c21-bced-dc0e98e90643%2Fnew.png?v=1568124470063',
  newspaper: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fnewspaper_1f4f0.png',
  park: 'https://cdn.glitch.com/4f4a169a-9b63-4daa-8b6a-0e50d5c06e25%2Fnational-park_1f3de.png',
  playButton: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg',
  policeOfficer: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fpolice-officer_1f46e.png',
  pushpin: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fpushpin.png',
  rainbow: 'https://cdn.glitch.com/e5154318-7816-4ec9-a72a-a0e767031e99%2Frainbow.png',
  scales: 'https://cdn.glitch.com/6c8c1a17-f6e4-41c4-8861-378c4fad4c22%2Fscales_64.png',
  sick: 'https://cdn.glitch.com/4f4a169a-9b63-4daa-8b6a-0e50d5c06e25%2Fface-with-thermometer_1f912.png',
  slack: 'https://cdn.glitch.com/1eaf9cb4-5150-4c24-bb91-28623c3b9da4%2Fslack.svg',
  sparkles: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkles.png',
  sparklingHeart: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkling_heart.png',
  spiralNotePad: 'https://cdn.glitch.com/78273300-9a1e-4c5f-804c-5e7c3c27af17%2Fspiral_note_pad.png',
  thumbsDown: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fthumbs_down.png',
  thumbsUp: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fthumbs-up.png',
  umbrella: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fumbrella_2602.png',
  verified: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fverified.svg',
  wave: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png',
};

const iconOptions = Object.keys(icons).concat(Object.keys(svgs));

const Icon = ({ icon, alt, ...props }) => {
  if (svgs[icon]) {
    const SVGIcon = svgs[icon];
    return React.createElement(SVGIcon, { icon: icon, 'aria-label': alt || undefined, 'aria-hidden': !alt, ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 221}} );
  }

  return React.createElement(IconBase, { 'data-module': "Icon", icon: icon, src: icons[icon], alt: alt, ...props, __self: undefined, __source: {fileName: _jsxFileName, lineNumber: 224}} );
};
Icon.propTypes = {
  icon: PropTypes.oneOf(iconOptions).isRequired,
  alt: PropTypes.string,
};
Icon.defaultProps = {
  alt: '',
};

const GiantIcon = styled__default(Icon)`
  height: 300px;
`;

const Grid = styled__default.div`
  display: grid;
  grid-gap: var(--space-1);
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  margin: var(--space-1) auto;
`;

const Inverted = styled__default.div`
  padding: var(--space-2);
  color: var(--colors-background);
  background-color: var(--colors-primary);
  > * + * {
    margin-left: var(--space-2);
  }
`;

function* themeToCSSVars(theme, prefix = '--') {
  for (const [key, value] of Object.entries(theme)) {
    if (typeof value === 'string') {
      yield `${prefix}${key}: ${value};`;
    } else {
      yield* themeToCSSVars(value, `${prefix}${key}-`);
    }
  }
}

const setThemeVars = ({ theme }) => {
  return [...themeToCSSVars(theme)].join('\n');
};

const RootStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    position: static;
  }
  :root {
    ${setThemeVars}
    font-family: var(--fonts-sans);
    font-size: 100%;
    color: var(--colors-primary);
    --local-colors-secondary: var(--colors-secondary);
    background-color: var(--colors-background);
  }
  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
`;

const LocalStyle = styled__default.div`
  ${setThemeVars};
  font-family: var(--fonts-sans);
  font-size: 100%;
  color: var(--colors-primary);
  --local-colors-secondary: var(--colors-secondary);
  background-color: var(--colors-background);
`;

const sizeNames = ['tiny', 'small', 'normal', 'big', 'bigger', 'huge'];
const sizes = {};
for (const size of sizeNames) {
  sizes[size] = `font-size: var(--fontSizes-${size});`;
}

const BaseButton = styled__default.button`
  appearance: none;
  color: inherit;
  background-color: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
  margin: 0;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  text-transform: none;
  text-align: left;
  cursor: pointer;
`;
BaseButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string,
};
BaseButton.defaultProps = {
  type: 'button',
};

const StyledButton = styled__default.span`
  display: inline-block;
  border-radius: var(--rounded);
  font-family: var(--fonts-sans);
  font-weight: 600;
  line-height: 1;
  position: relative;
  &:disabled,
  button:disabled &,
  a:disabled & {
    opacity: 0.5;
    pointer-events: none;
  }
  // Most buttons will have capital letters, but many will not have descenders.
  // As a result, even padding on buttons frequently looks unbalanced,
  // so we apply extra padding to the top to correct this.
  // Note that this is font-specific and proportional to font size,
  // and at smaller sizes this is complicated by pixel rounding.
  padding: 0.375em 0.5em 0.1875em;
  white-space: normal;
  text-decoration: none;

  ${({ variant }) => variants[variant]}
  ${({ size }) => sizes[size]}
`;

const hover = (...args) => css`
  &:hover,
  button:hover &,
  a:hover & {
    ${css(...args)}
    text-decoration: none;
  }
  &:active,
  button:active &,
  a:active & {
    color: var(--colors-selected-text);
    background-color: var(--colors-selected-background);
  }
`;

const variants = {
  primary: css`
    color: var(--colors-primary);
    background-color: var(--colors-background);
    border: 2px solid var(--colors-primary);
    ${hover`
      background-color: var(--colors-secondaryBackground);
    `}
  `,
  secondary: css`
    color: var(--colors-secondary);
    background-color: var(--colors-background);
    border: 1px solid var(--colors-secondary);
    ${hover`
      background-color: var(--colors-secondaryBackground);
    `}
  `,
  cta: css`
    color: #222;
    background-color: #83ffcd;
    border: 2px solid var(--colors-primary);
    box-shadow: 4px 4px 0 var(--colors-primary);
    margin-right: 4px;
    ${hover`
      background-color: var(--colors-secondaryBackground);
      box-shadow: 2px 2px 0 var(--colors-primary);
    `}
  `,
  warning: css`
    color: var(--colors-secondary);
    background-color: var(--colors-background);
    border: 1px solid var(--colors-secondary);
    ${hover`
      color: vaqr(--colors-warning-text);
      background-color: var(--colors-warning-background);
    `}
  `,
};

const UnstyledButton = styled__default(BaseButton).attrs(() => ({ 'data-module': 'UnstyledButton' }))``;
const Button = styled__default(StyledButton).attrs(() => ({ 'data-module': 'Button' }))``;

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(variants)),
  size: PropTypes.oneOf(Object.keys(sizes)),
};
Button.defaultProps = {
  variant: 'primary',
  size: 'normal',
  as: BaseButton,
};

const Container = styled__default.div`
  margin: var(--space-1) auto;
  & > * {
    margin: 0 var(--space-1) var(--space-1) 0;
  }
`;

const ProjectLink = styled__default.a`
  display: block;
  width: 300px;
  border-radius: var(--rounded);
  color: var(--colors-tertiary-text);
  background-color: var(--colors-tertiary-background);
  padding: var(--space-1);
  margin: var(--space-1) 0;
  text-decoration: none;
`;

const ShadowButton = styled__default(Button)`
  ${hover`
    background-color: var(--colors-secondaryBackground);
    box-shadow: 4px 4px 0 var(--colors-primary);
  `}
`;

const _jsxFileName$1 = "/Users/justinfalcone/src/shared-components/lib/animation-container.js";
const nullAnimation = keyframes``;

const slideUp = keyframes`
  to {
    transform: translateY(-50px);
    opacity: 0;
  }
`;
const slideDown = keyframes`
  to {
    transform: translateY(50px);
    opacity: 0;
  }
`;
const fadeOut = keyframes`
  to {
    opacity: 0;
  }
`;

const AnimationWrap = styled__default.div`
  animation-name: ${({ animation }) => animation};
  @media (prefers-reduced-motion: reduce) {
    animation-name: ${({ reducedMotionAnimation }) => reducedMotionAnimation};
  }
  animation-duration: var(--animation-duration, 0.1s);
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
`;

const AnimationContainer = ({ animation, reducedMotionAnimation, duration, children, onAnimationEnd, ...props }) => {
  const [active, setActive] = React.useState(false);
  const ref = React.useRef();

  const handleAnimationEnd = (event) => {
    if (event.target === ref.current) onAnimationEnd(event);
  };

  return (
    React.createElement(AnimationWrap, {
      'data-module': "AnimationContainer",
      animation: active ? animation || reducedMotionAnimation || nullAnimation : null,
      reducedMotionAnimation: active ? reducedMotionAnimation || nullAnimation : null,
      style: {
        '--duration': duration,
      },
      ref: ref,
      onAnimationEnd: handleAnimationEnd,
      ...props, __self: undefined, __source: {fileName: _jsxFileName$1, lineNumber: 47}}
    
      , children(() => setActive(true))
    )
  );
};

AnimationContainer.propTypes = {
  animation: PropTypes.any,
  reducedMotionAnimation: PropTypes.any,
  children: PropTypes.func.isRequired,
  onAnimationEnd: PropTypes.func.isRequired,
};

const ExampleBlock = styled__default.div`
  padding: var(--space-1);
  border: 1px solid var(--colors-border);
`;

const Grid$1 = styled__default.div`
  display: grid;
  grid-gap: var(--space-1);
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  margin: var(--space-1) auto;
`;

const ProjectItem = styled__default.div`
  border-radius: var(--rounded);
  padding: var(--space-1);
  color: var(--colors-tertiary-text);
  background-color: var(--colors-tertiary-background);
`;

const _jsxFileName$2 = "/Users/justinfalcone/src/shared-components/lib/avatar.js";
const Image = React.forwardRef(({ src, defaultSrc, alt, ...props }, ref) => {
  const [activeSrc, setActiveSrc] = React.useState(src || defaultSrc);
  React.useEffect(() => {
    setActiveSrc(src);
  }, [src]);

  const onError = () => {
    if (defaultSrc && activeSrc !== defaultSrc) {
      setActiveSrc(defaultSrc);
    }
  };

  return React.createElement('img', { ref: ref, src: activeSrc, onError: onError, alt: alt, ...props, __self: undefined, __source: {fileName: _jsxFileName$2, lineNumber: 18}} );
});

const variants$1 = {
  roundrect: css`
    border-radius: var(--rounded);
  `,
  circle: css`
    border-radius: 100%;
  `,
};

const Avatar = styled__default(Image).attrs(() => ({ 'data-module': 'Avatar' }))`
  display: block;
  width: 100%;
  height: auto;
  ${({ variant }) => variants$1[variant]}
`;

Avatar.propTypes = {
  src: PropTypes.string,
  defaultSrc: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(Object.keys(variants$1)).isRequired,
};

const Container$1 = styled__default.div`
  color: var(--colors-tertiary-text);
  background-color: var(--colors-tertiary-background);
  border-radius: var(--rounded);
  padding: var(--space-1);
  margin: var(--space-1) 0;
`;

const Flex = styled__default(Container$1)`
  display: flex;
  width: 300px;
  > * {
    flex: 1 1 auto;
    text-align: center;
  }
  > * + * {
    margin-left: var(--space-1);
  }
`;

const _jsxFileName$3 = "/Users/justinfalcone/src/shared-components/lib/badge.js";
const variants$2 = {
  normal: css`
    color: var(--colors-background);
    background-color: var(--colors-secondary);
  `,
  inactive: css`
    color: var(--colors-background);
    background-color: var(--colors-placeholder);
  `,
  notice: css`
    color: var(--colors-notice-text);
    background-color: var(--colors-notice-background);
  `,
  success: css`
    color: var(--colors-success-text);
    background-color: var(--colors-success-background);
  `,
  warning: css`
    color: var(--colors-warning-text);
    background-color: var(--colors-warning-background);
  `,
  error: css`
    color: var(--colors-error-text);
    background-color: var(--colors-error-background);
  `,
};

const BadgeBase = styled__default.span.attrs(() => ({ 'data-module': 'Badge' }))`
  display: inline-block;
  vertical-align: top;
  font-size: 0.75em;
  font-family: var(--font-sans);
  font-weight: 600;
  padding: 0.2em 0.375em 0.05em;
  border-radius: var(--rounded);
  white-space: nowrap;
  ${({ variant }) => variants$2[variant]};
  ${({ collapsed }) =>
    collapsed &&
    css`
      border-radius: 50%;
      vertical-align: baseline;
      height: 1em;
      width: 1em;
      padding: 0;
    `}
`;

const Badge = ({ children, variant, collapsed, ...props }) => (
  React.createElement(BadgeBase, { 'data-module': "Badge", variant: variant, collapsed: collapsed, ...props, __self: undefined, __source: {fileName: _jsxFileName$3, lineNumber: 56}}
    , collapsed ? null : children
  )
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(variants$2)),
  collapsed: PropTypes.bool,
};

Badge.defaultProps = {
  variant: 'normal',
  collapsed: false,
};

const Container$2 = styled__default.div`
  & > * {
    margin: 0 var(--space-1) var(--space-1) 0;
  }
`;

const _jsxFileName$4 = "/Users/justinfalcone/src/shared-components/lib/icon-button.js";
const IconButtonWrap = styled__default.span`
  padding: var(--opticalPadding);
  border-radius: var(--rounded);
  display: inline-block;
  line-height: 1;
  &:hover {
    background-color: var(--colors-hover);
  }
`;
const ButtonIcon = styled__default(Icon)`
  color: var(--colors-secondary);
  &:hover {
    color: var(--colors-primary);
  }
`;

const IconButton = React.forwardRef(({ icon, label, iconProps, ...props }, ref) => (
  React.createElement(IconButtonWrap, { 'data-module': "IconButton", 'aria-label': label, ref: ref, ...props, __self: undefined, __source: {fileName: _jsxFileName$4, lineNumber: 25}}
    , React.createElement(ButtonIcon, { icon: icon, ...iconProps, __self: undefined, __source: {fileName: _jsxFileName$4, lineNumber: 26}} )
  )
));

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  iconProps: PropTypes.object,
};
IconButton.defaultProps = {
  type: 'button',
  as: UnstyledButton,
};

const _jsxFileName$5 = "/Users/justinfalcone/src/shared-components/lib/block.js";
// used in popovers and overlays

const TitleWrap = styled__default.header`
  display: flex;
  align-items: baseline;
  font-size: var(--fontSizes-big);
  padding: var(--space-1);
  background-color: var(--colors-secondaryBackground);
`;
const TitleContent = styled__default.h2`
  flex: 1 0 auto;
  margin: 0;
  padding: 0 var(--space-1);
  font-size: var(--fontSizes-big);
`;

const Title = ({ children, onBack, onBackRef, onClose, onCloseRef, ...props }) => (
  React.createElement(TitleWrap, { 'data-module': "Title", ...props, __self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 23}}
    , onBack && React.createElement(IconButton, { onClick: onBack, ref: onBackRef, icon: "chevronLeft", label: "Back", __self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 24}} )
    , React.createElement(TitleContent, {__self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 25}}, children)
    , onClose && React.createElement(IconButton, { onClick: onClose, ref: onCloseRef, icon: "x", label: "Close", __self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 26}} )
  )
);

const variants$3 = {
  info: css`
    color: var(--colors-primary);
    background-color: var(--colors-secondaryBackground);
  `,
  actions: css`
    color: var(--colors-primary);
    background-color: var(--colors-background);
  `,
  warning: css`
    color: var(--colors-warning-text);
    background-color: var(--colors-warning-background);
  `,
};

const Section = styled__default.section`
  padding: var(--space-1);
  ${({ variant }) => variants$3[variant]};
  border-top: 1px solid var(--colors-border);
  &:first-child {
    border-top: none;
  }
`;

const Info = (props) => React.createElement(Section, { 'data-module': "Info", variant: "info", ...props, __self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 54}} );

const Actions = (props) => React.createElement(Section, { 'data-module': "Actions", variant: "actions", ...props, __self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 56}} );

const DangerZone = (props) => React.createElement(Section, { 'data-module': "DangerZone", variant: "warning", ...props, __self: undefined, __source: {fileName: _jsxFileName$5, lineNumber: 58}} );

const Container$3 = styled__default.div`
  margin: var(--space-1) 0;
  font-size: var(--fontSizes-small);
  border-radius: var(--rounded);
  overflow: hidden;
  border: 1px solid var(--colors-border);
  box-shadow: var(--popShadow);
  width: 400px;
`;

const useCallbackProxy = (callback) => {
  const ref = React.useRef(callback);
  React.useEffect(() => {
    ref.current = callback;
  }, [callback]);
  const proxiedCallback = React.useCallback(
    (...args) => {
      ref.current(...args);
    },
    [ref],
  );
  if (!callback) return null;
  return proxiedCallback;
};

const useEscape = (open, onClose) => {
  const memoOnClose = useCallbackProxy(onClose);

  React.useEffect(() => {
    if (!open) return undefined;

    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        memoOnClose(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, memoOnClose]);
};

const useFocusTrap = () => {
  const first = React.useRef();
  const last = React.useRef();
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Tab' && !e.shiftKey && e.target === last.current) {
        e.preventDefault();
        first.current.focus();
      }
      if (e.key === 'Tab' && e.shiftKey && e.target === first.current) {
        e.preventDefault();
        last.current.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return { first, last };
};

const onArrowKeys = (e, index, options) => {
  if (!options.length) return null;

  let offset = 0;
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    offset = -1;
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    offset = 1;
  }
  if (offset === 0) return null;
  e.preventDefault();
  return (index + offset + options.length) % options.length;
};

const _jsxFileName$6 = "/Users/justinfalcone/src/shared-components/lib/button-group.js";
const ButtonWrap = styled__default.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const ButtonSegment = styled__default(Button)`
  flex: 0 0 auto;
  border-radius: 0;
  border-right-style: none;
  &[aria-checked='true'],
  &:active {
    color: var(--colors-selected-text);
    background-color: var(--colors-selected-background);
    z-index: 1;
  }

  &:first-child {
    border-radius: var(--rounded) 0 0 var(--rounded);
  }
  &:last-child {
    border-radius: 0 var(--rounded) var(--rounded) 0;
    border-right-style: solid;
  }
`;

const ButtonGroup = ({ children, size, variant, ...props }) => (
  React.createElement(ButtonWrap, { 'data-module': "ButtonGroup", ...props, __self: undefined, __source: {fileName: _jsxFileName$6, lineNumber: 36}}
    , React.Children.map(children, (child) => React.cloneElement(child, { size, variant }))
  )
);
ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

const SoftIcon = styled__default(Icon)`
  color: var(--colors-placeholder);
  button:active & {
    color: inherit;
  }
`;

const handleKeyDown = (options, refs, index, onChange) => (e) => {
  const nextIndex = onArrowKeys(e, index, options);
  if (nextIndex === null) return;
  onChange(options[nextIndex].id, e);
  refs.current[nextIndex].focus();
};

const SegmentedButton = ({ value, options, onChange, size, variant, ...props }) => {
  const refs = React.useRef([]);
  return (
    React.createElement(ButtonWrap, { 'data-module': "SegmentedButton", role: "radiogroup", ...props, __self: undefined, __source: {fileName: _jsxFileName$6, lineNumber: 91}}
      , options.map(({ id, label, ...buttonProps }, i) => (
        React.createElement(ButtonSegment, {
          ref: (el) => {
            refs.current[i] = el;
          },
          key: id,
          active: value === id,
          onClick: (e) => onChange(id, e),
          size: size,
          variant: variant,
          // a11y, see https://www.w3.org/TR/2016/WD-wai-aria-practices-1.1-20160317/examples/radio/radio.html
          role: "radio",
          tabIndex: value === id ? 0 : -1,
          'aria-checked': value === id,
          onKeyDown: handleKeyDown(options, refs, i, onChange),
          ...buttonProps, __self: undefined, __source: {fileName: _jsxFileName$6, lineNumber: 93}}
        
          , label
        )
      ))
    )
  );
};
SegmentedButton.propTypes = {
  value: PropTypes.any.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
    }).isRequired,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

const Wrap = styled__default.div`
  margin: var(--space-2) 0;
`;

const _jsxFileName$7 = "/Users/justinfalcone/src/shared-components/lib/checkbox-button.js";
const Checkbox = styled__default.input`
  margin: 0 var(--space-1) 0 0;
  padding: 0;
  vertical-align: top;
`;

const CheckboxButton = React.forwardRef(({ children, onChange, value, ...props }, ref) => (
  React.createElement(Button, { 'data-module': "CheckboxButton", as: "label", ...props, __self: undefined, __source: {fileName: _jsxFileName$7, lineNumber: 14}}
    , React.createElement(Checkbox, { type: "checkbox", checked: value, onChange: (evt) => onChange(evt.target.checked, evt), ref: ref, __self: undefined, __source: {fileName: _jsxFileName$7, lineNumber: 15}} )
    , children
  )
));

CheckboxButton.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

const VisuallyHidden = styled__default.span.attrs(() => ({ 'data-module': 'VisuallyHidden' }))`
  border: 0;
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  -webkit-clip-path: inset(50%);
`;

const _jsxFileName$8 = "/Users/justinfalcone/src/shared-components/lib/live-announcer.js";
// see https://almerosteyn.com/2017/09/aria-live-regions-in-react

const LiveAnnouncerContext = React.createContext();
const LiveAnnouncerConsumer = LiveAnnouncerContext.Consumer;
const useLiveAnnouncer = ({ message, live }) => {
  const announce = React.useContext(LiveAnnouncerContext);
  React.useEffect(() => {
    if (announce) announce({ message, live });
  }, [announce, message, live]);
};

const MessageBlock = ({ live, message = '' }) => (
  React.createElement('div', { role: "log", 'aria-relevant': "additions text" , 'aria-atomic': "true", 'aria-live': live, __self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 16}}
    , message
  )
);

const MessageRelay = ({ live, message }) => {
  const [counter, setCounter] = React.useState(0);
  const isOdd = counter & 1;
  React.useEffect(() => {
    setCounter((value) => value + 1);
  }, [message]);

  return (
    React.createElement(React.Fragment, null
      , React.createElement(MessageBlock, { live: live, message: isOdd ? message : '', __self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 30}} )
      , React.createElement(MessageBlock, { live: live, message: isOdd ? '' : message, __self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 31}} )
    )
  );
};

const LiveAnnouncer = ({ children }) => {
  const [politeMessage, announcePolite] = React.useState('');
  const [assertiveMessage, announceAssertive] = React.useState('');

  const contextValue = React.useCallback(({ message, live }) => {
    if (live === 'polite') announcePolite(message);
    if (live === 'assertive') announceAssertive(message);
  }, []);

  return (
    React.createElement(React.Fragment, null
      , React.createElement(VisuallyHidden, {__self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 47}}
        , React.createElement(MessageRelay, { live: "polite", message: politeMessage, __self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 48}} )
        , React.createElement(MessageRelay, { live: "assertive", message: assertiveMessage, __self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 49}} )
      )
      , React.createElement(LiveAnnouncerContext.Provider, { value: contextValue, __self: undefined, __source: {fileName: _jsxFileName$8, lineNumber: 51}}, children)
    )
  );
};

const _jsxFileName$9 = "/Users/justinfalcone/src/shared-components/lib/loader.js";
const Container$4 = styled__default.span`
  display: inline-block;
  width: 0.75em;
  height: auto;
  object-fit: contain;
`;

const Mask = styled__default.span`
  overflow: hidden;
  display: inline-block;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  border-radius: 100%;
  background-color: #000;
  transform: translate3d(0, 0, 0);
`;

const Circle = styled__default.span`
  position: absolute;
  mix-blend-mode: exclusion;
  height: var(--diameter);
  width: var(--diameter);
  border-radius: 100%;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
`;

const Earth = styled__default(Circle)`
  @media (prefers-reduced-motion: reduce) {
    margin-left: 0;
    animation-direction: alternate;
    animation-name: ${keyframes`
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    `};
  }
  --diameter: 100%;
  background-color: pink;
  top: 50%;
  margin-top: -50%;
  margin-left: -50%;
  animation-duration: 3s;
  animation-name: ${keyframes`
    from {
      left: -60%;
    }
    to {
      left: 145%;
    }
  `};
`;

const Moon = styled__default(Circle)`
  @media (prefers-reduced-motion: reduce) {
    display: none
  }
  --diameter: 100%;
  background-color: #fe84d4;
  top: 50%;
  margin-top: -50%;
  margin-left: -50%;
  animation-duration 2s;
  animation-name: ${keyframes`
    from {
      left: -40%;
    }
    to {
      left: 150%;
    }
  `};
`;

const Asteroid = styled__default(Circle)`
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
  --diameter: 30%;
  background-color: MediumSpringGreen;
  top: 100%;
  margin-top: -50%;
  margin-left: -70%;
  animation-duration: 1.5s;
  animation-name: ${keyframes`
    from {
      left: -70%;
    }
    to {
      left: 170%;
    }
  `};
`;

const AsteroidDust = styled__default(Circle)`
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
  --diameter: 25%;
  background-color: #b46bd2;
  top: 100%;
  margin-top: -70%;
  margin-left: -70%;
  animation-duration: 1.3s;
  animation-name: ${keyframes`
    from {
      left: -55%;
    }
    to {
      left: 170%;
    }
  `};
`;

const Loader = (props) => (
  React.createElement(Container$4, { 'data-module': "Loader", ...props, __self: undefined, __source: {fileName: _jsxFileName$9, lineNumber: 124}}
    , React.createElement(Mask, {__self: undefined, __source: {fileName: _jsxFileName$9, lineNumber: 125}}
      , React.createElement(Moon, {__self: undefined, __source: {fileName: _jsxFileName$9, lineNumber: 126}} )
      , React.createElement(Earth, {__self: undefined, __source: {fileName: _jsxFileName$9, lineNumber: 127}} )
      , React.createElement(Asteroid, {__self: undefined, __source: {fileName: _jsxFileName$9, lineNumber: 128}} )
      , React.createElement(AsteroidDust, {__self: undefined, __source: {fileName: _jsxFileName$9, lineNumber: 129}} )
    )
  )
);

const _jsxFileName$a = "/Users/justinfalcone/src/shared-components/lib/mark.js";
const MarkWrap = styled__default.span`
  display: inline-block;
  transform: rotate(-1deg);
  position: relative;
  left: calc(var(--rounded) * -1);
  z-index: 0;
  color: var(--text-color);
  background-color: var(--mark-color);
  padding: var(--rounded) calc(var(--rounded) * 2);
  border-radius: var(--rounded);
`;
const MarkText = styled__default.span`
  position: relative;
  display: inline-block;
  transform: rotate(1deg);
`;

const Mark = ({ color, textColor, children, ...props }) => (
  React.createElement(MarkWrap, { 'data-module': "Mark", style: { '--mark-color': color, '--text-color': textColor }, ...props, __self: undefined, __source: {fileName: _jsxFileName$a, lineNumber: 24}}
    , React.createElement(MarkText, {__self: undefined, __source: {fileName: _jsxFileName$a, lineNumber: 25}}, children)
  )
);
Mark.propTypes = {
  color: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  children: PropTypes.node.isRequired,
};
Mark.defaultProps = {
  textColor: '#222',
};

const _jsxFileName$b = "/Users/justinfalcone/src/shared-components/lib/progress.js";
const ProgressBase = styled__default.progress`
  appearance: none;
  display: block;
  height: 0.75em;
  width: 100%;
  border: 1px solid currentColor;
  background-color: transparent; // firefox
  border-radius: var(--rounded);

  // ugly prefixes sadly required
  &::-webkit-progress-bar {
    background-color: transparent;
  }
  &::-webkit-progress-value {
    background-color: currentColor;
    border-radius: calc(var(--rounded) - 2px);
  }
  &::-moz-progress-bar {
    background-color: currentColor;
    border-radius: calc(var(--rounded) - 2px);
  }
`;

const Progress = ({ children, ...props }) => (
  React.createElement(React.Fragment, null
    , React.createElement(VisuallyHidden, {__self: undefined, __source: {fileName: _jsxFileName$b, lineNumber: 32}}, children)
    , React.createElement(ProgressBase, { 'data-module': "Progress", 'aria-hidden': "true", ...props, __self: undefined, __source: {fileName: _jsxFileName$b, lineNumber: 33}} )
  )
);

Progress.propTypes = {
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

const _jsxFileName$c = "/Users/justinfalcone/src/shared-components/lib/notification.js";
const variants$4 = {
  notice: css`
    color: var(--colors-notice-text);
    background-color: var(--colors-notice-background);
  `,
  success: css`
    color: var(--colors-success-text);
    background-color: var(--colors-success-background);
  `,
  error: css`
    color: var(--colors-error-text);
    background-color: var(--colors-error-background);
  `,
  onboarding: css`
    color: #222;
    background-color: #bfe3ff;
  `,
};

const CloseButton = styled__default(UnstyledButton)`
  flex: 0 0 auto;
  font-size: var(--fontSizes-small);
  margin-bottom: -1rem;
`;

const closingAnimation = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const NotificationBase = styled__default.aside`
  display: flex;
  align-items: flex-start;
  font-size: var(--fontSizes-tiny);
  font-weight: 600;
  padding: var(--space-1) var(--space-1);
  border-radius: var(--rounded);
  animation-duration: 0.1s;
  animation-iteration-count: 1;
  animation-direction: forward;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;

  ${({ variant }) => variants$4[variant]}
  ${({ closing, timeout }) => {
    if (closing) {
      return css`
        animation-name: ${closingAnimation};
        animation-delay: 0;
        &:focus,
        &:hover {
          animation-name: ${closingAnimation};
        }
      `;
    }
    if (timeout > 0) {
      return css`
        animation-name: ${closingAnimation};
        animation-delay: ${timeout}ms;
        &:focus,
        &:hover {
          animation-name: none;
        }
      `;
    }
    return null;
  }}
  & + & {
    margin-top: var(--space-1);
  }
`;

const NotificationContent = styled__default.div`
  flex: 1 1 auto;
  margin-right: var(--space-1);
`;

const Notification = ({ message, live, children, variant, timeout, onClose, ...props }) => {
  const ref = React.useRef();
  const [closing, setClosing] = React.useState(false);

  useLiveAnnouncer({ message: `${variant}: ${message}`, live });

  const handleAnimationEnd = (event) => {
    if (onClose && event.target === ref.current) onClose();
  };
  return (
    React.createElement(NotificationBase, {
      ref: ref,
      'data-module': "Notification",
      variant: variant,
      closing: closing,
      timeout: timeout,
      onAnimationEnd: handleAnimationEnd,
      ...props, __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 101}}
    
      , React.createElement(NotificationContent, {__self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 110}}, children || message)
      , onClose && (
        React.createElement(CloseButton, { onClick: () => setClosing(true), 'aria-label': "Dismiss notification" , __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 112}}
          , React.createElement(Icon, { icon: "x", style: { color: 'inherit' }, __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 113}} )
        )
      )
    )
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  live: PropTypes.oneOf(['polite', 'assertive']),
  children: PropTypes.node,
  variant: PropTypes.oneOf(Object.keys(variants$4)),
  timeout: PropTypes.number,
  onClose: PropTypes.func,
};

Notification.defaultProps = {
  variant: 'notice',
  live: 'polite',
  timeout: 0,
};

let currentID = 0;
const uniqueID = (prefix) => {
  currentID += 1;
  return `${prefix}-${currentID}`;
};

const NotificationContext = React.createContext();
const NotificationsConsumer = NotificationContext.Consumer;
const useNotifications = () => React.useContext(NotificationContext);

const NotificationsContainer = styled__default.div`
  position: fixed;
  z-index: var(--z-notifications);
  top: 0;
  right: 0;
  width: 18rem;
  padding: var(--space-1);
`;

const NotificationsProvider = ({ children, ...props }) => {
  const [notifications, setNotifications] = React.useState([]);
  const removeNotification = (id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== id));
  };

  const contextValue = React.useMemo(() => {
    const createNotification = (Component) => {
      const notification = { id: uniqueID('notification'), Component };
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    };

    const createErrorNotification = (message = 'Something went wrong. Try refreshing?') => {
      createNotification((props) => React.createElement(Notification, { variant: "error", timeout: 2500, live: "polite", message: message, ...props, __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 191}} ));
    };

    return { createNotification, createErrorNotification };
  }, []);

  return (
    React.createElement(LiveAnnouncer, {__self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 198}}
      , React.createElement(NotificationContext.Provider, { value: contextValue, __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 199}}, children)
      , notifications.length > 0 && (
        React.createElement(NotificationsContainer, { 'data-module': "NotificationsContainer", ...props, __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 201}}
          , notifications.map(({ id, Component }) => (
            React.createElement(Component, { key: id, onClose: () => removeNotification(id), __self: undefined, __source: {fileName: _jsxFileName$c, lineNumber: 203}} )
          ))
        )
      )
    )
  );
};

const _jsxFileName$d = "/Users/justinfalcone/src/shared-components/lib/overlay.js";
const OverlayWrap = styled__default.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--space-4) var(--space-1);
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-overlay);
  background-color: rgba(255, 255, 255, 0.5);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const OverlayContent = styled__default.dialog.attrs(() => ({
  'data-module': 'OverlayContent',
  open: true,
  'aria-modal': true,
}))`
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0;
  padding: 0;

  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: var(--colors-background);
  color: var(--colors-primary);
  font-size: var(--fontSizes-small);
  border: 2px var(--colors-primary) solid;
  border-radius: var(--rounded);
  box-shadow: var(--popShadow);
  overflow: auto;
`;

const FixedBodyStyle = createGlobalStyle`
  body {
    position: fixed;
    width: 100%;
    top: -${({ scrollY }) => scrollY}px;
  }
`;

// Toggling between fixed and static position on the body resets the scroll position,
// so we need to store the original position, offset the body when the overlay is open, and reset it when its closed.
const FixedBody = () => {
  const [scrollY, setScrollY] = React.useState(null);
  React.useEffect(() => {
    const prevScrollPosition = window.scrollY;
    setScrollY(prevScrollPosition);
    return () => {
      window.setTimeout(() => window.scrollTo(0, prevScrollPosition), 0);
    };
  }, []);
  return scrollY === null ? null : React.createElement(FixedBodyStyle, { scrollY: scrollY, __self: undefined, __source: {fileName: _jsxFileName$d, lineNumber: 66}} );
};

const useFocusOnMount = (open) => {
  const ref = React.useRef();
  React.useEffect(() => {
    if (open) ref.current.focus();
  }, [open]);
  return ref;
};

const mergeRefs = (...refs) => (el) => {
  for (const ref of refs) {
    ref.current = el;
  }
};

// https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
const Overlay = ({ open, onClose, children, label, contentProps, ...props }) => {
  useEscape(open, onClose);
  const { first, last } = useFocusTrap();
  const focusedOnMount = useFocusOnMount(open);

  const onClickBackground = (e) => {
    if (e.currentTarget === e.target) {
      onClose(e);
    }
  };

  if (!open) return null;

  return (
    React.createElement(OverlayWrap, { 'data-module': "Overlay", onClick: onClickBackground, ...props, __self: undefined, __source: {fileName: _jsxFileName$d, lineNumber: 98}}
      , React.createElement(FixedBody, {__self: undefined, __source: {fileName: _jsxFileName$d, lineNumber: 99}} )
      , React.createElement(OverlayContent, { ...contentProps, __self: undefined, __source: {fileName: _jsxFileName$d, lineNumber: 100}}, children({ onClose, first, last, focusedOnMount }))
    )
  );
};
Overlay.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  contentProps: PropTypes.object,
};

const useOverlay = () => {
  const [open, setOpen] = React.useState(false);
  const toggleRef = React.useRef();
  const onOpen = () => setOpen(true);
  const onClose = (e) => {
    setOpen(false);
    toggleRef.current.focus();
  };
  return { open, onOpen, onClose, toggleRef };
};

const _jsxFileName$e = "/Users/justinfalcone/src/shared-components/lib/popover.js";
const debounce = (fn, timeout) => {
  let handle;
  return (...args) => {
    if (handle) window.clearTimeout(handle);
    handle = window.setTimeout(() => fn(...args), timeout);
  };
};

const usePositionAdjustment = () => {
  const [offset, setOffset] = React.useState({ top: 0, left: 0 });
  const ref = React.useRef();
  React.useLayoutEffect(() => {
    const setPosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect) {
          if (rect.left < 0) {
            setOffset((prevOffset) => ({ ...prevOffset, left: -rect.left }));
          } else if (rect.right > window.innerWidth) {
            setOffset((prevOffset) => ({ ...prevOffset, left: window.innerWidth - rect.right }));
          } else {
            setOffset((prevOffset) => ({ ...prevOffset, left: 0 }));
          }
        }
      }
    };
    const debounced = debounce(setPosition, 300);
    window.addEventListener('resize', debounced);
    setPosition();
    return () => window.removeEventListener('resize', debounced);
  }, []);
  return { ref, offset };
};

const PopoverWrap = styled__default.div`
  position: absolute;
  width: auto;
  ${({ align }) => alignments[align]}
`;

const alignments = {
  left: css`
    left: 0;
  `,
  right: css`
    right: 0;
  `,
  topLeft: css`
    left: 0;
    bottom: 100%;
  `,
  topRight: css`
    right: 0;
    bottom: 100%;
  `,
};

const PopoverInner = styled__default.div`
  position: relative;
  overflow: hidden;
  background-color: var(--colors-background);
  font-size: var(--fontSizes-small);
  border-radius: var(--rounded);

  border: 1px solid var(--colors-border);
  box-shadow: var(--popShadow);
  z-index: 1;
`;

const PopoverContent = ({ align, children, ...props }) => {
  const { ref, offset } = usePositionAdjustment();
  return (
    React.createElement(PopoverWrap, { 'data-module': "Popover", align: align, ...props, __self: undefined, __source: {fileName: _jsxFileName$e, lineNumber: 82}}
      , React.createElement(PopoverInner, { ref: ref, style: offset, __self: undefined, __source: {fileName: _jsxFileName$e, lineNumber: 83}}
        , children
      )
    )
  );
};

const PopoverContainer = styled__default.div`
  position: relative;
  display: inline-block;
`;

const useClickOutside = (open, onClickOutside) => {
  const ref = React.useRef();
  const onClickOutsideProxy = useCallbackProxy(onClickOutside);
  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (document.body.contains(e.target) && !ref.current.contains(e.target)) {
        onClickOutsideProxy(e);
      }
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, [open, onClickOutsideProxy]);
  return ref;
};

const useStack = (defaultState) => {
  const [stack, setStack] = React.useState([defaultState]);
  const top = stack[stack.length - 1];
  const push = (value) => setStack((prev) => prev.concat([value]));
  const pop = () => setStack((prev) => prev.slice(0, -1));
  const clear = () => setStack([defaultState]);
  return { top, push, pop, clear };
};

const Popover = ({ align, renderLabel, views = {}, initialView, children, contentProps, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const focusedOnMount = React.useRef();
  const toggleRef = React.useRef();
  const { top: activeView, push: setActiveView, pop: onBack, clear } = useStack(initialView);
  const activeViewFunc = views[activeView] || children;
  const onOpen = () => {
    setOpen(true);
    clear();
  };
  const onClose = () => {
    setOpen(false);
    clear();
    toggleRef.current.focus();
  };
  React.useEffect(() => {
    if (open && focusedOnMount.current) focusedOnMount.current.focus();
  }, [open, activeView]);

  const rootRef = useClickOutside(open, onClose);

  const onToggle = (e) => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };

  useEscape(open, onClose);

  // see https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton
  return (
    React.createElement(PopoverContainer, { 'data-module': "PopoverMenu", ref: rootRef, ...props, __self: undefined, __source: {fileName: _jsxFileName$e, lineNumber: 155}}
      , renderLabel({ onClick: onToggle, ref: toggleRef })
      , open && (
        React.createElement(PopoverContent, { align: align, ...contentProps, __self: undefined, __source: {fileName: _jsxFileName$e, lineNumber: 158}}
          , activeViewFunc({ setActiveView, onClose, onBack, focusedOnMount })
        )
      )
    )
  );
};
Popover.propTypes = {
  align: PropTypes.oneOf(Object.keys(alignments)).isRequired,
  renderLabel: PropTypes.func.isRequired,
  views: PropTypes.objectOf(PropTypes.func.isRequired),
  initialView: PropTypes.string,
  children: PropTypes.func.isRequired,
  contentProps: PropTypes.object,
};

const WidePopover = styled__default.div`
  width: 22rem;
`;

const ActionsStack = styled__default(Actions)`
  > * + * {
    margin-top: var(--space-1);
    display: block;
  }
`;

const _jsxFileName$f = "/Users/justinfalcone/src/shared-components/lib/remote-component.js";
const amdExports = {};

function defineDefine() {
  if (window.defineSharedComponent) return;
  window.defineSharedComponent = (moduleName, deps, fn) => {
    const module = {
      exports: {},
      react: React,
      'prop-types': PropTypes,
      'styled-components': styled,
      'react-textarea-autosize': TextareaAutosize,
    };
    fn(...deps.map((name) => module[name]));
    amdExports[moduleName] = module.exports;
  };
  window.defineSharedComponent.amd = true;
}

async function loadAMDModule(src) {
  defineDefine();
  // TODO: can this be replaced with `await import(src)` without webpack trying to intercept it?
  await new Promise((resolve, reject) => {
    const scriptTag = document.createElement('script');
    scriptTag.src = src;
    scriptTag.type = 'module';
    scriptTag.onload = resolve;
    scriptTag.onerror = reject;
    document.body.appendChild(scriptTag);
  });
  return amdExports[src];
}

function createRemoteComponent(url, componentName) {
  console.warn(`You are rendering a component from '${url}'. You should remove this before merging into production.`);

  const componentPromise = loadAMDModule(url).then((module) => module[componentName]);

  return (props) => {
    const [Component, setComponent] = React.useState(null);
    React.useEffect(() => {
      componentPromise.then((loadedComponent) => {
        // using function form here because otherwise React interprets the component itself to be the `(prev) => next` function
        setComponent(() => loadedComponent);
      });
    }, []);
    if (!Component) return null;
    return React.createElement(Component, { ...props, __self: this, __source: {fileName: _jsxFileName$f, lineNumber: 52}} );
  };
}

const _jsxFileName$g = "/Users/justinfalcone/src/shared-components/lib/results-list.js";
const ScrollContainer = styled__default.div`
  ${({ scroll }) =>
    scroll &&
    css`
      overflow-y: scroll;
      max-height: 14rem;
    `}
`;

const ResultsListContainer = styled__default.ul`
  margin: 0;
  padding: var(--space-1);
  list-style-type: none;
  border: 1px solid var(--colors-border);
`;

const ResultItemWrap = styled__default.li``;

const ResultsList = React.forwardRef(({ scroll, value, options, onChange, onKeyDown, children, ...props }, ref) => {
  const refs = React.useRef([]);

  const handleKeyDown = (index) => (e) => {
    onKeyDown(e); // propagate other events, e.g. Esc key
    const nextIndex = onArrowKeys(e, index, options);
    if (nextIndex === null) return;
    onChange(options[nextIndex].id, e);
  };

  const currentIndex = options.findIndex((opt) => opt.id === value);
  React.useEffect(() => {
    const element = refs.current[currentIndex];
    if (element) element.focus();
  }, [currentIndex]);

  const getTabIndex = (i) => {
    if (value === null && i === 0) return 0;
    if (value === options[i].id) return 0;
    return -1;
  };

  return (
    React.createElement(ScrollContainer, { 'data-module': "ResultsList", scroll: scroll, ...props, __self: undefined, __source: {fileName: _jsxFileName$g, lineNumber: 49}}
      , React.createElement(ResultsListContainer, {__self: undefined, __source: {fileName: _jsxFileName$g, lineNumber: 50}}
        , options.map((item, i) => (
          React.createElement(ResultItemWrap, { key: item.id, __self: undefined, __source: {fileName: _jsxFileName$g, lineNumber: 52}}
            , children({
              item,
              buttonProps: {
                ref: (el) => {
                  refs.current[i] = el;
                },
                tabIndex: getTabIndex(i),
                onKeyDown: handleKeyDown(i),
              },
            })
          )
        ))
      )
    )
  );
});
ResultsList.propTypes = {
  scroll: PropTypes.bool,
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
    }).isRequired,
  ),
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
  children: PropTypes.func.isRequired,
};
ResultsList.defaultProps = {
  onKeyDown: () => {},
};

const ResultInfo = styled__default.span.attrs(() => ({ 'data-module': 'ResultInfo' }))`
  display: block;
  padding-left: var(--space-2);
  width: 100%;
`;

const ResultName = styled__default.span.attrs(() => ({ 'data-module': 'ResultName' }))`
  font-size: var(--fontSizes-small);
`;

const ResultDescription = styled__default.span.attrs(() => ({ 'data-module': 'ResultDescription' }))`
  display: block;
  color: var(--colors-secondary);
  word-break: break-word;
  font-family: var(--fonts-mono);
  font-size: var(--fontSizes-tiny);
  line-height: 1.5;
  padding-top: var(--space-1);
`;

// This is defined as a <span>, but is actually <UnstyledButton> by default,
// and could also work as an <a>.
// Its defined as a span here so that it doesn't inherit the PropTypes of UnstyledButton
// when its being used as an <a>.
const ResultItem = styled__default.span.attrs(() => ({ 'data-module': 'ResultItem' }))`
  display: flex;
  width: 100%;
  font-size: var(--fontSizes-normal);
  color: var(--colors-primary);
  background-color: var(--colors-background);
  position: relative;
  padding: var(--space-1);
  text-decoration: none;
  &:focus {
    color: var(--colors-selected-text);
    background-color: var(--colors-selected-background);
    ${ResultDescription} {
      color: var(--colors-selected-secondary);
    }
  }
  ${ResultItemWrap} + ${ResultItemWrap} & {
    border-top: 1px solid var(--colors-border);
  }
`;

ResultItem.defaultProps = {
  as: UnstyledButton,
};

const Container$5 = styled__default.div`
  width: 20rem;
`;

const _jsxFileName$h = "/Users/justinfalcone/src/shared-components/lib/text-input.js";
const InputWrap = styled__default.span`
  position: relative;
  display: flex;
  align-items: baseline;
  ${({ variant }) => variants$5[variant]}
`;
const variants$5 = {
  underline: css`
    border-bottom: 1px solid var(--colors-border);
  `,
  opaque: css`
    background-color: var(--colors-background);
    border: 1px solid var(--colors-border);
  `,
};

const InputErrorMessage = styled__default.span`
  color: var(--colors-error-text);
  background-color: var(--colors-error-background);
  border-radius: 0 0 var(--rounded) var(--rounded);
  display: block;
  font-weight: 600
  font-size: var(--fontSizes-small);
  padding: 0.25em 0.5em;
`;

const SearchIcon = styled__default(Icon).attrs(() => ({ icon: 'search' }))`
  position: absolute;
  right: 0.4em;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--colors-placeholder);
`;

const ErrorIcon = styled__default(Icon).attrs(() => ({ icon: 'fireEngine', alt: 'Warning' }))`
  font-size: var(--fontSizes-bigger);
`;

const Label = styled__default.label`
  display: block;
`;

const inputStyles = css`
  min-width: 0;
  flex-grow: 1;
  background: none;
  border: none;
  border-radius: 0;
  box-shadow: none;
  transition: all 0.1s;
  font-size: inherit;
  font-family: var(--fonts-mono);
  padding: 0.25em 0 0.125em;
  color: var(--colors-primary);
  z-index: 1;
  &::placeholder {
    color: var(--colors-placeholder);
  }
  ${({ variant }) =>
    ({
      opaque: css`
        padding-left: var(--space-1);
        padding-right: var(--space-1);
      `,
    }[variant])}
`;

const Input = styled__default.input`
  ${inputStyles}
`;

const Prefix = styled__default.span`
  margin-right: var(--space-1);
`;
const Postfix = styled__default.span`
  margin-left: var(--space-1);
`;

const inputTypes = ['text', 'email', 'password', 'search'];

const TextInput = React.forwardRef(
  ({ label, type, value, onChange, variant, placeholder, error, prefix, postfix, containerProps, ...props }, ref) => (
    React.createElement(Label, { 'data-module': "TextInput", ...containerProps, __self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 92}}
      , React.createElement(VisuallyHidden, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 93}}, label)
      , React.createElement(InputWrap, { variant: variant, __self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 94}}
        , !!prefix && React.createElement(Prefix, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 95}}, prefix)
        , React.createElement(Input, {
          ref: ref,
          variant: variant,
          onChange: (evt) => onChange(evt.target.value, evt),
          type: type,
          value: value,
          spellCheck: type === 'text',
          placeholder: typeof placeholder === 'string' ? placeholder : label,
          ...props, __self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 96}}
        )
        , type === 'search' && React.createElement(SearchIcon, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 106}} )
        , !!error && React.createElement(ErrorIcon, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 107}} )
        , !!postfix && React.createElement(Postfix, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 108}}, postfix)
      )
      , !!error && React.createElement(InputErrorMessage, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 110}}, error)
    )
  ),
);

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(inputTypes),
  variant: PropTypes.oneOf(Object.keys(variants$5)),
  placeholder: PropTypes.string,
  error: PropTypes.node,
  prefix: PropTypes.node,
  postfix: PropTypes.node,
  containerProps: PropTypes.object,
};
TextInput.defaultProps = {
  type: 'text',
  variant: 'underline',
  placeholder: null,
  error: null,
  prefix: null,
  postfix: null,
  containerProps: null,
};

const TextAreaErrorIcon = styled__default(ErrorIcon)`
  position: absolute;
  bottom: 0.25em;
  right: 0;
`;

const TextAreaContent = styled__default(TextareaAutosize)`
  ${inputStyles}
  resize: none;
  transition: none;
`;

const TextArea = React.forwardRef(({ label, value, onChange, variant, error, containerProps, placeholder, ...props }, ref) => (
  React.createElement(Label, { 'data-module': "TextArea", ...containerProps, __self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 178}}
    , React.createElement(VisuallyHidden, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 179}}, label)
    , React.createElement(InputWrap, { variant: variant, __self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 180}}
      , React.createElement(TextAreaContent, {
        variant: variant,
        ref: ref,
        onChange: (evt) => onChange(evt.target.value, evt),
        value: value,
        placeholder: typeof placeholder === 'string' ? placeholder : label,
        ...props, __self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 181}}
      )
      , !!error && React.createElement(TextAreaErrorIcon, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 189}} )
    )
    , !!error && React.createElement(InputErrorMessage, {__self: undefined, __source: {fileName: _jsxFileName$h, lineNumber: 191}}, error)
  )
));

TextArea.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(Object.keys(variants$5)),
  error: PropTypes.node,
  containerProps: PropTypes.object,
};
TextArea.defaultProps = {
  variant: 'underline',
  error: null,
  containerProps: null,
};

const Container$6 = styled__default.div`
  background-color: var(--colors-secondaryBackground);
  padding: var(--space-1);
  border-radius: var(--rounded);
  max-width: 400px;
  > * + * {
    margin-top: var(--space-1);
  }
`;

const PrivateIcon = styled__default(Icon).attrs(() => ({ icon: 'private' }))`
  color: #ab933b;
`;

const BoldTextInput = styled__default(TextInput)`
  font-weight: bold;
`;

const _jsxFileName$i = "/Users/justinfalcone/src/shared-components/lib/search-results.js";
const FloatingResultsList = styled__default(ResultsList)`
  position: absolute;
  width: 100%;
  z-index: 1;
  background-color: var(--colors-background);
  display: none;
`;

const Container$7 = styled__default.span`
  display: block;
  position: relative;
  &:focus-within ${FloatingResultsList} {
    display: block;
  }
`;

const SearchResults = ({ value, options, onChange, onKeyDown, children, ...props }) => {
  const [focused, setFocused] = React.useState(null);
  const inputFocused = () => {
    setFocused(null);
  };
  const firstOptionFocused = () => {
    if (options.length) {
      setFocused(options[0].id);
    }
  };

  return (
    React.createElement(Container$7, { 'data-module': "SearchResults", __self: undefined, __source: {fileName: _jsxFileName$i, lineNumber: 36}}
      , React.createElement(TextInput, {
        type: "search",
        variant: "opaque",
        value: value,
        onChange: onChange,
        onFocus: inputFocused,
        onKeyDown: (e) => {
          if (e.key === 'Escape') {
            e.preventDefault(); // don't clear the search results
            e.target.blur();
          }
          if (e.key === 'ArrowDown') firstOptionFocused();
          onKeyDown(e);
        },
        ...props, __self: undefined, __source: {fileName: _jsxFileName$i, lineNumber: 37}}
      )
      , React.createElement(FloatingResultsList, {
        value: focused,
        onChange: (id) => setFocused(id),
        options: options,
        onKeyDown: (e) => {
          if (e.key === 'Escape') e.target.blur();
        }, __self: undefined, __source: {fileName: _jsxFileName$i, lineNumber: 53}}
      
        , children
      )
    )
  );
};
SearchResults.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
    }).isRequired,
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};
SearchResults.defaultProps = {
  onKeyDown: () => {},
};

const baseTheme = {
  space: ['0', '8px', '16px', '32px', '64px', '128px'],
  fontSizes: {
    tiny: '0.75rem',
    small: '0.875rem',
    normal: '1rem',
    big: '1.125rem',
    bigger: '1.375rem',
    huge: '2rem',
  },
  fonts: {
    mono: "Menlo, Consolas, Monaco, 'Lucida Console', monospace",
    sans: "'Benton Sans', Helvetica, sans-serif",
  },
  z: {
    notifications: 10,
    overlay: 15,
  },
  // TODO: should these be in px or rem?
  breakpoints: ['414px', '592px', '670px', '900px', '1080px'],
  rounded: '5px',
  popShadow: '0px 2px 5px 0px rgba(0,0,0,0.27), 0px 1px 1px 0px rgba(0,0,0,0.15)',
};

const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#222',
    secondary: '#636363',
    placeholder: '#707070',
    border: '#C3C3C3',
    secondaryBackground: '#f5f5f5',
    background: '#fff',
    tertiary: {
      text: '#222',
      background: '#e5e5e5',
    },
    private: {
      text: '#222',
      background: '#fcf3b0',
    },
    error: {
      text: '#fff',
      background: '#DC352C',
    },
    warning: {
      text: '#222',
      background: '#ffdadf',
    },
    notice: {
      text: '#fff',
      background: '#7460E1',
    },
    success: {
      text: '#222',
      background: '#47F68D',
    },
    selected: {
      text: '#222',
      background: '#d9e5f1',
    },
  },
};

const darkTheme = {
  ...baseTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#fff',
    secondary: '#f5f5f5',
    placeholder: '#e0e0e0',
    border: '#B8B8B8',
    secondaryBackground: '#636363',
    background: '#222',
    selected: {
      text: '#fff',
      background: '#244776',
    },
  },
};

export { Actions, AnimationContainer, Avatar, Badge, Button, ButtonGroup, ButtonSegment, CheckboxButton, DangerZone, Icon, IconButton, Info, LiveAnnouncer, LiveAnnouncerConsumer, Loader, LocalStyle, Mark, Notification, NotificationsConsumer, NotificationsProvider, Overlay, Popover, Progress, ResultDescription, ResultInfo, ResultItem, ResultName, ResultsList, RootStyle, SearchResults, SegmentedButton, TextArea, TextInput, Title, UnstyledButton, VisuallyHidden, createRemoteComponent, darkTheme, lightTheme, mergeRefs, slideDown, slideUp, useLiveAnnouncer, useNotifications, useOverlay };
