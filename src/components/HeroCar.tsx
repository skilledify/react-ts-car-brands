import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { audio } from '../lib/audio'
import heroCar from '../assets/mercedes-dtm-hero.webp'
import styles from './HeroCar.module.scss'

interface HeroCarProps {
  onRev?: () => void
}

export function HeroCar({ onRev }: HeroCarProps) {
  const [revving, setRevving] = useState(false)
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [])

  const handleRev = () => {
    setRevving(true)
    audio.play('rev')
    onRev?.()
    if (timeout.current) window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => setRevving(false), 900)
  }

  return (
    <div className={styles.stage}>
      <div className={styles.speedField} aria-hidden="true">
        <span className={styles.streakOne} />
        <span className={styles.streakTwo} />
        <span className={styles.streakThree} />
        <span className={styles.streakFour} />
      </div>
      <div className={styles.ring} aria-hidden="true" />
      <div className={styles.ringInner} aria-hidden="true" />

      <motion.button
        type="button"
        className={styles.carButton}
        onClick={handleRev}
        aria-label="Нажми на машину, чтобы завести мотор"
        animate={
          revving
            ? { x: [0, 13, -4, 8, 0], y: [0, -3, 1, 0], rotate: [0, -0.7, 0.5, 0] }
            : { y: [0, -8, 0] }
        }
        transition={
          revving
            ? { duration: 0.5, ease: 'easeOut' }
            : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
        }
        whileHover={{ scale: 1.012 }}
        whileTap={{ scale: 0.985 }}
      >
        <span className={styles.carPhotoWrap}>
          <img
            className={styles.carPhoto}
            src={heroCar}
            alt="Mercedes-AMG C204 DTM, вид спереди"
            draggable={false}
          />
          <span className={styles.photoVignette} aria-hidden="true" />
          <span className={styles.photoBadge} aria-hidden="true">
            <i />
            Mercedes-AMG · DTM
          </span>
        </span>
      </motion.button>

      <motion.span
        className={styles.vroom}
        initial={false}
        animate={revving ? { opacity: 1, scale: 1, y: 0, rotate: -5 } : { opacity: 0, scale: 0.7, y: 8 }}
        transition={{ duration: 0.18 }}
        aria-hidden="true"
      >
        VROOM!
      </motion.span>

      <div className={styles.hintPill}>
        <span className={styles.pulseDot} aria-hidden="true" />
        Нажми на машину — заведём мотор!
      </div>
    </div>
  )
}
