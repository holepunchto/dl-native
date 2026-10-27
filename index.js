const b4a = require('b4a')
const binding = require('./binding')

class DynamicLibrary {
  constructor(filename) {
    this._handle = binding.open(filename)

    this.closed = false
  }

  symbol(name) {
    if (this.closed) throw new Error('Library is closed')

    return b4a.from(binding.sym(this._handle, name))
  }

  exports(name) {
    if (this.closed) throw new Error('Library is closed')

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
