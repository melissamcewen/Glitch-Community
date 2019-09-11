import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { CDN_URL } from 'Utils/constants';
import { Helmet } from 'react-helmet-async';
import ReactKonami from 'react-konami';
import Heading from 'Components/text/heading';
import Text from 'Components/text/text';
import Image from 'Components/images/image';
import { Button, Icon, Loader, Mark } from '@fogcreek/shared-components';
import Link from 'Components/link';
import Logo from 'Components/header/logo';
import Footer from 'Components/footer';
import ErrorBoundary from 'Components/error-boundary';
import styles from './about.styl';

const blueMark = '#aad6fb';

const HeaderLinks = () => (
  <nav className={styles.headerActions}>
    <a href="/about">About</a>
    <a href="/about/company">Company</a>
    <a href="/about/careers">Careers</a>
    <a href="/about/press">Press</a>
    <a href="/about/events">Events</a>
  </nav>
);

const Unmarked = ({ children }) => <span className={styles.unmarked}>{children}</span>;

function Banner() {
  const illustration = `${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fabout.svg?v=1562163931412`;
  const shape = `${CDN_URL}/d2b595e6-45a6-4ddc-8110-038cdb509b16%2Fabout-glitch-shape.svg?v=1560521674329`;
  return (
    <section className={classNames(styles.section, styles.banner)}>
      <div className={styles.bannerShape} style={{ backgroundImage: `url(${shape})` }}>
        <div className={styles.bannerText}>
          <Heading className={styles.bannerTagline} tagName="h1" ariaLabel="What's Glitch?">
            <Unmarked>What's</Unmarked>
            <br />
            <Mark color="#aad6fb">Glitch?</Mark>
          </Heading>
          <Text>Presto, the web is creative again.</Text>
          <Text>Glitch is three things:</Text>
        </div>
      </div>

      <div className={styles.bannerIllustration}>
        <Image src={illustration} alt="" />
      </div>
    </section>
  );
}

function FirstSection() {
  return (
    <section>
      <Heading className={styles.h2} tagName="h2">
        <Mark color={blueMark}>
          <small>1.</small> A simple tool for creating web apps
        </Mark>
      </Heading>
      <p className={styles.useCases}>
        We’re evolving “developer tools” into a creative and expressive platform that everyone can use to create the web.
      </p>
      <div className={styles.sideBySide}>
        <div className={classNames(styles.half, styles.left)}>
          <video autoPlay muted loop playsinline>
            <source type="video/webm" src="https://cdn.glitch.com/d5cdac21-5e23-4601-8243-d5645f80aa71%2Fcollab.webm?1538421865695" />
            <source type="video/mp4" src="https://cdn.glitch.com/d5cdac21-5e23-4601-8243-d5645f80aa71%2Fcollab.mp4?1538421865892" />
          </video>
          <Heading tagName="h3" className={styles.videoHeading}>
            <Mark color={blueMark}>Create and collaborate on code</Mark>
          </Heading>
          <p>
            Coding on Glitch is like working together in Google Docs–multiple people can work on the same project at the same time. There’s no setup,
            and you can see changes live on the web as you type.
          </p>
        </div>
        <div className={styles.half}>
          <video autoPlay muted loop playsinline>
            <source type="video/webm" src="https://cdn.glitch.com/d5cdac21-5e23-4601-8243-d5645f80aa71%2Fprivate.webm?1538419456676" />
            <source type="video/mp4" src="https://cdn.glitch.com/d5cdac21-5e23-4601-8243-d5645f80aa71%2Fprivate.mp4?1538419456584" />
          </video>
          <Heading tagName="h3" className={styles.videoHeading}>
            <Mark color={blueMark}>For people and teams of all skill levels</Mark>
          </Heading>
          <p>
            For people and teams of all skill levels Glitch makes it easy and fun to express yourself with code, whether you’re a professional
            developer or just starting out. You can create on your own or as part of a team.
          </p>
        </div>
      </div>
    </section>
  );
}

const AboutPage = withRouter(() => (
  <div className={styles.content}>
    <Helmet title="About Glitch">
      <body data-grey="true" />
    </Helmet>
    <Button as="a" href="#main" className={styles.visibleOnFocus}>
      Skip to Main Content
    </Button>
    <header role="banner" className={styles.header}>
      <Link to="/" className={styles.logoWrap}>
        <Logo />
      </Link>
      <HeaderLinks />
    </header>
    <main id="main" className={styles.main}>
      <Banner />
      <FirstSection />
    </main>

    <Footer />
    <ErrorBoundary fallback={null}>
      <ReactKonami easterEgg={() => history.push('/secret')} />
    </ErrorBoundary>
  </div>
));

export default AboutPage;
