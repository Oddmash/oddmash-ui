# UI quality and workspace migration roadmap

## Product direction

Keep the current landing and component documentation as the stable foundation. The objective is a production-ready React UI system with portable styling and deliberate, accessible motion. The gallery is a secondary discovery surface for working examples, not a replacement homepage or a separate product. Improve actual component behavior before adding decorative recipes.

Preserve every existing public import, default appearance, ESM output, React 18/19 support, CSS contract, native form behavior and no-global-reset boundary. Do not add animation dependencies to the core merely for attractive demos. Use shared semantic tokens, scoped overrides and opt-in experimental recipes.

## Work packages and dependency order

| Phase | Issue | Deliverable | Prerequisite |
| --- | --- | --- | --- |
| A | [#186](https://github.com/Oddmash/oddmash-ui/issues/186) | Visual and motion audit, baseline and prioritized inventory | Current develop |
| B | [#187](https://github.com/Oddmash/oddmash-ui/issues/187) | Semantic motion roles and interruption policy | A |
| B | [#188](https://github.com/Oddmash/oddmash-ui/issues/188) | Portable theme and scoped visual profiles | A; coordinate [#172](https://github.com/Oddmash/oddmash-ui/issues/172) and [#104](https://github.com/Oddmash/oddmash-ui/issues/104) |
| C | [#189](https://github.com/Oddmash/oddmash-ui/issues/189) | Press, toggle and selection polish | Motion foundation; coordinate [#104](https://github.com/Oddmash/oddmash-ui/issues/104) |
| C | [#190](https://github.com/Oddmash/oddmash-ui/issues/190) | Overlay and disclosure transitions | Motion foundation; coordinate [#182](https://github.com/Oddmash/oddmash-ui/issues/182) |
| C | [#191](https://github.com/Oddmash/oddmash-ui/issues/191) | Feedback, notification and loading motion | Motion foundation |
| D | [#192](https://github.com/Oddmash/oddmash-ui/issues/192) | Recipe registry and playground infrastructure | Motion plan and foundation |
| D | [#193](https://github.com/Oddmash/oddmash-ui/issues/193) | Twelve independently runnable recipes in review batches | Registry; Mobile gestures after [#195](https://github.com/Oddmash/oddmash-ui/issues/195) |
| E | [#194](https://github.com/Oddmash/oddmash-ui/issues/194) | Visual, motion, performance and compatibility gates | Baseline; validate each completed batch |
| M1 | [#195](https://github.com/Oddmash/oddmash-ui/issues/195) | Import Mobile history and package, installable workspace | Clean current source/destination |
| M2 | [#196](https://github.com/Oddmash/oddmash-ui/issues/196) | Unified docs, CI and release configuration | M1 |
| M3 | [#197](https://github.com/Oddmash/oddmash-ui/issues/197) | Retained Mobile device/alpha verification gates | M1, M2 |
| M4 | [#198](https://github.com/Oddmash/oddmash-ui/issues/198) | Historical records, redirects, backup, retirement | M1–M3 and verified destination |

Parent migration [#183](https://github.com/Oddmash/oddmash-ui/issues/183); parent gallery [#184](https://github.com/Oddmash/oddmash-ui/issues/184). Earlier design PR [#185](https://github.com/Oddmash/oddmash-ui/pull/185) contains the gallery plan. Do not rewrite or duplicate active reviews.

## Implementation contracts

### Visual design

Keep existing brand on the site, not embedded in portable component behavior. Use canonical DTCG JSON (`tokens/primitive.json`, both semantic themes) and generator. Use semantic roles for colors, radius, spacing, typography, density, elevation and control geometry. Test opt-in nested scopes, portal containers, forced colors and contrast. Keep existing defaults; prefer scoped theme controls to adding a separate variant for every visual treatment.

### Motion

Use CSS first, with transform and opacity when appropriate; use WAAPI or measured layout animation only where necessary. Define distinct semantic roles for press, reveal, exit and reflow; measure actual transitions instead of applying one generic easing. A state reversal begins from the current rendered position. Cancel stale work on unmount, reduced-motion changes, rapid input and new gestures. Never delay accessible names, form state or focus to wait for animation. Honor reduced motion with static or immediate alternatives.

### Component families

- Controls: preserve native input ref, form submit and keyboard semantics for Button, Switch, Checkbox and Radio; support predictable press/release and rapid state changes.
- Selection: maintain Radix Tabs semantics, native range behavior and keyboard operation; animate indicators without affecting focus or geometry.
- Overlay: preserve Dialog focus trap/restore and explicit portal containers; preserve Select dismissal, Tooltip behavior and native disclosure semantics.
- Feedback: maintain managed live regions, pending/success/failure distinctions, dismissibility, notification stack focus and timer pause. No offscreen looping.

### Gallery and documentation

Build into existing Vite demo and static Pages flow. Use localized recipe metadata, stable IDs, source parity, bounded parameter controls, shared search/filters, explicit trigger, reset/replay, direct links and clean source exports. Preserve user-facing four-language documentation and public llms.txt. Use real exported components for established behavior; experimental recipes remain docs-only until separately reviewed. Avoid arbitrary visual effects that harm discoverability or performance.

### Mobile

Retain package identity `@oddmash/mobile-interactions` and six existing exports: Bottom Sheet, Adaptive Dialog, Swipe Action, Pull to Refresh, Action Sheet, Bottom Navigation. Keep experimental alpha status; preserve CSS/types, tests, native mobile fallbacks, React peers, gzip budget and prior device evidence. Make a history-preserving import into `packages/mobile` with a pnpm workspace; initially keep UI package root stable to reduce conflict, then evaluate optional root relocation separately. Never copy unpublished credentials or make registry publication implicit.

## Verification and collaboration

For every issue: inspect current develop and linked discussions, active claims and open PRs; claim the scoped work with status label and comment; use an isolated checkout, issue-linked feature branch, reviewable commits and develop target. Preserve pending external contributions [#70](https://github.com/Oddmash/oddmash-ui/pull/70) and [#171](https://github.com/Oddmash/oddmash-ui/pull/171) and any later contributor interest. Do not request repeated reviews.

Use current local project commands and existing CI. Run token checks, typecheck, lint, unit tests, build, bundle checks, demo build and browser tests appropriate to changed surfaces. Verify both themes, 320/390px and desktop, keyboard/touch, forced colors, reduced motion, rapid input and interruptibility, focus and native form semantics. Test Chromium, Firefox and WebKit, standalone packed React 18/19 consumers and SSR. Record exact commit and honest actual results; physical device coverage is separate from emulation. A subjective design target is not evidence of quality.

## Migration safety and current handoff

Source issue [Oddmash/oddmash-mobile#7](https://github.com/Oddmash/oddmash-mobile/issues/7) has remaining physical Android/iOS, VoiceOver and registry authentication work. Preserve it and its complete discussion. Record all source issues, PRs, comments, branches, tags, release and deployment evidence. GitHub-native transfers where supported must be validated, and nontransferable records backed up. Deleting the source before verified migration risks losing historical PR links and public Pages URLs.

Track the active history-preserving workspace import in PR [#201](https://github.com/Oddmash/oddmash-ui/pull/201). The source repository must remain available until full archival records, documentation and deployment continuity are verified. Confirm the latest source and destination refs before work. Do not archive or delete the original repository until [#198](https://github.com/Oddmash/oddmash-ui/issues/198) is verified.

## Recommended first action for the next session

Start [#186](https://github.com/Oddmash/oddmash-ui/issues/186) after checking active claims; coordinate Mobile integration through [#195](https://github.com/Oddmash/oddmash-ui/issues/195) and PR [#201](https://github.com/Oddmash/oddmash-ui/pull/201). Preserve contributor PRs. Then execute the dependency table, splitting implementation into focused PRs instead of a single sweeping redesign. Release only with the existing approval and verification gates.
