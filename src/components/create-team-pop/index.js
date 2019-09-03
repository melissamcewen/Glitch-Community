import React, { useState, useEffect } from 'react';
import { kebabCase, debounce } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Loader } from '@fogcreek/shared-components';


import TextInput from 'Components/inputs/text-input';
import { MultiPopoverTitle, PopoverDialog, PopoverInfo, PopoverActions, InfoDescription } from 'Components/popover';
import Button from 'Components/buttons/button';
import Emoji from 'Components/images/emoji';
import { getPredicates, getTeamPair } from 'Models/words';
import { getTeamLink } from 'Models/team';
import { useAPI } from 'State/api';
import { useTracker } from 'State/segment-analytics';

import styles from './styles.styl';

// Create Team 🌿

const CreateTeamPop = withRouter(({ history }) => {
  const api = useAPI();
  const trackSubmit = useTracker('Create Team submitted');
  const [state, replaceState] = useState({
    teamName: '',
    isLoading: false,
    error: '',
  });
  const setState = (valOrFn) => {
    if (typeof valOrFn === 'function') {
      replaceState((prevState) => ({ ...prevState, ...valOrFn(prevState) }));
    } else {
      replaceState((prevState) => ({ ...prevState, ...valOrFn }));
    }
  };

  const validate = async (name) => {
    if (name) {
      const url = kebabCase(name);
      let error = null;

      try {
        const { data } = await api.get(`userId/byLogin/${url}`);
        if (data !== 'NOT FOUND') {
          error = 'Name in use, try another';
        }
      } catch (exception) {
        if (!(exception.response && exception.response.status === 404)) {
          throw exception;
        }
      }

      try {
        const { data } = await api.get(`teamId/byUrl/${url}`);
        if (data !== 'NOT FOUND') {
          error = 'Team already exists, try another';
        }
      } catch (exception) {
        if (!(exception.response && exception.response.status === 404)) {
          throw exception;
        }
      }

      if (error) {
        setState(({ teamName }) => (name === teamName ? { error } : {}));
      }
    }
  };

  const [debouncedValidate] = useState(() => debounce(validate, 200));
  useEffect(() => {
    const getName = async () => {
      const teamName = await getTeamPair();
      setState({ teamName });
    };
    getName();
  }, []);

  const handleChange = async (newValue) => {
    setState({
      teamName: newValue,
      error: '',
    });

    await debouncedValidate(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setState({ isLoading: true });
    trackSubmit();
    try {
      let description = 'A team that makes things';
      try {
        const predicates = await getPredicates();
        description = `A ${predicates[0]} team that makes ${predicates[1]} things`;
      } catch (error) {
        // Just use the plain description
      }
      const { data } = await api.post('teams', {
        name: state.teamName,
        url: kebabCase(state.teamName),
        hasAvatarImage: false,
        coverColor: '',
        location: '',
        description,
        backgroundColor: '',
        hasCoverImage: false,
        isVerified: false,
      });
      history.push(getTeamLink(data));
    } catch (error) {
      const message = error && error.response && error.response.data && error.response.data.message;
      setState({
        isLoading: false,
        error: message || 'Something went wrong',
      });
    }
  };

  const placeholder = 'Your Team Name';

  return (
    <PopoverDialog align="right" className={styles.createTeamPop}>
      <MultiPopoverTitle>
        Create Team <Emoji name="herb" inTitle />
      </MultiPopoverTitle>

      <PopoverInfo>
        <InfoDescription>Showcase your projects in one place, manage collaborators, and view analytics</InfoDescription>
      </PopoverInfo>

      <PopoverActions>
        <form onSubmit={handleSubmit}>
          <TextInput autoFocus labelText={placeholder} value={state.teamName} onChange={handleChange} placeholder={placeholder} error={state.error} />
          <div className={styles.teamUrlPreview}>/@{kebabCase(state.teamName || placeholder)}</div>

          {state.isLoading ? (
            <Loader style={{ width: '25px' }} />
          ) : (
            <Button submit size="small" emoji="thumbsUp" disabled={!!state.error}>
              Create Team
            </Button>
          )}
        </form>
      </PopoverActions>
      <PopoverInfo>
        <InfoDescription>You can change this later</InfoDescription>
      </PopoverInfo>
    </PopoverDialog>
  );
});

export default CreateTeamPop;
