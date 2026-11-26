import { expect, it } from 'vitest';
import { createReferencePages, resolveReferenceAsset } from '../demo/reference-pages';
import { componentIds } from '../demo/content';

it('generates unique static component and directory pages in every supported locale', () => {
  const files = createReferencePages();
  const urls = new Set<string>();
  const parser = new DOMParser();
  for (const locale of ['en', 'ko', 'ja', 'zh-CN']) {
    for (const id of ['', ...componentIds]) {
      const path = `reference/${locale}/${id ? id + '/' : ''}index.html`;
      const html = files[path];
      expect(html).toBeDefined();
      const doc = parser.parseFromString(html, 'text/html');
      expect(doc.documentElement.lang).toBe(locale);
      expect(doc.querySelector('main h1')?.textContent).toBeTruthy();
      expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBeTruthy();
      const canonical = doc.querySelector('link[rel="canonical"]')!.getAttribute('href')!;
      expect(canonical).toBe('https://oddmash.github.io/oddmash-ui/' + path.replace('index.html', ''));
      expect(urls.has(canonical)).toBe(false);
      urls.add(canonical);
      expect(doc.querySelectorAll('link[rel="alternate"][hreflang]')).toHaveLength(5);
      expect(doc.querySelector('script')).toBeNull();
      if (id) expect(doc.querySelector('main table tbody tr')).not.toBeNull();
      else expect(doc.querySelector('main pre')?.textContent).toContain('npm install @oddmash/ui');
    }
  }
  expect(urls.size).toBe(4 * (componentIds.length + 1));
  for (const url of urls) expect(files['sitemap.xml']).toContain(`<loc>${url}</loc>`);
});

it('resolves generated development reference requests without falling back to the app', () => {
  const reference = resolveReferenceAsset('/reference/ko/tooltip/');
  expect(reference?.type).toBe('text/html');
  expect(reference?.body).toContain('<h1>툴팁</h1>');
  expect(resolveReferenceAsset('/reference/missing/')).toBeUndefined();
  expect(resolveReferenceAsset('/reference/style.css')?.type).toBe('text/css');
  expect(resolveReferenceAsset('/reference/style.css')?.body).toContain('outline:var(--reference-focusWidth)');
  expect(resolveReferenceAsset('/sitemap.xml')?.type).toBe('application/xml');
});
