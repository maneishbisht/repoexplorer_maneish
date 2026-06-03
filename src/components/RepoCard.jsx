import { useState,memo} from 'react'
import { theme, card, resetButton } from '../styles'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function languageColor(lang) {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
  }
  return colors[lang] || '#6b7280'
}

const styles = {
  card: {
    ...card,
    textAlign: 'left',
    display: 'flex',          // Added to manage vertical stacking
    flexDirection: 'column',  // Ensures children stack vertically
    transition: 'box-shadow 0.15s',
    padding: 0,
  },
  mainRow: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '16px 20px',
    width: '100%',            // Ensures it respects container width
    boxSizing: 'border-box',  // Prevents padding from breaking width
  },
  headerLeft: {
    display: 'flex',
    gap: '14px',
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '2px',
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  repoName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 600,
    color: theme.colors.primary,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    margin: '4px 0 0 0',
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textMuted,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },
  starCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },
  expandBtn: {
    ...resetButton,
    marginLeft: '12px',
    marginTop: '2px',
    flexShrink: 0,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textMuted,
    padding: '4px 8px',
    borderRadius: theme.radii.sm,
    transition: 'all 0.15s',
    lineHeight: 1,
  },
  expandedContent: {
    borderTop: `1px solid ${theme.colors.border}`,
    padding: '12px 20px 16px',
    display: 'flex',
    flexDirection: 'column', // Changed to column to stack labels vertically
    gap: '8px',              // Added gap for spacing
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  expandedItem: {
    display: 'flex',
    gap: '8px',
  },
  expandedLabel: {
    color: theme.colors.textMuted,
    width: '60px',           // Fixed width for alignment
  },
  expandedValue: {
    color: theme.colors.textSecondary,
    fontWeight: 500,
  },
}

const RepoCard = ({ repo, showOwner }) =>{
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={styles.card}>
      <div style={styles.mainRow}>
        <div style={styles.headerLeft}>
          {showOwner && repo.owner?.avatar_url && (
            <img
              src={repo.owner.avatar_url}
              alt="owner avatar"
              style={styles.ownerAvatar}
            />
          )}
          <div style={styles.headerContent}>
            <h3 style={styles.repoName}>{repo.name}</h3>
            {repo.description && (
              <p style={styles.description}>{repo.description}</p>
            )}
            <div style={styles.meta}>
              {repo.language && (
                <span style={styles.metaItem}>
                  <span style={{ ...styles.langDot, background: languageColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              <span style={styles.metaItem}>
                <span style={styles.starCount}>&#9733; {repo.stargazers_count}</span>
              </span>
              <span style={styles.metaItem}>
                Updated {formatDate(repo.updated_at)}
              </span>
            </div>
          </div>
        </div>
        <button
          style={styles.expandBtn}
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
        >
          {expanded ? '\u25B2' : '\u25BC'}
        </button>
      </div>
      {expanded && (
        <div style={styles.expandedContent}>
          {repo.default_branch && (
            <span style={styles.expandedItem}>
              <span style={styles.expandedLabel}>Branch:</span>
              <span style={styles.expandedValue}>{repo.default_branch}</span>
            </span>
          )}
          {typeof repo.forks_count === 'number' && (
            <span style={styles.expandedItem}>
              <span style={styles.expandedLabel}>Forks:</span>
              <span style={styles.expandedValue}>{repo.forks_count.toLocaleString()}</span>
            </span>
          )}
          {typeof repo.open_issues_count === 'number' && (
            <span style={styles.expandedItem}>
              <span style={styles.expandedLabel}>Issues:</span>
              <span style={styles.expandedValue}>{repo.open_issues_count}</span>
            </span>
          )}
          {typeof repo.watchers_count === 'number' && (
            <span style={styles.expandedItem}>
              <span style={styles.expandedLabel}>Watchers:</span>
              <span style={styles.expandedValue}>{repo.watchers_count.toLocaleString()}</span>
            </span>
          )}
          {repo.license?.spdx_id && (
            <span style={styles.expandedItem}>
              <span style={styles.expandedLabel}>License:</span>
              <span style={styles.expandedValue}>{repo.license.spdx_id}</span>
            </span>
          )}
          {repo.created_at && (
            <span style={styles.expandedItem}>
              <span style={styles.expandedLabel}>Created:</span>
              <span style={styles.expandedValue}>{formatDate(repo.created_at)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(RepoCard)