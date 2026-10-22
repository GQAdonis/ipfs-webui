import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { WorkspaceLayout } from './WorkspaceLayout.jsx'
import { changeLayout, effectivePane, LAYOUT_MEDIA, PANE_STATES, readLayoutPreference, WORKSPACE_MODES, writeLayoutPreference } from './layout-preferences.js'
import { composedAncestors, deepActiveElement, paneStepFromKeyboard } from './layout-keyboard.js'

const narrowViewport = { dockedFits: false, expandedFits: false, phone: true }

function readViewport () {
  try {
    return Object.fromEntries(Object.entries(LAYOUT_MEDIA).map(([name, query]) => [name, window.matchMedia(query).matches]))
  } catch (_) {
    return narrowViewport
  }
}

function useViewport (enabled, beforeChange) {
  const [viewport, setViewport] = useState(readViewport)
  useEffect(() => {
    if (!enabled) return
    let queries
    try { queries = Object.values(LAYOUT_MEDIA).map(query => window.matchMedia(query)) } catch (_) { return }
    const update = () => { beforeChange(); setViewport(readViewport()) }
    update()
    for (const query of queries) {
      if (query.addEventListener) query.addEventListener('change', update)
      else query.addListener?.(update)
    }
    return () => {
      for (const query of queries) {
        if (query.removeEventListener) query.removeEventListener('change', update)
        else query.removeListener?.(update)
      }
    }
  }, [enabled, beforeChange])
  return viewport
}

/** Device layout controller only. The host supplies and gates the actual agent. */
export function Workspace ({ conversation = null, layoutRequest, ...slots }) {
  const { t } = useTranslation('app')
  const id = useId()
  const paneId = `${id}-conversation`
  const stageId = `${id}-stage`
  const hintId = `${id}-pane-hint`
  const root = useRef(null)
  const focusBeforeChange = useRef(null)
  const [state, setState] = useState(() => ({ preference: readLayoutPreference(), changed: false }))
  const available = conversation !== null && conversation !== undefined && conversation !== false
  const rememberFocus = useCallback(() => {
    const node = deepActiveElement(document)
    focusBeforeChange.current = { node, owned: composedAncestors(node).includes(root.current) }
  }, [])
  const viewport = useViewport(available, rememberFocus)
  const pane = available ? effectivePane(state.preference.pane, viewport) : 'closed'
  const mode = available && pane !== 'closed' ? state.preference.mode : 'application'

  const updateLayout = useCallback(action => {
    rememberFocus()
    setState(current => {
      const next = changeLayout(current.preference, action)
      if (next.mode === current.preference.mode && next.pane === current.preference.pane) return current
      return { preference: next, changed: true }
    })
  }, [rememberFocus])

  useEffect(() => {
    if (layoutRequest) updateLayout(layoutRequest.action)
  }, [layoutRequest, updateLayout])

  useEffect(() => {
    if (state.changed) writeLayoutPreference(state.preference)
  }, [state])

  useEffect(() => {
    if (!available) return
    const onKeyDown = event => {
      const direction = paneStepFromKeyboard(event, document)
      if (direction === null) return
      event.preventDefault()
      updateLayout({ type: 'step', direction })
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [available, updateLayout])

  useLayoutEffect(() => {
    const remembered = focusBeforeChange.current
    const prior = remembered?.node
    if (!remembered?.owned || !prior || !root.current) return
    const active = deepActiveElement(document)
    if (active && active !== document.body && !composedAncestors(active).includes(root.current)) return
    const hidden = composedAncestors(prior).some(node => node?.nodeType === 1 && node.hidden)
    if (!hidden && prior.isConnected) return
    // A close/full/mode action must not leave focus in a newly hidden region.
    const button = root.current.querySelector(`[data-pane-state="${pane}"]`)
    if (button && !button.hidden) button.focus()
    else root.current.querySelector('main')?.focus()
  }, [pane, mode, viewport, available])

  const controls = available && (
    <div className='workspace-controls'>
      <div className='workspace-control-group' role='group' aria-label={t('workspace.modeLabel')}>
        {WORKSPACE_MODES.map(value => (
          <button key={value} className='workspace-control' type='button' aria-pressed={mode === value} aria-controls={stageId} onClick={() => updateLayout({ type: 'mode', mode: value })}>
            {t(`workspace.modes.${value}`)}
          </button>
        ))}
      </div>
      <div className='workspace-control-group' role='group' aria-label={t('workspace.paneLabel')} aria-describedby={hintId}>
        {PANE_STATES.map(value => (
          <button key={value} className='workspace-control' type='button' data-pane-state={value} hidden={viewport.phone && (value === 'docked' || value === 'expanded')} aria-pressed={pane === value} aria-controls={paneId} onClick={() => updateLayout({ type: 'pane', pane: value })}>
            {t(`workspace.panes.${value}`)}
          </button>
        ))}
      </div>
      <p className='workspace-control-hint' id={hintId}>
        {t(pane === 'full' && state.preference.pane !== 'full' ? 'workspace.responsiveFull' : 'workspace.shortcutHint')}
      </p>
    </div>
  )

  const layout = { pane, mode, updateLayout }
  const resolved = Object.fromEntries(Object.entries(slots).map(([name, value]) => [name, typeof value === 'function' ? value(layout) : value]))
  return <WorkspaceLayout {...resolved} workspaceRef={root} onFocusCapture={rememberFocus} conversation={typeof conversation === 'function' ? conversation(layout) : conversation} conversationId={paneId} stageId={stageId} mode={mode} pane={pane} controls={controls} />
}
