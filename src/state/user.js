import { useState, useEffect } from 'react';

import * as assets from 'Utils/assets';
import { useAPI, useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import useUploader from 'State/uploader';
import useErrorHandlers from 'State/error-handlers';
import { getSingleItem } from 'Shared/api';

function useUserPageGetters() {
  const api = useAPI();
  return {
    getDeletedProject: ({ project }) => api.get(`/projects/${project.id}?showDeleted=true`),
    getProject: ({ project }) => getSingleItem(api, `/v1/projects/by/id?id=${project.id}`, project.id),
  };
}

// eslint-disable-next-line import/prefer-default-export
export function useUserEditor(initialUser) {
  const [user, setUser] = useState({
    ...initialUser,
    _deletedProjects: [],
  });
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAsset, uploadAssetSizes } = useUploader();
  const { handleError, handleErrorForInput, handleImageUploadError } = useErrorHandlers();
  const { getCoverImagePolicy } = assets.useAssetPolicy();
  const {
    updateItem,
    deleteItem,
    removeUserFromProject,
    addPinnedProject,
    removePinnedProject,
    undeleteProject,
  } = useAPIHandlers();
  const { getDeletedProject, getProject } = useUserPageGetters();

  const isCurrentUser = !!currentUser && user.id === currentUser.id;
  useEffect(() => {
    if (isCurrentUser) {
      setUser((prev) => ({ ...prev, ...currentUser }));
    }
  }, [currentUser]);

  async function updateFields(changes) {
    const { data } = await updateItem({ user }, changes);
    setUser((prev) => ({ ...prev, ...data }));
    if (isCurrentUser) {
      updateCurrentUser(data);
    }
  }
  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateLogin: (login) => updateFields({ login }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getCoverImagePolicy({ user }); // TODO: why not 'getAvatarImagePolicy' here?
          const url = await uploadAsset(blob, policy, 'temporary-user-avatar');
          if (!url) {
            return;
          }
          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            avatarUrl: url,
            color,
          });
        }, handleImageUploadError),
      ),
    uploadCover: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getCoverImagePolicy({ user });
          const success = await uploadAssetSizes(blob, policy, assets.COVER_SIZES);
          if (!success) {
            return;
          }

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasCoverImage: true,
            coverColor: color,
          });
          setUser((prev) => ({ ...prev, updatedAt: Date.now() }));
        }, handleImageUploadError),
      ),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addPin: withErrorHandler(async (project) => {
      await addPinnedProject({ project, user });
      setUser((prev) => ({
        ...prev,
        pins: [...prev.pins, { id: project.id }],
      }));
    }, handleError),
    removePin: withErrorHandler(async (project) => {
      await removePinnedProject({ project, user });
      setUser((prev) => ({
        ...prev,
        pins: prev.pins.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    leaveProject: withErrorHandler(async (project) => {
      await removeUserFromProject({ project, user: currentUser });
      setUser((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    deleteProject: withErrorHandler(async (project) => {
      await deleteItem({ project });
      const { data } = await getDeletedProject({ project });
      const permission = project.permissions.find((p) => p.userId === currentUser.id);
      const deletedProjectWithPermission = { ...data, permission };
      setUser((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
        _deletedProjects: [deletedProjectWithPermission, ...prev._deletedProjects], // eslint-disable-line no-underscore-dangle
      }));
    }, handleError),
    undeleteProject: withErrorHandler(async (project) => {
      await undeleteProject({ project });
      const data = await getProject({ project });
      // temp set undeleted project updatedAt to now, while it's actually updating behind the scenes
      data.updatedAt = Date.now();
      setUser((prev) => ({
        ...prev,
        projects: [data, ...prev.projects],
        _deletedProjects: prev._deletedProjects.filter((p) => p.id !== project.id), // eslint-disable-line no-underscore-dangle
      }));
    }, handleError),
    setDeletedProjects: (_deletedProjects) => setUser((prev) => ({ ...prev, _deletedProjects })),
    featureProject: (project) => updateFields({ featured_project_id: project.id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [user, funcs];
}
