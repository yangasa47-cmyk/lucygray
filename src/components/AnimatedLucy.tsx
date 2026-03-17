import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, easeInOut } from 'framer-motion'
import { useFollowCursor } from '../hooks/useFollowCursor'

type Mood = 'idle' | 'excited' | 'cunning' | 'sarcastic' | 'curious' | 'angry' | 'happy'

const moodVariants = {
  idle: { rotate: [0, 1.8, -1.8, 0], y: [0, -6, 0], scale: 1, transition: { duration: 5, ease: easeInOut, repeat: Infinity } },
  excited: { rotate: [0, 5, -5, 0], y: [0, -18, 0], scale: 1.08, transition: { duration: 0.6, ease: easeInOut, repeat: Infinity } },
  cunning: { rotate: [0, 2, -2, 0], y: [0, -8, 0], scale: 1.03, transition: { duration: 4, ease: easeInOut, repeat: Infinity } },
  sarcastic: { rotate: [0, 1.2, -1.2, 0], y: [0, -4, 0], scale: 1.02, transition: { duration: 3.5, ease: easeInOut, repeat: Infinity } },
  curious: { rotate: [0, 3.5, -1.6, 0], y: [0, -10, 0], scale: 1.05, transition: { duration: 0.9, ease: easeInOut, repeat: Infinity } },
  angry: { rotate: [0, 8, 0], y: [0, -12, 0], scale: 1.06, transition: { duration: 0.5, ease: easeInOut, repeat: Infinity } },
  happy: { rotate: [0, 2, -2, 0], y: [0, -14, 0], scale: 1.1, transition: { duration: 0.8, ease: easeInOut, repeat: Infinity } },
  success: { rotate: [0, 2.5, -2.5, 0], y: [0, -22, 0], scale: [1.05, 1.15, 1.05], transition: { duration: 0.7, ease: easeInOut, repeat: Infinity } }
}

const moodMessages: Record<Mood, string> = {
  idle: 'Чи ер нь хөдлөх үү, эсвэл би ингээд л хөвөөд байх уу?',
  excited: 'Би чамайг "Тийм" гэж хэлнэ гэдгийг аль эрт мэдэрсэн юм!',
  cunning: 'Миний зальжин ухаан чиний дараагийн алхмыг хэдийнэ таачихсан шүү.',
  sarcastic: 'Өө, ямар хурдан юм бэ... Бараг л яст мэлхий шиг.',
  curious: 'Тэр хаалганы цаана юу байгааг харах гээ юу? Сонирхолтой л юм.',
  angry: 'Харин чиний огт мэддэггүй талдаа орохоос өмнө анхаар.',
  happy: 'За, чи одоо надаар бахархаж байна.',
  success: 'Амжилттай! Одоо татаж авах товчлуур дээр дар.'
}

function getRandomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function AnimatedLucy() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [mood, setMood] = useState<Mood>('cunning')
  const [showThought, setShowThought] = useState(false)
  const [successGlow, setSuccessGlow] = useState(false)
  const reducedMotion = useReducedMotion()

  const { x: followX, y: followY } = useFollowCursor(rootRef, { maxDistance: 6 })

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (mood !== 'success') {
        setMood((current) => {
          const candidates: Mood[] = ['cunning', 'sarcastic', 'curious', 'happy']
          return getRandomChoice(candidates)
        })
      }
    }, 6500)
    return () => window.clearInterval(timer)
  }, [mood])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'enter' || key === 'k') {
        setMood('excited')
        setShowThought(true)
        setTimeout(() => {
          setShowThought(false)
          setMood('cunning')
        }, 1500)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const qpayHoverIn = () => {
      setMood('excited')
      setShowThought(true)
      setTimeout(() => setShowThought(false), 1200)
    }
    const qpayHoverOut = () => setMood('cunning')
    const qpayNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-action="qpay-buy"]'))
    qpayNodes.forEach((node) => {
      node.addEventListener('mouseenter', qpayHoverIn)
      node.addEventListener('mouseleave', qpayHoverOut)
    })

    const navHoverIn = () => setMood('curious')
    const navHoverOut = () => setMood('cunning')
    const navNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-action="nav-link"]'))
    navNodes.forEach((node) => {
      node.addEventListener('mouseenter', navHoverIn)
      node.addEventListener('mouseleave', navHoverOut)
    })

    return () => {
      qpayNodes.forEach((node) => {
        node.removeEventListener('mouseenter', qpayHoverIn)
        node.removeEventListener('mouseleave', qpayHoverOut)
      })
      navNodes.forEach((node) => {
        node.removeEventListener('mouseenter', navHoverIn)
        node.removeEventListener('mouseleave', navHoverOut)
      })
    }
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('status') === 'success') {
      setMood('success')
      setSuccessGlow(true)
      setShowThought(true)
      setTimeout(() => setShowThought(false), 2700)
      const id = window.setTimeout(() => {
        setMood('idle')
        setSuccessGlow(false)
      }, 10000)
      return () => window.clearTimeout(id)
    }
  }, [])

  const activeVariant = reducedMotion ? 'idle' : mood

  return (
    <section className="relative pt-16 pb-14 px-4 md:px-8 min-h-[520px]" style={{ backgroundColor: '#f2f9ff' }}>
      <div ref={rootRef} className="mx-auto relative w-full max-w-2xl">
        <motion.div
          className="relative w-full max-w-md mx-auto"
          style={{
            x: reducedMotion ? 0 : followX,
            y: reducedMotion ? 0 : followY,
            transformOrigin: '50% 50%',
            boxShadow: successGlow ? '0 0 32px rgba(0, 183, 255, 0.55)' : undefined
          }}
          variants={moodVariants}
          animate={activeVariant}
          initial="idle"
          transition={reducedMotion ? { duration: 0.1 } : undefined}
        >
          <img
            src="/lucy-character.png"
            alt="Lucy character"
            className="w-full h-auto object-contain rounded-2xl"
            style={{ filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.25))' }}
          />

          <motion.svg
            className="absolute"
            width="90"
            height="44"
            viewBox="0 0 90 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ top: '42%', left: '51.5%', x: reducedMotion ? 0 : followX, y: reducedMotion ? 0 : followY, transform: 'translate(-50%, -50%)' }}
          >
            <g>
              <ellipse cx="24" cy="22" rx="12" ry="7.2" fill="#fff" stroke="#2C2C2C" strokeWidth="2" />
              <ellipse cx="66" cy="22" rx="12" ry="7.2" fill="#fff" stroke="#2C2C2C" strokeWidth="2" />
              <circle cx="24" cy="22" r="3.4" fill="#2C2C2C" />
              <circle cx="66" cy="22" r="3.4" fill="#2C2C2C" />
            </g>
          </motion.svg>

          <AnimatePresence>
            {showThought && (
              <motion.div
                className="absolute -top-16 left-1/2 -translate-x-1/2 rounded-2xl border-2 border-[#2C2C2C] bg-white px-4 py-2 shadow-lg"
                initial={{ opacity: 0, y: -10, scale: 0.92 }}
                animate={{ opacity: 1, y: -20, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ duration: 0.22 }}
                style={{ fontFamily: "'Patrick Hand', 'Indie Flower', cursive", fontSize: '0.92rem' }}
              >
                {moodMessages[mood]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {mood === 'success' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={`confetti-${i}`}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: [1, 0], y: [0, -90 - i * 6], x: [0, i % 2 === 0 ? -20 : 20] }}
                transition={{ duration: 1.1 + i * 0.08, repeat: Infinity, repeatType: 'loop' }}
                className="block w-2 h-2 rounded-full bg-[#0077b6]"
                style={{
                  position: 'absolute',
                  left: `${20 + i * 8}%`,
                  top: '20%',
                  backgroundColor: ['#0077b6', '#4a5d23', '#f6c13a', '#ff5f7d'][i % 4],
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 flex gap-4 justify-center" style={{ zIndex: 10 }}>
        <button
          data-action="qpay-buy"
          className="relative overflow-hidden rounded-full px-10 py-4 bg-[#A68A64] border-2 border-[#2C2C2C] text-[#2C2C2C] font-semibold drop-shadow-md"
          onMouseEnter={() => {
            setMood('excited')
            setShowThought(true)
            setTimeout(() => setShowThought(false), 1200)
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
          data-action="nav-link"
          className="rounded-full px-10 py-4 bg-[#C9A968] border-2 border-white text-[#2C2C2C] font-semibold drop-shadow-md"
          onMouseEnter={() => setMood('curious')}
          onMouseLeave={() => setMood('cunning')}
        >
          Get In Touch
        </button>

        <button
          id="cta-get-in-touch"
          data-action="download-access"
          className="rounded-full px-10 py-4 bg-[#C9A968] border-2 border-white text-[#2C2C2C] font-semibold"
          style={{
            boxShadow: "0 8px 0 rgba(255,255,255,1)",
            position: "relative",
            overflow: "hidden",
            transition: "transform 0.25s ease, box-shadow 0.25s ease"
          }}
          onMouseEnter={() => setMood("happy")}
          onMouseLeave={() => setMood("cunning")}
        >
          Get in Touch / Download
        </button>
      </div>

      <style jsx>{`
        .download-access-btn:hover {
          transform: translateY(-2px);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .download-access-btn::after {
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
          transition: opacity 0.25s ease, transform .25s ease;
          z-index: 0;
        }

        #qpay-buy-btn:hover::before {
          transform: translate(-50%, -50%) scale(1.15);
          opacity: 1;
        }
      `}</style>
    </section>
  )
}

