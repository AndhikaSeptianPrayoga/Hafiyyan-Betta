import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for jsdom environment
import { TextEncoder, TextDecoder } from 'util'

;(globalThis as any).TextEncoder = TextEncoder
;(globalThis as any).TextDecoder = TextDecoder