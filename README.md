# dl-native

Dynamic library JavaScript bindings for Node.js.

```sh
npm install dl-native
```

## Usage

```js
const { open } = require('dl-native')

const lib = open('lib.node')

const mod = lib.exports('init')
```

## API

#### `const lib = open(filename)`

Open the library referred to by `filename`. This will increase the reference count of the underlying library handle by 1.

#### `lib.close()`

Close the library. This will decrement the reference count of the underlying library handle by 1. When the reference count reaches 0, the library is removed from the address space of the process.

#### `const buf = lib.symbol(name)`

Retrieve a pointer to the symbol referred to by `name`. The pointer is represented as a buffer and may be passed to other Node-API functions and cast to a concrete type.

#### `const mod = lib.exports(name)`

Return the declarations exported by the function pointer referred to by `name`. The function pointer must be of type `napi_addon_register_func` and will typically be the Node-API initialisation function of the library.

## License

ISC
