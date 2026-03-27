import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 3000);
const baseDir = path.join(__dirname, 'src');

function resolveApiBaseUrl() {
  const raw = (process.env.API_BASE_URL || '').trim();
  if (!raw) {
    return '';
  }

  try {
    const parsed = new URL(raw);
    return parsed.origin;
  } catch {
    console.warn(`[web-demo] invalid API_BASE_URL ignored: ${raw}`);
    return '';
  }
}

const apiBaseUrl = resolveApiBaseUrl();
const demoMode = apiBaseUrl ? 'live-backend' : 'fixture-fallback';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const url = req.url || '/';

  if (url === '/healthz') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true, service: 'web-demo', demo_mode: demoMode }));
    return;
  }

  if (url === '/config.js') {
    const body = `window.__BUTTERFLY_CONFIG__ = { apiBaseUrl: ${JSON.stringify(apiBaseUrl)}, demoMode: ${JSON.stringify(demoMode)} };`;
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
  console.log(`web demo server listening on ${port} (mode=${demoMode})`);
});
