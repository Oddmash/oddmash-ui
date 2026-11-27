import { readFile } from 'node:fs/promises';
import { posix } from 'node:path';
import MarkdownIt from 'markdown-it';

const source = new URL('../docs/', import.meta.url);
const brand = new URL('../demo/design-tokens.json', import.meta.url);
const groups = [
  ['Start here', [
    ['', 'Overview', 'guide.md'],
    ['quickstart', 'Quickstart', 'quickstart.md'],
    ['composition', 'Composition recipes', 'composition.md'],
  ]],
  ['Components', [
    ['bottom-sheet', 'Bottom Sheet', 'components/bottom-sheet.md'],
    ['adaptive-dialog', 'Adaptive Dialog', 'components/adaptive-dialog.md'],
    ['swipe-action', 'Swipe Action', 'components/swipe-action.md'],
    ['pull-to-refresh', 'Pull to Refresh', 'components/pull-to-refresh.md'],
    ['action-sheet', 'Action Sheet', 'components/action-sheet.md'],
    ['bottom-navigation', 'Bottom Navigation', 'components/bottom-navigation.md'],
  ]],
  ['Evidence', [
    ['support', 'Support and limitations', 'alpha.md'],
    ['verification', 'Verification', 'alpha-verification.md'],
    ['device-tests', 'Device verification', 'device-verification.md'],
    ['browser-tests', 'Browser test instructions', 'browser-verification.md'],
    ['native-parity', 'Native behavior', 'native-interaction-parity.md'],
  ]],
];

export const guidePages = groups.flatMap(([, pages]) => pages);
const paths = new Map(guidePages.map(([slug, , path]) => [path, slug]));
const guideHref = (prefix, slug) => `${prefix}guide/${slug ? `${slug}/` : ''}`;
const md = new MarkdownIt({ html: false });
const escape = md.utils.escapeHtml;

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const href = token.attrGet('href');
  const local = href?.match(/^([^:#?]+\.md)(#[^?]*)?$/);
  if (local && !local[1].startsWith('/')) {
    const path = posix.normalize(posix.join(posix.dirname(env.path), local[1]));
    const slug = paths.get(path);
    const fallback = path.startsWith('../')
      ? `https://github.com/Oddmash/oddmash-mobile/blob/main/${path.slice(3)}`
      : `${env.prefix}docs/${path}`;
    token.attrSet('href', `${slug === undefined ? fallback : guideHref(env.prefix, slug)}${local[2] ?? ''}`);
  }
  return self.renderToken(tokens, index, options);
};
md.renderer.rules.heading_open = (tokens, index, options, env, self) => {
  const token = tokens[index];
  const title = tokens[index + 1].content;
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
  const count = (env.headings.get(base) ?? 0) + 1;
  env.headings.set(base, count);
  token.attrSet('id', count === 1 ? base : `${base}-${count}`);
  return self.renderToken(tokens, index, options);
};
const fence = md.renderer.rules.fence;
md.renderer.rules.fence = (...args) =>
  `<div class="code-frame"><div class="scroll-code" tabindex="0" role="region" aria-label="Code example">${fence(...args)}</div></div>\n`;
md.renderer.rules.table_open = () => '<div class="scroll-table" tabindex="0" role="region" aria-label="Reference table"><table>\n';
md.renderer.rules.table_close = () => '</table></div>\n';

export const renderGuide = async (slug) => {
  const page = guidePages.find(([key]) => key === slug);
  if (!page) return null;
  const [, title, path] = page;
  const prefix = slug ? '../../' : '../';
  const [markdown, tokensText] = await Promise.all([
    readFile(new URL(path, source), 'utf8'), readFile(brand, 'utf8'),
  ]);
  const content = md.render(markdown, { path, prefix, headings: new Map() });
  const tokens = JSON.parse(tokensText);
  const theme = ['canvas', 'paper', 'ink', 'muted', 'line', 'accent', 'focus', 'focus-width', 'focus-offset', 'code']
    .map((name) => `--guide-${name}:${tokens[name]}`).join(';');
  const links = groups.map(([label, items]) => `<div><h2>${label}</h2><ul>${items.map(([key, name]) =>
    `<li><a href="${guideHref(prefix, key)}"${key === slug ? ' aria-current="page"' : ''}>${name}</a></li>`,
  ).join('')}</ul></div>`).join('');
  return `<!doctype html>
<html lang="en" style="${escape(theme)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escape(title)} for the Oddmash Mobile React library.">
  <title>${escape(title)} · Oddmash Mobile</title>
  <link rel="stylesheet" href="${prefix}guide.css">
  <script src="${prefix}guide.js" defer></script>
</head>
<body>
  <a class="skip" href="#article">Skip to content</a>
  <header><div class="shell top"><a class="wordmark" href="${prefix}">Oddmash <strong>Mobile</strong></a>
    <nav aria-label="Site navigation"><a href="${guideHref(prefix, '')}">Documentation</a><a href="${prefix}#components">Live demos</a></nav>
  </div></header>
  <div class="shell layout">
    <main id="article" tabindex="-1">${content}
      <footer><a href="${prefix}docs/${path}">View Markdown source</a></footer>
    </main>
    <nav class="guide-nav" aria-label="Documentation pages">${links}</nav>
  </div>
</body>
</html>`;
};
