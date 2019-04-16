/* global CDN_URL EDITOR_URL PROJECTS_DOMAIN */

export const DEFAULT_PROJECT_AVATAR = 'https://cdn.glitch.com/c53fd895-ee00-4295-b111-7e024967a033%2Ffallback-project-avatar.svg?1528812220123';

export function getAvatarUrl(id, cdnUrl = CDN_URL) {
  return `${cdnUrl}/project-avatar/${id}.png`;
}

export function getLink({ domain }) {
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
