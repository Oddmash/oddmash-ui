import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { checkTokenSources, findRawDesignValues } from '../scripts/token-source-check';

it('rejects fixed dimensions and durations but keeps structural geometry and comments', () => {
  expect(findRawDesignValues('.x { width: 13px; animation-duration: 41ms; }')).toEqual(['13px', '41ms']);
  expect(findRawDesignValues('.x { animation-duration: 1s; transition-delay: .2s; }')).toEqual(['1s', '.2s']);
  expect(findRawDesignValues('.x { animation-duration: var(--om-semantic-motion-duration); transition-delay: 0; content: "1s"; }')).toEqual([]);
  expect(findRawDesignValues('.x { width: 100%; padding: 0; gap: var(--om-semantic-space-sm); } /* 1px */')).toEqual([]);
  expect(findRawDesignValues('.x { content: "160ms"; width: 100%; }')).toEqual([]);
  expect(findRawDesignValues('.x { content: "160ms"; width: var(--size, 13px); }')).toEqual(['13px']);
});

it('checks nested SCSS and excludes only generated output', async () => {
  const root = await mkdtemp(join(tmpdir(), 'om-token-check-'));
  try {
    await mkdir(join(root, 'nested'));
    await mkdir(join(root, 'generated'));
    await writeFile(join(root, 'generated', 'breakpoints.scss'), '$compact: 48rem;');
    await writeFile(join(root, 'nested', 'valid.scss'), '.valid { width: 100%; margin: 0; }');
    await expect(checkTokenSources(root)).resolves.toBeUndefined();
    await writeFile(join(root, 'nested', 'invalid.scss'), '.invalid { width: 13px; }');
    await expect(checkTokenSources(root)).rejects.toThrow('nested/invalid.scss: raw design values 13px');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
