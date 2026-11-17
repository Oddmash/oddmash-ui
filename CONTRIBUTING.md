# Contributing to Oddmash UI

The product README explains what Oddmash UI is. Repository setup, local usage, architecture, and verification belong here.

## Local documentation

Node.js 24 or later is required.

```sh
git clone https://github.com/Oddmash/oddmash-ui.git
cd oddmash-ui
npm ci
npm run demo
# http://localhost:5173
```

## Use from another local project

React 18.3.1 and React 19 are supported peers. Install the published package with `npm install @oddmash/ui`. To test a local change in a consuming project, build an archive with `npm pack`, then install the resulting `oddmash-ui-0.3.0.tgz` in the consuming project. Import `@oddmash/ui/styles.css` once. The package is ESM-only and does not include a global reset, Tailwind, an icon package, or a CSS-in-JS runtime.

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

## Themes and product overrides

Set `data-om-theme="light"` or `data-om-theme="dark"` on the document or a subtree. Applications own system preference and persistence. Load product overrides after the package CSS and override semantic variables rather than primitives. Shadow DOM consumers must inject the stylesheet and portal containers inside their root.

## Verification

| Command | Purpose |
| --- | --- |
| `npm run tokens` | Generate CSS and TypeScript from JSON tokens |
| `npm run tokens:check` | Reject stale output and theme mismatches |
| `npm run typecheck` | Check TypeScript |
| `npm run lint` | Run ESLint |
| `npm test` | Run behavior, hydration, and token tests |
| `npm run build` | Build ESM, declarations, and CSS |
| `npm run test:bundle` | Verify the small Button-only bundle |
| `npm run build:demo` | Build the documentation site against the compiled package |
| `npm run test:browser` | Run keyboard, focus, axe, responsive, and motion checks |
| `npm run check` | Run the non-browser validation suite |

Run `npx playwright install chromium firefox webkit` before the browser suite when the browsers are not installed. Keep the four product README translations, language links, and visuals synchronized. Follow the [Oddmash organization contribution policy](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md) and discuss cross-project API changes in an issue first.

## Previous verification

The initial Interaction Inspector integration was measured on a Chromium fixture at 1000 × 800. The initial panel screenshots matched byte for byte in that fixture. See the [before screenshot](docs/assets/inspector-before.png), [after screenshot](docs/assets/inspector-after.png), and [measured geometry and styles](docs/assets/inspector-metrics.json). The [original verification record](https://github.com/Oddmash/oddmash-ui/blob/dcc03a1/docs/VERIFICATION.md) captures the historical test and integration context.

## Current verification coverage

CI checks React 18 and 19 with matching type packages. The browser suite covers the documentation pages in light and dark themes, 320 px layouts, axe scans, keyboard navigation, focus return, live props, copy behavior, token filtering, scoped themes, mobile navigation, dialog submission, reduced motion, and product overrides across Chromium, Firefox, and WebKit.

Automated accessibility checks are not a WCAG certification or a substitute for manual assistive-technology testing. Publishing remains a separate owner-approved action; npm scope ownership and release permission must be confirmed before any release.

## Publish a stable version

Register the GitHub Actions trusted publisher on the npm settings page for `@oddmash/ui`. Enter organization `Oddmash`, repository `oddmash-ui`, and workflow filename `publish-npm.yml`. Allow direct publishing and leave the environment blank. This registration is required once for this workflow.

Update the version in `package.json` and the lockfile, merge to `main`, then publish a GitHub Release whose tag is `v` followed by the package version. The workflow validates and packages the tagged commit, then publishes the archive to npm through OIDC. Draft releases and prereleases do not publish a package.

If a publish fails, use **Run workflow** on `main` and enter the existing published release tag.

## Brand and localized documentation

Oddmash UI takes its visual cues from the folded ribbon in the Oddmash mark. Paired diagonals define the brand surface, adjoining panels create depth, and high-contrast text keeps tools readable. Blue and red identify focus and errors. Motion is short and follows reduced-motion preferences.

English is the source copy for the docs. Keep Korean, Japanese, and Simplified Chinese entries in `demo/translations.ts` in sync with the source. Translate headings, instructions, and accessible names. Keep component names, prop names, and copyable code in their original form.
