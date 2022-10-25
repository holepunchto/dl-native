#include <napi-macros.h>
#include <node_api.h>
#include <stdlib.h>
#include <uv.h>

typedef struct {
  uv_lib_t lib;
} uv_napi_lib_t;

typedef void *uv_napi_sym_t;

NAPI_METHOD(uv_napi_dlopen) {
  NAPI_ARGV(2)
  NAPI_ARGV_BUFFER_CAST(uv_napi_lib_t *, lib, 0)
  NAPI_ARGV_UTF8_MALLOC(filename, 1)

  int err = uv_dlopen(filename, &lib->lib);

  free(filename);

  if (err < 0) napi_throw_error(env, NULL, uv_dlerror(&lib->lib));

  return NULL;
}

NAPI_METHOD(uv_napi_dlclose) {
  NAPI_ARGV(1)
  NAPI_ARGV_BUFFER_CAST(uv_napi_lib_t *, lib, 0)

  uv_dlclose(&lib->lib);

  return NULL;
}

NAPI_METHOD(uv_napi_dlsym) {
  NAPI_ARGV(3)
  NAPI_ARGV_BUFFER_CAST(uv_napi_lib_t *, lib, 0)
  NAPI_ARGV_UTF8_MALLOC(name, 1)
  NAPI_ARGV_BUFFER_CAST(uv_napi_sym_t *, sym, 2)

  int err = uv_dlsym(&lib->lib, name, sym);

  free(name);

  if (err < 0) napi_throw_error(env, NULL, uv_dlerror(&lib->lib));

  return NULL;
}

NAPI_METHOD(uv_napi_dlexports) {
  NAPI_ARGV(2)
  NAPI_ARGV_BUFFER_CAST(uv_napi_lib_t *, lib, 0)
  NAPI_ARGV_UTF8_MALLOC(name, 1)

  napi_addon_register_func cb;

  int err = uv_dlsym(&lib->lib, name, (void **) &cb);

  if (err < 0) napi_throw_error(env, NULL, uv_dlerror(&lib->lib));

  napi_value exports;
  napi_create_object(env, &exports);

  cb(env, exports);

  return exports;
}

NAPI_INIT() {
  NAPI_EXPORT_SIZEOF(uv_napi_lib_t)
  NAPI_EXPORT_SIZEOF(uv_napi_sym_t)

  NAPI_EXPORT_FUNCTION(uv_napi_dlopen)
  NAPI_EXPORT_FUNCTION(uv_napi_dlclose)
  NAPI_EXPORT_FUNCTION(uv_napi_dlsym)
  NAPI_EXPORT_FUNCTION(uv_napi_dlexports)
}
