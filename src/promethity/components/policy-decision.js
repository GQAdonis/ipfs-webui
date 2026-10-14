import React from 'react'
import classNames from 'classnames'
import { OkIcon, WarnIcon, ErrIcon } from '../icons.js'
import './primitives.css'

const DECISIONS = Object.freeze({
  permitted: { Icon: OkIcon, tone: 'ok', word: 'Permitted' },
  ask: { Icon: WarnIcon, tone: 'warn', word: 'Asks you first' },
  denied: { Icon: ErrIcon, tone: 'err', word: 'Denied' }
})

/**
 * @typedef {'permitted' | 'ask' | 'denied'} Decision
 */

/**
 * The brand's signature row: one action and what was decided about it. It is
 * a statement, not a control, so it never takes focus. The decision is a word
 * with an icon on its state tint.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.subject the action, e.g. "Writes and deletes"
 * @param {Decision} [props.decision]
 * @param {string} [props.word] overrides the decision's word
 * @param {React.ReactNode} [props.children] the one-line consequence
 * @param {string} [props.className]
 */
export const PolicyDecision = ({ subject, decision = 'ask', word, children, className }) => {
  const { Icon, tone, word: defaultWord } = DECISIONS[decision]
  return (
    <div className={classNames('pm-policy', className)}>
      <span className='pm-policy-subject'>{subject}</span>
      <span className={classNames('pm-policy-decision', `pm-tone-${tone}`)}>
        <Icon size={16} />
        <strong>{word ?? defaultWord}</strong>
      </span>
      {children ? <span className='pm-policy-note'>{children}</span> : null}
    </div>
  )
}
