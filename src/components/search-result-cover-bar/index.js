import React from 'react';
import PropTypes from 'prop-types';
import Image from 'Components/images/image';
import { getCoverUrl as getTeamCoverUrl } from 'Models/team';
import { getCoverUrl as getUserCoverUrl, lightColors } from 'Models/user';
import { hexToRgbA } from '../../presenters/includes/collection-avatar';
import styles from './search-result-cover-bar.styl';

const cacheBuster = Math.floor(Math.random() * 1000);

const defaultCoverURL = 'https://cdn.glitch.com/55f8497b-3334-43ca-851e-6c9780082244%2Fdefault-cover-wide.svg?1503518400625';

const coverUrlForType = {
  team: getTeamCoverUrl,
  user: getUserCoverUrl,
};

const SearchResultCoverBar = ({ type, item, size, cache = cacheBuster }) => {
  const getCoverUrl = coverUrlForType[type];
  const coverBackground = hexToRgbA(lightColors[item.id % 4]);

  return (
    <div className={styles.cover} style={{ backgroundColor: coverBackground }}>
      <Image src={getCoverUrl({ ...item, size, cache })} defaultSrc={defaultCoverURL} alt="" />
    </div>
  );
};

SearchResultCoverBar.propTypes = {
  type: PropTypes.oneOf(['user', 'team']).isRequired,
  size: PropTypes.oneOf(['medium', 'large']).isRequired,
};

export default SearchResultCoverBar;
