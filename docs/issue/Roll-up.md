```bash
Run npm run build

> alphatab-vue@0.0.0 build
> vue-tsc -b && vite build

/home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js:64
		throw new Error(
		      ^

Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
    at requireWithFriendlyError (/home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js:64:9)
    at Object.<anonymous> (/home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js:73:76)
    ... 3 lines matching cause stack trace ...
    at Module._load (node:internal/modules/cjs/loader:1019:12)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/translators:203:29)
    at ModuleJob.run (node:internal/modules/esm/module_job:195:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:337:24) {
  [cause]: Error: Cannot find module '@rollup/rollup-linux-x64-gnu'
  Require stack:
  - /home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js
      at Module._resolveFilename (node:internal/modules/cjs/loader:1140:15)
      at Module._load (node:internal/modules/cjs/loader:981:27)
      at Module.require (node:internal/modules/cjs/loader:1231:19)
      at require (node:internal/modules/helpers:177:18)
      at requireWithFriendlyError (/home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js:46:10)
      at Object.<anonymous> (/home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js:73:76)
      at Module._compile (node:internal/modules/cjs/loader:1364:14)
      at Module._extensions..js (node:internal/modules/cjs/loader:1422:10)
      at Module.load (node:internal/modules/cjs/loader:1203:32)
      at Module._load (node:internal/modules/cjs/loader:1019:12) {
    code: 'MODULE_NOT_FOUND',
    requireStack: [
      '/home/runner/work/alphatab-vue/alphatab-vue/node_modules/rollup/dist/native.js'
    ]
  }
}

Node.js v18.20.8
Error: Process completed with exit code 1.
```