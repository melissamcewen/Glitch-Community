import React from 'react';
import PropTypes from 'prop-types';

import { Link as RouterLink } from 'react-router-dom';

import { getCollectionLink } from 'Models/collection';
import { getProjectLink } from 'Models/project';
import { getTeamLink } from 'Models/team';
import { getUserLink } from 'Models/user';
import { useGlobals } from 'State/globals';
import WrappingLink from './wrapping-link';
import TrackedExternalLink from './tracked-external-link';

export { WrappingLink, TrackedExternalLink };

const Link = React.forwardRef(({ to, children, ...props }, ref) => {
  const { location, EXTERNAL_ROUTES } = useGlobals();
  if (typeof to === 'string') {
    // https://github.com/ReactTraining/react-router/issues/394 inner page links using hashes are not supported in react router links
    const [, hash] = location.href.split('#');

    const targetUrl = new URL(to, location);
    if (targetUrl.origin !== location.origin || EXTERNAL_ROUTES.some((route) => targetUrl.pathname.startsWith(route)) || hash) {
      return (
        <a href={to} {...props} ref={ref}>
          {children}
        </a>
      );
    }

    to = {
      pathname: targetUrl.pathname,
      search: targetUrl.search,
      hash: targetUrl.hash,
    };
  }
  return (
    <RouterLink to={to} {...props} innerRef={ref}>
      {children}
    </RouterLink>
  );
});
Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  children: PropTypes.node.isRequired,
};

export const CollectionLink = ({ collection, children, label, ...props }) => (
  <Link to={getCollectionLink(collection)} {...props} aria-label={label || collection.name}>
    {children}
  </Link>
);
CollectionLink.propTypes = {
  collection: PropTypes.oneOfType([
    PropTypes.shape({
      fullUrl: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      team: PropTypes.PropTypes.shape({
        url: PropTypes.string.isRequired,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      user: PropTypes.PropTypes.shape({
        id: PropTypes.number.isRequired,
        login: PropTypes.string,
      }).isRequired,
      url: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  label: PropTypes.string,
};

CollectionLink.defaultProps = {
  label: null,
};

export const ProjectLink = ({ project, children, ...props }) => {
  if (project.suspendedReason) {
    return <span {...props}>{children}</span>;
  }
  return (
    <Link to={getProjectLink(project)} {...props}>
      {children}
    </Link>
  );
};
ProjectLink.propTypes = {
  project: PropTypes.shape({
    domain: PropTypes.string.isRequired,
  }).isRequired,
};

export const TeamLink = ({ team, children, ...props }) => (
  <Link to={getTeamLink(team)} {...props}>
    {children}
  </Link>
);
TeamLink.propTypes = {
  team: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export const UserLink = ({ user, children, ...props }) => (
  <Link to={getUserLink(user)} {...props}>
    {children}
  </Link>
);
UserLink.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    login: PropTypes.string,
  }).isRequired,
};

export default Link;
