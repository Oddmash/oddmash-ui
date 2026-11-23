import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  languages,
  LocaleProvider,
  readLocale,
  useLocale,
  type Locale,
} from './locale';
import { createRoot } from 'react-dom/client';
import { pages, componentIds, type PageId, type ComponentId } from './content';
import { Arrow, ComponentPage } from './examples';
import { Colors, Typography, TokenExplorer, Installation } from './foundations';
import '@oddmash/ui/styles.css';
import './fonts.scss';
import './style.scss';
import './interaction-lab.scss';
import './brand.scss';
import InteractionLab from './interaction-lab';
import { TimelineFilters } from './timeline-filters';
import { npmPackageUrl, repositoryUrl } from './package-links';

const navigationGroups = [...new Set(pages.map((page) => page.group))];

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
const Overview = () => {
  const { t } = useLocale();
  const componentGroups = navigationGroups.filter((group) =>
    pages.some((page) => page.group === group && componentIds.includes(page.id as ComponentId)),
  );
  const sections = [
    { title: 'Patterns', groups: ['Patterns'] },
    { title: 'Components', groups: componentGroups },
    { title: 'Foundations', groups: ['Foundations'] },
  ];
  return (
    <>
      <header className="overview-heading renewal-hero">
        <div className="renewal-copy">
          <p className="renewal-kicker">React · {t('Tokens')}</p>
          <h1 tabIndex={-1} id="page-title">Oddmash UI</h1>
          <p>{t('React components and design tokens for Oddmash developer tools.')}</p>
          <div className="hero-actions">
            <a className="solid-link" href="#/installation">
              {t('Getting started')} <Arrow />
            </a>
            <a className="text-link" href="#/button">
              {t('Browse components')} <Arrow />
            </a>
          </div>
        </div>
        <div className="renewal-mark" aria-hidden="true">
          <img src="./oddmash-logo.png" alt="" />
        </div>
      </header>
      <InteractionLab />
      {sections.map(({ title, groups }) => (
        <section className="overview-section" key={title}>
          <h2>{t(title)}</h2>
          <div className="component-directory">
            {groups.map((group) => {
              const items = pages.filter((page) => page.group === group);
              if (!items.length) return null;
              return (
                <div className="directory-group" key={group}>
                  {groups.length > 1 && (
                    <h3>{t(group === 'Components' ? 'Core components' : group)}</h3>
                  )}
                  <ul>
                    {items.map(({ id, title, description }) => (
                      <li key={id}>
                        <a href={`#/${id}`}>
                          <strong>{t(title)}</strong>
                          <span className="directory-description">{t(description)}</span>
                          <Arrow />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
};
const App = ({ onLocale }: { onLocale: (locale: Locale) => void }) => {
  const { locale, t } = useLocale();
  const [page, setPage] = useState<PageId>(readPage);
  const [theme, setTheme] = useState<'light' | 'dark'>(readTheme);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
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
      if (
        event.key === 'Escape' &&
        (sidebar.current?.contains(document.activeElement) ||
          document.activeElement === menuToggle.current) &&
        menuToggle.current?.offsetWidth
      ) {
        setMenu(false);
        menuToggle.current.focus();
      }
      if (event.key === 'Escape' && document.activeElement === search.current) {
        setMenu(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  const current = pages.find((item) => item.id === page)!;
  useEffect(() => {
    document.title = `${t(current.title)} | Oddmash UI`;
  }, [current.title, t]);
  const filtered = pages.filter((item) =>
    `${t(item.title)} ${t(item.group)} ${item.title} ${item.group}`
      .toLowerCase()
      .includes(query.toLowerCase()),
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
        {t('Skip to content')}
      </a>
      <header className="site-header">
        <a
          className="wordmark"
          href="#/overview"
          aria-label={t('Oddmash UI home')}
        >
          <img className="brand-logo" src="./oddmash-logo.png" alt="" />
          <strong>Oddmash UI</strong>
        </a>
        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <label className="sr-only" htmlFor="nav-search">
            {t('Search documentation')}
          </label>
          <input
            id="nav-search"
            ref={search}
            placeholder={t('Search docs…')}
            aria-controls="docs-sidebar"
            onFocus={() => setMenu(true)}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setMenu(true);
            }}
          />
          <kbd>⌘ K</kbd>
        </div>
        <div className="header-actions">
          <span className="version-label">v0.3</span>
          <div className="header-package-links">
            <a href={npmPackageUrl}>
              npm <Arrow />
            </a>
            <a href={repositoryUrl}>
              GitHub <Arrow />
            </a>
          </div>
          <select
            className="locale-select"
            aria-label={t('Language')}
            value={locale}
            onChange={(event) => onLocale(event.target.value as Locale)}
          >
            {Object.entries(languages).map(([id, label]) => (
              <option key={id} value={id} lang={id}>
                {label}
              </option>
            ))}
          </select>
          <button
            className="icon-button theme-button"
            aria-label={t(
              theme === 'light'
                ? 'Switch to dark theme'
                : 'Switch to light theme',
            )}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <span aria-hidden="true">{theme === 'light' ? '◐' : '☼'}</span>
          </button>
          <button
            ref={menuToggle}
            className="icon-button menu-toggle"
            aria-expanded={menu}
            aria-controls="docs-sidebar"
            onClick={() => setMenu((open) => !open)}
            aria-label={t('Toggle navigation')}
          >
            ☰
          </button>
        </div>
      </header>
      <aside
        ref={sidebar}
        id="docs-sidebar"
        className={`sidebar ${menu ? 'is-open' : ''}`}
      >
        <nav aria-label={t('Documentation')}>
          {navigationGroups.map(
            (group) =>
              filtered.some((item) => item.group === group) && (
                <div className="nav-group" key={group}>
                  <h2>{t(group)}</h2>
                  {filtered
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <a
                        key={item.id}
                        href={`#/${item.id}`}
                        aria-current={page === item.id ? 'page' : undefined}
                        onClick={() => {
                          if (page !== item.id) return;
                          setMenu(false);
                          setQuery('');
                          main.current?.querySelector('h1')?.focus();
                        }}
                      >
                        <span>{t(item.title)}</span>
                      </a>
                    ))}
                </div>
              ),
          )}
          {!filtered.length && (
            <p className="nav-empty" role="status">
              {t('No pages found.')}
            </p>
          )}
        </nav>
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
          <span>{t(current.group)}</span>
          <span aria-hidden="true">/</span>
          <strong>{t(current.title)}</strong>
        </div>
        <div key={page} className="route-content">
          {page === 'overview' ? (
            <Overview />
          ) : (
            <>
              <header className="page-heading">
                <h1 id="page-title" tabIndex={-1}>
                  {t(current.title)}
                </h1>
                <p>{t(current.description)}</p>
              </header>
              {component ? (
                <ComponentPage key={page} id={page as ComponentId} />
              ) : page === 'colors' ? (
                <Colors theme={theme} />
              ) : page === 'typography' ? (
                <Typography />
              ) : page === 'tokens' ? (
                <TokenExplorer />
              ) : page === 'timeline-filters' ? (
                <TimelineFilters />
              ) : page === 'interaction-pattern' ? (
                <div className="pattern-content">
                  <InteractionLab />
                  <section>
                    <h2>{t('Use the pattern')}</h2>
                    <p>
                      {t(
                        'Pair a keyboard-operable form with a separate, bounded event history. Keep the event list in chronological order and keep focus on the control the user is operating.',
                      )}
                    </p>
                    <p>
                      {t(
                        'Use a status message for a completed action. Keep routine focus and key events out of live regions so they do not interrupt screen reader announcements.',
                      )}
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
        </div>
        <footer className="site-footer">
          <span>
            <img className="footer-logo" src="./oddmash-logo.png" alt="" />
            Oddmash UI <span className="muted">· v0.3</span>
          </span>
          <a href="https://github.com/Oddmash/oddmash-ui/blob/main/CONTRIBUTING.md">
            {t('Contribute to the system')} <Arrow />
          </a>
        </footer>
      </main>
    </div>
  );
};
const Root = () => {
  const [locale, setLocale] = useState<Locale>(readLocale);

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem('om-docs-locale', locale);
    } catch {
      return;
    }
  }, [locale]);

  return (
    <LocaleProvider locale={locale}>
      <App onLocale={setLocale} />
    </LocaleProvider>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);
