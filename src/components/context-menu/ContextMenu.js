import React, { useRef, useState, useLayoutEffect } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { DropdownMenu } from '../../files/dropdown/Dropdown.js'
import Portal from '../../helpers/Portal.js'

/**
 * Shows a context menu with specified children elements relative to a target element
 *
 * Important: Child elements should contain role="menuitem" to allow for keyboard navigation
 * @component
 * @example
 * <ContextMenu>
 *  <button role="menuitem">1</button>
 *  <button role="menuitem" onClick={stuff}>2</button>
 * </ContextMenu>
 */
const ContextMenu = ({ className, children, target, visible, arrowAlign, arrowMarginRight = 13, onDismiss }) => {
  const containerRef = useRef(null)
  const [coordinates, setCoordinates] = useState({})

  useLayoutEffect(() => {
    const calculateCoordinates = () => {
      if (!target?.current) return
      const { top, left, width, height } = target.current.getBoundingClientRect()
      setCoordinates({ top, left, width, height })
    }

    calculateCoordinates()

    let frame
    const onMove = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(calculateCoordinates)
    }
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
      cancelAnimationFrame(frame)
    }
  }, [target, visible])

  if (!visible || !target || !target.current) return null

  const offsetLeft = getOffsetLeftByArrowAlignment(arrowAlign, { ...coordinates, arrowMarginRight })

  return (
    <Portal id="portal-dropdown">
      <div className={ classNames('fixed', className) } style={{
        top: coordinates.top,
        left: coordinates.left
      }}>
        <DropdownMenu
          ref={containerRef}
          open={ visible }
          className='sans-serif br2 charcoal'
          boxShadow='none'
          background='var(--raised)'
          width='auto'
          arrowAlign={arrowAlign || 'center'}
          arrowMarginRight={`${arrowMarginRight}px`}
          top={coordinates.height}
          left={-coordinates.width - offsetLeft}
          translateX={-coordinates.width}
          onDismiss={ onDismiss }>
          <div className='flex flex-column pa2'>
            {children}
          </div>
        </DropdownMenu>
      </div>
    </Portal>
  )
}

ContextMenu.propTypes = {
  arrowAlign: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  visible: PropTypes.bool,
  target: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onDismiss: PropTypes.func,
  arrowMarginRight: PropTypes.number
}

const getOffsetLeftByArrowAlignment = (arrowAlign, { width, arrowMarginRight }) => {
  switch (arrowAlign) {
    case 'right':
      return width + (arrowMarginRight * 2)
    default:
      return 0
  }
}

export default ContextMenu
