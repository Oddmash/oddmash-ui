import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { pages, componentIds, type PageId, type ComponentId } from './content';
import { Arrow, Example, ComponentPage } from './examples';
import { Colors, Typography, TokenExplorer, Installation } from './foundations';
import '@oddmash/ui/styles.css';
import './style.scss';
import './interaction-lab.scss';
import InteractionLab from './interaction-lab';

const readPage = (): PageId => {
  const candidate = location.hash.slice(2);
  return pages.find((page) => page.id === candidate)?.id ?? 'overview';
};
const readTheme = (): 'light' | 'dark' => {
  try {
    return localStorage.getItem('om-docs-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};
const Overview = () => (
  <>
    <section className="overview-intro">
      <div>
        <h1 tabIndex={-1} id="page-title">
          Small tools.
          <br />
          Better flow.
        </h1>
        <p>
          Oddmash UI is the shared design system for our developer tools.
          Explore the React components, build with JSON tokens, and try how they
          work together in the Interaction Lab.
        </p>
        <div className="overview-actions">
          <a className="solid-link" href="#/installation">
            Getting started <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#/button">
            Browse components <Arrow />
          </a>
        </div>
      </div>
      <InteractionLab />
    </section>
    <section className="overview-section component-collection">
      <div className="overview-section-heading">
        <div>
          <h2>Components</h2>
          <p>Six accessible primitives for common developer-tool interfaces.</p>
        </div>
        <a className="text-link" href="#/button">
          Component documentation <Arrow />
        </a>
      </div>
      <div className="component-grid">
        {componentIds.map((id) => (
          <article className={`component-tile tile-${id}`} key={id}>
            <div className="tile-preview">
              <Example id={id} />
            </div>
            <a href={`#/${id}`} className="tile-link">
              <span>{pages.find((page) => page.id === id)?.title}</span>
              <Arrow />
            </a>
          </article>
        ))}
      </div>
    </section>
    <section className="overview-section overview-foundations">
      <div className="overview-section-heading">
        <div>
          <h2>Foundations</h2>
          <p>Shared color, type, spacing, motion, and theme behavior.</p>
        </div>
      </div>
      <div className="foundation-links">
        {[
          ['colors', 'Colors', 'Semantic roles for light and dark themes.'],
          [
            'typography',
            'Typography',
            'A system-font scale for tools and documentation.',
          ],
          ['tokens', 'Tokens', 'DTCG JSON compiled to CSS and TypeScript.'],
        ].map(([id, title, description]) => (
          <a key={id} href={`#/${id}`}>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  </>
);
const App = () => {
  const [page, setPage] = useState<PageId>(readPage);
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    main.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [page]);
  useEffect(() => {
    const navigate = () => {
      setPage(readPage());
      setMenu(false);
      setQuery('');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.omTheme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('om-docs-theme', theme);
    } catch {
      /* Storage is optional. */
    }
  }, [theme]);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setMenu(true);
        requestAnimationFrame(() => search.current?.focus());
      }
      if (event.key === 'Escape') {
        setMenu(false);
        search.current?.blur();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  const current = pages.find((item) => item.id === page)!;
  useEffect(() => {
    document.title = `${current.title} — Oddmash UI`;
  }, [current.title]);
  const filtered = pages.filter((item) =>
    `${item.title} ${item.group}`.toLowerCase().includes(query.toLowerCase()),
  );
  const component = componentIds.includes(page as ComponentId);
  return (
    <div className="docs-app">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#/overview" aria-label="Oddmash UI home">
          <img className="brand-logo" src="./oddmash-logo.png" alt="" />
          <strong>Oddmash UI</strong>
        </a>
        <nav aria-label="Top navigation">
          <a
            href="#/overview"
            aria-current={page === 'overview' ? 'page' : undefined}
          >
            Overview
          </a>
          <a href="#/button" aria-current={component ? 'page' : undefined}>
            Components
          </a>
          <a
            href="#/colors"
            aria-current={current.group === 'Foundations' ? 'page' : undefined}
          >
            Foundations
          </a>
          <a
            href="#/installation"
            aria-current={page === 'installation' ? 'page' : undefined}
          >
            Getting started
          </a>
        </nav>
        <div className="header-actions">
          <span className="version-label">v0.1</span>
          <a
            className="github-link"
            href="https://github.com/Oddmash/oddmash-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow />
          </a>
          <button
            className="icon-button theme-button"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <span aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span>
          </button>
          <button
            className="icon-button menu-toggle"
            aria-expanded={menu}
            aria-controls="docs-sidebar"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>
      </header>
      <aside id="docs-sidebar" className={`sidebar ${menu ? 'is-open' : ''}`}>
        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <label className="sr-only" htmlFor="nav-search">
            Search documentation
          </label>
          <input
            id="nav-search"
            ref={search}
            placeholder="Find something…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <kbd>⌘ K</kbd>
        </div>
        <nav aria-label="Documentation">
          {['Start here', 'Foundations', 'Components', 'Patterns'].map(
            (group) => (
              <div className="nav-group" key={group}>
                <h2>{group}</h2>
                {filtered
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <a
                      key={item.id}
                      href={`#/${item.id}`}
                      aria-current={page === item.id ? 'page' : undefined}
                    >
                      <span>{item.title}</span>
                      {page === item.id && (
                        <span className="nav-dot" aria-hidden="true" />
                      )}
                    </a>
                  ))}
              </div>
            ),
          )}
          {!filtered.length && (
            <p className="nav-empty" role="status">
              No pages found.
            </p>
          )}
        </nav>
        <div className="sidebar-bottom">
          <img className="sidebar-logo" src="./oddmash-logo.png" alt="" />
          <div>
            Oddmash UI
            <a href="https://github.com/Oddmash">Oddmash on GitHub ↗</a>
          </div>
        </div>
      </aside>
      <main
        id="main-content"
        tabIndex={-1}
        ref={main}
        className={
          page === 'overview' ? 'docs-main overview' : 'docs-main detail'
        }
      >
        <div className="breadcrumb">
          <span>{current.group}</span>
          <span aria-hidden="true">/</span>
          <strong>{current.title}</strong>
        </div>
        {page === 'overview' ? (
          <Overview />
        ) : (
          <>
            <header className="page-heading">
              <h1 id="page-title" tabIndex={-1}>
                {current.title}
              </h1>
              <p>{current.description}</p>
            </header>
            {component ? (
              <ComponentPage key={page} id={page as ComponentId} />
            ) : page === 'colors' ? (
              <Colors theme={theme} />
            ) : page === 'typography' ? (
              <Typography />
            ) : page === 'tokens' ? (
              <TokenExplorer />
            ) : page === 'interaction-pattern' ? (
              <div className="pattern-content">
                <InteractionLab />
                <section>
                  <h2>Use the pattern</h2>
                  <p>
                    Pair a keyboard-operable form with a separate, bounded event
                    history. Keep the event list in chronological order and keep
                    focus on the control the user is operating.
                  </p>
                  <p>
                    Use a status message for a completed action. Keep routine
                    focus and key events out of live regions so they do not
                    interrupt screen reader announcements.
                  </p>
                  <p>
                    <a className="text-link" href="#/input">
                      Input <Arrow />
                    </a>
                    {' · '}
                    <a className="text-link" href="#/tabs">
                      Tabs <Arrow />
                    </a>
                  </p>
                </section>
              </div>
            ) : (
              <Installation />
            )}
          </>
        )}
        <footer className="site-footer">
          <span>
            <img className="footer-logo" src="./oddmash-logo.png" alt="" />
            Oddmash UI <span className="muted">· v0.1</span>
          </span>
          <a href="https://github.com/Oddmash/oddmash-ui/blob/main/CONTRIBUTING.md">
            Contribute to the system <Arrow />
          </a>
        </footer>
      </main>
    </div>
  );
};
createRoot(document.getElementById('root')!).render(<App />);
