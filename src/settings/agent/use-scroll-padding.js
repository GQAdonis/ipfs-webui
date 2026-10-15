import { useEffect } from 'react'

/**
 * The page scrolls the document, not the form, so the form's own
 * `scroll-padding-bottom` (the measured height of its sticky ApplyBar) does not
 * protect a focused field from sitting under the bar (WCAG 2.2 criterion 2.4.11,
 * Focus Not Obscured). This copies the form's value onto the scrolling element
 * while the form is mounted, and puts the previous value back on unmount.
 *
 * @param {React.RefObject<HTMLElement>} sectionRef an ancestor of the ApplyForm
 */
export function useDocumentScrollPadding (sectionRef) {
  useEffect(() => {
    const form = sectionRef.current?.querySelector('.pm-apply-form')
    const root = globalThis.document?.documentElement
    if (!(form instanceof HTMLElement) || !root) return undefined
    const before = root.style.scrollPaddingBottom
    // The bar may sit above the chat launcher: keep that lift in the padding too.
    const copy = () => { root.style.scrollPaddingBottom = `calc(${form.style.scrollPaddingBottom || '0px'} + var(--ac-bar-lift, 0px))` }
    copy()
    if (typeof MutationObserver === 'undefined') return () => { root.style.scrollPaddingBottom = before }
    const observer = new MutationObserver(copy)
    observer.observe(form, { attributes: true, attributeFilter: ['style'] })
    return () => {
      observer.disconnect()
      root.style.scrollPaddingBottom = before
    }
  }, [sectionRef])
}
