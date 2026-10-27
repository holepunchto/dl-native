# dl-native

Dynamic library bindings for JavaScript.

```sh
npm install dl-native
```

## Usage

```js
const { open } = require('dl-native')

const lib = open('lib.bare')

const mod = lib.exports('init')
```

## API

#### `const lib = open(filename)`

Open the library referred to by `filename`. This will increase the reference count of the underlying library handle by 1.

#### `lib.close()`

Close the library. This will decrement the reference count of the underlying library handle by 1. When the reference count reaches 0, the library is removed from the address space of the process.

#### `const buf = lib.symbol(name)`

Retrieve a pointer to the symbol referred to by `name`. The pointer is represented as a buffer and may be passed to other native functions and cast to a concrete type.

#### `const mod = lib.exports(name)`

Return the declarations exported by the function pointer referred to by `name`. The function pointer must be of type `bare_module_register_cb` in Bare and `napi_addon_register_func` in Node.js, and will typically be the module initialisation function of the library, such as `bare_register_module_v0` or `napi_register_module_v1`.

## License

ISC
