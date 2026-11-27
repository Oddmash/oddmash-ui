# Motion Gallery

## Product boundary

Extend the existing Interaction Lab into an interactive, searchable catalog of motion recipes. Keep the existing `@oddmash/ui` package and component documentation stable. The gallery is a documentation feature, not a mandatory animation dependency. Mobile interactions remain independently installable as `@oddmash/mobile-interactions` after the workspace consolidation in #183.

## Experience

- Browse by category, intent, input modality and implementation technology; use existing shared search, filters and theme controls.
- Each card has a small interactive preview, a recognizable name and stability indicator. Start animations on deliberate user interaction, not on every card mount.
- A detail panel presents an accessible live stage, parameter controls, reset and replay, source files, dependency list, usage guidance and reduced-motion behavior.
- Copy JSX and styles from the same source compiled for the preview. Copy an optional implementation brief linking to the exact recipe revision.
- Provide shareable recipe URLs and include the catalog in the public agent-readable documentation index.

## Initial catalog

| Category | Recipes |
| --- | --- |
| Micro-interactions | Magnetic button, hold-to-confirm |
| Feedback | Copy confirmation, expandable notification stack |
| Loading | Orbit indicator, step progress transition |
| Gestures | Swipe action, drag-to-reorder |
| Transitions | Shared layout card, segmented indicator |
| Physics | Spring switch, elastic drag |

Use real existing package components for stable behavior where appropriate. Gesture examples should consume the migrated Mobile package once it is available. Experimental visual compositions live in the gallery, not the UI public exports.

## Architecture

Keep the existing demo application and build system. Introduce a dedicated gallery directory in the demo containing a typed recipe manifest, lazy-loaded preview modules and shared stage and controls. A recipe entry contains a stable ID, category, localized description key, tags, parameter schema with defaults and bounds, source references, dependencies, modality support, accessibility notes and stability. Use CSS transitions and keyframes or browser animation APIs first; justify additional dependencies per recipe. Keep raw source and live preview tied to the same revision.

The shared gallery shell uses UI tokens and components. Recipe presentation values are local and documented. Prefer scoped styles. Observe visibility and stop work for offscreen previews; never mount all heavy examples simultaneously. Avoid global event listeners and document cleanup. Provide a keyboard equivalent for meaningful pointer actions and a static or immediate transition when reduced motion is enabled.

## Delivery milestones

1. Define registry, route, localized navigation, searchable list and detail stage.
2. Build three representative recipes: copy confirmation, hold-to-confirm and spring switch. Verify source parity and parameter controls.
3. Add the remaining nine recipes in focused review batches. Use localized accessible labels and test keyboard, touch, narrow viewport and theme behavior.
4. Provide standalone example builds and agent-readable index entries. Document supported environments and limitations.
5. Expand the library only after reviewing usefulness and maintenance cost. Promote stable reusable behavior to published package exports through separate issues.

## Verification gates

Run existing typecheck, lint, unit tests, demo build and browser suite. Verify React 18/19 consumption where packaged code changes. Add registry uniqueness and source parity checks, deterministic interaction tests, reduced-motion tests, 320px layout checks and keyboard focus tests. Validate direct recipe URLs, copyable examples, localization in all four languages, and performance under a large gallery. Preserve the existing UI component tests and pending external contributions.

No npm release, package renaming, or source-repository archival is implied by this design.
