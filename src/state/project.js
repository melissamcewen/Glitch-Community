import React, { useState, useCallback, useContext, createContext, useEffect } from 'react';

import useUploader from 'State/uploader';
import { useAPI, useAPIHandlers } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import * as assets from 'Utils/assets';
import { allByKeys, getSingleItem, getAllPages } from 'Shared/api';

export async function getProjectByDomain(api, domain) {
  const { project, teams, users } = await allByKeys({
    project: getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain),
    teams: getAllPages(api, `v1/projects/by/domain/teams?domain=${domain}`),
    users: getAllPages(api, `v1/projects/by/domain/users?domain=${domain}`),
  });
  return { ...project, teams, users };
}

async function getMembers(api, projectId, withCacheBust) {
  const cacheBust = withCacheBust ? `&cacheBust=${Date.now()}` : '';
  const [users, teams] = await Promise.all([
    getAllPages(api, `/v1/projects/by/id/users?id=${projectId}${cacheBust}`),
    getAllPages(api, `/v1/projects/by/id/teams?id=${projectId}${cacheBust}`),
  ]);
  return { users, teams };
}

const loadingResponse = { status: 'loading' };

function loadProjectMembers(api, projectIds, setProjectResponses, withCacheBust) {
  // set selected projects to 'loading' if they haven't been initialized yet
  setProjectResponses((prev) => {
    const next = { ...prev };
    for (const projectId of projectIds) {
      if (!next[projectId] || !next[projectId].members) {
        next[projectId] = { ...next[projectId], members: loadingResponse };
      }
    }
    return next;
  });
  // update each project as it loads
  projectIds.forEach(async (projectId) => {
    const members = await getMembers(api, projectId, withCacheBust);
    setProjectResponses((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        members: { status: 'ready', value: members },
      },
    }));
  });
}

const ProjectMemberContext = createContext();
const ProjectReloadContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const [projectResponses, setProjectResponses] = useState({});
  const api = useAPI();

  const getProjectMembers = useCallback((projectId) => {
    if (projectResponses[projectId] && projectResponses[projectId].members) {
      console.log('returning from cache', Date.now());
      return projectResponses[projectId].members;
    }
    loadProjectMembers(api, [projectId], setProjectResponses);
    return loadingResponse;
  }, [projectResponses, api]);

  const reloadProjectMembers = useCallback((projectIds) => {
    console.log('reloadProjectMembers');
    loadProjectMembers(api, projectIds, setProjectResponses, true);
  }, [api]);

  return (
    <ProjectMemberContext.Provider value={getProjectMembers}>
      <ProjectReloadContext.Provider value={reloadProjectMembers}>
        {children}
      </ProjectReloadContext.Provider>
    </ProjectMemberContext.Provider>
  );
};

export function useProjectMembers(projectId) {
  const getProjectMembers = useContext(ProjectMemberContext);
  return getProjectMembers(projectId);
}

export function useProjectReload() {
  return useContext(ProjectReloadContext);
}

export function useProjectEditor(initialProject) {
  const [project, setProject] = useState(initialProject);
  const { uploadAsset } = useUploader();
  const { handleError, handleErrorForInput } = useErrorHandlers();
  const { getAvatarImagePolicy } = assets.useAssetPolicy();
  const { updateItem, deleteItem, updateProjectDomain } = useAPIHandlers();
  useEffect(() => setProject(initialProject), [initialProject]);
  console.log('useProjectEditor', project.permissions);

  async function updateFields(changes) {
    await updateItem({ project }, changes);
    setProject((prev) => ({
      ...prev,
      ...changes,
    }));
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    deleteProject: () => deleteItem({ project }).catch(handleError),
    updateDomain: withErrorHandler(async (domain) => {
      await updateFields({ domain });
      // don't await this because the project domain has already changed and I don't want to delay other things updating
      updateProjectDomain({ project });
    }, handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    updatePrivate: (isPrivate) => updateFields({ private: isPrivate }).catch(handleError),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getAvatarImagePolicy({ project });
          await uploadAsset(blob, policy, '', { cacheControl: 60 });
          setProject((prev) => ({
            ...prev,
            avatarUpdatedAt: Date.now(),
          }));
        }, handleError),
      ),
  };
  return [project, funcs];
}
