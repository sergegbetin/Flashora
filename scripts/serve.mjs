// Minimal zero-dependency static file server for previewing FLASHORA locally.
//   node scripts/serve.mjs [dir] [port]
// Defaults: serves the project root (or ./dist if that is the only arg given) on port 8080.
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join, normalize, resolve, sep } from 'node:path'

const args = process.argv.slice(2)
const root = resolve(args[0] || process.cwd())
const port = Number(args[1] || 8080)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
}

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    let file = normalize(join(root, url))
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end('Forbidden')
      return
    }
    let info = await stat(file).catch(() => null)
    if (info?.isDirectory()) {
      file = join(file, 'index.html')
      info = await stat(file).catch(() => null)
    }
    if (!info) {
      // SPA fallback: unknown routes render the app shell (hash routing also works).
      file = join(root, 'index.html')
      info = await stat(file).catch(() => null)
      if (!info) {
        res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found')
        return
      }
    }
    res.writeHead(200, {
      'content-type': types[extname(file).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-cache',
      // Security headers for the local preview server (see SECURITE.md).
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'SAMEORIGIN',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'cross-origin-opener-policy': 'same-origin',
      'content-security-policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data:; font-src 'self' data:; connect-src 'self'; media-src 'self'; " +
        "object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'self'",
    })
    createReadStream(file).pipe(res)
  } catch (err) {
    res.writeHead(500, { 'content-type': 'text/plain' }).end(String(err))
  }
}).listen(port, () => {
  console.log(`FLASHORA static server → http://localhost:${port}  (root: ${root})`)
})
