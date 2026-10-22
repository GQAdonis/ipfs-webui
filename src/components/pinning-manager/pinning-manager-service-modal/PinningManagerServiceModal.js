import React, { useRef, useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from '../../../lib/react-store.js'
import { withTranslation, Trans } from 'react-i18next'
import { useForm } from 'react-hook-form'

// Components
import { Modal, ModalBody, ModalActions } from '../../modal/modal'
import Button from '../../button/button.tsx'
import './PinningManagerServiceModal.css'

export const PinningManagerServiceModal = ({ t, onLeave, onSuccess, className = '', service, tReady, doAddPinningService, nickname = '', apiEndpoint = '', visitServiceUrl, secretApiKey, complianceReportUrl, ...props }) => {
  const { register, formState: { errors, isSubmitting }, clearErrors, setError, handleSubmit } = useForm({
    defaultValues: {
      nickname,
      apiEndpoint,
      secretApiKey: ''
    }
  })
  const pendingSubmit = useRef(false)
  const [saving, setSaving] = useState(false)
  const inputClass = 'w-100 lh-copy f5 ph2 pv1 input-reset ba br1 focus-outline'
  const onSubmit = async data => {
    if (pendingSubmit.current) return
    pendingSubmit.current = true
    setSaving(true)
    try {
      await doAddPinningService(data)
      onSuccess()
    } catch (error) {
      console.error(error)
      setError('root.apiValidation', {
        type: 'manual',
        message: error.message
      })
    } finally {
      pendingSubmit.current = false
      setSaving(false)
    }
  }
  const cleanErrors = () => {
    clearErrors('root.apiValidation')
  }

  return (
    <Modal {...props} className={className} onCancel={onLeave} style={{ maxWidth: '34em' }}>
      <form onSubmit={handleSubmit(onSubmit)} onChange={cleanErrors}>
        <ModalBody>
          <p>{ t('pinningServiceModal.title') }</p>
          {complianceReportUrl && (<a className="mb1 tl f7 charcoal-muted no-underline underline-hover" target="_blank" rel="noreferrer" href={complianceReportUrl}>{t('pinningServiceModal.complianceLabel', { nickname })}</a>) }

          <div className='pa2 pinningManagerServiceModalContainer'>
            { service.icon && service.name && (
              <>
                <label>
                  { t('pinningServiceModal.service') }
                </label>
                <div className="flex w-100 items-center">
                  <img className="mr3" src={service.icon} alt={service.name} height={42} style={{ objectFit: 'contain' }} />
                  <span>{ service.name }</span>
                </div>
              </>
            )}

            <label htmlFor="cm-nickname">
              { t('pinningServiceModal.nickname') }
            </label>
            <div className='relative'>
              <input id='cm-nickname'
                {...register('nickname', { required: true })}
                type='text'
                className={ classNames(inputClass, errors.nickname ? 'bg-red white' : 'charcoal') }
                placeholder={ t('pinningServiceModal.nicknamePlaceholder') }
              />
              {errors.nickname && (<ErrorMsg text={ t('errors.nickname') }/>)}
            </div>

            <label htmlFor="cm-apiEndpoint">
              { t('pinningServiceModal.apiEndpoint') }
            </label>
            <div className='relative'>
              <input id='cm-apiEndpoint'
                {...register('apiEndpoint', { required: true, pattern: /^https?:\/\/.+/i })}
                type='url'
                className={ classNames(inputClass, errors.apiEndpoint ? 'bg-red white' : 'charcoal') }
                placeholder={ t('pinningServiceModal.apiEndpointPlaceholder') }
              />
              {errors.apiEndpoint && (<ErrorMsg text={`${t('errors.apiError')}: ${t('errors.apiEndpoint')}`}/>)}
            </div>

            <label htmlFor="cm-secretApiKey">
              { t('pinningServiceModal.secretApiKey') }
              { service.icon && service.name && visitServiceUrl && (
                <a className='f7 link pv0 lh-copy dib' href={ visitServiceUrl } rel='noopener noreferrer' target="_blank"> { t('pinningServiceModal.secretApiKeyHowToLink') }</a>
              )}
            </label>
            <div className='relative'>
              <input id='cm-secretApiKey'
                {...register('secretApiKey', { required: true })}
                type='password'
                autoComplete='off'
                className={ classNames(inputClass, errors.secretApiKey ? 'bg-red white' : 'charcoal') }
                placeholder="••••••••••••••••••••"
              />
              {errors.secretApiKey && (<ErrorMsg text={ t('errors.secretApiKey') }/>)}
            </div>
          </div>
          <div>
            { errors.root?.apiValidation && <p role='alert' className='red f5 ttc'>{ errors.root?.apiValidation.message}</p> }
          </div>
          <p className='f6'>
            <Trans i18nKey="pinningServiceModal.description" t={t}>
              Want to make your custom pinning service available to others?
              <a href='https://docs.ipfs.tech/how-to/work-with-pinning-services/' rel='noopener noreferrer' target="_blank" className='pv0 dib link' type='link'>Learn how.</a>
            </Trans>
          </p>
        </ModalBody>

        <ModalActions justify="center" className='flex flex-row-reverse'>
          {/* Button that actually submits the form needs to be first in HTML, that's why we reverse the order with css */}
          <Button className='ma2 tc' buttonType="submit" disabled={saving || isSubmitting}>{t('actions.save')}</Button>
          <Button className='ma2 tc' bg='bg-gray' buttonType='button' onClick={onLeave}>{t('actions.cancel')}</Button>
        </ModalActions>
      </form>
    </Modal>
  )
}

PinningManagerServiceModal.propTypes = {
  className: PropTypes.string,
  nickname: PropTypes.string,
  apiEndpoint: PropTypes.string,
  t: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
}

const ErrorMsg = ({ text }) => (<p className='red absolute f7' style={{ top: 26, left: 2 }}>{text}</p>)

export default connect(
  'doAddPinningService',
  withTranslation('settings')(PinningManagerServiceModal)
)
