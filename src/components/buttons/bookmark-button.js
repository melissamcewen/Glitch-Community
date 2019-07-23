import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';

import styles from './bookmark-button.styl';

const CHECKMARK = 'https://cdn.glitch.com/6d94a2b0-1c44-4a6e-8b57-417c8e6e93e7%2Fcheck.svg?v=1563224340442';
const EMPTY_BOOKMARK = 'https://cdn.glitch.com/6d94a2b0-1c44-4a6e-8b57-417c8e6e93e7%2Fatms-btn-empty.svg?v=1563224340818';
const FILLED_BOOKMARK = 'https://cdn.glitch.com/6d94a2b0-1c44-4a6e-8b57-417c8e6e93e7%2Fatms-btn-filled-no-check.svg?v=1563224341311';

const Halo = ({ isBookmarked }) => {
  return (
    <svg
      className={`${styles.halo} ${isBookmarked ? styles.haloAnimated : ''}`}
      width="54px"
      height="29px"
      viewbox="0 0 54 29"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-57.000000, -14.000000)">
          <g transform="translate(57.000000, 14.000000)">
            <path
              d="M45.6415248,26.8428627 C45.6415248,26.8031127 45.6415248,26.7621581 45.6403203,26.7212036 C45.6282748,25.9502945 46.216093,25.302249 46.9857975,25.2408172 L51.3197521,24.8951127 C52.2641157,24.8204308 53.0747748,25.5600218 53.092843,26.5067945 C53.0940475,26.6296581 53.0964907,26.7525218 53.0964907,26.8765899 C53.1024794,27.8233627 52.3098884,28.5822263 51.3643203,28.5292263 L47.0219339,28.2895218 C46.2522294,28.2473627 45.6487521,27.6149763 45.6415248,26.8428627"
              className={styles.halo5}
              fill="#7460E1"
            />
            <path
              d="M39.0570438,10.9465192 C39.0570438,10.9067692 39.0570438,10.8658147 39.0558392,10.8248601 C39.0437938,10.053951 39.6316119,9.40590556 40.4013165,9.34447375 L44.735271,8.9987692 C45.6796347,8.92408738 46.4902938,9.66367829 46.5083619,10.610451 C46.5095665,10.7333147 46.5120097,10.8561783 46.5120097,10.9802465 C46.5179983,11.9270192 45.7254074,12.6858828 44.7798392,12.6328828 L40.4374528,12.3931783 C39.6677483,12.3510192 39.064271,11.7186328 39.0570438,10.9465192"
              className={styles.halo4}
              fill="#C454FF"
              transform="translate(42.783834, 10.814536) rotate(-45.000000) translate(-42.783834, -10.814536) "
            />
            <path
              d="M23.1607003,4.36203815 C23.1607003,4.32228815 23.1607003,4.2813336 23.1594958,4.24037906 C23.1474503,3.46946997 23.7352685,2.82142451 24.504973,2.75999269 L28.8389276,2.41428815 C29.7832912,2.33960633 30.5939503,3.07919724 30.6120185,4.02596997 C30.613223,4.1488336 30.6156662,4.27169724 30.6156662,4.39576542 C30.6216548,5.34253815 29.8290639,6.10140178 28.8834958,6.04840178 L24.5411094,5.80869724 C23.7714048,5.76653815 23.1679276,5.13415178 23.1607003,4.36203815"
              className={styles.halo3}
              fill="#83FFCD"
              transform="translate(26.887490, 4.230055) rotate(-90.000000) translate(-26.887490, -4.230055) "
            />
            <path
              d="M7.26435683,10.9465192 C7.26435683,10.9067692 7.26435683,10.8658147 7.26315229,10.8248601 C7.25110683,10.053951 7.83892502,9.40590556 8.60862956,9.34447375 L12.9425841,8.9987692 C13.8869477,8.92408738 14.6976068,9.66367829 14.715675,10.610451 C14.7168796,10.7333147 14.7193228,10.8561783 14.7193228,10.9802465 C14.7253114,11.9270192 13.9327205,12.6858828 12.9871523,12.6328828 L8.64476593,12.3931783 C7.87506138,12.3510192 7.27158411,11.7186328 7.26435683,10.9465192"
              className={styles.halo2}
              fill="#FFE100"
              transform="translate(10.991147, 10.814536) rotate(-135.000000) translate(-10.991147, -10.814536) "
            />
            <path
              d="M0.679875781,26.8428627 C0.679875781,26.8031127 0.679875781,26.7621581 0.678671235,26.7212036 C0.666625781,25.9502945 1.25444396,25.302249 2.02414851,25.2408172 L6.35810305,24.8951127 C7.30246669,24.8204308 8.11312578,25.5600218 8.13119396,26.5067945 C8.13239851,26.6296581 8.1348417,26.7525218 8.1348417,26.8765899 C8.14083033,27.8233627 7.34823942,28.5822263 6.40267124,28.5292263 L2.06028487,28.2895218 C1.29058033,28.2473627 0.687103054,27.6149763 0.679875781,26.8428627"
              className={styles.halo1}
              fill="#DC352C"
              transform="translate(4.406666, 26.710879) rotate(-180.000000) translate(-4.406666, -26.710879) "
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

const BookmarkButton = ({ action, initialIsBookmarked }) => {
  const [isBookmarked, setIsBookmarked] = React.useState(initialIsBookmarked);
  const onClick = () => {
    setIsBookmarked(!isBookmarked);
    if (action) action();
  };

  return (
    <button className={styles.bookmarkButton} onClick={onClick} aria-pressed={isBookmarked ? 'true' : 'false'} aria-label="Add project to My Stuff">
      <Halo isBookmarked={isBookmarked} />
      <Image src={isBookmarked ? FILLED_BOOKMARK : EMPTY_BOOKMARK} alt=""/>
      <Image className={`${styles.check} ${isBookmarked ? styles.checkAnimated : ''}`} src={CHECKMARK} alt="" width="10px" height="10px"/>
    </button>
  );
};

BookmarkButton.propTypes = {
  action: PropTypes.function,
  initialIsBookmarked: PropTypes.bool,
};

BookmarkButton.defaultPropTypes = {
  action: undefined,
  initialIsBookmarked: false,
};

export default BookmarkButton;
