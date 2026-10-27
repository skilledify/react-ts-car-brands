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
            <linearGradient id="logo-car" x1="0" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#f8fcfb" />
              <stop offset="38%" stopColor="#d3dedd" />
              <stop offset="100%" stopColor="#7e9295" />
            </linearGradient>
            <linearGradient id="logo-teal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8bfff0" />
              <stop offset="52%" stopColor="#2ef2d6" />
              <stop offset="100%" stopColor="#00a999" />
            </linearGradient>
            <radialGradient id="logo-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d2be" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#00d2be" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="1" y="1" width="46" height="46" rx="14" className={styles.markBg} />
          <ellipse cx="26" cy="30" rx="19" ry="9" fill="url(#logo-glow)" />
          <path d="M3 24.2h6M1.8 28.2h5" className={styles.markSpeed} />
          <path d="M9 38.8h30" className={styles.markRoad} />

          {/* Силуэт дорожной машины */}
          <path
            className={styles.markCar}
            d="M7.5 32.3c0-1.6 1.1-3 2.7-3.4l5.2-1.1c1.7-3.6 5-6 8.9-6.5 1.1-.2 2.3-.3 3.5-.3h4.5c2.7 0 5.3 1.2 7.1 3.3l2.3 2.7 1.8.4c1 .2 1.6 1.1 1.6 2.1v3.7c0 1.5-1.2 2.7-2.7 2.7H10.4c-1.6 0-2.9-1.3-2.9-2.9z"
          />

          {/* Остекление */}
          <path
            className={styles.markGlass}
            d="M19 26.8c1.5-2.6 4.2-4.3 7.4-4.5l1.9-.1v4.6z"
          />
          <path className={styles.markGlass} d="M30.2 22h2.2c2.2 0 4.2 1.1 5.4 2.9l.9 1.4h-8.5z" />
          <path className={styles.markPillar} d="M28.3 22h1.9v4.8h-1.9z" />

          {/* Детали и акценты */}
          <path className={styles.markRoof} d="M28.3 21.4c2.8 0 5.4 1 7.4 2.7" />
          <path className={styles.markAccent} d="M10.8 30.6c9.5.8 19.3.8 28.4-.2" />
          <path className={styles.markLight} d="M9.2 28.5l3.4.3M41 28.8c1.2.1 2.4.4 3.5.8" />
          <path className={styles.markHandle} d="M25.4 29.3h3.4" />
          <path
            className={styles.markMirror}
            d="M34.7 25.9c1.1-.5 2.3-.5 3.1 0l-.4 1.1c-.7-.1-1.3 0-1.8.4z"
          />

          {/* Колёса */}
          <circle cx="16.1" cy="35.1" r="3.4" className={styles.markWheel} />
          <circle cx="36.3" cy="35.1" r="3.4" className={styles.markWheel} />
          <circle cx="16.1" cy="35.1" r="1.25" className={styles.markWheelCore} />
          <circle cx="36.3" cy="35.1" r="1.25" className={styles.markWheelCore} />
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
