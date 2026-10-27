import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Для GitHub Pages базовый путь задаётся переменной VITE_BASE в workflow.
// Локально приложение живёт в корне.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
