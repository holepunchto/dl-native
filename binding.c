#include <assert.h>
#include <bare.h>
#include <js.h>
#include <stdlib.h>
#include <utf.h>
#include <uv.h>

typedef struct {
  uv_lib_t lib;
} dl_native_lib_t;

typedef js_value_t *(*dl_native_exports_cb)(js_env_t *env, js_value_t *exports);

static utf8_t *
dl_native_get_string(js_env_t *env, js_value_t *value) {
  int err;

  size_t len;
  err = js_get_value_string_utf8(env, value, NULL, 0, &len);
  assert(err == 0);

  len += 1 /* NULL */;

  utf8_t *str = malloc(len);
  err = js_get_value_string_utf8(env, value, str, len, NULL);
  assert(err == 0);

  return str;
}

static js_value_t *
dl_native_open(js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 1;
  js_value_t *argv[1];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 1);

  js_value_t *handle;

  dl_native_lib_t *lib;
  err = js_create_arraybuffer(env, sizeof(dl_native_lib_t), (void **) &lib, &handle);
  assert(err == 0);

  utf8_t *filename = dl_native_get_string(env, argv[0]);

  err = uv_dlopen((char *) filename, &lib->lib);

  free(filename);

  if (err < 0) {
    err = js_throw_error(env, NULL, uv_dlerror(&lib->lib));
    assert(err == 0);

    uv_dlclose(&lib->lib);

    return NULL;
  }

  return handle;
}

static js_value_t *
dl_native_close(js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 1;
  js_value_t *argv[1];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 1);

  dl_native_lib_t *lib;
  err = js_get_arraybuffer_info(env, argv[0], (void **) &lib, NULL);
  assert(err == 0);

  uv_dlclose(&lib->lib);

  return NULL;
}

static js_value_t *
dl_native_sym(js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 2;
  js_value_t *argv[2];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 2);

  dl_native_lib_t *lib;
  err = js_get_arraybuffer_info(env, argv[0], (void **) &lib, NULL);
  assert(err == 0);

  js_value_t *handle;

  void **sym;
  err = js_create_arraybuffer(env, sizeof(void *), (void **) &sym, &handle);
  assert(err == 0);

  utf8_t *name = dl_native_get_string(env, argv[1]);

  err = uv_dlsym(&lib->lib, (char *) name, sym);

  free(name);

  if (err < 0) {
    err = js_throw_error(env, NULL, uv_dlerror(&lib->lib));
    assert(err == 0);

    return NULL;
  }

  return handle;
}

static js_value_t *
dl_native_exports(js_env_t *env, js_callback_info_t *info) {
  int err;

  size_t argc = 2;
  js_value_t *argv[2];

  err = js_get_callback_info(env, info, &argc, argv, NULL, NULL);
  assert(err == 0);

  assert(argc == 2);

  dl_native_lib_t *lib;
  err = js_get_arraybuffer_info(env, argv[0], (void **) &lib, NULL);
  assert(err == 0);

  utf8_t *name = dl_native_get_string(env, argv[1]);

  dl_native_exports_cb cb;
  err = uv_dlsym(&lib->lib, (char *) name, (void **) &cb);

  free(name);

  if (err < 0) {
    err = js_throw_error(env, NULL, uv_dlerror(&lib->lib));
    assert(err == 0);

    return NULL;
  }

  js_value_t *exports;
  err = js_create_object(env, &exports);
  assert(err == 0);

  return cb(env, exports);
}

static js_value_t *
dl_native_exports_init(js_env_t *env, js_value_t *exports) {
  int err;

#define V(name, fn) \
  { \
    js_value_t *val; \
    err = js_create_function(env, name, -1, fn, NULL, &val); \
    assert(err == 0); \
    err = js_set_named_property(env, exports, name, val); \
    assert(err == 0); \
  }

  V("open", dl_native_open)
  V("close", dl_native_close)
  V("sym", dl_native_sym)
  V("exports", dl_native_exports)
#undef V

  return exports;
}

BARE_MODULE(dl_native, dl_native_exports_init)
