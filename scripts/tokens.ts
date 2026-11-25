import StyleDictionary from 'style-dictionary';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkTokenSources } from './token-source-check';

const check = process.argv.includes('--check');
const output = resolve('src/generated');
const themes = ['light', 'dark'] as const;
const products: Record<string, string> = {};
let lightKeys: string[] = [];
let refs: Record<string, string> = {};
for (const theme of themes) {
  const dictionary = new StyleDictionary({
    usesDtcg: true,
    source: ['tokens/primitive.json', `tokens/semantic/${theme}.json`],
    log: { errors: { brokenReferences: 'throw' } },
    platforms: { css: { transformGroup: 'css', prefix: 'om', files: [{ destination: 'tokens.css', format: 'css/variables', options: { showFileHeader: false, outputReferences: true, selector: theme === 'light' ? ':root, :host, [data-om-theme="light"]' : '[data-om-theme="dark"]' } }] } },
  });
  const platform = await dictionary.getPlatformTokens('css');
  const tokens = platform.allTokens.filter((token) => token.path[0] === 'semantic');
  const keys = tokens.map((token) => token.path.slice(1).join('.')).sort();
  if (theme === 'light') {
    lightKeys = keys;
    refs = Object.fromEntries(tokens.map((token) => [token.path.slice(1).join('.'), `var(--${token.name})`]));
  } else if (JSON.stringify(keys) !== JSON.stringify(lightKeys)) {
    throw new Error('Light and dark semantic keys must match');
  }
  const files = await dictionary.formatPlatform('css');
  products[theme] = String(files[0].output);
}
const primitive = JSON.parse(await readFile('tokens/primitive.json', 'utf8')).primitive;
const compact = primitive.breakpoint.compact.$value;
if (!Number.isFinite(compact.value) || compact.value <= 0 || compact.unit !== 'rem') throw new Error('Invalid compact breakpoint');
const files = {
  'breakpoints.scss': `// Generated from tokens JSON. Run pnpm run tokens.\n$compact: ${compact.value}${compact.unit};\n`,
  'tokens.css': `/* Generated from tokens JSON. Run pnpm run tokens. */
${products.light.trim()}
${products.dark.trim()}
`,
  'tokens.ts': `export const tokens = ${JSON.stringify(refs, null, 2)} as const;
export type TokenName = keyof typeof tokens;
`,
};
await mkdir(output, { recursive: true });
for (const [file, contents] of Object.entries(files)) {
  if (check) {
    const existing = await readFile(resolve(output, file), 'utf8').catch(() => '');
    if (existing !== contents) throw new Error(`${file} is stale. Run pnpm run tokens.`);
  } else await writeFile(resolve(output, file), contents);
}

if (check) await checkTokenSources('src');
