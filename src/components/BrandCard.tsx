import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { countryById } from '../data/countries'
import type { Brand } from '../types'
import { BrandLogo } from './BrandLogo'
import styles from './BrandCard.module.scss'

interface BrandCardProps {
  brand: Brand
  learned: boolean
  index?: number
  onOpen: (brand: Brand) => void
}

export function BrandCard({ brand, learned, index = 0, onOpen }: BrandCardProps) {
  const country = countryById[brand.country]

  return (
    <motion.button
      type="button"
      className={`${styles.card} ${learned ? styles.learned : ''}`}
      style={{ '--accent': brand.accent } as CSSProperties}
      onClick={() => onOpen(brand)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      layout
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.035, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      aria-label={`${brand.name}. ${learned ? 'Уже в коллекции' : 'Открыть карточку бренда'}`}
    >
      <span className={styles.aura} aria-hidden="true" />
      <span className={styles.tile}>
        <span className={styles.ghostLogo} aria-hidden="true">
          <BrandLogo brand={brand} size="82%" />
        </span>
        <BrandLogo brand={brand} size={78} className={styles.logo} />
        <span className={styles.flag} title={country.name}>
          {country.flag}
        </span>
        {learned && (
          <motion.span
            className={styles.learnedBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            <Check size={13} strokeWidth={3} aria-hidden="true" />
          </motion.span>
        )}
      </span>

      <span className={styles.body}>
        <span className={styles.country}>
          {country.name} · с {brand.since}
        </span>
        <span className={styles.titleRow}>
          <span className={styles.title}>{brand.name}</span>
          <span className={styles.nameRu}>{brand.nameRu}</span>
        </span>
        <span className={styles.tagline}>{brand.tagline}</span>
      </span>

      <span className={styles.footer}>
        <span className={styles.status}>
          {learned ? 'В коллекции' : 'Узнать бренд'}
        </span>
        <span className={styles.arrow}>
          <ArrowUpRight size={16} strokeWidth={2.3} aria-hidden="true" />
        </span>
      </span>
    </motion.button>
  )
}
