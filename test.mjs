import test from 'brittle'

import { open } from './index.js'

test('open + close', async (t) => {
  const lib = open('build/Release/dl.node')
  t.ok(lib)
  t.absent(lib.closed)

  lib.close()
  t.ok(lib.closed)
})

test('symbol', async (t) => {
  const lib = open('build/Release/dl.node')
  t.teardown(() => lib.close())

  const ptr = lib.symbol('uv_napi_dlopen')
  t.ok(ptr)
})
