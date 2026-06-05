const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/github';

export async function fetchUser(username, devMode) {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    const data = await response.json();
    return data;
}



export async function fetchRepos(reponame, page = 1, perPage = 10, devMode) {
 
    const response = await fetch(`${BASE_URL}/search/repos?q=${encodeURIComponent(reponame)}&page=${page}&per_page=${perPage}`);
    if (!response.ok) throw new Error('Failed to fetch repositories');
    const resData = await response.json();
    const data = resData.items;
    return data;
}

export async function fetchReposbyUser(username, page = 1, perPage = 10, devMode) {
 
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}`);
    if (!response.ok) throw new Error('Failed to fetch user repositories');
    const data =  await response.json();
    return data;
  
}
