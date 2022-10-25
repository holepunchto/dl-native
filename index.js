const binding = require('node-gyp-build')(__dirname)
const b4a = require('b4a')

class DynamicLibrary {
  constructor (filename) {
    this._handle = b4a.allocUnsafe(binding.sizeof_dl_napi_lib_t)

    this.closed = false

    binding.dl_napi_open(this._handle, filename)
  }

  symbol (name) {
    if (this.closed) throw new Error('Library is closed')

    const handle = b4a.allocUnsafe(binding.sizeof_dl_napi_sym_t)

    binding.dl_napi_sym(this._handle, name, handle)

    return handle
  }

  exports (name) {
    if (this.closed) throw new Error('Library is closed')

    return binding.dl_napi_exports(this._handle, name)
  }

  close () {
    if (this.closed) return
    this.closed = true

    binding.dl_napi_close(this._handle)

    this._handle = null
  }
}

exports.open = function open (filename) {
  return new DynamicLibrary(filename)
}
