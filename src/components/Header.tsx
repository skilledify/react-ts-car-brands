import { motion } from 'framer-motion'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  CarFront,
  CircleHelp,
  Flag,
  Home,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  type LucideIcon,
} from 'lucide-react'
import { audio } from '../lib/audio'
import { useApp } from '../state/AppContext'
import { AnimatedNumber } from './AnimatedNumber'
import { Logo } from './Logo'
import styles from './Header.module.scss'

interface NavItem {
  path: string
  label: string
  shortLabel: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { path: '/', label: 'Главная', shortLabel: 'Старт', icon: Home },
  { path: '/garage', label: 'Гараж', shortLabel: 'Гараж', icon: CarFront },
  { path: '/quiz', label: 'Викторина', shortLabel: 'Квиз', icon: CircleHelp },
  { path: '/race', label: 'Пит-стоп', shortLabel: 'Гонка', icon: Flag },
  { path: '/collection', label: 'Коллекция', shortLabel: 'Призы', icon: Trophy },
]

export function Header() {
  const navigate = useNavigate()
  const { progress, setSound } = useApp()

  const toggleSound = () => {
    const next = !progress.soundOn
    setSound(next)
    audio.setEnabled(next)
    if (next) audio.play('click')
  }

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Logo onClick={() => navigate('/')} compact />

          <nav className={styles.nav} aria-label="Основная навигация">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={() => audio.play('click')}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className={styles.activePill}
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <Icon size={16} strokeWidth={2.3} aria-hidden="true" />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.stars}
              onClick={() => navigate('/collection')}
              aria-label={`У тебя ${progress.stars} звёзд. Открыть коллекцию`}
            >
              <Star size={16} fill="currentColor" strokeWidth={1.8} aria-hidden="true" />
              <motion.span key={progress.stars} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <AnimatedNumber value={progress.stars} />
              </motion.span>
            </button>

            <button
              type="button"
              className={styles.sound}
              onClick={toggleSound}
              aria-pressed={progress.soundOn}
              aria-label={progress.soundOn ? 'Выключить звук' : 'Включить звук'}
              title={progress.soundOn ? 'Выключить звук' : 'Включить звук'}
            >
              {progress.soundOn ? (
                <Volume2 size={19} strokeWidth={2.1} aria-hidden="true" />
              ) : (
                <VolumeX size={19} strokeWidth={2.1} aria-hidden="true" />
              )}
              <span className={styles.soundDot} data-on={progress.soundOn} />
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.mobileNav} aria-label="Мобильная навигация">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `${styles.mobileItem} ${isActive ? styles.mobileActive : ''}`
              }
              onClick={() => audio.play('click')}
              aria-label={item.label}
            >
              <span className={styles.mobileIcon}>
                <Icon size={21} strokeWidth={2.1} aria-hidden="true" />
              </span>
              <span>{item.shortLabel}</span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
