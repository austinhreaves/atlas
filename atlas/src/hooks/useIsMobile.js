import { useEffect, useState } from 'react'

export const MOBILE_BREAKPOINT_PX = 768

function computeIsMobile(breakpointPx) {
  if (typeof window === 'undefined') {
    return false
  }
  return window.innerWidth < breakpointPx
}

export default function useIsMobile(breakpointPx = MOBILE_BREAKPOINT_PX) {
  const [isMobile, setIsMobile] = useState(() => computeIsMobile(breakpointPx))

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia
      ? window.matchMedia(`(max-width: ${Math.max(0, breakpointPx - 1)}px)`)
      : null

    const update = () => {
      setIsMobile(computeIsMobile(breakpointPx))
    }

    update()

    if (mediaQuery) {
      mediaQuery.addEventListener('change', update)
    }
    window.addEventListener('resize', update)

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', update)
      }
      window.removeEventListener('resize', update)
    }
  }, [breakpointPx])

  return isMobile
}
