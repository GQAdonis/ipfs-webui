import { useLayoutEffect, useState } from 'react'

// react-virtualized 10 owns window scrolling. Measure only the DOM width here;
// no legacy component-instance lookup or replacement scroll container is needed.
export function useListWidth (containerRef, enabled = true) {
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    if (!enabled) return
    const element = containerRef.current
    if (!element) return
    const measure = () => setWidth(element.getBoundingClientRect().width)
    measure()
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      return () => observer.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [containerRef, enabled])
  return width
}
