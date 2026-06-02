import { useCallback, useEffect, useState } from 'react'
import { useGitHubUser } from './hooks/useGitHubUser'
import { theme } from './styles'
import SearchBar from './components/SearchBar'
import UserProfile from './components/UserProfile'
import RepoList from './components/RepoList'
import LanguageChart from './components/LanguageChart'
import RecentSearches from './components/RecentSearches'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'

const STORAGE_KEY = 'repoexplorer_recent'

function loadRecent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(searches) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, 10)))
  } catch { /* ignore */ }
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '32px 20px',
    textAlign: 'left',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: 700,
    color: theme.colors.text,
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textSecondary,
    margin: 0,
  },
  content: {
    marginTop: '24px',
  },
}

export default function App() {
  const {
    user,repos,loading, error, sortBy, setSortBy,
    loadMore, hasMore, loadingMore, search, clearError,
  } = useGitHubUser(true)

  const [searchType, setSearchType] = useState('repo')
  const [recent, setRecent] = useState(loadRecent)

  useEffect(() => {
    saveRecent(recent)
  }, [recent])


  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>RepoExplorer</h1>
        <p style={styles.subtitle}>Explore GitHub profiles and repositories</p>
      </header>

      <SearchBar onSearch = {search} searchTypeSetter = {setSearchType}/>
      <RecentSearches
        searches={recent}
        onSelect={(val) => {
          const [mode, ...rest] = val.split(':')
          handleSearch(rest.join(':'), mode)
        }}
        onClear={() => setRecent([])}
      />

      <div style={styles.content}>
        {error && (
          <ErrorMessage error={error} onDismiss={clearError} />
        )}

        {loading && <LoadingSpinner message="Fetching data..." />}

        {user && !loading && (
          <>
            <UserProfile user={user} />
            <LanguageChart repos={repos} />
          </>
        )}

        {repos.length > 0 && !loading && (
          <RepoList
            repos={repos}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onLoadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
            showOwner={searchType === 'repo'}
          />
        )}
      </div>
    </div>
  )
}
