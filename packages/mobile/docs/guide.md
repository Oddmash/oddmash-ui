# Oddmash Mobile guide

Add mobile interactions to an existing React app. Each of the six primitives is available from its own package subpath, and the optional stylesheet scopes its styles to the components. Your app keeps its routing, data, and visual identity.

## Start with a workflow

- [Install the source alpha and render a filter sheet](quickstart.md).
- [Compose sheets, inbox gestures, and app navigation](composition.md).
- [Check the support matrix and verification limits](alpha.md).

## Choose a component

| Goal | Component |
| --- | --- |
| Resize a modal panel while keeping the current page in context | [Bottom Sheet](components/bottom-sheet.md) |
| Render the same form as a bottom sheet or centered dialog | [Adaptive Dialog](components/adaptive-dialog.md) |
| Reveal row actions and commit only an explicit choice | [Swipe Action](components/swipe-action.md) |
| Refresh existing data asynchronously from a handle or button | [Pull to Refresh](components/pull-to-refresh.md) |
| Offer an explicit menu of choices with safe cancellation | [Action Sheet](components/action-sheet.md) |
| Link to a few top-level app destinations and mark the current page | [Bottom Navigation](components/bottom-navigation.md) |

See [native behavior](native-interaction-parity.md) and the [verification record](alpha-verification.md) to distinguish browser-tested behavior from outstanding device work.
