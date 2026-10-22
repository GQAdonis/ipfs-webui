import React, { useState } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'react-qr-code'
import Button from '../../../components/button/button.tsx'
import Checkbox from '../../../components/checkbox/Checkbox.js'
import { withTranslation, Trans } from 'react-i18next'
import { CopyToClipboard } from '../../../components/copy-to-clipboard/CopyToClipboard.js'
import { Modal, ModalActions, ModalBody } from '../../../components/modal/modal'
import { SHARE_LINK_TYPE } from '../../../lib/share-link.js'

const COMPANION_URL = 'https://docs.ipfs.tech/install/ipfs-companion/'

export const ShareModal = ({ t, tReady, onLeave, link, type = '', localLink = '', subdomainLocalLink = '', className = '', ...props }) => {
  const helpId = React.useId()
  const [useLocalLink, setUseLocalLink] = useState(false)
  const [useSubdomains, setUseSubdomains] = useState(false)

  // Turning off the local link hides the nested subdomain checkbox, so clear its
  // choice too; otherwise re-enabling the local link would jump straight to the
  // subdomain variant without the user opting back in.
  const toggleLocalLink = (checked) => {
    setUseLocalLink(checked)
    if (!checked) {
      setUseSubdomains(false)
    }
  }

  const isLocalType = type === SHARE_LINK_TYPE.LOCAL_PATH || type === SHARE_LINK_TYPE.LOCAL_SUBDOMAIN
  const isPublicType = type === SHARE_LINK_TYPE.PUBLIC_PATH || type === SHARE_LINK_TYPE.PUBLIC_SUBDOMAIN

  // The Settings choice already decides the link, so the local-link checkboxes
  // only add value when that choice is native or public (otherwise redundant).
  const offerLocalLink = !isLocalType && Boolean(localLink)
  const showingLocalLink = isLocalType || (offerLocalLink && useLocalLink)

  let activeLink = link
  if (offerLocalLink && useLocalLink) {
    activeLink = useSubdomains && subdomainLocalLink ? subdomainLocalLink : localLink
  }

  // A QR code only helps when scanning the link on another device, which is the
  // public-gateway case; native and same-machine links are not scanned.
  const showQRCode = isPublicType && !(offerLocalLink && useLocalLink)

  let description = t('shareModal.description')
  if (showingLocalLink) {
    description = t('shareModal.descriptionLocal')
  } else if (type === SHARE_LINK_TYPE.NATIVE) {
    description = (
      <Trans i18nKey='shareModal.descriptionNative' t={t}>
        This native IPFS address opens in apps and browsers that support IPFS, like the <a className='link blue' href={COMPANION_URL} target='_blank' rel='noopener noreferrer'>IPFS Companion</a> extension.
      </Trans>
    )
  }

  return (
    <Modal {...props} className={className} onCancel={onLeave} >
      <ModalBody title={t('shareModal.title')}>
        <p className='charcoal w-90 center'>{description}</p>
        {showQRCode && (
          <div className='flex justify-center pb3'>
            <QRCode
              size={180}
              value={activeLink}
            />
          </div>
        )}
        <div className='flex center w-90 pb2'>
          <input
            value={activeLink}
            aria-label={t('shareModal.linkLabel')}
            aria-describedby={helpId}
            readOnly
            className={'input-reset flex-grow-1 charcoal-muted ba br1 pa2 mr2 focus-outline'}
            type='text' />
        </div>
        <details id={helpId} className='charcoal w-90 center f6 mb3'>
          <summary>{t('shareModal.contentHelpTitle')}</summary>
          <p>{t('shareModal.contentIdentity')}</p>
          <p>{t('shareModal.availability')}</p>
          <p>{t('shareModal.accessControl')}</p>
          <p>{t('shareModal.encryption')}</p>
        </details>
        {offerLocalLink && (
          <div className='flex center w-90 pb2'>
            <Checkbox
              checked={useLocalLink}
              onChange={toggleLocalLink}
              label={t('shareModal.useLocalLink')}
            />
          </div>
        )}
        {offerLocalLink && useLocalLink && subdomainLocalLink && (
          <div className='flex center w-90 pb2 ml3'>
            <Checkbox
              checked={useSubdomains}
              onChange={setUseSubdomains}
              label={t('shareModal.useSubdomains')}
            />
          </div>
        )}
      </ModalBody>

      <ModalActions>
        <Button className='ma2 tc' bg='bg-gray' onClick={onLeave}>{t('app:actions.close')}</Button>
        <CopyToClipboard text={activeLink} onCopy={onLeave}>
          <Button className='ma2 tc'>{t('app:actions.copy')}</Button>
        </CopyToClipboard>
      </ModalActions>
    </Modal>
  )
}

ShareModal.propTypes = {
  onLeave: PropTypes.func.isRequired,
  link: PropTypes.string,
  type: PropTypes.string,
  localLink: PropTypes.string,
  subdomainLocalLink: PropTypes.string,
  t: PropTypes.func.isRequired,
  tReady: PropTypes.bool.isRequired
}

export default withTranslation('files')(ShareModal)
