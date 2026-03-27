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

test('shared-types index exports analytics contract', () => {
  const content = fs.readFileSync(path.join(root, 'packages', 'shared-types', 'src', 'index.ts'), 'utf8');
  assert.match(content, /export \* from '\.\/analytics';/);
});

test('api entrypoint mounts analytics and recognition routers', () => {
  const content = fs.readFileSync(path.join(root, 'services', 'api', 'src', 'index.ts'), 'utf8');
  assert.match(content, /analyticsRouter/);
  assert.match(content, /recognitionRouter/);
});

test('games route validates config schema', () => {
  const content = fs.readFileSync(path.join(root, 'services', 'api', 'src', 'routes', 'games.ts'), 'utf8');
  assert.match(content, /isValidGameConfig/);
  assert.match(content, /Invalid game config schema/);
});

test('recognition route uses shared getRecognitionJob validation path', () => {
  const content = fs.readFileSync(path.join(root, 'services', 'api', 'src', 'routes', 'recognition.ts'), 'utf8');
  assert.match(content, /getRecognitionJob/);
});

test('web api adapter uses shared runtime contracts', () => {
  const content = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'api.js'), 'utf8');
  assert.match(content, /shared-contracts\.mjs/);
  assert.match(content, /isRecognitionResult/);
  assert.match(content, /isGameSessionConfig/);
  assert.match(content, /isAnalyticsEvent/);
});

test('release gates workflow has real smoke job', () => {
  const content = fs.readFileSync(
    path.join(root, '.github', 'workflows', 'release-gates.yml'),
    'utf8',
  );
  assert.match(content, /e2e-real-smoke/);
  assert.match(content, /run_real_smoke\.sh/);
});
