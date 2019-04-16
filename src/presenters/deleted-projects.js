// deleted projects is a little strange
// it loads the projects from the api, but expects them to be stored elsewhere
// so it takes an initially empty list of projects and a function to fill it once they load

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Heading from 'Components/text/heading';
import Loader from 'Components/loaders/loader';
import { ProjectAvatar } from 'Components/images/avatar';

import { useAPI } from '../state/api';
import { useTrackedFunc } from './segment-analytics';

function clickUndelete(event, callback) {
  const node = event.target.closest('li');
  node.addEventListener('animationend', callback, { once: true });
  node.classList.add('slide-up');
}

const DeletedProject = ({ id, domain, onClick }) => {
  const onClickUndelete = (evt) => clickUndelete(evt, onClick);
  const onClickTracked = useTrackedFunc(onClickUndelete, 'Undelete clicked');
  return (
    <button className="button-unstyled" onClick={onClickTracked}>
      <div className="deleted-project">
        <ProjectAvatar id={id} />
        <div className="deleted-project-name">{domain}</div>
        <div className="button button-small">Undelete</div>
      </div>
    </button>
  );
};
DeletedProject.propTypes = {
  id: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const DeletedProjectsList = ({ deletedProjects, undelete }) => (
  <ul className="projects-container deleted-projects-container">
    {deletedProjects.map(({ id, domain }) => (
      <li key={id} className="deleted-project-container">
        <DeletedProject id={id} domain={domain} onClick={() => undelete(id)} />
      </li>
    ))}
  </ul>
);
DeletedProjectsList.propTypes = {
  deletedProjects: PropTypes.array.isRequired,
  undelete: PropTypes.func.isRequired,
};

function DeletedProjects({ deletedProjects, setDeletedProjects, undelete }) {
  const api = useAPI();
  // states: hidden | loading | ready
  const [state, setState] = useState('hidden');
  const clickShow = async () => {
    setState('loading');
    try {
      const { data } = await api.get('user/deleted-projects');
      setDeletedProjects(data);
      setState('ready');
    } catch (e) {
      setState('hidden');
    }
  };
  const clickHide = () => {
    setState('hidden');
  };

  if (state === 'hidden') {
    return (
      <button className="button button-tertiary" onClick={clickShow}>
        Show
      </button>
    );
  }
  if (state === 'loading') {
    return <Loader />;
  }
  if (!deletedProjects.length) {
    return 'nothing found';
  }
  return (
    <>
      <DeletedProjectsList deletedProjects={deletedProjects} undelete={undelete} />
      <button className="button button-tertiary" onClick={clickHide}>
        Hide Deleted Projects
      </button>
    </>
  );
}

DeletedProjects.propTypes = {
  deletedProjects: PropTypes.array,
  setDeletedProjects: PropTypes.func.isRequired,
  undelete: PropTypes.func.isRequired,
};

DeletedProjects.defaultProps = {
  deletedProjects: [],
};

const DeletedProjectsWrap = (props) => (
  <article className="deleted-projects">
    <Heading tagName="h2">
      Deleted Projects <span className="emoji bomb emoji-in-title" />
    </Heading>
    <DeletedProjects {...props} />
  </article>
);

export default DeletedProjectsWrap;
