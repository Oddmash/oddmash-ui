import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { it, expect } from 'vitest';

it('rejects stale output, broken aliases and theme drift; regenerates after JSON edits', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'oddmash-tokens-'));
  const run = (...args: string[]) => spawnSync(process.execPath, ['--import', import.meta.resolve('tsx'), resolve('scripts/tokens.ts'), ...args], { cwd, encoding: 'utf8' });
  try {
    cpSync('tokens', join(cwd, 'tokens'), { recursive: true });
    cpSync('src/generated', join(cwd, 'src/generated'), { recursive: true });
    expect(run('--check').status).toBe(0);
    const primitive = join(cwd, 'tokens/primitive.json');
    const updated = JSON.parse(readFileSync(primitive, 'utf8'));
    updated.primitive.radius.sm.$value.value += 1;
    writeFileSync(primitive, JSON.stringify(updated));
    expect(run('--check').status).not.toBe(0);
    expect(run().status).toBe(0);
    expect(run('--check').status).toBe(0);
    const darkFile = join(cwd, 'tokens/semantic/dark.json');
    const dark = readFileSync(darkFile, 'utf8');
    writeFileSync(darkFile, dark.replace('{primitive.color.night}', '{primitive.color.missing}'));
    expect(run().status).not.toBe(0);
    writeFileSync(darkFile, dark.replace('"bg":', '"background":'));
    expect(run().status).not.toBe(0);
  } finally { rmSync(cwd, { recursive: true, force: true }); }
}, 20_000);
