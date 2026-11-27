# Shared interaction contracts

## Gesture lifecycle
States: idle, pending, dragging, settling, canceled. A session has one pointer owner. Start only after axis and distance intent; a competing scroll or control keeps ownership. Handle pointercancel, lost capture, unmount, orientation changes and multi-touch. Cancel without committing destructive actions. Settling may be interrupted by a new valid gesture. Preserve native zoom and selection.

Inputs: pointer ID, coordinates, monotonic timestamps, active axis, bounds and allowed direction. Output: displacement, velocity, intent and cancellation reason. No React render on every raw pointer event; evaluate animation-frame coalescing and CSS transforms.

## Overlay
Only the top modal responds to dismissal; Escape, explicit close and backdrop are governed by policy. Focus enters modal, stays within it while modal, and returns to a still-connected trigger or logical fallback. Nested overlays share reference-counted scroll lock. Restore original document styles and scroll position on last release.

## Viewport
Use CSS safe-area-inset variables, dynamic viewport units and VisualViewport where supported. VirtualKeyboard is progressive enhancement, not a hard dependency. Update on resize/scroll and orientation changes; preserve focused input visibility. Do not disable zoom. Server snapshot is deterministic; hydration must not mismatch.

## Motion
Transitions follow actual gesture progress, retarget from current position and settle once. Reduced motion removes non-essential travel but preserves state and feedback. No indefinite decorative animation.

## Accessibility
Keyboard and explicit button alternatives to every drag-only action; meaningful labels, focus-visible, live announcements where useful, and no background interaction in modal states. WCAG 2.2 AA is a target, not a verified claim.
