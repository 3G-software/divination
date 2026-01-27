const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`)

  // 默认请求 index.html
  let filePath = req.url === '/' ? '/index.html' : req.url

  // 安全检查，防止目录遍历
  filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '')
  filePath = path.join(__dirname, filePath)

  const extname = String(path.extname(filePath)).toLowerCase()
  const contentType = mimeTypes[extname] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>404 Not Found</h1>', 'utf-8')
      } else {
        res.writeHead(500)
        res.end(`Server Error: ${error.code}`)
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      })
      res.end(content, 'utf-8')
    }
  })
})

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║         易经八卦算命 - 开发服务器已启动           ║
╠═══════════════════════════════════════════════════╣
║  本地访问: http://localhost:${PORT}                  ║
║  按 Ctrl+C 停止服务器                             ║
╚═══════════════════════════════════════════════════╝
  `)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请尝试：`)
    console.error(`  PORT=3001 npm start`)
    console.error(`  或关闭占用端口的程序`)
  } else {
    console.error('服务器错误:', err)
  }
  process.exit(1)
})
