# Oddmash UI

[English](https://github.com/Oddmash/oddmash-ui#readme) · [한국어](https://github.com/Oddmash/oddmash-ui/blob/main/docs/ko/README.md) · [日本語](https://github.com/Oddmash/oddmash-ui/blob/main/docs/ja/README.md) · [简体中文](https://github.com/Oddmash/oddmash-ui/blob/main/docs/zh-CN/README.md)

Oddmash UI gives small React developer tools consistent defaults without a new design exercise. For example, build an Interaction Inspector settings panel with six components and one CSS import. **Design less. Build more.**

## Quick start

The demo below is the real implementation using synthetic project data. Run the playground or Storybook locally; there is no hosted demo yet.

![Oddmash UI playground: dark project settings with tabs, input, buttons and badge; sample data](docs/assets/playground.png)

```sh
git clone https://github.com/Oddmash/oddmash-ui.git
cd oddmash-ui
npm ci
npm run demo
# http://localhost:5173
npm run storybook
# http://localhost:6006
```

## Use in another project

Node 24+ is required for building. React 18.3.1 and React 19 are supported peers. This package is not published to npm. Run `npm pack` here, then `npm install /absolute/path/to/oddmash-ui-0.1.0.tgz` in your project. Import the stylesheet once. ESM only; no Tailwind, icon package, CSS-in-JS runtime or global reset.

```tsx
import { Button, Input, Card, Badge, tokens } from '@oddmash/ui';
import '@oddmash/ui/styles.css';

export const Settings = () => (
  <section data-om-theme="dark">
    <Card>
      <Badge tone="accent">Active</Badge>
      <label htmlFor="project">Project name</label>
      <Input id="project" defaultValue="Interaction Inspector" />
      <Button onClick={() => console.log('Save')}>Save changes</Button>
      <p style={{ color: tokens['color.muted'] }}>Local sample project</p>
    </Card>
  </section>
);
```

## API and accessibility

Button supports `variant="primary|secondary|ghost"`, `size="sm|md"`, native props and ref; default type is `button`. Input, Card (div), Badge (span, `tone="neutral|accent"`) preserve native props, refs, className and style. Tabs and Dialog preserve Radix controlled/uncontrolled APIs. Tabs supports arrows, Home/End and disabled items. Dialog supports Escape, focus trapping and focus restoration. Supply visible Input labels, error text linked with aria-describedby, and DialogTitle/Description. Use aria-invalid for errors. Do not nest interactive controls. Reduced motion and forced colors are supported. Automated axe checks do not replace screen-reader testing.

```tsx
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogTitle,
  DialogDescription, DialogClose, Button,
} from '@oddmash/ui';

export const Views = () => (
  <Tabs defaultValue="events">
    <TabsList aria-label="Inspector views">
      <TabsTrigger value="events">Events</TabsTrigger>
      <TabsTrigger value="focus">Focus</TabsTrigger>
    </TabsList>
    <TabsContent value="events">No events recorded.</TabsContent>
    <TabsContent value="focus">Select an element.</TabsContent>
  </Tabs>
);
export const SettingsDialog = () => (
  <Dialog>
    <DialogTrigger asChild><Button>Settings</Button></DialogTrigger>
    <DialogContent theme="dark">
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription>Configure the local project.</DialogDescription>
      <DialogClose asChild><Button>Done</Button></DialogClose>
    </DialogContent>
  </Dialog>
);
```

## Tokens and build choice

JSON is the only token source. Primitive stores the palette/scales; semantic maps intent for light/dark. Color, spacing, typography, radii, border, shadow and motion use DTCG $type/$value, structured sRGB colors/dimensions, and aliases. Theme selection is a separate file per theme rather than a proprietary modes extension. Style Dictionary 5 handles reference resolution and CSS transforms; its established DTCG support avoids maintaining a bespoke color/composite transformer. It is a development dependency. The small TypeScript orchestrator generates CSS and typed variable references and rejects missing references, unequal theme keys and stale files. Do not edit src/generated or dist. CSS variables are used directly in SCSS; there is no duplicate SCSS value table.

```text
tokens/
  primitive.json
  semantic/light.json
  semantic/dark.json
scripts/tokens.ts
src/
  generated/tokens.css    ← generated
  generated/tokens.ts     ← generated
  button.tsx / input.tsx / card.tsx / badge.tsx
  tabs.tsx / dialog.tsx
  styles.scss
  foundations.stories.tsx
.storybook/
demo/                    ← consumes package exports
tests/                   ← behavior, hydration, tokens, browsers
.github/workflows/ci.yml
```

```json
{
  "semantic": {
    "color": {
      "accent": { "$type": "color", "$value": "{primitive.color.mint}" }
    }
  }
}
```

## Themes and overrides

Default is light. Set data-om-theme="light" or "dark" on html or a subtree; the application owns system preference/persistence. Load overrides after package CSS. For durable project branding, store overrides in project JSON and generate CSS (see Interaction Inspector integration). The handwritten example below is only an illustration, not another token source. Override semantic tokens for local customization; primitives and semantic alias expressions are emitted together at theme boundaries. Dialog portals to body: pass theme explicitly for scoped themes, and use container inside the themed subtree for custom branding. Shadow DOM consumers must inject styles inside their root and provide a portal container there; modal behavior in closed Shadow DOM is not certified by this MVP.

```scss
.my-tool {
  --om-semantic-color-accent: #087c66;
  --om-semantic-color-accent-hover: #066451;
  --om-semantic-color-on-accent: #ffffff;
  --om-semantic-radius-sm: 4px;
}
```

## Development and contribution

CI runs React 18 and 19 with matching type packages, typecheck, lint, tests, token freshness, package/Storybook/demo builds and three-browser tests. Run the commands below before contributing. Change JSON, regenerate and commit generated files together. Add behavior tests for changed APIs. Keep the four READMEs, language links and screenshot synchronized. Follow the organization contribution policy; discuss cross-project API changes in an issue first. Publishing requires a separate owner-approved release and npm scope verification.

| Command | Purpose |
| --- | --- |
| `npm run tokens` | JSON → CSS + TypeScript |
| `npm run tokens:check` | Reject stale generated files / theme mismatch |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Behavior, SSR/hydration, token pipeline |
| `npm run build` | ESM, declarations, CSS |
| `npm run test:bundle` | Button-only bundle <= 2 kB; no Radix |
| `npm run build-storybook` | Static component explorer |
| `npm run build:demo` | Package-consuming demo |
| `npm run check` | All non-browser checks |
| `npx playwright install chromium firefox webkit` | Browser setup |
| `npm run test:browser` | Keyboard, focus trap, axe, responsive, motion |
| `npm pack` | Local installable archive; no publishing |

## Scope and integration

v0 contains only six component families. No Select, Toast, form framework, theme provider or font download. Interaction Inspector retains its compact dark visual design via project JSON overrides and adopts Button without changing recording/privacy/permissions. Its integration branch and verification results are documented in docs/VERIFICATION.md. Next: manual assistive-technology review, release ownership and usage-driven additions.

MIT. [Style Dictionary](https://styledictionary.com/reference/config/) · [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) · [Contribution policy](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md)
