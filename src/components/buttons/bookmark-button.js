import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import classNames from 'classnames/bind';
import { CDN_URL } from 'Utils/constants';
import TooltipContainer from 'Components/tooltips/tooltip-container';
import HiddenCheckbox from 'Components/fields/hidden-checkbox';

import styles from './bookmark-button.styl';

const cx = classNames.bind(styles);

const CHECKMARK = `${CDN_URL}/979b3751-5b48-4702-8aa3-9f558f429877%2Fcheck.svg?v=1564776265338`;

const Halo = ({ isAnimating, onAnimationEnd }) => (
  <svg
    className={`${styles.halo} ${isAnimating ? styles.haloAnimated : ''}`}
    onAnimationEnd={onAnimationEnd}
    width="54"
    height="29"
    viewBox="0 0 54 29"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
  >
    <g fill="none">
      <path
        className={styles.halo5}
        d="M45.642 26.843c0-.04 0-.08-.002-.122a1.462 1.462 0 0 1 1.346-1.48l4.334-.346a1.646 1.646 0 0 1 1.773 1.612c.001.123.003.246.003.37a1.643 1.643 0 0 1-1.732 1.652l-4.342-.24a1.46 1.46 0 0 1-1.38-1.446"
        fill="#7460E1"
      />
      <path
        className={styles.halo4}
        d="M40.242 13.543a4.137 4.137 0 0 0-.087-.085 1.462 1.462 0 0 1-.095-1.998l2.82-3.31a1.646 1.646 0 0 1 2.393-.113c.088.086.176.17.264.258.674.666.65 1.763-.056 2.394l-3.24 2.9a1.46 1.46 0 0 1-2-.046"
        fill="#C454FF"
      />
      <path
        className={styles.halo3}
        d="M27.02 7.957l-.122.001a1.462 1.462 0 0 1-1.48-1.345l-.346-4.334A1.646 1.646 0 0 1 26.683.506c.123-.002.246-.004.37-.004a1.643 1.643 0 0 1 1.653 1.732l-.24 4.342a1.46 1.46 0 0 1-1.447 1.38"
        fill="#83FFCD"
      />
      <path
        className={styles.halo2}
        d="M13.72 13.356a4.137 4.137 0 0 0-.085.087 1.462 1.462 0 0 1-1.999.096l-3.309-2.82a1.646 1.646 0 0 1-.114-2.394c.086-.088.171-.176.26-.264a1.643 1.643 0 0 1 2.393.056l2.9 3.24a1.46 1.46 0 0 1-.046 2"
        fill="#FFE100"
      />
      <path
        className={styles.halo1}
        d="M8.133 26.579c0 .04 0 .08.002.122a1.462 1.462 0 0 1-1.346 1.48l-4.334.346a1.646 1.646 0 0 1-1.773-1.612c-.001-.123-.004-.246-.004-.37a1.643 1.643 0 0 1 1.733-1.652l4.342.24a1.46 1.46 0 0 1 1.38 1.446"
        fill="#DC352C"
      />
    </g>
  </svg>
);

Halo.propTypes = {
  isAnimating: PropTypes.bool.isRequired,
};

const FilledBookmark = () => (
  <svg className={styles.bookmark} viewBox="0 0 34 41" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
  <svg className={styles.bookmark} viewBox="0 0 34 41" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(3.000000, 3.000000)" fillRule="nonzero">
        <path
          className={styles.highlight}
          d="M27.8369812,4.40689542 L27.8369812,30.8006522 C27.8369812,31.6435765 27.5994484,32.4119073 27.1254226,33.1059917 C26.6625495,33.7837457 26.0437244,34.2858668 25.2622741,34.6041577 C24.8045649,34.7969825 24.278348,34.9085572 23.6767548,34.9085572 C22.5452714,34.9085572 21.5687972,34.5198229 20.7465264,33.7443071 L13.9184906,27.049935 L7.09114604,33.7436293 C6.24484059,34.543007 5.26400236,34.9275474 4.16022641,34.9275474 C3.60578019,34.9275474 3.07509269,34.8186454 2.56802473,34.6014298 C1.78972801,34.2830011 1.17311138,33.7818126 0.711558447,33.1059916 C0.237532711,32.4119074 0,31.6435766 0,30.8006522 L0,4.40689542 C0,3.56397102 0.237532705,2.7956402 0.711558432,2.10155605 C1.17311133,1.42573504 1.78972787,0.924546613 2.5680245,0.606117889 C3.07509253,0.388902189 3.60578011,0.280000208 4.16022641,0.280000208 L23.6767548,0.280000208 C24.2312011,0.280000208 24.7618886,0.388902187 25.2689567,0.606117904 C26.0472531,0.924546588 26.6638697,1.42573495 27.1254228,2.10155621 C27.5994484,2.79564031 27.8369812,3.56397109 27.8369812,4.40689542 Z"
          stroke="#A2D7FF"
          strokeWidth="6"
        />
        <path
          className={styles.flag}
          d="M23.825,2 C24.1125014,2 24.3874987,2.057625 24.65,2.17287674 C25.0625021,2.33935146 25.3906238,2.60186536 25.634375,2.9604263 C25.8781263,3.31898725 26,3.71595949 26,4.15135492 L26,30.848645 C26,31.2840406 25.8781263,31.6810128 25.634375,32.0395737 C25.3906238,32.3981347 25.0625021,32.6606485 24.65,32.8271233 C24.4124989,32.9295693 24.1375015,32.9807914 23.825,32.9807914 C23.224997,32.9807914 22.7062522,32.7759026 22.26875,32.3661186 L14,24.2217036 L5.73125001,32.3661186 C5.28124775,32.7887083 4.76250293,33 4.175,33 C3.88749857,33 3.61250132,32.942375 3.35,32.8271233 C2.93749794,32.6606485 2.60937622,32.3981347 2.365625,32.0395737 C2.12187378,31.6810128 2,31.2840406 2,30.848645 L2,4.15135492 C2,3.71595949 2.12187378,3.31898725 2.365625,2.9604263 C2.60937622,2.60186536 2.93749794,2.33935146 3.35,2.17287674 C3.61250132,2.057625 3.88749857,2 4.175,2 L23.825,2 Z"
          stroke="#C3C3C3"
          strokeWidth="2"
          fill="#FFFFFF"
        />
        <g transform="translate(8.520000, 8.756020)" fill="#C3C3C3">
          <path
            className={styles.check}
            d="M6.71389301,4.03725727 L8.85939217,4.03725727 C9.40526918,4.03725727 9.84778993,4.47977802 9.84778993,5.02565503 C9.84778993,5.57153204 9.40526918,6.01405279 8.85939217,6.01405279 L6.71389301,6.01405279 L6.71389301,8.15955193 C6.71389301,8.885195 6.12564307,9.47344494 5.4,9.47344494 C4.67435693,9.47344494 4.08610699,8.885195 4.08610699,8.15955193 L4.08610699,6.01405279 L1.94060787,6.01405279 C1.39473119,6.01405279 0.952210074,5.57153235 0.952210074,5.02565503 C0.952210074,4.47977771 1.39473119,4.03725727 1.94060787,4.03725727 L4.08610699,4.03725727 L4.08610699,1.89175813 C4.08610699,1.16611506 4.67435693,0.577865119 5.4,0.577865119 C6.12564307,0.577865119 6.71389301,1.16611506 6.71389301,1.89175813 L6.71389301,4.03725727 Z M4.82424913,4.1244089 L5.97575087,4.1244089 L5.97575087,5.92690116 L4.82424913,5.92690116 L4.82424913,4.1244089 Z"
          />
        </g>
      </g>
    </g>
  </svg>
);

const BookmarkButton = ({ action, initialIsBookmarked, containerDetails, projectName }) => {
  const [state, setState] = React.useState({
    isBookmarked: initialIsBookmarked,
    isAnimating: false,
    isFocused: false,
    isVisible: containerDetails ? containerDetails.isHoveringOnProjectItem : true,
  });

  React.useEffect(() => {
    let updatedState = {};
    if (initialIsBookmarked !== state.isBookmarked) updatedState = { ...updatedState, isBookmarked: initialIsBookmarked };
    if (containerDetails && containerDetails.isHoveringOnProjectItem !== undefined && state.isAnimating === false) {
      updatedState = { ...updatedState, isVisible: containerDetails.isHoveringOnProjectItem };
    }
    if (Object.keys(updatedState)) {
      setState({ ...state, ...updatedState });
    }
  }, [containerDetails, initialIsBookmarked]);

  const addText = 'Add to My Stuff';
  const removeText = 'Remove from My Stuff';

  const onClick = (e) => {
    const fromKeyboard = !e.detail; // only show focus highlighting if onClick triggered from keyboard input
    if (!state.isBookmarked) {
      setState({ ...state, isFocused: fromKeyboard, isAnimating: true, isBookmarked: true });
    } else {
      setState({ ...state, isFocused: fromKeyboard, isAnimating: false, isBookmarked: false });
    }
    if (action) action();
  };
  const onFocus = () => {
    setState({ ...state, isFocused: true });
  };
  const onBlur = () => {
    setState({ ...state, isFocused: false });
  };
  const onAnimationEnd = () => {
    setState({ ...state, isAnimating: false, isVisible: containerDetails ? containerDetails.isHoveringOnProjectItem : true });
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
        <HiddenCheckbox value={state.isBookmarked} onChange={onClick} onFocus={onFocus} onBlur={onBlur}>
          <div
            className={`${styles.bookmarkButton} ${state.isFocused ? styles.focused : ''} ${state.isVisible ? styles.visible : ''}`}
            aria-label={`Add ${projectName} to My Stuff`}
          >
            <Halo isAnimating={state.isAnimating} onAnimationEnd={onAnimationEnd} />
            {state.isBookmarked ? <FilledBookmark /> : <EmptyBookmark />}
            <Image className={checkClassName} src={CHECKMARK} onAnimationEnd={onAnimationEnd} alt="" width="10px" height="10px" />
          </div>
        </HiddenCheckbox>
      }
    />
  );
};

BookmarkButton.propTypes = {
  action: PropTypes.func,
  initialIsBookmarked: PropTypes.bool,
  projectName: PropTypes.string.isRequired,
};

BookmarkButton.defaultProps = {
  action: undefined,
  initialIsBookmarked: false,
};

export default BookmarkButton;
