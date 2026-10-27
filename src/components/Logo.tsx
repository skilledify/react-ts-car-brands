import styles from './Logo.module.scss'

interface LogoProps {
  onClick?: () => void
  compact?: boolean
}

export function Logo({ onClick, compact = false }: LogoProps) {
  return (
    <button
      type="button"
      className={`${styles.logo} ${compact ? styles.compact : ''}`}
      onClick={onClick}
      aria-label="TURBO GARAGE — на главную"
    >
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 48 48" role="presentation">
          <defs>
            <linearGradient id="logo-teal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8bfff0" />
              <stop offset="52%" stopColor="#2ef2d6" />
              <stop offset="100%" stopColor="#00a999" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="46" height="46" rx="14" className={styles.markBg} />
          <circle cx="24" cy="24" r="14.4" className={styles.markRing} />
          <path d="M24 7.2V24m0 0 10.8 7.4M24 24 13.2 31.4" className={styles.markStar} />
          <circle cx="24" cy="24" r="1.5" fill="url(#logo-teal)" />
          <path d="M8 40.5h9" className={styles.markSpeed} />
        </svg>
      </span>
      <span className={styles.wordmark}>
        <span className={styles.name}>
          TURBO<span>GARAGE</span>
        </span>
        {!compact && <span className={styles.sub}>автоакадемия · 5+</span>}
      </span>
    </button>
  )
}
