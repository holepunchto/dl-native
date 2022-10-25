const binding = require('node-gyp-build')(__dirname)
const b4a = require('b4a')

class DynamicLibrary {
  constructor (filename) {
    this._handle = b4a.allocUnsafe(binding.sizeof_uv_napi_lib_t)

    this.closed = false

    binding.uv_napi_dlopen(this._handle, filename)
  }

  symbol (name) {
    const handle = b4a.allocUnsafe(binding.sizeof_uv_napi_sym_t)

    binding.uv_napi_dlsym(this._handle, name, handle)

    return handle
  }

  close () {
    if (this.closed) return
    this.closed = true

    binding.uv_napi_dlclose(this._handle)

    this._handle = null
  }
}

exports.open = function open (filename) {
  return new DynamicLibrary(filename)
}
