import { useEffect, useRef } from 'react'

export function useScrollDirection(headerRef) {
  const lastScrollY = useRef(0)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    header.style.transition = 'transform 300ms'
    header.style.transform = 'translateY(0)'

    const handleScroll = () => {
      const currentY = window.scrollY

      if (currentY < 10) {
        header.style.transform = 'translateY(0)'
      } else if (currentY > lastScrollY.current) {
        header.style.transform = 'translateY(-100%)'
      } else if (currentY < lastScrollY.current) {
        header.style.transform = 'translateY(0)'
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headerRef])
}
