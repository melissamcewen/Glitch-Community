import React from 'react';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';

import PreviewContainer from 'Components/containers/preview-container';
import Link from 'Components/link';

import { useAPI } from 'State/api';
import { useGlobals } from 'State/globals';

import { NewStuffOverlay } from 'Components/new-stuff';

const PupdatesPreview = withRouter(({ history }) => {
  const api = useAPI();
  const { origin } = useGlobals();
  const onPublish = async (data) => {
    try {
      await api.post(`${origin}/api/pupdate`, data);
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main>
      <Helmet title="Glitch Pupdates Previewer" />
      <PreviewContainer
        get={() => api.get('https://pupdates-editor.glitch.me/pupdate.json').then((res) => res.data)}
        onPublish={onPublish}
        previewMessage={
          <>
            This is a live preview of edits done with the <Link to="https://pupdates-editor.glitch.me">Pupdates Editor.</Link>
            <br />If you aren't logged in, <Link to="/">Go Home</Link> and then come back here to publish!
          </>
        }
      >
        {(data) => <NewStuffOverlay showNewStuff setShowNewStuff={() => {}} newStuff={data.pupdates} closePopover={() => {}} />}
      </PreviewContainer>
    </main>
  );
});
export default PupdatesPreview;