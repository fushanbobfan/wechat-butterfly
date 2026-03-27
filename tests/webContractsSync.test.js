const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('web shared-contracts is synced from shared-types canonical file', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'packages', 'shared-types', 'src', 'runtime-contracts.mjs'),
    'utf8',
  );
  const target = fs.readFileSync(
    path.join(__dirname, '..', 'apps', 'web', 'src', 'shared-contracts.mjs'),
    'utf8',
  );

  assert.equal(target, source);
});
