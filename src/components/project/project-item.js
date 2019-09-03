import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { pickBy } from 'lodash';
import Markdown from 'Components/text/markdown';
import BookmarkButton from 'Components/buttons/bookmark-button';
import Button from 'Components/buttons/button';
import Image from 'Components/images/image';
import ProfileList from 'Components/profile-list';
import { ProjectLink } from 'Components/link';
import { PrivateIcon } from 'Components/private-badge';
import AnimationContainer from 'Components/animation-container';
import VisibilityContainer from 'Components/visibility-container';
import Note from 'Components/collection/note';
import { FALLBACK_AVATAR_URL, getProjectAvatarUrl } from 'Models/project';
import { useProjectMembers } from 'State/project';
import { useProjectOptions } from 'State/project-options';
import { useCurrentUser } from 'State/current-user';
import useDevToggle from 'State/dev-toggles';
import { useTrackedFunc } from 'State/segment-analytics';

import ProjectOptionsPop from './project-options-pop';
import styles from './project-item.styl';

const ProfileAvatar = ({ project }) => <Image className={styles.avatar} src={getProjectAvatarUrl(project)} defaultSrc={FALLBACK_AVATAR_URL} alt="" />;

const getLinkBodyStyles = (project) =>
  classnames(styles.linkBody, {
    [styles.private]: project.private,
  });

const ProfileListWithData = ({ project }) => {
  const { value: members } = useProjectMembers(project.id);
  return <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} {...members} />;
};

const ProfileListLoader = ({ project }) => (
  <VisibilityContainer>
    {({ wasEverVisible }) =>
      wasEverVisible ? <ProfileListWithData project={project} /> : <ProfileList layout="row" glitchTeam={project.showAsGlitchTeam} />
    }
  </VisibilityContainer>
);

const bind = (fn, ...boundArgs) => (...calledArgs) => fn(...boundArgs, ...calledArgs);

const ProjectItem = ({ project, projectOptions: providedProjectOptions, collection, noteOptions }) => {
  const myStuffEnabled = useDevToggle('My Stuff');
  const { currentUser } = useCurrentUser();
  const isAnonymousUser = !currentUser.login;

  const [hasBookmarked, setHasBookmarked] = useState(project.authUserHasBookmarked);
  useEffect(() => {
    setHasBookmarked(project.authUserHasBookmarked);
  }, [project.authUserHasBookmarked]);

  const [isHoveringOnProjectItem, setIsHoveringOnProjectItem] = useState(false);
  const onMouseEnter = () => {
    setIsHoveringOnProjectItem(true);
  };
  const onMouseLeave = () => {
    setIsHoveringOnProjectItem(false);
  };
  const onMyStuffPage = window.location.pathname.includes('my-stuff');

  const projectOptions = useProjectOptions(project, providedProjectOptions);
  const hasProjectOptions = Object.keys(projectOptions).length > 0;
  const dispatch = (projectOptionName, ...args) => projectOptions[projectOptionName](...args);

  const bookmarkAction = useTrackedFunc(
    () => projectOptions.toggleBookmark(project, hasBookmarked, setHasBookmarked),
    `Project ${hasBookmarked ? 'removed from my stuff' : 'added to my stuff'}`,
    (inherited) => ({ ...inherited, projectName: project.domain, baseProjectId: project.baseId || project.baseProject, userId: currentUser.id }),
  );

  return (
    <AnimationContainer type="slideDown" onAnimationEnd={dispatch}>
      {(slideDown) => (
        <AnimationContainer type="slideUp" onAnimationEnd={dispatch}>
          {(slideUp) => {
            const animatedProjectOptions = pickBy(
              {
                ...projectOptions,
                addPin: bind(slideUp, 'addPin'),
                removePin: bind(slideDown, 'removePin'),
                deleteProject: bind(slideDown, 'deleteProject'),
                removeProjectFromTeam: bind(slideDown, 'removeProjectFromTeam'),
                featureProject: bind(slideUp, 'featureProject'),
              },
              (_, key) => projectOptions[key],
            );

            return (
              <>
                {collection && (
                  <div className={styles.projectsContainerNote} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <Note
                      project={project}
                      collection={collection}
                      isAuthorized={noteOptions.isAuthorized}
                      hideNote={noteOptions.hideNote}
                      updateNote={noteOptions.updateNote}
                    />
                  </div>
                )}
                <div className={styles.container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                  <header className={styles.header}>
                    <div className={classnames(styles.userListContainer, { [styles.spaceForOptions]: hasProjectOptions })}>
                      <ProfileListLoader project={project} />
                    </div>
                    {myStuffEnabled && !isAnonymousUser && !onMyStuffPage && (
                      <div className={styles.bookmarkButtonContainer}>
                        <BookmarkButton
                          action={bookmarkAction}
                          initialIsBookmarked={hasBookmarked}
                          containerDetails={{ isHoveringOnProjectItem }}
                          projectName={project.domain}
                        />
                      </div>
                    )}
                    <div className={styles.projectOptionsContainer}>
                      <ProjectOptionsPop project={project} projectOptions={animatedProjectOptions} />
                    </div>
                  </header>
                  <ProjectLink className={getLinkBodyStyles(project)} project={project}>
                    <div className={styles.projectHeader}>
                      <div className={styles.avatarWrap}>
                        <ProfileAvatar project={project} />
                      </div>
                      <div className={styles.nameWrap}>
                        <div className={styles.itemButtonWrap}>
                          <Button
                            decorative
                            disabled={!!project.suspendedReason}
                            image={project.private ? <PrivateIcon inButton isPrivate /> : null}
                            imagePosition="left"
                          >
                            <span className={styles.projectDomain}>{project.suspendedReason ? 'suspended project' : project.domain}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className={styles.description}>
                      <Markdown length={80}>{project.suspendedReason ? 'suspended project' : project.description || ' '}</Markdown>
                    </div>
                  </ProjectLink>
                </div>
              </>
            );
          }}
        </AnimationContainer>
      )}
    </AnimationContainer>
  );
};
ProjectItem.propTypes = {
  project: PropTypes.shape({
    description: PropTypes.string.isRequired,
    domain: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    private: PropTypes.bool,
    showAsGlitchTeam: PropTypes.bool.isRequired,
    users: PropTypes.array,
    teams: PropTypes.array,
  }).isRequired,
  projectOptions: PropTypes.object,
  collection: PropTypes.object,
};

ProjectItem.defaultProps = {
  projectOptions: {},
  collection: null,
};

export default ProjectItem;
