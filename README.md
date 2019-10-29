# indigo-node
Indigo NodeJS bindings
Copyright (c) 2015 to present EPAM Systems, Apache License 2.0
# Overview
This page describes the Node.js API of Indigo library and its plugins. The API allows developers to integrate Indigo into their Node.js projects.
Please note that Indigo-node is under active development, and can always post your comments and suggestions to our team.
# Build package manually
## Dependencies
* Git to init Indigo submodule
* CMake
* Python 2.7+ to run build scripts
* C++11 compiler (MSVC on Windows, GCC or Clang on Linux and macOS)
Additional Linux dependencies:
* libfontconfig and libfreetype with headers
## Build
To build and test indigo-node you need to run:
```bash
npm prune
npm install
npm run build
npm test
```