import { useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  suffix?: string
}

export function AnimatedNumber({ value, suffix = '' }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const previous = useRef(value)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      previous.current = value
      return
    }
    const controls = animate(previous.current, value, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    previous.current = value
    return () => controls.stop()
  }, [value, reduceMotion])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}
