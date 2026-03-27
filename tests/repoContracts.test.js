const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('shared-types index exports analytics contract', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'packages', 'shared-types', 'src', 'index.ts'), 'utf8');
  assert.match(content, /export \* from '\.\/analytics';/);
});

test('api entrypoint mounts analytics and recognition routers', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'services', 'api', 'src', 'index.ts'), 'utf8');
  assert.match(content, /analyticsRouter/);
  assert.match(content, /recognitionRouter/);
});

test('release gates workflow has real smoke job', () => {
  const content = fs.readFileSync(
    path.join(__dirname, '..', '.github', 'workflows', 'release-gates.yml'),
    'utf8',
  );
  assert.match(content, /e2e-real-smoke/);
  assert.match(content, /run_real_smoke\.sh/);
});
