import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyBrowserScope } from './ci-browser-scope.mjs';

const classify = (paths, event = 'pull_request', baseRef = 'develop') => classifyBrowserScope({ event, baseRef, paths });

test('only isolated root-level unit tests skip browser checks', () => {
  assert.deepEqual(classify(['tests/new-components.test.tsx', 'tests/tokens.test.ts']), { full: false, browser: false });
});

test('runtime, browser configuration, shared test setup and unknown files retain browsers', () => {
  for (const path of ['src/toast.tsx', 'demo/index.html', 'tests/setup.ts', 'tests/browser/ui.spec.ts', 'tests/browser/visual.spec.ts-snapshots/a.png', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'tests/compatibility/react18/pnpm-lock.yaml', 'playwright.config.ts', '.github/workflows/ci.yml', 'unknown.test.ts']) {
    assert.deepEqual(classify(['tests/new-components.test.tsx', path]), { full: false, browser: true });
  }
  assert.equal(classify([]).browser, true);
});

test('release PRs, pushes and manual runs always use full coverage', () => {
  for (const [event, ref] of [['pull_request', 'main'], ['push', ''], ['workflow_dispatch', '']]) {
    assert.deepEqual(classify(['tests/new-components.test.tsx'], event, ref), { full: true, browser: true });
  }
});
