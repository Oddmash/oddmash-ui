# Product brief

## Problem
Developers building mobile web apps often integrate separate gesture, overlay, refresh and viewport packages. Each integration has different lifecycle, styling and accessibility assumptions. Combining them can cause gesture conflicts, keyboard overlap and inconsistent dismissal.

## Audience and first useful action
React and Next.js developers building mobile-first web apps, PWAs or hybrid web views without replacing their current router or design system. A developer should be able to install one package, add a sheet to an existing page, and interact with it on real devices.

## Positioning
Native-like interactions for the web. Behavior-first, styleable, independently imported primitives. Default styles are neutral; no claim of OS parity or affiliation with Apple, Google or Samsung.

## Version 1 goal

Make the four mobile interactions dependable in existing React and Next.js apps, with independently importable components, scoped styling, and shared rules for gesture ownership, keyboard interaction and focus. Use filtering and inbox workflows as the reference experiences. Verify them in current iOS Safari and Android Chrome, with VoiceOver and TalkBack, and in at least one consumer app. Use the measured bundle and interaction comparisons to decide whether another primitive would improve the package.

## Alternatives
| Alternative | Strength | Evaluation question |
| --- | --- | --- |
| [Framework7](https://framework7.io/docs/sheet-modal) | Full mobile application framework | Can customers retain their routing and app shell? |
| [Base UI](https://base-ui.com/react/components/drawer) | Headless drawer, snap points, keyboard handling | Do additional interaction primitives justify a separate package? |
| [React Spring Bottom Sheet](https://react-spring.bottom-sheet.dev/) | Focused sheet interactions | Does consistent shared infrastructure improve multi-component integration? |
| [Konsta UI](https://konstaui.com/) | Native-style themes | Does behavior-first styling freedom meet a distinct need? |

## Success evidence
Build equivalent filtering and inbox workflows using a conventional package combination and Oddmash Mobile. Compare direct/transitive dependencies, gzip bundle delta, integration time, source lines, failing device tasks, accessibility and recovery. Use the same fixture, browser versions and acceptance scenarios. Baselines are unmeasured; do not claim improvement until measured. Collect feedback from at least two independent developers and one real consumer project before claiming validated demand.

## Non-goals
Full UI framework, routing replacement, native OS APIs, compulsory Tailwind, pixel-perfect copies of proprietary OS assets, analytics collection, account system, native SDK. Themes are optional later work.
