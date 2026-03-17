import { useEffect } from 'react'
import { useMotionValue, useReducedMotion } from 'framer-motion'

interface FollowCursorOptions {
  maxDistance?: number
  defaultX?: number
  defaultY?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function useFollowCursor(
  rootRef: React.RefObject<HTMLElement>,
  options: FollowCursorOptions = {}
) {
  const { maxDistance = 8, defaultX = 0, defaultY = 0 } = options
  const reducedMotion = useReducedMotion()

  const x = useMotionValue(defaultX)
  const y = useMotionValue(defaultY)

  useEffect(() => {
    if (reducedMotion || !rootRef.current) {
      x.set(0)
      y.set(0)
      return
    }

    const onMouseMove = (event: MouseEvent) => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const normX = clamp((event.clientX - centerX) / (rect.width * 0.5), -1, 1)
      const normY = clamp((event.clientY - centerY) / (rect.height * 0.5), -1, 1)

      x.set(normX * maxDistance)
      y.set(normY * maxDistance)
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [rootRef, x, y, maxDistance, reducedMotion])

  return { x, y, reducedMotion }
}
