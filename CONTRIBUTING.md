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

React 18.3.1 and React 19 are supported peers. Install the published package with `npm install @oddmash/ui`. To test a local change in a consuming project, build an archive with `pnpm pack`, then install the resulting `oddmash-ui-0.3.0.tgz` in the consuming project. Import `@oddmash/ui/styles.css` once. The package is ESM-only and does not include a global reset, Tailwind, an icon package, or a CSS-in-JS runtime.

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

React 19 uses the root lockfile. React 18 uses a separate temporary checkout with the four exact compatibility versions applied by `scripts/prepare-react18.mjs` and the committed `tests/compatibility/react18/pnpm-lock.yaml`. Both install with a frozen lockfile. When dependencies change, generate the React 18 manifest in a disposable checkout, update its lockfile using the pinned pnpm, and copy only that reviewed lockfile back to the compatibility fixture. Neither CI matrix job rewrites tracked dependency inputs.

Each component preview has a dedicated browser test that exercises its behavior or rendered semantics before running axe in light and dark themes. CI includes failures with screenshots, traces, and visual diffs in the browser results artifact.

Run visual comparisons on Linux with the version of Chromium installed by Playwright. After reviewing an intentional change against the current baselines, regenerate them on Linux with `pnpm run test:visual --update-snapshots=all` and include the changed images in the PR.

Automated accessibility checks are not a WCAG certification or a substitute for manual assistive-technology testing. Publishing remains a separate owner-approved action; npm scope ownership and release permission must be confirmed before any release.

## Publish a stable version

Register the GitHub Actions trusted publisher on the npm settings page for `@oddmash/ui`. Enter organization `Oddmash`, repository `oddmash-ui`, and workflow filename `publish-npm.yml`. Allow direct publishing and leave the environment blank. This registration is required once for this workflow.

Update the version in `package.json` and the lockfile, merge to `main`, then publish a GitHub Release whose tag is `v` followed by the package version. The workflow validates and packages the tagged commit, then publishes the archive to npm through OIDC. Draft releases and prereleases do not publish a package.

If a publish fails, use **Run workflow** on `main` and enter the existing published release tag. The retry workflow retains npm installation only for immutable historical tags that predate the pnpm migration.

## Brand and localized documentation

Oddmash UI takes its visual cues from the folded ribbon in the Oddmash mark. Paired diagonals define the brand surface, adjoining panels create depth, and high-contrast text keeps tools readable. Blue and red identify focus and errors. Motion is short and follows reduced-motion preferences.

English is the source copy for the docs. Keep Korean, Japanese, and Simplified Chinese entries in `demo/translations.ts` in sync with the source. Translate headings, instructions, and accessible names. Keep component names, prop names, and copyable code in their original form.

## Public contribution language

Write issue and pull request titles, bodies, public review discussions, commit messages, and changelog entries in English. Use the shared English issue and PR templates from [Oddmash](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md). Preserve existing product documentation localization and provide translation help when needed.
