import { useEffect } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Background } from './components/Background'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CollectionPage } from './pages/CollectionPage'
import { GaragePage } from './pages/GaragePage'
import { HomePage } from './pages/HomePage'
import { QuizPage } from './pages/QuizPage'
import { RacePage } from './pages/RacePage'
import { AppProvider } from './state/AppContext'
import styles from './App.module.scss'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <MotionConfig reducedMotion="user">
      <AppProvider>
        <div className={styles.app}>
          <a className={styles.skipLink} href="#main">
            Перейти к содержимому
          </a>
          <Background />
          <Header />

          <main id="main" className={styles.main} tabIndex={-1}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/garage" element={<GaragePage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/race" element={<RacePage />} />
                  <Route path="/collection" element={<CollectionPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </AppProvider>
    </MotionConfig>
  )
}
