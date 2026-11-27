# Oddmash UI 0.6.0

## Highlights

Oddmash UI 0.6.0 makes operational state labels and native range controls consistent across the shared library. Documentation navigation and search are easier to use, and the docs now use the same localized copy-feedback primitive available to consumers.

## Features and improvements

- [#110](https://github.com/Oddmash/oddmash-ui/pull/110): Add semantic Badge tones for success, warning, danger/error and info/active states, backed by matching light and dark semantic tokens. Consumers keep control of visible labels, meaning and announcements.
- [#109](https://github.com/Oddmash/oddmash-ui/pull/109): Style Slider tracks, filled progress and thumbs using shared theme tokens while preserving native range input behavior, refs, controlled and uncontrolled values, keyboard operation and native appearance under forced colors.
- [#107](https://github.com/Oddmash/oddmash-ui/pull/107): Add optional localized `dismissLabel` to CommandPalette with the existing DialogClose pattern and preserved trigger focus restoration.

## Fixes

- [#106](https://github.com/Oddmash/oddmash-ui/pull/106): Keep active table-of-contents headings aligned with the reading line at page end rather than choosing the final heading unconditionally.
- [#108](https://github.com/Oddmash/oddmash-ui/pull/108): Reuse ClipboardButton for documentation Code tabs so copy feedback stays truthful and keyboard-accessible, with a target of at least 44 px.

## Documentation

- Update the interactive Badge and CommandPalette examples and API guidance in English, Korean, Japanese and Simplified Chinese.
- Keep code snippets selectable, with localized copy feedback in both themes.

## Installation

```sh
pnpm add @oddmash/ui@0.6.0
```

Load `@oddmash/ui/styles.css` once and import components through the root package or their existing public entry points.

## Compatibility

- Existing Badge tones and native range props, refs and selection semantics remain available.
- The optional CommandPalette dismiss control is absent by default; existing controlled and uncontrolled usage stays compatible.
- React 18.3.1 and React 19 remain supported peers. ESM output and public component and CSS entry points are unchanged.
- No new runtime dependencies, global reset or consumer migration is introduced.

## Verification

- All five implementation PRs passed their exact-head CI and full review: [heading tracking](https://github.com/Oddmash/oddmash-ui/actions/runs/45601968642), [command dismissal](https://github.com/Oddmash/oddmash-ui/actions/runs/45601974247), [documentation copying](https://github.com/Oddmash/oddmash-ui/actions/runs/45602794663), [Slider](https://github.com/Oddmash/oddmash-ui/actions/runs/45602965739) and [Badge](https://github.com/Oddmash/oddmash-ui/actions/runs/45602528532).
- The matrix exercises React 18 and 19, Chromium, Firefox and WebKit, unit tests, typechecking, package build and relevant accessibility checks.
- Publication is gated on the exact integrated main candidate and the existing npm Trusted Publishing workflow.

**Full changelog:** https://github.com/Oddmash/oddmash-ui/compare/v0.5.0...v0.6.0
