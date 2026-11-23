import { useLocale } from './locale';
import { useState, type CSSProperties } from 'react';
import primitive from '../tokens/primitive.json';
import light from '../tokens/semantic/light.json';
import dark from '../tokens/semantic/dark.json';
import { tokens, type TokenName } from '@oddmash/ui/tokens';
import { Code } from './examples';
import { npmPackageUrl, repositoryUrl } from './package-links';

type Token = { $type: string; $value: unknown };
const flatten = (value: unknown, prefix = ''): [string, Token][] => {
  if (!value || typeof value !== 'object') return [];
  if ('$value' in value) return [[prefix, value as Token]];
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
};
const primitives = Object.fromEntries(flatten(primitive));
const resolveValue = (
  value: unknown,
  aliases: Record<string, Token> = primitives,
): string => {
  if (typeof value === 'string' && value.startsWith('{'))
    return resolveValue(
      aliases[value.slice(1, -1)]?.$value ?? value.slice(1, -1),
      aliases,
    );
  if (Array.isArray(value)) return value.join(', ');
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    if ('hex' in object) return String(object.hex);
    if ('unit' in object) return `${object.value}${object.unit}`;
    if ('colorSpace' in object) return `sRGB / alpha ${object.alpha}`;
    return Object.entries(object)
      .map(([key, val]) => `${key}: ${resolveValue(val, aliases)}`)
      .join(' · ');
  }
  return String(value);
};
export const Colors = ({ theme }: { theme: 'light' | 'dark' }) => {
  const { t } = useLocale();
  const colorTokens = (theme === 'light' ? light : dark).semantic.color;
  return (
    <>
      <div className="foundation-banner">
        <div>
          <h2>{t('Monochrome palette')}</h2>
          <p>
            {t(
              'Use neutral colors for surfaces and actions. Blue marks keyboard focus, and red marks errors.',
            )}
          </p>
        </div>
      </div>
      <section className="doc-section">
        <div className="section-title">
          <h2>{t('Semantic palette')}</h2>
          <span className="section-caption">
            {theme.toUpperCase()} THEME · FROM JSON
          </span>
        </div>
        <div className="swatch-grid">
          {Object.entries(colorTokens).map(([name, token]) => (
            <div className="swatch" key={name}>
              <div
                className="swatch-paint"
                style={{ background: tokens[`color.${name}` as TokenName] }}
              />
              <div className="swatch-meta">
                <strong>{name}</strong>
                <code>{resolveValue(token.$value)}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="doc-section">
        <h2>{t('Make it your own')}</h2>
        <p className="body-copy">
          {t(
            'Override semantic variables on a scoped container. Store lasting brand choices in your project’s JSON source and generate the overrides.',
          )}
        </p>
        <Code label="project.scss">{`.my-project {\n  --om-semantic-color-focus: #2459d3;\n  --om-semantic-color-action: #171717;\n  --om-semantic-color-on-action: #ffffff;\n}`}</Code>
        <p className="body-copy">
          {t(
            'This snippet is illustrative, not a second token source. Check text and focus contrast whenever you change a color pair.',
          )}
        </p>
      </section>
    </>
  );
};
export const Typography = () => {
  const { t } = useLocale();
  return (
    <>
      <div className="type-specimen">
        <span className="section-caption">Geist Sans</span>
        <div className="specimen-letters">
          Aa<span>Bb</span>
        </div>
        <p>{t('Small tools. Better flow.')}</p>
        <div className="specimen-alphabet">
          <strong>Geist Mono</strong>
          <br />
          ABCDEFGHIJKLMNOPQRSTUVWXYZ
          <br />
          abcdefghijklmnopqrstuvwxyz
          <br />
          0123456789 !@#$%&
        </div>
      </div>
      <section className="doc-section">
        <h2>{t('A practical type scale')}</h2>
        <div className="type-scale">
          {Object.entries(primitive.primitive.font.size).map(
            ([name, token]) => (
              <div key={name}>
                <code>
                  {name} / {resolveValue(token.$value)}
                </code>
                <span style={{ fontSize: `${token.$value.value}px` }}>
                  {t('The details make the difference.')}
                </span>
              </div>
            ),
          )}
        </div>
      </section>
      <section className="doc-section">
        <h2>{t('Readable by default')}</h2>
        <p className="body-copy">
          {t(
            'Use Geist Sans for interface labels, descriptions, and headings. Use Geist Mono for code, token values, and event logs. This site serves both fonts locally. Korean text uses a Korean font available on your device.',
          )}
        </p>
        <Code>{`import { tokens } from '@oddmash/ui/tokens';\n\n<p style={{ fontSize: tokens['font.small'] }}>\n  A little context goes a long way.\n</p>`}</Code>
      </section>
    </>
  );
};
const themeEntries = {
  light: flatten(light.semantic),
  dark: flatten(dark.semantic),
};
const themeTokens = {
  light: Object.fromEntries(themeEntries.light),
  dark: Object.fromEntries(themeEntries.dark),
};
const themeAliases = {
  light: {
    ...primitives,
    ...Object.fromEntries(
      themeEntries.light.map(([name, token]) => [`semantic.${name}`, token]),
    ),
  },
  dark: {
    ...primitives,
    ...Object.fromEntries(
      themeEntries.dark.map(([name, token]) => [`semantic.${name}`, token]),
    ),
  },
};

export const TokenExplorer = () => {
  const { t } = useLocale();
  const [query, setQuery] = useState('');
  const entries = themeEntries.light.filter(([name, token]) =>
    `${name} ${token.$type}`.includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="token-pipeline">
        <div>
          <span>{t('01 / SOURCE')}</span>
          <strong>JSON</strong>
          <code>{t('primitive + semantic')}</code>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <span>{t('02 / BUILD')}</span>
          <strong>Style Dictionary</strong>
          <code>pnpm run tokens</code>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <span>{t('03 / CONSUME')}</span>
          <strong>CSS + TypeScript</strong>
          <code>{t('one shared vocabulary')}</code>
        </div>
      </div>
      <section className="doc-section">
        <div className="section-title">
          <h2>
            {t('Token explorer')}{' '}
            <span className="count">{entries.length}</span>
          </h2>
          <label className="token-search">
            <span className="sr-only">{t('Filter tokens')}</span>
            <input
              placeholder={t('Filter by name or type…')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label={t('Design tokens table')}
        >
          <table className="token-table">
            <thead>
              <tr>
                <th>{t('Token / CSS variable')}</th>
                <th>{t('Type')}</th>
                <th scope="col">{t('Light')}</th>
                <th scope="col">{t('Dark')}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([name, token]) => (
                <tr key={name}>
                  <td>
                    <strong>{name}</strong>
                    <code>{tokens[name as TokenName]?.slice(4, -1)}</code>
                  </td>
                  <td>{token.$type}</td>
                  {(['light', 'dark'] as const).map((theme) => (
                    <td key={theme}>
                      {token.$type === 'color' && (
                        <i
                          aria-hidden="true"
                          className="inline-swatch"
                          data-om-theme={theme}
                          style={{ background: tokens[name as TokenName] }}
                        />
                      )}
                      {resolveValue(
                        themeTokens[theme][name].$value,
                        themeAliases[theme],
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!entries.length && (
          <p role="status">
            {t('No matching tokens')}: “{query}”
          </p>
        )}
      </section>
      <section className="doc-section">
        <h2>{t('Space to breathe')}</h2>
        <div className="space-scale">
          {Object.entries(primitive.primitive.space)
            .filter(([, token]) => token.$value.value > 0)
            .map(([name, token]) => (
              <div key={name}>
                <span
                  style={
                    {
                      '--sample-space': `${token.$value.value}px`,
                    } as CSSProperties
                  }
                />
                <code>{name}px</code>
              </div>
            ))}
        </div>
        <h2>{t('Change once. Update everywhere.')}</h2>
        <Code label="terminal">{`pnpm run tokens        # generate CSS + typed references\npnpm run tokens:check  # reject drift and missing aliases`}</Code>
        <p className="body-copy">
          {t(
            'Edit tokens/primitive.json and tokens/semantic/light.json or dark.json. Never edit src/generated directly. DTCG $type / $value and aliases keep the source portable.',
          )}
        </p>
      </section>
    </>
  );
};
export const Installation = () => {
  const { t } = useLocale();
  return (
    <>
      <section className="doc-section">
        <h2>{t('Install from npm')}</h2>
        <p className="body-copy">
          {t('See published versions on')}{' '}
          <a className="text-link" href={npmPackageUrl}>
            npm
          </a>
          .
        </p>
        <Code label="npm install">{`npm install @oddmash/ui@0.3.0`}</Code>
      </section>
      <section className="doc-section">
        <h2>{t('Build from GitHub')}</h2>
        <p className="body-copy">
          {t('Clone the')}{' '}
          <a className="text-link" href={repositoryUrl}>
            {t('GitHub repository')}
          </a>
          {'. '}
          {t(
            'Build with Node 24 or later. React 18.3.1 and React 19 are supported peers.',
          )}
        </p>
        <Code label="GitHub source">{`git clone ${repositoryUrl}.git
cd oddmash-ui
pnpm install --frozen-lockfile
pnpm pack

# In your React project:
npm install /path/to/oddmash-ui-0.3.0.tgz`}</Code>
      </section>
      <section className="doc-section">
        <h2>{t('Make something small')}</h2>
        <Code>{`import { Button, Card, Input } from '@oddmash/ui';\nimport '@oddmash/ui/styles.css';\n\nexport const Project = () => (\n  <Card>\n    <label htmlFor="name">Project name</label>\n    <Input id="name" placeholder="Your next idea" />\n    <Button>Create project</Button>\n  </Card>\n);`}</Code>
      </section>
      <section className="doc-section">
        <h2>{t('Choose a theme')}</h2>
        <Code label="index.html">{`<html data-om-theme="dark">\n  <!-- Your application -->\n</html>`}</Code>
        <p className="body-copy">
          {t(
            'Set light or dark on the document or a subtree. Your application owns persistence. Dialog portals inherit the document theme; for a local override, provide a themed container or the theme prop.',
          )}
        </p>
        <a className="text-link" href="#/colors">
          {t('Explore the palette ↗')}
        </a>
      </section>
    </>
  );
};
