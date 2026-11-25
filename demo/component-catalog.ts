import { documentationNavigationComponents } from './docs-navigation-catalog';
import { notificationComponents } from './notification-catalog';

export const extendedComponents = {
  ...documentationNavigationComponents,
  ...notificationComponents,
  "link-controls": {
    "title": "Link Controls",
    "group": "Documentation",
    "description": "Style links, named icon controls and keyboard shortcuts without changing native behavior.",
    "usage": "Use ButtonLink for navigation, IconButton for an action, and IconLink or PlatformLink for a named icon destination. Supply href and localization yourself.",
    "accessibility": "Name each icon-only control, hide decorative icons, and use Kbd for shortcuts. Platform hover respects reduced motion.",
    "props": [
      [
        "href (links)",
        "string",
        "Required"
      ],
      [
        "aria-label / aria-labelledby (icon controls)",
        "string",
        "Required"
      ],
      [
        "platform",
        "github | npm",
        "Required"
      ],
      [
        "variant",
        "primary | secondary | ghost",
        "Native defaults"
      ],
      [
        "size",
        "sm | md",
        "md"
      ]
    ],
    "exports": "ButtonLink, IconButton, IconLink, PlatformLink, PlatformLinks, Kbd",
    "code": "<>\n  <ButtonLink href=\"#/link-controls\">Read guide</ButtonLink>\n  <IconButton aria-label=\"Open search example\"><span aria-hidden=\"true\">⌕</span></IconButton>\n  <IconLink href=\"#/link-controls\" aria-label=\"Open reference example\"><span aria-hidden=\"true\">↗</span></IconLink>\n  <PlatformLinks role=\"group\" aria-label=\"Platform links\">\n    <PlatformLink platform=\"github\" href=\"#/link-controls\" aria-label=\"GitHub example\" />\n    <PlatformLink platform=\"npm\" href=\"#/link-controls\" aria-label=\"npm example\" />\n  </PlatformLinks>\n  <Kbd>Ctrl K</Kbd>\n</>"
  },
  'link-card': {
    title: 'Link Card',
    group: 'Documentation',
    description: 'Present a document or destination as a single link.',
    usage: 'Use LinkCard for a single destination. The same om-link-card class works in static HTML, and om-link-card-arrow is optional.',
    accessibility: 'Keep the destination clear, avoid nested controls and hide decorative arrows. Focus remains visible and the fill respects reduced motion.',
    props: [['href', 'string', 'Native anchor'], ['className', 'string', 'None']],
    exports: 'LinkCard',
    code: `<LinkCard href="#/link-card">
  <strong>Usage guide</strong> <span className="om-link-card-arrow" aria-hidden="true">→</span>
  <p>Learn how to use the library.</p>
</LinkCard>`,
  },
  'code-block': {
    title: 'Code Block',
    group: 'Documentation',
    description: 'Display readable code with an optional caption and action.',
    usage: 'Compose CodeBlock with CodeBlockHeader, CodeBlockCaption and CodeBlockContent. CodeBlockCopy is a native button; the consumer owns copying and feedback.',
    accessibility: 'Label copy actions and announce the result. A named, focusable code region lets keyboard users scroll long lines. Preserve whitespace and syntax markup.',
    props: [['children', 'ReactNode', 'None'], ['tabIndex (Content)', 'number', 'Native default'], ['onClick (Copy)', 'MouseEventHandler', 'None'], ['type (Copy)', 'button | submit | reset', 'button']],
    exports: 'CodeBlock, CodeBlockHeader, CodeBlockCaption, CodeBlockContent, CodeBlockCopy',
    reactImports: ['useState'],
    code: `const Example = () => {
  const code = 'pnpm add @oddmash/ui';
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Copied');
    } catch {
      setStatus('Select the code to copy');
    }
  };

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockCaption>Terminal</CodeBlockCaption>
        <CodeBlockCopy onClick={copy}>Copy code</CodeBlockCopy>
      </CodeBlockHeader>
      <CodeBlockContent tabIndex={0} role="region" aria-label="Terminal code">
        <code>{code}</code>
      </CodeBlockContent>
      <span role="status">{status}</span>
    </CodeBlock>
  );
};`,
  },
  'site-layout': {
    title: 'Site Layout',
    group: 'Documentation',
    description: 'Compose neutral headers, footers and navigation landmarks.',
    usage: 'Combine SiteHeader or SiteFooter with their Inner wrapper and SiteNav. Branding, responsive navigation choices and sticky behavior stay with the product.',
    accessibility: 'Keep native header, footer and nav semantics. Name each navigation landmark when there is more than one, and mark the current link with aria-current.',
    props: [['children', 'ReactNode', 'None'], ['aria-label (SiteNav)', 'string', 'None'], ['className', 'string', 'None']],
    exports: 'SiteHeader, SiteHeaderInner, SiteFooter, SiteFooterInner, SiteNav',
    code: `<>
  <SiteHeader>
    <SiteHeaderInner>
      <strong>Oddmash</strong>
      <SiteNav aria-label="Header navigation example">
        <a href="#/site-layout" aria-current="page">Docs</a>
        <a href="#/site-layout">Examples</a>
      </SiteNav>
    </SiteHeaderInner>
  </SiteHeader>
  <SiteFooter>
    <SiteFooterInner>
      <span>Open source</span>
      <SiteNav aria-label="Footer navigation example">
        <a href="#/site-layout">Docs</a>
      </SiteNav>
    </SiteFooterInner>
  </SiteFooter>
</>`,
  },
  prose: {
    title: 'Prose',
    group: 'Documentation',
    description: 'Style rendered Markdown without choosing a parser.',
    usage: 'Wrap trusted rendered article markup with Prose or the om-prose class. Use ProseScroll around wide tables. The Markdown renderer remains a consumer choice.',
    accessibility: 'Preserve native headings, lists, tables and links. Use the document language and label focusable scroll regions. Code preserves whitespace.',
    props: [['children', 'ReactNode', 'None'], ['lang', 'string', 'Inherited'], ['className', 'string', 'None']],
    exports: 'Prose, ProseScroll',
    code: `<Prose>
  <h3>Usage guide</h3>
  <p>Learn how to use the library.</p>
  <ul><li>Install the package.</li></ul>
  <pre tabIndex={0} role="region" aria-label="Terminal code"><code>pnpm add @oddmash/ui</code></pre>
  <ProseScroll tabIndex={0} role="region" aria-label="Example options table">
    <table>
      <thead><tr><th scope="col">Name</th><th scope="col">Type</th></tr></thead>
      <tbody><tr><td>href</td><td>string</td></tr></tbody>
    </table>
  </ProseScroll>
</Prose>`,
  },
  slider: {
    title: 'Slider', group: 'Forms', description: 'Adjust a numeric value.',
    usage: 'Use a visible label and native range limits.', accessibility: 'Arrow keys adjust the value.',
    props: [['min / max / step', 'number', 'Native defaults']], exports: 'Slider',
    code: '<label>Width <Slider min={100} max={600} defaultValue={320} /></label>',
  },
  'toggle-group': {
    title: 'Toggle Group',
    group: 'Forms',
    description: 'Group toggle buttons for related settings.',
    usage: 'Use single mode for a view choice and multiple mode for independent options. Empty selection is null in single mode and [] in multiple mode.',
    accessibility: 'Name the group and icon-only buttons. Tab enters the group once. Arrow keys wrap and skip disabled buttons, Home and End move to the edges, and Space or Enter toggles the focused button.',
    props: [
      ['type', 'single | multiple', 'Required'],
      ['value / defaultValue (group)', 'string | null (single), readonly string[] (multiple)', 'null / []'],
      ['onValueChange', '(value: string | null) => void (single), (value: string[]) => void (multiple)', 'None'],
      ['orientation', 'horizontal | vertical', 'horizontal'],
      ['disabled (group or item)', 'boolean', 'false'],
      ['value (item)', 'string', 'Required'],
    ],
    exports: 'ToggleGroup, ToggleGroupItem',
    reactImports: ['useState'],
    code: `const Example = () => {
  const [view, setView] = useState<string | null>('grid');
  return (
    <>
      <ToggleGroup aria-label="View mode" type="single" value={view} onValueChange={setView}>
        <ToggleGroupItem value="grid">Grid view</ToggleGroupItem>
        <ToggleGroupItem value="compact" disabled>Compact view</ToggleGroupItem>
        <ToggleGroupItem value="list">List view</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup aria-label="Text formatting" type="multiple" defaultValue={['bold']}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
};`,
  },
  'command-palette': {
    title: 'Command Palette', group: 'Navigation', description: 'Find and execute actions.',
    usage: 'Open with an explicit trigger or an opt-in Mod+K shortcut. Supply descriptive grouped results and a consumer-owned filter when needed.', accessibility: 'Use arrow keys, Enter and Escape. Provide distinct result labels and descriptions.',
    props: [['items', 'readonly CommandPaletteItem[]', 'Required'], ['open / defaultOpen', 'boolean', 'false'], ['onOpenChange', '(open: boolean) => void', 'None'], ['shortcut', 'boolean', 'false'], ['dismissLabel', 'string', 'None'], ['maxResults', 'number', 'All'], ['filter', '(item, query) => boolean', 'Default matching']], exports: 'Button, CommandPalette',
    code: `<CommandPalette
  trigger={<Button>Commands</Button>}
  title="Commands"
  description="Choose an action"
  searchLabel="Search commands"
  emptyLabel="No commands found"
  dismissLabel="Close commands"
  shortcut
  items={[
    { id: 'save', label: 'Save project', group: 'Project', description: 'Save current changes', onSelect: () => {} },
    { id: 'guide', label: 'Usage guide', group: 'Documentation', onSelect: () => {} },
  ]}
/>`,
  },
  textarea: {
    title: 'Textarea',
    group: 'Forms',
    description: 'Collect multiline notes and descriptions.',
    usage: 'Use rows to show the expected amount of text.',
    accessibility:
      'Keep a persistent label and associate any hint or error with aria-describedby.',
    props: [['rows', 'number', '2']],
    exports: 'Textarea',
    code: '<label>Release notes\n  <Textarea rows={3} placeholder="Describe what changed" />\n</label>',
  },
  select: {
    title: 'Select',
    group: 'Forms',
    description: 'Choose from a compact list of options.',
    usage:
      'Use Select for a styled single choice. Use the HTML select element for native validation, optgroups, or multiple selection.',
    accessibility:
      'Provide a visible label. Use arrow keys to move, type to search by label, Enter to select, and Escape to dismiss.',
    props: [
      ['options', 'readonly SelectOption[]', 'Required'],
      ['value / defaultValue', 'string', 'None'],
      ['onValueChange', '(value: string) => void', 'None'],
      ['name', 'string', 'None'],
    ],
    exports: 'Select',
    code: `<div>
  <label htmlFor="environment">Environment</label>
  <Select
    id="environment"
    name="environment"
    defaultValue="staging"
    options={[
      { value: 'staging', label: 'Staging' },
      { value: 'preview', label: 'Preview', disabled: true },
      { value: 'production', label: 'Production' },
    ]}
  />
</div>`,
  },
  checkbox: {
    title: 'Checkbox',
    group: 'Forms',
    description: 'Enable options independently.',
    usage:
      'Use a checkbox when options can be selected independently or submitted together.',
    accessibility:
      'Wrap the checkbox in a label or link the label with htmlFor.',
    props: [['defaultChecked', 'boolean', 'false']],
    exports: 'Checkbox',
    code: '<label>\n  <Checkbox name="events" value="keyboard" defaultChecked /> Capture keyboard events\n</label>',
  },
  radio: {
    title: 'Radio',
    group: 'Forms',
    description: 'Choose one option from a group.',
    usage: 'Give mutually exclusive options the same name and distinct values.',
    accessibility:
      'Use a fieldset and legend to announce the group. Arrow keys select within the group.',
    props: [['name', 'string', 'None']],
    exports: 'Field, Radio',
    code: '<Field legend="Event order">\n  <div>\n    <label><Radio name="order" value="newest" defaultChecked /> Newest first</label>\n    <label><Radio name="order" value="oldest" /> Oldest first</label>\n  </div>\n</Field>',
  },
  switch: {
    title: 'Switch',
    group: 'Forms',
    description: 'Toggle a setting on or off.',
    usage: 'Use a switch for settings that take effect immediately.',
    accessibility:
      'Keep the accessible name stable as the value changes. Space toggles the native control.',
    props: [['checked', 'boolean', 'None']],
    exports: 'Switch',
    code: '<label>\n  <Switch defaultChecked /> Capture interactions\n</label>',
  },
  field: {
    title: 'Field',
    group: 'Forms',
    description: 'Group related controls with a shared label.',
    usage:
      'Use a fieldset for related controls. Supply an individual label for each control.',
    accessibility:
      'The legend names the group. Disabled fieldsets disable their descendant form controls.',
    props: [['legend', 'ReactNode', 'Required']],
    exports: 'Field, Checkbox',
    code: '<Field legend="Events to capture">\n  <div>\n    <label><Checkbox name="events" value="focus" defaultChecked /> Focus</label>\n    <label><Checkbox name="events" value="pointer" /> Pointer</label>\n  </div>\n</Field>',
  },
  alert: {
    title: 'Alert',
    group: 'Feedback',
    description: 'Require acknowledgment of an important message.',
    usage: 'Use AlertDialog for acknowledgment and Alert for inline status.',
    accessibility:
      'The modal traps focus and restores it on confirmation. Inline alerts can use role="alert".',
    props: [['open', 'boolean', 'Required'], ['title', 'string', 'Required'], ['onConfirm', '() => void', 'Required'], ['confirmLabel', 'string', 'OK']],
    exports: 'AlertDialog, Alert, Button',
    code: `import { useState } from 'react';

export const RecordingNotice = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Show alert</Button>
      <AlertDialog open={visible} title="Recording stopped" onConfirm={() => setVisible(false)}>
        Reconnect the inspector to continue capturing events.
      </AlertDialog>
    </>
  );
};`,
  },
  toast: {
    title: 'Toast',
    group: 'Feedback',
    description: 'Confirm a completed action in a dismissible notification.',
    usage:
      'Mount Toasts within ToastViewport before the action runs to stack notifications. Keep newer items last; hover or focus expands the stack.',
    accessibility:
      'Use neutral, success, info, warning or loading for polite updates and danger or error for urgent errors. Keep the dismiss button available and restore focus to the next notification or trigger. Custom icons are decorative; use null to hide the icon.',
    props: [
      ['open', 'boolean', 'Required'],
      ['title', 'string', 'Required'],
      ['onDismiss', '() => void', 'Required'],
      ['dismissLabel', 'string', 'Dismiss notification'],
      ['tone', 'neutral | success | info | warning | danger | error | loading', 'neutral'],
      ['icon', 'ReactNode', 'Tone icon; null hides it'],
    ],
    exports: 'Button, Select, Toast, ToastViewport',
    code: `import { useRef, useState } from 'react';

const toastMessages = {
  neutral: { label: 'Notice', title: 'Project updated', description: 'The project has a new update.' },
  loading: { label: 'Loading', title: 'Saving project', description: 'Your changes are being synchronized.' },
  success: { label: 'Success', title: 'Project saved', description: 'Your changes are ready.' },
  info: { label: 'Information', title: 'Export ready', description: 'Your export is available in the project history.' },
  warning: { label: 'Warning', title: 'Connection interrupted', description: 'Your changes are preserved locally. Reconnect before continuing.' },
  error: { label: 'Error', title: 'Save failed', description: 'Your changes could not be synchronized. Check your network connection and retry when you are ready.' },
} as const;

type PreviewTone = keyof typeof toastMessages;

export const SaveNotice = () => {
  const trigger = useRef<HTMLButtonElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState<PreviewTone>('success');
  const [notices, setNotices] = useState([0, 1, 2].map(id => ({ id, open: false, tone: 'success' as PreviewTone })));
  const options = (Object.keys(toastMessages) as PreviewTone[]).map(value => ({ value, label: toastMessages[value].label }));
  const show = () => setNotices(current => {
    const next = current.find(notice => !notice.open);
    return next ? [...current.filter(notice => notice.id !== next.id), { ...next, open: true, tone }] : current;
  });
  const dismiss = (id: number) => {
    const visible = notices.filter(notice => notice.open);
    const index = visible.findIndex(notice => notice.id === id);
    const next = visible[index + 1] ?? visible[index - 1];
    setNotices(current => current.map(notice => notice.id === id ? { ...notice, open: false } : notice));
    requestAnimationFrame(() => {
      const button = next && viewport.current?.querySelector<HTMLButtonElement>('[data-toast-id="' + next.id + '"][data-state="open"] button');
      (button || trigger.current)?.focus();
    });
  };
  return (
    <>
      <Select aria-label={'Notification tone'} options={options} value={tone} onValueChange={value => {
        if (Object.hasOwn(toastMessages, value)) setTone(value as PreviewTone);
      }} />
      <Button ref={trigger} variant="secondary" disabled={notices.every(notice => notice.open)} onClick={show}>
        {'Show toast'}
      </Button>
      <ToastViewport ref={viewport}>
        {notices.map(notice => (
          <Toast key={notice.id} data-toast-id={notice.id} title={toastMessages[notice.tone].title} open={notice.open} tone={notice.tone}
            dismissLabel={'Dismiss notification'} onDismiss={() => dismiss(notice.id)}>
            {toastMessages[notice.tone].description}
          </Toast>
        ))}
      </ToastViewport>
    </>
  );
};`,
  },
  progress: {
    title: 'Progress',
    group: 'Feedback',
    description: 'Show completion of an ongoing task.',
    usage:
      'Provide value and max for known progress. Omit value when completion cannot be estimated.',
    accessibility:
      'Use an accessible name. Show the percentage in visible text when progress is determinate.',
    props: [['value', 'number', 'None']],
    exports: 'Progress',
    code: '<label>Exporting events (65%)\n  <Progress value={65} max={100} />\n</label>',
  },
  spinner: {
    title: 'Spinner',
    group: 'Feedback',
    description: 'Show that an action is running.',
    usage:
      'Use a spinner alongside the name of the task, or supply a label for a standalone status.',
    accessibility:
      'Provide either visible status text or the spinner label. Animation stops when reduced motion is enabled.',
    props: [['label', 'string', 'None']],
    exports: 'Spinner',
    code: '<div role="status">\n  <Spinner /> Connecting to inspector\n</div>',
  },
  skeleton: {
    title: 'Skeleton',
    group: 'Feedback',
    description: 'Reserve space while content loads.',
    usage:
      'Match the expected layout so loaded content does not shift the surrounding interface.',
    accessibility:
      'Skeleton shapes are decorative. Announce loading separately if the user needs feedback.',
    props: [['style', 'CSSProperties', 'None']],
    exports: 'Skeleton',
    code: "<div role=\"status\">\n  <span>Loading event details</span>\n  <Skeleton style={{ width: '60%' }} />\n  <Skeleton />\n  <Skeleton style={{ width: '80%' }} />\n</div>",
  },
  'empty-state': {
    title: 'EmptyState',
    group: 'Feedback',
    description: 'Explain why a view has no content.',
    usage:
      'Name what is missing and include one next action when there is something the user can do.',
    accessibility:
      'Use a heading appropriate to the page hierarchy and a descriptive action label.',
    props: [['children', 'ReactNode', 'None']],
    exports: 'EmptyState, Button',
    code: '<EmptyState>\n  <strong>No events captured</strong>\n  <p>Interact with the page to start filling the timeline.</p>\n  <Button variant="secondary" onClick={() => location.hash = \'/interaction-pattern\'}>\n    Open Interaction Lab\n  </Button>\n</EmptyState>',
  },
  accordion: {
    title: 'Accordion',
    group: 'Navigation',
    description: 'Reveal optional details inline.',
    usage:
      'Use one component per disclosure. Keep the summary short and meaningful.',
    accessibility:
      'The summary is keyboard operable natively. Keep interactive elements in the panel body.',
    props: [['summary', 'ReactNode', 'Required']],
    exports: 'Accordion',
    code: '<Accordion summary="Keyboard shortcuts">\n  Press <kbd>Tab</kbd> to move to the next control and <kbd>Enter</kbd> to activate it.\n</Accordion>',
  },
  breadcrumbs: {
    title: 'Breadcrumbs',
    group: 'Navigation',
    description: 'Show the current page within a hierarchy.',
    usage:
      'Render list items with links to parent pages. Use aria-current on the current item.',
    accessibility:
      'Give the landmark a distinct accessible name when the page has multiple navigation regions.',
    props: [['aria-label', 'string', 'Breadcrumb']],
    exports: 'Breadcrumbs',
    code: '<Breadcrumbs aria-label="Example breadcrumb">\n  <li><a href="#/overview">Overview</a></li>\n  <li><a href="#/colors">Foundations</a></li>\n  <li><span aria-current="page">Colors</span></li>\n</Breadcrumbs>',
  },
  pagination: {
    title: 'Pagination',
    group: 'Navigation',
    description: 'Move between pages of results.',
    usage:
      'Use links when each page has a URL. Set aria-current="page" on the active item.',
    accessibility:
      'Label page links and omit or disable unavailable previous and next actions.',
    props: [['aria-label', 'string', 'Pagination']],
    exports: 'Pagination',
    reactImports: ['useState'],
    code: `const Example = () => {
  const [currentPage, setCurrentPage] = useState(2);
  return (
    <Pagination aria-label="Example pagination">
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          aria-label={\`Page \${page}\`}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </Pagination>
  );
};`,
  },
  avatar: {
    title: 'Avatar',
    group: 'Data display',
    description: 'Identify people with an image or initials.',
    usage:
      'Pass initials as children. They stay visible until the image loads and serve as a fallback.',
    accessibility:
      'Supply label when the avatar carries identity. Omit it when adjacent text already names the person.',
    props: [['src', 'string', 'None']],
    exports: 'Avatar',
    code: '<div>\n  <Avatar label="Sangmin Park">SP</Avatar>\n  <Avatar label="Design team">DT</Avatar>\n</div>',
  },
  separator: {
    title: 'Separator',
    group: 'Data display',
    description: 'Mark a thematic break in a view.',
    usage: 'Use a separator between related sections with different purposes.',
    accessibility:
      'Use an hr for meaningful separation. Set aria-hidden for a purely decorative line.',
    props: [['ref', 'HTMLHRElement', 'None']],
    exports: 'Separator',
    code: '<div>\n  <strong>Recording settings</strong>\n  <Separator />\n  <span>Export options</span>\n</div>',
  },
  table: {
    title: 'Table',
    group: 'Data display',
    description: 'Compare structured data by row and column.',
    usage:
      'Use native table sections. Wrap wide tables in a scrollable region when needed.',
    accessibility:
      'Give the table a caption and use scope on its column or row headers.',
    props: [['children', 'ReactNode', 'None']],
    exports: 'Table',
    code: '<Table>\n  <caption>Recorded events</caption>\n  <thead><tr><th scope="col">Event</th><th scope="col">Target</th></tr></thead>\n  <tbody>\n    <tr><td>focusin</td><td>Project name</td></tr>\n    <tr><td>click</td><td>Save project</td></tr>\n  </tbody>\n</Table>',
  },
};

export type ExtendedComponentId = keyof typeof extendedComponents;
export const extendedComponentIds = Object.keys(
  extendedComponents,
) as ExtendedComponentId[];
