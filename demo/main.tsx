import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Badge, Input } from '@oddmash/ui';
import { pages, componentIds, type PageId, type ComponentId } from './content';
import { Arrow, Mark, Code, Example, ComponentPage } from './examples';
import { Colors, Typography, TokenExplorer, Installation } from './foundations';
import lightTokens from '../tokens/semantic/light.json';
import '@oddmash/ui/styles.css';
import './style.scss';

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
    <section className="overview-hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="status-dot" /> THE ODDMASH DESIGN SYSTEM
        </div>
        <h1 tabIndex={-1} id="page-title">
          Small pieces.
          <br />
          <span>Distinct possibilities.</span>
        </h1>
        <p>
          A considered starting point for developer tools.
          <br className="desktop-break" /> Less design overhead. More room for
          your ideas.
        </p>
        <div className="hero-actions">
          <a className="solid-link" href="#/installation">
            Start building <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#/button">
            Explore components <Arrow />
          </a>
        </div>
        <div className="hero-meta">
          <span>REACT 18 / 19</span>
          <i />
          <span>SCSS</span>
          <i />
          <span>JSON TOKENS</span>
        </div>
      </div>
      <div
        className="hero-composition"
        role="group"
        aria-label="A composition of real Oddmash UI components"
      >
        <div className="composition-label">
          <span>FIG. 01</span>
          <span>BUILT FROM THE BASICS</span>
        </div>
        <div className="composition-grid">
          <div className="composition-cell identity-cell">
            <Mark />
            <span>
              oddmash
              <br />
              <small>Made to fit together.</small>
            </span>
          </div>
          <div className="composition-cell badge-cell">
            <Badge tone="accent">
              <span className="status-dot" />
              All systems ready
            </Badge>
            <span className="micro-label">A CLEAR SIGNAL</span>
          </div>
          <div className="composition-cell action-cell">
            <Button
              onClick={() => {
                location.hash = '/button';
              }}
            >
              Build something <Arrow />
            </Button>
            <span className="micro-label">A GOOD DEFAULT</span>
          </div>
          <div className="composition-cell scale-cell">
            <span>Aa</span>
            <small>Clarity at every scale.</small>
          </div>
          <div className="composition-cell input-cell">
            <label htmlFor="hero-name">Your next project</label>
            <Input id="hero-name" placeholder="Something a little different…" />
          </div>
          <div
            className="composition-cell palette-cell"
            role="img"
            aria-label="Theme palette"
          >
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="composition-label">
          <span>6 COMPONENTS. ONE SHARED LANGUAGE.</span>
          <span>↳ v0.1</span>
        </div>
      </div>
    </section>
    <section className="principles-strip" aria-label="Design principles">
      <div>
        <span>01</span>
        <strong>Quiet by default</strong>
        <p>Let the work take the spotlight.</p>
      </div>
      <div>
        <span>02</span>
        <strong>Clear in every state</strong>
        <p>Focus, feedback, and intent built in.</p>
      </div>
      <div>
        <span>03</span>
        <strong>Yours to shape</strong>
        <p>Change the tokens. Keep the rhythm.</p>
      </div>
    </section>
    <section className="doc-section component-collection">
      <div className="section-title">
        <div>
          <div className="eyebrow">THE BUILDING BLOCKS</div>
          <h2>
            Useful on their own.
            <br />
            Better together.
          </h2>
        </div>
        <span className="section-caption">
          SIX ESSENTIALS / NO EXTRA BAGGAGE
        </span>
      </div>
      <div className="component-grid">
        {componentIds.map((id, index) => (
          <article className={`component-tile tile-${id}`} key={id}>
            <div className="tile-preview">
              <Example id={id} />
            </div>
            <a href={`#/${id}`} className="tile-link">
              <span>
                <small>0{index + 1}</small>
                {pages.find((page) => page.id === id)?.title}
              </span>
              <Arrow />
            </a>
          </article>
        ))}
      </div>
    </section>
    <section className="foundation-callout">
      <div>
        <div className="eyebrow">THE SYSTEM UNDERNEATH</div>
        <h2>
          One source.
          <br />
          Every surface.
        </h2>
        <p>
          Colors, spacing, type, and motion.
          <br />
          All connected through a small set of JSON tokens.
        </p>
        <a className="text-link" href="#/tokens">
          Explore the foundations <Arrow />
        </a>
      </div>
      <Code label="tokens/semantic/light.json">
        {JSON.stringify(
          {
            semantic: { color: { accent: lightTokens.semantic.color.accent } },
          },
          null,
          2,
        )}
      </Code>
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
          <Mark />
          <strong>
            oddmash<span> / ui</span>
          </strong>
        </a>
        <nav aria-label="Top navigation">
          <a
            href="#/overview"
            aria-current={page === 'overview' ? 'page' : undefined}
          >
            Design system
          </a>
          <a
            href="#/installation"
            aria-current={page === 'installation' ? 'page' : undefined}
          >
            Get started
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
          {['Start here', 'Foundations', 'Components'].map((group) => (
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
          ))}
          {!filtered.length && (
            <p className="nav-empty" role="status">
              No pages found.
            </p>
          )}
        </nav>
        <div className="sidebar-bottom">
          <span className="status-dot" />
          <div>
            Small tools. Better flow.
            <a href="https://github.com/Oddmash">An Oddmash project ↗</a>
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
          <span className="breadcrumb-end">DESIGN LESS. BUILD MORE.</span>
        </div>
        {page === 'overview' ? (
          <Overview />
        ) : (
          <>
            <header className="page-heading">
              <div className="eyebrow">{current.group.toUpperCase()}</div>
              <h1 id="page-title" tabIndex={-1}>
                {current.title}
                <span>.</span>
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
              <TokenExplorer theme={theme} />
            ) : (
              <Installation />
            )}
          </>
        )}
        <footer className="site-footer">
          <span>
            <Mark /> Oddmash UI{' '}
            <span className="muted">/ a little less friction.</span>
          </span>
          <a href="https://github.com/Oddmash/oddmash-ui/blob/main/README.md">
            Contribute to the system <Arrow />
          </a>
        </footer>
      </main>
    </div>
  );
};
createRoot(document.getElementById('root')!).render(<App />);
