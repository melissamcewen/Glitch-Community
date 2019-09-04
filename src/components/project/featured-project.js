import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import Note from 'Components/collection/note';
import AnimationContainer from 'Components/animation-container';
import BookmarkButton from 'Components/buttons/bookmark-button';

import { useAPI, useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import { toggleBookmark } from 'State/collection';
import useDevToggle from 'State/dev-toggles';
import { useTrackedFunc } from 'State/segment-analytics';

import FeaturedProjectOptionsPop from './featured-project-options-pop';
import styles from './featured-project.styl';

const Top = ({
  featuredProject,
  collection,
  updateNote,
  hideNote,
  isAuthorized,
  unfeatureProject,
  createNote,
  myStuffEnabled,
  isAnonymousUser,
  bookmarkAction,
  hasBookmarked,
}) => (
  <div className={styles.top}>
    <div className={styles.left}>
      <Heading tagName="h2">
        Featured Project
        <Emoji name="clapper" inTitle />
      </Heading>
      {collection && (
        <div className={styles.note}>
          <Note project={featuredProject} collection={collection} updateNote={updateNote} hideNote={hideNote} isAuthorized={isAuthorized} />
        </div>
      )}
    </div>
    <div className={styles.right}>
      {myStuffEnabled && !isAnonymousUser && !window.location.pathname.includes('my-stuff') && (
        <div className={styles.bookmarkButtonContainer}>
          <BookmarkButton action={bookmarkAction} initialIsBookmarked={hasBookmarked} projectName={featuredProject.domain} />
        </div>
      )}
      {isAuthorized && (
        <div className={styles.unfeatureBtn}>
          <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} createNote={createNote} hasNote={!!featuredProject.note} />
        </div>
      )}
    </div>
  </div>
);

const FeaturedProject = ({
  addProjectToCollection,
  collection,
  displayNewNote,
  featuredProject,
  hideNote,
  isAuthorized,
  updateNote,
  unfeatureProject,
}) => {
  const dispatch = useDispatch();
  const myStuffEnabled = useDevToggle('My Stuff');
  const { currentUser } = useCurrentUser();
  const [hasBookmarked, setHasBookmarked] = useState(featuredProject.authUserHasBookmarked);
  const { createNotification } = useNotifications();
  const isAnonymousUser = !currentUser.login;
  const api = useAPI();
  const { addProjectToCollection: addProjectToCollectionAPI, removeProjectFromCollection } = useAPIHandlers();

  useEffect(() => {
    setHasBookmarked(featuredProject.authUserHasBookmarked);
  }, [featuredProject.authUserHasBookmarked]);

  const bookmarkAction = useTrackedFunc(
    () =>
      toggleBookmark({
        api,
        project: featuredProject,
        currentUser,
        createNotification,
        myStuffEnabled,
        addProjectToCollection: addProjectToCollectionAPI,
        removeProjectFromCollection,
        setHasBookmarked,
        hasBookmarked,
        dispatch,
      }),
    `Project ${hasBookmarked ? 'removed from my stuff' : 'added to my stuff'}`,
    (inherited) => ({
      ...inherited,
      projectName: featuredProject.domain,
      baseProjectId: featuredProject.baseId || featuredProject.baseProject,
      userId: currentUser.id,
      origin: `${inherited.origin}-featured-project`,
    }),
  );

  return (
    <div data-cy="featured-project">
      <AnimationContainer type="slideDown" onAnimationEnd={unfeatureProject}>
        {(animateAndUnfeatureProject) => (
          <ProjectEmbed
            top={
              <Top
                featuredProject={featuredProject}
                collection={collection}
                hideNote={hideNote}
                updateNote={updateNote}
                isAuthorized={isAuthorized}
                unfeatureProject={animateAndUnfeatureProject}
                createNote={collection ? () => displayNewNote(featuredProject) : null}
                myStuffEnabled={myStuffEnabled}
                isAnonymousUser={isAnonymousUser}
                bookmarkAction={bookmarkAction}
                hasBookmarked={hasBookmarked}
              />
            }
            project={featuredProject}
            addProjectToCollection={addProjectToCollection}
          />
        )}
      </AnimationContainer>
    </div>
  );
};

FeaturedProject.propTypes = {
  addProjectToCollection: PropTypes.func,
  featuredProject: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  collection: PropTypes.object,
  displayNewNote: PropTypes.func,
  hideNote: PropTypes.func,
  updateNote: PropTypes.func,
};

FeaturedProject.defaultProps = {
  addProjectToCollection: null,
  collection: null,
  displayNewNote: () => {},
  hideNote: () => {},
  updateNote: () => {},
};

export default FeaturedProject;
