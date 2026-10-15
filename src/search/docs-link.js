import { BRAND } from '../promethity/brand.js'

// Where the search setup is explained: the embeddings page of the Kubo MCP
// documentation, built from the brand constants so the repository and ref live
// in one place. One module so every message that points at the docs agrees.
const EMBEDDINGS_DOC = `${BRAND.kuboForkRepo}/blob/${BRAND.kuboDocsRef}/docs/mcp/embeddings.md`

/** How search is set up and reached over HTTP (the section "Search over HTTP"). */
export const SEARCH_DOCS_URL = `${EMBEDDINGS_DOC}#search-over-http`
/** What a search sends to the embedding model (the section "What leaves the machine"). */
export const SEARCH_EGRESS_DOCS_URL = `${EMBEDDINGS_DOC}#what-leaves-the-machine`
export const AGENT_SETTINGS_HASH = '#/settings/agent'
