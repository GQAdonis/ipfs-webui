import assert from 'node:assert/strict'
import { sha256 } from '../../scripts/local-artifact.mjs'

export function rasterDifference (left, right) {
  for (const raster of [left, right]) assert.ok(Number.isInteger(raster.width) && Number.isInteger(raster.height) && raster.width > 0 && raster.height > 0 && raster.data.length === raster.width * raster.height * 4, 'Actual nonempty RGBA raster required')
  if (left.width !== right.width || left.height !== right.height) return { equal: false, reason: 'dimensions', left: [left.width, left.height], right: [right.width, right.height] }
  let changedPixels = 0
  for (let index = 0; index < left.data.length; index += 4) if ([0, 1, 2, 3].some(offset => left.data[index + offset] !== right.data[index + offset])) changedPixels++
  return { equal: changedPixels === 0, changedPixels, totalPixels: left.width * left.height, width: left.width, height: left.height, leftRgbaSha256: sha256(left.data), rightRgbaSha256: sha256(right.data), threshold: 0, masks: [] }
}

export async function decodeScreenshot (page, bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Actual screenshot PNG bytes required')
  const raster = await page.evaluate(async base64 => {
    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0))
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Browser RGBA decoder unavailable')
    context.drawImage(bitmap, 0, 0)
    const data = context.getImageData(0, 0, bitmap.width, bitmap.height).data
    let binary = ''
    for (let offset = 0; offset < data.length; offset += 8192) binary += String.fromCharCode(...data.subarray(offset, offset + 8192))
    const result = { width: bitmap.width, height: bitmap.height, base64: btoa(binary) }
    bitmap.close()
    return result
  }, bytes.toString('base64'))
  return { width: raster.width, height: raster.height, data: Buffer.from(raster.base64, 'base64') }
}
