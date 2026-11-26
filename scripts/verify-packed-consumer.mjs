import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const archive = process.argv[2];
if (!archive || !isAbsolute(archive) || !archive.endsWith('.tgz')) throw new Error('Pass an absolute package archive path.');
const react19 = JSON.parse(readFileSync(new URL('../node_modules/react/package.json', import.meta.url), 'utf8')).version;
const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(command + ' failed: ' + result.status);
};

const smoke = `
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button, Tooltip } from '@oddmash/ui';
import { Button as SubpathButton } from '@oddmash/ui/button';
import { Tooltip as SubpathTooltip } from '@oddmash/ui/tooltip';
import { mountTooltip } from '@oddmash/ui/tooltip-controller';

assert.equal(typeof Button, 'object');
assert.equal(typeof Tooltip, 'function');
assert.ok(SubpathButton);
assert.ok(SubpathTooltip);
assert.equal(typeof mountTooltip, 'function');
assert.match(renderToStaticMarkup(createElement(Button, null, 'Example')), /Example/);
assert.match(renderToStaticMarkup(createElement(Tooltip, { content: 'Description' }, createElement('button', null, 'Reference'))), /Description/);
const css = readFileSync(new URL(import.meta.resolve('@oddmash/ui/styles.css')), 'utf8');
assert.match(css, /om-button/);
assert.match(css, /om-tooltip/);
`;

for (const react of ['18.3.1', react19]) {
  const directory = mkdtempSync(join(tmpdir(), 'oddmash-ui-consumer-'));
  try {
    writeFileSync(join(directory, 'package.json'), JSON.stringify({ name: 'oddmash-ui-consumer', private: true, type: 'module' }));
    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=false', archive, 'react@' + react, 'react-dom@' + react], directory);
    writeFileSync(join(directory, 'smoke.mjs'), smoke);
    run(process.execPath, ['smoke.mjs'], directory);
    console.log('Verified packed consumer with React ' + react);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}
