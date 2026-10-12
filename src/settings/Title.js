import React from 'react'

/** @param {{ props?: Record<string, any>, children?: React.ReactNode }} args */
const Title = ({ props, children }) => (
  <h2 className='ttu tracked f6 fw4 teal mt0 mb3' {...props}>{ children }</h2>
)
export default Title
