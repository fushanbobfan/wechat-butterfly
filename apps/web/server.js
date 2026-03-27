import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const baseDir = path.join(__dirname, 'src');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  if (url === '/config.js') {
    const apiBaseUrl = process.env.API_BASE_URL || '';
    const body = `window.__BUTTERFLY_CONFIG__ = { apiBaseUrl: ${JSON.stringify(apiBaseUrl)} };`;
    res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8' });
    res.end(body);
    return;
  }

  let filePath = url === '/' ? '/index.html' : url;
  filePath = filePath.split('?')[0];

  const safePath = path.normalize(filePath).replace(/^\.\.(\/|\\|$)+/, '');
  const fullPath = path.join(baseDir, safePath);

  if (!fullPath.startsWith(baseDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(fullPath);
    res.writeHead(200, { 'content-type': mime[ext] || 'text/plain; charset=utf-8' });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`web demo server listening on ${port}`);
});
