import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './ProgressRing.module.scss'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  caption?: string
  accent?: string
}

export function ProgressRing({
  value,
  size = 132,
  stroke = 8,
  caption,
  accent = 'var(--teal)',
}: ProgressRingProps) {
  const gradientId = useId()
  const reduceMotion = useReducedMotion()
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const offset = circumference - (clamped / 100) * circumference
  const fontSize = Math.max(15, Math.min(30, Math.round(size * 0.26)))

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" className={styles.svg} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#7bfff0" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} className={styles.track} strokeWidth={stroke} />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduceMotion ? offset : circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduceMotion ? 0 : 1, ease: [0.22, 1, 0.36, 1] }}
          className={styles.value}
        />
      </svg>
      <div className={styles.center} style={{ width: size - stroke * 3, height: size - stroke * 3 }}>
        <strong style={{ fontSize }}>{clamped}%</strong>
        {caption && <span>{caption}</span>}
      </div>
    </div>
  )
}
