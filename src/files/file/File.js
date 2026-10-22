import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { join, basename } from 'path'
import { withTranslation } from 'react-i18next'
import classnames from 'classnames'
import { humanSize } from '../../lib/files.js'
import { addNativeFiles, reportDropError } from '../native-drop.js'
// React DnD
import { useDrag, useDrop } from 'react-dnd'
// Components
import { DotsIcon as GlyphDots } from '../../promethity/icons.js'
import Tooltip from '../../components/tooltip/Tooltip.tsx'
import Checkbox from '../../components/checkbox/Checkbox.js'
import FileIcon from '../file-icon/FileIcon.js'
import { CID } from 'multiformats/cid'
import { NativeTypes } from 'react-dnd-html5-backend'
import PinIcon from '../pin-icon/PinIcon.js'

export const File = ({
  name, type, size, cid, path, pinned, t, selected, focused, translucent = false, coloured = false, cantSelect, cantDrag, isMfs, isRemotePin, isPendingPin, isFailedPin,
  onAddFiles, onMove, onSelect, onNavigate, onSetPinning, onDismissFailedPin, handleContextMenuClick
}) => {
  const dotsWrapper = useRef(null)

  const handleCtxLeftClick = (ev) => {
    const pos = dotsWrapper.current.getBoundingClientRect()
    handleContextMenuClick(ev, 'LEFT', { name, size, type, cid, path, pinned }, pos)
  }

  const handleCtxRightClick = (ev) => {
    handleContextMenuClick(ev, 'RIGHT', { name, size, type, cid, path, pinned })
  }

  const [, drag, preview] = useDrag({
    type: 'FILE',
    item: { name, size, cid, path, pinned, type: 'FILE' },
    canDrag: !cantDrag && isMfs
  })

  const checkIfDir = (monitor) => {
    if (!isMfs) return false
    const item = monitor.getItem()
    if (!item) return false

    if (item.name) {
      return type === 'directory' &&
        name !== item.name &&
        !selected
    }

    return type === 'directory'
  }

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE, 'FILE'],
    drop: (_, monitor) => {
      if (monitor.didDrop()) return
      const item = monitor.getItem()

      if (monitor.getItemType() === NativeTypes.FILE) {
        void addNativeFiles(item, files => onAddFiles(files, path)).catch(reportDropError)
      } else {
        const src = item.path
        const dst = join(path, basename(item.path))

        Promise.resolve(onMove(src, dst)).catch(reportDropError)
      }
    },
    canDrop: (_, monitor) => checkIfDir(monitor),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    })
  })

  let className = 'File relative flex items-center'

  if (selected) {
    className += ' selected'
  }

  const styles = { height: 55, overflow: 'visible' }

  if (focused || (selected && !translucent) || coloured || (isOver && canDrop)) {
    styles.backgroundColor = 'var(--raised)'
  } else if (translucent) {
    className += ' o-70'
  }

  if (focused) {
    // The one outline in the system is the accent focus ring (DESIGN.md).
    styles.outline = 'var(--focus-ring)'
    styles.outlineOffset = '-2px'
  }

  size = humanSize(size, { round: 0 })
  const hash = cid.toString() || t('hashUnavailable')

  const select = (select) => onSelect(name, select)

  const checkBoxCls = classnames({
    'o-70 glow': !cantSelect,
    'o-1': selected || focused
  }, ['pl2 w2'])

  return (
    <div ref={node => { drop(node) }}>
      <div className={className} style={styles} onContextMenu={handleCtxRightClick} ref={node => { drag(node) }} data-testid="file-row" data-type={type}>
        <div className={checkBoxCls}>
          <Checkbox disabled={cantSelect} checked={selected} onChange={select} aria-label={ t('selectLabel', { name })} />
        </div>

        <button ref={node => { preview(node) }} onClick={onNavigate} className='relative pointer flex items-center flex-grow-1 ph2 pv1 w-40' aria-label={ name === '..' ? t('previousFolder') : t('fileLabel', { name, type, size }) }>
          <div className='dib flex-shrink-0 mr2'>
            <FileIcon name={name} type={type} />
          </div>
          <div style={{ width: 'calc(100% - 3.25rem)' }}>
            <Tooltip text={name}>
              <div className='f6 truncate charcoal'>{name}</div>
            </Tooltip>
            <Tooltip text={hash}>
              <div className='f7 mt1 gray truncate monospace'>{hash}</div>
            </Tooltip>
          </div>
        </button>

        <div className='ph2 pv1 flex-none hide-child dn db-l tr mw3 w-20 transition-all'>
          <button className='ph2 db button-inside-focus' style={{ width: '2.5rem', height: '2rem' }} aria-label={isFailedPin ? t('dismissFailedPinLabel', { name }) : (pinned || isRemotePin || isPendingPin) ? t('unpinLabel', { name }) : t('pinLabel', { name })} onClick={isFailedPin ? onDismissFailedPin : () => onSetPinning([{ cid, pinned }])}>
            <PinIcon isFailedPin={isFailedPin} isPendingPin={isPendingPin} isRemotePin={isRemotePin} pinned={pinned} />
          </button>
        </div>
        <div className='size pl2 pr4 pv1 flex-none f6 dn db-l tr charcoal-muted w-10 mw4'>
          {size}
        </div>
        <button ref={dotsWrapper} className='ph2 db button-inside-focus file-context-menu' style={{ width: '2.5rem' }} onClick={handleCtxLeftClick} aria-label={ t('optionsLabel', { name })} >
          <GlyphDots className='fill-gray-muted pointer hover-fill-gray transition-all'/>
        </button>
      </div>
    </div>
  )
}

File.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number,
  cid: PropTypes.instanceOf(CID),
  selected: PropTypes.bool,
  focused: PropTypes.bool,
  onSelect: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
  onAddFiles: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDismissFailedPin: PropTypes.func.isRequired,
  coloured: PropTypes.bool,
  translucent: PropTypes.bool,
  handleContextMenuClick: PropTypes.func,
  pinned: PropTypes.bool,
  isMfs: PropTypes.bool
}

export default withTranslation('files')(File)
