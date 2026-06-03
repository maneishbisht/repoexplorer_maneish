import { theme, card } from '../styles'

const styles = {
  card: {
    ...card,
    display: 'flex',
    gap: '24px',
    padding: '24px',
    textAlign: 'left',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: theme.radii.full,
    border: `2px solid ${theme.colors.borderLight}`,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 700,
    color: theme.colors.text,
    margin: 0,
  },
  login: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
    margin: '2px 0 0 0',
  },
  bio: {
    fontSize: theme.fontSizes.base,
    color: theme.colors.textSecondary,
    margin: '10px 0 0 0',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  stats: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    flexShrink: 0,
  },
  statValue: {
    fontWeight: 600,
    color: theme.colors.text,
  },
}

export default function UserProfile({ user }) {
  if (!user) return null

  return (
    <div style={styles.card}>
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        style={styles.avatar}
      />
      <div style={styles.info}>
        <h2 style={styles.name}>{user.name || user.login}</h2>
        <p style={styles.login}>@{user.login}</p>
        {user.bio && <p style={styles.bio}>{user.bio}</p>}
        <div style={styles.stats}>
          <span style={styles.stat}>
            <strong style={styles.statValue}>{user.public_repos}</strong> repos
          </span>
          <span style={styles.stat}>
            <strong style={styles.statValue}>{user.followers}</strong> followers
          </span>
          <span style={styles.stat}>
            <strong style={styles.statValue}>{user.following}</strong> following
          </span>
        </div>
      </div>
    </div>
  )
}
