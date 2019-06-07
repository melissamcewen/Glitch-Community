import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';
import Link from 'Components/link';

const FeaturedEmbed = ({ image, mask, title, appDomain, blogUrl, body, color }) => (
  <div className="featured-embed">
    <div className="mask-container">
      <Link to={`culture${blogUrl}`}>
        <MaskImage maskClass={mask} src={image} />
      </Link>
    </div>

    <div className="content" style={{ backgroundColor: color }}>
      <div className="description">
        <Link to={`culture${blogUrl}`}>
          <Heading tagName="h2">{title}</Heading>
        </Link>
        {/* eslint-disable-next-line react/no-danger */}
        <p dangerouslySetInnerHTML={{ __html: body }} />
        <Link to={`culture${blogUrl}`} className="learn-more">
          <Button size='small'>Learn More →</Button>
        </Link>
      </div>
      <div className="glitch-embed-wrap">
        <Embed domain={appDomain} />
      </div>
    </div>
  </div>
);

FeaturedEmbed.propTypes = {
  image: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  appDomain: PropTypes.string.isRequired,
  blogUrl: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default FeaturedEmbed;
