const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('canonical inference path is services/ml_inference only', () => {
  const canonicalDir = path.join(root, 'services', 'ml_inference');
  const deprecatedDir = path.join(root, 'services', 'ml-inference');
  assert.equal(fs.existsSync(canonicalDir), true);
  assert.equal(fs.existsSync(deprecatedDir), false);
});

test('api entrypoint mounts health, recognition, analytics and taxa routes', () => {
  const content = fs.readFileSync(path.join(root, 'services', 'api', 'src', 'index.ts'), 'utf8');
  assert.match(content, /app\.get\('\/healthz'/);
  assert.match(content, /analyticsRouter/);
  assert.match(content, /recognitionRouter/);
  assert.match(content, /taxaRouter/);
});

test('taxa route provides browse + structured search endpoints', () => {
  const content = fs.readFileSync(path.join(root, 'services', 'api', 'src', 'routes', 'taxa.ts'), 'utf8');
  assert.match(content, /\/api\/v1\/taxa/);
  assert.match(content, /\/api\/v1\/search\/species/);
});

test('recognition route has explicit not-found response', () => {
  const content = fs.readFileSync(path.join(root, 'services', 'api', 'src', 'routes', 'recognition.ts'), 'utf8');
  assert.match(content, /RECOGNITION_JOB_NOT_FOUND/);
});

test('web api adapter uses shared runtime contracts and taxa integration', () => {
  const content = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'api.js'), 'utf8');
  assert.match(content, /shared-contracts\.mjs/);
  assert.match(content, /getTaxa/);
  assert.match(content, /fixtureTaxa/);
});

test('web pages render product-oriented sections instead of raw backend payload dump', () => {
  const browse = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'browse.html'), 'utf8');
  const recognition = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'recognition.html'), 'utf8');
  assert.match(browse, /学习卡片/);
  assert.match(recognition, /候选物种/);
  assert.match(recognition, /命中原因/);
});

test('workflow keeps web demo launch verify and real smoke checks', () => {
  const content = fs.readFileSync(path.join(root, '.github', 'workflows', 'release-gates.yml'), 'utf8');
  assert.match(content, /web-demo-launch/);
  assert.match(content, /demo:verify/);
  assert.match(content, /e2e-real-smoke/);
});
