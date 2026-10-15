import React from 'react'
import { CloseIcon as CancelIcon } from '../../promethity/icons.js'

const Toast = ({ error, children, onDismiss, dismissLabel = 'Dismiss notification' }) => {
  const tone = error ? 'prom-toast-warn' : 'prom-toast-ok'
  return (
    <div className='fixed bottom-0 tc pb2 z-max' style={{ left: '50% ', transform: 'translateX(-50%)' }}>
      <div className={`flex items-center f5 lh-copy pl2 pl4-ns pv2 prom-toast ${tone}`} role={error ? 'alert' : 'status'}>
        {children}
        <button type='button' className='prom-toast-dismiss ph3 pointer bg-transparent bn' aria-label={dismissLabel} onClick={onDismiss}>
          <CancelIcon
            className='fill-current-color'
            style={{ height: '28px', transform: 'scale(1.5)' }}
            aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}

export default Toast
