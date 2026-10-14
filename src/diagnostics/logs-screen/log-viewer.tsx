import React, { type CSSProperties, useMemo, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import IconTooltip from '../../components/tooltip/icon-tooltip'
import { ExpandIcon, CollapseIcon, PlayIcon, PauseIcon, ScrollLatestIcon, ConfigureIcon, ClearIcon } from '../../promethity/icons.js'
import { BufferConfigModal } from './buffer-config-modal'
import { useLogs } from '../../contexts/logs'
import './log-viewer.css'
import type { LogEntry as LogEntryType } from '../../contexts/logs/api'

type LogLevelColor = 'gray' | 'blue' | 'orange' | 'red' | 'darkred' | 'black'

const getLevelColor = (level: string): LogLevelColor => {
  switch (level.toLowerCase()) {
    case 'debug': return 'gray'
    case 'info': return 'blue'
    case 'warn': return 'orange'
    case 'error': return 'red'
    case 'dpanic':
    case 'panic':
    case 'fatal': return 'darkred'
    default: return 'black'
  }
}

const formatTimestamp = (timestamp: string): string => {
  try {
    return new Date(timestamp).toLocaleTimeString()
  } catch {
    return timestamp
  }
}

interface TopControlsProps {
  isExpanded: boolean
  setIsExpanded: (isExpanded: boolean) => void
  isStreaming: boolean
  startStreaming: () => void
  stopStreaming: () => void
  onSettingsClick: () => void
  isAtBottom: boolean
  scrollToBottom: () => void
  hasEntries: boolean
  hasInteracted: boolean
  setHasInteracted: (value: boolean) => void
  onClear: () => void
}

const TopControls: React.FC<TopControlsProps> = ({ onClear, isExpanded, setIsExpanded, isStreaming, startStreaming, stopStreaming, onSettingsClick, isAtBottom, scrollToBottom, hasEntries, hasInteracted, setHasInteracted }) => {
  const { t } = useTranslation('diagnostics')
  const [showInitialTooltip, setShowInitialTooltip] = useState(true)

  // Hide initial tooltip after 6 seconds or when user has interacted
  useEffect(() => {
    if (showInitialTooltip && !hasInteracted) {
      const timer = setTimeout(() => {
        setShowInitialTooltip(false)
      }, 6000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [showInitialTooltip, hasInteracted])

  // Hide tooltip once streaming starts or user has interacted
  useEffect(() => {
    if (isStreaming || hasInteracted) {
      setShowInitialTooltip(false)
    }
  }, [isStreaming, hasInteracted])

  // Reset tooltip when interaction state is reset
  useEffect(() => {
    if (!hasInteracted) {
      setShowInitialTooltip(true)
    }
  }, [hasInteracted])

  const toggleStreaming = useCallback(() => {
    setHasInteracted(true)
    if (isStreaming) {
      stopStreaming()
    } else {
      startStreaming()
    }
  }, [isStreaming, startStreaming, stopStreaming, setHasInteracted])

  const SizeIcon = isExpanded ? CollapseIcon : ExpandIcon
  const PlayPauseIcon = isStreaming ? PauseIcon : PlayIcon
  const sizeLabel = isExpanded ? t('logs.entries.tooltipCollapse') : t('logs.entries.tooltipExpand')
  const streamLabel = isStreaming ? t('logs.entries.tooltipPause') : t('logs.entries.tooltipPlay')
  const nudge = !isStreaming && !hasEntries && !hasInteracted

  return (
    <div className='log-toolbar' role='toolbar' aria-label={t('logs.entries.toolbar')}>
      {!isAtBottom && (
        <IconTooltip text={t('logs.entries.tooltipGoToLatest')} position='bottom'>
          <button type='button' className='prom-log-btn' aria-label={t('logs.entries.tooltipGoToLatest')} onClick={scrollToBottom}>
            <ScrollLatestIcon size={24} />
          </button>
        </IconTooltip>
      )}
      <IconTooltip
        text={streamLabel}
        position='bottom'
        forceShow={showInitialTooltip && !isStreaming && !hasEntries}
      >
        <button type='button' className={`prom-log-btn ${nudge ? 'prom-log-btn-nudge pulsate' : ''} ${isStreaming ? 'breathe' : ''}`} aria-label={streamLabel} aria-pressed={isStreaming} onClick={toggleStreaming}>
          <PlayPauseIcon size={24} />
        </button>
      </IconTooltip>
      <IconTooltip text={t('logs.entries.tooltipSettings')} position='bottom'>
        <button type='button' className='prom-log-btn' aria-label={t('logs.entries.tooltipSettings')} onClick={onSettingsClick}>
          <ConfigureIcon size={24} />
        </button>
      </IconTooltip>
      <IconTooltip key={isExpanded ? 'expanded' : 'collapsed'} text={sizeLabel} position='bottom'>
        <button type='button' className='prom-log-btn' aria-label={sizeLabel} aria-expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          <SizeIcon size={24} />
        </button>
      </IconTooltip>
      <IconTooltip text={t('logs.storage.trashTooltip')} position='bottom'>
        <button type='button' className='prom-log-btn' aria-label={t('logs.storage.trashTooltip')} onClick={onClear}>
          <ClearIcon size={24} />
        </button>
      </IconTooltip>
    </div>
  )
}

export interface LogViewerProps {
  logEntries: LogEntryType[]
  isStreaming: boolean
  containerRef: React.RefObject<HTMLDivElement>
  style?: React.CSSProperties
  startStreaming: () => void
  stopStreaming: () => void
  clearEntries: () => void
}

interface LogEntryProps {
  logEntry: LogEntryType
}
const ROW_GAP = '0.3rem' as const
const LogEntry = React.memo<LogEntryProps>(({ logEntry }) => {
  const { timestamp, level, subsystem, message, id } = logEntry
  return (
    <div key={`${timestamp}-${subsystem}-${id}`} className="lh-copy ml2 pb3 mb3 row">
      <span className="gray f7" title={timestamp}>
        {formatTimestamp(timestamp)}
      </span>
      <span className="fw6 f7 lvl" style={{ color: getLevelColor(level), whiteSpace: 'nowrap' }}>
        {level.toUpperCase()}
      </span>
      <span className="blue f7 sub" style={{ whiteSpace: 'nowrap' }} title={subsystem}>
        {subsystem}
      </span>
      <span className="f7 pre-wrap mr4 lh-copy msg" style={{ lineHeight: `calc(1.5em + ${ROW_GAP})` }}>
        {message}
      </span>
    </div>
  )
}, ({ logEntry: { id: prevId } }, { logEntry: { id: nextId } }) => {
  // optimize object equality check, if id is different, the entire object is different.
  // see https://react.dev/reference/react/memo#my-component-rerenders-when-a-prop-is-an-object-or-array
  return prevId === nextId
})

interface LogEntryListProps {
  logEntries: LogEntryType[]
  isStreaming: boolean
}

const LogEntryList: React.FC<LogEntryListProps> = ({ logEntries, isStreaming }) => {
  const { t } = useTranslation('diagnostics')

  if (logEntries.length === 0) {
    return (
      <div className='mv4 tc charcoal-muted f5'>
        <p className='ma0 sans-serif'>{t(isStreaming ? 'logs.entries.noEntriesStreaming' : 'logs.entries.noEntries')}</p>
      </div>
    )
  }

  return <div className='logs pv2' style={{ rowGap: `calc(1.5 * ${ROW_GAP})` }}>
    {logEntries.map((logEntry) => (
      <LogEntry key={logEntry.id} logEntry={logEntry} />
    ))}
  </div>
}

export const LogViewer: React.FC<LogViewerProps> = ({ logEntries, isStreaming, containerRef, style, startStreaming, stopStreaming, clearEntries }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const lastLogEntryId = useMemo(() => logEntries[logEntries.length - 1]?.id, [logEntries])

  const { bufferConfig: logBufferConfig, updateBufferConfig: doUpdateLogBufferConfig } = useLogs()

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50
    setIsAtBottom(isNearBottom)
  }, [])

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [containerRef])

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
    // only scroll to bottom if the last log entry id has changed, and we were previously at the bottom
    // this will lock the view to the bottom of the logs list while the logs are streaming, unless the user scrolls up
  }, [isAtBottom, scrollToBottom, lastLogEntryId])

  const handleClearReset = useCallback(() => {
    if (isStreaming) {
      stopStreaming()
    }
    setHasInteracted(false)
  }, [isStreaming, stopStreaming])

  const handleClear = useCallback(() => {
    clearEntries()
    handleClearReset()
  }, [clearEntries, handleClearReset])

  const styles = useMemo<CSSProperties>(() => {
    const baseStyles = {
      ...style
    }
    if (isExpanded) {
      return {
        height: '90vh',
        width: '90vw',
        position: 'fixed',
        inset: '5%',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        ...baseStyles
      }
    }
    return {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...baseStyles
    }
  }, [style, isExpanded])

  return (
    <>
      {isExpanded && (
        // Backdrop overlay with blur effect to focus attention on the expanded log viewer
        // Clicking or pressing Enter/Space on this backdrop will collapse the viewer
        <div
          className='fixed top-0 left-0 right-0 bottom-0'
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundColor: 'color-mix(in srgb, var(--ground) 70%, transparent)',
            zIndex: 999
          }}
          role="button"
          tabIndex={0}
          aria-label="Click to collapse log viewer"
          onClick={() => setIsExpanded(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsExpanded(false)
            }
          }}
        />
      )}
      <div className='relative code' style={styles}>
        <TopControls isExpanded={isExpanded} setIsExpanded={setIsExpanded} isStreaming={isStreaming} startStreaming={startStreaming} stopStreaming={stopStreaming} onSettingsClick={() => setIsSettingsModalOpen(true)} isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} hasEntries={logEntries.length > 0} hasInteracted={hasInteracted} setHasInteracted={setHasInteracted} onClear={handleClear} />
        <div
          ref={containerRef}
          className='bg-near-white f6 overflow-auto overflow-x-hidden flex-auto'
          style={{ minHeight: 0 }}
          onScroll={handleScroll}
        >
          <LogEntryList logEntries={logEntries} isStreaming={isStreaming} />
        </div>

        <BufferConfigModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          currentConfig={logBufferConfig}
          onApply={doUpdateLogBufferConfig}
        />
      </div>
    </>
  )
}
