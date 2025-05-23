2025-05-23


github action 报错,初步认为是没有本地构建解决报错导致的

```bash
$ vitepress build docs

  vitepress v1.6.3

x Build failed in 1.08s
✖ building client + server bundles...
build error:
[vite:vue] [plugin vite:vue] docs/working-set/unexpected-white-border.md (24:64): Element is missing end tag.
file: F:/Code/alphatab-vue/docs/working-set/unexpected-white-border.md:24:64
[vite:vue] [plugin vite:vue] docs/working-set/unexpected-white-border.md (24:64): Element is missing end tag.
file: F:/Code/alphatab-vue/docs/working-set/unexpected-white-border.md:24:64
SyntaxError: [plugin vite:vue] docs/working-set/unexpected-white-border.md (24:64): Element is missing end tag.
    at createCompilerError (F:\Code\alphatab-vue\node_modules\@vue\compiler-core\dist\compiler-core.cjs.prod.js:1360:17)
    at emitError (F:\Code\alphatab-vue\node_modules\@vue\compiler-core\dist\compiler-core.cjs.prod.js:2915:5)
    at Object.onend (F:\Code\alphatab-vue\node_modules\@vue\compiler-core\dist\compiler-core.cjs.prod.js:2539:7)
    at Tokenizer.finish (F:\Code\alphatab-vue\node_modules\@vue\compiler-core\dist\compiler-core.cjs.prod.js:1232:14)
    at Tokenizer.parse (F:\Code\alphatab-vue\node_modules\@vue\compiler-core\dist\compiler-core.cjs.prod.js:1210:10)
    at Object.baseParse (F:\Code\alphatab-vue\node_modules\@vue\compiler-core\dist\compiler-core.cjs.prod.js:2947:13)
    at Object.parse (F:\Code\alphatab-vue\node_modules\@vue\compiler-dom\dist\compiler-dom.cjs.prod.js:662:23)
    at Object.parse$1 [as parse] (F:\Code\alphatab-vue\node_modules\@vue\compiler-sfc\dist\compiler-sfc.cjs.js:1794:24)
    at createDescriptor (file:///F:/Code/alphatab-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs:71:43)
    at transformMain (file:///F:/Code/alphatab-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs:2421:34)
error: script "docs:build" exited with code 1

```