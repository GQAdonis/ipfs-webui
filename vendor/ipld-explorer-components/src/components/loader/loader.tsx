import React from 'react'
import styles from './loader.module.css'

export const Loader: React.FC<{ color?: string }> = ({ color = 'light', ...props }) => {
  const className = `dib ${styles['la-ball-triangle-path']} ${color === 'dark' ? styles['la-dark'] : ''} ${styles['la-sm']}`
  return (
    <div {...props}>
      <div
        className={className}
        style={{ width: 20, height: 20 }}
      >
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}
