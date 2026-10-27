import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CarFront, Globe2, MousePointerClick, Star } from 'lucide-react'
import { BrandCard } from '../components/BrandCard'
import { BrandModal } from '../components/BrandModal'
import { ProgressRing } from '../components/ProgressRing'
import { brands } from '../data/brands'
import { countries } from '../data/countries'
import { audio } from '../lib/audio'
import { useApp } from '../state/AppContext'
import type { Brand, CountryId } from '../types'
import styles from './GaragePage.module.scss'

type Filter = CountryId | 'all'

export function GaragePage() {
  const { learnedSet, learnedCount, progressPercent, progress } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const filtered = useMemo(
    () => (filter === 'all' ? brands : brands.filter((brand) => brand.country === filter)),
    [filter],
  )

  const countFor = (id: CountryId) => brands.filter((brand) => brand.country === id).length

  return (
    <div className={styles.page}>
      <section className={styles.pageHead}>
        <div className={styles.headCopy}>
          <span className={styles.eyebrow}>
            <CarFront size={13} aria-hidden="true" /> Гараж
          </span>
          <h1>
            Все <span>бренды</span>
          </h1>
          <p>
            Открывай карточки, слушай названия и запоминай логотипы. За каждый новый бренд — 5
            звёзд в копилку!
          </p>
          <div className={styles.tip}>
            <MousePointerClick size={15} aria-hidden="true" />
            Нажми на карточку, чтобы узнать интересный факт
          </div>
        </div>

        <div className={styles.progressCard}>
          <ProgressRing value={progressPercent} size={116} stroke={7} caption="коллекция" />
          <div className={styles.progressText}>
            <span className={styles.progressLabel}>Открыто брендов</span>
            <strong>
              {learnedCount} <small>/ {brands.length}</small>
            </strong>
            <span className={styles.starsLine}>
              <Star size={14} fill="currentColor" aria-hidden="true" />
              {progress.stars} звёзд
            </span>
            <div className={styles.miniBar} aria-hidden="true">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className={styles.filterBar}>
        <div className={styles.chips} role="group" aria-label="Фильтр по странам">
          <button
            type="button"
            className={`${styles.chip} ${filter === 'all' ? styles.chipActive : ''}`}
            onClick={() => {
              audio.play('click')
              setFilter('all')
            }}
            aria-pressed={filter === 'all'}
          >
            <Globe2 size={15} aria-hidden="true" />
            <span>Все</span>
            <i>{brands.length}</i>
          </button>
          {countries.map((country) => (
            <button
              key={country.id}
              type="button"
              className={`${styles.chip} ${filter === country.id ? styles.chipActive : ''}`}
              onClick={() => {
                audio.play('click')
                setFilter(country.id)
              }}
              aria-pressed={filter === country.id}
            >
              <span className={styles.chipFlag}>{country.flag}</span>
              <span>{country.name}</span>
              <i>{countFor(country.id)}</i>
            </button>
          ))}
        </div>
        <span className={styles.resultCount}>
          {filtered.length} {filtered.length === 1 ? 'бренд' : 'брендов'}
        </span>
      </div>

      <motion.div className={styles.grid} layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((brand, index) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              index={index}
              learned={learnedSet.has(brand.id)}
              onOpen={(nextBrand) => {
                audio.play('click')
                setSelectedBrand(nextBrand)
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <BrandModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  )
}
