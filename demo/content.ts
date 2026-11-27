import { packageVersion } from './package-links';
import {
  extendedComponents,
  extendedComponentIds,
  type ExtendedComponentId,
} from './component-catalog';

export const pages = [
  {
    id: 'overview',
    title: 'Overview',
    group: 'Start here',
    description: 'The shared design system for Oddmash developer tools.',
  },
  {
    id: 'installation',
    title: 'Installation',
    group: 'Start here',
    description: 'Install the package and load its styles.',
  },
  {
    id: 'colors',
    title: 'Colors',
    group: 'Foundations',
    description: 'Neutral surfaces with distinct focus and error states.',
  },
  {
    id: 'typography',
    title: 'Typography',
    group: 'Foundations',
    description: 'Font families, sizes, and line heights.',
  },
  {
    id: 'tokens',
    title: 'Tokens',
    group: 'Foundations',
    description: 'Browse the design tokens and their CSS variables.',
  },
  {
    id: 'button',
    title: 'Button',
    group: 'Components',
    description: 'Trigger an action or submit a form.',
  },
  {
    id: 'input',
    title: 'Input',
    group: 'Components',
    description: 'Collect a single line of text.',
  },
  {
    id: 'card',
    title: 'Card',
    group: 'Components',
    description: 'Group related content and controls.',
  },
  {
    id: 'badge',
    title: 'Badge',
    group: 'Components',
    description: 'Label a status or category.',
  },
  {
    id: 'tabs',
    title: 'Tabs',
    group: 'Components',
    description: 'Switch between panels on the same page.',
  },
  {
    id: 'dialog',
    title: 'Dialog',
    group: 'Components',
    description: 'Open a modal for editing or confirmation.',
  },
  { id: 'tooltip', title: 'Tooltip', group: 'Components', description: 'Reveal a short description on hover or focus.' },
  ...extendedComponentIds.map((id) => {
    const { title, group, description } = extendedComponents[id];
    return { id, title, group, description };
  }),
  {
    id: 'interaction-pattern',
    title: 'Interaction monitor',
    group: 'Patterns',
    description:
      'Compose a form and a live event history for a keyboard-friendly developer tool.',
  },
  {
    id: 'timeline-filters',
    title: 'Timeline filters',
    group: 'Patterns',
    description: 'Filter captured events by type and by the selected element.',
  },
] as const;
export type PageId = (typeof pages)[number]['id'];
export type ComponentId =
  | 'button'
  | 'input'
  | 'card'
  | 'badge'
  | 'tabs'
  | 'dialog'
  | 'tooltip'
  | ExtendedComponentId;
export const componentIds: ComponentId[] = [
  'button',
  'input',
  'card',
  'badge',
  'tabs',
  'dialog',
  'tooltip',
  ...extendedComponentIds,
];
export const details: Record<
  ComponentId,
  {
    usage: string;
    accessibility: string;
    props: string[][];
    code: string;
    exports?: string;
    reactImports?: readonly string[];
  }
> = {
  ...extendedComponents,
  tooltip: {
    usage: 'Keep essential information in the page and use a tooltip for a short supplementary description.',
    accessibility: 'Show on hover and keyboard focus; Escape dismisses it without changing focus.',
    props: [['content', 'ReactNode', 'Required'], ['children', 'ReactElement', 'Required']],
    code: '<Tooltip content="Open the original reference"><Button>Reference</Button></Tooltip>',
  },
  button: {
    usage:
      'Use one primary action per section. Secondary actions sit alongside it; ghost buttons keep repeated utility actions light.',
    accessibility:
      'Use a clear action label. Native disabled blocks interaction. The default type is button; opt into type="submit" for forms. Icon-only buttons need an aria-label.',
    props: [
      ['variant', 'primary | secondary | ghost', 'primary'],
      ['size', 'sm | md', 'md'],
      ['disabled', 'boolean', 'false'],
      ['type', 'button | submit | reset', 'button'],
    ],
    code: '',
  },
  input: {
    usage:
      'Keep labels visible. Explain constraints before submission and connect error messages to their input.',
    accessibility:
      'Pair htmlFor and id. Use aria-invalid for errors and aria-describedby for hints. A placeholder is not a replacement for a label.',
    props: [
      ['type', 'Native HTML input type', 'text'],
      ['disabled / readOnly', 'boolean', 'false'],
      ['aria-invalid', 'boolean', 'None'],
      ['ref', 'HTMLInputElement', 'None'],
    ],
    code: `<label htmlFor="project">Project name</label>\n<Input id="project" placeholder="Your next idea"\n  aria-describedby="project-hint" />\n<p id="project-hint">Use a short, memorable name.</p>`,
  },
  card: {
    usage:
      'Group related content with a subtle boundary. Cards are div elements: add your own heading hierarchy and explicit actions.',
    accessibility:
      'Do not make an entire card clickable when it contains other controls. Keep headings in the document outline and use descriptive links.',
    props: [
      ['children', 'ReactNode', 'None'],
      ['className', 'string', 'None'],
      ['style', 'CSSProperties', 'None'],
      ['ref', 'HTMLDivElement', 'None'],
    ],
    code: `<Card>\n  <Badge tone="accent">Active</Badge>\n  <h3>Interaction Inspector</h3>\n  <p>A clearer view of every interaction.</p>\n  <span>Updated just now</span>\n</Card>`,
  },
  badge: {
    usage:
      'Describe status or category in a few words. Use semantic tones for meaningful operational states and neutral for unknown or ordinary categories. danger and error share one visual tone, as do info and active; pick one name from each pair and use it consistently.',
    accessibility:
      'Always include meaningful text; color alone should not communicate status. Badge is non-interactive. Use a button for an action.',
    props: [
      ['tone', 'neutral | accent | success | warning | danger | error | info | active', 'neutral'],
      ['children', 'ReactNode', 'None'],
      ['className', 'string', 'None'],
      ['ref', 'HTMLSpanElement', 'None'],
    ],
    code: `<Badge>Draft</Badge>\n<Badge tone="accent">Active</Badge>\n<Badge tone="active">Running</Badge>\n<Badge>Waiting</Badge>\n<Badge tone="success">Succeeded</Badge>\n<Badge tone="danger">Failed</Badge>\n<Badge tone="warning">Attention required</Badge>\n<Badge>Unknown</Badge>\n<Badge>v${packageVersion}</Badge>`,
  },
  tabs: {
    usage:
      'Switch between related views, not different destinations. Use links for site navigation. Keep tab names short and distinct.',
    accessibility:
      'Label TabsList. Arrow keys move between enabled tabs; Home and End jump to the edges. Radix manages selection, focus, and panel relationships.',
    props: [
      ['value / defaultValue', 'string', 'None'],
      ['onValueChange', '(value: string) => void', 'None'],
      ['orientation', 'horizontal | vertical', 'horizontal'],
      ['activationMode', 'automatic | manual', 'automatic'],
    ],
    code: `<Tabs defaultValue="activity">\n  <TabsList aria-label="Project views">\n    <TabsTrigger value="activity">Activity</TabsTrigger>\n    <TabsTrigger value="settings">Settings</TabsTrigger>\n  </TabsList>\n  <TabsContent value="activity">No new events.</TabsContent>\n  <TabsContent value="settings">Project settings.</TabsContent>\n</Tabs>`,
  },
  dialog: {
    usage:
      'Use a dialog for a focused task that needs the current page as context. Keep the title specific and provide a clear way to leave.',
    accessibility:
      'Include DialogTitle and DialogDescription. Escape closes and restores trigger focus. Focus stays inside while open. Use container for a locally themed portal.',
    props: [
      ['open / defaultOpen', 'boolean', 'false'],
      ['onOpenChange', '(open: boolean) => void', 'None'],
      ['theme (DialogContent)', 'light | dark', 'inherited'],
      ['container (DialogContent)', 'HTMLElement', 'document.body'],
    ],
    code: `<Dialog>\n  <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Project settings</DialogTitle>\n    <DialogDescription>Give your project a name.</DialogDescription>\n    <label htmlFor="name">Name</label>\n    <Input id="name" defaultValue="Interaction Inspector" />\n    <DialogClose asChild><Button>Done</Button></DialogClose>\n  </DialogContent>\n</Dialog>`,
  },
};
