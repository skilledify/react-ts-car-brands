import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { audio } from '../lib/audio'
import styles from './F1Car.module.scss'

interface F1CarProps {
  onRev?: () => void
}

export function F1Car({ onRev }: F1CarProps) {
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
        aria-label="Нажми на болид, чтобы завести мотор"
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
            <linearGradient id="car-body" x1="0" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#f5faf9" />
              <stop offset="34%" stopColor="#c7d3d4" />
              <stop offset="72%" stopColor="#9aabae" />
              <stop offset="100%" stopColor="#65777a" />
            </linearGradient>
            <linearGradient id="car-teal" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#a4fff4" />
              <stop offset="40%" stopColor="#2ef2d6" />
              <stop offset="100%" stopColor="#009f92" />
            </linearGradient>
            <linearGradient id="car-dark" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0%" stopColor="#26383d" />
              <stop offset="55%" stopColor="#101a1e" />
              <stop offset="100%" stopColor="#05090b" />
            </linearGradient>
            <linearGradient id="car-tire" x1="0.2" y1="0" x2="0.8" y2="1">
              <stop offset="0%" stopColor="#29373b" />
              <stop offset="45%" stopColor="#10181b" />
              <stop offset="100%" stopColor="#040708" />
            </linearGradient>
            <linearGradient id="car-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#dbe4e4" />
              <stop offset="45%" stopColor="#8fa1a4" />
              <stop offset="100%" stopColor="#44575b" />
            </linearGradient>
            <radialGradient id="car-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00d2be" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00d2be" stopOpacity="0" />
            </radialGradient>
            <filter id="car-shadow" x="-30%" y="-30%" width="160%" height="180%">
              <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000000" floodOpacity="0.55" />
            </filter>
          </defs>

          <ellipse cx="390" cy="300" rx="310" ry="20" fill="#000" opacity="0.48" />
          <ellipse cx="390" cy="296" rx="270" ry="10" fill="url(#car-glow)" />

          <g filter="url(#car-shadow)">
            {/* Заднее антикрыло */}
            <g>
              <rect x="94" y="92" width="13" height="96" rx="6" fill="#0a1316" />
              <path
                d="M103 92h136c10 0 16 5 16 13v7H116c-14 0-24-7-24-17 0-2 3-3 11-3z"
                fill="url(#car-teal)"
              />
              <path d="M100 107h152l-2 8H105z" fill="#071013" opacity="0.75" />
              <rect x="188" y="112" width="16" height="83" rx="5" fill="url(#car-dark)" />
              <path d="M116 100h116" stroke="#04312c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </g>

            {/* Кузов */}
            <path
              d="M200 248c-9-17 3-36 32-45l66-20c19-24 47-42 83-48l48-2c23 0 41 12 51 33l16 38 154 29c25 5 38 13 42 24l-5 10-137 3c-11-33-32-50-59-50-30 0-50 20-59 55l-145 2c-53 0-79-12-87-29z"
              fill="url(#car-body)"
            />

            {/* Тёмные зоны и боковой понтон */}
            <path
              d="M263 236c26-22 67-33 119-35l64-1 15 47-129 5c-40 1-62-3-69-16z"
              fill="url(#car-dark)"
            />
            <path
              d="M253 252c54 12 131 12 239 5l29 13-260 4c-17 0-24-5-25-12z"
              fill="#050a0c"
            />
            <path
              d="M330 190c42 10 78 11 116 2l6 11c-42 9-83 9-128-3z"
              fill="url(#car-teal)"
              opacity="0.9"
            />
            <path d="M321 204c37 8 68 9 98 4" stroke="#7e9295" strokeWidth="2" opacity="0.5" />
            <path d="M480 192l16 46" stroke="#f4f9f8" strokeWidth="2" opacity="0.35" />
            <path d="M239 213c18-11 42-18 71-22" stroke="#ffffff" strokeWidth="2" opacity="0.45" />
            <path d="M502 218c35 3 87 10 147 22" stroke="#8fa1a4" strokeWidth="1.5" opacity="0.45" />

            {/* Воздухозаборник и капот */}
            <path
              d="M337 158c7-22 23-33 45-34l16 2-4 22-40 23z"
              fill="#0a1417"
            />
            <path d="M348 151c8-14 20-21 34-22" stroke="#3b5055" strokeWidth="2" fill="none" />

            {/* Кокпит */}
            <ellipse cx="422" cy="170" rx="29" ry="31" fill="#071013" />
            <path
              d="M375 189c5-33 22-54 47-54 27 0 44 19 49 53"
              fill="none"
              stroke="#0a1417"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M385 182c6-25 20-39 38-39 20 0 34 13 39 38"
              fill="none"
              stroke="#819497"
              strokeWidth="2"
              opacity="0.7"
            />
            <circle cx="423" cy="168" r="17" fill="url(#car-teal)" />
            <path d="M408 164c8-9 23-11 33-3" stroke="#06211f" strokeWidth="6" strokeLinecap="round" />
            <path d="M410 173c9 5 20 5 29-1" stroke="#05201e" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

            {/* Нос и капот */}
            <path
              d="M484 194c34 13 81 21 199 36 10 1 15 6 14 12l-3 7-214-25c-15-2-22-10-20-20 1-5 10-14 24-10z"
              fill="url(#car-body)"
            />
            <path
              d="M515 205c54 7 111 16 174 27"
              stroke="#f6fbfa"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.42"
            />

            {/* Переднее антикрыло */}
            <g>
              <rect x="734" y="218" width="11" height="70" rx="5" fill="#0a1417" />
              <path
                d="M623 254h122c7 0 11 4 11 9v7H629c-8 0-13-5-13-11 0-3 3-5 7-5z"
                fill="url(#car-teal)"
              />
              <path d="M634 271h117v6H644c-6 0-9-2-10-6z" fill="#c8d3d4" opacity="0.5" />
            </g>

            {/* Звёздочка на носу */}
            <g transform="translate(612 225)" opacity="0.85">
              <circle r="9" fill="none" stroke="#06302c" strokeWidth="1.2" />
              <path d="M0-7V0m0 0 6 4.2M0 0l-6 4.2" stroke="#06302c" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Номер */}
            <text
              x="513"
              y="240"
              fill="#173033"
              fontFamily="Unbounded, sans-serif"
              fontSize="19"
              fontWeight="800"
              opacity="0.5"
            >
              01
            </text>

            {/* Задний диффузор */}
            <path d="M150 268h92l18 18h-100z" fill="#050a0c" />
            <path d="M163 276h80M170 283h76" stroke="#24363a" strokeWidth="2" />
            <path d="M249 265h250l13 12H259z" fill="#050a0c" />

            {/* Заднее колесо */}
            <g>
              <circle cx="250" cy="246" r="63" fill="url(#car-tire)" stroke="#1b292d" strokeWidth="2" />
              <circle cx="250" cy="246" r="63" fill="none" stroke="#2b3b3f" strokeWidth="1" opacity="0.5" />
              <circle cx="250" cy="246" r="47" fill="#0a1214" />
              <circle cx="250" cy="246" r="40" fill="none" stroke="url(#car-teal)" strokeWidth="2.5" opacity="0.72" />
              <circle cx="250" cy="246" r="31" fill="url(#car-rim)" />
              <g className={styles.rim} style={{ transformOrigin: '250px 246px' }}>
                <path
                  d="M250 222v48M229 234l42 24M229 258l42-24M232 246h36"
                  stroke="#203135"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="250" cy="246" r="9" fill="#0b181a" stroke="#4b6266" strokeWidth="2" />
              <circle cx="250" cy="246" r="3" fill="#2ef2d6" />
            </g>

            {/* Переднее колесо */}
            <g>
              <circle cx="568" cy="249" r="55" fill="url(#car-tire)" stroke="#1b292d" strokeWidth="2" />
              <circle cx="568" cy="249" r="41" fill="#0a1214" />
              <circle cx="568" cy="249" r="35" fill="none" stroke="url(#car-teal)" strokeWidth="2.2" opacity="0.7" />
              <circle cx="568" cy="249" r="27" fill="url(#car-rim)" />
              <g className={styles.rimFront} style={{ transformOrigin: '568px 249px' }}>
                <path
                  d="M568 228v42M550 238l36 21M550 260l36-21"
                  stroke="#203135"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="568" cy="249" r="8" fill="#0b181a" stroke="#4b6266" strokeWidth="2" />
              <circle cx="568" cy="249" r="2.6" fill="#2ef2d6" />
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
        Нажми на болид — заведём мотор!
      </div>
    </div>
  )
}
