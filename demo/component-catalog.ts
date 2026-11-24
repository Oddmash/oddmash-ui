export const extendedComponents = {
  slider: {
    title: 'Slider', group: 'Forms', description: 'Adjust a numeric value.',
    usage: 'Use a visible label and native range limits.', accessibility: 'Arrow keys adjust the value.',
    props: [['min / max / step', 'number', 'Native defaults']], exports: 'Slider',
    code: '<label>Width <Slider min={100} max={600} defaultValue={320} /></label>',
  },
  'command-palette': {
    title: 'Command Palette', group: 'Navigation', description: 'Find and execute actions.',
    usage: 'Open with an explicit trigger.', accessibility: 'Use arrow keys, Enter and Escape.',
    props: [['items', 'readonly CommandPaletteItem[]', 'Required']], exports: 'Button, CommandPalette',
    code: '<CommandPalette trigger={<Button>Commands</Button>} title="Commands" description="Choose an action" searchLabel="Search commands" emptyLabel="No commands found" items={[{ id: "save", label: "Save project", onSelect: () => {} }]} />',
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
      'Mount Toasts within ToastViewport before the action runs to stack notifications.',
    accessibility:
      'Use neutral for confirmations and danger for urgent errors. Keep the dismiss button available and restore focus when it is used.',
    props: [
      ['open', 'boolean', 'Required'],
      ['title', 'string', 'Required'],
      ['onDismiss', '() => void', 'Required'],
      ['dismissLabel', 'string', 'Dismiss notification'],
      ['tone', 'neutral | danger', 'neutral'],
    ],
    exports: 'Button, Toast, ToastViewport',
    code: `import { useRef, useState } from 'react';

export const SaveNotice = () => {
  const [open, setOpen] = useState([false, false, false]);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button ref={trigger} disabled={open.every(Boolean)} onClick={() => setOpen(current => current.map((value, index) => value || index === current.indexOf(false)))}>Show toast</Button>
      <ToastViewport>
        {open.map((visible, index) => (
          <Toast key={index} open={visible} title="Project saved" onDismiss={() => {
            setOpen(current => current.map((value, position) => position === index ? false : value));
            requestAnimationFrame(() => trigger.current?.focus());
          }}>Your changes are ready.</Toast>
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
