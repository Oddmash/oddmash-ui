# Quality and release

## Test matrix
| Surface | Evidence required |
| --- | --- |
| Core | State transitions, threshold/velocity boundaries, cancellation, lock reference counts, cleanup |
| React | Controlled/uncontrolled, StrictMode, remount, simultaneous overlays and error states |
| Browsers | Chromium, Firefox and WebKit desktop/emulation; actual Android Chrome and iOS Safari/PWA |
| SSR | React 18/19, Next.js App Router import, hydration, no server DOM usage |
| A11y | Keyboard, 320 CSS px reflow, 200% text size, drag alternatives, focus restoration, contrasts, reduced motion, VoiceOver/TalkBack |
| Performance | Same fixture comparison, gzip package budget from `pnpm verify:budget`, and frame timing during drag |
| Delivery | lint, types, tests, build, package tarball inspection, clean consumer install, documentation links |

Emulation is not physical-device evidence. Report pass/fail/blocked/not run separately with exact revision, versions and reproducible cases. Do not claim WCAG conformity from automated scans only.

## Applicability
Owner: Oddmash maintainer, with scoped contributors where authorized. Required: accessibility, browser support, dependency licensing, reproducibility, public documentation, release recovery and support issue tracker. Optional: visual presets, additional framework adapters, hosted demo. Not applicable in MVP: accounts, billing, persistent user data, telemetry, server-side operations; package runs locally in consumer apps. Unresolved: device access, supported OS versions, exact performance budgets, final dependency decisions.

## Public alpha documentation

The reviewed `main` branch can publish the demo and usage documentation after trusted browser CI, a clean tarball install, and a built-site smoke check. Present physical-device, assistive technology, and performance coverage as recorded in the alpha verification notes. This documentation preview is separate from registry publishing and stable browser support.

## Release
Use develop for integration and main for approved releases. Require normal reviewed PRs and current CI. Set up trusted npm publishing separately; never embed tokens. Document semver, known limitations, changelog, package exports and rollback/deprecation. Generate llms.txt from versioned human documentation and verify URLs. Do not publish until authorization and evidence are complete. Retain prior published versions; prefer corrective release for regressions.

For the first npm alpha, verify the approved `main` commit, [device evidence](device-verification.md), and clean React 18 and 19 consumers of the exact tarball. Inspect the archive files and use `npm publish <verified-tarball> --dry-run --access public --tag alpha` before public publishing. The npm account needs publish access to `@oddmash` and the registry's required account authentication. After publication, verify the exact version and `alpha` tag from npm, then install it in a clean consumer before advertising the registry command in the guide. Configure future trusted publishing using the repository and workflow settings on npm.
