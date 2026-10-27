import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { brands } from '../data/brands'
import { audio } from '../lib/audio'
import type { Progress } from '../types'

const STORAGE_KEY = 'turbo-garage-progress-v1'
const brandIds = new Set(brands.map((brand) => brand.id))

export const STARS_PER_BRAND = 5
export const STARS_PER_CORRECT = 2
export const STARS_PER_RACE = 20
export const STARS_PERFECT_BONUS = 10

const defaultProgress: Progress = {
  learned: [],
  stars: 0,
  quizBest: 0,
  quizPlayed: 0,
  raceBest: null,
  raceWins: 0,
  soundOn: true,
}

type Action =
  | { type: 'learn'; id: string }
  | { type: 'addStars'; amount: number }
  | { type: 'quizResult'; score: number }
  | { type: 'raceResult'; seconds: number }
  | { type: 'setSound'; on: boolean }
  | { type: 'reset' }

function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'learn': {
      if (state.learned.includes(action.id)) return state
      return {
        ...state,
        learned: [...state.learned, action.id],
        stars: state.stars + STARS_PER_BRAND,
      }
    }
    case 'addStars':
      return { ...state, stars: Math.max(0, state.stars + action.amount) }
    case 'quizResult':
      return {
        ...state,
        quizPlayed: state.quizPlayed + 1,
        quizBest: Math.max(state.quizBest, action.score),
        stars: state.stars + (action.score === 10 ? STARS_PERFECT_BONUS : 0),
      }
    case 'raceResult':
      return {
        ...state,
        raceWins: state.raceWins + 1,
        raceBest:
          state.raceBest === null ? action.seconds : Math.min(state.raceBest, action.seconds),
        stars: state.stars + STARS_PER_RACE,
      }
    case 'setSound':
      return { ...state, soundOn: action.on }
    case 'reset':
      return { ...defaultProgress, soundOn: state.soundOn }
    default:
      return state
  }
}

function loadProgress(): Progress {
  if (typeof window === 'undefined') return defaultProgress
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      ...defaultProgress,
      ...parsed,
      learned: Array.isArray(parsed.learned)
        ? parsed.learned.filter((id): id is string => typeof id === 'string' && brandIds.has(id))
        : [],
      stars: typeof parsed.stars === 'number' && parsed.stars >= 0 ? parsed.stars : 0,
      quizBest:
        typeof parsed.quizBest === 'number' && parsed.quizBest >= 0 && parsed.quizBest <= 10
          ? parsed.quizBest
          : 0,
      quizPlayed: typeof parsed.quizPlayed === 'number' ? parsed.quizPlayed : 0,
      raceBest: typeof parsed.raceBest === 'number' ? parsed.raceBest : null,
      raceWins: typeof parsed.raceWins === 'number' ? parsed.raceWins : 0,
      soundOn: typeof parsed.soundOn === 'boolean' ? parsed.soundOn : true,
    }
  } catch {
    return defaultProgress
  }
}

interface AppContextValue {
  progress: Progress
  learnedSet: Set<string>
  learnedCount: number
  progressPercent: number
  learnBrand: (id: string) => void
  addStars: (amount: number) => void
  saveQuizResult: (score: number) => void
  saveRaceResult: (seconds: number) => void
  setSound: (on: boolean) => void
  resetProgress: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, undefined, loadProgress)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Играть можно и без сохранения — например, в приватном режиме.
    }
  }, [progress])

  useEffect(() => {
    audio.setEnabled(progress.soundOn)
  }, [progress.soundOn])

  const learnedSet = useMemo(() => new Set(progress.learned), [progress.learned])
  const learnedCount = useMemo(
    () => brands.reduce((count, brand) => count + (learnedSet.has(brand.id) ? 1 : 0), 0),
    [learnedSet],
  )
  const progressPercent = Math.round((learnedCount / brands.length) * 100)

  const learnBrand = useCallback((id: string) => dispatch({ type: 'learn', id }), [])
  const addStars = useCallback((amount: number) => dispatch({ type: 'addStars', amount }), [])
  const saveQuizResult = useCallback((score: number) => dispatch({ type: 'quizResult', score }), [])
  const saveRaceResult = useCallback(
    (seconds: number) => dispatch({ type: 'raceResult', seconds }),
    [],
  )
  const setSound = useCallback((on: boolean) => dispatch({ type: 'setSound', on }), [])
  const resetProgress = useCallback(() => dispatch({ type: 'reset' }), [])

  const value = useMemo(
    () => ({
      progress,
      learnedSet,
      learnedCount,
      progressPercent,
      learnBrand,
      addStars,
      saveQuizResult,
      saveRaceResult,
      setSound,
      resetProgress,
    }),
    [
      progress,
      learnedSet,
      learnedCount,
      progressPercent,
      learnBrand,
      addStars,
      saveQuizResult,
      saveRaceResult,
      setSound,
      resetProgress,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside AppProvider')
  }
  return context
}
