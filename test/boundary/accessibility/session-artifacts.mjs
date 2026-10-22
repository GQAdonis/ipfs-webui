/** One allocator per boundary run; allocation precedes asynchronous session close. */
export function createSessionArtifactNames () {
  let sequence = 0
  return (theme, width) => {
    if (!['light', 'dark'].includes(theme) || !Number.isSafeInteger(width) || width <= 0) throw new Error('Invalid browser artifact identity')
    const suffix = `${theme}-${width}-${++sequence}`
    return { record: `browser-${suffix}`, trace: `trace-${suffix}.zip` }
  }
}
