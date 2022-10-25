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

  const ptr = lib.symbol('uv_napi_dlopen')
  t.ok(ptr)
})

test('symbol after close', async (t) => {
  const lib = open('build/Release/dl.node')
  lib.close()

  t.exception(() => lib.symbol('uv_napi_dlopen'), /Library is closed/)
})

test('exports', async (t) => {
  const lib = open('build/Release/dl.node')
  t.teardown(() => lib.close())

  const mod = lib.exports('napi_macros_init_wrap')
  t.ok(mod)
  t.comment(mod)

  console.log(mod.uv_napi_dlopen)
})

test('exports after close', async (t) => {
  const lib = open('build/Release/dl.node')
  lib.close()

  t.exception(() => lib.exports('napi_macros_init_wrap'), /Library is closed/)
})
