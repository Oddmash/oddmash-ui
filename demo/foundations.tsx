import { useState, type CSSProperties } from 'react';
import primitive from '../tokens/primitive.json';
import light from '../tokens/semantic/light.json';
import dark from '../tokens/semantic/dark.json';
import { tokens, type TokenName } from '@oddmash/ui/tokens';
import { Code } from './examples';

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
  const colorTokens = (theme === 'light' ? light : dark).semantic.color;
  return (
    <>
      <div className="foundation-banner">
        <span className="foundation-number">01</span>
        <div>
          <h2>Color with a job to do.</h2>
          <p>
            Choose the role, not the hex. Semantic tokens keep every surface and
            state in sync with your theme.
          </p>
        </div>
        <div className="color-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <section className="doc-section">
        <div className="section-title">
          <h2>Semantic palette</h2>
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
        <h2>Make it your own</h2>
        <p className="body-copy">
          Override semantic variables on a scoped container. Store lasting brand
          choices in your project’s JSON source and generate the overrides.
        </p>
        <Code label="project.scss">{`.my-project {\n  --om-semantic-color-accent: #216c50;\n  --om-semantic-color-action: #1b231e;\n  --om-semantic-color-on-action: #ffffff;\n}`}</Code>
        <p className="body-copy">
          This snippet is illustrative, not a second token source. Check text
          and focus contrast whenever you change a color pair.
        </p>
      </section>
    </>
  );
};
export const Typography = () => (
  <>
    <div className="type-specimen">
      <span className="section-caption">SYSTEM SANS / NO FONT DOWNLOAD</span>
      <div className="specimen-letters">
        Aa<span>Bb</span>
      </div>
      <p>Good tools speak clearly.</p>
      <div className="specimen-alphabet">
        ABCDEFGHIJKLMNOPQRSTUVWXYZ
        <br />
        abcdefghijklmnopqrstuvwxyz
        <br />
        0123456789 !@#$%&
      </div>
    </div>
    <section className="doc-section">
      <h2>A practical type scale</h2>
      <div className="type-scale">
        {Object.entries(primitive.primitive.font.size).map(([name, token]) => (
          <div key={name}>
            <code>
              {name} / {resolveValue(token.$value)}
            </code>
            <span style={{ fontSize: `${token.$value.value}px` }}>
              The details make the difference.
            </span>
          </div>
        ))}
      </div>
    </section>
    <section className="doc-section">
      <h2>Readable by default</h2>
      <p className="body-copy">
        The component font stack is{' '}
        {primitive.primitive.font.family.$value.join(', ')}. It uses an
        available local font and never makes a font request. Labels use weight{' '}
        {primitive.primitive.font.weight.medium.$value}; body copy keeps a{' '}
        {primitive.primitive.font.line.$value} line height. Documentation
        headlines have a separate editorial scale.
      </p>
      <Code>{`import { tokens } from '@oddmash/ui/tokens';\n\n<p style={{ fontSize: tokens['font.small'] }}>\n  A little context goes a long way.\n</p>`}</Code>
    </section>
  </>
);
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
  const [query, setQuery] = useState('');
  const entries = themeEntries.light.filter(([name, token]) =>
    `${name} ${token.$type}`.includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="token-pipeline">
        <div>
          <span>01 / SOURCE</span>
          <strong>JSON</strong>
          <code>primitive + semantic</code>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <span>02 / BUILD</span>
          <strong>Style Dictionary</strong>
          <code>npm run tokens</code>
        </div>
        <span aria-hidden="true">→</span>
        <div>
          <span>03 / CONSUME</span>
          <strong>CSS + TypeScript</strong>
          <code>one shared vocabulary</code>
        </div>
      </div>
      <section className="doc-section">
        <div className="section-title">
          <h2>
            Token explorer <span className="count">{entries.length}</span>
          </h2>
          <label className="token-search">
            <span className="sr-only">Filter tokens</span>
            <input
              placeholder="Filter by name or type…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Design tokens table"
        >
          <table className="token-table">
            <thead>
              <tr>
                <th>Token / CSS variable</th>
                <th>Type</th>
                <th scope="col">Light</th>
                <th scope="col">Dark</th>
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
        {!entries.length && <p role="status">No tokens match “{query}”.</p>}
      </section>
      <section className="doc-section">
        <h2>Space to breathe</h2>
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
        <h2>Change once. Update everywhere.</h2>
        <Code label="terminal">{`npm run tokens        # generate CSS + typed references\nnpm run tokens:check  # reject drift and missing aliases`}</Code>
        <p className="body-copy">
          Edit tokens/primitive.json and tokens/semantic/light.json or
          dark.json. Never edit src/generated directly. DTCG $type / $value and
          aliases keep the source portable.
        </p>
      </section>
    </>
  );
};
export const Installation = () => (
  <>
    <div className="install-note">
      <span className="status-dot" />
      <p>
        <strong>v0.1 · Source distribution</strong>
        <br />
        The npm package is not published yet. Start from the repository or
        install a locally packed archive.
      </p>
    </div>
    <section className="doc-section">
      <h2>
        <span className="step">01</span> Get the foundations
      </h2>
      <Code label="terminal">{`git clone https://github.com/Oddmash/oddmash-ui.git\ncd oddmash-ui\nnpm ci\nnpm pack\n\n# In your React project:\nnpm install /path/to/oddmash-ui-0.1.0.tgz`}</Code>
      <p className="body-copy">
        Build with Node 24+. React 18.3.1 and React 19 are supported peers. No
        Tailwind, CSS-in-JS runtime, or font download required.
      </p>
    </section>
    <section className="doc-section">
      <h2>
        <span className="step">02</span> Make something small
      </h2>
      <Code>{`import { Button, Card, Input } from '@oddmash/ui';\nimport '@oddmash/ui/styles.css';\n\nexport const Project = () => (\n  <Card>\n    <label htmlFor="name">Project name</label>\n    <Input id="name" placeholder="Your next idea" />\n    <Button>Create project</Button>\n  </Card>\n);`}</Code>
    </section>
    <section className="doc-section">
      <h2>
        <span className="step">03</span> Choose a theme
      </h2>
      <Code label="index.html">{`<html data-om-theme="dark">\n  <!-- Your application -->\n</html>`}</Code>
      <p className="body-copy">
        Set light or dark on the document or a subtree. Your application owns
        persistence. Dialog portals inherit the document theme; for a local
        override, provide a themed container or the theme prop.
      </p>
      <a className="text-link" href="#/colors">
        Explore the palette ↗
      </a>
    </section>
  </>
);
