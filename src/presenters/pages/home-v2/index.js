import React, { useState } from 'react';
import classnames from 'classnames';
import Pluralize from 'react-pluralize';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Mark } from '@fogcreek/shared-components';

import Row from 'Components/containers/row';
import ProfileList from 'Components/profile-list';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';
import Markdown from 'Components/text/markdown';
import Questions from 'Components/questions';
import RecentProjects from 'Components/recent-projects';
import ReportButton from 'Components/report-abuse-pop';
import Layout from 'Components/layout';
import Link from 'Components/link';
import PreviewContainer from 'Components/containers/preview-container';
import Arrow from 'Components/arrow';
import VisibilityContainer from 'Components/visibility-container';
import LazyLoader from 'Components/lazy-loader';
import { useCurrentUser } from 'State/current-user';
import { getProjectAvatarUrl } from 'Models/project';
import { useAPI } from 'State/api';
import { useGlobals } from 'State/globals';
import MadeOnGlitch from 'Components/footer/made-on-glitch';
import Banner from './banner';
import CuratedCollectionContainer from './collection-container';
import { Discover, Dreams, Teams } from './feature-callouts';
import styles from './styles.styl';

const calloutGraphics = {
  apps: {
    component: Discover,
    color: 'yellow',
  },
  create: {
    component: Dreams,
    color: 'pink',
  },
  teams: {
    component: Teams,
    color: 'aquamarine',
  },
};

const HomeSection = ({ className = '', ...props }) => (
  <section className={classnames(styles.homeSection, className)} {...props} />
);

const FeatureCallouts = ({ content }) => (
  <HomeSection id="feature-callouts" className={styles.featureCalloutsContainer}>
    <Row items={content} className={styles.featureCalloutsRow} minWidth="175px">
      {({ label, description, backgroundSrc, href, id }) => (
        <>
          <Link to={href} className={classnames(styles.plainLink, styles.featureCalloutsHeader)}>
            <div className={styles.featureCalloutsImage} style={{ backgroundImage: `url('${backgroundSrc}')` }}>
              {React.createElement(calloutGraphics[id].component)}
            </div>
            <h2 className={styles.featureCalloutsTitle}>
              <Mark color={calloutGraphics[id].color}>{label}</Mark>
            </h2>
          </Link>
          <p>{description}</p>
        </>
      )}
    </Row>
  </HomeSection>
);

const TopPicks = ({ children }) => (
  <HomeSection id="top-picks">
    <h2 className={styles.h2}>
      <Mark color="#BCFCFF">Fresh apps</Mark>
    </h2>
    <p className={styles.subtitle}>The latest and greatest projects on Glitch, built by our community of creators.</p>
    {children}
  </HomeSection>
);

const AppsWeLove = ({ content }) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <HomeSection id="apps-we-love" className={styles.appsWeLoveContainer}>
      <div className={styles.appsWeLoveSmallLayout}>
        {content.map(({ id, title, description, domain }) => (
          <Link key={id} to={`/~${domain}`} className={classnames(styles.plainLink, styles.appItemMini)}>
            <img src={getProjectAvatarUrl({ id })} alt="" className={styles.appAvatar} />
            <div className={styles.appContent}>
              <h4 className={styles.h4}>{title}</h4>
              <p>{description}</p>
            </div>
          </Link>
        ))}
      </div>

      <Tabs forceRenderTabPanel selectedIndex={currentTab} onSelect={(index) => setCurrentTab(index)} className={styles.appsWeLoveBigLayout}>
        <TabList className={styles.appsWeLoveList}>
          {content.map(({ id, domain, title, description, users }, i) => (
            <Tab key={domain} className={styles.appsWeLoveListItem}>
              <div className={styles.appsWeLoveProfileWrap}>
                <div className={styles.appsWeLoveProfile}>
                  <ProfileList layout="row" users={users} />
                </div>
              </div>
              <div className={classnames(styles.appItem, i === currentTab && styles.active)}>
                <div className={styles.appContent}>
                  <h4 className={styles.h4}>{title}</h4>
                  <p>{description}</p>
                </div>
                <img src={getProjectAvatarUrl({ id })} alt="" className={styles.appAvatar} />
              </div>
            </Tab>
          ))}
        </TabList>
        {content.map(({ domain }, i) => (
          <TabPanel key={domain} className={styles.appsWeLoveEmbed} hidden={currentTab !== i}>
            <Embed domain={domain} />
          </TabPanel>
        ))}
      </Tabs>
    </HomeSection>
  );
};

const collectionStyles = ['wavey', 'diagonal', 'triangle'];

const CuratedCollections = ({ content }) => (
  <HomeSection id="curated-collections" className={styles.curatedCollectionsContainer}>
    <h3 className={styles.h3}>Curated collections</h3>
    <Row items={content.map((data) => ({ ...data, id: data.fullUrl }))} className={styles.curatedCollectionRow}>
      {({ title, description, fullUrl, users, count }, i) => (
        <CuratedCollectionContainer collectionStyle={collectionStyles[i]} users={users} href={`/@${fullUrl}`}>
          <h4 className={styles.h4}>{title}</h4>
          <p>{description}</p>
          <div className={styles.curatedCollectionButtonWrap}>
            <Button as="span">
              View <Pluralize count={count} singular="Project" /> <Arrow />
            </Button>
          </div>
        </CuratedCollectionContainer>
      )}
    </Row>
  </HomeSection>
);

const UnifiedStories = ({ content: { hed, dek, featuredImage, featuredImageDescription, summary, href, cta, relatedContent } }) => (
  <HomeSection id="unified-stories" className={styles.unifiedStories}>
    <div className={styles.unifiedStoriesContainer}>
      <div className={styles.unifiedStoriesHeadline}>
        <div className={styles.unifiedStoriesContentWrap}>
          {hed
            .trim()
            .split('\n')
            .map((line, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <h2 key={i}>
                <Mark color="white">{line}</Mark>
              </h2>
            ))}
          <img src={featuredImage} alt={featuredImageDescription} />
        </div>
      </div>
      <div className={styles.unifiedStoriesPreview}>
        <div className={styles.unifiedStoriesContentWrap}>
          <h3 className={styles.h3}>{dek}</h3>
          <Markdown>{summary}</Markdown>
          <Button as="a" href={href}>
            {cta} <Arrow />
          </Button>
        </div>
      </div>
      <div className={styles.unifiedStoriesRelatedContent}>
        <div className={styles.unifiedStoriesContentWrap}>
          <h3>Related</h3>
          <ul>
            {relatedContent.filter((related) => !!related.href).map((related) => (
              <li key={related.href}>
                <Link to={related.href} className={styles.plainLink}>
                  <h4>{related.title}</h4>
                  <p>{related.source}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </HomeSection>
);

const CultureZine = ({ content }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) => (
      <HomeSection id="culture-zine" className={styles.cultureZine}>
        <div className={styles.cultureZineContainer}>
          <h2 className={styles.h2}>
            <Mark color="#CBC3FF">Where tech meets culture</Mark>
          </h2>
          <p className={styles.subtitle}>Code is shaping the world around us. We’ll help you understand where it’s going.</p>

          <LazyLoader delay={wasEverVisible ? 0 : 3000}>
            <>
              <Row count={2} items={[{ id: 0, content: content.slice(0, 2) }, { id: 1, content: content.slice(2, 4) }]}>
                {({ content: cultureZineItems }) => (
                  <Row items={cultureZineItems} count={2} className={styles.cultureZineRow}>
                    {({ title, primary_tag: source, feature_image: img, url }) => (
                      <Link to={`/culture${url}`} className={styles.plainLink}>
                        <div className={styles.cultureZineImageWrap}>
                          <MaskImage src={img} />
                        </div>
                        <div className={styles.cultureZineText}>
                          <h4 className={styles.h4}>{title}</h4>
                          {source && <p>{source.name}</p>}
                        </div>
                      </Link>
                    )}
                  </Row>
                )}
              </Row>
              <div className={styles.readMoreLink}>
                <Button as="a" href="https://glitch.com/culture/">
                  Read More on Culture <Arrow />
                </Button>
              </div>
            </>
          </LazyLoader>
        </div>
      </HomeSection>
    )}
  </VisibilityContainer>
);

const buildingGraphics = [
  'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fdevelopers.svg?v=1562169495767',
  'https://cdn.glitch.com/616994fe-f0e3-4501-89a7-295079b3cb8c%2Fteams.svg?v=1562169496523',
];

const BuildingOnGlitch = ({ content }) => (
  <HomeSection id="building-on-glitch" className={styles.buildingOnGlitch}>
    <h2 className={styles.h2}>
      <Mark color="#FCF3B0">Start building on Glitch</Mark>
    </h2>
    <div className={styles.buildingOnGlitchRow}>
      {content.map(({ href, title, description, cta }, index) => (
        <Link key={href} to={href} className={styles.plainLink}>
          <div className={styles.startBuildingImageWrap}>
            <img src={buildingGraphics[index]} alt="" />
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
          <Button as="span">
            {cta} <Arrow />
          </Button>
        </Link>
      ))}
    </div>
  </HomeSection>
);

const MadeInGlitch = () => (
  <HomeSection className={styles.madeInGlitch}>
    <MadeOnGlitch />
  </HomeSection>
);

// loggedIn and hasProjects are passed as props instead of pulled from context
// because we want the preview to show what an anonymous user would see
export const Home = ({ data, loggedIn, hasProjects }) => (
  <main id="main" className={styles.homeContainer}>
    {!loggedIn && <Banner />}
    {!loggedIn && <FeatureCallouts content={data.featureCallouts} />}
    {hasProjects && <RecentProjects />}
    {loggedIn && <Questions />}
    <UnifiedStories content={data.unifiedStories} />
    <TopPicks>
      <AppsWeLove content={data.appsWeLove} />
      <CuratedCollections content={data.curatedCollections} />
    </TopPicks>
    <CultureZine content={data.cultureZine} />
    <BuildingOnGlitch content={data.buildingOnGlitch} />
    <MadeInGlitch />
    <ReportButton reportedType="home" />
  </main>
);

export const HomePreview = () => {
  const api = useAPI();
  const { origin, ZINE_POSTS } = useGlobals();
  const onPublish = async (data) => {
    try {
      await api.post(`${origin}/api/home`, data);
      // need to do a hard reload for this to take effect
      window.location = '/';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Layout>
      <PreviewContainer
        get={() => api.get('https://community-home-editor.glitch.me/home.json').then((res) => res.data)}
        onPublish={onPublish}
        previewMessage={
          <>
            This is a live preview of edits done with <Link to="/index/edit">Community Home Editor.</Link>
          </>
        }
      >
        {(data) => <Home data={{ ...data, cultureZine: ZINE_POSTS.slice(0, 4) }} />}
      </PreviewContainer>
    </Layout>
  );
};

const HomeWithProductionData = () => {
  const { currentUser } = useCurrentUser();
  const { HOME_CONTENT, ZINE_POSTS, SSR_SIGNED_IN } = useGlobals();
  return (
    <Layout>
      <Home
        data={{ ...HOME_CONTENT, cultureZine: ZINE_POSTS.slice(0, 4) }}
        loggedIn={!!currentUser.login || (!currentUser.id && SSR_SIGNED_IN)}
        hasProjects={currentUser.projects.length > 0}
      />
    </Layout>
  );
};
export default HomeWithProductionData;
