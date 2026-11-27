# Browser verification

Use Node 24 and the pnpm version declared in the Mobile alpha checkout.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium firefox webkit
pnpm test:browser
```

Chromium, Firefox and WebKit run the shared keyboard and pointer scenarios for Bottom Sheet, Adaptive Dialog, Swipe Action, Pull to Refresh, Action Sheet and Bottom Navigation. The touch-specific swipe, pull and pinch scenarios use Chromium's emulated touch input and are skipped in Firefox and WebKit. The software keyboard scenario injects a visual viewport change to verify geometry and input preservation. Record physical iOS and Android results separately.
