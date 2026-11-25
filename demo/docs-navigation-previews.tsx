import { useState } from 'react';
import { Button, DocsNavigation, LocalePicker, ScrollHeader, SiteHeaderInner, TableOfContents } from '@oddmash/ui';

type Translate = (text: string) => string;

const DocsNavigationPreview = ({ t }: { t: Translate }) => {
  const [current, setCurrent] = useState('guide');
  return <DocsNavigation
    aria-label={t('Documentation navigation example')}
    mobileLabel={t('Browse documentation')}
    currentId={current}
    groups={[{ id: 'start', label: t('Start here'), items: [
      { id: 'guide', label: t('Usage guide'), href: '/guide' },
      { id: 'api', label: t('API reference'), href: '/api' },
    ] }]}
    onNavigate={(item, event) => {
      event.preventDefault();
      setCurrent(item.id);
    }}
  />;
};

const ContentsPreview = ({ t }: { t: Translate }) => (
  <div style={{ width: '100%' }}>
    <TableOfContents
      label={t('On this page')}
      mobileLabel={t('Browse sections')}
      contentId="om-toc-demo-article"
      headings={[
        { id: 'om-toc-demo-setup', label: t('Installation'), level: 2 },
        { id: 'om-toc-demo-usage', label: t('Usage guide'), level: 3 },
      ]}
      onNavigate={(heading, event) => {
        event.preventDefault();
        document.getElementById(heading.id)?.scrollIntoView({ block: 'start' });
      }}
    />
    <article id="om-toc-demo-article">
      <h3 id="om-toc-demo-setup" tabIndex={-1} style={{ scrollMarginTop: 96 }}>{t('Installation')}</h3>
      <p style={{ minHeight: '5rem' }}>{t('Install the package.')}</p>
      <h3 id="om-toc-demo-usage" tabIndex={-1} style={{ scrollMarginTop: 96 }}>{t('Usage guide')}</h3>
      <p>{t('Learn how to use the library.')}</p>
    </article>
  </div>
);

const ScrollHeaderPreview = ({ t }: { t: Translate }) => {
  const [locked, setLocked] = useState(false);
  return <div style={{ width: '100%', minHeight: '12rem' }}>
    <ScrollHeader locked={locked}>
      <SiteHeaderInner>
        <strong>Oddmash</strong>
        <Button variant="ghost" size="sm" aria-pressed={locked} onClick={() => setLocked(value => !value)}>
          {t('Keep header visible')}
        </Button>
      </SiteHeaderInner>
    </ScrollHeader>
    <p>{t('Scroll down to hide the header and slightly upward to reveal it.')}</p>
  </div>;
};

const LocalePickerPreview = ({ t }: { t: Translate }) => {
  const [locale, setLocale] = useState('en');
  return <LocalePicker label={t('Language')} value={locale} onValueChange={setLocale} options={[
    { value: 'en', lang: 'en', label: 'English', href: '/en/docs' },
    { value: 'ko', lang: 'ko', label: '한국어', href: '/ko/docs' },
    { value: 'ja', lang: 'ja', label: '日本語', href: '/ja/docs' },
    { value: 'zh-CN', lang: 'zh-CN', label: '简体中文', href: '/zh-CN/docs' },
  ]} />;
};

export const getDocumentationNavigationPreviews = (t: Translate) => ({
  'docs-navigation': <DocsNavigationPreview t={t} />,
  'table-of-contents': <ContentsPreview t={t} />,
  'scroll-header': <ScrollHeaderPreview t={t} />,
  'locale-picker': <LocalePickerPreview t={t} />,
});
