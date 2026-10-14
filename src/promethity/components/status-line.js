import React from 'react'
import classNames from 'classnames'
import { OkIcon, WarnIcon, ErrIcon, InfoIcon } from '../icons.js'
import './primitives.css'

const TONES = Object.freeze({
  ok: { Icon: OkIcon, word: 'OK' },
  warn: { Icon: WarnIcon, word: 'Warning' },
  err: { Icon: ErrIcon, word: 'Error' },
  info: { Icon: InfoIcon, word: 'Note' }
})

/**
 * @typedef {'ok' | 'warn' | 'err' | 'info'} Tone
 */

/**
 * A state, said three ways: an icon, a word, and the state colour on its own
 * tint. The word is required content (kubo DESIGN.md: state is words first),
 * defaulting to the tone's name; pass `word` for the specific state
 * ("Applied", "Needs restart"). Errors are announced as alerts, the rest as
 * status.
 *
 * @param {Object} props
 * @param {Tone} [props.tone]
 * @param {string} [props.word]
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.className]
 */
export const StatusLine = ({ tone = 'info', word, children, className }) => {
  const { Icon, word: defaultWord } = TONES[tone]
  return (
    <p className={classNames('pm-status', `pm-tone-${tone}`, className)} role={tone === 'err' ? 'alert' : 'status'}>
      <Icon />
      <span className='pm-status-body'>
        <strong className='pm-status-word'>{word ?? defaultWord}</strong>
        {children ? <> <span className='pm-status-text'>{children}</span></> : null}
      </span>
    </p>
  )
}

export { TONES }
