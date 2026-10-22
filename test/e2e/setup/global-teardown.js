import { stop } from './ipfs-backend.js'
// Current setup returns an owned teardown closure. Keep this older explicit
// hook callable without shared JSON/PID files or swallowed cleanup failures.
export default stop
