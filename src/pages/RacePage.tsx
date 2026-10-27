import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CarFront,
  Check,
  Flag,
  Gauge,
  Play,
  RotateCcw,
  Star,
  Timer,
  Trophy,
} from 'lucide-react'
import { BrandMark } from '../components/BrandLogo'
import { Button } from '../components/Button'
import { brands } from '../data/brands'
import { audio } from '../lib/audio'
import { celebrate } from '../lib/celebrate'
import { formatSeconds } from '../lib/format'
import { shuffle } from '../lib/random'
import { STARS_PER_RACE, useApp } from '../state/AppContext'
import type { Brand } from '../types'
import styles from './RacePage.module.scss'

const PAIRS = 6

interface RaceCard {
  id: string
  brandId: string
  kind: 'logo' | 'name'
  brand: Brand
}

interface RaceResult {
  seconds: number
  moves: number
  newBest: boolean
}

function timeRank(seconds: number) {
  if (seconds < 25) return 'Молния пит-стопа!'
  if (seconds < 40) return 'Профи гонки!'
  if (seconds < 60) return 'Уверенный пилот!'
  return 'Финиш есть финиш!'
}

export function RacePage() {
  const navigate = useNavigate()
  const { progress, saveRaceResult } = useApp()
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [cards, setCards] = useState<RaceCard[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [matchedIds, setMatchedIds] = useState<string[]>([])
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [raceResult, setRaceResult] = useState<RaceResult | null>(null)
  const startTime = useRef<number | null>(null)
  const wrongTimer = useRef<number | null>(null)

  useEffect(() => {
    if (phase !== 'playing') return
    const interval = window.setInterval(() => {
      if (startTime.current) {
        setElapsed((Date.now() - startTime.current) / 1000)
      }
    }, 100)
    return () => window.clearInterval(interval)
  }, [phase])

  useEffect(() => {
    return () => {
      if (wrongTimer.current) window.clearTimeout(wrongTimer.current)
    }
  }, [])

  const startRace = () => {
    if (wrongTimer.current) window.clearTimeout(wrongTimer.current)
    const picked = shuffle(brands).slice(0, PAIRS)
    const nextCards = shuffle(
      picked.flatMap((brand) => [
        { id: `${brand.id}-logo`, brandId: brand.id, kind: 'logo' as const, brand },
        { id: `${brand.id}-name`, brandId: brand.id, kind: 'name' as const, brand },
      ]),
    )

    setCards(nextCards)
    setSelected(null)
    setMatchedIds([])
    setWrongIds([])
    setLocked(false)
    setMoves(0)
    setElapsed(0)
    setRaceResult(null)
    startTime.current = Date.now()
    setPhase('playing')
    audio.play('rev')
  }

  const finishRace = (nextMoves: number) => {
    const seconds = startTime.current ? (Date.now() - startTime.current) / 1000 : elapsed
    const newBest = progress.raceBest === null || seconds < progress.raceBest
    setElapsed(seconds)
    setRaceResult({ seconds, moves: nextMoves, newBest })
    saveRaceResult(seconds)
    setPhase('result')
    audio.play('finish')
    celebrate(true)
  }

  const handleCard = (card: RaceCard) => {
    if (phase !== 'playing' || locked || matchedIds.includes(card.brandId)) return

    if (selected === null) {
      setSelected(card.id)
      audio.play('click')
      return
    }

    if (selected === card.id) {
      setSelected(null)
      return
    }

    const selectedCard = cards.find((candidate) => candidate.id === selected)
    if (!selectedCard) {
      setSelected(card.id)
      return
    }

    const nextMoves = moves + 1
    setMoves(nextMoves)

    if (selectedCard.brandId === card.brandId) {
      const nextMatched = [...matchedIds, card.brandId]
      setMatchedIds(nextMatched)
      setSelected(null)
      audio.play('correct')
      if (nextMatched.length === PAIRS) {
        finishRace(nextMoves)
      }
    } else {
      setWrongIds([selectedCard.id, card.id])
      setSelected(null)
      setLocked(true)
      audio.play('wrong')
      wrongTimer.current = window.setTimeout(() => {
        setWrongIds([])
        setLocked(false)
        wrongTimer.current = null
      }, 700)
    }
  }

  return (
    <div className={styles.page}>
      {phase === 'intro' && (
        <section className={styles.intro}>
          <motion.div
            className={styles.introCopy}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span className={styles.eyebrow}>
              <Flag size={13} aria-hidden="true" /> Пит-стоп
            </span>
            <h1>
              Собери
              <br />
              <span>пары</span>
            </h1>
            <p>
              6 логотипов, 6 названий — найди их все на время! Открывай карточки по две и
              показывай лучший круг.
            </p>

            <div className={styles.bestRow}>
              <span className={styles.bestChip}>
                <Timer size={15} aria-hidden="true" /> Лучшее время
                <strong>{formatSeconds(progress.raceBest)}</strong>
              </span>
              <span className={styles.bestChip}>
                <Trophy size={15} aria-hidden="true" /> Побед: <strong>{progress.raceWins}</strong>
              </span>
            </div>

            <div className={styles.introActions}>
              <Button
                size="lg"
                onClick={startRace}
                icon={<Play size={18} fill="currentColor" />}
                iconPosition="left"
              >
                На старт!
              </Button>
              <span className={styles.introNote}>+{STARS_PER_RACE} звёзд за пройденный пит-стоп</span>
            </div>

            <div className={styles.rules}>
              <span>
                <Gauge size={14} aria-hidden="true" /> 6 пар
              </span>
              <span>
                <Flag size={14} aria-hidden="true" /> 12 карточек
              </span>
              <span>
                <Timer size={14} aria-hidden="true" /> Таймер на финише
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.raceVisual}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <span className={styles.trackRing} />
            <span className={styles.trackRingTwo} />
            <div className={styles.visualTimer}>
              <Timer size={15} />
              00:00.0
            </div>
            <div className={`${styles.previewCard} ${styles.previewLogo}`}>
              <span>Логотип</span>
              <BrandMark logo="ferrari" />
            </div>
            <div className={styles.matchLink}>
              <Check size={17} strokeWidth={3} />
            </div>
            <div className={`${styles.previewCard} ${styles.previewName}`}>
              <span>Название</span>
              <strong>Ferrari</strong>
              <small>Феррари</small>
            </div>
            <div className={styles.previewBadge}>
              <Flag size={14} />
              готов к заезду
            </div>
          </motion.div>
        </section>
      )}

      {phase === 'playing' && (
        <div className={styles.game}>
          <div className={styles.hud}>
            <span className={styles.hudChip}>
              <Timer size={15} aria-hidden="true" />
              <strong>{formatSeconds(elapsed)}</strong>
            </span>
            <span className={styles.hudChip}>
              <Flag size={14} aria-hidden="true" />
              {matchedIds.length} <small>/ {PAIRS} пар</small>
            </span>
            <span className={`${styles.hudChip} ${styles.hudMoves}`}>
              <Gauge size={14} aria-hidden="true" />
              {moves} <small>ходов</small>
            </span>
            <button type="button" className={styles.restart} onClick={startRace} aria-label="Начать заново">
              <RotateCcw size={15} aria-hidden="true" />
              <span>Заново</span>
            </button>
          </div>

          <div className={styles.boardHint}>
            <span className={styles.hintDot} aria-hidden="true" />
            Сначала выбери логотип, потом его название
          </div>

          <motion.div className={styles.board} layout>
            {cards.map((card, index) => {
              const isMatched = matchedIds.includes(card.brandId)
              const isSelected = selected === card.id
              const isWrong = wrongIds.includes(card.id)

              return (
                <motion.button
                  key={card.id}
                  type="button"
                  className={[
                    styles.card,
                    card.kind === 'logo' ? styles.logoCard : styles.nameCard,
                    isSelected ? styles.selected : '',
                    isMatched ? styles.matched : '',
                    isWrong ? styles.wrong : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ '--accent': card.brand.accent } as CSSProperties}
                  onClick={() => handleCard(card)}
                  disabled={isMatched}
                  initial={{ opacity: 0, y: 18, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.03,
                    ease: 'easeOut',
                  }}
                  whileHover={isMatched ? undefined : { y: -4 }}
                  whileTap={isMatched ? undefined : { scale: 0.97 }}
                  aria-label={
                    card.kind === 'logo'
                      ? `Логотип ${card.brand.name}`
                      : `Название ${card.brand.name}`
                  }
                  aria-pressed={isSelected}
                >
                  <span className={styles.cardLabel}>
                    {card.kind === 'logo' ? 'Логотип' : 'Название'}
                  </span>

                  {card.kind === 'logo' ? (
                    <span className={styles.cardLogo}>
                      <BrandMark logo={card.brand.logo} />
                    </span>
                  ) : (
                    <span className={styles.cardName}>
                      <strong>{card.brand.name}</strong>
                      <small>{card.brand.nameRu}</small>
                    </span>
                  )}

                  <span className={styles.cardCorner}>
                    {isMatched ? <Check size={13} strokeWidth={3} /> : <Flag size={12} />}
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      )}

      {phase === 'result' && raceResult && (
        <div className={styles.resultWrap}>
          <motion.div
            className={styles.resultCard}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          >
            <span className={styles.resultGlow} aria-hidden="true" />
            <span className={styles.resultEyebrow}>Финиш · пит-стоп</span>
            <div className={styles.resultIcon}>
              <Flag size={30} aria-hidden="true" />
            </div>
            <h1>{timeRank(raceResult.seconds)}</h1>
            <p>Все 6 пар найдены. Пит-стоп закрыт, можно праздновать!</p>

            <div className={styles.resultTime}>{formatSeconds(raceResult.seconds)}</div>
            {raceResult.newBest && <span className={styles.recordBadge}>Новый лучший круг!</span>}

            <div className={styles.resultStats}>
              <div>
                <Timer size={17} aria-hidden="true" />
                <strong>{formatSeconds(raceResult.seconds)}</strong>
                <span>время</span>
              </div>
              <div>
                <Gauge size={17} aria-hidden="true" />
                <strong>{raceResult.moves}</strong>
                <span>ходов</span>
              </div>
              <div>
                <Star size={17} fill="currentColor" aria-hidden="true" />
                <strong>+{STARS_PER_RACE}</strong>
                <span>звёзд</span>
              </div>
            </div>

            <div className={styles.resultActions}>
              <Button onClick={startRace} icon={<RotateCcw size={17} />} iconPosition="left">
                Ещё заезд
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/garage')}
                icon={<CarFront size={17} />}
                iconPosition="left"
              >
                В гараж
              </Button>
              <button type="button" className={styles.homeLink} onClick={() => navigate('/')}>
                На главную <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>

            <AnimatePresence>
              {!raceResult.newBest && progress.raceBest !== null && (
                <motion.span
                  className={styles.bestHint}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Лучший круг: {formatSeconds(progress.raceBest)}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  )
}
