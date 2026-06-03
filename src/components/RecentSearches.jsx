import { theme, resetButton, card } from '../styles'

const styles = {
  container: {
    ...card,
    padding: '12px 16px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textMuted,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  list: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    flex: 1,
  },
  chip: {
    ...resetButton,
    fontSize: theme.fontSizes.xs,
    fontWeight: 500,
    padding: '4px 12px',
    borderRadius: theme.radii.full,
    background: theme.colors.bgSecondary,
    color: theme.colors.textSecondary,
    border: `1px solid ${theme.colors.border}`,
    transition: 'all 0.15s',
  },
  clearBtn: {
    ...resetButton,
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textMuted,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  empty: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textMuted,
  },
}

export default function RecentSearches({query,searches, onSelect, onClear }) {
  if (!searches.length) return null

  return (
    <div style={styles.container}>
      <span style={styles.label}>Recent</span>
      <div style={styles.list}>
        {searches.map((text) => (
          <button
            key={text}
            style={styles.chip}
            onClick={() => {console.log("clicked"); query.current = text;onSelect(text)}}
          >
            {text}
          </button>
        ))}
      </div>
      <button style={styles.clearBtn} onClick={onClear}>
        Clear
      </button>
    </div>
  )
}
