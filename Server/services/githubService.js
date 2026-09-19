import redis from '../config/redis.js';
import fs from 'fs';

// Safely read files with fallbacks if they do not exist
let GITHUB_TOKEN_FILE, GITHUB_API_FILE, CACHE_TTL_FILE;

try {
  GITHUB_TOKEN_FILE = fs.existsSync('/mnt/ssm-secrets/GITHUB_TOKEN') 
    ? fs.readFileSync('/mnt/ssm-secrets/GITHUB_TOKEN', 'utf8').trim() 
    : undefined;
} catch { GITHUB_TOKEN_FILE = undefined; }

try {
  GITHUB_API_FILE = fs.existsSync('/mnt/ssm-secrets/GITHUB_API') 
    ? fs.readFileSync('/mnt/ssm-secrets/GITHUB_API', 'utf8').trim() 
    : undefined;
} catch { GITHUB_API_FILE = undefined; }

try {
  CACHE_TTL_FILE = fs.existsSync('/mnt/ssm-secrets/CACHE_TTL') 
    ? fs.readFileSync('/mnt/ssm-secrets/CACHE_TTL', 'utf8').trim() 
    : undefined;
} catch { CACHE_TTL_FILE = undefined; }




export async function fetchFromGitHub(endpoint) {

  const cacheKey = `github_cache:${endpoint}`;
  

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const env_git_token = process.env.GITHUB_TOKEN;

  const token = env_git_token || GITHUB_TOKEN_FILE;

  if (!token) {
    const err = new Error('GitHub token not configured');
    err.status = 500;
    err.code = 'CONFIG_ERROR';
    throw err;
  }

  const API = process.env.GITHUB_API;

  const url = `${API}/${endpoint}` || `${GITHUB_API_FILE}/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RepoExplorer-Server',
      Authorization: `bearer ${token}`,
    },
  });

  const TTL = process.env.CACHE_TTL;
  
  if(res.status === 404){const nullData = null;await redis.set(cacheKey, JSON.stringify(nullData), 'EX', TTL || CACHE_TTL_FILE);return nullData}
  if (!res.ok){
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.message || `GitHub API responded with status ${res.status}`);
    error.status = res.status;
    if (res.status === 404) error.code = 'NOT_FOUND';
    else if (res.status === 403) error.code = 'REQUEST_HAS_BEEN_RATE_LIMITED';
    else error.code = 'GITHUB_ERROR';
    throw error;
  }

  const data = await res.json();

  await redis.set(cacheKey, JSON.stringify(data), 'EX', TTL || CACHE_TTL_FILE);
  
  return data;
}
