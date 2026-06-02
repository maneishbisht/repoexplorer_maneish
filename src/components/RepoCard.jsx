import { theme, card } from '../styles'

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
    overflow: 'hidden',
    transition: 'box-shadow 0.15s',
    padding: '16px 20px', // Added padding to the card instead of the header button
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
}

export default function RepoCard({ repo, showOwner }) {
  return (
    <div style={styles.card}>
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
    </div>
  )
}