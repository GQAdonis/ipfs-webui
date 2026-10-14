import React, { createContext, useContext, useLayoutEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import './primitives.css'

/** Sets the height the form reserves for the bar (px). */
const ApplyBarContext = createContext(/** @type {((height: number) => void) | null} */ (null))

/**
 * A form that reserves room for its sticky ApplyBar: its `scroll-padding-bottom`
 * always equals the bar's measured height, so a focused field that scrolls
 * into view is never hidden behind the bar (WCAG 2.2 criterion 2.4.11, Focus
 * Not Obscured). The padding applies when this form is the scroll container;
 * a page that scrolls the form inside another container must copy the same
 * value (the `--pm-apply-bar-height` custom property carries it) onto that
 * container.
 *
 * @param {React.FormHTMLAttributes<HTMLFormElement>} props
 */
export const ApplyForm = ({ className, style, children, ...props }) => {
  const [barHeight, setBarHeight] = useState(0)
  const formStyle = /** @type {React.CSSProperties} */ ({
    ...style,
    scrollPaddingBottom: `${barHeight}px`,
    '--pm-apply-bar-height': `${barHeight}px`
  })
  return (
    <ApplyBarContext.Provider value={setBarHeight}>
      <form className={classNames('pm-apply-form', className)} style={formStyle} {...props}>
        {children}
      </form>
    </ApplyBarContext.Provider>
  )
}

/**
 * The sticky bar that carries a form's outcome and its actions: a status line
 * on the left, the Apply and Revert buttons on the right. It reports its
 * height to the enclosing ApplyForm and re-reports when it resizes (a longer
 * status wraps the bar to two lines on a narrow screen).
 *
 * @param {Object} props
 * @param {string} props.label accessible name of the bar
 * @param {React.ReactNode} [props.status] usually a StatusLine
 * @param {React.ReactNode} props.children the action buttons
 * @param {string} [props.className]
 */
export const ApplyBar = ({ label, status, children, className }) => {
  const reportHeight = useContext(ApplyBarContext)
  const ref = useRef(/** @type {HTMLDivElement | null} */ (null))

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !reportHeight) return undefined
    const measure = () => reportHeight(el.getBoundingClientRect().height)
    measure()
    if (typeof ResizeObserver === 'undefined') return () => reportHeight(0)
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => {
      observer.disconnect()
      reportHeight(0)
    }
  }, [reportHeight])

  return (
    <div ref={ref} role='group' aria-label={label} className={classNames('pm-apply-bar', className)}>
      <div className='pm-apply-status'>{status}</div>
      <div className='pm-apply-actions'>{children}</div>
    </div>
  )
}
