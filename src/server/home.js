const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const { API_URL } = require('./constants').current;
const { getSingleItem, getAllPages } = require('Shared/api');

const GLITCH_TEAM_ID = 74;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function saveHomeDataToFile ({ data, persistentToken }) {
  const teams = await getAllPages(api, `/v1/users/by/persistentToken/teams?persistentToken={persistentToken}&limit=100`)
  if (!teams.some(team => team.id === GLITCH_TEAM_ID)) throw new Error('Forbidden')
  
  await fs.writeFile(path.join(__dirname, '../src/curated/home.json'), JSON.stringify(data), { encoding: 'utf8' })
}