import { useMemo } from 'react'
import { theme, card } from '../styles'

const LANG_COLORS = {
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

const styles = {
  card: {
    ...card,
    padding: '20px',
    marginTop: '24px',
    textAlign: 'left',
  },
  title: {
    fontSize: theme.fontSizes.base,
    fontWeight: 600,
    color: theme.colors.text,
    margin: '0 0 16px 0',
  },
  bar: {
    display: 'flex',
    height: 8,
    borderRadius: theme.radii.full,
    overflow: 'hidden',
    marginBottom: '14px',
  },
  barSegment: {
    height: '100%',
    transition: 'width 0.3s',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px 18px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  legendCount: {
    color: theme.colors.textMuted,
  },
}

export default function LanguageChart({ repos }) {
  const languages = useMemo(() => {
    const counts = {}
    repos.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1
      }
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    if (total === 0) return []
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)
  }, [repos])

  if (!languages.length) return null

  return (
    <div style={styles.card}>
      <h4 style={styles.title}>Languages</h4>
      <div style={styles.bar}>
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              ...styles.barSegment,
              width: `${lang.pct}%`,
              background: LANG_COLORS[lang.name] || '#6b7280',
            }}
          />
        ))}
      </div>
      <div style={styles.legend}>
        {languages.map((lang) => (
          <div key={lang.name} style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: LANG_COLORS[lang.name] || '#6b7280' }} />
            {lang.name}
            <span style={styles.legendCount}>({lang.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
