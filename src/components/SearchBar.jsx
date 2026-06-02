import { useEffect, useRef, useState } from 'react'

import { theme, resetButton } from '../styles'



export default function SearchBar({ onSearch, searchTypeSetter }) {

  const [searchtype, setSearchtype] = useState('repo')

  const [isSmallScreen, setIsSmallScreen] = useState(false)

  const textRef = useRef('')

  const timeoutIdRef = useRef(null)

  const inputElRef = useRef(null)



  // Detect screen size changes for responsive layout

  useEffect(() => {

    const handleResize = () => setIsSmallScreen(window.innerWidth < 500)

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {

      window.removeEventListener('resize', handleResize)

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)

    }

  }, [])



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



  function triggerSearch(type) {
    if (!textRef.current.trim()) return
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    onSearch(textRef.current.trim(), type ?? searchtype)
  }

  function handleChange(e) {
    textRef.current = e.target.value
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    if (textRef.current.trim() !== '') {
      timeoutIdRef.current = setTimeout(triggerSearch, 2000)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    triggerSearch()
  }



  return (

    <form style={styles.wrapper} onSubmit={handleSubmit}>

      <input

        ref={inputElRef}

        type="text"

        placeholder={searchtype === 'user' ? 'Enter GitHub username...' : 'Search repositories...'}

        onChange={handleChange}

        style={styles.input}

        aria-label={searchtype === 'user' ? 'GitHub username' : 'Repository search'}

      />

     

      <div style={styles.buttonGroup}>

        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(searchtype === 'user' ? styles.toggleBtnActive : {}) }}
          onClick={() => { searchTypeSetter('user'); setSearchtype('user'); triggerSearch('user') }}
        >
          User
        </button>
        <button
          type="button"
          style={{ ...styles.toggleBtn, ...(searchtype === 'repo' ? styles.toggleBtnActive : {}) }}
          onClick={() => { searchTypeSetter('repo'); setSearchtype('repo'); triggerSearch('repo') }}
        >
          Repo
        </button>

      </div>

    </form>

  )

}