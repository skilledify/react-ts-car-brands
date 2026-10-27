import { Heart, Sparkles } from 'lucide-react'
import styles from './Footer.module.scss'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.badge}>
            <Sparkles size={14} aria-hidden="true" />
            2026
          </span>
          <p className={styles.copy}>
            TURBO GARAGE — образовательная игра для юных чемпионов
          </p>
        </div>

        <p className={styles.legal}>
          Логотипы принадлежат их правообладателям и используются в некоммерческих
          образовательных целях. Оформление вдохновлено ливреей Mercedes-AMG Petronas Formula One
          Team. Фото Mercedes-AMG C204 DTM:{' '}
          <a
            className={styles.creditLink}
            href="https://commons.wikimedia.org/wiki/File:AMG_Mercedes-Benz_C204_(DTM).jpg"
            target="_blank"
            rel="noreferrer"
          >
            Stefan Krause, CC BY-SA 3.0
          </a>
          .
        </p>

        <p className={styles.made}>
          Сделано с <Heart size={13} fill="currentColor" aria-hidden="true" /> для детей 5+
        </p>
      </div>
    </footer>
  )
}
