import { BRAND } from './brand.js'

// Document titles read "<page> | <product>". The product half comes from
// brand.js only, so no page hard-codes a product suffix
// (webui-titles-and-copy 1.1). Transifex-managed locales still carry the old
// "| IPFS" suffix in a few page titles; it is stripped so a translated title
// never shows two product names.
const LEGACY_SUFFIX = /\s*\|\s*IPFS\s*$/

/**
 * @param {...(string | null | undefined | false)} parts page, then section, most specific first
 * @returns {string}
 */
export const titleWithBrand = (...parts) =>
  [...parts.filter(Boolean).map((part) => String(part).replace(LEGACY_SUFFIX, '')), BRAND.name].join(' | ')
