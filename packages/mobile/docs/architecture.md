# Architecture

## Proposed structure
A single public package @oddmash/mobile-interactions in this independent repository. Keep framework-neutral logic internal until there is evidence of another adapter consumer.

| Layer | Responsibility |
| --- | --- |
| core/gesture | Pointer session, axis intent, velocity, cancellation and gesture ownership |
| core/viewport | Visual viewport snapshot, safe area CSS integration, resize lifecycle |
| core/overlay | Shared stack, dismiss ownership, focus and scroll lock integration |
| core/motion | Interruptible transitions, reduced-motion policy |
| react/ | Hooks and renderable primitives |
| styles/ | Optional scoped CSS and custom properties |
| examples/ | Realistic scenarios and integration fixtures |

No DOM reads at module initialization. Add client boundaries only where necessary. Keep controlled state authoritative; callbacks report requested changes with reasons. Avoid global listeners unless justified, reference counted and removed on unmount.

## Tooling proposal
TypeScript, React 18/19 peer dependencies, Node 24, pnpm 11.25.0, ESM output, declaration files, selective exports, Vitest for pure behavior, Playwright for rendering and regression. Commit a frozen lockfile once implemented. Test Next.js App Router separately for SSR and hydration. Exact dependency versions and build tool remain to be selected by compatibility evidence.

## Dependency strategy
Compare a custom gesture state machine against maintained primitives and native platform functionality. Reuse maintained accessible dialog/focus primitives where beneficial; evaluate Base UI and native dialog behavior first. Do not reimplement proven semantics merely to claim zero dependencies. Audit license, size, supported React versions, maintenance and browser behavior. Record decision in decisions.md.

## CSS and integration
Optional stylesheet with scoped class names and CSS variables. No global reset, CSS framework or mandatory Oddmash UI dependency. Provide a documented composition example with Oddmash UI. No router or history mutation in the MVP.

## Public API lifecycle
Use per-component entry points and a root convenience export. Proposed APIs remain experimental until reviewed. Validate invalid configuration deterministically, do not silently corrupt state, and document controlled/uncontrolled transitions. Add migration notes for breaking changes.
