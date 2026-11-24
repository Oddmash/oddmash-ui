import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const resolvePlaywrightVersion = (...locks) => {
  if (locks.length !== 2) throw Error('Expected both React lockfiles');
  const versions = locks.map(lock => {
    const matches = [...lock.matchAll(/^      '@playwright\/test':\r?\n        specifier: [^\r\n]+\r?\n        version: (\d+\.\d+\.\d+)\r?$/gm)];
    if (matches.length !== 1) throw Error('Expected exactly one stable Playwright importer version');
    return matches[0][1];
  });
  if (versions[0] !== versions[1]) throw Error('React lockfiles must use the same Playwright version');
  return versions[0];
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const locks = ['pnpm-lock.yaml', 'tests/compatibility/react18/pnpm-lock.yaml'].map(path => readFileSync(path, 'utf8'));
  const version = resolvePlaywrightVersion(...locks);
  appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
}
