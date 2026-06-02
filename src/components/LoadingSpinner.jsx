import { theme } from '../styles'

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
    gap: '16px',
  },
  spinner: {
    width: 36,
    height: 36,
    border: `3px solid ${theme.colors.border}`,
    borderTopColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  text: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
  },
}

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner} />
      <span style={styles.text}>{message}</span>
    </div>
  )
}
