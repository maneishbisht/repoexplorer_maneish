import { useState, useCallback,useRef } from 'react'

import { fetchUser, fetchRepos, fetchReposbyUser} from '../api/github'



const SORT_FNS = {

  stars: (a, b) => b.stargazers_count - a.stargazers_count,

  name: (a, b) => a.name?.localeCompare(b.name) ?? 0,

  updated: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),

}



export function useGitHubUser(devMode = false) {

  const query = useRef('')

  const [searchType,setSearchType] = useState('user')

  const [user,setUser] = useState(null)

  const [repos, setRepos] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  const [sortBy, setSortBy] = useState('stars') //* need to add useEffect and create local state inside the RepoList which contains sorted list of the repos when sortBy changes. RepoList will always Use this sorted list of Repos for rendering*/

  const [page, setPage] = useState(1)

  const [hasMore, setHasMore] = useState(false)

  const [loadingMore, setLoadingMore] = useState(false)




  const search = useCallback(async () => {

    if (!query?.current?.trim()) return

    const isDev = devMode



    setLoading(true)

    setError(null)

    setUser((prev)=>{
      return null
    });

    setRepos([])

    setPage(1)

    setHasMore(true)



    try {

      if (searchType === 'user') {

        const userData= await Promise.all([fetchUser(query.current.trim(),isDev),fetchReposbyUser(query.current.trim(),1, 10, isDev)])

        setUser(userData[0]);setRepos(userData[1])

        if(userData[1].length === 10){
          setHasMore(true)
        }

      } else {

        const reposData = await fetchRepos(query.current.trim(), 1, 10, isDev)
        setRepos(reposData)

        if(reposData.length === 10){
          setHasMore(true)
        }
      }


    } catch (err) {

      setError(err)

      setUser(null)

      setRepos([])

    } finally {

      setLoading(false)

    }

  },[searchType,devMode])



  const loadMore = async () => {

    if((searchType === 'user')&&(!user)){return}
    if (!query?.current || loadingMore || !hasMore){return}

    setLoadingMore(true)

    const nextPage = page + 1

    try {

      let reposData;
      if(searchType === "user"){reposData = await fetchReposbyUser(user.login, nextPage, 10, devMode)}
      else{reposData = await fetchRepos(query.current.trim(), nextPage, 10, devMode)}

      setRepos((prev) => [...prev, ...reposData])

      setPage(nextPage)

      setHasMore(reposData.length==10)

    } catch (err) {

      setError(err)

    } finally {

      setLoadingMore(false)

    }

  }



  const clearError = useCallback(() => setError(null), [])


  const sortedRepos = [...repos].sort(SORT_FNS[sortBy] || SORT_FNS.stars)



  return {repos: sortedRepos,setRepos,loading,error,sortBy,setSortBy,loadMore,hasMore,loadingMore,search,query,searchType,setSearchType,user,setUser,clearError}

}