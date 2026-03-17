import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, easeInOut } from 'framer-motion'
import { useFollowCursor } from '../hooks/useFollowCursor'

type Mood = 'idle' | 'excited' | 'cunning' | 'sarcastic' | 'curious' | 'angry' | 'happy'

const moodVariants = {
  idle: {
    rotate: [0, 1.8, -1.8, 0],
    y: [0, -6, 0],
    scale: 1,
    transition: { duration: 5, ease: easeInOut, repeat: Infinity }
  },
  excited: {
    rotate: [0, 5, -5, 0],
    y: [0, -18, 0],
    scale: 1.08,
    transition: { duration: 0.6, ease: easeInOut, repeat: Infinity }
  },
  cunning: {
    rotate: [0, 2, -2, 0],
    y: [0, -8, 0],
    scale: 1.03,
    transition: { duration: 4, ease: easeInOut, repeat: Infinity }
  },
  sarcastic: {
    rotate: [0, 1.2, -1.2, 0],
    y: [0, -4, 0],
    scale: 1.02,
    transition: { duration: 3.5, ease: easeInOut, repeat: Infinity }
  },
  curious: {
    rotate: [0, 3.5, -1.6, 0],
    y: [0, -10, 0],
    scale: 1.05,
    transition: { duration: 0.9, ease: easeInOut, repeat: Infinity }
  },
  angry: {
    rotate: [0, 8, 0],
    y: [0, -12, 0],
    scale: 1.06,
    transition: { duration: 0.5, ease: easeInOut, repeat: Infinity }
  },
  happy: {
    rotate: [0, 2, -2, 0],
    y: [0, -14, 0],
    scale: 1.1,
    transition: { duration: 0.8, ease: easeInOut, repeat: Infinity }
  }
}

const canonicalTransitions: Record<Mood, Mood[]> = {
  idle: ['cunning', 'sarcastic', 'happy'],
  excited: ['happy', 'cunning'],
  cunning: ['sarcastic', 'curious', 'excited'],
  sarcastic: ['cunning', 'angry'],
  curious: ['cunning', 'happy'],
  angry: ['cunning', 'sarcastic'],
  happy: ['cunning', 'idle']
}

const SMARTCHAIN_ACTIVE = true

const nextMood = (current: Mood, target?: Mood): Mood => {
  if (target && target !== current) return target

  const options = SMARTCHAIN_ACTIVE
    ? canonicalTransitions[current]
    : canonicalTransitions[current]

  // Smartchain: pick a next mood with soft curve bias
  const idx = Math.floor(Math.pow(Math.random(), 0.7) * options.length)
  return options[idx]
}

export function AnimatedLucy() {
  const rootRef = useRef<HTMLDivElement>(null!)
  const [mood, setMood] = useState<'idle' | 'excited' | 'cunning' | 'sarcastic' | 'curious' | 'angry' | 'happy'>('cunning')
  const [showThought, setShowThought] = useState(false)

  const reducedMotion = useReducedMotion()
  const lucyRef = useRef<HTMLDivElement>(null!)
  const { x: followX, y: followY } = useFollowCursor(rootRef, { maxDistance: 6 })

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMood((current) => nextMood(current))
    }, 6000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'enter' || key === 'k') {
        setMood('excited')
        setShowThought(true)

        window.setTimeout(() => {
          setShowThought(false)
          setMood('cunning')
        }, 1500)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const links = Array.from(document.querySelectorAll<HTMLElement>('.nav-link'))
    const onEnter = () => setMood('curious')
    const onLeave = () => setMood('cunning')

    links.forEach((link) => {
      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener('mouseenter', onEnter)
        link.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  const activeVariant = mood
  const shouldReduce = reducedMotion

  return (
    <section className="relative pt-16 pb-14 px-4 md:px-8" style={{ minHeight: 520 }}>
      <div ref={rootRef} className="mx-auto relative w-full max-w-2xl">
        <motion.div
          className="relative w-full max-w-md mx-auto"
          style={{ x: followX, y: followY, transformOrigin: '50% 50%' }}
          variants={moodVariants}
          animate={activeVariant}
          initial="idle"
          transition={shouldReduce ? { duration: 0.01 } : undefined}
        >
          <img
            src="/lucy-character.png"
            alt="Lucy character"
            className="w-full h-auto object-contain"
            style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.2))' }}
          />

          <motion.svg
            className="absolute"
            width="80"
            height="40"
            viewBox="0 0 80 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ top: '42%', left: '52%', x: followX, y: followY, transform: 'translate(-50%, -50%)' }}
          >
            <g>
              <ellipse cx="20" cy="20" rx="11" ry="7" fill="#fff" stroke="#2C2C2C" strokeWidth="2" />
              <ellipse cx="60" cy="20" rx="11" ry="7" fill="#fff" stroke="#2C2C2C" strokeWidth="2" />
              <circle cx="20" cy="20" r="3" fill="#2C2C2C" />
              <circle cx="60" cy="20" r="3" fill="#2C2C2C" />
            </g>
          </motion.svg>

          <AnimatePresence>
            {showThought && (
              <motion.div
                className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl border-2 border-[#2C2C2C] bg-white px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: -10, scale: 0.92 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ duration: 0.24 }}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.86rem' }}
              >
                Би чамайг авна гэдгийг мэдэж байсан юм!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="mt-10 flex gap-4 justify-center" style={{ zIndex: 10 }}>
        <button
          id="qpay-buy-btn"
          className="relative overflow-hidden rounded-full px-10 py-4 bg-[#A68A64] border-2 border-[#2C2C2C] text-[#2C2C2C] font-semibold"
          style={{ boxShadow: '0 8px 0 #2C2C2C' }}
          onMouseEnter={() => {
            setMood('excited')
            setShowThought(true)
          }}
          onMouseLeave={() => {
            setShowThought(false)
            setMood('cunning')
          }}
        >
          QPay Buy
          <span className="absolute inset-0 block rounded-full" style={{ opacity: 0 }} />
        </button>

        <button
          id="cta-get-in-touch"
          className="rounded-full px-10 py-4 bg-[#C9A968] border-2 border-white text-[#2C2C2C] font-semibold"
          style={{ boxShadow: '0 8px 0 rgba(255,255,255,1)' }}
          onMouseEnter={() => setMood('happy')}
          onMouseLeave={() => setMood('cunning')}
        >
          Get In Touch
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 px-4 py-3 rounded-2xl border border-[#2C2C2C] bg-[#FAF7F2]">
          <h3 className="text-base font-semibold mb-2">Lucy Mood Selector (dev)</h3>
          <div className="flex flex-wrap gap-2">
            {(['idle', 'excited', 'cunning', 'sarcastic', 'curious', 'angry', 'happy'] as Mood[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setMood(mode)}
                className={`px-3 py-1 rounded-full border ${mode === mood ? 'bg-[#C9A968] text-[#1B263B]' : 'bg-white text-[#2C2C2C]'} border-[#2C2C2C]`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        #qpay-buy-btn:hover {
          transform: scale(1.03);
          transition: transform 0.24s ease;
        }

        #qpay-buy-btn::before {
          content: '';
          pointer-events: none;
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          background: rgba(255,255,255,0.36);
          transition: transform 0.45s ease, opacity 0.45s ease;
          opacity: 0;
        }

        #qpay-buy-btn:hover::before {
          transform: translate(-50%, -50%) scale(4);
          opacity: 1;
        }
      `}</style>
    </section>
  )
}

