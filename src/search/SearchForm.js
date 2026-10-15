import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Button from '../components/button/button.tsx'
import { Field, FieldInput } from '../promethity/components/index.js'
import ChipGroup from './ChipGroup.js'
import { KINDS, SOURCES } from './content-kinds.js'

const MAX_QUERY = 2000

/** @param {readonly string[]} list @param {string} value */
const toggled = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

/**
 * The query box and the filters. Submitting calls `onSearch` with the query and
 * the chosen kinds and sources (empty means every one). The filters are plain
 * local state: nothing is requested until the person submits.
 *
 * @param {Object} props
 * @param {boolean} props.busy
 * @param {(req: { query: string, kinds: string[], sources: string[] }) => void} props.onSearch
 */
const SearchForm = ({ busy, onSearch }) => {
  const { t } = useTranslation('search')
  const [query, setQuery] = useState('')
  const [kinds, setKinds] = useState(/** @type {string[]} */ ([]))
  const [sources, setSources] = useState(/** @type {string[]} */ ([]))
  const filtered = kinds.length > 0 || sources.length > 0

  const submit = (/** @type {React.FormEvent} */ event) => {
    event.preventDefault()
    if (query.trim() === '') return
    onSearch({ query, kinds, sources })
  }

  return (
    <form className='sr-form' role='search' onSubmit={submit}>
      <Field label={t('form.label')} help={t('form.help')}>
        <div className='sr-query'>
          <FieldInput
            type='search'
            name='q'
            value={query}
            maxLength={MAX_QUERY}
            placeholder={t('form.placeholder')}
            autoComplete='off'
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button buttonType='submit' minWidth={120} disabled={busy || query.trim() === ''}>
            {busy ? t('form.submitting') : t('form.submit')}
          </Button>
        </div>
      </Field>
      <div className='sr-filters'>
        <ChipGroup
          legend={t('filters.kindsLegend')}
          options={KINDS.map((value) => ({ value, label: t(`filters.kind.${value}`) }))}
          selected={kinds}
          onToggle={(value) => setKinds((list) => toggled(list, value))}
        />
        <ChipGroup
          legend={t('filters.sourcesLegend')}
          options={SOURCES.map((value) => ({ value, label: t(`filters.source.${value}`) }))}
          selected={sources}
          onToggle={(value) => setSources((list) => toggled(list, value))}
        />
        {filtered
          ? <button type='button' className='sr-text-button' onClick={() => { setKinds([]); setSources([]) }}>{t('filters.clear')}</button>
          : null}
      </div>
    </form>
  )
}

SearchForm.propTypes = {
  busy: PropTypes.bool.isRequired,
  onSearch: PropTypes.func.isRequired
}

export default SearchForm
