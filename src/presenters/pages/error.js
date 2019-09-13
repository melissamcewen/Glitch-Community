import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Button } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import Text from 'Components/text/text';
import Heading from 'Components/text/heading';
import Layout from 'Components/layout';
import { useGlobals } from 'State/globals';
import { Aquarium } from 'Components/errors/not-found';

import styles from './error.styl';

const ErrorMessage = ({ title, description }) => (
  <div className={styles.errorMessage}>
    <Heading tagName="h1">{title}</Heading>
    <Text>{description}</Text>
    <Button as="a" href="/">Back to Glitch</Button>
  </div>
);

export const NotFoundPage = () => {
  const { location } = useGlobals();
  // we show a translated error message and redirect in index.ejs (this just ensures we don't show duplicate messages)
  if (location.origin === 'https://translate.googleusercontent.com') return null;

  return (
    <Layout>
      <Helmet title="👻 Page not found" />
      <main className={styles.container} id="main">
        <Aquarium className={styles.aquarium} />
        <ErrorMessage title="Page Not Found" description="Maybe a typo, or perhaps it's moved?" />
      </main>
    </Layout>
  );
};

const emailImageUrl = 'https://cdn.glitch.com/26ac422d-705d-42be-b9cb-1fbdfe7e5a63%2Ferror-mailer.svg?1543429767321';

export const EmailErrorPage = ({ title, description }) => (
  <Layout>
    <Helmet title={`✉️ ${title}`} />
    <main className={styles.container} id="main">
      <Image className={styles.emailErrorImage} src={emailImageUrl} alt="" width="470px" />
      <ErrorMessage title={title} description={description} />
    </main>
  </Layout>
);

EmailErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const oauthImageUrl = 'https://cdn.glitch.com/8ae9b195-ef39-406b-aee0-764888d15665%2Foauth-key.svg?1544466885907';

export const OauthErrorPage = ({ title, description }) => (
  <Layout>
    <Helmet title={`🔑 ${title}`} />
    <main className={styles.container} id="main">
      <Image className={styles.errorImage} src={oauthImageUrl} alt="" width="370px" />
      <ErrorMessage title={title} description={description} />
    </main>
  </Layout>
);

OauthErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
