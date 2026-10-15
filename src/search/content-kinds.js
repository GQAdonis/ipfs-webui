// The content kinds and chunk sources of the search contract, as the browser needs
// them. The source of truth is kubo `mcp/contract/derivations/content-kinds.json`
// and the `ipfs_index_search` input schema (`kinds`, `sources`); content-kinds.test.js
// compares these lists with that file whenever the kubo checkout sits next to this one.

/** @typedef {'text' | 'document' | 'code' | 'data' | 'image' | 'video'} Kind */
/** @typedef {'text' | 'extracted' | 'ocr' | 'transcript' | 'description'} Source */

/** @type {readonly Kind[]} */
export const KINDS = Object.freeze(['text', 'document', 'code', 'data', 'image', 'video'])

/** @type {readonly Source[]} */
export const SOURCES = Object.freeze(['text', 'extracted', 'ocr', 'transcript', 'description'])

/**
 * The locale key (under `provenance.`) that says where a hit's text came from.
 * `text` and `extracted` are both the file's own text; the others name the stage.
 *
 * @type {Readonly<Record<Source, 'fromFile' | 'textInImage' | 'transcript' | 'aiDescription'>>}
 */
export const PROVENANCE_KEY = Object.freeze({
  text: 'fromFile',
  extracted: 'fromFile',
  ocr: 'textInImage',
  transcript: 'transcript',
  description: 'aiDescription'
})

/** @param {unknown} v @returns {v is Kind} */
export const isKind = (v) => typeof v === 'string' && /** @type {readonly string[]} */ (KINDS).includes(v)

/** @param {unknown} v @returns {v is Source} */
export const isSource = (v) => typeof v === 'string' && /** @type {readonly string[]} */ (SOURCES).includes(v)
