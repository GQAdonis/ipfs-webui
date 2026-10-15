// Types of the SettingsClient contract (mcp/contract/settings/client in the kubo
// repository). This file holds typedefs only; the schemas there are the source
// of truth and these mirror them.

/** @typedef {'openai' | 'uar'} BackendKind */
/** @typedef {{ set: boolean, source?: 'settings_api' | 'environment' | 'file' }} ApiKeyStatus */
/** @typedef {{ kind: BackendKind, base_url?: string, model?: string, api_key?: ApiKeyStatus }} BackendRead */
/** @typedef {{ safety_prefix: string, custom: string }} SystemPromptRead */
/** @typedef {{ reason: 'host_changed', cleared: boolean }} KeyNotCarried */
/** @typedef {{ revision: string, backend: BackendRead | null, system_prompt: SystemPromptRead, key_not_carried?: KeyNotCarried }} GetResponse */
/** @typedef {GetResponse} SetResponse */
/** @typedef {{ kind?: BackendKind, base_url?: string, model?: string, api_key?: string }} BackendSet */
/** @typedef {{ revision: string, backend?: BackendSet, system_prompt?: string, egress_confirmation?: { host: string } }} SetRequest */
/** @typedef {{ base_url: string, kind?: BackendKind }} TestConnectionRequest */
/** @typedef {{ ok: boolean, detail?: string, latency_ms?: number, models?: string[], key_sent?: boolean }} TestConnectionResult */
/** @typedef {{ revision: string, api_key: string, kind?: BackendKind }} SetApiKeyRequest */
/** @typedef {{ revision: string, api_key: ApiKeyStatus }} SetApiKeyResponse */
/** @typedef {{ revision: string, kind?: BackendKind }} ClearApiKeyRequest */
/** @typedef {{ revision: string, api_key: { set: false } }} ClearApiKeyResponse */
/** @typedef {{ at: string, ok: boolean, error?: string }} AppliedRecord */
/** @typedef {{ transport: 'http' | 'desktop-bridge', managed_by_desktop: boolean, endpoint?: string, sidecar?: { running: boolean, port?: number }, revision?: string, applied?: AppliedRecord }} StatusResponse */
/** @typedef {{ type: 'settings_changed', revision: string }} SettingsChangedEvent */

/**
 * @typedef {Object} SettingsClient
 * @property {() => Promise<GetResponse>} get
 * @property {(req: SetRequest) => Promise<SetResponse>} set
 * @property {(req: TestConnectionRequest) => Promise<TestConnectionResult>} testConnection
 * @property {(req: SetApiKeyRequest) => Promise<SetApiKeyResponse>} setApiKey
 * @property {(req: ClearApiKeyRequest) => Promise<ClearApiKeyResponse>} clearApiKey
 * @property {() => Promise<StatusResponse>} status
 * @property {(cb: (event: SettingsChangedEvent) => void) => () => void} onChange
 */

export {}
