import React from 'react'

export const Title = ({ children, ...props }) => (
  <h2 className='prom-title mt0 mb4' {...props}>{ children }</h2>
)
