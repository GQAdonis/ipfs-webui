import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import { useStableId } from './use-stable-id.js'
import { useFieldControl } from './field.js'
import { ChevronDownIcon } from '../icons.js'
import './primitives.css'

/**
 * @typedef {Object} ComboboxOption
 * @property {string} value
 * @property {string} label
 * @property {string} [description]
 */

/** @param {ComboboxOption[]} options @param {string} value */
const labelFor = (options, value) => options.find((o) => o.value === value)?.label ?? value

/** @param {ComboboxOption[]} options @param {string} text */
const matching = (options, text) => {
  const needle = text.trim().toLowerCase()
  if (!needle) return options
  return options.filter((o) => o.label.toLowerCase().includes(needle) || o.value.toLowerCase().includes(needle))
}

/**
 * Typed text becomes an option's value when it names that option exactly;
 * otherwise it is kept as free text.
 *
 * @param {ComboboxOption[]} options
 * @param {string} text
 */
const valueForText = (options, text) => {
  const trimmed = text.trim()
  const exact = options.find((o) => o.label.toLowerCase() === trimmed.toLowerCase() || o.value === trimmed)
  return exact ? exact.value : trimmed
}

/**
 * Editable combobox with list autocomplete (WAI-ARIA APG, "Editable Combobox
 * With List Autocomplete", manual selection). Focus stays on the input; the
 * highlighted option is announced through `aria-activedescendant`.
 *
 * - Typing filters the list and opens it. No option is highlighted, so Enter
 *   accepts what was typed: free text is a valid value (a model id the list
 *   does not know, for example).
 * - ArrowDown opens the list and highlights the first option, then moves on
 *   (wrapping). ArrowUp opens on the last. Alt+ArrowDown opens without
 *   highlighting.
 * - Enter selects the highlighted option, or accepts the typed text.
 * - Escape closes the list and restores the input to the committed value.
 * - Leaving the field commits typed text, so nothing typed is silently lost.
 *
 * Inside a `Field` the label, help and error wiring come from context; used
 * alone it needs `aria-label`.
 *
 * @param {Object} props
 * @param {ComboboxOption[]} props.options
 * @param {string} props.value the committed value (an option value or free text)
 * @param {(next: string) => void} props.onChange
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {string} [props.aria-label]
 * @param {string} [props.toggleLabel] accessible name of the list button
 * @param {(count: number) => string} [props.countText] live-region text for the option count
 * @param {(text: string) => string} [props.noMatchText] shown when typing matches no option
 * @param {string} [props.className]
 */
export const Combobox = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  'aria-label': ariaLabel,
  toggleLabel = 'Show options',
  countText = (count) => `${count} ${count === 1 ? 'option' : 'options'} available`,
  noMatchText = () => 'No match. Press Enter to use what you typed.',
  className
}) => {
  const field = useFieldControl()
  const base = useStableId('pm-combobox')
  const inputId = field.id ?? `${base}-input`
  const listId = `${base}-list`
  const optionId = (/** @type {number} */ i) => `${base}-option-${i}`

  const [text, setText] = useState(() => labelFor(options, value))
  const [filtering, setFiltering] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [seenValue, setSeenValue] = useState(value)
  const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null))
  const listRef = useRef(/** @type {HTMLUListElement | null} */ (null))

  // The parent changed the committed value (a reset, a loaded setting): show
  // it, and drop any half-typed filter. Adjusting state while rendering is the
  // React-documented way to derive state from a changed prop without an effect.
  if (value !== seenValue) {
    setSeenValue(value)
    setText(labelFor(options, value))
    setFiltering(false)
  }

  const visible = filtering ? matching(options, text) : options
  const expanded = open && visible.length > 0
  const noMatch = open && filtering && text.trim() !== '' && visible.length === 0

  useEffect(() => {
    if (active < 0 || !listRef.current) return
    const el = listRef.current.children[active]
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' })
  }, [active])

  const close = () => {
    setOpen(false)
    setActive(-1)
    setFiltering(false)
  }

  const commit = (/** @type {string} */ next) => {
    if (next !== value) onChange(next)
    setText(labelFor(options, next))
    close()
  }

  const handleChange = (/** @type {React.ChangeEvent<HTMLInputElement>} */ e) => {
    setText(e.target.value)
    setFiltering(true)
    setOpen(true)
    setActive(-1)
  }

  const move = (/** @type {number} */ from, /** @type {1 | -1} */ step) => {
    const count = visible.length
    if (count === 0) return -1
    if (from < 0) return step === 1 ? 0 : count - 1
    return (from + step + count) % count
  }

  const handleKeyDown = (/** @type {React.KeyboardEvent<HTMLInputElement>} */ e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) {
          setOpen(true)
          if (!e.altKey) setActive(move(-1, 1))
        } else {
          setActive(move(active, 1))
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) setOpen(true)
        setActive(move(active, -1))
        break
      case 'Enter':
        // Never submit the surrounding form from here: applying is a deliberate
        // action on the ApplyBar.
        e.preventDefault()
        if (expanded && active >= 0) commit(visible[active].value)
        else commit(valueForText(options, text))
        break
      case 'Escape':
        if (open) e.stopPropagation()
        e.preventDefault()
        setText(labelFor(options, value))
        close()
        break
      default:
    }
  }

  const handleBlur = () => {
    const typed = valueForText(options, text)
    if (typed !== value) onChange(typed)
    setText(labelFor(options, typed))
    close()
  }

  const toggle = () => {
    setOpen((o) => !o)
    setActive(-1)
    setFiltering(false)
    inputRef.current?.focus()
  }

  return (
    <div className={classNames('pm-combobox', className)}>
      <div className='pm-combobox-control'>
        <input
          ref={inputRef}
          type='text'
          role='combobox'
          className='pm-input pm-combobox-input'
          id={inputId}
          aria-label={field.id ? undefined : ariaLabel}
          aria-describedby={field['aria-describedby']}
          aria-invalid={field['aria-invalid']}
          aria-required={field['aria-required']}
          aria-autocomplete='list'
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
          autoComplete='off'
          autoCapitalize='off'
          spellCheck={false}
          placeholder={placeholder}
          disabled={disabled}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        <button
          type='button'
          tabIndex={-1}
          className='pm-combobox-toggle'
          aria-label={toggleLabel}
          aria-controls={listId}
          aria-expanded={expanded}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggle}
        >
          <ChevronDownIcon size={16} />
        </button>
      </div>
      <ul ref={listRef} id={listId} role='listbox' className='pm-combobox-list' aria-label={field.labelId ? undefined : ariaLabel} aria-labelledby={field.labelId} hidden={!expanded}>
        {visible.map((option, i) => (
          // Keyboard selection happens on the input (aria-activedescendant); the
          // option only needs the pointer handlers.
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <li
            key={option.value}
            id={optionId(i)}
            role='option'
            className='pm-combobox-option'
            aria-selected={i === active}
            data-current={option.value === value ? '' : undefined}
            // Keep focus on the input: a click must not blur it first.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => commit(option.value)}
          >
            <span>{option.label}</span>
            {option.description ? <span className='pm-combobox-description'>{option.description}</span> : null}
          </li>
        ))}
      </ul>
      <div role='status' className={noMatch ? 'pm-combobox-hint' : 'pm-sr-only'}>
        {noMatch ? noMatchText(text) : expanded ? countText(visible.length) : ''}
      </div>
    </div>
  )
}
