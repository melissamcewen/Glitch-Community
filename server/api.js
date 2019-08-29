/// A locally cached minimal api wrapper

const axios = require('axios');
const dayjs = require('dayjs');

const { API_URL } = require('./constants').current;
const createCache = require('./cache');
const { allByKeys, getSingleItem } = require('Shared/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

async function getProjectFromApi(domain) {
  const project = await getSingleItem(api, `v1/projects/by/domain?domain=${domain}`, domain);
  if (!project) return project;
  const members = await allByKeys({
    // teams: getAllPages(api, `v1/projects/by/domain/teams?domain=${domain}`),
    // users: getAllPages(api, `v1/projects/by/domain/users?domain=${domain}`),
  });
  return { ...project, ...members };
}

function getTeamFromApi(url) {
  return getSingleItem(api, `v1/teams/by/url?url=${encodeURIComponent(url)}`, url);
}

function getUserFromApi(login) {
  return getSingleItem(api, `v1/users/by/login?login=${encodeURIComponent(login)}`, login);
}

function getCollectionFromApi(login, collection) {
  const url = `${login}/${collection}`;
  const encodedUrl = `${encodeURIComponent(login)}/${encodeURIComponent(collection)}`;
  return getSingleItem(api, `v1/collections/by/fullUrl?fullUrl=${encodedUrl}`, url);
}

async function getCultureZinePosts() {
  console.log('Fetching culture zine posts');
  const client = 'client_id=ghost-frontend&client_secret=c9a97f14ced8';
  const params = 'filter=featured:true&limit=4&fields=id,title,url,feature_image,primary_tag&include=tags';
  const url = `https://culture-zine.glitch.me/culture/ghost/api/v0.1/posts/?${client}&${params}`;
  const response = await axios.get(url, { timeout: 10000 });
  return response.data.posts;
}

const [getFromCache] = createCache(dayjs.convert(1, 'hour', 'ms'), 'load');
const [getFromZineCache] = createCache(dayjs.convert(15, 'minutes', 'ms'), 'load');

module.exports = {
  getProject: (domain) => getFromCache(`project ${domain}`, getProjectFromApi, domain),
  getTeam: (url) => getFromCache(`team ${url}`, getTeamFromApi, url),
  getUser: (login) => getFromCache(`user ${login}`, getUserFromApi, login),
  getCollection: (login, collection) => getFromCache(`collection ${login}/${collection}`, getCollectionFromApi, login, collection),
  getZine: () => getFromZineCache('culture zine', getCultureZinePosts),
};
