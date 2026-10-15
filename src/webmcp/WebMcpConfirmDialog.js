import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { decide, denyAll, getLastDecision, getPending, subscribe as subscribeQueue } from './confirmation-queue.js'
import { getSettings, subscribe as subscribeSettings, updateSettings } from './settings-store.js'
import { isTrustedEvent } from './trust.js'
import { useStore } from './use-store.js'
import './webmcp.css'

/** Approve acts only after the request has been on screen this long. */
export const ARM_MS = 1000
const PREVIEW_LABEL = 'content_preview'
const PORTAL_ID = 'webmcp-portal'

/**
 * The dialog lives in its own node under <body>, outside the app root, so the app root can
 * be made inert while a request is open without making the dialog inert with it.
 *
 * @returns {HTMLElement}
 */
function getPortalRoot () {
  const doc = globalThis.document
  let el = doc.getElementById(PORTAL_ID)
  if (!el) {
    el = doc.createElement('div')
    el.id = PORTAL_ID
    doc.body.appendChild(el)
  }
  return el
}

/**
 * While `active`, every other child of <body> is inert and hidden from assistive technology,
 * so nothing behind the dialog can be focused or activated. The previous state is restored.
 *
 * @param {boolean} active
 */
function useInertBackground (active) {
  useEffect(() => {
    if (!active) return undefined
    const portal = getPortalRoot()
    const saved = Array.from(globalThis.document.body.children)
      .filter((el) => el !== portal)
      .map((el) => ({ el, inert: el.getAttribute('inert'), hidden: el.getAttribute('aria-hidden') }))
    saved.forEach(({ el }) => {
      el.setAttribute('inert', '')
      el.setAttribute('aria-hidden', 'true')
    })
    return () => {
      saved.forEach(({ el, inert, hidden }) => {
        if (inert === null) el.removeAttribute('inert')
        else el.setAttribute('inert', inert)
        if (hidden === null) el.removeAttribute('aria-hidden')
        else el.setAttribute('aria-hidden', hidden)
      })
    }
  }, [active])
}

/**
 * A cue in the tab title while a request waits, so a person in another tab or window sees
 * that the agent is blocked on them.
 *
 * @param {boolean} active
 * @param {string} cue
 */
function useTitleCue (active, cue) {
  useEffect(() => {
    if (!active) return undefined
    const doc = globalThis.document
    const original = doc.title
    const cued = `${cue} - ${original}`
    doc.title = cued
    return () => {
      if (doc.title === cued) doc.title = original
    }
  }, [active, cue])
}

/**
 * One labelled value. Values are already sanitized by the package (invisible and
 * direction-changing code points are shown as <U+XXXX>); this adds quotes so the edges of a
 * value are visible, and "Show full" for a value that was cut in the middle.
 *
 * @param {{ item: import('./vendor/index.js').ConfirmationTarget, t: import('i18next').TFunction }} props
 */
function ItemRow ({ item, t }) {
  const [showFull, setShowFull] = useState(false)
  const isFlag = item.value === 'yes' || item.value === 'no'
  const isNumber = /^[0-9]+$/.test(item.value)
  const plain = isFlag || isNumber
  const shown = showFull && item.full ? item.full : item.value
  return (
    <div className='webmcp-row'>
      <dt className='webmcp-label'>{t(`labels.${item.label}`, { defaultValue: item.label })}</dt>
      <dd className={`ma0 f6 ${plain ? '' : 'webmcp-value'}`}>
        {isFlag ? t(`values.${item.value}`) : (plain ? shown : `"${shown}"`)}
        {item.full && (
          <button
            type='button'
            className='webmcp-link db mt1'
            aria-expanded={showFull}
            onClick={() => setShowFull(!showFull)}>
            {showFull ? t('dialog.showShort') : t('dialog.showFull')}
          </button>
        )}
        {item.nonAscii && <span className='db f6 mt1'>{t('dialog.nonAscii')}</span>}
      </dd>
    </div>
  )
}

/**
 * Asks the person to approve one write call from an agent, naming the operation, the CIDs
 * or paths it acts on and its effect.
 *
 * This is an accident and intent check, not a lock. A host that drives this browser can
 * press Approve like a person can (ADR-0002, R13 decision A). What it does stop: a click
 * from page script, a double-click that would approve the next request unseen, an Approve
 * pressed before the request was readable, and a flood of prompts. So Approve:
 *
 *   - acts only on a trusted activation: a real pointer press with detail >= 1, or a real
 *     Enter or Space press, which is how a keyboard user activates a button (WCAG 2.1.1);
 *   - is armed only after the request has been visible for ARM_MS, and needs a fresh press
 *     after that.
 *
 * The rest of the page is inert while the dialog is open. Deny has initial focus, Escape
 * denies, an unanswered request expires, and "Deny all and turn off agent writes" is always
 * there.
 */
const WebMcpConfirmDialog = () => {
  const { t } = useTranslation('webmcp')
  const settings = useStore(getSettings, subscribeSettings)
  const pending = useStore(getPending, subscribeQueue)
  const last = useStore(getLastDecision, subscribeQueue)
  const current = pending[0]
  const id = current?.id
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */(null))
  const denyRef = useRef(/** @type {HTMLButtonElement | null} */(null))
  const [armed, setArmed] = useState(false)
  const armedRef = useRef(false)
  // A press that began after the button was armed: pointer for a mouse or touch user, key for a keyboard user.
  const pressedRef = useRef(/** @type {'pointer' | 'key' | null} */(null))

  useInertBackground(Boolean(settings.enabled && current))
  useTitleCue(Boolean(settings.enabled && current), t('dialog.titleCue'))

  // Arm Approve after the request has been on screen for a moment; every new request starts unarmed.
  useEffect(() => {
    armedRef.current = false
    pressedRef.current = null
    setArmed(false)
    if (id === undefined) return undefined
    const timer = setTimeout(() => {
      armedRef.current = true
      setArmed(true)
    }, ARM_MS)
    return () => clearTimeout(timer)
  }, [id])

  // Safe action first: focus lands on Deny, and returns to where it was when the dialog closes.
  useEffect(() => {
    if (id === undefined) return undefined
    const previous = /** @type {HTMLElement | null} */(globalThis.document.activeElement)
    denyRef.current?.focus()
    const keepFocusInside = (/** @type {FocusEvent} */ event) => {
      const dialog = dialogRef.current
      if (dialog && event.target instanceof Node && !dialog.contains(event.target)) denyRef.current?.focus()
    }
    globalThis.document.addEventListener('focusin', keepFocusInside)
    return () => {
      globalThis.document.removeEventListener('focusin', keepFocusInside)
      if (previous && typeof previous.focus === 'function') previous.focus()
    }
  }, [id])

  if (!settings.enabled) return null

  const outcome = last ? t(`outcome.${last.outcome}`) : ''
  const liveRegion = (
    <div role='status' aria-live='polite' className='webmcp-visually-hidden' data-testid='webmcp-outcome'>{outcome}</div>
  )
  if (!current) return createPortal(liveRegion, getPortalRoot())

  const onKeyDown = (/** @type {React.KeyboardEvent} */ event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      decide(current.id, false)
      return
    }
    if (event.key !== 'Tab') return
    const buttons = /** @type {HTMLElement[]} */(Array.from(dialogRef.current?.querySelectorAll('button') ?? []))
    const first = buttons[0]
    const lastButton = buttons[buttons.length - 1]
    const active = globalThis.document.activeElement
    if (event.shiftKey && active === first) {
      event.preventDefault()
      lastButton?.focus()
    } else if (!event.shiftKey && active === lastButton) {
      event.preventDefault()
      first?.focus()
    }
  }

  const onApprovePointerDown = (/** @type {React.SyntheticEvent} */ event) => {
    pressedRef.current = armedRef.current && isTrustedEvent(event) ? 'pointer' : null
  }
  const onApproveKeyDown = (/** @type {React.KeyboardEvent} */ event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      pressedRef.current = armedRef.current && isTrustedEvent(event) ? 'key' : null
    }
  }
  const onApprove = (/** @type {React.MouseEvent} */ event) => {
    const press = pressedRef.current
    pressedRef.current = null
    const fromPointer = press === 'pointer' && event.detail >= 1
    const fromKeyboard = press === 'key' && event.detail === 0
    // A script's .click() or a synthetic click is untrusted or has no armed press before it: ignored.
    if (!isTrustedEvent(event) || !armedRef.current || !(fromPointer || fromKeyboard)) return
    decide(current.id, true)
  }

  const { request } = current
  const targets = request.targets
  const preview = request.details.find((d) => d.label === PREVIEW_LABEL)
  const details = request.details.filter((d) => d.label !== PREVIEW_LABEL)
  const seconds = Math.round(current.expiresInMs / 1000)
  const titleId = `webmcp-title-${current.id}`
  const descId = `webmcp-desc-${current.id}`
  const hintId = `webmcp-hint-${current.id}`

  return createPortal(
    <>
      {liveRegion}
      <div className='webmcp-backdrop fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-max'>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={dialogRef}
          key={current.id}
          role='alertdialog'
          aria-modal='true'
          aria-labelledby={titleId}
          aria-describedby={descId}
          className='webmcp-dialog w-90'
          data-testid='webmcp-confirm'
          onKeyDown={onKeyDown}>
          <h2 id={titleId} className='webmcp-title'>{t('dialog.title', { title: request.title })}</h2>
          <p className='mt0 mb3'><span className='webmcp-state'>{t('dialog.state')}</span></p>
          <p id={descId} className='f5 lh-copy mt0 mb2'>{t(`effects.${request.tool}`, { defaultValue: request.effect })}</p>
          <p className='f6 lh-copy mt0 mb3'>{t('dialog.source')}</p>

          {/* N1: the deadline and both safety disclosures sit above the details, so
              they are in view at scrollTop 0 on a phone however long the details are. */}
          <div className='webmcp-notes mb3' data-testid='webmcp-notes'>
            <p className='webmcp-note'>{t('dialog.expiry', { seconds })}</p>
            {pending.length > 1 && <p className='webmcp-note' role='status'>{t('dialog.queued', { count: pending.length - 1 })}</p>}
            <p className='webmcp-note'>{t('dialog.denyIsFinal')}</p>
            <p className='webmcp-note'>{t('dialog.notALock')}</p>
          </div>

          {targets.length > 0 && <dl className='webmcp-list ma0 mb3' aria-label={t('dialog.targets')}>{targets.map((item) => <ItemRow key={`${item.label}:${item.value}`} item={item} t={t} />)}</dl>}
          {details.length > 0 && <dl className='webmcp-list ma0 mb3' aria-label={t('dialog.details')}>{details.map((item) => <ItemRow key={`${item.label}:${item.value}`} item={item} t={t} />)}</dl>}
          {preview && (
            <div className='webmcp-preview mb3'>
              <p className='webmcp-label mt0 mb1'>{t('dialog.previewLabel')}</p>
              <dl className='webmcp-list ma0'><ItemRow item={preview} t={t} /></dl>
            </div>
          )}

          <div className='webmcp-footer'>
          <div className='webmcp-actions flex flex-wrap justify-end items-center'>
            <button
              type='button'
              className='webmcp-btn webmcp-btn-secondary'
              onClick={() => {
                denyAll('denied')
                updateSettings({ writes: false })
              }}>
              {t('dialog.denyAll')}
            </button>
            <button ref={denyRef} type='button' className='webmcp-btn webmcp-btn-deny' onClick={() => decide(current.id, false)}>
              {t('dialog.deny', { title: request.title })}
            </button>
            <button
              type='button'
              className='webmcp-btn webmcp-btn-approve'
              aria-disabled={!armed}
              aria-describedby={hintId}
              onPointerDown={onApprovePointerDown}
              onKeyDown={onApproveKeyDown}
              onClick={onApprove}>
              {t('dialog.approve', { title: request.title })}
            </button>
          </div>
          <p id={hintId} className='webmcp-hint f6 lh-copy tr mt2 mb0'>{armed ? t('dialog.armed') : t('dialog.arming')}</p>
          </div>
        </div>
      </div>
    </>,
    getPortalRoot()
  )
}

export default WebMcpConfirmDialog
