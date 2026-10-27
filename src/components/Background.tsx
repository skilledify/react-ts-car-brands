import styles from './Background.module.scss'

export function Background() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.glowOne} />
      <div className={styles.glowTwo} />
      <div className={styles.beam} />
      <div className={styles.vignette} />
    </div>
  )
}
