// The one source for the Promethity product identity (D6). Every title,
// footer, manifest and about line that names the product reads this constant
// instead of hard-coding the name, so the acceptance grep can prove the name
// lives in exactly one place.

export const BRAND = Object.freeze({
  name: 'Promethity',
  tagline: 'Fire you can hold.',
  // Where this fork's source lives, and the upstream project it is built on
  // (D8: attribution in About and the footer). The MIT notice in LICENSE stays
  // as upstream wrote it.
  forkRepo: 'https://github.com/GQAdonis/ipfs-webui',
  upstreamRepo: 'https://github.com/ipfs/ipfs-webui',
  // The Kubo fork that carries the `ipfs mcp` documentation the Web UI links to,
  // and the ref those links read from.
  kuboForkRepo: 'https://github.com/GQAdonis/kubo',
  kuboDocsRef: 'master'
})
