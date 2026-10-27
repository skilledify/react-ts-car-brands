import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { audio } from '../lib/audio'
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
        <svg viewBox="0 0 780 330" className={styles.car} role="presentation">
          <defs>
            <linearGradient id="hero-body" x1="0" y1="0" x2="0.86" y2="1">
              <stop offset="0%" stopColor="#f8fcfb" />
              <stop offset="30%" stopColor="#d9e3e2" />
              <stop offset="62%" stopColor="#aab9ba" />
              <stop offset="100%" stopColor="#65797c" />
            </linearGradient>
            <linearGradient id="hero-body-dark" x1="0" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#314448" />
              <stop offset="55%" stopColor="#111d20" />
              <stop offset="100%" stopColor="#050b0d" />
            </linearGradient>
            <linearGradient id="hero-teal" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#a4fff4" />
              <stop offset="42%" stopColor="#2ef2d6" />
              <stop offset="100%" stopColor="#009f92" />
            </linearGradient>
            <linearGradient id="hero-glass" x1="0" y1="0" x2="0.65" y2="1">
              <stop offset="0%" stopColor="#245158" />
              <stop offset="38%" stopColor="#0d262b" />
              <stop offset="100%" stopColor="#030b0d" />
            </linearGradient>
            <linearGradient id="hero-tire" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#29373b" />
              <stop offset="45%" stopColor="#10181b" />
              <stop offset="100%" stopColor="#040708" />
            </linearGradient>
            <linearGradient id="hero-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e5ecec" />
              <stop offset="45%" stopColor="#9aabad" />
              <stop offset="100%" stopColor="#485d61" />
            </linearGradient>
            <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d2be" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#00d2be" stopOpacity="0" />
            </radialGradient>
            <filter id="hero-shadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.55" />
            </filter>
          </defs>

          <ellipse cx="390" cy="299" rx="314" ry="18" fill="#000" opacity="0.46" />
          <ellipse cx="390" cy="294" rx="270" ry="10" fill="url(#hero-glow)" />

          <g filter="url(#hero-shadow)">
            {/* Кузов */}
            <path
              d="M84 238c0-13 9-22 26-26l80-16c19-37 56-64 106-76 18-4 37-6 56-6h95c38 1 71 15 98 40l29 22 94 20c38 8 60 21 68 34 4 8 0 14-10 16l-42 4c-11-34-35-53-69-53-34 0-57 20-68 53l-245 3c-11-34-35-54-68-54-34 0-58 21-69 54l-66 3c-10 0-17-6-17-14z"
              fill="url(#hero-body)"
            />

            {/* Нижняя юбка и карбоновая полоса */}
            <path
              d="M144 247c88 8 178 9 269 6l240-4 4 8-244 4c-91 1-178-1-269-7z"
              fill="url(#hero-body-dark)"
            />
            <path d="M155 252c87 5 174 6 261 4l235-2" stroke="#3f5559" strokeWidth="1.4" opacity="0.6" />

            {/* Остекление */}
            <path
              d="M204 181c17-29 47-49 89-57l46-3v60z"
              fill="url(#hero-glass)"
              stroke="#8ba0a2"
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />
            <path
              d="M354 121h90c34 2 64 17 87 43l8 17H354z"
              fill="url(#hero-glass)"
              stroke="#8ba0a2"
              strokeWidth="1.2"
              strokeOpacity="0.35"
            />
            <path d="M339 121h15v60h-15z" fill="#0a1417" />
            <path d="M359 127l-7 48" stroke="#b9fff7" strokeWidth="2" opacity="0.18" />
            <path d="M214 177l34-38" stroke="#b9fff7" strokeWidth="2" opacity="0.12" />

            {/* Блик на крыше и капоте */}
            <path d="M345 118c35-1 68 2 98 10" stroke="#fff" strokeWidth="2" opacity="0.38" strokeLinecap="round" />
            <path d="M560 174c45 6 91 16 134 32" stroke="#fff" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
            <path d="M214 201c63 7 125 8 185 3" stroke="#fff" strokeWidth="2" opacity="0.2" strokeLinecap="round" />

            {/* Петронас-акцент на борту */}
            <path
              d="M257 212c69 9 145 9 226 1l121-12-3 10c-84 18-177 18-259 7l-82-3z"
              fill="url(#hero-teal)"
              opacity="0.94"
            />
            <path d="M185 198c27 4 55 7 84 7" stroke="#a4fff4" strokeWidth="2.4" opacity="0.6" strokeLinecap="round" />

            {/* Дверь, ручка и зеркало */}
            <path d="M366 182v64" stroke="#45595d" strokeWidth="1.4" opacity="0.6" />
            <path d="M393 208h20" stroke="#dae5e5" strokeWidth="2.4" strokeLinecap="round" opacity="0.82" />
            <path
              d="M520 157c8-5 18-6 25-2l-3 8c-6-1-11 0-15 4z"
              fill="url(#hero-teal)"
              stroke="#091416"
              strokeWidth="1.4"
            />
            <path d="M548 163c5 0 9 1 13 3" stroke="#7d9194" strokeWidth="2" strokeLinecap="round" opacity="0.55" />

            {/* Задний фонарь */}
            <path d="M89 215c10 1 19 2 28 4l-2 8-27 1c-2 0-3-2-2-4z" fill="url(#hero-teal)" opacity="0.95" />
            <path d="M92 218c8 1 16 2 23 3" stroke="#eafffb" strokeWidth="1.4" opacity="0.65" />

            {/* Передняя фара и решётка */}
            <path d="M674 203c20 3 39 8 56 16l-4 8-55-11z" fill="#dffdf8" opacity="0.92" />
            <path d="M681 210c14 2 28 5 42 10" stroke="#2ef2d6" strokeWidth="2" opacity="0.95" />
            <path d="M704 229h27l-1 7-28 4-3-6z" fill="#071013" />
            <path d="M708 232h20M707 236h22" stroke="#42595d" strokeWidth="1.2" opacity="0.8" />
            <path d="M690 250h39l-4 6h-40z" fill="url(#hero-teal)" opacity="0.8" />

            {/* Колёсные арки */}
            <circle cx="235" cy="247" r="66" fill="#040b0d" />
            <circle cx="590" cy="247" r="62" fill="#040b0d" />
            <path
              d="M168 254c11-34 35-54 68-54 34 0 57 20 69 54"
              fill="none"
              stroke="#d4e0df"
              strokeWidth="2"
              opacity="0.2"
            />
            <path
              d="M529 251c11-33 34-52 66-52 33 0 55 19 66 52"
              fill="none"
              stroke="#d4e0df"
              strokeWidth="2"
              opacity="0.2"
            />

            {/* Заднее колесо */}
            <g>
              <circle cx="235" cy="247" r="59" fill="url(#hero-tire)" stroke="#1b292d" strokeWidth="2" />
              <circle cx="235" cy="247" r="59" fill="none" stroke="#2b3b3f" strokeWidth="1" opacity="0.5" />
              <circle cx="235" cy="247" r="44" fill="#0a1214" />
              <circle cx="235" cy="247" r="39" fill="none" stroke="url(#hero-teal)" strokeWidth="2.2" opacity="0.7" />
              <path d="M266 231c4 10 4 22 0 32" stroke="#2ef2d6" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
              <circle cx="235" cy="247" r="34" fill="url(#hero-rim)" />
              <g className={styles.rim} style={{ transformOrigin: '235px 247px' }}>
                <path
                  d="M235 218v22M235 254v22M206 247h22M242 247h22M214 226l15 15M241 238l15 15M256 226l-15 15M229 238l-15 15"
                  stroke="#203135"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="235" cy="247" r="8" fill="#0b181a" stroke="#4b6266" strokeWidth="2" />
              <circle cx="235" cy="247" r="2.4" fill="#2ef2d6" />
            </g>

            {/* Переднее колесо */}
            <g>
              <circle cx="590" cy="247" r="57" fill="url(#hero-tire)" stroke="#1b292d" strokeWidth="2" />
              <circle cx="590" cy="247" r="57" fill="none" stroke="#2b3b3f" strokeWidth="1" opacity="0.5" />
              <circle cx="590" cy="247" r="42" fill="#0a1214" />
              <circle cx="590" cy="247" r="37" fill="none" stroke="url(#hero-teal)" strokeWidth="2.2" opacity="0.72" />
              <path d="M620 232c4 10 4 20 0 30" stroke="#2ef2d6" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
              <circle cx="590" cy="247" r="32" fill="url(#hero-rim)" />
              <g className={styles.rimFront} style={{ transformOrigin: '590px 247px' }}>
                <path
                  d="M590 220v20M590 252v20M563 247h20M597 247h20M571 228l14 14M595 238l14 14M609 228l-14 14M585 238l-14 14"
                  stroke="#203135"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="590" cy="247" r="7.5" fill="#0b181a" stroke="#4b6266" strokeWidth="2" />
              <circle cx="590" cy="247" r="2.3" fill="#2ef2d6" />
            </g>
          </g>
        </svg>
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
