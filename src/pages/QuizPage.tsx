import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CarFront,
  Check,
  CircleHelp,
  Flame,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react'
import { BrandMark } from '../components/BrandLogo'
import { Button } from '../components/Button'
import { brands } from '../data/brands'
import { countryById } from '../data/countries'
import { audio } from '../lib/audio'
import { celebrate } from '../lib/celebrate'
import { shuffle } from '../lib/random'
import { STARS_PER_CORRECT, STARS_PERFECT_BONUS, useApp } from '../state/AppContext'
import type { Brand } from '../types'
import styles from './QuizPage.module.scss'

const QUESTION_COUNT = 10
const OPTION_LETTERS = ['A', 'B', 'C', 'D']

interface QuizQuestion {
  brand: Brand
  options: Brand[]
}

interface QuizResult {
  score: number
  bestStreak: number
  newBest: boolean
}

function rankFor(score: number) {
  if (score === 10) return { title: 'Чемпион!', text: 'Идеальный заезд — ни одной ошибки!' }
  if (score >= 8) return { title: 'На подиуме!', text: 'Отличный результат. Ещё чуть-чуть до победы!' }
  if (score >= 5) return { title: 'Быстрый пилот', text: 'Хороший заезд! Потренируйся в гараже и возвращайся.' }
  return { title: 'Юный новичок', text: 'Каждый чемпион с чего-то начинал. Попробуй ещё раз!' }
}

export function QuizPage() {
  const navigate = useNavigate()
  const { progress, addStars, saveQuizResult } = useApp()
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const timer = useRef<number | null>(null)

  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const startQuiz = () => {
    clearTimer()
    const picked = shuffle(brands).slice(0, QUESTION_COUNT)
    const nextQuestions = picked.map((brand) => {
      const distractors = shuffle(brands.filter((candidate) => candidate.id !== brand.id)).slice(0, 3)
      return { brand, options: shuffle([brand, ...distractors]) }
    })

    setQuestions(nextQuestions)
    setIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setAnswer(null)
    setHintUsed(false)
    setResult(null)
    setPhase('playing')
    audio.play('rev')
  }

  const finishQuiz = (finalScore: number, finalBestStreak: number) => {
    const newBest = finalScore > progress.quizBest
    saveQuizResult(finalScore)
    setResult({ score: finalScore, bestStreak: finalBestStreak, newBest })
    setPhase('result')
    audio.play('finish')
    if (finalScore >= 7) {
      celebrate(true)
    }
  }

  const handleAnswer = (optionId: string) => {
    if (answer !== null || phase !== 'playing') return
    const question = questions[index]
    if (!question) return

    const correct = optionId === question.brand.id
    const nextStreak = correct ? streak + 1 : 0
    const nextScore = correct ? score + 1 : score
    const nextBestStreak = Math.max(bestStreak, nextStreak)

    setAnswer(optionId)
    setStreak(nextStreak)
    setBestStreak(nextBestStreak)

    if (correct) {
      setScore(nextScore)
      addStars(STARS_PER_CORRECT)
      audio.play('correct')
    } else {
      audio.play('wrong')
    }

    timer.current = window.setTimeout(() => {
      timer.current = null
      if (index + 1 >= questions.length) {
        finishQuiz(nextScore, nextBestStreak)
      } else {
        setIndex((current) => current + 1)
        setAnswer(null)
        setHintUsed(false)
      }
    }, correct ? 1050 : 1500)
  }

  const question = questions[index]
  const rank = result ? rankFor(result.score) : null
  const earnedStars = result
    ? result.score * STARS_PER_CORRECT + (result.score === QUESTION_COUNT ? STARS_PERFECT_BONUS : 0)
    : 0

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
              <CircleHelp size={13} aria-hidden="true" /> Викторина
            </span>
            <h1>
              Угадай
              <br />
              <span>бренд</span>
            </h1>
            <p>
              10 логотипов, 4 варианта и никакого таймера. Узнай марку, зарабатывай звёзды и
              поднимайся на подиум!
            </p>

            <div className={styles.bestRow}>
              <span className={styles.bestChip}>
                <Trophy size={15} aria-hidden="true" /> Лучший результат
                <strong>{progress.quizBest}/10</strong>
              </span>
              <span className={styles.bestChip}>
                <Flame size={15} aria-hidden="true" /> Заездов: <strong>{progress.quizPlayed}</strong>
              </span>
            </div>

            <div className={styles.introActions}>
              <Button size="lg" onClick={startQuiz} icon={<Play size={18} fill="currentColor" />} iconPosition="left">
                Поехали!
              </Button>
              <span className={styles.introNote}>+2 звезды за каждый верный ответ</span>
            </div>

            <div className={styles.rules}>
              <span>
                <CircleHelp size={14} aria-hidden="true" /> 10 вопросов
              </span>
              <span>
                <Sparkles size={14} aria-hidden="true" /> 4 варианта
              </span>
              <span>
                <Lightbulb size={14} aria-hidden="true" /> Можно брать подсказку
              </span>
            </div>
          </motion.div>

          <motion.div
            className={styles.logoCloud}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            aria-hidden="true"
          >
            <span className={styles.orbitOuter} />
            <span className={styles.orbitInner} />
            <div className={styles.questionMark}>?</div>
            <div className={`${styles.cloudLogo} ${styles.cloudOne}`}>
              <BrandMark logo="ferrari" />
            </div>
            <div className={`${styles.cloudLogo} ${styles.cloudTwo}`}>
              <BrandMark logo="bmw" />
            </div>
            <div className={`${styles.cloudLogo} ${styles.cloudThree}`}>
              <BrandMark logo="toyota" />
            </div>
            <div className={`${styles.cloudLogo} ${styles.cloudFour}`}>
              <BrandMark logo="audi" />
            </div>
            <div className={styles.cloudBadge}>
              <Star size={15} fill="currentColor" /> Квиз-заезд
            </div>
          </motion.div>
        </section>
      )}

      {phase === 'playing' && question && (
        <div className={styles.game}>
          <div className={styles.hud}>
            <span className={styles.hudChip}>
              <CircleHelp size={14} aria-hidden="true" />
              {index + 1} <small>/ {questions.length}</small>
            </span>
            <div className={styles.segments} aria-hidden="true">
              {questions.map((_, segmentIndex) => (
                <span
                  key={segmentIndex}
                  className={[
                    styles.segment,
                    segmentIndex < index ? styles.segmentDone : '',
                    segmentIndex === index ? styles.segmentCurrent : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
            <div className={styles.hudRight}>
              <span className={`${styles.hudChip} ${styles.hudScore}`}>
                <Star size={14} fill="currentColor" aria-hidden="true" /> {score}
              </span>
              <AnimatePresence>
                {streak > 1 && (
                  <motion.span
                    className={styles.streakChip}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    key={streak}
                  >
                    <Flame size={14} aria-hidden="true" /> x{streak}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className={styles.questionWrap}
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <div className={styles.logoPanel} style={{ '--accent': question.brand.accent } as CSSProperties}>
                <span className={styles.logoPanelGrid} aria-hidden="true" />
                <span className={styles.logoPanelRing} aria-hidden="true" />
                <span className={styles.logoPanelRingTwo} aria-hidden="true" />
                <span className={styles.questionLabel}>Чей это логотип?</span>

                <motion.div
                  className={styles.bigLogo}
                  initial={{ scale: 0.7, rotate: -7 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20, delay: 0.04 }}
                >
                  <BrandMark logo={question.brand.logo} />
                </motion.div>

                <AnimatePresence mode="wait">
                  {hintUsed ? (
                    <motion.span
                      className={styles.countryHint}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {countryById[question.brand.country].flag}{' '}
                      {countryById[question.brand.country].name}
                    </motion.span>
                  ) : (
                    <motion.span
                      className={styles.logoPanelHint}
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Найди название на панели справа
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.answerPanel}>
                <span className={styles.questionNumber}>Вопрос {index + 1}</span>
                <h2>Выбери правильный бренд</h2>

                <button
                  type="button"
                  className={`${styles.hintButton} ${hintUsed ? styles.hintUsed : ''}`}
                  onClick={() => {
                    if (hintUsed || answer !== null) return
                    audio.play('click')
                    setHintUsed(true)
                  }}
                  disabled={hintUsed || answer !== null}
                >
                  <Lightbulb size={16} aria-hidden="true" />
                  {hintUsed ? 'Подсказка открыта' : 'Подсказка: показать страну'}
                </button>

                <div className={styles.options} role="group" aria-label="Варианты ответа">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = option.id === question.brand.id
                    const isChosen = answer === option.id
                    const revealed = answer !== null
                    let state = 'idle'
                    if (revealed && isCorrect) state = 'correct'
                    else if (revealed && isChosen) state = 'wrong'
                    else if (revealed) state = 'muted'

                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        className={styles.option}
                        data-state={state}
                        onClick={() => handleAnswer(option.id)}
                        disabled={revealed}
                        whileTap={revealed ? undefined : { scale: 0.985 }}
                      >
                        <span className={styles.optionLetter}>{OPTION_LETTERS[optionIndex]}</span>
                        <span className={styles.optionNames}>
                          <strong>{option.name}</strong>
                          <small>{option.nameRu}</small>
                        </span>
                        {state === 'correct' && (
                          <span className={styles.optionResult}>
                            <Check size={18} strokeWidth={3} aria-hidden="true" />
                          </span>
                        )}
                        {state === 'wrong' && (
                          <span className={styles.optionResult}>
                            <X size={18} strokeWidth={3} aria-hidden="true" />
                          </span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>

                <div className={styles.feedbackSlot} aria-live="polite">
                  <AnimatePresence mode="wait">
                    {answer !== null && (
                      <motion.div
                        key={answer}
                        className={`${styles.feedback} ${
                          answer === question.brand.id ? styles.feedbackCorrect : styles.feedbackWrong
                        }`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        {answer === question.brand.id ? (
                          <>
                            <Check size={16} strokeWidth={3} aria-hidden="true" />
                            <span>
                              Точно! Это {question.brand.name} из{' '}
                              {countryById[question.brand.country].name}.
                            </span>
                          </>
                        ) : (
                          <>
                            <Lightbulb size={16} aria-hidden="true" />
                            <span>
                              Это {question.brand.name}. Запомни логотип — в следующий раз получится!
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {phase === 'result' && result && rank && (
        <div className={styles.resultWrap}>
          <motion.div
            className={styles.resultCard}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          >
            <span className={styles.resultGlow} aria-hidden="true" />
            <span className={styles.resultEyebrow}>Финиш · викторина</span>

            <div className={styles.resultScore}>
              <svg viewBox="0 0 180 180" aria-hidden="true">
                <circle cx="90" cy="90" r="74" className={styles.resultTrack} />
                <motion.circle
                  cx="90"
                  cy="90"
                  r="74"
                  className={styles.resultRing}
                  strokeDasharray={2 * Math.PI * 74}
                  initial={{ strokeDashoffset: 2 * Math.PI * 74 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 74 * (1 - result.score / 10) }}
                  transition={{ duration: 1.05, ease: 'easeOut', delay: 0.15 }}
                />
              </svg>
              <div className={styles.resultNumber}>
                <strong>{result.score}</strong>
                <span>/ 10</span>
              </div>
            </div>

            <div className={styles.rankBadge}>
              <Trophy size={16} aria-hidden="true" />
              {result.newBest ? 'Новый рекорд!' : 'Твой результат'}
            </div>
            <h1>{rank.title}</h1>
            <p>{rank.text}</p>

            <div className={styles.resultStats}>
              <div>
                <Star size={17} fill="currentColor" aria-hidden="true" />
                <strong>+{earnedStars}</strong>
                <span>звёзд</span>
              </div>
              <div>
                <Flame size={17} aria-hidden="true" />
                <strong>{result.bestStreak}</strong>
                <span>лучшая серия</span>
              </div>
              <div>
                <Trophy size={17} aria-hidden="true" />
                <strong>{Math.max(progress.quizBest, result.score)}</strong>
                <span>рекорд</span>
              </div>
            </div>

            <div className={styles.resultActions}>
              <Button onClick={startQuiz} icon={<RotateCcw size={17} />} iconPosition="left">
                Ещё заезд
              </Button>
              <Button variant="secondary" onClick={() => navigate('/garage')} icon={<CarFront size={17} />} iconPosition="left">
                В гараж
              </Button>
              <button type="button" className={styles.homeLink} onClick={() => navigate('/')}>
                На главную <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
