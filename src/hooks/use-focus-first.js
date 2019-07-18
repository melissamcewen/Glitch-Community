import React from 'react';

const useFocusFirst = () => {
  React.useEffect(() => {
    const [, hash] = window.location.href.split('#');
    if (hash) {
      const firstHeading = document.querySelectorAll(`#${hash} h1:first-of-type, #${hash} h2:first-of-type, #${hash} h3:first-of-type`)[0];
      if (firstHeading) {
        firstHeading.setAttribute('tabindex', -1);
        firstHeading.focus();
      }
    }
  }, []);
};

export default useFocusFirst;
