import { dispatch, use } from '@remux/lib'
// @remux server
import { createServer } from 'http'

export function clientSetup(options={}) {
  const url = options.url || '/__remux'
  use(async (role, module, func, params) => {
    console.debug(role, module, func, params)
    const text = await (await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role, module, func, params
        })
      })).text()
    if (text) {
      return JSON.parse(text)
    }
  })
}

export function serverSetup(options={}) {
  const clientMaxBody = options.clientMaxBody || 1048576
  const port = options.port || 9982
  createServer((req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    console.debug(`${ip}\t${req.method}\t${req.url}`)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Max-Age', '86400')
      res.statusCode = 204
      res.end()
      return
    }
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end()
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      res.statusCode = 400
      res.end()
      return
    }
    let body = ''
    req.on('data', chunk => {
      if (body.length + chunk.length > clientMaxBody) {
        res.statusCode = 413
        res.end()
        return
      }
      body += chunk
    })
    req.on('end', async () => {
      try {
        const obj = JSON.parse(body)
        const { role, module, func, params } = obj
        res.statusCode = 200
        res.end(JSON.stringify(await dispatch(role, module, func, params)))
      } catch (e) {
        console.error(e)
        res.statusCode = 400
        res.end(e.toString())
      }
    })
  }).listen(port)
}
