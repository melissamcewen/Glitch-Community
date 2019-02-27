import React from 'react';
import PropTypes from 'prop-types';

const DefaultAvatar = ({ backgroundFillColor }) => (
  <svg width={159} height={147} viewBox="0 0 159 147">
    <g fill="none">
      <path fill="#FFFB98" d="M0 147h159V15H0z" />
      <path stroke="#979797" fill="#FFF" d="M19.5 34.5h119v93h-119z" />
      <path fill={backgroundFillColor} d="M17 132h124V30H17z" />
      <g transform="translate(0 15)">
        <mask id="prefix__a" fill="#fff">
          <use />
        </mask>
        <path
          d="M4.417 127.55h150.166V4.45H4.417v123.1zM159 136.45H0c-2.44 0-4.417-1.992-4.417-4.45V0c0-2.458 1.978-4.45 4.417-4.45h159c2.44 0 4.417 1.992 4.417 4.45v132c0 2.458-1.978 4.45-4.417 4.45z"
          fill="#222"
          mask="url(#prefix__a)"
        />
      </g>
      <g fill="#222">
        <path d="M68.395 14.06h24.482C91.717 9 86.67 5.18 80.637 5.18c-6.034 0-11.08 3.82-12.242 8.88m26.938 4.44H65.94a2.211 2.211 0 0 1-2.204-2.22c0-8.57 7.582-15.54 16.901-15.54 9.32 0 16.902 6.97 16.902 15.54 0 1.227-.986 2.22-2.205 2.22M155.9 146.684l-19.578-16.132 2.792-3.437 19.58 16.132z" />
      </g>
      <g transform="translate(17 30)">
        <mask id="prefix__b" fill="#fff">
          <use />
        </mask>
        <path
          d="M4.429 97.565H119.57V4.435H4.43v93.13zM124 106.435H0A4.431 4.431 0 0 1-4.429 102V0A4.431 4.431 0 0 1 0-4.435h124A4.431 4.431 0 0 1 128.429 0v102a4.431 4.431 0 0 1-4.429 4.435z"
          fill="#222"
          mask="url(#prefix__b)"
        />
      </g>
      <g fill="#222">
        <path d="M140.496 34L138 30.839 155.504 16 158 19.161zM17.504 34L0 19.161 2.496 16 20 30.839zM2.746 147L0 143.488 19.254 127 22 130.512z" />
      </g>
      <path
        d="M19.488 94.86c25.276 6.648 47.6 6.2 66.969-1.344 29.055-11.317 22.346-9.932 30.42-12.21 8.074-2.277 19.653-3.923 21.132-3.022.06 4.797.226 21.939.5 51.425-67.934.59-107.506.639-118.717.146.126-15.09.025-26.755-.304-34.996z"
        stroke="#222"
        fill="#05D458"
      />
      <circle stroke="#000" fill="#E8DE1B" cx={40.849} cy={59.636} r={16} />
      <path
        d="M60.335 77.57c-1.336 3.113-4.466 5.297-8.115 5.297a8.909 8.909 0 0 1-3.192-.587 6.445 6.445 0 0 1-4.251 1.587c-3.54 0-6.41-2.824-6.41-6.308 0-3.197 2.418-5.839 5.552-6.251a8.67 8.67 0 0 1 2.455-3.583 9.112 9.112 0 0 1-.475-2.912c0-4.971 3.97-9 8.866-9 3.678 0 6.832 2.273 8.175 5.512a9.457 9.457 0 0 1 2.778-.415c5.148 0 9.321 4.107 9.321 9.172 0 5.066-4.173 9.172-9.32 9.172a9.382 9.382 0 0 1-5.384-1.684zM121.554 48.933h.02c6.742 0 12.207 5.377 12.207 12.01 0 6.634-5.465 12.011-12.206 12.011a12.28 12.28 0 0 1-7.525-2.553 8.853 8.853 0 0 1-5.83 2.173c-4.864 0-8.805-3.88-8.805-8.664a8.52 8.52 0 0 1 .61-3.176 6.252 6.252 0 0 1-2.222-4.774c0-3.484 2.87-6.308 6.41-6.308.457 0 .903.047 1.333.137 1.325-3.276 4.5-5.583 8.204-5.583 3.373 0 6.306 1.912 7.804 4.727zM79.516 41.816c3.283-1.588 7.227-.307 8.864 2.906 1.658 3.255.321 7.26-2.987 8.946a6.737 6.737 0 0 1-6.885-.433 4.944 4.944 0 0 1-1.14.8c-2.396 1.22-5.312.299-6.514-2.059-1.2-2.358-.232-5.258 2.164-6.48.303-.154.614-.274.93-.361-.282-1.485.417-3.028 1.812-3.739a3.454 3.454 0 0 1 3.756.42z"
        stroke="#000"
        strokeWidth={4}
        fill="#FFF"
      />
    </g>
  </svg>
);
DefaultAvatar.propTypes = {
  backgroundFillColor: PropTypes.string,
};
DefaultAvatar.defaultProps = {
  backgroundFillColor: '#45C1F7',
};

export default DefaultAvatar;
