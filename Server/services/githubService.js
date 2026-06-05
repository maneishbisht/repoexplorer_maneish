import redis from '../config/redis.js';


export async function fetchFromGitHub(endpoint) {

  const cacheKey = `github_cache:${endpoint}`;
  

  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    const err = new Error('GitHub token not configured');
    err.status = 500;
    err.code = 'CONFIG_ERROR';
    throw err;
  }

  const url = `${process.env.GITHUB_API}/${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'RepoExplorer-Server',
      Authorization: `Bearer ${token}`,
    },
  });

  if(res.status === 404){const nullData = null;await redis.set(cacheKey, JSON.stringify(nullData), 'EX', process.env.CACHE_TTL);return nullData}
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

  await redis.set(cacheKey, JSON.stringify(data), 'EX', process.env.CACHE_TTL);
  
  return data;
}
