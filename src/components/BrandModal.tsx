import { useEffect, useRef, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Check, Flag, Sparkles, Star, Volume2, X } from 'lucide-react'
import { countryById } from '../data/countries'
import { useBodyLock } from '../hooks/useBodyLock'
import { audio } from '../lib/audio'
import { celebrate } from '../lib/celebrate'
import { STARS_PER_BRAND, useApp } from '../state/AppContext'
import type { Brand } from '../types'
import { BrandLogo } from './BrandLogo'
import { Button } from './Button'
import styles from './BrandModal.module.scss'

interface BrandModalProps {
  brand: Brand | null
  onClose: () => void
}

export function BrandModal({ brand, onClose }: BrandModalProps) {
  const { learnedSet, learnBrand } = useApp()
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  useBodyLock(Boolean(brand))

  useEffect(() => {
    if (!brand) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const timer = window.setTimeout(() => closeRef.current?.focus(), 80)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [brand, onClose])

  const learned = brand ? learnedSet.has(brand.id) : false
  const country = brand ? countryById[brand.country] : null

  const handleLearn = () => {
    if (!brand || learned) return
    learnBrand(brand.id)
    audio.play('star')
    celebrate(false)
  }

  return createPortal(
    <AnimatePresence>
      {brand && country && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={dialogRef}
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`brand-modal-${brand.id}`}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{ '--accent': brand.accent } as CSSProperties}
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Закрыть карточку"
            >
              <X size={19} strokeWidth={2.2} aria-hidden="true" />
            </button>

            <div className={styles.visual}>
              <span className={styles.orbitOne} aria-hidden="true" />
              <span className={styles.orbitTwo} aria-hidden="true" />
              <span className={styles.sparkOne} aria-hidden="true">
                <Star size={14} fill="currentColor" />
              </span>
              <span className={styles.sparkTwo} aria-hidden="true">
                <Sparkles size={20} />
              </span>

              <div className={styles.visualTop}>
                <span className={styles.countryPill}>
                  {country.flag} {country.name}
                </span>
                <span className={styles.sincePill}>с {brand.since}</span>
              </div>

              <motion.div
                className={styles.logoStage}
                initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 0.08, type: 'spring', stiffness: 240, damping: 18 }}
              >
                <BrandLogo brand={brand} size={156} className={styles.logo} />
              </motion.div>

              <div className={styles.visualBottom}>
                <span className={styles.hint}>Логотип бренда</span>
                <span className={styles.starHint}>
                  <Star size={13} fill="currentColor" aria-hidden="true" /> +{STARS_PER_BRAND} звёзд
                </span>
              </div>
            </div>

            <div className={styles.content}>
              <span className={styles.eyebrow}>
                <Flag size={13} aria-hidden="true" /> {country.name} · {brand.tagline}
              </span>
              <h2 id={`brand-modal-${brand.id}`} className={styles.title}>
                {brand.name}
              </h2>
              <p className={styles.nameRu}>{brand.nameRu}</p>

              <div className={styles.fact}>
                <span className={styles.factIcon} aria-hidden="true">
                  <Sparkles size={18} />
                </span>
                <div>
                  <span className={styles.factLabel}>Интересный факт</span>
                  <p>{brand.fact}</p>
                </div>
              </div>

              <div className={styles.meta}>
                <span>
                  <Flag size={14} aria-hidden="true" /> {country.name}
                </span>
                <span>
                  <CalendarDays size={14} aria-hidden="true" /> основан в {brand.since}
                </span>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    audio.speak(brand.name)
                  }}
                  icon={<Volume2 size={17} />}
                  iconPosition="left"
                >
                  Послушать
                </Button>
                <Button
                  onClick={handleLearn}
                  disabled={learned}
                  icon={
                    learned ? <Check size={18} strokeWidth={3} /> : <Star size={17} fill="currentColor" />
                  }
                  iconPosition="left"
                >
                  {learned ? 'Уже в коллекции' : `В коллекцию · +${STARS_PER_BRAND}`}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
