import React from 'react';
import PropTypes from 'prop-types';

import Link from 'Components/link';
import Markdown from 'Components/text/markdown';
import Text from 'Components/text/text';

import styles from './new-stuff-article.styl';

const NewStuffArticle = ({ title, body, link }) => (
  <article className={styles.article}>
    <h2 className={styles.title}>{title}</h2>
    <div className={styles.body}>
      <Markdown>{body}</Markdown>
    </div>
    {!link && (
      <Text defaultMargin>
        <Link to={link}>
          Read the blog post →
        </Link>
      </Text>
    )}
  </article>
);

NewStuffArticle.propTypes = {
  title: PropTypes.node.isRequired,
  body: PropTypes.string.isRequired,
  link: PropTypes.string,
};

NewStuffArticle.defaultProps = {
  link: null,
};

export default NewStuffArticle;
