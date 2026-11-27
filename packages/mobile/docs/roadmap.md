# Delivery roadmap

| Milestone | Scope | Exit gate |
| --- | --- | --- |
| M0 | Planning and decisions | Review docs, identify unknowns and approve first slice |
| M1 | Build/test skeleton and minimal shared contracts | Frozen install, exports, typecheck, SSR import and pure gesture tests |
| M2 | Bottom Sheet vertical slice | Functional demo, cancellation, scroll/focus/keyboard and accessibility regression evidence |
| M3 | Adaptive Dialog | Responsive mode and state preservation |
| M4 | Swipe Action and Pull to Refresh | Independent and combined gesture tests |
| M5 | Alpha package and documentation | Package smoke install, comparative fixture, support matrix, explicit release approval |
| M6 | Stable release | Real device gates, consumer feedback, documented limitations |
| Native interaction expansion | Action Sheet and Bottom Navigation, with targeted improvements to the first four primitives | Browser, accessibility, package and [native comparison evidence](native-interaction-parity.md) |
| Later | Swipe Pager, Context Menu, Wheel Picker, Reorderable List, Large Title, One-handed Layout | Evidence of demand and shared infrastructure fit |
| Research only | Swipe Back, OS-inspired visual presets | Browser history/OS gesture conflicts, trademark and support scope |

Implement shared infrastructure only as required by the first working component. Each milestone gets labeled, scoped issues with measurable acceptance before implementation. No deadline estimates until baseline exists.
