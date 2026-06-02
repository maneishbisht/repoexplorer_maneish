import { useEffect, useRef, useState } from 'react'
import { theme, resetButton } from '../styles'

const styles = {
  wrapper: {
    display: 'flex',
    gap: '8px',
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
    alignItems: 'stretch',
  },
  input: {
    flex: 1,
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
  searchBtn: {
    ...resetButton,
    background: theme.colors.primary,
    color: '#fff',
    fontSize: theme.fontSizes.base,
    fontWeight: 500,
    padding: '10px 20px',
    borderRadius: theme.radii.md,
    whiteSpace: 'nowrap',
    transition: 'background 0.15s',
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

export default function SearchBar({ onSearch, searchTypeSetter}) {
  const [searchtype, setSearchtype] = useState('repo')
  const textRef = useRef('')
  const timeoutIdRef = useRef(null)
  const inputElRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
    }
  }, [])


  function handleChange(e) {
    textRef.current = e.target.value

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }

    if(textRef.current.trim() !== '') {
      timeoutIdRef.current = setTimeout(() => {
      onSearch(textRef.current.trim(), searchtype)

      }, 2000)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = null
    }
    if (textRef.current.trim()) {
      onSearch(textRef.current.trim(), searchtype)
    }
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
      <button
        type="button"
        style={{ ...styles.toggleBtn, ...(searchtype === 'user' ? styles.toggleBtnActive : {}) }}
        onClick={() => {searchTypeSetter('user');setSearchtype('user')}}
      >
        User
      </button>
      <button
        type="button"
        style={{ ...styles.toggleBtn, ...(searchtype === 'repo' ? styles.toggleBtnActive : {}) }}
        onClick={() => {searchTypeSetter('repo');setSearchtype('repo')}}
      >
        Repo
      </button>
      <button type="submit" style={styles.searchBtn} onClick={() =>{onSearch(textRef.current,searchtype);}}>
        Search
      </button>
    </form>
  )
}
