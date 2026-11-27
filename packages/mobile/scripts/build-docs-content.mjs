import { cp, mkdir, writeFile } from 'node:fs/promises';
import { guidePages, renderGuide } from './render-guide.mjs';

const source = new URL('../docs/', import.meta.url);
const site = new URL('../docs-dist/', import.meta.url);
const siteDocs = new URL('docs/', site);
const publicDocs = new URL('https://oddmash.github.io/oddmash-mobile/docs/');
const entries = [
  ['Alpha usage and limitations', 'alpha.md'],
  ['Alpha verification', 'alpha-verification.md'],
  ['Browser verification', 'browser-verification.md'],
  ['Device verification', 'device-verification.md'],
  ['Architecture', 'architecture.md'],
  ['Quality and release', 'quality-and-release.md'],
  ['Native interaction parity', 'native-interaction-parity.md'],
  ['Action Sheet usage', 'components/action-sheet.md'],
  ['Bottom Navigation usage', 'components/bottom-navigation.md'],
  ['Guide', 'guide.md'],
  ['Quickstart', 'quickstart.md'],
  ['Composition recipes', 'composition.md'],
  ['Bottom Sheet usage', 'components/bottom-sheet.md'],
  ['Adaptive Dialog usage', 'components/adaptive-dialog.md'],
  ['Swipe Action usage', 'components/swipe-action.md'],
  ['Pull to Refresh usage', 'components/pull-to-refresh.md'],
];

await cp(source, siteDocs, { recursive: true });
await Promise.all(guidePages.map(async ([slug]) => {
  const output = new URL(`guide/${slug ? `${slug}/` : ''}`, site);
  await mkdir(output, { recursive: true });
  await writeFile(new URL('index.html', output), await renderGuide(slug));
}));

const index = [
  '# Oddmash Mobile',
  '',
  '> Experimental React components for Bottom Sheet, Adaptive Dialog, Swipe Action, Pull to Refresh, Action Sheet and Bottom Navigation.',
  '',
  'Package: `@oddmash/mobile-interactions`',
  '',
  ...entries.map(([title, path]) => `- [${title}](${new URL(path, publicDocs)})`),
  '',
].join('\n');

await writeFile(new URL('llms.txt', site), index);
