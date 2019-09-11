import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { CDN_URL } from 'Utils/constants';
import Helmet from 'react-helmet';
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
        <Mark color={blueMark}><small>1.</small> A simple tool for creating web apps</Mark>
      </Heading>
      <p className={styles.useCases}>We’re evolving “developer tools” into a creative and expressive platform that everyone can use to create the web.</p>
    </section>
  );
}

const AboutPage = withRouter(() => (
  <div className={styles.content}>
    <Helmet title="About Glitch" />
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
