import test from 'brittle'

import { open } from './index.js'

const isBare = typeof Bare !== 'undefined'

const { platform, arch } = isBare ? Bare : process

const addon = `prebuilds/${platform}-${arch}/dl-native.${isBare ? 'bare' : 'node'}`

const register = isBare ? 'bare_register_module_v0' : 'napi_register_module_v1'

test('open + close', (t) => {
  const lib = open(addon)
  t.ok(lib)
  t.is(lib.closed, false)

  lib.close()
  t.is(lib.closed, true)
})

test('open missing library', (t) => {
  t.exception(() => open('missing'))
})

test('close multiple times', (t) => {
  const lib = open(addon)

  lib.close()
  t.execution(() => lib.close())
})

test('symbol', (t) => {
  const lib = open(addon)
  t.teardown(() => lib.close())

  const ptr = lib.symbol(register)
  t.ok(ptr)
})

test('symbol missing', (t) => {
  const lib = open(addon)
  t.teardown(() => lib.close())

  t.exception(() => lib.symbol('missing'))
})

test('symbol after close', (t) => {
  const lib = open(addon)
  lib.close()

  t.exception(() => lib.symbol(register), /Library is closed/)
})

test('exports', (t) => {
  const lib = open(addon)
  t.teardown(() => lib.close())

  const mod = lib.exports(register)
  t.is(typeof mod.open, 'function')
  t.is(typeof mod.exports, 'function')
})
