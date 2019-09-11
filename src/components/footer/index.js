import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from '@fogcreek/shared-components';

import Image from 'Components/images/image';
import Link from 'Components/link';

import styles from './footer.styl';
import { emoji } from '../global.styl';

const FooterLink = ({ className, href, track, children }) => (
  <div className={classnames(styles.footerLinkWrap, className)}>
    <Link className={styles.footerLink} to={href} data-track={`footer → ${track}`}>
      {children}
    </Link>
  </div>
);

const PlatformsIcon = () => (
  <Image
    className={styles.platformsIcon}
    src="https://cdn.glitch.com/be1ad2d2-68ab-404a-82f4-6d8e98d28d93%2Ffor-platforms-icon.svg?1506442305188"
    alt=""
  />
);

const Footer = ({ containerClass }) => (
  <footer className={classnames(styles.container, containerClass)} role="contentinfo">
    <FooterLink href="/about" track="about">
      About Glitch
      <Icon className={emoji} icon="crystalBall" />
    </FooterLink>
    <FooterLink href="/culture" track="blog">
      Blog
      <Icon className={emoji} icon="newspaper" />
    </FooterLink>
    <FooterLink href="/help/" track="faq">
      Help Center
      <Icon className={emoji} icon="umbrella" />
    </FooterLink>
    <FooterLink href="http://status.glitch.com/" track="system status">
      System Status
      <Icon className={emoji} icon="horizontalTrafficLight" />
    </FooterLink>
    <FooterLink href="/legal" track="legal stuff">
      Legal Stuff
      <Icon className={emoji} icon="scales" />
    </FooterLink>
    <FooterLink className={styles.teams} href="/teams" track="platforms">
      <PlatformsIcon />
      Glitch Teams
    </FooterLink>
  </footer>
);

Footer.propTypes = {
  containerClass: PropTypes.string,
};

Footer.defaultProps = {
  containerClass: '',
};

export default Footer;
