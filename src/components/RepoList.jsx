import { theme, resetButton, card } from '../styles'
import RepoCard from './RepoCard'

const styles = {
  section: {
    marginTop: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 600,
    color: theme.colors.text,
    margin: 0,
  },
  sortGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sortLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
  },
  sortBtn: {
    ...resetButton,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: theme.radii.sm,
    color: theme.colors.textSecondary,
    background: theme.colors.bgSecondary,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.15s',
  },
  sortBtnActive: {
    background: theme.colors.primaryLight,
    color: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  loadMoreWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '16px',
  },
  loadMoreBtn: {
    ...resetButton,
    ...card,
    padding: '10px 32px',
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    color: theme.colors.primary,
    transition: 'all 0.15s',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 0',
    color: theme.colors.textMuted,
    fontSize: theme.fontSizes.sm,
  },
}

const SORT_OPTIONS = [
  { key: 'stars', label: 'Stars' },
  { key: 'name', label: 'Name' },
  { key: 'updated', label: 'Updated' },
]


export default function RepoList({ repos, sortBy, onSortChange, onLoadMore, hasMore, loadingMore, showOwner }) {
  if (!repos.length) return null

  return (
    <div style={styles.section}>
      <div style={styles.header}>
        <h3 style={styles.title}>Repositories ({repos.length})</h3>
        <div style={styles.sortGroup}>
          <span style={styles.sortLabel}>Sort by:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              style={{ ...styles.sortBtn, ...(sortBy === opt.key ? styles.sortBtnActive : {}) }}
              onClick={() => onSortChange(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.list}>
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} showOwner={showOwner} />
        ))}
      </div>
      {hasMore && (
        <div style={styles.loadMoreWrapper}>
          <button
            style={styles.loadMoreBtn}
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}