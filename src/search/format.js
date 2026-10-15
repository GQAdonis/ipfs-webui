const UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

/** @param {number} n */
export const formatCount = (n) => n.toLocaleString()

/**
 * Bytes in decimal units with one decimal, for example "12.4 MB".
 *
 * @param {number} bytes
 */
export function formatBytes (bytes) {
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < UNITS.length - 1) {
    value /= 1000
    unit += 1
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${UNITS[unit]}`
}
