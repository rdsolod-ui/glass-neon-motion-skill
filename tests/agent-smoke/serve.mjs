import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(root, '../..');
const built = process.argv.includes('--built');
const webRoot = built ? path.join(project, 'qa/agent-smoke/build') : root;
const assets = built ? path.join(webRoot, 'assets') : path.join(project, 'site/assets');
const files = new Map([
  ['/', [path.join(webRoot, 'index.html'), 'text/html; charset=utf-8']],
  ['/index.html', [path.join(webRoot, 'index.html'), 'text/html; charset=utf-8']],
  ['/style.css', [path.join(webRoot, 'style.css'), 'text/css; charset=utf-8']],
  ['/app.js', [path.join(webRoot, 'app.js'), 'text/javascript; charset=utf-8']],
  ...['manrope-latin.woff2', 'manrope-cyrillic.woff2'].map(name => [`/assets/${name}`, [path.join(assets, name), 'font/woff2']])
]);
const server = http.createServer(async (req, res) => {
  const item = files.get(new URL(req.url, 'http://localhost').pathname);
  if (!item) {res.writeHead(404).end('Not found'); return;}
  try {res.writeHead(200, {'Content-Type':item[1], 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'}).end(await readFile(item[0]));}
  catch {res.writeHead(500).end('Read failed');}
});
const port = built ? 4190 : 4189;
server.listen(port, '127.0.0.1', () => console.log(`LUMA agent smoke${built ? ' built' : ''}: http://127.0.0.1:${port}`));
