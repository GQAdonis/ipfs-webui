import React, { useLayoutEffect, useRef, useState } from 'react'

// Virtualized tables still own height and scrolling; only their available width
// is measured here. Each mounted table disposes its observer on removal.
/** @param {{ children: (size: { width: number }) => import('react').ReactNode, disableHeight?: boolean }} props */
export default function AutoSizer ({ children }) {
  const container = useRef(/** @type {HTMLDivElement | null} */ (null))
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const measure = () => setWidth(container.current?.getBoundingClientRect().width || 0)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={container} style={{ width: '100%', minWidth: 0 }}>{width > 0 && children({ width })}</div>
}
