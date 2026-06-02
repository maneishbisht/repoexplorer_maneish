import { dummyUser, dummyRepos } from '../data'



const API_BASE = '/api/github'



async function request(endpoint) {

  const res = await fetch(`${API_BASE}${endpoint}`)

  if (!res.ok) {

    const body = await res.json().catch(() => ({}))

    const error = new Error(body.error || `Request failed with status ${res.status}`)

    error.status = res.status

    if (res.status === 404) error.code = 'NOT_FOUND'

    else if (res.status === 403) error.code = 'RATE_LIMITED'

    else error.code = 'NETWORK_ERROR'

    throw error

  }

  return res.json()

}



export function fetchUser(username, devMode) {

  if (devMode) {

    return new Promise((resolve) => {

      setTimeout(() => resolve({ ...dummyUser, login: username }), 600)

    })

  }

  return request(`/users/${encodeURIComponent(username)}`)

}



export function fetchRepos(username,mode,page = 1, perPage = 30, devMode) {

  if (devMode) {

    if(mode === 'user'){

      return new Promise((resolve) => {

        setTimeout(() => resolve([...dummyRepos].slice(4)), 500)

      })

    }

    return new Promise((resolve) => {

      setTimeout(() => resolve([...dummyRepos]), 500)

    })

  }

  return request(

    `/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}`

  )

}



export function searchRepos(query, page = 1, perPage = 30, devMode) {

  if (devMode) {

    return new Promise((resolve) => {

      const q = query.toLowerCase()

      const filtered = dummyRepos.filter((r) =>

        r.name.toLowerCase().includes(q) ||

        (r.description && r.description.toLowerCase().includes(q))

      )

      setTimeout(() => resolve(filtered), 500)

    })

  }

  return request(

    `/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`

  )

}