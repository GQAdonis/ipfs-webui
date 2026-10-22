import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import '@testing-library/react/dont-cleanup-after-each'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { TextDecoder, TextEncoder } from 'node:util'
import { installNativeDialogFixture } from './helpers/native-dialog.js'

globalThis.TextDecoder = TextDecoder
globalThis.TextEncoder = TextEncoder
globalThis.IS_REACT_ACT_ENVIRONMENT = true
installNativeDialogFixture()
afterEach(cleanup)
