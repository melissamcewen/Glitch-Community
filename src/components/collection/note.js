import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import _ from 'lodash';

import { isDarkColor } from 'Models/collection';
import AuthDescription from 'Components/fields/auth-description';
import { CollectionCuratorLoader } from 'Components/collection/collection-item';
import styles from './note.styl';

const cx = classNames.bind(styles);

/**
 * Note Component
 */
const Note = ({ collection, project, updateNote, hideNote, isAuthorized }) => {
  function hideEmptyNote(event) {
    let description = event.target.value || '';
    description = _.trim(description);

    if (!description || description.length === 0) {
      setTimeout(() => hideNote(project.id), 500);
    }
  }

  if (!project.isAddingANewNote && !project.note) {
    return null;
  }
  const collectionCoverColor = collection.coverColor;

  return (
    <div className={styles.note}>
      <div
        className={cx({ descriptionContainer: true, dark: isDarkColor(collectionCoverColor) })}
        style={{ backgroundColor: collectionCoverColor, borderColor: collectionCoverColor }}
      >
        <AuthDescription
          authorized={isAuthorized}
          description={project.note || ''}
          placeholder="Share why you love this app."
          update={(note) => updateNote({ note, projectId: project.id })}
          onBlur={hideEmptyNote}
          allowImages
        />
      </div>
      <div className={styles.user}>
        <CollectionCuratorLoader collection={collection} />
      </div>
    </div>
  );
};

Note.propTypes = {
  collection: PropTypes.shape({
    coverColor: PropTypes.string,
    user: PropTypes.object,
    team: PropTypes.object,
  }).isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  project: PropTypes.shape({
    note: PropTypes.string,
    isAddingANewNote: PropTypes.bool,
  }).isRequired,
  updateNote: PropTypes.func,
  hideNote: PropTypes.func,
};

Note.defaultProps = {
  updateNote: () => {},
  hideNote: () => {},
};

export default Note;
