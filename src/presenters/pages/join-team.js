import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { captureException } from 'Utils/sentry';

import { getLink } from 'Models/team';
import { useAPI } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';

class JoinTeamPageBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
    };
  }

  async componentDidMount() {
    try {
      // Suppress the authorization header to prevent user merging
      const { data: user } = await this.props.api.post(`/teams/join/${this.props.joinToken}`);
      if (user) {
        this.props.replaceCurrentUser(user);
      }
      this.props.createNotification('Invitation accepted');
    } catch (error) {
      // The team is real but the token didn't work
      // Maybe it's been used already or expired?
      console.log('Team invite error', error && error.response && error.response.data);
      if (error && error.response.status !== 401) {
        captureException(error);
      }
      this.props.createErrorNotification('Invite failed, try asking your teammate to resend the invite');
    }
    this.setState({ redirect: getLink({ url: this.props.teamUrl }) });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return null;
  }
}
JoinTeamPageBase.propTypes = {
  api: PropTypes.any.isRequired,
  teamUrl: PropTypes.string.isRequired,
  joinToken: PropTypes.string.isRequired,
  createErrorNotification: PropTypes.func.isRequired,
  createNotification: PropTypes.func.isRequired,
  replaceCurrentUser: PropTypes.func.isRequired,
};

const JoinTeamPage = (props) => {
  const api = useAPI();
  const { login } = useCurrentUser();
  const notify = useNotifications();
  return <JoinTeamPageBase replaceCurrentUser={login} api={api} {...notify} {...props} />;
};

export default JoinTeamPage;
