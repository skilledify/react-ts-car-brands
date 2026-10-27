import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CarFront,
  Check,
  CircleHelp,
  Flame,
  Gauge,
  Lock,
  RotateCcw,
  Sparkles,
  Star,
  Timer,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { AnimatedNumber } from '../components/AnimatedNumber'
import { BrandMark } from '../components/BrandLogo'
import { Button } from '../components/Button'
import { ProgressRing } from '../components/ProgressRing'
import { brands } from '../data/brands'
import { countries } from '../data/countries'
import { formatSeconds } from '../lib/format'
import { useApp } from '../state/AppContext'
import styles from './CollectionPage.module.scss'

interface Badge {
  id: string
  title: string
  description: string
  icon: LucideIcon
  accent: string
  unlocked: boolean
  progress: string
  percent: number
}

function levelFor(percent: number) {
  if (percent >= 100) return { name: 'Легенда гаража', next: 'Коллекция собрана!' }
  if (percent >= 70) return { name: 'Профи', next: 'Ещё немного до полной коллекции' }
  if (percent >= 40) return { name: 'Гонщик', next: 'Ты уже знаешь больше половины' }
  if (percent >= 15) return { name: 'Юный пилот', next: 'Отличный старт — продолжай!' }
  return { name: 'Новичок', next: 'Открой первый бренд и зажги звезду' }
}

export function CollectionPage() {
  const navigate = useNavigate()
  const { progress, learnedSet, learnedCount, progressPercent, resetProgress } = useApp()
  const level = levelFor(progressPercent)
  const remaining = brands.length - learnedCount

  const badges: Badge[] = [
    {
      id: 'first',
      title: 'Первый шаг',
      description: 'Открой первый бренд в гараже',
      icon: Star,
      accent: '#ffd166',
      unlocked: learnedCount >= 1,
      progress: `${Math.min(learnedCount, 1)}/1`,
      percent: Math.min(100, learnedCount * 100),
    },
    {
      id: 'five',
      title: 'Пять в гараже',
      description: 'Собери коллекцию из 5 брендов',
      icon: CarFront,
      accent: '#2ef2d6',
      unlocked: learnedCount >= 5,
      progress: `${Math.min(learnedCount, 5)}/5`,
      percent: Math.min(100, (learnedCount / 5) * 100),
    },
    {
      id: 'half',
      title: 'Половина пути',
      description: 'Изучи 13 автомобильных марок',
      icon: Gauge,
      accent: '#6fa8ff',
      unlocked: learnedCount >= 13,
      progress: `${Math.min(learnedCount, 13)}/13`,
      percent: Math.min(100, (learnedCount / 13) * 100),
    },
    {
      id: 'all',
      title: 'Полная коллекция',
      description: 'Открой все 26 брендов',
      icon: Trophy,
      accent: '#ffb020',
      unlocked: learnedCount >= brands.length,
      progress: `${learnedCount}/${brands.length}`,
      percent: progressPercent,
    },
    {
      id: 'quiz',
      title: 'Знаток',
      description: 'Набери 8 из 10 в викторине',
      icon: CircleHelp,
      accent: '#b388ff',
      unlocked: progress.quizBest >= 8,
      progress: `${progress.quizBest}/8`,
      percent: Math.min(100, (progress.quizBest / 8) * 100),
    },
    {
      id: 'perfect',
      title: 'Идеальный заезд',
      description: 'Ответь правильно на все 10 вопросов',
      icon: Sparkles,
      accent: '#ff5ca8',
      unlocked: progress.quizBest === 10,
      progress: `${progress.quizBest}/10`,
      percent: Math.min(100, (progress.quizBest / 10) * 100),
    },
    {
      id: 'fast',
      title: 'Молния',
      description: 'Пройди пит-стоп быстрее 40 секунд',
      icon: Timer,
      accent: '#ff8a00',
      unlocked: progress.raceBest !== null && progress.raceBest < 40,
      progress: progress.raceBest === null ? '—' : formatSeconds(progress.raceBest),
      percent:
        progress.raceBest === null ? 0 : Math.max(0, Math.min(100, ((60 - progress.raceBest) / 60) * 100)),
    },
    {
      id: 'stars',
      title: 'Звёздный чемпион',
      description: 'Собери 100 звёзд',
      icon: Flame,
      accent: '#ff7043',
      unlocked: progress.stars >= 100,
      progress: `${Math.min(progress.stars, 100)}/100`,
      percent: Math.min(100, progress.stars),
    },
  ]

  const unlockedBadges = badges.filter((badge) => badge.unlocked).length

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <Trophy size={13} aria-hidden="true" /> Коллекция
          </span>
          <h1>
            Твои
            <br />
            <span>трофеи</span>
          </h1>
          <p>
            Здесь живут твои звёзды, открытые бренды и достижения. Собирай коллекцию — и стань
            легендой гаража!
          </p>

          <div className={styles.levelBox}>
            <div className={styles.levelHead}>
              <span className={styles.levelName}>{level.name}</span>
              <span className={styles.levelPercent}>{progressPercent}%</span>
            </div>
            <div className={styles.levelBar} aria-hidden="true">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className={styles.levelHint}>{level.next}</span>
          </div>

          <div className={styles.heroActions}>
            <Button onClick={() => navigate('/garage')} icon={<CarFront size={18} />} iconPosition="left">
              {remaining > 0 ? `Открыть ещё ${remaining}` : 'В гараж'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/quiz')} icon={<CircleHelp size={18} />} iconPosition="left">
              Проверить знания
            </Button>
          </div>
        </div>

        <div className={styles.summary}>
          <ProgressRing value={progressPercent} size={158} stroke={9} caption="коллекция" />
          <div className={styles.summaryStats}>
            <div className={styles.summaryStat}>
              <span style={{ color: '#2ef2d6' }}>
                <CarFront size={16} aria-hidden="true" />
              </span>
              <strong>
                <AnimatedNumber value={learnedCount} />
              </strong>
              <small>брендов</small>
            </div>
            <div className={styles.summaryStat}>
              <span style={{ color: '#ffd166' }}>
                <Star size={16} fill="currentColor" aria-hidden="true" />
              </span>
              <strong>
                <AnimatedNumber value={progress.stars} />
              </strong>
              <small>звёзд</small>
            </div>
            <div className={styles.summaryStat}>
              <span style={{ color: '#b388ff' }}>
                <Trophy size={16} aria-hidden="true" />
              </span>
              <strong>
                {progress.quizBest}
                <i>/10</i>
              </strong>
              <small>лучший квиз</small>
            </div>
            <div className={styles.summaryStat}>
              <span style={{ color: '#ff8a00' }}>
                <Timer size={16} aria-hidden="true" />
              </span>
              <strong className={styles.timeStat}>{formatSeconds(progress.raceBest)}</strong>
              <small>лучший круг</small>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>
              <Sparkles size={13} aria-hidden="true" /> Достижения
            </span>
            <h2>Полки с призами</h2>
          </div>
          <span className={styles.sectionCount}>
            {unlockedBadges} <small>/ {badges.length} открыто</small>
          </span>
        </div>

        <div className={styles.badges}>
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.article
                key={badge.id}
                className={`${styles.badgeCard} ${badge.unlocked ? styles.badgeUnlocked : styles.badgeLocked}`}
                style={{ '--badge-accent': badge.accent } as CSSProperties}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.04, ease: 'easeOut' }}
              >
                <div className={styles.badgeTop}>
                  <span className={styles.badgeIcon}>
                    <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className={styles.badgeStatus}>
                    {badge.unlocked ? (
                      <>
                        <Check size={12} strokeWidth={3} aria-hidden="true" /> получено
                      </>
                    ) : (
                      <>
                        <Lock size={11} aria-hidden="true" /> закрыто
                      </>
                    )}
                  </span>
                </div>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
                <div className={styles.badgeFooter}>
                  <div className={styles.badgeBar} aria-hidden="true">
                    <span style={{ width: `${badge.percent}%` }} />
                  </div>
                  <strong>{badge.progress}</strong>
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.eyebrow}>
              <Gauge size={13} aria-hidden="true" /> Страны
            </span>
            <h2>География коллекции</h2>
          </div>
          <span className={styles.sectionCount}>
            {countries.length} <small>стран</small>
          </span>
        </div>

        <div className={styles.countries}>
          {countries.map((country, index) => {
            const countryBrands = brands.filter((brand) => brand.country === country.id)
            const opened = countryBrands.filter((brand) => learnedSet.has(brand.id)).length
            const percent = Math.round((opened / countryBrands.length) * 100)

            return (
              <motion.article
                key={country.id}
                className={styles.countryCard}
                style={{ '--country-accent': country.accent } as CSSProperties}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.42, delay: index * 0.035, ease: 'easeOut' }}
              >
                <div className={styles.countryHead}>
                  <span className={styles.countryFlag}>{country.flag}</span>
                  <span className={styles.countryName}>{country.name}</span>
                  <span className={styles.countryCount}>
                    {opened}<small>/{countryBrands.length}</small>
                  </span>
                </div>
                <div className={styles.countryBar} aria-hidden="true">
                  <span style={{ width: `${percent}%` }} />
                </div>
                <div className={styles.countryLogos} aria-hidden="true">
                  {countryBrands.map((brand) => (
                    <span
                      key={brand.id}
                      className={styles.countryLogo}
                      data-opened={learnedSet.has(brand.id)}
                      title={brand.name}
                    >
                      <BrandMark logo={brand.logo} />
                    </span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className={styles.ctaPanel}>
        <div>
          <span className={styles.eyebrow}>
            <Flame size={13} aria-hidden="true" /> Вперёд к победе
          </span>
          <h2>
            {remaining > 0 ? `Осталось открыть ${remaining}` : 'Коллекция собрана!'}
          </h2>
          <p>
            {remaining > 0
              ? 'Каждый новый бренд — это 5 звёзд и шаг к званию легенды гаража.'
              : 'Все 26 брендов в гараже. Теперь можно блеснуть знаниями в викторине!'}
          </p>
        </div>
        <div className={styles.ctaActions}>
          <Button onClick={() => navigate('/garage')} icon={<CarFront size={18} />} iconPosition="left">
            В гараж
          </Button>
          <Button variant="secondary" onClick={() => navigate('/race')} icon={<Timer size={18} />} iconPosition="left">
            На пит-стоп
          </Button>
        </div>
        <span className={styles.ctaWatermark} aria-hidden="true">
          {String(learnedCount).padStart(2, '0')}
        </span>
      </section>

      <details className={styles.parentZone}>
        <summary>Для родителей</summary>
        <div className={styles.parentContent}>
          <p>
            Прогресс хранится только в этом браузере. Сброс удалит открытые бренды, звёзды и
            рекорды.
          </p>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => {
              if (window.confirm('Точно сбросить весь прогресс? Это действие нельзя отменить.')) {
                resetProgress()
              }
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Сбросить прогресс
          </button>
        </div>
      </details>
    </div>
  )
}
