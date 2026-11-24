import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { classifyBrowserScope, readPullRequestPaths } from './ci-browser-scope.mjs';

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

test('explicit base retains earlier runtime changes across multiple commits', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'oddmash-ci-scope-'));
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  try {
    git('init', '-q');
    git('config', 'user.name', 'CI Fixture');
    git('config', 'user.email', 'ci@example.invalid');
    git('commit', '--allow-empty', '-qm', 'base');
    const base = git('rev-parse', 'HEAD');
    mkdirSync(join(cwd, 'src'));
    writeFileSync(join(cwd, 'src', 'toast.tsx'), 'runtime');
    git('add', '.');
    git('commit', '-qm', 'runtime');
    mkdirSync(join(cwd, 'tests'));
    writeFileSync(join(cwd, 'tests', 'toast.test.tsx'), 'test');
    git('add', '.');
    git('commit', '-qm', 'tests');
    const paths = readPullRequestPaths(base, cwd);
    assert.deepEqual(paths.sort(), ['src/toast.tsx', 'tests/toast.test.tsx']);
    assert.equal(classify(paths).browser, true);
    assert.throws(() => readPullRequestPaths('', cwd));
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
