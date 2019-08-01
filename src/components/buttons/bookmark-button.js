import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import classNames from 'classnames/bind';
import { CDN_URL } from 'Utils/constants';
import TooltipContainer from 'Components/tooltips/tooltip-container';

import styles from './bookmark-button.styl';

const cx = classNames.bind(styles);

const CHECKMARK = `${CDN_URL}/ee609ed3-ee18-495d-825a-06fc588a4d4c%2Fcheck-bookmark.svg?v=1564432004008`;

const Halo = ({ isAnimating }) => (
  <svg
    className={`${styles.halo} ${isAnimating ? styles.haloAnimated : ''}`}
    width="54px"
    height="29px"
    viewBox="0 0 54 29"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
  >
    <g stroke="none" strokeWidth="0" fill="none" fillRule="evenodd">
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

Halo.propTypes = {
  isAnimating: PropTypes.bool.isRequired,
};

const FilledBookmark = () => (
  <svg width="34px" height="41px" viewBox="0 0 34 41" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M26.6767548,5.28000021 C26.9623034,5.28000021 27.2354327,5.33697005 27.496151,5.45091143 C27.9058511,5.61549343 28.2317441,5.87502269 28.4738397,6.229507 C28.7159352,6.58399131 28.8369812,6.97645019 28.8369812,7.40689542 L28.8369812,33.8006522 C28.8369812,34.2310974 28.7159352,34.6235563 28.4738397,34.9780406 C28.2317441,35.3325249 27.9058511,35.5920542 27.496151,35.7566362 C27.260263,35.8579174 26.9871337,35.9085572 26.6767548,35.9085572 C26.0808272,35.9085572 25.565606,35.7059978 25.1310755,35.3008729 L16.9184906,27.2490553 L8.70590566,35.3008729 C8.25896003,35.718658 7.74373876,35.9275474 7.16022641,35.9275474 C6.87467781,35.9275474 6.60154847,35.8705775 6.34083018,35.7566362 C5.93113002,35.5920542 5.60523706,35.3325249 5.36314151,34.9780406 C5.12104596,34.6235563 5,34.2310974 5,33.8006522 L5,7.40689542 C5,6.97645019 5.12104596,6.58399131 5.36314151,6.229507 C5.60523706,5.87502269 5.93113002,5.61549343 6.34083018,5.45091143 C6.60154847,5.33697005 6.87467781,5.28000021 7.16022641,5.28000021 L26.6767548,5.28000021 Z"
        stroke="#222222"
        strokeWidth="2"
        fill="#05D458"
        fillRule="nonzero"
      />
      <g transform="translate(3.000000, 3.280000)" fillRule="nonzero">
        <path
          className={`${styles.highlight}`}
          d="M27.8369812,4.12689521 L27.8369812,30.520652 C27.8369812,31.3635763 27.5994484,32.1319071 27.1254226,32.8259915 C26.6625495,33.5037455 26.0437244,34.0058666 25.2622741,34.3241575 C24.8045649,34.5169823 24.278348,34.628557 23.6767548,34.628557 C22.5452714,34.628557 21.5687972,34.2398226 20.7465264,33.4643069 L13.9184906,26.7699348 L7.09114604,33.4636291 C6.24484059,34.2630068 5.26400236,34.6475472 4.16022641,34.6475472 C3.60578019,34.6475472 3.07509269,34.5386452 2.56802473,34.3214296 C1.78972801,34.0030009 1.17311138,33.5018124 0.711558447,32.8259914 C0.237532711,32.1319072 -1.77635684e-15,31.3635763 -1.77635684e-15,30.520652 L-1.77635684e-15,4.12689521 C-1.77635684e-15,3.28397081 0.237532705,2.51563999 0.711558432,1.82155584 C1.17311133,1.14573483 1.78972787,0.644546405 2.5680245,0.326117681 C3.07509253,0.108901981 3.60578011,5.68434189e-14 4.16022641,5.68434189e-14 L23.6767548,5.68434189e-14 C24.2312011,5.68434189e-14 24.7618886,0.108901979 25.2689567,0.326117696 C26.0472531,0.64454638 26.6638697,1.14573475 27.1254228,1.821556 C27.5994484,2.5156401 27.8369812,3.28397088 27.8369812,4.12689521 Z"
          stroke="#A2D7FF"
          strokeWidth="6"
        />
        <path
          d="M23.825,1.71999979 C24.1125015,1.71999979 24.3874987,1.7776248 24.65,1.89287653 C25.062502,2.05935125 25.3906237,2.32186515 25.634375,2.6804261 C25.8781262,3.03898705 26,3.43595928 26,3.87135472 L26,30.5686449 C26,31.0040403 25.8781262,31.4010125 25.634375,31.7595735 C25.3906237,32.1181344 25.062502,32.3806484 24.65,32.5471231 C24.4124988,32.649569 24.1375016,32.7007912 23.825,32.7007912 C23.2249969,32.7007912 22.7062522,32.4959023 22.26875,32.0861184 L14,23.9417033 L5.73125,32.0861184 C5.28124775,32.5087081 4.76250293,32.7199998 4.175,32.7199998 C3.88749856,32.7199998 3.61250131,32.6623747 3.34999999,32.5471231 C2.93749793,32.3806484 2.60937622,32.1181344 2.365625,31.7595735 C2.12187378,31.4010125 2,31.0040403 2,30.5686449 L2,3.87135472 C2,3.43595928 2.12187378,3.03898705 2.365625,2.6804261 C2.60937622,2.32186515 2.93749793,2.05935125 3.34999999,1.89287653 C3.61250131,1.7776248 3.88749856,1.71999979 4.175,1.71999979 L23.825,1.71999979 Z"
          stroke="#222222"
          strokeWidth="2"
          fill="#05D458"
        />
      </g>
    </g>
  </svg>
);

const EmptyBookmark = () => (
  <svg width="34px" height="41px" viewBox="0 0 34 41" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(3.000000, 3.000000)" fillRule="nonzero">
        <path
          className={`${styles.highlight}`}
          d="M27.8369812,4.40689542 L27.8369812,30.8006522 C27.8369812,31.6435765 27.5994484,32.4119073 27.1254226,33.1059917 C26.6625495,33.7837457 26.0437244,34.2858668 25.2622741,34.6041577 C24.8045649,34.7969825 24.278348,34.9085572 23.6767548,34.9085572 C22.5452714,34.9085572 21.5687972,34.5198229 20.7465264,33.7443071 L13.9184906,27.049935 L7.09114604,33.7436293 C6.24484059,34.543007 5.26400236,34.9275474 4.16022641,34.9275474 C3.60578019,34.9275474 3.07509269,34.8186454 2.56802473,34.6014298 C1.78972801,34.2830011 1.17311138,33.7818126 0.711558447,33.1059916 C0.237532711,32.4119074 0,31.6435766 0,30.8006522 L0,4.40689542 C0,3.56397102 0.237532705,2.7956402 0.711558432,2.10155605 C1.17311133,1.42573504 1.78972787,0.924546613 2.5680245,0.606117889 C3.07509253,0.388902189 3.60578011,0.280000208 4.16022641,0.280000208 L23.6767548,0.280000208 C24.2312011,0.280000208 24.7618886,0.388902187 25.2689567,0.606117904 C26.0472531,0.924546588 26.6638697,1.42573495 27.1254228,2.10155621 C27.5994484,2.79564031 27.8369812,3.56397109 27.8369812,4.40689542 Z"
          stroke="#A2D7FF"
          strokeWidth="6"
        />
        <path
          d="M23.825,2 C24.1125014,2 24.3874987,2.057625 24.65,2.17287674 C25.0625021,2.33935146 25.3906238,2.60186536 25.634375,2.9604263 C25.8781263,3.31898725 26,3.71595949 26,4.15135492 L26,30.848645 C26,31.2840406 25.8781263,31.6810128 25.634375,32.0395737 C25.3906238,32.3981347 25.0625021,32.6606485 24.65,32.8271233 C24.4124989,32.9295693 24.1375015,32.9807914 23.825,32.9807914 C23.224997,32.9807914 22.7062522,32.7759026 22.26875,32.3661186 L14,24.2217036 L5.73125001,32.3661186 C5.28124775,32.7887083 4.76250293,33 4.175,33 C3.88749857,33 3.61250132,32.942375 3.35,32.8271233 C2.93749794,32.6606485 2.60937622,32.3981347 2.365625,32.0395737 C2.12187378,31.6810128 2,31.2840406 2,30.848645 L2,4.15135492 C2,3.71595949 2.12187378,3.31898725 2.365625,2.9604263 C2.60937622,2.60186536 2.93749794,2.33935146 3.35,2.17287674 C3.61250132,2.057625 3.88749857,2 4.175,2 L23.825,2 Z"
          stroke="#C3C3C3"
          strokeWidth="2"
          fill="#FFFFFF"
        />
        <g transform="translate(8.520000, 8.756020)" fill="#C3C3C3">
          <path d="M6.71389301,4.03725727 L8.85939217,4.03725727 C9.40526918,4.03725727 9.84778993,4.47977802 9.84778993,5.02565503 C9.84778993,5.57153204 9.40526918,6.01405279 8.85939217,6.01405279 L6.71389301,6.01405279 L6.71389301,8.15955193 C6.71389301,8.885195 6.12564307,9.47344494 5.4,9.47344494 C4.67435693,9.47344494 4.08610699,8.885195 4.08610699,8.15955193 L4.08610699,6.01405279 L1.94060787,6.01405279 C1.39473119,6.01405279 0.952210074,5.57153235 0.952210074,5.02565503 C0.952210074,4.47977771 1.39473119,4.03725727 1.94060787,4.03725727 L4.08610699,4.03725727 L4.08610699,1.89175813 C4.08610699,1.16611506 4.67435693,0.577865119 5.4,0.577865119 C6.12564307,0.577865119 6.71389301,1.16611506 6.71389301,1.89175813 L6.71389301,4.03725727 Z M4.82424913,4.1244089 L5.97575087,4.1244089 L5.97575087,5.92690116 L4.82424913,5.92690116 L4.82424913,4.1244089 Z" />
        </g>
      </g>
    </g>
  </svg>
);

const BookmarkButton = ({ action, initialIsBookmarked }) => {
  console.log("initialIsBookmarked", initialIsBookmarked)
  const [state, setState] = React.useState({ isBookmarked: initialIsBookmarked, isAnimating: false, isFocused: false });
  React.useEffect(() => {
    setState({...state, isBookmarked: initialIsBookmarked })
  }, [initialIsBookmarked])
  const addText = 'Add to My Stuff';
  const removeText = 'Remove from My Stuff';

  const onClick = (e) => {
    const fromKeyboard = !e.detail; // only show focus highlighting if onClick triggered from keyboard input
    if (!state.isBookmarked) {
      setState({ isFocused: fromKeyboard, isAnimating: true, isBookmarked: true });
    } else {
      setState({ isFocused: fromKeyboard, isAnimating: false, isBookmarked: false });
    }
    if (action) action();
  };
  const onFocus = () => {
    setState({ ...state, isFocused: true });
  };
  const onBlur = () => {
    setState({ ...state, isFocused: false });
  };

  const checkClassName = cx({
    check: true,
    checkAnimated: state.isAnimating,
    hidden: !state.isBookmarked,
  });
  
  

  return (
    <TooltipContainer
      type="action"
      tooltip={state.isBookmarked ? removeText : addText}
      target={
        <button
          className={`${styles.bookmarkButton} ${state.isFocused ? styles.focused : ''}`}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-pressed={state.isBookmarked ? 'true' : 'false'}
          aria-label="Add project to My Stuff"
        >
          <Halo isAnimating={state.isAnimating} />
          {state.isBookmarked ? <FilledBookmark /> : <EmptyBookmark />}
          <Image className={checkClassName} src={CHECKMARK} alt="" width="10px" height="10px" />
        </button>
      }
    />
  );
};

BookmarkButton.propTypes = {
  action: PropTypes.func,
  initialIsBookmarked: PropTypes.bool,
};

BookmarkButton.defaultProps = {
  action: undefined,
  initialIsBookmarked: false,
};

export default BookmarkButton;
