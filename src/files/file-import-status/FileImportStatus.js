import React, { useMemo, useState, useCallback, useId, useRef } from 'react'
import { humanSize } from '../../lib/files.js'
import PropTypes from 'prop-types'
import { connect } from '../../lib/react-store.js'
import { withTranslation } from 'react-i18next'
// Icons
import { GenericFileIcon as DocumentIcon, FolderIcon, ExpandChevronIcon as GlyphSmallArrows, CheckIcon as GlyphTick, CloseIcon as GlyphCancel, CloseIcon as GlyphSmallCancel } from '../../promethity/icons.js'
import './FileImportStatus.css'
import ProgressBar from '../../components/progress-bar/ProgressBar.js'
import { ACTIONS } from '../../bundles/files/consts.js'

const Import = (job, t, cancelUpload, toggleRef) =>
  [...groupByPath(job?.message?.entries || new Map()).values()].map((item, index) => (
    <li className="flex w-100 items-center f6 charcoal" key={item.path}>
      {viewIcon(item)}
      <span className="fileImportStatusName truncate">{item.path}</span>
      <span className='gray mh2'> |
        { item.entries && (<span> { t('filesImportStatus.count', { count: item.entries.length }) } | </span>) }
        <span className='ml2'>{ humanSize(item.size) }</span>
      </span>
      {viewImportStatus(job)}
      {job.status === 'Cancelled' && <span className='fileImportStatusOutcome'>{t('filesImportStatus.cancelledUpload')}</span>}
      {index === 0 && job.type === ACTIONS.WRITE && job.status === 'Pending' && job.init?.uploadToken && (
        <button type='button' className='fileImportStatusStop' disabled={job.cancelRequested || job.message.cancellable === false}
          aria-label={`${t('filesImportStatus.cancelUpload', { name: job.message.entries[0].path })}${job.message.cancellable === false ? `: ${t('filesImportStatus.finishing')}` : job.cancelRequested ? `: ${t('filesImportStatus.cancelling')}` : ''}`}
          onClick={event => {
            event.stopPropagation()
            if (document.activeElement === event.currentTarget) toggleRef.current?.focus()
            cancelUpload(job.init.uploadToken)
          }}>
          {t(job.message.cancellable === false ? 'filesImportStatus.finishing' : job.cancelRequested ? 'filesImportStatus.cancelling' : 'filesImportStatus.cancel')}
        </button>
      )}
    </li>
  ))

/**
 * Renders a failed import job with its error message.
 * Used for jobs like ADD_BY_PATH that don't have message.entries structure.
 */
const FailedImport = (job, t) => {
  const path = job.init || t('filesImportStatus.unknownPath', 'Unknown path')
  const errorMessage = job.error?.message || t('filesImportStatus.unknownError', 'Unknown error')

  return (
    <li className="flex flex-column w-100 f6 charcoal" key={job.id?.toString() || path}>
      <div className="flex items-center">
        <DocumentIcon className="fileImportStatusIcon fileImportStatusIconError pa1" />
        <span className="fileImportStatusName truncate">{path}</span>
        <GlyphCancel className="dark-red w2 ph1 ml-auto" fill="currentColor"/>
      </div>
      <div className="f7 dark-red mt1 truncate" style={{ marginLeft: '36px' }} title={errorMessage}>
        {errorMessage}
      </div>
    </li>
  )
}

const viewIcon = (entry) =>
  entry.type === 'directory'
    ? <FolderIcon className="fileImportStatusIcon fill-aqua pa1" />
    : <DocumentIcon className="fileImportStatusIcon fill-aqua pa1" />

const viewImportStatus = (job) => {
  switch (job.status) {
    case 'Pending': {
      // All bytes may be uploaded while MFS copies are still pending.
      return <LoadingIndicator complete={false} />
    }
    case 'Cancelled': {
      return (<GlyphCancel className='fileImportStatusCancelled w2 ph1' fill='currentColor' />)
    }
    case 'Failed': {
      return (<GlyphCancel className="dark-red w2 ph1" fill="currentColor"/>)
    }
    default: {
      return (<LoadingIndicator complete={true}/>)
    }
  }
}

const groupByPath = (entries) => {
  const groupedEntries = new Map()
  for (const entry of entries) {
    const name = baseDirectoryOf(entry)
    if (name == null) {
      groupedEntries.set(entry.path, { type: 'file', ...entry })
    } else {
      // add `/` to avoid collision with file names.
      const directory = groupedEntries.get(`${name}/`)
      if (directory) {
        directory.entries.push(entry)
        directory.size += entry.size
      } else {
        groupedEntries.set(`${name}/`, {
          type: 'directory',
          size: entry.size,
          path: name,
          entries: [entry]
        })
      }
    }
  }
  return groupedEntries
}

/**
 * @typedef {Object} Entry
 * @property {string} path
 * @property {size} number
 */

/**
 * @param {Entry} entry
 * @returns {string|null}
 */
const baseDirectoryOf = ({ path }) => {
  const index = path.indexOf('/')
  return index < 0 ? null : path.slice(0, index)
}

const LoadingIndicator = ({ complete }) =>
  complete ? <GlyphTick className="green w2 ph1" fill="currentColor"/> : <span className="w2 ph1"/>

export const FileImportStatus = ({ filesFinished = [], filesPending = [], filesErrors = [], filesCancelled = [], doFilesClear, doFilesCancelUpload, initialExpanded = true, t }) => {
  const sortedFilesFinished = useMemo(() => [...filesFinished].sort((fileA, fileB) => fileB.start - fileA.start), [filesFinished])
  const [expanded, setExpanded] = useState(initialExpanded)
  const listId = useId()
  const titleId = useId()
  const toggleRef = useRef(null)

  const handleImportStatusClose = useCallback((ev) => {
    doFilesClear()
    setExpanded(false)
    ev.stopPropagation() // Prevent setExpanded from being called
  }, [doFilesClear])

  if (!filesFinished.length && !filesPending.length && !filesErrors.length && !filesCancelled.length) {
    return null
  }

  // Separate WRITE errors (have message.entries) from ADD_BY_PATH errors (no message.entries)
  const writeErrors = filesErrors.filter(e => e.type === ACTIONS.WRITE)
  const importPathErrors = filesErrors.filter(e => e.type === ACTIONS.ADD_BY_PATH)

  const numberOfImportedItems = !filesFinished.length ? 0 : filesFinished.reduce((prev, finishedFile) => prev + (finishedFile.message?.entries?.length ?? 1), 0)
  const numberOfFailedItems = writeErrors.reduce((prev, failedFile) => prev + (failedFile.message?.entries?.length ?? 1), 0) + importPathErrors.length
  const numberOfPendingItems = filesPending.reduce((total, pending) => total + groupByPath(pending.message?.entries || []).size, 0)
  const numberOfCancelledItems = filesCancelled.reduce((total, job) => total + (job.message?.entries?.length ?? 1), 0)
  const progress = Math.floor(filesPending.reduce((total, { message: { progress } }) => total + progress, 0) / filesPending.length)

  // Find the most recent operation by comparing timestamps
  const lastFinished = filesFinished.length > 0
    ? Math.max(...filesFinished.map(f => f.start))
    : 0
  const lastFailed = filesErrors.length > 0
    ? Math.max(...filesErrors.map(f => f.start))
    : 0
  const lastCancelled = filesCancelled.length > 0 ? Math.max(...filesCancelled.map(job => job.start)) : 0

  // Show error styling only if the most recent operation was a failure
  const hasErrors = lastFailed > Math.max(lastFinished, lastCancelled) && !filesPending.length
  const showCancelled = filesCancelled.length > 0 && lastCancelled >= lastFinished && !filesPending.length
  const containerClass = hasErrors ? 'fileImportStatusError' : ''
  const summary = filesPending.length
    ? `${t('filesImportStatus.importing', { count: numberOfPendingItems })} (${progress}%)`
    : hasErrors
      ? t('filesImportStatus.failed', { count: numberOfFailedItems })
      : showCancelled
        ? t('filesImportStatus.cancelled', { count: numberOfCancelledItems })
        : t('filesImportStatus.imported', { count: numberOfImportedItems })

  return (
    <div className='fileImportStatus fixed bottom-1 w-100 flex justify-center' style={{ zIndex: 14, pointerEvents: 'none' }}>
      <div className={`fileImportStatusPanel relative br1 dark-gray center bg-near-white ${containerClass}`} style={{ pointerEvents: 'auto' }}>
        <div className="fileImportStatusButton relative flex items-center charcoal w-100" style={{ background: 'var(--raised)' }}>
          <button type='button' ref={toggleRef} className='fileImportStatusToggle' onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls={listId} aria-label={`${t('filesImportStatus.toggleDropdown')}: ${summary}`}>
            <span className='fileImportStatusTitle' id={titleId}>{summary}</span>
            <span className='fileImportStatusArrow flex' aria-hidden='true'>
              <GlyphSmallArrows viewBox="10 10 80 80" fill="currentColor" opacity="0.7" aria-hidden="true"/>
            </span>
          </button>
          <button type='button' className='fileImportStatusCancel ph0 flex' onClick={handleImportStatusClose} aria-label={ t('filesImportStatus.closeDropdown') }>
            <GlyphSmallCancel fill="currentColor" opacity="0.7" aria-hidden='true'/>
          </button>
        </div>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard scrolling remains available when settled rows have no controls. */}
        <div id={listId} className='fileImportStatusRow' role='region' tabIndex={expanded ? 0 : -1} aria-labelledby={titleId} aria-hidden={!expanded} inert={!expanded}>
          <ul className='pa0 ma0'>
          { filesPending.map(file => Import(file, t, doFilesCancelUpload, toggleRef)) }
          { filesCancelled.map(file => Import(file, t)) }
          { filesCancelled.length > 0 && <li className='fileImportStatusNotice f7 pa2'><span role='status'>{t('filesImportStatus.cancelledNotice')}</span></li> }
          { hasErrors && (
            <>
              { writeErrors.map(file => Import(file, t)) }
              { importPathErrors.map(file => FailedImport(file, t)) }
            </>
          )}
          { sortedFilesFinished.map(file => Import(file, t)) }
          { !hasErrors && (
            <>
              { writeErrors.map(file => Import(file, t)) }
              { importPathErrors.map(file => FailedImport(file, t)) }
            </>
          )}
          </ul>
        </div>
        {
          filesPending.length
            ? <ProgressBar progress={progress} bg="bg-teal" br="br0" className="absolute bottom-0" style={{ height: '4px' }} />
            : null
        }
      </div>
    </div>
  )
}

FileImportStatus.propTypes = {
  filesFinished: PropTypes.array,
  filesPending: PropTypes.array,
  filesErrors: PropTypes.array,
  filesCancelled: PropTypes.array,
  doFilesClear: PropTypes.func,
  doFilesCancelUpload: PropTypes.func,
  initialExpanded: PropTypes.bool
}

export default connect(
  'selectFilesFinished',
  'selectFilesPending',
  'selectFilesErrors',
  'selectFilesCancelled',
  'doFilesClear',
  'doFilesCancelUpload',
  withTranslation('files')(FileImportStatus)
)
