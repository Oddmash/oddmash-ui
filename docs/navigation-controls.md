# Documentation navigation controls

Use these neutral controls alongside SiteHeader, SiteNav and Prose. Product routing, translated text, page data, branding and layout remain consumer-owned.

[한국어](ko/navigation-controls.md) · [日本語](ja/navigation-controls.md) · [简体中文](zh-CN/navigation-controls.md)

## Documentation navigation

`DocsNavigation` renders grouped native links. Supply a distinct accessible name and stable item IDs. `currentId` marks the matching link as the current page. A localized `mobileLabel` enables the disclosure below 48rem; links remain visible before hydration and on desktop.

```tsx
import { DocsNavigation } from '@oddmash/ui/docs-navigation';

<DocsNavigation aria-label="Documentation" mobileLabel="Browse documentation"
  currentId="guide" groups={[{ id: 'start', label: 'Start here', items: [
    { id: 'guide', label: 'Guide', href: '/docs/guide' },
    { id: 'api', label: 'API', href: '/docs/api' },
  ] }]} />
```

Use `onNavigate(item, event)` only when your routing integration handles the destination. Keep genuine hrefs for modified clicks and native fallback.

## Table of contents

`TableOfContents` accepts heading IDs and labels, an optional heading level and a `contentId` to scope observation. It observes window scrolling, resize and hash changes and marks the active link with `aria-current="location"`. Pass `activeId` (including an explicit null) for a controlled state, or use `observeActiveHeading(content, ids, onActiveChange, { offset })` in static HTML. It returns a cleanup function.

The optional `offset` accounts for a sticky header. Keep real destination IDs on headings, and add `tabIndex={-1}` to headings when focus should follow a mobile selection.

## Scroll-aware header

Choose `ScrollHeader` instead of SiteHeader to opt into sticky scroll visibility. It hides after 24px of downward movement and reveals after 8px upward, at the top, with keyboard focus, an open descendant control, or an explicit `locked` state. A media query such as `media="(max-width: 720px)"` limits the behavior. Reduced-motion users keep the header visible.

Static HTML may use the `om-site-header om-scroll-header` classes and attach `observeScrollHeader(element, options)`. Call the returned cleanup function when the header is removed. Unenhanced markup remains visible.

## Locale picker

`LocalePicker` composes Select with a native details-and-links fallback for SSR. Provide localized control text, each language's own label, its `lang`, and the actual alternate href for the current document.

```tsx
import { LocalePicker } from '@oddmash/ui/locale-picker';

<LocalePicker label="Language" value="en" options={[
  { value: 'en', label: 'English', lang: 'en', href: '/en/docs' },
  { value: 'ko', label: '한국어', lang: 'ko', href: '/ko/docs' },
]} />
```

The default enhanced selection navigates to the supplied href. A controlled `onValueChange(value, option)` can perform consumer routing instead. The component never infers locale prefixes, changes document language itself or persists preferences.
