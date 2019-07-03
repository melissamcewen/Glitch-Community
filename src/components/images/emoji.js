import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './emoji.styl';

const cx = classNames.bind(styles);

const downArrow = () 

const EMOJIS = {
  ambulance: 'https://cdn.glitch.com/cc880f8d-a84f-4909-b676-497522a8c625%2Fambulance.png',
  arrowDown: 'https://cdn.glitch.com/20b03a49-e2c4-45fb-b411-c56cf5a734d4%2Farrow-down.png',
  balloon: 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fballoon.png',
  bentoBox: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fbento-box.png',
  bicep: 'https://cdn.glitch.com/a7b5cfd3-307b-4b99-bc1c-ca96f720521a%2Fbiceps.png?1555609837062',
  bomb: 'https://cdn.glitch.com/f34c5d19-c958-40f6-b11f-7a4542a5ae5f%2Fbomb.png',
  bouquet: 'https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fbouquet.png',
  carpStreamer: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fcarp_streamer.png',
  clapper: 'https://cdn.glitch.com/25a45fb6-d565-483a-87d2-f944befeb36b%2Fclapper.png',
  creditCard: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fcredit-card.png',
  crystalBall: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fcrystal-ball_1f52e.png',
  diamondSmall: 'https://cdn.glitch.com/180b5e22-4649-4c71-9a21-2482eb557c8c%2Fdiamond-small.svg',
  dogFace: 'https://cdn.glitch.com/03736932-82dc-40e8-8dc7-93330c933143%2Fdog-face.png',
  downArrow: 'https://cdn.glitch.com/e3d100c3-3c8c-479a-b266-560149d7a604%2Fdown-arrow.svg',
  email: 'https://cdn.glitch.com/aebac4f9-ae14-4d54-aa60-de46dac3b603%2Femail.png',
  eyes: 'https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Feyes.png',
  facebook: 'https://cdn.gomix.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Ffacebook-logo.png',
  faceExpressionless: 'https://cdn.glitch.com/a7b5cfd3-307b-4b99-bc1c-ca96f720521a%2Fface-expressionless.png?1555609837739',
  faceSlightlySmiling: 'https://cdn.glitch.com/a7b5cfd3-307b-4b99-bc1c-ca96f720521a%2Fface-slightly-smiling.png?1555609837380',
  fastDown: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffast_down.png',
  fastUp: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffast_up.png',
  fishingPole: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Ffishing_pole.png',
  framedPicture: 'https://cdn.glitch.com/f7224274-1330-4022-a8f2-8ae09dbd68a8%2Fframed_picture.png',
  google: 'https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2FgoogleLogo.png',
  herb: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fherb.png',
  key: 'https://cdn.glitch.com/006d6bcf-f2b7-4a29-b55d-c097b491e09c%2Fkey.png?1555429359426',
  mailboxOpen: 'https://cdn.glitch.com/006d6bcf-f2b7-4a29-b55d-c097b491e09c%2Fopen-mailbox.png?1555429351403',
  horizontalTrafficLight: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fhorizontal-traffic-light_1f6a5.png',
  index: 'https://cdn.glitch.com/997e1260-f54f-47ad-936b-1eca8e555a51%2Findex.png?1555620428434',
  microphone: 'https://cdn.glitch.com/9c72d8a2-2546-4c4c-9e97-2e6450752c11%2Fmicrophone.png',
  newspaper: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fnewspaper_1f4f0.png',
  octocat: 'https://gomix.com/images/emojis/github-logo-light.svg',
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
  sunglasses: 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fshow-app.svg',
  thumbsDown: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fthumbs_down.png',
  thumbsUp: 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Fthumbs-up.png',
  umbrella: 'https://cdn.glitch.com/d1106f7a-2623-4461-8326-5945e5b97d8b%2Fumbrella_2602.png',
  wave: 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fwave.png',
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
