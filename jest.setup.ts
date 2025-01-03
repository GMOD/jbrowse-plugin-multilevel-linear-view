import '@testing-library/jest-dom'

global.structuredClone = (val) => {
  return val === undefined ? undefined : JSON.parse(JSON.stringify(val))
}
const crypto = require('crypto')

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
  },
})
