import { useMemo, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CarFront,
  CircleHelp,
  Flag,
  Gauge,
  MapPin,
  Sparkles,
  Star,
  Timer,
  Trophy,
} from 'lucide-react'
import { BrandMark } from '../components/BrandLogo'
import { BrandModal } from '../components/BrandModal'
import { Button } from '../components/Button'
import { HeroCar } from '../components/HeroCar'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { ProgressRing } from '../components/ProgressRing'
import { brands } from '../data/brands'
import { countries, countryById } from '../data/countries'
import { audio } from '../lib/audio'
import { formatSeconds } from '../lib/format'
import { useApp } from '../state/AppContext'
import type { Brand } from '../types'
import styles from './HomePage.module.scss'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
}

const modes = [
  {
    path: '/garage',
    index: '01',
    title: 'Гараж',
    description: 'Открывай карточки брендов и собирай звёзды',
    icon: CarFront,
    accent: '#00d2be',
  },
  {
    path: '/quiz',
    index: '02',
    title: 'Викторина',
    description: 'Угадай бренд по логотипу за 10 вопросов',
    icon: CircleHelp,
    accent: '#ffd166',
  },
  {
    path: '/race',
    index: '03',
    title: 'Пит-стоп',
    description: 'Найди пары «логотип — название» на время',
    icon: Flag,
    accent: '#ff5ca8',
  },
  {
    path: '/collection',
    index: '04',
    title: 'Коллекция',
    description: 'Смотри прогресс, призы и открытые марки',
    icon: Trophy,
    accent: '#8a5cff',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const { progress, learnedSet, learnedCount, progressPercent } = useApp()
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  const brandOfDay = useMemo(() => {
    const day = Math.floor(Date.now() / 86_400_000)
    return brands[day % brands.length]
  }, [])
  const dayCountry = countryById[brandOfDay.country]
  const dayLearned = learnedSet.has(brandOfDay.id)

  const openBrand = (brand: Brand) => {
    audio.play('click')
    setSelectedBrand(brand)
  }

  return (
    <div className={styles.page}>
      <motion.section className={styles.hero} variants={container} initial="hidden" animate="show">
        <div className={styles.heroCopy}>
          <motion.div variants={item} className={styles.seasonBadge}>
            <span className={styles.liveDot} aria-hidden="true" />
            Сезон 2026 · автоакадемия
          </motion.div>

          <motion.h1 variants={item} className={styles.title}>
            Стартуй
            <br />
            в мир
            <br />
            <span className={styles.titleAccent}>автобрендов</span>
          </motion.h1>

          <motion.p variants={item} className={styles.lead}>
            26 легендарных марок из 10 стран. Учись, играй и собирай звёзды вместе с командой
            TURBO GARAGE.
          </motion.p>

          <motion.div variants={item} className={styles.actions}>
            <Button
              size="lg"
              onClick={() => navigate('/garage')}
              icon={<CarFront size={19} />}
              iconPosition="left"
            >
              В гараж
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/quiz')}
              icon={<CircleHelp size={19} />}
              iconPosition="left"
            >
              Играть
            </Button>
          </motion.div>

          <motion.div variants={item} className={styles.miniStats}>
            <span>
              <Star size={14} fill="currentColor" aria-hidden="true" /> +5 звёзд за бренд
            </span>
            <span>
              <MapPin size={14} aria-hidden="true" /> 10 стран
            </span>
            <span>
              <Sparkles size={14} aria-hidden="true" /> 4 режима
            </span>
          </motion.div>

          <motion.div variants={item} className={styles.progressMini}>
            <ProgressRing value={progressPercent} size={72} stroke={5} />
            <div className={styles.progressCopy}>
              <span className={styles.progressLabel}>Твой прогресс</span>
              <strong>
                {learnedCount} из {brands.length} брендов
              </strong>
              <span className={styles.progressHint}>Продолжай — и соберёшь всю коллекцию!</span>
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className={styles.heroVisual}>
          <div className={styles.visualGlow} aria-hidden="true" />
          <HeroCar />

          <div className={`${styles.brandChip} ${styles.chipOne}`} aria-hidden="true">
            <BrandMark logo="ferrari" />
            <span>🇮🇹</span>
          </div>
          <div className={`${styles.brandChip} ${styles.chipTwo}`} aria-hidden="true">
            <BrandMark logo="bmw" />
            <span>🇩🇪</span>
          </div>
          <div className={`${styles.brandChip} ${styles.chipThree}`} aria-hidden="true">
            <BrandMark logo="porsche" />
            <span>🇩🇪</span>
          </div>
          <div className={`${styles.brandChip} ${styles.chipFour}`} aria-hidden="true">
            <BrandMark logo="toyota" />
            <span>🇯🇵</span>
          </div>

          <div className={styles.heroTag} aria-hidden="true">
            <span>GT</span>
            <span>2026</span>
          </div>
        </motion.div>
      </motion.section>

      <div className={styles.countryTicker} aria-label="Страны производителей">
        <div className={styles.tickerTrack} aria-hidden="true">
          {[0, 1].map((copy) => (
            <div className={styles.tickerGroup} key={copy}>
              {countries.map((country) => (
                <span key={`${copy}-${country.id}`} className={styles.tickerItem}>
                  <span>{country.flag}</span>
                  {country.name}
                  <i>•</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className={styles.statsStrip} aria-label="Твой прогресс">
        <div className={styles.statCard}>
          <span className={styles.statIcon} style={{ color: '#2ef2d6' }}>
            <CarFront size={19} aria-hidden="true" />
          </span>
          <div>
            <span className={styles.statLabel}>Изучено</span>
            <strong>
              <AnimatedNumber value={learnedCount} /> <small>/ {brands.length}</small>
            </strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon} style={{ color: '#ffd166' }}>
            <Star size={19} fill="currentColor" aria-hidden="true" />
          </span>
          <div>
            <span className={styles.statLabel}>Звёзды</span>
            <strong>
              <AnimatedNumber value={progress.stars} />
            </strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon} style={{ color: '#8a5cff' }}>
            <Trophy size={19} aria-hidden="true" />
          </span>
          <div>
            <span className={styles.statLabel}>Лучший квиз</span>
            <strong>
              <AnimatedNumber value={progress.quizBest} /> <small>/ 10</small>
            </strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon} style={{ color: '#ff5ca8' }}>
            <Timer size={19} aria-hidden="true" />
          </span>
          <div>
            <span className={styles.statLabel}>Лучший круг</span>
            <strong className={styles.timeValue}>{formatSeconds(progress.raceBest)}</strong>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>
              <Gauge size={13} aria-hidden="true" /> Выбери режим
            </span>
            <h2>Что будем делать?</h2>
          </div>
          <button type="button" className={styles.textLink} onClick={() => navigate('/garage')}>
            Все бренды <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.modesGrid}>
          {modes.map((mode, index) => {
            const Icon = mode.icon
            return (
              <motion.button
                key={mode.path}
                type="button"
                className={styles.modeCard}
                style={{ '--mode-accent': mode.accent } as CSSProperties}
                onClick={() => {
                  audio.play('click')
                  navigate(mode.path)
                }}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={styles.modeIndex}>{mode.index}</span>
                <span className={styles.modeIcon}>
                  <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className={styles.modeTitle}>{mode.title}</span>
                <span className={styles.modeDescription}>{mode.description}</span>
                <span className={styles.modeArrow}>
                  <ArrowRight size={17} aria-hidden="true" />
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.spotlight} style={{ '--accent': brandOfDay.accent } as CSSProperties}>
          <div className={styles.spotlightVisual}>
            <span className={styles.spotlightRing} aria-hidden="true" />
            <span className={styles.spotlightRingTwo} aria-hidden="true" />
            <div className={styles.spotlightLogo}>
              <BrandMark logo={brandOfDay.logo} />
            </div>
            <span className={styles.spotlightFlag}>{dayCountry.flag}</span>
            <span className={styles.spotlightYear}>с {brandOfDay.since}</span>
          </div>

          <div className={styles.spotlightContent}>
            <span className={styles.eyebrow}>
              <Sparkles size={13} aria-hidden="true" /> Бренд дня
            </span>
            <h2>{brandOfDay.name}</h2>
            <span className={styles.spotlightRu}>
              {brandOfDay.nameRu} · {dayCountry.name}
            </span>
            <p>{brandOfDay.fact}</p>
            <div className={styles.spotlightActions}>
              <Button onClick={() => openBrand(brandOfDay)} icon={<ArrowRight size={17} />}>
                {dayLearned ? 'Открыть карточку' : 'Узнать бренд'}
              </Button>
              <span className={styles.spotlightTagline}>«{brandOfDay.tagline}»</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className={styles.ctaContent}>
          <span className={styles.eyebrow}>Готов к заезду?</span>
          <h2>
            Твой пит-стоп
            <br />
            уже ждёт
          </h2>
          <p>Начни с гаража, а потом проверь себя в викторине и гонке на время.</p>
          <div className={styles.ctaActions}>
            <Button onClick={() => navigate('/garage')} icon={<CarFront size={18} />} iconPosition="left">
              Открыть гараж
            </Button>
            <Button variant="secondary" onClick={() => navigate('/race')} icon={<Flag size={18} />} iconPosition="left">
              В пит-стоп
            </Button>
          </div>
        </div>
        <div className={styles.ctaNumber} aria-hidden="true">
          5+
        </div>
        <div className={styles.ctaSpeed} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      <div className={styles.heroFooterNote}>
        <span>
          <Flag size={14} aria-hidden="true" /> {brands.length} брендов · {countries.length} стран · 4 режима
        </span>
        <span>Без таймеров в обучении. Только азарт и звёзды.</span>
      </div>

      <BrandModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  )
}
