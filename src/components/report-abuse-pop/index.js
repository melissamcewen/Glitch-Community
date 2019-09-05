import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { parseOneAddress } from 'email-addresses';
import { debounce, trimStart } from 'lodash';
import axios from 'axios';
import { Loader, TextArea, TextInput } from '@fogcreek/shared-components';

import Notification from 'Components/notification';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import { PopoverWithButton, PopoverDialog, PopoverInfo, PopoverActions, PopoverTitle, InfoDescription } from 'Components/popover';
import { useCurrentUser } from 'State/current-user';
import { captureException } from 'Utils/sentry';
import { getAbuseReportTitle, getAbuseReportBody } from 'Utils/abuse-reporting';

import styles from './styles.styl';

function getDefaultReason(reportedType) {
  if (reportedType === 'user') {
    return "This user profile doesn't seem appropriate for Glitch because...";
  }
  if (reportedType === 'home') {
    return "[Something here] doesn't seem appropriate for Glitch because...";
  }
  return `This ${reportedType} doesn't seem appropriate for Glitch because...`;
}

function validateReason(reason, reportedType) {
  if (!reason) return 'A description of the issue is required';
  if (reason === getDefaultReason(reportedType)) return 'Reason is required';
  return '';
}

function validateEmail(email, currentUser) {
  if (currentUser.login) return '';
  if (!email) return 'Email is required';
  if (!parseOneAddress(email)) return 'Please enter a valid email';
  return '';
}

function useDebouncedState(initialState, timeout) {
  const [state, setState] = useState(initialState);
  const setDebounced = useMemo(() => debounce(setState, timeout));
  return [state, setDebounced];
}

const Success = () => (
  <>
    <PopoverTitle>Report Abuse</PopoverTitle>
    <PopoverActions>
      <Notification persistent type="success">Report Sent</Notification>
      <InfoDescription>
        Thanks for helping to keep Glitch a safe, friendly community <Emoji name="park" />
      </InfoDescription>
    </PopoverActions>
  </>
);

const Failure = ({ value }) => (
  <>
    <PopoverTitle>
      Failed to Send <Emoji name="sick" />
    </PopoverTitle>
    <PopoverInfo>
      <InfoDescription>
        But you can still send us your message by emailing the details below to <strong>support@glitch.com</strong>
      </InfoDescription>
    </PopoverInfo>
    <PopoverActions>
      <textarea className={styles.manualReport} value={value} readOnly />
    </PopoverActions>
  </>
);

function ReportAbusePop({ reportedType, reportedModel }) {
  const { currentUser } = useCurrentUser();
  const [status, setStatus] = useState('ready'); // ready -> loading -> success | error

  const [reason, setReason] = useState(getDefaultReason(reportedType));
  const [reasonError, setReasonError] = useDebouncedState('', 200);
  const reasonOnChange = (value) => {
    setReason(value);
    setReasonError(validateReason(value, reportedType));
  };

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useDebouncedState('', 200);
  const emailOnChange = (value) => {
    setEmail(value);
    setEmailError(validateEmail(value, currentUser));
  };

  const formatRaw = () => getAbuseReportBody(currentUser, email, reportedType, reportedModel, reason);

  const submitReport = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email, currentUser);
    const reasonErr = validateReason(reason, reportedType);
    if (emailErr || reasonErr) {
      setEmailError(emailErr);
      setReasonError(reasonErr);
      return;
    }

    setStatus('loading');
    try {
      await axios.post('https://support-poster.glitch.me/post', {
        raw: formatRaw(),
        title: getAbuseReportTitle(reportedModel, reportedType),
      });

      setStatus('success');
    } catch (error) {
      captureException(error);
      setStatus('error');
    }
  };

  if (status === 'success') return <Success />;
  if (status === 'error') return <Failure value={trimStart(formatRaw())} />;

  return (
    <form onSubmit={submitReport}>
      <PopoverTitle>Report Abuse</PopoverTitle>
      <PopoverActions>
        <TextArea
          label="Report Abuse"
          className={styles.textArea}
          value={reason}
          onChange={reasonOnChange}
          onBlur={() => reasonOnChange(reason)}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          error={reasonError}
        />
      </PopoverActions>
      {currentUser.login ? (
        <PopoverInfo type="secondary">
          <div className={styles.right}>
            <InfoDescription>
              from <strong>{currentUser.login}</strong>
            </InfoDescription>
          </div>
        </PopoverInfo>
      ) : (
        <PopoverInfo>
          <TextInput
            value={email}
            onChange={emailOnChange}
            onBlur={() => emailOnChange(email)}
            placeholder="your@email.com"
            error={emailError}
            type="email"
            label="email address"
          />
        </PopoverInfo>
      )}
      <PopoverActions>
        {status === 'loading' ? (
          <Loader style={{ width: '25px' }} />
        ) : (
          <Button size="small" onClick={submitReport}>
            Submit Report
          </Button>
        )}
      </PopoverActions>
    </form>
  );
}

const ReportAbusePopButton = ({ reportedType, reportedModel }) => (
  <PopoverWithButton buttonProps={{ size: 'small', type: 'tertiary' }} buttonText="Report Abuse">
    {() => (
      <PopoverDialog align="topLeft" wide>
        <ReportAbusePop reportedType={reportedType} reportedModel={reportedModel} />
      </PopoverDialog>
    )}
  </PopoverWithButton>
);

ReportAbusePopButton.propTypes = {
  reportedType: PropTypes.oneOf(['project', 'collection', 'user', 'team', 'home']).isRequired,
  reportedModel: PropTypes.object, // the actual model, or null if no model (like for the home page)
};

ReportAbusePopButton.defaultProps = {
  reportedModel: null,
};

export default ReportAbusePopButton;
