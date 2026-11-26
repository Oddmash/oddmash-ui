import { componentIds, details, pages } from './content';
import { translations } from './translations';
import { packageVersion } from './package-links';
import type { ComponentId } from './content';
import referenceTokens from './reference-tokens.json' with { type: 'json' };

const site = 'https://oddmash.github.io/oddmash-ui/';
const locales = ['en', 'ko', 'ja', 'zh-CN'] as const;
type Language = typeof locales[number];

const names: Record<Language, string> = { en: 'English', ko: '한국어', ja: '日本語', 'zh-CN': '简体中文' };
const labels: Record<Language, { reference: string; preview: string; property: string; installation: string; directory: string }> = {
  en: { reference: 'Component reference', preview: 'Interactive documentation', property: 'Property', installation: 'Installation', directory: 'All components' },
  ko: { reference: '컴포넌트 참고 문서', preview: '인터랙티브 문서', property: '속성', installation: '설치', directory: '모든 컴포넌트' },
  ja: { reference: 'コンポーネントリファレンス', preview: 'インタラクティブなドキュメント', property: 'プロパティ', installation: 'インストール', directory: 'すべてのコンポーネント' },
  'zh-CN': { reference: '组件参考', preview: '交互式文档', property: '属性', installation: '安装', directory: '所有组件' },
};
const entities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escape = (value: string) => value.replace(/[&<>"']/g, character => entities[character]);
const translate = (locale: Language, value: string) => locale === 'en' ? value : translations[value]?.[locale === 'ko' ? 0 : locale === 'ja' ? 1 : 2] ?? value;
const route = (locale: Language, id = '') => `reference/${locale}/${id ? id + '/' : ''}`;
const canonical = (locale: Language, id = '') => site + route(locale, id);
const documentPage = (locale: Language, title: string, description: string, id: string, body: string) => {
  const root = id ? '../../../' : '../../';
  const assetRoot = id ? '../../' : '../';
  const links = locales.map(language => `<link rel="alternate" hreflang="${language}" href="${canonical(language, id)}">`).join('');
  const languageLinks = locales.map(language => `<a hreflang="${language}" lang="${language}" href="${assetRoot}${language}/${id ? id + '/' : ''}"${language === locale ? ' aria-current="page"' : ''}>${names[language]}</a>`).join(' ');
  const directory = id ? '../' : './';
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} | Oddmash UI</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical(locale, id)}">${links}<link rel="alternate" hreflang="x-default" href="${canonical('en', id)}"><link rel="stylesheet" href="${assetRoot}style.css"></head><body><header><a href="${directory}">Oddmash UI</a><nav aria-label="${escape(labels[locale].reference)}">${languageLinks}</nav></header><main><a href="${directory}">${escape(labels[locale].directory)}</a><h1>${escape(title)}</h1><p class="lead">${escape(description)}</p>${body}<p><a href="${root}?lang=${locale}#/${id || 'overview'}">${escape(labels[locale].preview)}</a></p></main><footer>Oddmash UI · v${escape(packageVersion)}</footer></body></html>`;
};

export const createReferencePages = () => {
  const files: Record<string, string> = {};
  const urls = [site];
  for (const locale of locales) {
    const t = (value: string) => translate(locale, value);
    const components = pages.filter(page => componentIds.includes(page.id as ComponentId));
    const directory = components.map(page => `<li><a href="./${page.id}/">${escape(t(page.title))}</a><p>${escape(t(page.description))}</p></li>`).join('');
    const install = `<h2>${escape(labels[locale].installation)}</h2><pre><code>npm install @oddmash/ui</code></pre><pre><code>import '@oddmash/ui/styles.css';</code></pre>`;
    files[route(locale) + 'index.html'] = documentPage(locale, labels[locale].reference, t('React components and design tokens for Oddmash developer tools.'), '', install + `<h2>${escape(t('Components'))}</h2><ul>${directory}</ul>`);
    urls.push(canonical(locale));
    for (const page of components) {
      const detail = details[page.id as ComponentId];
      const props = detail.props.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('');
      const code = detail.code ? `<pre><code>${escape(detail.code)}</code></pre>` : '';
      const body = `<h2>${escape(t('Usage'))}</h2><p>${escape(t(detail.usage))}</p><h2>${escape(t('Accessibility'))}</h2><p>${escape(t(detail.accessibility))}</p><table><thead><tr><th scope="col">${escape(labels[locale].property)}</th><th scope="col">${escape(t('Type'))}</th><th scope="col">${escape(t('Default'))}</th></tr></thead><tbody>${props}</tbody></table>${code}`;
      files[route(locale, page.id) + 'index.html'] = documentPage(locale, t(page.title), t(page.description), page.id, body);
      urls.push(canonical(locale, page.id));
    }
  }
  files['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escape(url)}</loc></url>`).join('')}</urlset>`;
  files['reference/style.css'] = `:root{${Object.entries(referenceTokens).map(([key,value])=>`--reference-${key}:${value}`).join(';')}}html{color-scheme:light dark;font-family:system-ui,sans-serif}body{max-inline-size:var(--reference-measure);margin:0 auto;padding:var(--reference-spaceLarge) var(--reference-space);line-height:1.65}header,nav{display:flex;flex-wrap:wrap;gap:var(--reference-space);align-items:center}header{justify-content:space-between;border-block-end:var(--reference-borderWidth) solid GrayText;padding-block-end:var(--reference-space)}main{padding-block:var(--reference-space)}.lead{color:GrayText}a{color:LinkText;text-underline-offset:var(--reference-underlineOffset)}li p{margin-block-start:0}pre{overflow:auto;padding:var(--reference-space);border:var(--reference-borderWidth) solid GrayText;border-radius:var(--reference-radius)}table{border-collapse:collapse;inline-size:100%;overflow-wrap:anywhere}th,td{text-align:start;vertical-align:top;border-block-end:var(--reference-borderWidth) solid GrayText;padding:var(--reference-spaceSmall)}footer{border-block-start:var(--reference-borderWidth) solid GrayText;padding-block-start:var(--reference-space)}h1,h2{line-height:1.3}a:focus-visible{outline:var(--reference-focusWidth) solid Highlight;outline-offset:var(--reference-focusOffset)}`;
  return files;
};

export const resolveReferenceAsset = (pathname: string) => {
  const path = pathname.replace(/^\//, '');
  const file = path.endsWith('/') ? path + 'index.html' : path;
  const files = createReferencePages();
  if (!Object.hasOwn(files, file)) return undefined;
  const type = file.endsWith('.css') ? 'text/css' : file.endsWith('.xml') ? 'application/xml' : 'text/html';
  return { body: files[file], type };
};
