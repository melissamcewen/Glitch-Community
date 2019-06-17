import React from 'react';
import PropTypes from 'prop-types';

import Heading from 'Components/text/heading';
import ProjectEmbed from 'Components/project/project-embed';
import Emoji from 'Components/images/emoji';
import Note from 'Components/collection/note';
import AnimationContainer from 'Components/animation-container';
import FeaturedProjectOptionsPop from './featured-project-options-pop';
import styles from './featured-project.styl';

const Top = ({ featuredProject, collection, updateNote, hideNote, isAuthorized, unfeatureProject, createNote }) => (
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
    {isAuthorized && (
      <div className={styles.unfeatureBtn}>
        <FeaturedProjectOptionsPop unfeatureProject={unfeatureProject} createNote={createNote} hasNote={!!featuredProject.note} />
      </div>
    )}
  </div>
);

const FeaturedProject = ({
  addProjectToCollection,
  collection,
  currentUser,
  displayNewNote,
  featuredProject,
  hideNote,
  isAuthorized,
  updateNote,
  unfeatureProject,
}) => (
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
              createNote={collection ? () => displayNewNote(featuredProject.id) : null}
            />
          }
          project={featuredProject}
          isAuthorized={isAuthorized}
          currentUser={currentUser}
          addProjectToCollection={addProjectToCollection}
        />
      )}
    </AnimationContainer>
  </div>
);

FeaturedProject.propTypes = {
  addProjectToCollection: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  featuredProject: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  unfeatureProject: PropTypes.func.isRequired,
  collection: PropTypes.object,
  displayNewNote: PropTypes.func,
  hideNote: PropTypes.func,
  updateNote: PropTypes.func,
};

FeaturedProject.defaultProps = {
  collection: null,
  displayNewNote: () => {},
  hideNote: () => {},
  updateNote: () => {},
};

export default FeaturedProject;
