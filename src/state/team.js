import { useState } from 'react';
import { useDispatch } from 'react-redux';

import * as assets from 'Utils/assets';

import { useAPIHandlers } from 'State/api';
import { useCurrentUser } from 'State/current-user';
import { useNotifications } from 'State/notifications';
import useUploader from 'State/uploader';
import useErrorHandlers from 'State/error-handlers';
import { actions } from 'State/resources';

const MEMBER_ACCESS_LEVEL = 20;
const ADMIN_ACCESS_LEVEL = 30;

// eslint-disable-next-line import/prefer-default-export
export function useTeamEditor(initialTeam) {
  const { currentUser, update: updateCurrentUser } = useCurrentUser();
  const { uploadAssetSizes } = useUploader();
  const { createNotification } = useNotifications();
  const { handleError, handleErrorForInput, handleImageUploadError } = useErrorHandlers();
  const dispatch = useDispatch();
  const { getAvatarImagePolicy, getCoverImagePolicy } = assets.useAssetPolicy();
  const {
    updateItem,
    deleteItem,
    joinTeam,
    inviteEmailToTeam,
    inviteUserToTeam,
    removeUserFromProject,
    removeUserFromTeam,
    addProjectToTeam,
    removeProjectFromTeam,
    addPinnedProject,
    removePinnedProject,
    updateUserAccessLevel,
    joinTeamProject,
  } = useAPIHandlers();
  const [team, setTeam] = useState(initialTeam);

  async function updateFields(changes) {
    const { data } = await updateItem({ team }, changes);
    setTeam((prev) => ({ ...prev, ...data }));
    if (currentUser) {
      const teamIndex = currentUser.teams.findIndex(({ id }) => id === team.id);
      if (teamIndex >= 0) {
        const teams = [...currentUser.teams];
        teams[teamIndex] = team;
        updateCurrentUser({ teams });
      }
    }
  }

  function updatePermissions(project, permissions) {
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (p.id !== project.id) return p;
        return {
          ...p,
          permissions,
        };
      }),
    }));
  }

  function removePermissions(user, projects) {
    setTeam((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => {
        if (!projects.some((project) => project.id === p.id)) return p;
        return {
          ...p,
          permissions: p.permissions.filter((perm) => perm.userId !== user.id),
        };
      }),
    }));
  }

  function removeUserAdmin(user) {
    const index = team.adminIds.indexOf(user.id);
    if (index !== -1) {
      setTeam((prev) => ({
        ...prev,
        counter: prev.adminIds.splice(index, 1),
      }));
    }
  }

  const withErrorHandler = (fn, handler) => (...args) => fn(...args).catch(handler);

  const funcs = {
    updateName: (name) => updateFields({ name }).catch(handleErrorForInput),
    updateUrl: (url) => updateFields({ url }).catch(handleErrorForInput),
    updateDescription: (description) => updateFields({ description }).catch(handleErrorForInput),
    joinTeam: withErrorHandler(async () => {
      await joinTeam({ team });
      setTeam((prev) => ({
        ...prev,
        teamPermissions: [...prev.teamPermissions, { accessLevel: MEMBER_ACCESS_LEVEL, userId: currentUser.id }],
        users: [...prev.users, currentUser],
      }));
      if (currentUser) {
        const { teams } = currentUser;
        updateCurrentUser({ teams: [...teams, team] });
      }
    }, handleError),
    inviteEmail: (email) => inviteEmailToTeam({ team }, email).catch(handleError),
    inviteUser: (user) => inviteUserToTeam({ user, team }).catch(handleError),
    removeUserFromTeam: withErrorHandler(async (user, projects) => {
      // Kick them out of every project at once, and wait until it's all done
      await Promise.all(projects.map((project) => removeUserFromProject({ project, user })));
      // Now remove them from the team. Remove them last so if something goes wrong you can do this over again
      await removeUserFromTeam({ user, team });
      removeUserAdmin(user);
      setTeam((prev) => ({
        ...prev,
        teamPermissions: prev.teamPermissions.filter((p) => p.userId !== user.id),
        users: prev.users.filter((u) => u.id !== user.id),
      }));
      if (currentUser && currentUser.id === user.id) {
        const teams = currentUser.teams.filter(({ id }) => id !== team.id);
        updateCurrentUser({ teams });
      }
      // update projects so that this user no longer appears in member lists
      dispatch(actions.removeUserFromTeamProjects(projects));
      removePermissions(user, projects);
    }, handleError),
    uploadAvatar: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getAvatarImagePolicy({ team });
          const success = await uploadAssetSizes(blob, policy, assets.AVATAR_SIZES);
          if (!success) {
            return;
          }

          const image = await assets.blobToImage(blob);
          const color = assets.getDominantColor(image);
          await updateFields({
            hasAvatarImage: true,
            backgroundColor: color,
          });
          setTeam((prev) => ({ ...prev, updatedAt: Date.now() }));
        }, handleImageUploadError),
      ),
    uploadCover: () =>
      assets.requestFile(
        withErrorHandler(async (blob) => {
          const { data: policy } = await getCoverImagePolicy({ team });
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
          setTeam((prev) => ({ ...prev, updatedAt: Date.now() }));
        }, handleImageUploadError),
      ),
    clearCover: () => updateFields({ hasCoverImage: false }).catch(handleError),
    addProject: withErrorHandler(async (project) => {
      await addProjectToTeam({ project, team });
      setTeam((prev) => ({
        ...prev,
        projects: [project, ...prev.projects],
      }));
      dispatch(actions.addProjectToTeam(project));
    }, handleError),
    removeProjectFromTeam: withErrorHandler(async (project) => {
      await removeProjectFromTeam({ project, team });
      setTeam((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
      dispatch(actions.removeProjectFromTeam(project));
    }, handleError),
    deleteProject: withErrorHandler(async (project) => {
      await deleteItem({ project });
      setTeam((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p.id !== project.id),
      }));
    }, handleError),
    addPin: withErrorHandler(async (project) => {
      await addPinnedProject({ project, team });
      setTeam((prev) => ({
        ...prev,
        teamPins: [...prev.teamPins, { projectId: project.id }],
      }));
    }, handleError),
    removePin: withErrorHandler(async (project) => {
      await removePinnedProject({ project, team });
      setTeam((prev) => ({
        ...prev,
        teamPins: prev.teamPins.filter((p) => p.projectId !== project.id),
      }));
    }, handleError),
    updateWhitelistedDomain: (whitelistedDomain) => updateFields({ whitelistedDomain }).catch(handleError),
    updateUserPermissions: withErrorHandler(async (user, accessLevel) => {
      if (accessLevel === MEMBER_ACCESS_LEVEL && team.adminIds.length <= 1) {
        createNotification('A team must have at least one admin', { type: 'error' });
        return false;
      }
      await updateUserAccessLevel({ user, team }, accessLevel);
      if (accessLevel === ADMIN_ACCESS_LEVEL) {
        setTeam((prev) => ({
          ...prev,
          counter: prev.adminIds.push(user.id),
        }));
      } else {
        removeUserAdmin(user);
      }
      return null;
    }, handleError),
    joinTeamProject: withErrorHandler(async (project) => {
      const { data: updatedProject } = await joinTeamProject({ team, project });
      updatePermissions(project, updatedProject.users.map((user) => user.projectPermission));
      dispatch(actions.joinTeamProject(project));
    }, handleError),
    leaveProject: withErrorHandler(async (project) => {
      await removeUserFromProject({ project, user: currentUser });
      removePermissions(currentUser, [project]);
      dispatch(actions.leaveProject(project));
    }, handleError),
    featureProject: (project) => updateFields({ featured_project_id: project.id }).catch(handleError),
    unfeatureProject: () => updateFields({ featured_project_id: null }).catch(handleError),
  };
  return [team, funcs];
}
