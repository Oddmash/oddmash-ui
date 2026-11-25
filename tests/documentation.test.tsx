import { act, createRef, type FormEvent, type MouseEvent } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import {
  LinkCard,
  CodeBlock,
  CodeBlockHeader,
  CodeBlockCaption,
  CodeBlockContent,
  CodeBlockCopy,
  SiteHeader,
  SiteHeaderInner,
  SiteFooter,
  SiteFooterInner,
  SiteNav,
  Prose,
  ProseScroll,
} from '../src';

it('keeps link cards as native links with a forwarded ref, class and event', () => {
  const ref = createRef<HTMLAnchorElement>();
  const click = vi.fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());
  render(
    <LinkCard ref={ref} href="/guide" target="_blank" rel="noreferrer" className="custom" onClick={click}>
      <strong>Usage guide</strong><span className="om-link-card-arrow" aria-hidden="true">→</span>
    </LinkCard>,
  );
  const link = screen.getByRole('link', { name: 'Usage guide' });
  expect(link).toHaveAttribute('href', '/guide');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveClass('om-link-card', 'custom');
  expect(ref.current).toBe(link);
  fireEvent.click(link);
  expect(click).toHaveBeenCalledOnce();
});

it('preserves code whitespace, syntax markup, native props and copy button behavior', () => {
  const copy = vi.fn();
  const submit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
  const shellRef = createRef<HTMLDivElement>();
  const headerRef = createRef<HTMLDivElement>();
  const captionRef = createRef<HTMLSpanElement>();
  const codeRef = createRef<HTMLPreElement>();
  const actionRef = createRef<HTMLButtonElement>();
  render(
    <form onSubmit={submit}>
      <CodeBlock ref={shellRef} data-testid="block" className="custom" style={{ marginTop: 3 }}>
        <CodeBlockHeader ref={headerRef} data-testid="header">
          <CodeBlockCaption ref={captionRef}>example.ts</CodeBlockCaption>
          <CodeBlockCopy ref={actionRef} onClick={copy} aria-label="Copy code">Copy</CodeBlockCopy>
        </CodeBlockHeader>
        <CodeBlockContent ref={codeRef} tabIndex={0} role="region" aria-label="Example code">
          <code><span className="syntax-keyword">const</span>{' value = 1;\n  value;'}</code>
        </CodeBlockContent>
      </CodeBlock>
    </form>,
  );
  const block = screen.getByTestId('block');
  const header = screen.getByTestId('header');
  const caption = screen.getByText('example.ts');
  const code = screen.getByRole('region', { name: 'Example code' });
  const button = screen.getByRole('button', { name: 'Copy code' });
  expect(block).toHaveClass('om-code-block', 'custom');
  expect(block.style.marginTop).toBe('3px');
  expect(shellRef.current).toBe(block);
  expect(headerRef.current).toBe(header);
  expect(header).toHaveClass('om-code-block-header');
  expect(captionRef.current).toBe(caption);
  expect(caption).toHaveClass('om-code-block-caption');
  expect(codeRef.current).toBe(code);
  expect(code.tagName).toBe('PRE');
  expect(code.textContent).toBe('const value = 1;\n  value;');
  expect(within(code).getByText('const')).toHaveClass('syntax-keyword');
  expect(actionRef.current).toBe(button);
  expect(button).toHaveClass('om-code-block-copy');
  expect(button).toHaveAttribute('type', 'button');
  fireEvent.click(button);
  expect(copy).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
});

it('keeps native header, footer, nav and article structures and refs', () => {
  const headerRef = createRef<HTMLElement>();
  const headerInnerRef = createRef<HTMLDivElement>();
  const navRef = createRef<HTMLElement>();
  const footerRef = createRef<HTMLElement>();
  const footerInnerRef = createRef<HTMLDivElement>();
  const proseRef = createRef<HTMLElement>();
  const scrollRef = createRef<HTMLDivElement>();
  render(
    <>
      <SiteHeader ref={headerRef} className="brand-shell">
        <SiteHeaderInner ref={headerInnerRef}>
          <SiteNav ref={navRef} aria-label="Primary navigation"><a href="/guide" aria-current="page">Guide</a></SiteNav>
        </SiteHeaderInner>
      </SiteHeader>
      <main>
        <Prose ref={proseRef} lang="ko" className="documentation" aria-label="Documentation">
          <h2>사용법</h2>
          <ProseScroll ref={scrollRef} role="region" aria-label="API" tabIndex={0}>
            <table><caption>Options</caption><thead><tr><th scope="col">Name</th></tr></thead><tbody><tr><td>href</td></tr></tbody></table>
          </ProseScroll>
        </Prose>
      </main>
      <SiteFooter ref={footerRef}>
        <SiteFooterInner ref={footerInnerRef}><SiteNav aria-label="Footer navigation"><a href="/guide">Guide</a></SiteNav></SiteFooterInner>
      </SiteFooter>
    </>,
  );
  const header = screen.getByRole('banner');
  const footer = screen.getByRole('contentinfo');
  const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
  const article = screen.getByRole('article', { name: 'Documentation' });
  const scroll = screen.getByRole('region', { name: 'API' });
  expect(headerRef.current).toBe(header);
  expect(header).toHaveClass('om-site-header', 'brand-shell');
  expect(headerInnerRef.current).toHaveClass('om-site-header-inner');
  expect(navRef.current).toBe(nav);
  expect(within(nav).getByRole('link')).toHaveAttribute('aria-current', 'page');
  expect(footerRef.current).toBe(footer);
  expect(footerInnerRef.current).toHaveClass('om-site-footer-inner');
  expect(proseRef.current).toBe(article);
  expect(article).toHaveAttribute('lang', 'ko');
  expect(article).toHaveClass('om-prose', 'documentation');
  expect(scrollRef.current).toBe(scroll);
  expect(scroll).toHaveClass('om-prose-scroll');
  expect(within(article).getByRole('table', { name: 'Options' })).toBeVisible();
});

it('hydrates the documentation primitives without recoverable errors', async () => {
  const app = (
    <>
      <SiteHeader><SiteHeaderInner><SiteNav aria-label="Navigation"><LinkCard href="/guide">Guide</LinkCard></SiteNav></SiteHeaderInner></SiteHeader>
      <main>
        <Prose><h1>Documentation</h1><CodeBlock><CodeBlockContent><code>pnpm add @oddmash/ui</code></CodeBlockContent></CodeBlock></Prose>
      </main>
      <SiteFooter><SiteFooterInner>Open source</SiteFooterInner></SiteFooter>
    </>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(app);
  document.body.append(container);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, app, { onRecoverableError: (error) => errors.push(error) }); });
  expect(errors).toEqual([]);
  await act(async () => root.unmount());
  container.remove();
});
