import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Emoji from 'Components/images/emoji';
import Link from 'Components/link';
import styles from './button.styl';

const cx = classNames.bind(styles);

export const TYPES = ['tertiary', 'cta', 'dangerZone', 'dropDown'];
export const SIZES = ['small'];

/**
 * Button Component
 */

const Button = React.forwardRef(
  ({ onClick, href, disabled, type, size, matchBackground, hover, children, active, decorative, newTab, image, imagePosition, emoji }, ref) => {
    const className = cx({
      btn: true,
      cta: type === 'cta',
      small: size === 'small' || type === 'dangerZone', // we want to demphasize dangerous actions, so we make them small
      tertiary: ['tertiary', 'dangerZone'].includes(type),
      dangerZone: type === 'dangerZone',
      unstyled: type === 'dropDown',
      hasImage: emoji || image,
      hasNarrowEmoji: ['balloon', 'index', 'policeOfficer'].includes(emoji),
      hasSunglassesEmoji: emoji === 'sunglasses',
      padLeft: (image || emoji) && imagePosition === 'left',
      matchBackground: matchBackground === true,
      active,
      hover,
      decorative,
    });

    const content = (
      <>
        {children}
        {emoji && <ButtonEmoji emoji={emoji} position={imagePosition} />}
        {image && <ButtonImage image={image} position={imagePosition} />}
      </>
    );

    if (href) {
      let targetProps = {};
      if (newTab) {
        targetProps = {
          target: '_blank',
          rel: 'noopener noreferrer',
        };
      }

      return (
        <Link to={href} ref={ref} onClick={onClick} className={className} {...targetProps}>
          {content}
        </Link>
      );
    }

    if (decorative) {
      return (
        <span className={className} disabled={disabled}>
          {content}
        </span>
      );
    }

    return (
      <button ref={ref} onClick={onClick} className={className} disabled={disabled}>
        {content}
      </button>
    );
  },
);

Button.propTypes = {
  /** element(s) to display in the button */
  children: PropTypes.node.isRequired,
  /** callback when button clicked */
  onClick: (props, propName, componentName) => {
    if (!props.onClick && !props.href && !props.decorative) {
      return new Error(`One of props 'onClick', 'href', 'decorative' was not specified in '${componentName}'.`);
    }
    return null;
  },
  /** OR link when button clicked */
  href: (props, propName, componentName) => {
    if (!props.onClick && !props.href && !props.decorative) {
      return new Error(`One of props 'href', 'onClick', 'decorative' was not specified in '${componentName}'.`);
    }
    return null;
  },
  /** OR its decorative, because its inside a larger button/link */
  decorative: PropTypes.bool,
  /** button disabled */
  disabled: PropTypes.bool,
  /** type of button */
  type: PropTypes.oneOf(TYPES),
  /** size of button */
  size: PropTypes.oneOf(SIZES),
  /** whether or not the button's hover state should be active */
  hover: PropTypes.bool,
  /** whether or not the button should match its background */
  matchBackground: PropTypes.bool,
  /** whether the button is active or not */
  active: PropTypes.bool,
  /** whether the link opens in a new tab or the same window */
  newTab: PropTypes.bool,
  /** an image node to display within the button */
  image: PropTypes.node,
  /** Whether Emoji is to left or right of other content */
  imagePosition: PropTypes.oneOf(['left', 'right']),
  /** emoji name */
  emoji: PropTypes.string,
};

Button.defaultProps = {
  onClick: null,
  href: null,
  disabled: false,
  type: null,
  size: null,
  hover: false,
  matchBackground: false,
  active: false,
  decorative: false,
  newTab: false,
  image: null,
  imagePosition: 'right',
  emoji: null,
};

const ButtonImage = ({ image, position, up1 }) => {
  const className = cx({
    imageContainer: true,
    alignLeft: position === 'left',
    up1,
  });

  return <div className={className}>{image}</div>;
};

ButtonImage.propTypes = {
  image: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['right', 'left']).isRequired,
  up1: PropTypes.bool,
};

ButtonImage.defaultProps = {
  up1: false,
};

const ButtonEmoji = ({ emoji, ...props }) => (
  <ButtonImage image={<Emoji name={emoji} />} up1={['bentoBox', 'bomb', 'clapper', 'herb', 'dogFace', 'framedPicture'].includes(emoji)} {...props} />
);

ButtonEmoji.propTypes = {
  emoji: PropTypes.string.isRequired,
};

export default Button;
