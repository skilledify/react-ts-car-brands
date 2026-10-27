type SoundName = 'click' | 'correct' | 'wrong' | 'star' | 'rev' | 'finish'

class AudioEngine {
  private context: AudioContext | null = null
  private enabled = true

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled) {
      window.speechSynthesis?.cancel()
    }
  }

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.context) {
      const AudioCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtor) return null
      this.context = new AudioCtor()
    }
    if (this.context.state === 'suspended') {
      void this.context.resume()
    }
    return this.context
  }

  private tone(
    context: AudioContext,
    {
      frequency,
      startsAt,
      duration,
      type = 'sine',
      volume = 0.08,
      endFrequency,
    }: {
      frequency: number
      startsAt: number
      duration: number
      type?: OscillatorType
      volume?: number
      endFrequency?: number
    },
  ) {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, startsAt)
    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), startsAt + duration)
    }
    gain.gain.setValueAtTime(0.0001, startsAt)
    gain.gain.exponentialRampToValueAtTime(volume, startsAt + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(startsAt)
    oscillator.stop(startsAt + duration + 0.03)
  }

  play(name: SoundName) {
    if (!this.enabled) return
    const context = this.ensureContext()
    if (!context) return
    const now = context.currentTime

    switch (name) {
      case 'click':
        this.tone(context, { frequency: 720, startsAt: now, duration: 0.07, volume: 0.035 })
        break
      case 'correct':
        ;[660, 880, 1320].forEach((frequency, index) => {
          this.tone(context, {
            frequency,
            startsAt: now + index * 0.075,
            duration: 0.22,
            type: 'triangle',
            volume: 0.06,
          })
        })
        break
      case 'wrong':
        this.tone(context, {
          frequency: 190,
          endFrequency: 95,
          startsAt: now,
          duration: 0.32,
          type: 'sawtooth',
          volume: 0.045,
        })
        break
      case 'star':
        ;[1046, 1318, 1568, 2093].forEach((frequency, index) => {
          this.tone(context, {
            frequency,
            startsAt: now + index * 0.05,
            duration: 0.3,
            volume: 0.035,
          })
        })
        break
      case 'rev':
        this.rev(context, now)
        break
      case 'finish':
        ;[523, 659, 784, 1046, 1318].forEach((frequency, index) => {
          this.tone(context, {
            frequency,
            startsAt: now + index * 0.11,
            duration: 0.4,
            type: 'triangle',
            volume: 0.06,
          })
        })
        break
    }
  }

  private rev(context: AudioContext, now: number) {
    const engine = context.createOscillator()
    const rumble = context.createOscillator()
    const filter = context.createBiquadFilter()
    const gain = context.createGain()

    engine.type = 'sawtooth'
    rumble.type = 'square'
    filter.type = 'lowpass'
    filter.Q.value = 8
    filter.frequency.setValueAtTime(360, now)
    filter.frequency.linearRampToValueAtTime(1700, now + 0.24)
    filter.frequency.linearRampToValueAtTime(280, now + 0.9)

    engine.frequency.setValueAtTime(58, now)
    engine.frequency.linearRampToValueAtTime(195, now + 0.22)
    engine.frequency.exponentialRampToValueAtTime(72, now + 0.92)
    rumble.frequency.setValueAtTime(29, now)
    rumble.frequency.linearRampToValueAtTime(52, now + 0.3)
    rumble.frequency.exponentialRampToValueAtTime(30, now + 0.9)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95)

    engine.connect(filter)
    rumble.connect(filter)
    filter.connect(gain)
    gain.connect(context.destination)
    engine.start(now)
    rumble.start(now)
    engine.stop(now + 1)
    rumble.stop(now + 1)
  }

  speak(text: string, lang = 'en-US') {
    if (!this.enabled || typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.82
    utterance.pitch = 1.05
    window.speechSynthesis.speak(utterance)
  }
}

export const audio = new AudioEngine()
