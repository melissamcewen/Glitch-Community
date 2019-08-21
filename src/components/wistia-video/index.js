import React, { useEffect } from 'react';

const WistiaVideo = React.forwardRef(({ videoId }, ref) => {
  useEffect(() => {
    const loadedScripts = new Set();
    const scriptTags = document.querySelectorAll('script');
    scriptTags.forEach((node) => {
      if (node.src) {
        // strip protocol so we can match //fast.wistia.com...
        loadedScripts.add(node.src.split(location.protocol)[1]);
      }
    });

    function loadScript(src) {
      if (!loadedScripts.has(src)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
        loadedScripts.add(src);
      }
    }

    // the server sends these script tags on pages that have wistia videos
    // you can navigate to a page with a wistia video via an in-page link,
    // so we need to check that the script tags are on this page, and load them if not
    loadScript(`//fast.wistia.com/embed/medias/${videoId}.jsonp`);
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }, []);

  return (
    <div className="wistia_responsive_padding">
      <div className="wistia_responsive_wrapper">
        <div ref={ref} className={`wistia_embed wistia_async_${videoId}`} videofoam="true" />
      </div>
    </div>
  );
});

export default WistiaVideo;
