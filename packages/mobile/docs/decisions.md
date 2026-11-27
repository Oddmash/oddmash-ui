# Decisions

| ID | Status | Decision and rationale |
| --- | --- | --- |
| ADR-001 | Accepted direction | Independent repository and @oddmash/mobile-interactions package, compatible with but not dependent on Oddmash UI. |
| ADR-002 | Proposed | React-first, no router or CSS framework required. Revisit adapters only on demand. |
| ADR-003 | Proposed | Behavior-first optional neutral styles, no copied OS assets or claims of equivalence. |
| ADR-004 | Open | Choose overlay semantics and gesture dependency after comparing native dialog and maintained primitives with the same fixture. |
| ADR-005 | Open | Snap-point contract and nested scrolling precedence; prototype handle-only fallback. |
| ADR-006 | Open | Physical device and assistive technology availability, browser minimums and performance budget. |
| ADR-007 | Open | Package name availability, npm ownership/trusted publishing, release CI. |
| ADR-008 | Open | User demand and comparative measurements; no superiority claims until verified. |

For each open decision, record alternatives, evidence, compatibility, maintenance cost and reversal plan before committing to a stable API. Review M0 before expanding beyond Bottom Sheet.
