import { useState, useEffect } from 'react';

import useUploader from 'State/uploader';
import { useAPIHandlers } from 'State/api';
import useErrorHandlers from 'State/error-handlers';
import { useResource, allReady } from 'State/resources';
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

// only show project members if both teams and users are available,
// but allow it to show stale data (e.g. right after a user has been added to a project)
export function useProjectMembers(projectId) {
  const res = allReady({
    users: useResource('projects', projectId, 'users'),
    teams: useResource('projects', projectId, 'teams'),
  });
  if (res.value.users && res.value.teams) return res;
  return { status: 'loading' };
}

export function useProjectEditor(initialProject) {
  const [project, setProject] = useState(initialProject);
  const { uploadAsset } = useUploader();
  const { handleError, handleErrorForInput } = useErrorHandlers();
  const { getAvatarImagePolicy } = assets.useAssetPolicy();
  const { updateItem, deleteItem, updateProjectDomain } = useAPIHandlers();
  useEffect(() => setProject(initialProject), [initialProject]);

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
