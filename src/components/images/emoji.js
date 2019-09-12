import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './emoji.styl';

const cx = classNames.bind(styles);

const EMOJIS = {
  ambulance: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fambulance.png',
  arrowDown: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Farrow-down.png',
  balloon: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fballoon.png',
  bentoBox: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbento-box.png',
  bicep: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbiceps.png',
  bomb: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbomb.png',
  bouquet: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fbouquet.png',
  carpStreamer: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcarp_streamer.png',
  clapper: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fclapper.png?v=1564970973232',
  creditCard: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcredit-card.png?v=1564971352521',
  crystalBall: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fcrystal-ball_1f52e.png',
  diamondSmall: 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fdiamond-small.svg',
  dogFace: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fdog-face.png',
  email: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Femail.png',
  eyes: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Feyes.png',
  facebook: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffacebook-logo.png?v=1565101075165',
  faceExpressionless: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-expressionless.png',
  faceSlightlySmiling: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-slightly-smiling.png',
  fastDown: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffast_down.png',
  fastUp: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffast_up.png',
  fishingPole: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Ffishing_pole.png',
  framedPicture: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fframed_picture.png',
  google: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FgoogleLogo.png',
  herb: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fherb.png',
  key: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fkey.png',
  keyboard: 'https://cdn.glitch.com/972abf14-29f7-4556-b34d-996d5c699008%2Fkeyboard.png?v=1565900574287',
  mailboxOpen: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fopen-mailbox.png',
  horizontalTrafficLight: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fhorizontal-traffic-light_1f6a5.png',
  index: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Findex.png',
  loveLetter: 'https://cdn.glitch.com/7ce3d054-7a26-40e1-9268-4189fc526e5b%2Flove-letter.png',
  microphone: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fmicrophone.png',
  mouse: 'https://cdn.glitch.com/972abf14-29f7-4556-b34d-996d5c699008%2Fmouse.png?v=1565900575478',
  new: 'https://cdn.glitch.com/972abf14-29f7-4556-b34d-996d5c699008%2Fnew.png?v=1565900204323',
  newspaper: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fnewspaper_1f4f0.png',
  octocat: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fgithub-logo.svg',
  park: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fnational-park_1f3de.png',
  playButton: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg',
  policeOfficer: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fpolice-officer_1f46e.png',
  pushpin: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fpushpin.png',
  rainbow: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Frainbow.png',
  scales: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fscales_64.png',
  sick: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fface-with-thermometer_1f912.png',
  slack: 'https://cdn.glitch.com/1eaf9cb4-5150-4c24-bb91-28623c3b9da4%2Fslack.svg',
  sparkles: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fsparkles.png',
  sparklingHeart: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fsparkling_heart.png',
  spiralNotePad: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fspiral_note_pad.png',
  sunglasses: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg',
  thumbsDown: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fthumbs_down.png',
  thumbsUp: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fthumbs-up.png',
  umbrella: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fumbrella.png',
  wave: 'https://cdn.glitch.com/7e047504-e283-4115-bb1a-65dc0d431fa6%2Fwave.png',
};

/**
 * Emoji Component
 */

const Emoji = ({ name, inTitle, alt }) => {
  const classNameObj = { emoji: true, [name]: true, inTitle };
  const className = cx(classNameObj);

  return <img className={className} src={EMOJIS[name]} alt={alt} />;
};

Emoji.propTypes = {
  /** element(s) to display in the button */
  name: PropTypes.oneOf(Object.keys(EMOJIS)).isRequired,
  inTitle: PropTypes.bool,
  alt: PropTypes.string,
};

Emoji.defaultProps = {
  inTitle: false,
  alt: '',
};

export default Emoji;
