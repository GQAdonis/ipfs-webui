// jsdom 30 implements the element but not showModal/close. This unit-only model
// supports lifecycle assertions; it deliberately does not pretend to provide
// the browser top layer, focus trapping, inertness or native keyboard behavior.
export function installNativeDialogFixture () {
  const prototype = globalThis.HTMLDialogElement?.prototype
  if (!prototype || typeof prototype.showModal === 'function') return
  Object.defineProperties(prototype, {
    showModal: {
      configurable: true,
      value () {
        this.setAttribute('open', '')
        this.querySelector('[autofocus],button:not(:disabled),input:not(:disabled),[tabindex="0"]')?.focus()
      }
    },
    close: { configurable: true, value () { this.removeAttribute('open') } }
  })
}
