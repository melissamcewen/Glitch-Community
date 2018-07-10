/// A locally cached minimal api wrapper

const axios = require("axios");
const {Cache} = require("memory-cache");
const moment = require("moment-mini");

const {API_URL} = require("./constants");

const NOT_FOUND = Symbol();
const CACHE_TIMEOUT = moment.duration(15, 'minutes').asMilliseconds()

const projectCache = new Cache();
const userCache = new Cache();

async function getFromCacheOrApi(id, cache, api) {
  let item = cache.get(id);
  if (item === null) {
    try {
      item = (await api(id)) || NOT_FOUND;
      cache.put(id, item, CACHE_TIMEOUT);
    } catch (e) {
      item = NOT_FOUND;
    }
  }
  return item !== NOT_FOUND ? item : null;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function getProjectFromApi(domain) {
  const response = await api.get(`/projects/${domain}`);
  return response.data;
}

async function getUserFromApi(login) {
  const response = await api.get(`/users/byLogins?logins=${login}`);
  return response.data.length ? response.data[0] : null;
}

module.exports = {
  getProject: domain => getFromCacheOrApi(domain, projectCache, getProjectFromApi),
  getUser: login => getFromCacheOrApi(login, userCache, getUserFromApi),
};