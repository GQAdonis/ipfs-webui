import AutoSizer from '../auto-sizer/AutoSizer.js'
import React, { Fragment, useState, useRef, useMemo, useEffect } from 'react'
import { connect } from '../../lib/react-store.js'
import { sortByProperty } from '../../lib/sort.js'
import { getLocalContentLink, toIpnsBase36 } from '../../lib/share-link.js'
import { Table, Column, SortDirection } from 'react-virtualized'
import { useTranslation } from 'react-i18next'

// Components
import Button from '../button/button.tsx'
import Overlay from '../overlay/overlay'
import GenerateKeyModal from './generate-key-modal/GenerateKeyModal.js'
import RenameKeyModal from './rename-key-modal/RenameKeyModal.js'
import RemoveKeyModal from './remove-key-modal/RemoveKeyModal.js'

import ContextMenu from '../context-menu/ContextMenu.js'
import ContextMenuItem from '../context-menu/ContextMenuItem.js'
import { DotsIcon as GlyphDots, PencilIcon as StrokePencil, CloseIcon as StrokeCancel } from '../../promethity/icons.js'
const ROW_HEIGHT = 50
const HEADER_HEIGHT = 32

const AutoOptionsCell = ({ t, name, showRenameKeyModal, showRemoveKeyModal }) => (
  <div className='flex justify-end'>
    { name !== 'self' && <OptionsCell
      name={name} t={t} showRenameKeyModal={showRenameKeyModal} showRemoveKeyModal={showRemoveKeyModal} /> }
  </div>
)

const OptionsCell = ({ t, name, showRenameKeyModal, showRemoveKeyModal }) => {
  const buttonRef = useRef(null)
  const [isContextVisible, setContextVisibility] = useState(false)

  const handle = fn => () => {
    fn(name)
    setContextVisibility(false)
  }

  return (
    <div>
      <button className="button-inside-focus" onClick={() => setContextVisibility(true)} ref={buttonRef} aria-label={`${t('showOptions')}: ${name}`}>
        <GlyphDots width={24} className='fill-gray-muted hover-fill-gray transition-all'/>
      </button>
      <ContextMenu className="pv2 ph1" style={{ zIndex: 1001 }} visible={isContextVisible}
        target={buttonRef} onDismiss={() => setContextVisibility(false)} arrowAlign="right">
        <ContextMenuItem className='pv2 ph1' onClick={handle(showRenameKeyModal)}>
          <StrokePencil width="28" className='fill-aqua'/> <span className="ph1">{t('app:actions.rename')}</span>
        </ContextMenuItem>
        <ContextMenuItem className='pv2 ph1' onClick={handle(showRemoveKeyModal)}>
          <StrokeCancel width="28" className='fill-aqua'/> <span className="ph1">{t('app:actions.remove')}</span>
        </ContextMenuItem>
      </ContextMenu>
    </div>
  )
}

export const IpnsManager = ({ t, ipfsReady, doFetchIpnsKeys, doGenerateIpnsKey, doRenameIpnsKey, doRemoveIpnsKey, localGatewayUrl, publicGateway, shareLinkType, ipnsKeys = [], ipnsKeysStatus = 'idle' }) => {
  const { i18n } = useTranslation()
  const [isGenerateKeyModalOpen, setGenerateKeyModalOpen] = useState(false)
  const showGenerateKeyModal = () => setGenerateKeyModalOpen(true)
  const hideGenerateKeyModal = () => setGenerateKeyModalOpen(false)

  const [renameKeyModalName, setRenameKeyModalOpen] = useState('')
  const showRenameKeyModal = (name) => setRenameKeyModalOpen(name)
  const hideRenameKeyModal = () => setRenameKeyModalOpen('')
  const isRenameKeyModalOpen = () => renameKeyModalName !== ''

  const [removeKeyModalName, setRemoveKeyModalOpen] = useState('')
  const showRemoveKeyModal = (name) => setRemoveKeyModalOpen(name)
  const hideRemoveKeyModal = () => setRemoveKeyModalOpen('')
  const isRemoveKeyModalOpen = () => removeKeyModalName !== ''

  useEffect(() => {
    ipfsReady && doFetchIpnsKeys()
  }, [ipfsReady, doFetchIpnsKeys])

  const [sortSettings, setSortSettings] = useState({
    sortBy: 'name',
    sortDirection: SortDirection.ASC
  })

  const sortedKeys = useMemo(() =>
    [...(ipnsKeys || [])].sort(sortByProperty(sortSettings.sortBy, sortSettings.sortDirection === SortDirection.ASC ? 1 : -1)),
  [ipnsKeys, sortSettings.sortBy, sortSettings.sortDirection])

  const hasCurrentKeys = ipfsReady && ipnsKeysStatus === 'ready' && sortedKeys.length > 0
  const statusText = !ipfsReady
    ? t('app:status.disconnectedShort')
    : ipnsKeysStatus === 'loading'
      ? t('app:terms.loading')
      : ipnsKeysStatus === 'error'
        ? t('errors.failedToFetch')
        : ipnsKeysStatus === 'ready'
          ? new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language || undefined).format(0)
          : t('app:terms.unknown')

  // Local gateway link honoring the Share Link type from Settings (subdomain
  // origin when chosen), falling back to the public gateway, or no link at all.
  const ipnsUrl = (id) => {
    const ipnsName = toIpnsBase36(id)
    return getLocalContentLink({
      shareLinkType,
      namespace: 'ipns',
      pathId: ipnsName,
      subdomainLabel: ipnsName,
      localGatewayUrl
    }) || (publicGateway ? `${publicGateway}/ipns/${ipnsName}` : '')
  }

  return (
    <Fragment>
      <div className="mv4 pinningManager">
        <div className='ph1 ph3-l flex items-center bg-white lh-copy charcoal f6 fw5'>
          {hasCurrentKeys
            ? <AutoSizer disableHeight>
            {({ width }) => (
              <Table
                aria-label={t('ipnsPublishingKeys.title')}
                containerRole='presentation'
                className='tl fw4 w-100 f6'
                headerClassName='gray ttc fw4 f6 ph2'
                width={width}
                height={(sortedKeys.length + 1) * ROW_HEIGHT}
                headerHeight={HEADER_HEIGHT}
                rowHeight={ROW_HEIGHT}
                rowCount={sortedKeys.length}
                rowGetter={({ index }) => sortedKeys[index]}
                rowClassName='mt2'
                sort={(...sortArgs) => setSortSettings(...sortArgs)}
                sortBy={sortSettings.sortBy}
                sortDirection={sortSettings.sortDirection}>
                <Column
                  label={t('app:terms.name')}
                  title={t('app:terms.name')}
                  dataKey='name'
                  width={width * 0.3}
                  flexShrink={0}
                  flexGrow={1}
                  cellRenderer={({ rowData }) => rowData.name}
                  className='charcoal truncate f6' />
                <Column
                  label={t('app:terms.id')}
                  title={t('app:terms.id')}
                  dataKey='id'
                  width={width * 0.6}
                  className='charcoal monospace truncate f6 pl2'
                  flexShrink={1}
                  cellRenderer={({ rowData }) => {
                    if (!rowData.published) return rowData.id
                    const url = ipnsUrl(rowData.id)
                    return url
                      ? <a href={url} target='_blank' rel='noopener noreferrer' className='link blue'>{rowData.id}</a>
                      : rowData.id
                  }} />
                <Column
                  dataKey='options'
                  label={t('showOptions')}
                  headerRenderer={() => <span className='clip'>{t('showOptions')}</span>}
                  disableSort
                  width={width * 0.1}
                  flexShrink={1}
                  cellRenderer={({ rowData }) => <AutoOptionsCell t={t} name={rowData.name} showRenameKeyModal={showRenameKeyModal} showRemoveKeyModal={showRemoveKeyModal} />}
                  className='pinningManagerColumn charcoal truncate f6 pl2' />
              </Table>
            )}
          </AutoSizer>
            : <p role='status' aria-label={t('ipnsPublishingKeys.title')} aria-atomic='true' className='fw4'>
            {t('ipnsPublishingKeys.title')}: {statusText}
          </p>}
        </div>

        <div className='flex justify-end w-100 mt2'>
          <Button className="tc mt2" bg='bg-navy' onClick={showGenerateKeyModal}>
            <span><span className="aqua">+</span> {t('actions.generateKey')}</span>
          </Button>
        </div>
      </div>

      <Overlay show={isGenerateKeyModalOpen} onLeave={hideGenerateKeyModal}>
        <GenerateKeyModal
          className='outline-0'
          onSubmit={(name) => {
            doGenerateIpnsKey(name)
            hideGenerateKeyModal()
          }}
          onCancel={hideGenerateKeyModal}
          t={t} />
      </Overlay>

      <Overlay show={isRenameKeyModalOpen()} onLeave={hideRenameKeyModal}>
        <RenameKeyModal
          className='outline-0'
          name={renameKeyModalName}
          onSubmit={(name) => {
            doRenameIpnsKey(renameKeyModalName, name)
            hideRenameKeyModal()
          }}
          onCancel={hideRenameKeyModal}
          t={t} />
      </Overlay>

      <Overlay show={isRemoveKeyModalOpen()} onLeave={hideRemoveKeyModal}>
        <RemoveKeyModal
          className='outline-0'
          name={removeKeyModalName}
          onRemove={(name) => {
            doRemoveIpnsKey(removeKeyModalName)
            hideRemoveKeyModal()
          }}
          onCancel={hideRemoveKeyModal}
          t={t} />
      </Overlay>
    </Fragment>
  )
}

export default connect(
  'selectIpfsReady',
  'selectIpnsKeys',
  'selectIpnsKeysStatus',
  'selectLocalGatewayUrl',
  'selectPublicGateway',
  'selectShareLinkType',
  'doFetchIpnsKeys',
  'doGenerateIpnsKey',
  'doRemoveIpnsKey',
  'doRenameIpnsKey',
  IpnsManager
)
