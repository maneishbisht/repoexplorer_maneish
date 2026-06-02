import { useState, useCallback } from 'react'

import { fetchUser, fetchRepos, searchRepos } from '../api/github'



const SORT_FNS = {

  stars: (a, b) => b.stargazers_count - a.stargazers_count,

  name: (a, b) => a.name?.localeCompare(b.name) ?? 0,

  updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),

}



export function useGitHubUser(devMode = false) {

  const [user, setUser] = useState(null)

  const [repos, setRepos] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  const [sortBy, setSortBy] = useState('stars')

  const [page, setPage] = useState(1)

  const [hasMore, setHasMore] = useState(false)

  const [loadingMore, setLoadingMore] = useState(false)

  const search = useCallback(async (query, mode) => {

    if (!query.trim()) return

    const isDev = devMode



    setLoading(true)

    setError(null)

    setUser(null)

    setRepos([])

    setPage(1)

    setHasMore(false)



    try {

      if (mode === 'user') {

        const userData= await Promise.all([fetchUser(query.trim(),isDev),fetchRepos(query.trim(),mode,1, 30, isDev)])

        setUser(userData[0]);setRepos(userData[1])

        setHasMore(false);

      } else {

        const reposData = await fetchRepos(query.trim(),mode, 1, 30, isDev)

        setRepos(reposData)

        setHasMore(false)

      }

    } catch (err) {

      setError(err)

      setUser(null)

      setRepos([])

    } finally {

      setLoading(false)

    }

  })



  const loadMore = useCallback(async (searchtype) => {

    if (!user || loadingMore || !hasMore) return

    setLoadingMore(true)

    const nextPage = page + 1

    try {

      const reposData = await fetchRepos(user.login, nextPage, 30, devMode)

      setRepos((prev) => [...prev, ...reposData])

      setPage(nextPage)

      setHasMore(reposData.length === 30)

    } catch (err) {

      setError(err)

    } finally {

      setLoadingMore(false)

    }

  })



  const clearError = useCallback(() => setError(null), [])



  const sortedRepos = [...repos].sort(SORT_FNS[sortBy] || SORT_FNS.stars)



  return {user,setUser,repos: sortedRepos,setRepos,loading,error,sortBy,setSortBy,loadMore,hasMore,loadingMore,search,clearError,}

}