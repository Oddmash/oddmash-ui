# Shared component interaction review

Scope: source and style review of the public component families on develop, followed by focused implementation. The existing component browser matrix remains the rendered acceptance gate; this document does not claim a manual visual or assistive-technology pass.

| Family | Observed behavior | Decision |
| --- | --- | --- |
| Button, Input, Textarea | Button color changed abruptly; text controls had no shared hover border response. | Harmonize semantic interaction transitions without changing geometry or invalid/focus priority. |
| Checkbox, Radio, Switch | Checked state is native; the switch thumb immediately changes alignment. | Preserve native semantics and animate thumb travel, with reduced-motion and direction equivalents. |
| Select, Slider | Custom Select has keyboard/type-ahead behavior; Slider uses native range behavior. | Preserve existing APIs and browser controls. Verify hover, focus and disabled states in the existing matrix. |
| Card, Badge, Avatar, Field, Separator, Table | Static wrappers use shared semantic surfaces and spacing. | Retain existing geometry; avoid decorative movement or changing consumer markup. |
| Tabs, Dialog, Alert | Radix focus and dismissal contracts and existing motion are established; alert severity is explicit. | Preserve these contracts and existing screenshot baselines; do not make a new overlay family. |
| Breadcrumbs, Pagination, Accordion | Navigation buttons lacked shared hover/disabled treatment; Accordion has native details semantics. | Add restrained surface feedback and explicit breadcrumb focus without altering navigation. |
| EmptyState, Progress, Skeleton, Spinner | Placeholder and native progress remain separate from live feedback. | Keep progress semantic and use a restrained finite skeleton pulse; preserve reduced-motion spinner behavior. |
| CommandPalette | Search, active option and keyboard selection are already present. | Preserve behavior and exercise the existing browser and component tests. |
| Toast | Text glyphs, abrupt removal and layout jumps. | Provide distinct SVG state cues, controlled entry/exit, measured stack positions, pointer/focus expansion and overflow handling. |

## Verification

Use the existing full component matrix in light and dark themes, browser-specific keyboard checks, responsive and reduced-motion tests, and existing Select/Dialog visual baselines. The new Toast test exercises a three-item stack, pointer expansion, keyboard dismissal, focus restoration, and 320 px reflow. Verify rapid repeated actions, variable-length content and touch on actual consumers before a release. Review both collapsed and expanded states, rather than relying on a still image of a single notification.
