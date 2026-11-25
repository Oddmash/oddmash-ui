# Oddmash UI 0.5.0

## Highlights

Oddmash UI 0.5.0 expands the shared React library with reusable landing and documentation components, progressive navigation, honest clipboard feedback, and managed notifications. Static sites can reuse the styling without hydration while keeping their own content, routes, and product identity.

## Features and improvements

- [#91](https://github.com/Oddmash/oddmash-ui/pull/91): Add LinkCard with a left-to-right subtle hover fill and visible keyboard focus, CodeBlock for syntax-rendered examples, SiteHeader/SiteFooter/SiteNav layout primitives, and Prose for trusted rendered Markdown. All include native HTML-compatible classes.
- [#97](https://github.com/Oddmash/oddmash-ui/pull/97): Add ButtonLink, IconButton, IconLink, PlatformLink/PlatformLinks, and Kbd. Reuse GitHub and npm hover styling with a restrained pulse, configurable npm accent, visible focus, and reduced-motion support.
- [#97](https://github.com/Oddmash/oddmash-ui/pull/97): Add ClipboardButton and copyText for real copy success/error feedback, plus ToastProvider and useToast for managed notification lifetimes, bounded visible stacks, persistent important states, hover/focus expiry pauses, and focus restoration.
- [#97](https://github.com/Oddmash/oddmash-ui/pull/97): Add DocsNavigation, TableOfContents, ScrollHeader, LocalePicker, and static-compatible active-heading and scroll-header controllers. Products retain control of navigation, destination URLs, branding, and language routes.
- [#97](https://github.com/Oddmash/oddmash-ui/pull/97): Extend CommandPalette with optional controlled opening, an opt-in Mod+K shortcut, groups, descriptions, custom filtering, and result limits.

## Documentation

- Add live localized component previews and API guidance in English, Korean, Japanese, and Simplified Chinese.
- Document the React imports and static HTML class contracts, keyboard and accessibility behavior, shared feedback, navigation controls, and consumer-owned policy.

## Maintenance and tests

- [#89](https://github.com/Oddmash/oddmash-ui/pull/89): Add regression coverage for ToastViewport object and callback ref lifecycle and native attribute forwarding.
- [#88](https://github.com/Oddmash/oddmash-ui/pull/88): Update the review relay to the canonical Juliya repository name without changing its authorization or permissions.

## Installation

```sh
pnpm add @oddmash/ui@0.5.0
```

Load `@oddmash/ui/styles.css` once and import the React components or use their static class contracts.

## Compatibility

- Existing public component contracts, including controlled Toast and CommandPalette, remain available.
- React 18.3.1 and React 19 remain supported peer versions. ESM packaging and the shared styles entry remain unchanged.
- No additional runtime dependency is required. The library does not parse Markdown, provide a router, or introduce a global stylesheet reset. Consumers continue to supply trusted rendered content, navigation data, localization, and search content.

## Verification

- Documentation primitives passed the [React 18/19 and three-browser CI matrix](https://github.com/Oddmash/oddmash-ui/actions/runs/45566862990).
- Consolidated landing, navigation, search and feedback controls passed the [React 18/19 and three-browser CI matrix](https://github.com/Oddmash/oddmash-ui/actions/runs/45570452138).
- External ToastViewport lifecycle tests passed [their required CI](https://github.com/Oddmash/oddmash-ui/actions/runs/45563605561).
- The release workflow validates and builds the exact stable main revision before publishing with npm Trusted Publishing.

**Full changelog:** https://github.com/Oddmash/oddmash-ui/compare/v0.4.1...v0.5.0

Thanks to @mahisiddhant0-oss for the ToastViewport lifecycle regression coverage.
