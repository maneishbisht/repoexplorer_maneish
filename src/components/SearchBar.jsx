import { useEffect, useRef, useState } from 'react'

import { theme, resetButton } from '../styles'



export default function SearchBar({ onSearch, searchType,setSearchType,query}) {

  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const timeoutIdRef = useRef(null)



  useEffect(() => {

    const handleResize = () => setIsSmallScreen(window.innerWidth < 500)

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {

      window.removeEventListener('resize', handleResize)

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)

    }

  }, [])

  useEffect(()=>{onSearch();},[searchType])


  const styles = {

    wrapper: {

      display: 'flex',

      gap: '8px',

      width: '100%',

      maxWidth: 600,

      margin: '0 auto',

      alignItems: 'stretch',

      flexWrap: 'wrap',

    },

    input: {

      flex: '1 1 200px',

      fontFamily: 'inherit',

      fontSize: theme.fontSizes.base,

      color: theme.colors.text,

      border: `1px solid ${theme.colors.border}`,

      borderRadius: theme.radii.md,

      padding: '10px 14px',

      outline: 'none',

      transition: 'border-color 0.15s, box-shadow 0.15s',

      background: theme.colors.bg,

    },

    buttonGroup: {

      display: 'flex',

      gap: '8px',

      // On small screens, force the button group to a new line

      flex: isSmallScreen ? '1 0 100%' : 'none',

      justifyContent: isSmallScreen ? 'flex-end' : 'initial',

    },

    toggleBtn: {

      ...resetButton,

      fontSize: theme.fontSizes.sm,

      fontWeight: 500,

      padding: '6px 14px',

      borderRadius: theme.radii.sm,

      color: theme.colors.textSecondary,

      background: theme.colors.bgSecondary,

      border: `1px solid ${theme.colors.border}`,

      transition: 'all 0.15s',

      whiteSpace: 'nowrap',

    },

    toggleBtnActive: {

      background: theme.colors.primaryLight,

      color: theme.colors.primary,

      borderColor: theme.colors.primary,

    },

  }

  const onClickHandler = (type) => {
        setSearchType((prev)=>{
        return type
      });
   
    }

  function triggerSearch() {
    if (!query?.current?.trim()) return
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    onSearch()
  }

  function handleChange(e) {
    query.current = e.target.value
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    if (query.current.trim() !== '') {
      timeoutIdRef.current = setTimeout(triggerSearch, 2000)
    }
  }


  return (

    <form style={styles.wrapper}>

      <input

        type="text"

        placeholder={searchType === 'user' ? 'Enter GitHub username...' : 'Search repositories...'}

        onChange={handleChange}

        style={styles.input}

        aria-label={searchType === 'user' ? 'GitHub username' : 'Repository search'}

      />

     

      <div style={styles.buttonGroup}>

        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(searchType === 'user' ? styles.toggleBtnActive : {}) }}
          onClick={() =>{onClickHandler("user")}}
        >
          User
        </button>



        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(searchType === 'repo' ? styles.toggleBtnActive : {}) }}
          onClick={()=>{onClickHandler("repo")}}
        >
          Repo
        </button>

      </div>

    </form>

  )

}