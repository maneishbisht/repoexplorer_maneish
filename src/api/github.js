import { dummyUser, dummyRepos } from '../data'

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/github';

export async function fetchUser(username, devMode) {
  if (devMode) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...dummyUser, login: username }), 600)
    })
  } else {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
}



export async function fetchRepos(reponame, page = 1, perPage = 10, devMode) {
  if (devMode) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...dummyRepos].slice(perPage * (page - 1), perPage * page)), 500)
    })
  } else {
    const response = await fetch(`${BASE_URL}/search/repos?q=${encodeURIComponent(reponame)}&page=${page}&per_page=${perPage}`);
    if (!response.ok) throw new Error('Failed to fetch repositories');
    return response.json();
  }
}

export async function fetchReposbyUser(username, page = 1, perPage = 10, devMode) {
  if (devMode) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...dummyRepos].slice(perPage * (page - 1), perPage * page)), 500)
    })
  } else {
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}`);
    if (!response.ok) throw new Error('Failed to fetch user repositories');
    return response.json();
  }
}

//export function searchRepos(query, page = 1, perPage = 10, devMode) {
//
//  if (devMode) {
//
//    return new Promise((resolve) => {
//
//      const q = query.toLowerCase()
//
//      const filtered = dummyRepos.filter((r) =>
//
//        r.name.toLowerCase().includes(q) ||
//
//        (r.description && r.description.toLowerCase().includes(q))
//
//      )
//
//      setTimeout(() => resolve(filtered), 500)
//
//    })
//
//  }
//
//  return request(
//
//    `/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
//
//  )
//
//}