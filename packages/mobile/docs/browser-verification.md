# Browser verification

Use Node 24 and the pnpm version declared in the repository. From the Oddmash UI workspace root, build UI before running Mobile tests that consume its distribution (see the [workspace guide](../../../docs/mobile-workspace.md)).

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build
pnpm --filter @oddmash/mobile-interactions exec playwright install chromium firefox webkit
pnpm --filter @oddmash/mobile-interactions run test:browser
```

Chromium, Firefox and WebKit run the shared keyboard and pointer scenarios for Bottom Sheet, Adaptive Dialog, Swipe Action, Pull to Refresh, Action Sheet and Bottom Navigation. The touch-specific swipe, pull and pinch scenarios use Chromium's emulated touch input and are skipped in Firefox and WebKit. The software keyboard scenario injects a visual viewport change to verify geometry and input preservation. Record physical iOS and Android results separately.
