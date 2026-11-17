---
name: oddmash-ui-development
description: Use for Oddmash UI brand changes, design tokens, React components, package exports, multilingual documentation, interactive demos, testing, and authorized npm releases.
---

# Oddmash UI development

Use this workflow for substantive work in `Oddmash/oddmash-ui`. Treat the package as an evolving pre-1.0 project: inspect the current code and contributor guide before assuming an API or visual choice is final.

## Establish the change boundary

- Read only the relevant parts of `README.md`, `CONTRIBUTING.md`, `package.json`, and the files being changed.
- Keep localized READMEs focused on the product: what it is, who it serves, the problem it solves, its capabilities, and its status. Put repository setup, local-run, build, test, release, and verification details only in `CONTRIBUTING.md`.
- Distinguish shared foundations from demo-only presentation. Components and tokens under `src/` and `tokens/` are package behavior; `demo/` is documentation and validation unless the task explicitly changes the public package.
- Preserve the package's ESM-only, React peer dependency, component-level export, and no-global-reset boundaries unless the user asks to change them.
- Do not publish to npm, create a release, or modify consumer repositories without explicit authorization.

## Tokens and styles

- JSON under `tokens/` is the source of truth. Do not hand-edit `src/generated/` or `dist/`.
- Put raw palette and scale values in `tokens/primitive.json`. Put intent-based aliases in both semantic theme files.
- Keep light and dark semantic key sets identical. Prefer semantic CSS variables in component SCSS instead of primitive values or duplicate SCSS variables.
- After token edits, run `npm run tokens`, review the generated diff, and run `npm run tokens:check`.
- Treat product-specific palettes and layout rules as consumer overrides rather than additions to the shared foundation unless more than one Oddmash product needs them.

## Brand, demos, and languages

- Use the existing Oddmash mark as the shape reference. Its folded ribbon appears as paired diagonals and adjoining surfaces in `demo/brand.scss`. Use Geist Sans for UI and Geist Mono for code and event values, with locale-appropriate fallback fonts.
- Keep the palette neutral and limit state color to its semantic purpose. Apply brief opacity-free movement to content that must remain readable during a transition. Honor `prefers-reduced-motion` and keep focus indicators visible in both themes.
- Use real exported components in the playground. Provide a trigger for Alert, Dialog, Toast, and loading examples. Keep Breadcrumbs previews within their own state and preserve keyboard focus. Provide a clear way to dismiss feedback.
- Treat English as source copy. Update `demo/translations.ts` with Korean, Japanese, and Simplified Chinese for changed headings, descriptions, controls, error messages, and accessible labels. Keep API names, props, event names, and copyable code stable. Check the language choice survives reload and all four layouts fit at 320 px.
- Keep preview code and the live example synchronized. For larger recipes, use the same example source for the preview and copyable code. When the public UI changes materially, keep the four READMEs linked to current light and dark captures.

## Components and exports

- Preserve native element props, refs, `className`, and `style` behavior for wrapper components.
- Keep Button's default `type="button"` behavior and retain keyboard, focus, disabled, reduced-motion, and forced-colors behavior.
- For Tabs and Dialog, preserve the underlying Radix controlled and uncontrolled APIs, keyboard behavior, focus trapping, restoration, and explicit portal-container support.
- Keep native Select available for browser-native validation, optgroups, and multi-select. Use SelectDropdown for a styled single choice. Check keyboard navigation, type-ahead, cancellation, disabled options, and focus.
- Keep Toast controlled and render its live region before the message appears. Use polite status for confirmations and alert for urgent errors. Keep dismissal available and return focus in the caller when appropriate.
- Update `src/index.ts`, `package.json` subpaths, `tsup.config.ts` entries, declarations, tests, examples, and documentation together when the public API changes.
- Avoid adding a runtime dependency or component family solely for completeness. Explain the demonstrated consumer need and bundle impact.

## Verify proportionally

- Token-only changes: `npm run tokens:check`, `npm test`, and `npm run build`.
- Component, export, or build changes: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:bundle`.
- Interaction, focus, theme, responsive, or visual changes: also run `npm run test:browser` and `npm run build:demo`.
- Documentation-site changes: run `npm run build:demo`; run browser tests when navigation, live examples, themes, or responsive behavior changes.
- Keep English, Korean, Japanese, and Simplified Chinese README claims aligned when shared behavior changes.

If a required browser is not installed, report the missing prerequisite instead of claiming the browser suite passed. Do not weaken an accessibility assertion or disable a rule merely to make CI green.

## Release via OIDC

- For an authorized release, update the manifest, lockfile, installation examples, and localized version claims together. Run the full check and verify the packed archive in a fresh React consumer before publishing.
- After CI passes, merge the release PR and publish the matching stable GitHub Release on a commit reachable from `main`. Use `publish-npm.yml` with the registered npm Trusted Publisher. For a failed publish, dispatch that workflow on `main` with the existing published tag.
- Confirm success in Actions and on the npm registry. Install the published version in a fresh project and check public imports and CSS. Distinguish npm release availability from GitHub source or Pages deployment when reporting status.

## Handoff

Report the public API or token impact, generated files, commands actually run, and any remaining manual accessibility or consumer-integration checks. Call out intentional pre-1.0 decisions rather than presenting them as permanent standards.
