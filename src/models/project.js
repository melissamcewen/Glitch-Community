import { CDN_URL, EDITOR_URL, PROJECTS_DOMAIN } from 'Utils/constants';

export const FALLBACK_AVATAR_URL = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123';

export function getProjectAvatarUrl({ id, avatarUpdatedAt }) {
  return `${CDN_URL}/project-avatar/${id}.png?${avatarUpdatedAt}`;
}

export function getProjectLink({ domain }) {
  return `/~${domain}`;
}

export function getShowUrl(domain, projectsDomain = PROJECTS_DOMAIN) {
  return `//${domain}.${projectsDomain}`;
}

export function getEditorUrl(domain, path, line, character, editorUrl = EDITOR_URL) {
  if (path && Number.isInteger(line) && Number.isInteger(character)) {
    return `${editorUrl}#!/${domain}?path=${path}:${line}:${character}`;
  }
  return `${editorUrl}#!/${domain}`;
}

export function getRemixUrl(domain, editorUrl = EDITOR_URL) {
  return `${editorUrl}#!/remix/${domain}`;
}

export function sortProjectsByLastAccess(projects) {
  return projects.sort((a, b) => {
    if (a.permission.userLastAccess && b.permission.userLastAccess) {
      return Date.parse(b.permission.userLastAccess) - Date.parse(a.permission.userLastAccess);
    }
    if (a.permission.userLastAccess) {
      return -1;
    }
    if (b.permission.userLastAccess) {
      return 1;
    }
    return Date.parse(b.lastAccess) - Date.parse(a.lastAccess);
  });
}

export const MEMBER_ACCESS_LEVEL = 20;
export const ADMIN_ACCESS_LEVEL = 30;

export function userIsProjectMember({ project, user }) {
  if (!user || !project || !project.permissions) return false;
  return project.permissions.some(({ userId }) => user.id === userId);
}

export function userIsProjectTeamMember({ project, user }) {
  if (!user || !user.teams || !project || !project.teams) return false;
  return project.teams.some((projectTeam) => user.teams.some((userTeam) => projectTeam.id === userTeam.id));
}

export function userIsProjectAdmin({ project, user }) {
  if (!user || !project) return false;
  return project.permissions.some(({ userId, accessLevel }) => user.id === userId && accessLevel >= ADMIN_ACCESS_LEVEL);
}

export function userIsOnlyProjectAdmin({ project, user }) {
  if (!user || !project) return false;
  const adminCount = project.permissions.filter((p) => p.accessLevel >= ADMIN_ACCESS_LEVEL).length;
  if (adminCount > 1) return false;
  return userIsProjectAdmin({ project, user });
}
