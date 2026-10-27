import logoMark from '../assets/mercedes-dtm-logo.webp'
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
        <img className={styles.markImage} src={logoMark} alt="" draggable={false} />
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
