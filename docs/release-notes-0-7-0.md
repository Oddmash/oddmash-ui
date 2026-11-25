# Oddmash UI 0.7.0

Oddmash UI 0.7.0 expands the JSON token foundation and improves the shared Select and Toast interactions, alongside a more accessible and flexible documentation playground.

```sh
pnpm add @oddmash/ui@0.7.0
```

## Shared foundations

- Component dimensions, fixed durations, layer values, focus and interaction constants are maintained in JSON and generated into CSS, TypeScript and Sass breakpoints. Existing public token keys and CSS entry points remain compatible.
- Token consistency checks reject raw fixed dimensions and duration literals in shared component Sass, while allowing structural geometry and generated outputs.
- Select distinguishes pointer hover, selected and keyboard-active states, contains listbox scrolling and positions its menu within the viewport where supported.
- ToastProvider shows the remaining timeout for finite notifications and pauses on hover and keyboard focus. Persistent notifications omit the countdown. Controlled Toast accepts an optional decorative progress fraction without starting an expiry timer.

## Documentation experience

- System, Light and Dark themes with persisted preferences.
- Modal documentation search, accessible platform icon links and preserved sidebar position.
- Scoped Toast previews and accessible fullscreen playgrounds with local state preservation.

## Compatibility

React 18.3.1 and React 19 remain supported. The package keeps its ESM-only entry points and no-global-reset boundary. Existing consumers can upgrade without changing their component API usage.

**Full changelog:** https://github.com/Oddmash/oddmash-ui/compare/v0.6.0...v0.7.0
