import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import Embed from 'Components/project/embed';
import MaskImage from 'Components/images/mask-image';
import Link, { WrappingLink } from 'Components/link';
import Button from 'Components/buttons/button';

const FeaturedEmbed = ({ image, mask, title, appDomain, blogUrl, body, color }) => (
  <div className="featured-embed">
    <div className="mask-container">
      <WrappingLink href={`culture${blogUrl}`}>
        <MaskImage maskClass={mask} src={image} />
      </WrappingLink>
    </div>

    <div className="content" style={{ backgroundColor: color }}>
      <Link to={`culture${blogUrl}`}>
        <div className="description">
          <Heading tagName="h2">{title}</Heading>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: body }} />
          <div className="button-wrap">
            <Button decorative size="small">
              Learn More <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </Link>
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
