import { act, createRef, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DocsNavigation, TableOfContents, observeActiveHeading } from '../src/docs-navigation';
import { ScrollHeader, observeScrollHeader } from '../src/scroll-header';
import { LocalePicker } from '../src/locale-picker';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const groups = [{
  id: 'start',
  label: 'Start here',
  items: [
    { id: 'guide', href: '/guide', label: 'Guide' },
    { id: 'api', href: '/api', label: 'API' },
  ],
}];

const headings = [
  { id: 'setup', label: 'Setup', level: 2 },
  { id: '설치', label: 'Install', level: 3 },
];

const locales = [
  { value: 'en', label: 'English', lang: 'en', href: '/en/docs' },
  { value: 'ko', label: '한국어', lang: 'ko', href: '/ko/docs' },
  { value: 'ja', label: '日本語', lang: 'ja', href: '/ja/docs', disabled: true },
];

const geometry = (top: number): DOMRect => ({
  x: 0, y: top, width: 100, height: 20, top, left: 0, right: 100, bottom: top + 20, toJSON: () => ({}),
});

const scrollFixture = () => {
  const scrollDescriptor = Object.getOwnPropertyDescriptor(window, 'scrollY');
  const heightDescriptor = Object.getOwnPropertyDescriptor(window, 'innerHeight');
  const documentHeight = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollHeight');
  let y = 0;
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => y });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 });
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 });
  let nextFrame = 0;
  const pending = new Map<number, FrameRequestCallback>();
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    pending.set(++nextFrame, callback);
    return nextFrame;
  });
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => { pending.delete(id); });
  const flush = () => {
    const batch = [...pending.values()];
    pending.clear();
    batch.forEach(callback => callback(0));
  };
  return {
    scroll: (next: number) => {
      y = next;
      window.dispatchEvent(new Event('scroll'));
      flush();
    },
    flush,
    restore: () => {
      if (scrollDescriptor) Object.defineProperty(window, 'scrollY', scrollDescriptor);
      else Reflect.deleteProperty(window, 'scrollY');
      if (heightDescriptor) Object.defineProperty(window, 'innerHeight', heightDescriptor);
      else Reflect.deleteProperty(window, 'innerHeight');
      if (documentHeight) Object.defineProperty(document.documentElement, 'scrollHeight', documentHeight);
      else Reflect.deleteProperty(document.documentElement, 'scrollHeight');
    },
  };
};

it('keeps native navigation links and current destination, toggling mobile control without changing routes', () => {
  const ref = createRef<HTMLElement>();
  const navigate = vi.fn((_: unknown, event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
  render(<DocsNavigation ref={ref} aria-label="Documentation" groups={groups} currentId="guide" mobileLabel="Browse docs" onNavigate={navigate} className="custom" />);
  const nav = screen.getByRole('navigation', { name: 'Documentation' });
  const toggle = within(nav).getByRole('button', { name: 'Browse docs' });
  expect(nav).toBe(ref.current);
  expect(nav).toHaveClass('om-docs-navigation', 'custom');
  expect(within(nav).getByRole('link', { name: 'Guide' })).toHaveAttribute('aria-current', 'page');
  expect(within(nav).getByRole('link', { name: 'API' })).toHaveAttribute('href', '/api');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const api = within(nav).getByRole('link', { name: 'API' });
  api.addEventListener('click', event => event.preventDefault(), { once: true });
  fireEvent.click(api, { ctrlKey: true });
  expect(navigate).not.toHaveBeenCalled();
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(api);
  expect(navigate).toHaveBeenCalledOnce();
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});

it('renders encoded section anchors and supports consumer-controlled active state', () => {
  const ref = createRef<HTMLElement>();
  const { rerender } = render(<TableOfContents ref={ref} label="On this page" headings={headings} activeId="설치" />);
  const nav = screen.getByRole('navigation', { name: 'On this page' });
  expect(nav).toBe(ref.current);
  expect(within(nav).getByRole('link', { name: 'Install' })).toHaveAttribute('href', '#%EC%84%A4%EC%B9%98');
  expect(within(nav).getByRole('link', { name: 'Install' })).toHaveAttribute('aria-current', 'location');
  expect(within(nav).getByRole('link', { name: 'Install' }).closest('li')).toHaveAttribute('data-level', '3');
  rerender(<TableOfContents label="On this page" headings={headings} activeId={null} />);
  expect(within(nav).getByRole('link', { name: 'Install' })).not.toHaveAttribute('aria-current');
});

it('observes active headings and uses the reading line at the bottom', () => {
  const fixture = scrollFixture();
  const initial = window.location.hash;
  const content = document.createElement('article');
  const first = document.createElement('h2');
  first.id = 'setup';
  const last = document.createElement('h2');
  last.id = '설치';
  content.append(first, last);
  document.body.append(content);
  const firstRect = vi.spyOn(first, 'getBoundingClientRect').mockReturnValue(geometry(100));
  const lastRect = vi.spyOn(last, 'getBoundingClientRect').mockReturnValue(geometry(900));
  const update = vi.fn();
  const stop = observeActiveHeading(content, ['setup', '설치'], update, { offset: 40 });
  try {
    fixture.flush();
    expect(update).not.toHaveBeenCalled();
    firstRect.mockReturnValue(geometry(60));
    fixture.scroll(40);
    expect(update).toHaveBeenLastCalledWith('setup');
    lastRect.mockReturnValue(geometry(20));
    window.dispatchEvent(new Event('resize'));
    fixture.flush();
    expect(update).toHaveBeenLastCalledWith('설치');
    window.history.replaceState(null, '', '#setup');
    window.dispatchEvent(new Event('hashchange'));
    expect(update).toHaveBeenLastCalledWith('setup');
    lastRect.mockReturnValue(geometry(400));
    fixture.scroll(1400);
    expect(update).toHaveBeenLastCalledWith('setup');
    lastRect.mockReturnValue(geometry(65));
    fixture.scroll(1400);
    expect(update).toHaveBeenLastCalledWith('setup');
    lastRect.mockReturnValue(geometry(64));
    fixture.scroll(1400);
    expect(update).toHaveBeenLastCalledWith('설치');
    lastRect.mockReturnValue(geometry(65));
    fixture.scroll(1400);
    expect(update).toHaveBeenLastCalledWith('setup');
    lastRect.mockReturnValue(geometry(63));
    fixture.scroll(1400);
    expect(update).toHaveBeenLastCalledWith('설치');
    stop();
    update.mockClear();
    fixture.scroll(50);
    expect(update).not.toHaveBeenCalled();
  } finally {
    stop();
    content.remove();
    window.history.replaceState(null, '', window.location.pathname + initial);
    fixture.restore();
  }
});

it('uses the same headless active-heading observer in the React table of contents', () => {
  const fixture = scrollFixture();
  try {
    render(<>
      <article id="article"><h2 id="setup">Setup heading</h2><h2 id="설치">Install heading</h2></article>
      <TableOfContents label="On this page" headings={headings} contentId="article" />
    </>);
    vi.spyOn(screen.getByRole('heading', { name: 'Setup heading' }), 'getBoundingClientRect').mockReturnValue(geometry(-10));
    vi.spyOn(screen.getByRole('heading', { name: 'Install heading' }), 'getBoundingClientRect').mockReturnValue(geometry(300));
    act(() => fixture.scroll(100));
    expect(screen.getByRole('link', { name: 'Setup' })).toHaveAttribute('aria-current', 'location');
  } finally {
    fixture.restore();
  }
});

it('hides on downward scroll, reveals on upward scroll, focus, open controls and at the top', async () => {
  const fixture = scrollFixture();
  const header = document.createElement('header');
  const button = document.createElement('button');
  header.append(button);
  document.body.append(header);
  const stop = observeScrollHeader(header);
  try {
    expect(header.dataset.omScrollHidden).toBe('false');
    fixture.scroll(80);
    expect(header.dataset.omScrollHidden).toBe('true');
    fixture.scroll(70);
    expect(header.dataset.omScrollHidden).toBe('false');
    fixture.scroll(105);
    expect(header.dataset.omScrollHidden).toBe('true');
    button.focus();
    expect(header.dataset.omScrollHidden).toBe('false');
    button.blur();
    fixture.scroll(150);
    expect(header.dataset.omScrollHidden).toBe('true');
    button.setAttribute('aria-expanded', 'true');
    await Promise.resolve();
    expect(header.dataset.omScrollHidden).toBe('false');
    fixture.scroll(250);
    expect(header.dataset.omScrollHidden).toBe('false');
    button.setAttribute('aria-expanded', 'false');
    fixture.scroll(300);
    expect(header.dataset.omScrollHidden).toBe('true');
    window.dispatchEvent(new Event('pageshow'));
    expect(header.dataset.omScrollHidden).toBe('false');
    fixture.scroll(350);
    expect(header.dataset.omScrollHidden).toBe('true');
    fixture.scroll(0);
    expect(header.dataset.omScrollHidden).toBe('false');
    stop();
    expect(header).not.toHaveAttribute('data-om-scroll-hidden');
  } finally {
    stop();
    header.remove();
    fixture.restore();
  }
});

it('does not hide for reduced-motion preferences, optional media mismatches, or explicit locks', () => {
  const fixture = scrollFixture();
  const descriptor = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  const matchMedia = vi.fn((media: string) => ({
    matches: media.includes('reduced-motion'),
    media,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: matchMedia });
  const ref = createRef<HTMLElement>();
  try {
    const { rerender } = render(<ScrollHeader ref={ref} className="custom" media="(max-width: 600px)">Navigation</ScrollHeader>);
    expect(ref.current).toBe(screen.getByRole('banner'));
    expect(ref.current).toHaveClass('om-site-header', 'om-scroll-header', 'custom');
    act(() => fixture.scroll(100));
    expect(ref.current?.dataset.omScrollHidden).toBe('false');
    rerender(<ScrollHeader ref={ref} locked>Navigation</ScrollHeader>);
    act(() => fixture.scroll(200));
    expect(ref.current?.dataset.omScrollHidden).toBe('false');
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  } finally {
    if (descriptor) Object.defineProperty(window, 'matchMedia', descriptor);
    else Reflect.deleteProperty(window, 'matchMedia');
    fixture.restore();
  }
});

it('delegates locale selection to the consumer and retains the shared Select semantics', () => {
  const select = vi.fn();
  const ref = createRef<HTMLButtonElement>();
  const Example = () => {
    const [value, setValue] = useState('en');
    return <LocalePicker ref={ref} label="Language" options={locales} value={value} onValueChange={(next, option) => {
      select(next, option.href);
      setValue(next);
    }} />;
  };
  render(<Example />);
  const trigger = screen.getByRole('combobox', { name: 'Language' });
  expect(ref.current).toBe(trigger);
  expect(trigger).toHaveTextContent('English');
  fireEvent.click(trigger);
  expect(screen.getByRole('option', { name: '日本語' })).toHaveAttribute('aria-disabled', 'true');
  expect(screen.getByRole('option', { name: '한국어' })).toHaveAttribute('lang', 'ko');
  fireEvent.click(screen.getByRole('option', { name: '한국어' }));
  expect(select).toHaveBeenCalledWith('ko', '/ko/docs');
  expect(trigger).toHaveTextContent('한국어');
  expect(trigger).toHaveAttribute('lang', 'ko');
});

it('keeps all native destinations in the server markup and hydrates without recoverable errors', async () => {
  const app = <>
    <DocsNavigation aria-label="Docs" groups={groups} mobileLabel="Browse docs" />
    <TableOfContents label="On this page" mobileLabel="Contents" headings={headings} activeId="setup" />
    <ScrollHeader>Navigation</ScrollHeader>
    <LocalePicker label="Language" options={locales} value="en" />
  </>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(app);
  document.body.append(container);
  expect(container.querySelector('.om-docs-navigation')).not.toHaveAttribute('data-enhanced');
  expect(container.querySelector('.om-docs-navigation a[href="/guide"]')).not.toBeNull();
  expect(container.querySelector('.om-table-of-contents a[href="#setup"]')).not.toBeNull();
  expect(container.querySelector('.om-scroll-header')).not.toHaveAttribute('data-om-scroll-hidden');
  expect(container.querySelector('.om-locale-fallback')).not.toHaveAttribute('hidden');
  expect(container.querySelector('.om-locale-fallback a[href="/ko/docs"]')).toHaveAttribute('hreflang', 'ko');
  expect(container.querySelector('.om-locale-fallback a[href="/ja/docs"]')).toBeNull();
  expect(container.querySelector('[role="combobox"]')).toBeNull();
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, app, { onRecoverableError: error => errors.push(error) }); });
    expect(errors).toEqual([]);
    expect(container.querySelector('.om-docs-navigation')).toHaveAttribute('data-enhanced', 'true');
    expect(container.querySelector('.om-locale-fallback')).toHaveAttribute('hidden');
    expect(container.querySelector('[role="combobox"]')).not.toBeNull();
  } finally {
    await act(async () => root?.unmount());
    container.remove();
  }
});
