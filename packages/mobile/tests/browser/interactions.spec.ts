import { expect, test } from '@playwright/test';

test('sheet opens, resizes with keyboard and restores focus', async ({page}) => {
  await page.goto('/'); const trigger = page.getByRole('button',{name:'Open filters'}); await trigger.click();
  const modal = page.getByRole('dialog',{name:'Filters'}); await expect(modal).toBeVisible();
  const before = (await modal.boundingBox())!.height; await page.getByRole('button',{name:'Resize sheet'}).press('End');
  await expect.poll(async () => (await modal.boundingBox())!.height).toBeGreaterThan(before);
  await page.keyboard.press('Escape'); await expect(modal).not.toBeVisible(); await expect(trigger).toBeFocused();
});

test('adaptive presentation preserves edited value', async ({page}) => {
  await page.setViewportSize({width:900,height:800}); await page.goto('/'); await page.getByRole('button',{name:'Edit profile'}).click();
  const name = page.getByRole('textbox',{name:'Name'}); await name.fill('Sam'); await page.setViewportSize({width:375,height:740});
  await expect(page.getByRole('dialog')).toHaveClass(/om-sheet/); await expect(name).toHaveValue('Sam');
});

test('action buttons and async refresh work without gestures', async ({page}) => {
  await page.goto('/'); await page.getByRole('button',{name:'Show actions'}).click(); await page.getByRole('button',{name:'Archive'}).click();
  await expect(page.getByRole('button',{name:'Restore message'})).toBeVisible(); await page.getByRole('button',{name:'Refresh',exact:true}).click();
  await expect(page.getByText('Revision 1')).toBeVisible(); await expect(page.getByRole('region', { name: 'Pull to Refresh' }).getByRole('status')).toHaveText('Refreshed');
});

test('swipe preview survives an unrelated cancellation and cancels without opening', async ({ page }) => {
  await page.goto('/');
  const content = page.locator('.om-swipe-content');
  const trigger = page.getByRole('button', { name: 'Show actions' });
  await content.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const bounds = (await content.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await content.evaluate((element) => {
    element.addEventListener('pointerdown', (event) => {
      if (event instanceof PointerEvent) element.setAttribute('data-pointer-id', String(event.pointerId));
    }, { once: true });
  });

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 55, y);
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -55, 0)');
  const pointerId = Number(await content.getAttribute('data-pointer-id'));
  await content.dispatchEvent('pointercancel', { bubbles: true, pointerId: pointerId + 1 });
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -55, 0)');

  await content.dispatchEvent('pointercancel', { bubbles: true, pointerId });
  await page.mouse.up();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('swipe opens actions and Escape restores focus', async ({ page }) => {
  await page.goto('/');
  const content = page.locator('.om-swipe-content');
  const trigger = page.getByRole('button', { name: 'Show actions' });
  await content.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const bounds = (await content.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 55, y);
  await expect(content).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -55, 0)');
  await page.mouse.up();
  const archive = page.getByRole('button', { name: 'Archive' });
  await expect(archive).toBeVisible();
  await archive.focus();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('pull handle announces and commits a refresh after an earlier success', async ({ page }) => {
  await page.goto('/');
  const refresh = page.getByRole('button', { name: 'Refresh', exact: true });
  const status = page.getByRole('region', { name: 'Pull to Refresh' }).getByRole('status');
  await refresh.click();
  await expect(status).toHaveText('Refreshed');

  const handle = page.locator('.om-refresh-handle');
  await handle.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const bounds = (await handle.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + 75, { steps: 8 });
  await expect(status).toHaveText('Release to refresh');
  await page.mouse.up();

  await expect(page.getByText('Revision 2')).toBeVisible();
  await expect(status).toHaveText('Refreshed');
});

test('touch swipes reveal actions and touch pulls refresh content', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium touch input through CDP');
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await page.goto('/');

  const drag = async (selector: string, dx: number, dy: number, end: 'touchEnd' | 'touchCancel' = 'touchEnd') => {
    const handle = page.locator(selector);
    await handle.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    const bounds = (await handle.boundingBox())!;
    const x = Math.round(bounds.x + bounds.width / 2);
    const y = Math.round(bounds.y + bounds.height / 2);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx, y: y + dy }] });
    await cdp.send('Input.dispatchTouchEvent', { type: end, touchPoints: [] });
  };

  await drag('.om-swipe-content', -56, 0, 'touchCancel');
  await expect(page.getByRole('button', { name: 'Show actions' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.om-swipe-content')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await drag('.om-swipe-content', -56, 0);
  await expect(page.getByRole('button', { name: 'Archive' })).toBeVisible();
  await drag('.om-refresh-handle', 0, 75);
  await expect(page.getByText('Revision 1')).toBeVisible();
});

test('sheet handle cycles through snap points with a pointer click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open filters' }).click();
  const sheet = page.getByRole('dialog', { name: 'Filters' });
  const handle = sheet.getByRole('button', { name: 'Resize sheet' });
  const before = (await sheet.boundingBox())!.height;
  await handle.click();
  await expect.poll(async () => (await sheet.boundingBox())!.height).toBeGreaterThan(before);
  await handle.click();
  await expect.poll(async () => (await sheet.boundingBox())!.height).toBeCloseTo(before);
});

test('small sheet snap points keep a nondismissible completion button reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/tests/browser/fixtures/controls.html');
  const trigger = page.getByRole('button', { name: 'Open compact sheet' });
  await trigger.click();
  const sheet = page.getByRole('dialog', { name: 'Compact sheet' });
  const finish = sheet.getByRole('button', { name: 'Finish' });
  await finish.click();
  await expect(sheet).toBeHidden();
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(finish).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(sheet).toBeHidden();
});

test('right-swipe trigger remains in the viewport with keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 240, height: 800 });
  await page.goto('/tests/browser/fixtures/controls.html');
  const trigger = page.getByRole('button', { name: 'Show actions' });
  await trigger.focus();
  await page.keyboard.press('Enter');
  const hide = page.getByRole('button', { name: 'Hide actions' });
  await expect(hide).toBeFocused();
  await expect(hide).toBeInViewport({ ratio: 1 });
  await hide.click();
  await trigger.click();
  await expect(hide).toBeInViewport({ ratio: 1 });
});

test('a sheet drag can restart after its handle disappears in dialog mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  const handle = dialog.getByRole('button', { name: 'Resize sheet' });
  const beginDrag = async () => {
    const bounds = (await handle.boundingBox())!;
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y - 65, { steps: 5 });
    await expect(dialog).toHaveCSS('transition-property', 'none');
  };
  await expect(handle).toBeVisible();
  await beginDrag();
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(handle).toHaveCount(0);
  await page.mouse.up();
  await page.setViewportSize({ width: 390, height: 800 });
  await expect(handle).toBeVisible();
  await expect(dialog).toHaveCSS('transition-property', 'height');
  await beginDrag();
  await page.mouse.up();
});

test('a sideways pointer gesture on the sheet handle does not cycle the snap point', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open filters' }).click();
  const sheet = page.getByRole('dialog', { name: 'Filters' });
  const handle = sheet.getByRole('button', { name: 'Resize sheet' });
  const before = (await sheet.boundingBox())!.height;
  const bounds = (await handle.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 20, y);
  await page.mouse.up();
  await expect(sheet).toHaveCSS('height', `${before}px`);
});

test('centered dialog scrolls to a native form and respects controlled closure', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 600 });
  await page.goto('/tests/browser/fixtures/controls.html');
  await page.getByRole('button', { name: 'Open tall dialog' }).click();
  const dialog = page.getByRole('dialog', { name: 'Tall dialog' });
  const submit = dialog.getByRole('button', { name: 'Complete tall dialog' });
  await expect(submit).not.toBeInViewport();
  await dialog.hover();
  await page.mouse.wheel(0, 1000);
  await expect(submit).toBeInViewport();
  await submit.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Close requests: 1')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

  await dialog.getByRole('checkbox', { name: 'Allow close' }).check();
  await submit.click();
  await expect(dialog).toBeHidden();
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
});

test('a modal dismisses only when the pointer press and release both hit the backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 600 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  const field = dialog.getByRole('textbox', { name: 'Name' });
  const bounds = (await field.boundingBox())!;
  await page.mouse.move(bounds.x + 8, bounds.y + 8);
  await page.mouse.down();
  await page.mouse.move(20, 20);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await page.mouse.click(20, 20);
  await expect(dialog).toBeHidden();
});

test('adaptive dialogs keep focus inside the modal when a focused resize handle is removed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  const handle = dialog.getByRole('button', { name: 'Resize sheet' });
  await handle.focus();
  await page.setViewportSize({ width: 900, height: 800 });
  await expect(handle).toHaveCount(0);
  await expect(dialog.getByRole('textbox', { name: 'Name' })).toBeFocused();
});

test('swipe surface is opaque over closed actions', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('.om-swipe');
  const color = await row.evaluate((element) => getComputedStyle(element).backgroundColor);
  const content = row.locator('.om-swipe-content');
  await expect(content).toHaveCSS('background-color', color);
  await expect(row.getByRole('button', { name: 'Archive' })).toHaveCount(0);
  await row.getByRole('button', { name: 'Show actions' }).click();
  await expect(row.getByRole('button', { name: 'Archive' })).toBeVisible();
  await row.getByRole('button', { name: 'Hide actions' }).click();
  await expect(content).toHaveCSS('background-color', color);
  await expect(row.getByRole('button', { name: 'Archive' })).toHaveCount(0);
});

test('a swipe starting on a form label does not open the actions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/tests/browser/fixtures/controls.html');
  const item = page.getByText('Right-swipe item');
  const bounds = (await item.boundingBox())!;
  const row = page.locator('.om-swipe-track');
  const rowBounds = (await row.boundingBox())!;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(bounds.x + 32, y);
  await page.mouse.down();
  await page.mouse.move(rowBounds.x + rowBounds.width - 8, y, { steps: 5 });
  await page.mouse.up();
  await expect(page.getByRole('button', { name: 'Show actions' })).toHaveAttribute('aria-expanded', 'false');
  const checkbox = page.getByRole('checkbox', { name: 'Right-swipe item' });
  await expect(checkbox).not.toBeChecked();
  await item.click();
  await expect(checkbox).toBeChecked();
});

test('a dismissible single-point sheet has a working dismiss handle', async ({ page }) => {
  await page.goto('/tests/browser/fixtures/controls.html');
  const trigger = page.getByRole('button', { name: 'Open single-point sheet' });
  await trigger.click();
  const sheet = page.getByRole('dialog', { name: 'Single-point sheet' });
  const handle = sheet.getByRole('button', { name: 'Dismiss sheet' });
  await expect(sheet.getByRole('button', { name: 'Resize sheet' })).toHaveCount(0);
  await handle.click();
  await expect(sheet).toBeHidden();
  await trigger.click();
  await handle.press('Enter');
  await expect(sheet).toBeHidden();
});

test('each preview demo includes its usage inputs and runnable component example', async ({ page }) => {
  await page.goto('/');
  for (const component of ['AdaptiveDialog', 'SwipeAction', 'PullToRefresh']) {
    const disclosure = page.getByText(`${component} example and options`, { exact: true });
    await disclosure.click();
    const example = disclosure.locator('..').locator('pre');
    await expect(example).toBeVisible();
    await expect(example).toContainText(`<${component}`);
    await expect(example).toContainText('@oddmash/mobile-interactions/');
  }
});

test('the Mobile landing opens its live example and in-site quickstart on a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const preview = page.getByRole('region', { name: 'Inbox' });
  const reveal = preview.getByRole('button', { name: 'Show actions' });
  await expect(reveal).toBeInViewport();
  await reveal.press('Enter');
  await preview.getByRole('button', { name: 'Archive' }).press('Enter');
  const restore = preview.getByRole('button', { name: 'Restore message' });
  await expect(restore).toBeFocused();
  await restore.press('Enter');
  await expect(reveal).toBeFocused();

  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/#quickstart$/);
  await expect(page.getByRole('button', { name: 'Copy build commands' })).toBeInViewport();
});

test('the narrow landing keeps the repository icon and zoomed swipe actions usable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const github = nav.getByRole('link', { name: 'Oddmash Mobile on GitHub' });
  const sourceUrl = 'https://github.com/Oddmash/oddmash-mobile';
  await expect(github).toHaveAttribute('href', sourceUrl);
  await github.focus();
  await expect(github).toBeFocused();
  const bounds = (await github.boundingBox())!;
  // Firefox may round a position delta slightly below the computed 44 CSS pixels.
  expect(bounds.width).toBeGreaterThanOrEqual(43.99);
  expect(bounds.height).toBeGreaterThanOrEqual(43.99);
  await page.route(sourceUrl, (route) => route.fulfill({ body: 'Repository destination' }));
  await github.press('Enter');
  await expect(page).toHaveURL(sourceUrl);
  await page.goto('/');

  const preview = page.getByRole('region', { name: 'Inbox' });
  const reveal = preview.getByRole('button', { name: 'Show actions' });
  await expect(reveal).toBeInViewport({ ratio: 1 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await reveal.click();
  await preview.getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(preview.getByRole('button', { name: 'Restore message' })).toBeFocused();
});
