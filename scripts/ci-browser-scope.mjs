import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const classifyBrowserScope = ({ event, baseRef, paths }) => {
  const full = event !== 'pull_request' || baseRef !== 'develop';
  const unitOnly = paths.length > 0 && paths.every(path => /^tests\/[^/]+\.test\.tsx?$/.test(path));
  return { full, browser: full || !unitOnly };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const event = process.env.CI_EVENT;
  const baseRef = process.env.CI_BASE_REF;
  const paths = event === 'pull_request'
    ? execFileSync('git', ['diff', '--no-renames', '--name-only', '-z', 'HEAD^1', 'HEAD'], { encoding: 'utf8' }).split('\0').filter(Boolean)
    : [];
  const scope = classifyBrowserScope({ event, baseRef, paths });
  for (const [key, value] of Object.entries(scope)) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
  console.log(JSON.stringify(scope));
}
