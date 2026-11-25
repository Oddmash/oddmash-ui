export const documentationNavigationComponents = {
  'docs-navigation': {
    title: 'Docs Navigation',
    group: 'Documentation',
    description: 'Group documentation links and indicate the current destination.',
    usage: 'Supply grouped destinations and an optional mobile label. Routing remains consumer-owned.',
    accessibility: 'Name the landmark, keep native links, and preserve the current page and mobile expanded state.',
    props: [['groups', 'readonly DocsNavigationGroup[]', 'Required'], ['currentId', 'string', 'None'], ['mobileLabel', 'string', 'None'], ['defaultMobileOpen', 'boolean', 'false'], ['onNavigate', 'function', 'Native navigation']],
    exports: 'DocsNavigation',
    reactImports: ['useState'],
    code: `const Example = () => {
  const [current, setCurrent] = useState('guide');
  return (
    <DocsNavigation aria-label="Documentation navigation example"
      mobileLabel="Browse documentation" currentId={current}
      groups={[{ id: 'start', label: 'Start here', items: [
        { id: 'guide', label: 'Usage guide', href: '/guide' },
        { id: 'api', label: 'API reference', href: '/api' }
      ] }]}
      onNavigate={(item, event) => {
        event.preventDefault();
        setCurrent(item.id);
      }}
    />
  );
};`,
  },
  'table-of-contents': {
    title: 'Table of Contents',
    group: 'Documentation',
    description: 'Link to headings and track the visible section.',
    usage: 'Supply heading IDs and an optional content ID or controlled active ID. Use native fragment links or handle navigation in the consumer.',
    accessibility: 'Preserve section IDs, indicate the current location and allow mobile users to return focus to the disclosure or heading.',
    props: [['headings', 'readonly TocHeading[]', 'Required'], ['label', 'string', 'Required'], ['contentId', 'string', 'Document body'], ['offset', 'number', '0'], ['activeId', 'string | null', 'Observed'], ['mobileLabel', 'string', 'None'], ['onNavigate', 'function', 'Native anchor']],
    exports: 'TableOfContents',
    code: `<>
  <TableOfContents label="On this page" mobileLabel="Browse sections"
    contentId="om-toc-demo-article"
    headings={[
      { id: 'om-toc-demo-setup', label: 'Installation', level: 2 },
      { id: 'om-toc-demo-usage', label: 'Usage guide', level: 3 }
    ]}
    onNavigate={(heading, event) => {
      event.preventDefault();
      document.getElementById(heading.id)?.scrollIntoView({ block: 'start' });
    }}
  />
  <article id="om-toc-demo-article">
    <h3 id="om-toc-demo-setup" tabIndex={-1}>Installation</h3>
    <p>Install the package.</p>
    <h3 id="om-toc-demo-usage" tabIndex={-1}>Usage guide</h3>
    <p>Learn how to use the library.</p>
  </article>
</>`,
  },
  'scroll-header': {
    title: 'Scroll Header',
    group: 'Documentation',
    description: 'Opt into a sticky header that responds to scroll direction.',
    usage: 'Use ScrollHeader or attach observeScrollHeader to static markup. Keep branding and layout local to the product.',
    accessibility: 'The header remains visible for keyboard focus, open controls, explicit locks and reduced motion.',
    props: [['enabled', 'boolean', 'true'], ['media', 'string', 'All viewports'], ['locked', 'boolean', 'false'], ['hideThreshold', 'number', '24'], ['revealThreshold', 'number', '8'], ['topOffset', 'number', '8']],
    exports: 'ScrollHeader, SiteHeaderInner, Button',
    reactImports: ['useState'],
    code: `const Example = () => {
  const [locked, setLocked] = useState(false);
  return (
    <ScrollHeader locked={locked}>
      <SiteHeaderInner>
        <strong>Oddmash</strong>
        <Button variant="ghost" size="sm" aria-pressed={locked}
          onClick={() => setLocked(value => !value)}>
          Keep header visible
        </Button>
      </SiteHeaderInner>
    </ScrollHeader>
  );
};`,
  },
  'locale-picker': {
    title: 'Locale Picker',
    group: 'Documentation',
    description: 'Choose a language with a native link fallback.',
    usage: 'Supply the selected value, self-language labels and consumer-generated alternate URLs. Optionally handle navigation with onValueChange.',
    accessibility: 'Localize the control label, set option languages, and retain native destinations before hydration.',
    props: [['label', 'string', 'Required'], ['options', 'readonly LocalePickerOption[]', 'Required'], ['value', 'string', 'Required'], ['onValueChange', 'function', 'Navigate to href'], ['selectProps', 'SelectProps subset', 'None']],
    exports: 'LocalePicker',
    reactImports: ['useState'],
    code: `const Example = () => {
  const [locale, setLocale] = useState('en');
  return <LocalePicker label="Language" value={locale}
    onValueChange={setLocale}
    options={[
      { value: 'en', lang: 'en', label: 'English', href: '/en/docs' },
      { value: 'ko', lang: 'ko', label: '한국어', href: '/ko/docs' },
      { value: 'ja', lang: 'ja', label: '日本語', href: '/ja/docs' },
      { value: 'zh-CN', lang: 'zh-CN', label: '简体中文', href: '/zh-CN/docs' }
    ]}
  />;
};`,
  },
};
