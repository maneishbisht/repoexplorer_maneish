import { useState, useCallback,useRef } from 'react'

import { fetchUser, fetchRepos, fetchReposbyUser} from '../api/github'

import { SORT_FNS } from '../../helpers/recent'



export function useGitHubUser(devMode = false) {


  const [searchType,setSearchType] = useState('user')


  const [user,setUser] = useState(null)

  const [repos, setRepos] = useState([])

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState(null)

  const [sortBy, setSortBy] = useState('stars') 

  const [page, setPage] = useState(1)

  const [hasMore, setHasMore] = useState(false)

  const [loadingMore, setLoadingMore] = useState(false)




  const search = useCallback(async (queryText) => {
    
    if (!queryText.trim()) return

    const isDev = devMode



    setLoading(true)

    setError(null)

    setUser((prev)=>{
      return null
    });

    setRepos([])

    setPage(1)

    setHasMore(false)



    try {

      if (searchType === 'user') 
        {
        const userData= await Promise.all([fetchUser(queryText.trim(),isDev),fetchReposbyUser(queryText.trim(),1, 10, isDev)])
        if(!userData[0])
          {
          const error = new Error("No such user Profile Found. Please make sure you typed correctly");
          throw error;
          }
        setUser(userData[0]);
        if(!userData[1]){setRepos([]);return}
        setRepos(userData[1].sort(SORT_FNS[sortBy] || SORT_FNS.stars))
        if(userData[1].length === 10){
        setHasMore(true)
        }
      } 
      else
      {
        const reposData = await fetchRepos(queryText.trim(), 1, 10, isDev)
        if(reposData.length===0)
        {
        const error = new Error("No such repository exists. Please Make sure you typed the name correctly");
        throw error;
        }
        setRepos([...reposData].sort(SORT_FNS[sortBy] || SORT_FNS.stars))
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



  const loadMore = async (queryText) => {

    if((searchType === 'user')&&(!user)){return}
    if (!queryText || loadingMore || !hasMore){return}

    setLoadingMore(true)

    const nextPage = page + 1

    try {

      if(searchType === "user")
      {
        const reposData = await fetchReposbyUser(user.login, nextPage, 10, devMode)
        setRepos((prev) => [...prev, ...reposData].sort(SORT_FNS[sortBy] || SORT_FNS.stars))
        setPage(nextPage)
        setHasMore(reposData.length==10)
      }
      else
      {
        const reposData = await fetchRepos(queryText.trim(), nextPage, 10, devMode)
        setRepos((prev) => [...prev, ...reposData].sort(SORT_FNS[sortBy] || SORT_FNS.stars))
        setPage(nextPage)
        setHasMore(reposData.length==10)
      }

    } catch (err) {
      setError(err)
    } finally {
      setLoadingMore(false)
    }

  }



  const clearError = useCallback(() => setError(null), [])


  return {repos,setRepos,loading,error,sortBy,setSortBy,loadMore,hasMore,loadingMore,search,searchType,setSearchType,user,setUser,clearError}

}