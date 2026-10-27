cmake_minimum_required(VERSION 4.0)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-napi REQUIRED PATHS node_modules/cmake-napi)

project(dl_native C)

add_bare_module(dl_native_bare)

target_sources(
  ${dl_native_bare}
  PRIVATE
    binding.c
)

add_napi_module(dl_native_node)

target_sources(
  ${dl_native_node}
  PRIVATE
    binding.c
)

target_compile_definitions(
  ${dl_native_node}
  PRIVATE
    NAPI_VERSION=9
)

resolve_node_module(bare-compat-napi compat)

target_include_directories(
  ${dl_native_node}
  PRIVATE
    "${compat}/include"
)
