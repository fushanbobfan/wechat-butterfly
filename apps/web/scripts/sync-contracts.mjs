import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.resolve(__dirname, '../../../packages/shared-types/src/runtime-contracts.mjs');
const target = path.resolve(__dirname, '../src/shared-contracts.mjs');

fs.copyFileSync(source, target);
console.log(`synced contracts: ${source} -> ${target}`);
