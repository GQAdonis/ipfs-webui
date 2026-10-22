import { PANE_STATES } from './layout-preferences.js'
import './workspace.css'

/**
 * Placement only: callers retain routing, agent availability and conversation
 * ownership. In particular, `conversation` is ONE mounted controller/composer,
 * used as the assistant in application mode and the thread in conversation mode.
 */
export function WorkspaceLayout ({
  mode = 'application',
  pane = 'docked',
  navigator,
  header,
  application,
  conversation = null,
  canvas = null,
  applicationClassName = '',
  applicationInCanvas = false,
  route,
  controls,
  conversationId,
  stageId,
  workspaceRef,
  onFocusCapture
}) {
  if (mode !== 'application' && mode !== 'conversation') {
    throw new RangeError(`Unknown workspace mode: ${mode}`)
  }
  if (!PANE_STATES.includes(pane)) throw new RangeError(`Unknown pane state: ${pane}`)

  const hasConversation = conversation !== null && conversation !== undefined && conversation !== false
  // A missing/disabled agent must never hide the operator's IPFS application.
  const activeMode = hasConversation && pane !== 'closed' ? mode : 'application'
  const isConversation = activeMode === 'conversation'

  return (
    <div ref={workspaceRef} onFocusCapture={onFocusCapture} className='workspace' data-workspace-mode={activeMode} data-workspace-pane={hasConversation ? pane : 'closed'} data-workspace-conversation={hasConversation ? 'present' : 'absent'}>
      <div className='workspace-navigator navbar-container' data-workspace-slot='navigator'>
        {navigator}
      </div>
      <div className='workspace-body app-shell-column'>
        <header className='workspace-header' data-workspace-slot='header'>
          {header}
          {hasConversation && controls}
        </header>
        <main id={stageId} className='workspace-stage' data-route={route} tabIndex={-1}>
          {/* Keep the route DOM and ongoing operations alive across layout changes.
              Native hidden removes inactive controls from focus and the a11y tree.
              Do not replace this with Activity effect teardown or duplicate roots. */}
          <div className={`workspace-application ${applicationClassName}`.trim()} data-workspace-slot='application' hidden={(isConversation && !applicationInCanvas) || (hasConversation && pane === 'full')} inert={(isConversation && !applicationInCanvas) || (hasConversation && pane === 'full')} data-workspace-live-canvas={applicationInCanvas ? 'true' : undefined}>
            {application}
          </div>
          {hasConversation && (
            <div id={conversationId} className='workspace-conversation' data-workspace-slot='conversation' data-workspace-placement={isConversation ? 'thread' : 'assistant'} hidden={pane === 'closed'} inert={pane === 'closed'}>
              {conversation}
            </div>
          )}
          {hasConversation && canvas !== null && canvas !== undefined && canvas !== false && (
            <div className='workspace-canvas' data-workspace-slot='canvas' hidden={!isConversation || pane === 'full'} inert={!isConversation || pane === 'full'}>
              {canvas}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
