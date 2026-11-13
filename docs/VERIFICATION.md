# Verification and implementation record

Verified on 2026-11-13 (Asia/Seoul), macOS arm64, Node 24.14.0. All data used in screenshots and browser tests is synthetic.

## Repository and design assessment

The organization initially had [.github](https://github.com/Oddmash/.github) and [interaction-inspector](https://github.com/Oddmash/interaction-inspector). The organization describes itself as a developer experience lab and requires synchronized English, Korean, Japanese and Simplified Chinese READMEs with a product visual and quick start. No shared token package, component library or formal brand token source was found.

Inspector baseline: commit `a70ad7a`, React 19.2.8, Vite, SCSS, closed Shadow DOM, compact dark panel. Its buttons, surfaces, border radii and spacing are reusable concepts; recording, highlighting, privacy filtering and extension permissions are application logic. A separate `@oddmash/ui` repository keeps those responsibilities separate and allows future tools to consume the same defaults. Neutral/mint is the proposed UI baseline from the prior design conversation, not a claim of an existing official brand specification.

Style Dictionary 5 is a build-only dependency. It provides DTCG references and composite transforms instead of a custom conversion engine. JSON sources contain typed sRGB colors, dimensions, font family/weight, line height, border, shadow, duration and easing. Theme files have identical semantic keys; generated CSS and TypeScript are committed and checked for drift. Runtime dependencies are only Radix Dialog and Tabs (plus their transitive dependencies); React/ReactDOM are peers. No icon dependency, Tailwind, theme provider or global reset is required.

## Local checks

| Command | React 19.3.1 | React 18.3.1 |
| --- | --- | --- |
| `npm run tokens:check` | Pass | Pass |
| `npm run typecheck` | Pass | Pass with React 18 type packages |
| `npm run lint` | Pass | Pass |
| `npm test` | 7 passed | 7 passed |
| `npm run build` | Pass: ESM, declarations, CSS | Pass |
| `npm run test:bundle` | Pass: 337 B / 238 B gzip; no Radix in Button-only output | Same |
| `npm run build-storybook` | Pass | Pass |
| `npm run build:demo` | Pass, consumes package exports | Pass |
| `npm run test:browser` | 9 passed | 9 passed |
| `npm pack` | Installable archive verified in Inspector | Not a registry publication |

Browsers: Chromium 158 / Firefox 159 / WebKit 27.2. Each engine checks light/dark axe scans, keyboard tabs, disabled tab skipping in unit tests, modal focus and Escape restoration, 320px overflow, reduced motion, nested themes and local token overrides. Unit tests also cover native form behavior, refs, disabled controls, invalid input descriptions, controlled portal behavior, SSR/hydration, JSON regeneration, broken references, unequal theme keys and stale output rejection.

A color transition caused temporary low contrast during theme/tab changes. Colors now change immediately; only opacity transitions remain. Both themes pass axe in the covered demo states. This is not a full WCAG certification or a manual screen-reader review.

## Interaction Inspector

Integration replaces four native buttons with Button and injects package CSS inside the existing Shadow DOM. Project colors live in `tokens/inspector.json` and generate a local stylesheet; remaining application-specific layout and visualization rules stay local. A specific hover override preserves the original hover/pressed appearance.

| Command | Result |
| --- | --- |
| `npm run tokens:check` | Pass |
| `npm test` | 5 privacy/permission tests passed |
| `npm run build` | TypeScript + both Vite extension bundles passed |
| `npm run test:e2e` | 2 MV3 extension tests passed, including toolbar activation and hover regression |

The initial panel screenshot is byte-identical before/after in the measured Chromium fixture. Panel and button position, dimensions, font, color and radius match; see [metrics](assets/inspector-metrics.json), [before](assets/inspector-before.png) and [after](assets/inspector-after.png). This is one initial state at 1000×800, not an exhaustive visual regression suite.

Baseline extension bundle: 201.15 kB / 63.62 kB gzip. Integration before the final small token/hover adjustments: 212.12 kB / 65.38 kB gzip. The final measured size is recorded in the integration pull request. The worker remains 0.31 kB. The package's component entry points and tree-shaking guard prevent unused Radix code from entering the Button-only consumer. Full CSS is intentionally included in this first integration.

## Release and remaining work

- No npm publish was run. `npm whoami` returned ENEEDAUTH; the public registry lookup returned E404. Neither npm scope ownership nor publish permission is established. Use a local packed archive or the reviewed Git commit until release authorization and scope ownership are confirmed.
- Inspector adoption is a separate review branch/PR; it is not merged into main automatically.
- Demo and Storybook are deployed to [GitHub Pages](https://oddmash.github.io/oddmash-ui/) by `.github/workflows/pages.yml`. The playground is at the site root; Storybook is at `storybook/`. Pushes to main rebuild and deploy both.
- Manual assistive-technology review and closed-Shadow-DOM modal testing remain. Only Button is adopted in Inspector; all six families are exercised in the separate demo/Storybook.
- Vite reports informational `use client` bundling warnings for client-only demo/extension builds and a large Storybook manager chunk. Package ESM keeps the client directive; the demo is not an RSC certification.
- `npm audit --omit=dev` reported zero production vulnerabilities for the UI package. The full development dependency audit reported 16 advisories (2 low, 14 moderate); dependency remediation is a follow-up, not hidden by the build result. Inspector already had a high-severity development dependency advisory at baseline; the runtime integration does not claim to resolve it.
- Future components should follow demonstrated consumer demand. No npm release automation, Select, Toast or broad framework abstraction is included in v0.
