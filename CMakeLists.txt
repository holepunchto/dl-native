cmake_minimum_required(VERSION 4.0)

find_package(cmake-bare REQUIRED PATHS node_modules/cmake-bare)
find_package(cmake-fetch REQUIRED PATHS node_modules/cmake-fetch)
find_package(cmake-napi REQUIRED PATHS node_modules/cmake-napi)

project(dl_native C)

fetch_package("github:holepunchto/libnapish#8cbfe78")

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

target_link_libraries(
  ${dl_native_node}
  PRIVATE
    napish::static
)
