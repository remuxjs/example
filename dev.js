import { createServer as createViteServer } from "vite"
import { fileURLToPath } from 'url'
import remux from '@remux/rollup-plugin'
import { watch } from 'rollup'
import run from '@rollup/plugin-run'
import { access, mkdir } from 'fs/promises'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const tmpDir = __dirname + '/.tmp/'
await access(tmpDir).catch(() => {
  return mkdir(tmpDir)
})

const watcher = watch({
  input: __dirname + '/src/main.js',
  output: [{
    dir: __dirname + '/.tmp/'
  }],
  plugins: [nodeResolve(), remux('server'), run()],
})

watcher.on('event', event => {
  if (event.code === "ERROR") {
    console.debug(event)
    process.exit(-1)
  }
})

const frontend = await createViteServer({
  root: __dirname + '/src',
  optimizeDeps: {
    disabled: true
  },
  plugins: [
    remux('browser')
  ],
  server: {
    proxy: {
      '/__remux': 'http://localhost:9982'
    }
  }
})

await frontend.listen()
frontend.printUrls()
