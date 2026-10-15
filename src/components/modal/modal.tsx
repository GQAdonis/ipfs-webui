import React from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon } from '../../promethity/icons.js'

// Type definitions
interface ModalActionsProps {
  justify?: 'between' | 'center' | 'start' | 'end' | 'around' | 'evenly'
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

interface ModalBodyProps {
  className?: string
  Icon?: React.ComponentType<{ className?: string }>
  title?: string | React.ReactNode
  children?: React.ReactNode
  [key: string]: any
}

interface ModalProps {
  onCancel?: (() => void) | null
  children?: React.ReactNode
  className?: string
  [key: string]: any
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  justify = 'between',
  className = '',
  children,
  ...props
}) => (
  <div
    className={`flex justify-${justify} pa2 prom-modal-actions ${className}`}
    {...props}
  >
    {children}
  </div>
)

export const ModalBody: React.FC<ModalBodyProps> = ({
  className = '',
  Icon,
  title,
  children,
  ...props
}) => (
  <div className={`ph4 pv3 tc ${className}`} {...props}>
    {Icon && (
      <div
        className='center bg-snow br-100 flex justify-center items-center'
        style={{ width: '80px', height: '80px' }}
      >
        <Icon className='fill-gray w3' />
      </div>
    )}

    <p className='charcoal fw6 truncate'>{title}</p>

    {children}
  </div>
)

export const Modal: React.FC<ModalProps> = ({
  onCancel = null,
  children,
  className = '',
  ...props
}) => {
  const { t } = useTranslation('app')
  return (
    <div
      className={`${className} prom-modal sans-serif relative`}
      data-testid="ipfs-modal"
      {...props}
    >
      {onCancel && (
        <button
          type='button'
          className='prom-modal-close absolute top-0 right-0 flex items-center justify-center pointer'
          aria-label={t('actions.close')}
          onClick={onCancel}
        >
          <CloseIcon />
        </button>
      )}

      {children}
    </div>
  )
}

export default Modal
