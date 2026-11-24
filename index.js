const b4a = require('b4a')
const binding = require('./binding')

class DynamicLibrary {
  constructor(filename) {
    validateNoNullBytes(filename, 'filename')

    this._handle = binding.open(filename)

    this.closed = false
  }

  symbol(name) {
    if (this.closed) throw new Error('Library is closed')

    validateNoNullBytes(name, 'name')

    return b4a.from(binding.sym(this._handle, name))
  }

  exports(name) {
    if (this.closed) throw new Error('Library is closed')

    validateNoNullBytes(name, 'name')

    return binding.exports(this._handle, name)
  }

  close() {
    if (this.closed) return
    this.closed = true

    binding.close(this._handle)

    this._handle = null
  }
}

exports.open = function open(filename) {
  return new DynamicLibrary(filename)
}

// The value is passed on as a C string, so a NUL would cut it short.
function validateNoNullBytes(value, name) {
  if (typeof value === 'string' && value.includes('\0')) {
    throw new TypeError(`The "${name}" argument must not contain null bytes`)
  }
}
