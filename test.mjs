import test from 'brittle'

import { open } from './index.js'

test('open + close', async (t) => {
  const lib = open('build/Release/dl.node')
  t.ok(lib)
  t.is(lib.closed, false)

  lib.close()
  t.is(lib.closed, true)
})

test('close multiple times', async (t) => {
  const lib = open('build/Release/dl.node')

  lib.close()
  t.execution(() => lib.close())
})

test('symbol', async (t) => {
  const lib = open('build/Release/dl.node')
  t.teardown(() => lib.close())

  const ptr = lib.symbol('dl_napi_open')
  t.ok(ptr)
})

test('symbol after close', async (t) => {
  const lib = open('build/Release/dl.node')
  lib.close()

  t.exception(() => lib.symbol('dl_napi_open'), /Library is closed/)
})
