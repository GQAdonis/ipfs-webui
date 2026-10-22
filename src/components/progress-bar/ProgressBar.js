import React from 'react'
import PropTypes from 'prop-types'
import './ProgressBar.css'

const ProgressBar = ({ bg = 'bg-aqua', br = 'br-pill', className = '', style, width = 'w-100', height = 'h1', progress, time, ...props }) => {
  return (
    <div className={`ProgressBar sans-serif overflow-hidden ${br} dib ${className} ${width} ${height}`} style={{ background: 'var(--control)', ...style }} {...props}>
      {time
        ? <div className={`${br} h-100 ${bg}`} style={{ animation: `progressBar ${time}s ease-in-out` }} />
        : <div className={`${br} h-100 ${bg}`} style={{ width: `${progress}%` }} />}
    </div>
  )
}

ProgressBar.propTypes = {
  className: PropTypes.string,
  bg: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  br: PropTypes.string,
  time: PropTypes.number,
  progress: PropTypes.number
}

export default ProgressBar
