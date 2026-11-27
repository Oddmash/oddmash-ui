import { expect, test } from '@playwright/test';

test('action sheet opens on Cancel, restores focus and only commits explicit choices', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 625 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Open report actions' });
  const sheet = page.getByRole('dialog', { name: 'Report actions' });
  const cancel = sheet.getByRole('button', { name: 'Cancel', exact: true });
  const duplicate = sheet.getByRole('button', { name: 'Duplicate report' });

  await page.evaluate(() => {
    document.addEventListener('focusin', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || !target.closest('.om-action-sheet')) return;
      const previous = document.body.dataset.sheetFocus ?? '';
      document.body.dataset.sheetFocus = `${previous}|${target.textContent?.trim()}`;
    });
  });
  await trigger.click();
  await expect(sheet).toHaveAccessibleDescription('Choose an action for the weekly report.');
  await expect(cancel).toBeFocused();
  await expect(page.locator('body')).toHaveAttribute('data-sheet-focus', '|Cancel');
  await expect(sheet.getByRole('button', { name: 'Share report' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.getByText('Report duplicated', { exact: true })).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 340 });
  await page.addStyleTag({ content: 'html { font-size: 200%; } .om-action-sheet * { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }' });
  await trigger.press('Enter');
  await expect(cancel).toBeInViewport({ ratio: 1 });
  await cancel.click();
  await expect(sheet).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await duplicate.press('Enter');
  await expect(sheet).toBeHidden();
  await expect(page.getByText('Report duplicated', { exact: true })).toBeVisible();
  await expect(trigger).toBeFocused();
});

test('bottom navigation preserves browser history and marks the current destination', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Example app destinations' });
  const inbox = nav.getByRole('link', { name: 'Inbox', exact: true });
  const projects = nav.getByRole('link', { name: 'Projects', exact: true });
  await expect(inbox).toHaveAttribute('aria-current', 'page');
  expect((await projects.boundingBox())!.height).toBeGreaterThanOrEqual(44);

  await projects.press('Enter');
  await expect(page).toHaveURL(/#navigation-projects$/);
  await expect(projects).toHaveAttribute('aria-current', 'page');
  await expect(inbox).not.toHaveAttribute('aria-current', 'page');
  await page.goBack();
  await expect(inbox).toHaveAttribute('aria-current', 'page');
});

test('bottom navigation links remain within the page with long labels and enlarged text', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 340 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Example app destinations' });
  await nav.evaluate((node) => {
    for (const label of node.querySelectorAll('a > span')) {
      label.textContent = `Open destination ${label.textContent} and recent activity`;
    }
  });
  await page.addStyleTag({ content: 'html { font-size: 200%; } .om-bottom-nav * { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  const last = nav.getByRole('link', { name: /Account and recent activity/ });
  await last.focus();
  await expect(last).toBeInViewport({ ratio: 0.5 });
});

test('wide adaptive dialog tracks the visible viewport without losing the edited field', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 780 });
  await page.addInitScript(() => {
    const visual = new EventTarget();
    Object.assign(visual, { width: 900, height: 780, offsetTop: 0 });
    Object.defineProperty(window, 'visualViewport', { value: visual });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Edit profile' }).click();
  const dialog = page.getByRole('dialog', { name: 'Edit profile' });
  const name = dialog.getByRole('textbox', { name: 'Name' });
  await expect(dialog).toHaveClass(/om-centered/);
  await name.evaluate((field) => { field.closest('label')!.style.marginBlockStart = '280px'; });
  await name.fill('Draft name');
  await page.evaluate(() => {
    Object.assign(window.visualViewport!, { height: 260, offsetTop: 40 });
    window.visualViewport!.dispatchEvent(new Event('resize'));
  });
  await expect(dialog).toHaveCSS('max-height', '221px');
  const bounds = (await dialog.boundingBox())!;
  expect(bounds.y).toBeGreaterThanOrEqual(40);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(300);
  await expect(name).toHaveValue('Draft name');
  await expect(name).toBeFocused();
  await expect.poll(async () => {
    const field = (await name.boundingBox())!;
    const frame = (await dialog.boundingBox())!;
    return field.y >= frame.y && field.y + field.height <= frame.y + frame.height + 1;
  }).toBe(true);
  await dialog.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByRole('button', { name: 'Edit profile' })).toBeFocused();
});

test('refresh keeps the focused control and announces pending work outside the busy content', async ({ page }) => {
  await page.goto('/tests/browser/fixtures/controls.html');
  const refresh = page.getByRole('region', { name: 'Refresh fixture' });
  const trigger = refresh.getByRole('button', { name: 'Refresh', exact: true });
  const status = refresh.getByRole('status');
  await trigger.focus();
  await trigger.press('Enter');
  await expect(status).toHaveText('Refreshing…');
  await expect(trigger).toBeDisabled();
  await expect(trigger).toHaveAttribute('aria-disabled', 'true');
  await expect(trigger).not.toHaveAttribute('disabled');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS('opacity', '0.55');
  await expect(refresh.getByRole('button', { name: 'Unavailable content action' })).toHaveCSS('opacity', '1');
  await trigger.press('Enter');
  await expect(refresh.getByText('Refresh requests: 1')).toBeVisible();
  expect(await status.evaluate((element) => element.closest('[aria-busy="true"]'))).toBeNull();
  await refresh.getByRole('button', { name: 'Finish request' }).dispatchEvent('click');
  await expect(status).toHaveText('Refreshed');
  await expect(trigger).toBeEnabled();
  await expect(trigger).toBeFocused();
});

test('disabling a refreshing gesture clears an armed pull even when reenabled before release', async ({ page }) => {
  await page.goto('/tests/browser/fixtures/controls.html');
  const refresh = page.getByRole('region', { name: 'Refresh fixture' });
  const status = refresh.getByRole('status');
  const handle = refresh.locator('.om-refresh-handle');
  await handle.scrollIntoViewIfNeeded();
  const bounds = (await handle.boundingBox())!;
  const x = bounds.x + bounds.width / 2;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + 80, { steps: 4 });
  await expect(status).toHaveText('Release to refresh');
  await refresh.getByRole('button', { name: 'Pause refresh' }).press('Enter');
  await expect(status).toHaveText('');
  await refresh.getByRole('button', { name: 'Resume refresh' }).press('Enter');
  await page.mouse.up();
  await expect(status).toHaveText('');
  await expect(refresh.getByRole('button', { name: 'Refresh', exact: true })).toBeEnabled();
});

test('sheet release responds to the last flick and ignores momentum after a pause', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open filters' }).click();
  const dialog = page.getByRole('dialog', { name: 'Filters' });
  const handle = dialog.getByRole('button', { name: 'Resize sheet' });
  const height = async () => (await dialog.boundingBox())!.height;
  const compactHeight = await height();
  const flick = async (before: boolean) => {
    const bounds = (await handle.boundingBox())!;
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    if (before) await page.waitForTimeout(350);
    await page.mouse.move(x, y - 60);
    if (!before) await page.waitForTimeout(350);
    await page.mouse.up();
  };

  await flick(false);
  await expect.poll(height).toBeCloseTo(compactHeight);
  await flick(true);
  await expect.poll(height).toBeGreaterThan(compactHeight + 250);
});

test('pinching a swipe row zooms the page without revealing actions', async ({ browser, browserName, baseURL }) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium touch input through CDP');
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    await page.goto(baseURL!);
    const row = page.locator('.om-swipe-content');
    await row.scrollIntoViewIfNeeded();
    const bounds = (await row.boundingBox())!;
    const x = Math.round(bounds.x + bounds.width / 2);
    const y = Math.round(bounds.y + bounds.height / 2);
    const cdp = await page.context().newCDPSession(page);
    const points = (delta: number) => [{ id: 1, x: x - delta, y }, { id: 2, x: x + delta, y }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(16) });
    for (const delta of [28, 44, 64, 96]) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(delta) });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => page.evaluate(() => visualViewport?.scale)).toBeGreaterThan(1);
    await expect(page.getByRole('button', { name: 'Show actions' })).toHaveAttribute('aria-expanded', 'false');
  } finally {
    await page.close();
  }
});

test('a stationary second finger on refresh content cancels an armed pull', async ({ browser, browserName, baseURL }) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium touch input through CDP');
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    await page.goto(new URL('/tests/browser/fixtures/controls.html', baseURL).href);
    await page.addStyleTag({ content: 'html { touch-action: none; }' });
    const refresh = page.getByRole('region', { name: 'Refresh fixture' });
    const handle = refresh.locator('.om-refresh-handle');
    const content = refresh.getByText('Refreshable content');
    const status = refresh.getByRole('status');
    await handle.scrollIntoViewIfNeeded();
    const box = (await handle.boundingBox())!;
    const body = (await content.boundingBox())!;
    const x = Math.round(box.x + box.width / 2);
    const y = Math.round(box.y + box.height / 2);
    const cdp = await page.context().newCDPSession(page);
    const start = { id: 1, x, y };
    const pulled = { ...start, y: y + 85 };
    const second = { id: 2, x: Math.round(body.x + 24), y: Math.round(body.y + body.height / 2) };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pulled] });
    await expect(status).toHaveText('Release to refresh');
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pulled, second] });
    await expect(status).toHaveText('');
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(status).toHaveText('');
    await expect(refresh.getByRole('button', { name: 'Refresh', exact: true })).toBeEnabled();
  } finally {
    await page.close();
  }
});
