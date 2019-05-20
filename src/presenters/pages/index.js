import React from 'react';
import PropTypes from 'prop-types';

import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Link from 'Components/link';
import MoreIdeas from 'Components/more-ideas';
import Questions from 'Components/questions';
import { getEditorUrl } from 'Models/project';
import { AnalyticsContext } from 'State/segment-analytics';
import { useCurrentUser } from 'State/current-user';

import Layout from '../layout';
import Featured from '../featured';
import OverlayVideo from '../overlays/overlay-video';
import RecentProjects from '../recent-projects';
import ReportButton from '../pop-overs/report-abuse-pop';

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

const Callout = ({ classes, imgUrl, title, description }) => (
  <div className={`callout ${classes}`}>
    <Image className="badge" src={imgUrl} width="114" height="115" alt={title} />
    <div className="window">
      <div className="title">{title}</div>
      <div className="description">{description}</div>
    </div>
  </div>
);
Callout.propTypes = {
  classes: PropTypes.string,
  imgUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

Callout.defaultProps = {
  classes: '',
};

const WhatIsGlitch = () => {
  React.useEffect(() => {
    loadScript('//fast.wistia.com/embed/medias/i0m98yntdb.jsonp');
    loadScript('//fast.wistia.com/assets/external/E-v1.js');
  }, []);

  const witchLarge = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-large.svg?1543872118446';
  const witchSmall = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fglitch-witch-small.svg?1543872119039';

  const discover = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fexplore-illustration.svg?1543508598659';
  const remix = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fremix-illustration.svg?1543508529783';
  const collaborate = 'https://cdn.glitch.com/a67e7e84-c063-4c8e-a7fc-f4c7ab86186f%2Fcollaborate-illustration.svg?1543508686482';

  const play = 'https://cdn.glitch.com/6ce807b5-7214-49d7-aadd-f11803bc35fd%2Fplay.svg';
  const whatsGlitchAlt = "Glitch is the friendly community where you'll find the app of your dreams";

  return (
    <section className="what-is-glitch">
      <span>
        <figure>
          <Heading tagName="h1">
            <Image src={witchSmall} srcSet={[`${witchLarge} 1000w`]} alt={whatsGlitchAlt} width="100%" />
          </Heading>

          <OverlayVideo>
            <div className="button video">
              <Image src={play} className="play-button" alt="How it works" width="" height="" />
              <span>How it works</span>
            </div>
          </OverlayVideo>
        </figure>

        <div className="callouts">
          <Callout
            classes="discover"
            imgUrl={discover}
            title="Explore Apps"
            description="Discover over a million free apps built by people like you"
          />
          <Callout classes="remix" imgUrl={remix} title="Remix Anything" description="Edit any project and have your own app running instantly" />
          <Callout classes="collaborate" imgUrl={collaborate} title="Build with Your Team" description="Invite everyone to create together" />{' '}
        </div>
      </span>
    </section>
  );
};

const MadeInGlitch = () => (
  <section className="made-in-glitch">
    <Text>Of course, this site was made on Glitch too</Text>
    <Link to={getEditorUrl('community')} className="button button-link has-emoji">
      View Source <span className="emoji carp_streamer" />
    </Link>
  </section>
);

const IndexPage = () => {
  const { currentUser } = useCurrentUser();
  return (
    <Layout>
      <AnalyticsContext properties={{ origin: 'index' }}>
        <main>
          {!currentUser.login && <WhatIsGlitch />}
          {!!currentUser.projects.length && <RecentProjects />}
          {!!currentUser.login && <Questions />}
          <Featured isAuthorized={!!currentUser.login} />
          <MoreIdeas />
          <MadeInGlitch />
          <ReportButton reportedType="home" />
        </main>
      </AnalyticsContext>
    </Layout>
  );
};

export default IndexPage;
