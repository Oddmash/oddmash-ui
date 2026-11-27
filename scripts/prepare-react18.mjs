import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const destination = resolve(process.argv[2] ?? '.');
if (destination === resolve(import.meta.dirname, '..')) {
  throw new Error('Use a separate compatibility checkout.');
}

const manifestPath = resolve(destination, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.name !== '@oddmash/ui' || !manifest.devDependencies) {
  throw new Error('Expected an Oddmash UI compatibility checkout.');
}

Object.assign(manifest.devDependencies, {
  react: '18.3.1',
  'react-dom': '18.3.1',
  '@types/react': '18.3.31',
  '@types/react-dom': '18.3.7',
});

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
