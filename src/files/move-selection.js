import { dirname, join } from 'path'

/** @param {Array<{path: string, name: string}>} selectedFiles
 * @param {string} source
 * @param {string} destination
 * @returns {Array<[string, string]>} */
export function selectedMoveOperations (selectedFiles, source, destination) {
  const operations = selectedFiles.map(file => /** @type {[string, string]} */ ([file.path, join(dirname(destination), file.name)]))
  if (!operations.some(([path]) => path === source)) operations.push([source, destination])
  return operations.filter(([from, to]) => from !== to)
}
