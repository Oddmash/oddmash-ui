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
    description: 'From a blank project to your first interface.',
  },
  {
    id: 'colors',
    title: 'Colors',
    group: 'Foundations',
    description: 'Quiet surfaces. Clear signals. A little green.',
  },
  {
    id: 'typography',
    title: 'Typography',
    group: 'Foundations',
    description: 'A readable rhythm, from labels to headlines.',
  },
  {
    id: 'tokens',
    title: 'Tokens',
    group: 'Foundations',
    description: 'One source of truth. Every detail connected.',
  },
  {
    id: 'button',
    title: 'Button',
    group: 'Components',
    description: 'Make the next action feel obvious.',
  },
  {
    id: 'input',
    title: 'Input',
    group: 'Components',
    description: 'Give every field a label, a purpose, and a little room.',
  },
  {
    id: 'card',
    title: 'Card',
    group: 'Components',
    description: 'A quiet container for related information.',
  },
  {
    id: 'badge',
    title: 'Badge',
    group: 'Components',
    description: 'A small signal with just enough emphasis.',
  },
  {
    id: 'tabs',
    title: 'Tabs',
    group: 'Components',
    description: 'Different views. One shared context.',
  },
  {
    id: 'dialog',
    title: 'Dialog',
    group: 'Components',
    description: 'Bring one decision into focus.',
  },
  {
    id: 'interaction-pattern',
    title: 'Interaction monitor',
    group: 'Patterns',
    description:
      'Compose a form and a live event history for a keyboard-friendly developer tool.',
  },
] as const;
export type PageId = (typeof pages)[number]['id'];
export type ComponentId =
  'button' | 'input' | 'card' | 'badge' | 'tabs' | 'dialog';
export const componentIds: ComponentId[] = [
  'button',
  'input',
  'card',
  'badge',
  'tabs',
  'dialog',
];
export const details: Record<
  ComponentId,
  { usage: string; accessibility: string; props: string[][]; code: string }
> = {
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
      ['aria-invalid', 'boolean', '—'],
      ['ref', 'HTMLInputElement', '—'],
    ],
    code: `<label htmlFor="project">Project name</label>\n<Input id="project" placeholder="Your next idea"\n  aria-describedby="project-hint" />\n<p id="project-hint">Use a short, memorable name.</p>`,
  },
  card: {
    usage:
      'Group related content with a subtle boundary. Cards are div elements: add your own heading hierarchy and explicit actions.',
    accessibility:
      'Do not make an entire card clickable when it contains other controls. Keep headings in the document outline and use descriptive links.',
    props: [
      ['children', 'ReactNode', '—'],
      ['className', 'string', '—'],
      ['style', 'CSSProperties', '—'],
      ['ref', 'HTMLDivElement', '—'],
    ],
    code: `<Card>\n  <Badge tone="accent">Active</Badge>\n  <h3>Interaction Inspector</h3>\n  <p>A clearer view of every interaction.</p>\n  <Button variant="secondary">Open project</Button>\n</Card>`,
  },
  badge: {
    usage:
      'Describe status or category in a few words. Reserve the accent tone for a state that deserves attention.',
    accessibility:
      'Always include meaningful text; color alone should not communicate status. Badge is non-interactive. Use a button for an action.',
    props: [
      ['tone', 'neutral | accent', 'neutral'],
      ['children', 'ReactNode', '—'],
      ['className', 'string', '—'],
      ['ref', 'HTMLSpanElement', '—'],
    ],
    code: `<Badge>Draft</Badge>\n<Badge tone="accent">Active</Badge>\n<Badge>v0.1.0</Badge>`,
  },
  tabs: {
    usage:
      'Switch between related views, not different destinations. Use links for site navigation. Keep tab names short and distinct.',
    accessibility:
      'Label TabsList. Arrow keys move between enabled tabs; Home and End jump to the edges. Radix manages selection, focus, and panel relationships.',
    props: [
      ['value / defaultValue', 'string', '—'],
      ['onValueChange', '(value: string) => void', '—'],
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
      ['onOpenChange', '(open: boolean) => void', '—'],
      ['theme (DialogContent)', 'light | dark', 'inherited'],
      ['container (DialogContent)', 'HTMLElement', 'document.body'],
    ],
    code: `<Dialog>\n  <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>\n  <DialogContent>\n    <DialogTitle>Project settings</DialogTitle>\n    <DialogDescription>Give your project a name.</DialogDescription>\n    <label htmlFor="name">Name</label>\n    <Input id="name" defaultValue="Interaction Inspector" />\n    <DialogClose asChild><Button>Done</Button></DialogClose>\n  </DialogContent>\n</Dialog>`,
  },
};
