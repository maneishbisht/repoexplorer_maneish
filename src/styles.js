export const theme = {
  colors: {
    display : 'flex',
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#eef2ff',
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    bg: '#ffffff',
    bgSecondary: '#f8fafc',
    bgCard: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    error: '#ef4444',
    errorBg: '#fef2f2',
    success: '#22c55e',
    star: '#f59e0b',
    shadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
    shadowMd: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
    skeleton: '#e2e8f0',
    skeletonShine: '#f1f5f9',
  },
  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  fontSizes: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
}

export const resetButton = {
  fontFamily: 'inherit',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
}

export const inputBase = {
  fontFamily: 'inherit',
  fontSize: theme.fontSizes.base,
  color: theme.colors.text,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radii.md,
  padding: '10px 14px',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  '::placeholder': {
    color: theme.colors.textMuted,
  },
}

export const card = {
  background: theme.colors.bgCard,
  border: `1px solid ${theme.colors.border}`,
  display : 'flex',
  borderRadius: theme.radii.lg,
  boxShadow: theme.colors.shadow,
}
