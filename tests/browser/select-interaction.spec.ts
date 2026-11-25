import { expect, test } from '@playwright/test';

test('select separates pointer feedback from keyboard focus and keeps its menu in the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 360 });
  await page.goto('/#/select');
  const preview = page.locator('.playground .preview');
  const trigger = preview.getByRole('combobox', { name: 'Environment' });
  await trigger.evaluate(element => element.scrollIntoView({ block: 'center' }));
  await expect(trigger).toHaveCSS('cursor', 'pointer');
  await trigger.click();
  const menu = preview.getByRole('listbox');
  const selected = menu.getByRole('option', { selected: true });
  const production = menu.getByRole('option', { name: 'Production' });
  const disabled = menu.getByRole('option', { name: 'Preview' });
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute('data-positioned', 'true');
  await expect(selected).not.toHaveAttribute('data-keyboard-active');
  await expect(production).toHaveCSS('cursor', 'pointer');
  await expect(disabled).toHaveCSS('cursor', 'not-allowed');
  const bounds = await menu.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const visible = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return {
      inViewport: rect.top >= -1 && rect.bottom <= innerHeight + 1 && rect.left >= -1 && rect.right <= innerWidth + 1,
      hit: visible !== null && element.contains(visible),
      topLayer: element.matches(':popover-open'),
    };
  });
  expect(bounds).toEqual({ inViewport: true, hit: true, topLayer: true });
  await production.hover();
  await expect(production).toHaveAttribute('data-active', 'true');
  await expect(production).not.toHaveAttribute('data-keyboard-active');
  await trigger.press('ArrowUp');
  await expect(selected).toHaveAttribute('data-keyboard-active', 'true');
  await trigger.press('ArrowDown');
  await expect(production).toHaveAttribute('data-keyboard-active', 'true');
  await trigger.press('Escape');
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('wheel motion inside a select never chains into the documentation scroll container', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 360 });
  await page.goto('/#/select');
  const trigger = page.locator('.playground .preview').getByRole('combobox', { name: 'Environment' });
  await trigger.evaluate(element => element.scrollIntoView({ block: 'center' }));
  await trigger.click();
  const menu = page.locator('.playground .preview').getByRole('listbox');
  await expect(menu).toHaveAttribute('data-positioned', 'true');
  await expect(menu).toHaveCSS('overscroll-behavior', 'contain');
  const scrollPositions = () => menu.evaluate(element => {
    const positions = [window.scrollY];
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      positions.push(ancestor.scrollTop);
    }
    return positions;
  });
  await menu.evaluate(element => { element.scrollTop = element.scrollHeight; });
  await menu.hover();
  const positions = await scrollPositions();
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(150);
  expect(await scrollPositions()).toEqual(positions);
  await menu.evaluate(element => { element.scrollTop = 0; });
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(150);
  expect(await scrollPositions()).toEqual(positions);
  await expect(menu).toBeVisible();
});
