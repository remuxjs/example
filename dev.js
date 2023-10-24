import { createServer as createViteServer } from "vite"
import { fileURLToPath } from 'url'
import remux from '@remux/rollup-plugin'
import { watch } from 'rollup'
import run from '@rollup/plugin-run'
import { access, mkdir } from 'fs/promises'

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
  plugins: [remux(['server']), run()],
})

watcher.on('event', event => {
  console.debug(event.code)
  if (event.code === "ERROR") {
    console.debug(event)
  }
})

const frontend = await createViteServer({
  root: __dirname + '/src',
  plugins: [
    remux(['browser'])
  ],
  server: {
    proxy: {
      '/__remux': 'http://localhost:9982'
    }
  }
})

await frontend.listen()
frontend.printUrls()
