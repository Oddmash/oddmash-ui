# Contributing to Oddmash UI

The product README explains what Oddmash UI is. Repository setup, local usage, architecture, and verification belong here.

## Local documentation

Node.js 24 or later and the pnpm version pinned in `package.json` are required.

```sh
git clone https://github.com/Oddmash/oddmash-ui.git
cd oddmash-ui
pnpm install --frozen-lockfile
pnpm run demo
# http://localhost:5173
```

## Use from another local project

React 18.3.1 and React 19 are supported peers. Install the published package with `npm install @oddmash/ui`. To test a local change in a consuming project, build an archive with `pnpm pack`, then install the resulting `oddmash-ui-0.11.0.tgz` in the consuming project. Import `@oddmash/ui/styles.css` once. The package is ESM-only and does not include a global reset, Tailwind, an icon package, or a CSS-in-JS runtime.

The documentation site serves Geist Sans and Geist Mono from `demo/public/fonts/` under the SIL Open Font License included there. Package consumers can self-host the fonts under those family names or use the system fallbacks in the font tokens.

## Token architecture

JSON is the only token source. `tokens/primitive.json` stores palettes and scales; `tokens/semantic/light.json` and `tokens/semantic/dark.json` map intent for each theme. Style Dictionary generates CSS variables and typed references in `src/generated`. Do not edit generated files or `dist` directly.

```text
tokens/
  primitive.json
  semantic/light.json
  semantic/dark.json
scripts/tokens.ts
src/
  generated/tokens.css
  generated/tokens.ts
  button.tsx / input.tsx / card.tsx / badge.tsx
  tabs.tsx / dialog.tsx
  styles.scss
demo/
tests/
```

## Shared component review

See the [component quality review](docs/component-quality-review.md) for the latest interaction audit and verification scope. The live Toast reference is the [Toast documentation page](https://oddmash.github.io/oddmash-ui/#/toast), which uses the localized component catalog. Mount stable controlled items before the action, keep newer items last, and retain items through their closing motion. Hover or keyboard focus expands a collapsed stack; touch and reduced-motion preferences use the expanded presentation. Controlled Toast consumers own expiry and return focus to a remaining notification or the triggering control. The optional `progress` prop accepts a remaining fraction from zero to one for decorative display, without starting a timer. ToastProvider supplies countdowns for finite durations automatically, pauses both the timer and indicator while its viewport is hovered or focused, and omits them for persistent notifications. Reduced-motion preferences use discrete countdown updates rather than per-frame animation.

## Documentation primitives

DateCalendar uses local calendar dates (`YYYY-MM-DD`) and a keyboard-operable month grid. DatePicker combines native date fields with this calendar; its `mode` is `date` (default), `year-month` or `date-time`. In date-time mode, calendar selection preserves the current hour, minute and second and emits a timezone-free `YYYY-MM-DDTHH:mm:ss` value. Existing DateSelect consumers retain their six-field behavior. DateRangePicker accepts `{ start: string; end: string }`, independently empty bounds, and `withTime` for second precision. It marks reverse ranges invalid without silently replacing either value. Consumers own timezone conversion, range presets, and when to apply a draft. Supply localized `label`, `startLabel`, `endLabel`, `labels`, `locale` and `invalidMessage` as appropriate.

DateCalendar also accepts optional exact `minDate` and `maxDate` values in `YYYY-MM-DD` format. Their inclusive intersection with the year bounds determines selectable dates; invalid or disjoint bounds throw a RangeError. Navigation and keyboard focus stay within the interval. An out-of-bounds supplied selection remains unselected without emitting a replacement value.

Use the same primitives in React applications and static HTML without hydration. Load `@oddmash/ui/styles.css` in the same way as other components. The classes below map directly to exported React wrappers, and all wrappers forward native props and refs.

| React API | Static HTML class | Typical element |
| --- | --- | --- |
| LinkCard | om-link-card | a |
| CodeBlock | om-code-block | div or figure |
| CodeBlockHeader | om-code-block-header | div |
| CodeBlockCaption | om-code-block-caption | span |
| CodeBlockContent | om-code-block-content | pre |
| CodeBlockCopy | om-code-block-copy | button |
| SiteHeader / SiteHeaderInner | om-site-header / om-site-header-inner | header / div |
| SiteFooter / SiteFooterInner | om-site-footer / om-site-footer-inner | footer / div |
| SiteNav | om-site-nav | nav |
| Prose | om-prose | article |
| ProseScroll | om-prose-scroll | div |
| ButtonLink | om-button om-button--link | a |
| IconButton / IconLink | om-button om-button--icon | button / a |
| PlatformLink / PlatformLinks | om-platform-link / om-platform-links | a / div |
| Kbd | om-kbd | kbd |
| DocsNavigation / TableOfContents | om-docs-navigation / om-table-of-contents | nav |
| ScrollHeader | om-site-header om-scroll-header | header |
| LocalePicker | om-locale-picker | div |

Use the `@oddmash/ui/link-card`, `@oddmash/ui/code-block`, `@oddmash/ui/site-layout` or `@oddmash/ui/prose` subpath when importing a single family. The classes work independently of JavaScript. For example:

```html
<a class="om-link-card" href="/guide">
  <strong>Usage guide</strong>
  <span class="om-link-card-arrow" aria-hidden="true">→</span>
  <p>Learn how to use the library.</p>
</a>

<div class="om-code-block">
  <div class="om-code-block-header">
    <span class="om-code-block-caption">Terminal</span>
    <button class="om-code-block-copy" type="button">Copy code</button>
  </div>
  <pre class="om-code-block-content" tabindex="0" role="region" aria-label="Terminal code"><code>pnpm add @oddmash/ui</code></pre>
</div>
```

LinkCard uses a left-to-right background fill that never changes layout. Override `--om-link-card-fill` for a subtle product-specific tint. Reduced motion uses the final state immediately and preserves keyboard focus.

CodeBlock does not parse or highlight code. Preserve the renderer's syntax markup and whitespace; add a caption and copy button only when needed. The consumer handles clipboard permissions, copy result, and localized feedback, such as an existing Toast. Use `--om-code-block-background`, `--om-code-block-text` and `--om-code-block-muted` for product-specific code themes. Supply a label and focusable region when code scrolling is needed.

SiteHeader and SiteFooter are layout primitives, not a menu or router. Compose the native nav with labelled landmarks and real links. Products own responsive navigation choices, logo, active routes, sticky or auto-hide behavior and theme selection. Override `--om-site-max-width`, `--om-site-gutter`, `--om-site-header-height` and `--om-site-nav-gap` for the layout.

Prose styles rendered, trusted content rather than converting Markdown to HTML. Preserve native document structure and locale. The default measure is 75ch; override `--om-prose-measure` and `--om-prose-link` as needed. For wide tables, keep the native table inside a named, focusable ProseScroll region. Existing language-aware line break engines can still operate on the rendered text.

## Tooltip

Use `Tooltip` from `@oddmash/ui/tooltip` with a single native interactive child and short, non-interactive content. Hover and keyboard focus reveal the description, Escape dismisses it, and the trigger retains its native action. For static HTML, give an existing trigger and a hidden `.om-tooltip` element to `mountTooltip` from `@oddmash/ui/tooltip-controller`; dispose its controller before replacing the page. The package stylesheet supplies the visual treatment. Keep essential information in the page as well because touch users may not hover.

```tsx
<Tooltip content="Open the original reference"><a href="/guide">Guide</a></Tooltip>
```

```ts
const tooltip = mountTooltip(trigger, panel);
tooltip.destroy();
```

## Themes and product overrides

Set `data-om-theme="light"` or `data-om-theme="dark"` on the document or a subtree. Applications own system preference and persistence. Load product overrides after the package CSS and override semantic variables rather than primitives. Shadow DOM consumers must inject the stylesheet and portal containers inside their root.

## Verification

| Command | Purpose |
| --- | --- |
| `pnpm run tokens` | Generate CSS and TypeScript from JSON tokens |
| `pnpm run tokens:check` | Reject stale output and theme mismatches |
| `pnpm run typecheck` | Check TypeScript |
| `pnpm run lint` | Run ESLint |
| `pnpm test` | Run behavior, hydration, and token tests |
| `pnpm run build` | Build ESM, declarations, and CSS |
| `pnpm run test:bundle` | Verify the small Button-only bundle |
| `pnpm run build:demo` | Build the documentation site against the compiled package |
| `pnpm run test:browser` | Run keyboard, focus, axe, responsive, and motion checks |
| `pnpm run test:a11y` | Run axe and accessibility assertions on the docs and active component states |
| `pnpm run test:visual` | Compare Select and Dialog screenshots against the Linux Chromium baselines |
| `pnpm run check` | Run the non-browser validation suite |

Run `pnpm exec playwright install chromium firefox webkit` before the browser suite when the browsers are not installed. Keep the four product README translations, language links, and visuals synchronized. Follow the [Oddmash organization contribution policy](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md) and discuss cross-project API changes in an issue first.

## Branches, CI, and deployment

- Target `develop` for feature, fix, documentation, test, and maintenance PRs; target `main` for consolidated releases or authorized hotfixes.
- PR CI checks both branches. Automatic runs on the same event and ref cancel superseded runs; manually dispatched runs remain independent.
- The pnpm store cache is keyed by both React lockfiles; browser jobs use preinstalled browsers instead of downloading them.
- Pushes to `develop` do not duplicate PR CI. Pushes to `main` retain full verification.
- Pages deploys only on main when production inputs change or when manually dispatched on main. It retains its independent non-browser checks and serialized deployment.
- npm releases retain the independent OIDC publishing workflow.

## Previous verification

The initial Interaction Inspector integration was measured on a Chromium fixture at 1000 × 800. The initial panel screenshots matched byte for byte in that fixture. See the [before screenshot](docs/assets/inspector-before.png), [after screenshot](docs/assets/inspector-after.png), and [measured geometry and styles](docs/assets/inspector-metrics.json). The [original verification record](https://github.com/Oddmash/oddmash-ui/blob/dcc03a1/docs/VERIFICATION.md) captures the historical test and integration context.

## Current verification coverage

CI checks React 18 and 19 with matching type packages. The organization-wide change scope skips metadata-only integration PRs. UI-specific scope skips browser checks only for integration PRs that exclusively change root-level `tests/*.test.ts` or `tests/*.test.tsx` files; unit, type, build and bundle checks remain required. Changes to shared test setup, browser tests, runtime code or unknown paths retain browser coverage. Demo-only integration PRs use React 19; other runtime changes and PRs to `main`, pushes to `main` and manual CI runs exercise both supported React versions. Browser jobs run Chromium, Firefox and WebKit independently with matching React versions. Each browser job uses the official Ubuntu Noble Playwright image matching the exact version in both pnpm lockfiles, avoiding flaky runner package-mirror installs; tests are distributed across workers within each browser. The required `verify` job checks all expected job outcomes. The browser suite covers the documentation pages in light and dark themes, 320 px layouts, axe scans, keyboard navigation, focus return, live props, copy behavior, token filtering, scoped themes, mobile navigation, dialog submission, reduced motion, and product overrides across Chromium, Firefox, and WebKit.

React 19 uses the root lockfile. React 18 uses a separate temporary checkout with the four exact compatibility versions applied by `scripts/prepare-react18.mjs` and the committed `tests/compatibility/react18/pnpm-lock.yaml`. Both install with a frozen lockfile. When dependencies change, generate the React 18 manifest in a disposable checkout, update its lockfile using the pinned pnpm, and copy only that reviewed lockfile back to the compatibility fixture. CI compares checksums of the prepared dependency inputs before and after installation and tests, and also verifies that the original tracked checkout remains unchanged.

Each component preview has a dedicated browser test that exercises its behavior or rendered semantics before running axe in light and dark themes. CI includes failures with screenshots, traces, and visual diffs in the browser results artifact.

Run visual comparisons on Linux with the version of Chromium installed by Playwright. After reviewing an intentional change against the current baselines, regenerate them on Linux with `pnpm run test:visual --update-snapshots=all` and include the changed images in the PR.

Automated accessibility checks are not a WCAG certification or a substitute for manual assistive-technology testing. Publishing remains a separate owner-approved action; npm scope ownership and release permission must be confirmed before any release.

## Shared navigation and feedback

Use native link semantics for destinations (`ButtonLink`, `IconLink`, `PlatformLink`) and native button semantics for actions (`IconButton`). Name icon-only controls with an accessible label and pass destination URLs from the consuming product. PlatformLink renders the requested GitHub or npm mark and shares the directional interaction and pulse motion styles. Default hover color follows the theme, with a configurable npm brand accent; reduced motion disables the pulse. Both React and static HTML can use the platform classes and `data-platform` attribute.

Use `ClipboardButton` for copy feedback and `copyText` for non-React enhancements. Copy only on activation, handle rejected clipboard requests, and preserve manual text selection. ToastProvider and useToast provide a managed queue, expiry, and focus restoration over the existing controlled Toast API. Set `announce={false}` on ClipboardButton if the same result is announced through a Toast.

DocsNavigation accepts consumer-owned navigation groups and the current item. TableOfContents accepts a list of heading IDs and an optional content ID and scroll offset, with native anchor links, mobile disclosure and optional active-heading observation. The static-compatible `observeActiveHeading` and `observeScrollHeader` controllers can be used independently of React. Keep site routing, active navigation data, language destinations, and product-specific branding in the consumer. LocalePicker takes explicit localized options and destinations, with a native details/link fallback before hydration. ScrollHeader keeps navigation visible when focus or a menu is active and observes reduced motion.

CommandPalette supports optional controlled opening, an opt-in Mod+K shortcut, groups, descriptions, consumer filters and result limits. Supply the content index or search backend in the product; this library does not fetch or index documentation itself.

## Publish a stable version

Register the GitHub Actions trusted publisher on the npm settings page for `@oddmash/ui`. Enter organization `Oddmash`, repository `oddmash-ui`, and workflow filename `publish-npm.yml`. Allow direct publishing and leave the environment blank. This registration is required once for this workflow.

Update the version in `package.json` and the lockfile, merge to `main`, then publish a GitHub Release whose tag is `v` followed by the package version. The workflow validates and packages the tagged commit, then publishes the archive to npm through OIDC. Draft releases and prereleases do not publish a package.

If a publish fails, use **Run workflow** on `main` and enter the existing published release tag. The retry workflow retains npm installation only for immutable historical tags that predate the pnpm migration.

## Brand and localized documentation

Oddmash UI takes its visual cues from the folded ribbon in the Oddmash mark. Paired diagonals define the brand surface, adjoining panels create depth, and high-contrast text keeps tools readable. Blue and red identify focus and errors. Motion is short and follows reduced-motion preferences.

English is the source copy for the docs. Keep Korean, Japanese, and Simplified Chinese entries in `demo/translations.ts` in sync with the source. Translate headings, instructions, and accessible names. Keep component names, prop names, and copyable code in their original form.

## Public contribution language

Write issue and pull request titles, bodies, public review discussions, commit messages, and changelog entries in English. Use the shared English issue and PR templates from [Oddmash](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md). Preserve existing product documentation localization and provide translation help when needed.

## Submitting a pull request

Target `develop` for ordinary contributions. Follow the [organization contribution policy](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md) and use the shared template even if GitHub does not prefill it.


### Example: a small test-only PR targeting develop

Use the [shared PR template](https://github.com/Oddmash/.github/blob/main/PULL_REQUEST_TEMPLATE.md). Keep all five headings exactly as shown, in order, and replace the example issue number and verification details with your own. Do not claim checks you did not run.

```markdown
## Related issue

Refs #123

## Summary

- Add focused accessibility tests for an existing component.

## Verification

- List the actual test command and result here.
- Note any checks not run and why.

## Product and design impact

Test-only coverage; no runtime or visual changes.

## Permissions and data

None.
```

Use `Refs #123` when targeting `develop` or doing partial work. Use `Closes #123` only when the completed work merges into the default branch. The reference belongs under Related issue.

If CI reports a failure in `scope / scope` at **Validate contribution metadata**, inspect its log for missing headings or issue references and edit the PR description. This is separate from test failures. Editing the description triggers a new CI run in repositories using the current shared workflow. For external forks, a maintainer may need to approve the new workflow run before checks execute.
