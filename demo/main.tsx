import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import {
  languages,
  LocaleProvider,
  readLocale,
  useLocale,
  type Locale,
} from './locale';
import { createRoot } from 'react-dom/client';
import { Button, CommandPalette, Kbd, PlatformLink, PlatformLinks, Select } from '@oddmash/ui';
import { pages, componentIds, type PageId, type ComponentId } from './content';
import { Arrow, ComponentPage } from './examples';
import { Colors, Typography, TokenExplorer, Installation } from './foundations';
import '@oddmash/ui/styles.css';
import './fonts.scss';
import './style.scss';
import './interaction-lab.scss';
import './brand.scss';
import './docs-shell.scss';
import InteractionLab from './interaction-lab';
import { TimelineFilters } from './timeline-filters';
import { npmPackageUrl, repositoryUrl, packageMinorVersion } from './package-links';
import { readThemePreference, readSystemTheme, themeOptions, type ThemePreference } from './theme';
import docsShellTokens from './docs-shell-tokens.json';

const navigationGroups = [...new Set(pages.map((page) => page.group))];

const readPage = (): PageId => {
  const candidate = location.hash.slice(2);
  return pages.find((page) => page.id === candidate)?.id ?? 'overview';
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
  const [themePreference, setThemePreference] = useState<ThemePreference>(readThemePreference);
  const [systemTheme, setSystemTheme] = useState(readSystemTheme);
  const theme = themePreference === 'system' ? systemTheme : themePreference;
  const [menu, setMenu] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
  }, [page]);
  useLayoutEffect(() => {
    const container = sidebar.current;
    const active = container?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!container || !active || !container.clientHeight) return;
    const viewport = container.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.top < viewport.top) container.scrollTop -= viewport.top - item.top;
    else if (item.bottom > viewport.bottom) container.scrollTop += item.bottom - viewport.bottom;
  }, [page, menu, locale]);
  useEffect(() => {
    const navigate = () => {
      setPage(readPage());
      setMenu(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.omTheme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem('om-docs-theme', themePreference);
    } catch {
      return;
    }
  }, [theme, themePreference]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemTheme(media.matches ? 'dark' : 'light');
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (
        !event.defaultPrevented &&
        event.key === 'Escape' &&
        (sidebar.current?.contains(document.activeElement) ||
          document.activeElement === menuToggle.current) &&
        menuToggle.current?.offsetWidth
      ) {
        setMenu(false);
        menuToggle.current.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  const current = pages.find((item) => item.id === page)!;
  useEffect(() => {
    document.title = `${t(current.title)} | Oddmash UI`;
  }, [current.title, t]);
  const searchItems = pages.map((item) => ({
    id: item.id,
    label: t(item.title),
    group: t(item.group),
    description: t(item.description),
    keywords: [item.id, item.title, item.group, item.description],
    onSelect: () => {
      setMenu(false);
      if (page === item.id) main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
      else location.hash = `/${item.id}`;
    },
  }));
  const component = componentIds.includes(page as ComponentId);
  return (
    <div className="docs-app" style={{
      '--docs-header-control-width': docsShellTokens.headerControlWidth,
      '--docs-search-max-width': docsShellTokens.searchMaxWidth,
      '--docs-search-preferred-width': docsShellTokens.searchPreferredWidth,
      '--docs-search-compact-width': docsShellTokens.searchCompactWidth,
    } as CSSProperties}>
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
        <CommandPalette
          trigger={
            <Button variant="secondary" className="search-box docs-search-trigger" aria-keyshortcuts="Control+K Meta+K">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <span>{t('Search documentation')}</span>
              <Kbd>{/(Mac|iPhone|iPad)/.test(navigator.userAgent) ? '⌘ K' : 'Ctrl K'}</Kbd>
            </Button>
          }
          title={t('Search documentation')}
          description={t('Choose a documentation page')}
          searchLabel={t('Search documentation')}
          emptyLabel={t('No pages found.')}
          dismissLabel={t('Close search')}
          items={searchItems}
          theme={theme}
          shortcut
          onOpenChange={(open) => { if (open) setMenu(false); }}
        />
        <div className="header-actions">
          <span className="version-label">v{packageMinorVersion}</span>
          <Select
            className="locale-select"
            aria-label={t('Language')}
            value={locale}
            lang={locale}
            options={Object.entries(languages).map(([id, label]) => ({
              value: id,
              label,
              lang: id,
            }))}
            onValueChange={(value) => onLocale(value as Locale)}
          />
          <Select
            className="theme-select"
            aria-label={t('Theme')}
            value={themePreference}
            options={themeOptions.map(({ value, label }) => ({ value, label: t(label) }))}
            onValueChange={(value) => setThemePreference(value as ThemePreference)}
          />
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
        <PlatformLinks className="header-package-links" role="group" aria-label={t('Platform links')}>
          <PlatformLink platform="github" href={repositoryUrl} aria-label="GitHub" title="GitHub" />
          <PlatformLink platform="npm" href={npmPackageUrl} aria-label="npm" title="npm" />
        </PlatformLinks>
      </header>
      <aside
        ref={sidebar}
        id="docs-sidebar"
        className={`sidebar ${menu ? 'is-open' : ''}`}
      >
        <nav aria-label={t('Documentation')}>
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group}>
              <h2>{t(group)}</h2>
              {pages.filter((item) => item.group === group).map((item) => (
                <a
                  key={item.id}
                  href={`#/${item.id}`}
                  aria-current={page === item.id ? 'page' : undefined}
                  onClick={() => {
                    if (page !== item.id) return;
                    setMenu(false);
                    main.current?.querySelector('h1')?.focus({ preventScroll: true });
                  }}
                >
                  <span>{t(item.title)}</span>
                </a>
              ))}
            </div>
          ))}
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
            Oddmash UI <span className="muted">· v{packageMinorVersion}</span>
          </span>
          <a href={`./reference/${locale}/${component ? page + "/" : ""}`}>{t("Component reference")} <Arrow /></a>
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
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang') && Object.hasOwn(languages, url.searchParams.get('lang') ?? '')) {
      url.searchParams.delete('lang');
      window.history.replaceState(window.history.state, '', url);
    }
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
