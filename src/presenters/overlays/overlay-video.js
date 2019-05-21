import React from 'react';
import PropTypes from 'prop-types';

import { Overlay, OverlaySection } from 'Components/overlays';
import { useTracker } from 'State/segment-analytics';

import PopoverContainer from '../pop-overs/popover-container';

const loadedScripts = new Set();
function loadScript(src) {
  if (!loadedScripts.has(src)) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
    loadedScripts.add(src);
  }
}

const Video = () => (
  <div className="wistia_responsive_padding">
    <div className="wistia_responsive_wrapper">
      <div className="wistia_embed wistia_async_i0m98yntdb" videofoam="true" />
    </div>
  </div>
);

const OverlayVideo = ({ children }) => {
  React.useEffect(() => {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }, []);
  const track = useTracker('How it works clicked');
  return (
    <PopoverContainer>
      {({ visible, setVisible }) => {
        const onToggle = (evt) => {
          setVisible(evt.target.open);
          if (evt.target.open) {
            track();
          }
        };
        return (
          <details onToggle={onToggle} open={visible} className="overlay-container">
            <summary>{children}</summary>
            <Overlay className="video-overlay">
              <OverlaySection type="actions">
                <Video />
              </OverlaySection>
            </Overlay>
          </details>
        );
      }}
    </PopoverContainer>
  );
};
OverlayVideo.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OverlayVideo;
