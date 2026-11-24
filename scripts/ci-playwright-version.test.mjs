import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePlaywrightVersion } from './ci-playwright-version.mjs';

const lock = version => `importers:\n\n  .:\n    devDependencies:\n      '@playwright/test':\n        specifier: ^1.65.0\n        version: ${version}\n`;

test('uses the exact shared locked Playwright version', () => {
  assert.equal(resolvePlaywrightVersion(lock('1.65.1'), lock('1.65.1')), '1.65.1');
});

test('rejects missing, ambiguous, mismatched and prerelease versions', () => {
  for (const invalid of ['', lock('1.65.0'), lock('1.65.1-beta'), lock('1.65.1') + lock('1.65.1')]) {
    assert.throws(() => resolvePlaywrightVersion(lock('1.65.1'), invalid));
  }
});
