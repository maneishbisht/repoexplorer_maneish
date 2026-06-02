import { theme, resetButton } from '../styles'

const styles = {
  container: {
    background: theme.colors.errorBg,
    border: `1px solid ${theme.colors.error}20`,
    borderRadius: theme.radii.lg,
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  icon: {
    fontSize: '20px',
    flexShrink: 0,
    lineHeight: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    color: theme.colors.error,
    fontSize: theme.fontSizes.base,
    fontWeight: 600,
    margin: 0,
  },
  message: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    margin: '4px 0 0 0',
    lineHeight: 1.5,
  },
  dismiss: {
    ...resetButton,
    background: 'transparent',
    color: theme.colors.textMuted,
    fontSize: '18px',
    lineHeight: 1,
    padding: '2px 6px',
    borderRadius: theme.radii.sm,
  },
}

export default function ErrorMessage({ error, onDismiss }) {
  const title = error?.code === 'NOT_FOUND'
    ? 'User not found'
    : error?.code === 'RATE_LIMITED'
      ? 'Rate limit reached'
      : 'Something went wrong'

  const message = error?.code === 'NOT_FOUND'
    ? 'The GitHub username you entered does not exist. Please check and try again.'
    : error?.code === 'RATE_LIMITED'
      ? 'GitHub API rate limit has been reached. Please wait a moment and try again.'
      : error?.message || 'An unexpected error occurred. Please try again.'

  return (
    <div style={styles.container} role="alert">
      <span style={styles.icon}>&#9888;</span>
      <div style={styles.content}>
        <p style={styles.title}>{title}</p>
        <p style={styles.message}>{message}</p>
      </div>
      {onDismiss && (
        <button style={styles.dismiss} onClick={onDismiss} aria-label="Dismiss error">
          &times;
        </button>
      )}
    </div>
  )
}
