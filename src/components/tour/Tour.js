import React from 'react'
import { Joyride } from 'react-joyride'

/**
 * The existing translated tours share one migration boundary to Joyride 3.
 * @typedef {Omit<import('react-joyride').Step, 'skipBeacon'> & {disableBeacon?: boolean}} LegacyStep
 * @typedef {Partial<import('react-joyride').Styles> & {options?: Partial<import('react-joyride').Options>, buttonNext?: import('react').CSSProperties}} LegacyStyles
 * @param {Omit<import('react-joyride').Props, 'steps' | 'styles' | 'onEvent'> & {steps?: LegacyStep[], styles?: LegacyStyles, callback?: import('react-joyride').EventHandler, showProgress?: boolean, disableOverlay?: boolean, disableScrolling?: boolean}} props
 */
export default function Tour ({ callback, styles = {}, steps = [], showProgress = false, disableOverlay = false, disableScrolling = false, ...props }) {
  const { options, buttonNext, ...skin } = styles
  return <Joyride {...props} onEvent={callback}
    options={{ ...options, showProgress, hideOverlay: disableOverlay, skipScroll: disableScrolling }}
    styles={{ ...skin, ...(buttonNext ? { buttonPrimary: buttonNext } : {}) }}
    steps={steps.map(({ disableBeacon, ...step }) => ({ ...step, ...(disableBeacon !== undefined ? { skipBeacon: disableBeacon } : {}) }))} />
}
