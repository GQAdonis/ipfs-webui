import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { TrashIcon } from '../../../promethity/icons.js'
import Button from '../../../components/button/button.tsx'
import Checkbox from '../../../components/checkbox/Checkbox.js'
import { Modal, ModalActions, ModalBody } from '../../../components/modal/modal'
import { connect } from '../../../lib/react-store.js'

export const RemoveModal = ({ t, tReady, onCancel, onRemove, files, foldersCount = 0, filesCount = 0, remotePins, pinningServices, className = '', ...props }) => {
  let context = 'File'
  const count = filesCount + foldersCount

  if (foldersCount > 0) {
    if (filesCount > 0) {
      context = 'Item'
    } else {
      context = 'Folder'
    }
  }

  const isLocallyPinned = files.some(f => f.pinned)
  const [isRemotelyPinned, setRemotelyPinned] = useState(false)

  const [shouldRemoveLocalPin, setShouldRemoveLocalPin] = useState(isLocallyPinned)
  const [shouldRemoveRemotePin, setShouldRemoveRemotePin] = useState(false)

  useEffect(() => {
    (async () => {
      const isPinned = files.some(f => remotePins.find(p => p.endsWith(f.cid.toString())))
      setRemotelyPinned(isPinned)
    })()
  })

  const remoteServiceNames = pinningServices.map(service => service.name)
  const modalData = { count, name: files[0].name }
  const modalTitle = t(`removeModal.title${context}`, modalData)
  const modalDescription = t(`removeModal.scopeDescription${context}`, modalData)

  const handleLocalPinRemoval = () => setShouldRemoveLocalPin(!shouldRemoveLocalPin)
  const handleRemotePinRemoval = () => setShouldRemoveRemotePin(!shouldRemoveRemotePin)

  const handleRemove = () => onRemove({ removeLocally: shouldRemoveLocalPin, removeRemotely: shouldRemoveRemotePin, remoteServices: pinningServices.map(s => s.name) })

  return (
    <Modal {...props} className={className} onCancel={onCancel} >
      <ModalBody title={modalTitle} Icon={TrashIcon}>
        <div className='charcoal w-100 center tl'>
          <p>{modalDescription}</p>
          <p className='f6'>{t('removeModal.mfsRetention')}</p>
          { isLocallyPinned && (<div>
            <Checkbox className="mr1" checked={shouldRemoveLocalPin} onChange={handleLocalPinRemoval} label={t('removeModal.checkboxRemoveLocalPinScope')}/>
            <p className='f6'>{t('removeModal.localPinHelp')}</p>
          </div>
          )}
          { isRemotelyPinned && (<div className='mt1'>
            <Checkbox className="mr1" checked={shouldRemoveRemotePin} onChange={handleRemotePinRemoval} label={t('removeModal.checkboxUnpinFromServicesScope')}/>
            <p className='f6'>{t('removeModal.remotePinHelp')}</p>
          </div>
          )}
          <div className='f6' aria-live='polite'>
            <p>{t(shouldRemoveLocalPin ? 'removeModal.localPinRequested' : 'removeModal.localPinUnchanged')}</p>
            {shouldRemoveRemotePin
              ? <><p>{t(remoteServiceNames.length ? 'removeModal.remoteServicesRequested' : 'removeModal.noRemoteTargets')}</p>
              {remoteServiceNames.length > 0 ? <ul>{remoteServiceNames.map(name => <li key={name}><code>{name}</code></li>)}</ul> : null}</>
              : <p>{t('removeModal.remotePinsUnchanged')}</p>}
          </div>
        </div>
      </ModalBody>

      <ModalActions>
        <Button className='ma2 tc' bg='bg-gray' onClick={onCancel}>{t('app:actions.cancel')}</Button>
        <Button className='ma2 tc' bg='bg-red' onClick={handleRemove}>{t('app:actions.remove')}</Button>
      </ModalActions>
    </Modal>
  )
}

RemoveModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  filesCount: PropTypes.number,
  foldersCount: PropTypes.number,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
}

export default connect(
  'selectRemotePins',
  'selectPinningServices',
  withTranslation('files')(RemoveModal)
)
