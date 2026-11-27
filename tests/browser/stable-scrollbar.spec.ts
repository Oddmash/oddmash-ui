import { expect, test } from '@playwright/test';

for (const direction of ['ltr', 'rtl']) {
  test(`opt-in gutters preserve document and nested layout in ${direction}`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: 390, height: 760 });
    await page.goto('/#/dialog');
    await page.evaluate((dir) => {
      const root = document.documentElement;
      root.dir = dir;
      const marker = document.createElement('div');
      marker.id = 'document-marker';
      document.body.prepend(marker);
      const spacer = document.createElement('div');
      spacer.id = 'root-spacer';
      document.body.append(spacer);
      const scrollport = document.createElement('div');
      scrollport.id = 'nested-scrollport';
      scrollport.className = 'om-stable-scrollbar';
      scrollport.innerHTML = '<div id="nested-marker"></div>';
      document.body.append(scrollport);
    }, direction);
    await page.addStyleTag({
      content: `
        #nested-scrollport { overflow: auto; width: 240px; height: 100px; }
        #document-marker { width: 100%; }
        ${browserName === 'chromium' ? '::-webkit-scrollbar { width: 14px; }' : ''}
      `,
    });

    const root = page.locator('html');
    await expect(root).toHaveCSS('scrollbar-gutter', 'auto');
    await root.evaluate((element) => element.classList.add('om-stable-scrollbar'));
    await expect(root).toHaveCSS('scrollbar-gutter', 'stable');

    const nested = page.locator('#nested-scrollport');
    const nestedMarker = page.locator('#nested-marker');
    const nestedBox = await nestedMarker.boundingBox();
    await nestedMarker.evaluate((element) => { element.style.height = '350px'; });
    expect(await nestedMarker.boundingBox()).toMatchObject({ x: nestedBox?.x, width: nestedBox?.width });
    await nested.evaluate((element) => { element.scrollTop = 40; });
    await expect.poll(() => nested.evaluate((element) => element.scrollTop)).toBe(40);

    const marker = page.locator('#document-marker');
    const bodyWidth = await marker.evaluate((element) => ({ x: element.getBoundingClientRect().x, width: element.clientWidth }));
    const docs = page.locator('.docs-app');
    await docs.evaluate((element) => { (element as HTMLElement).style.display = 'none'; });
    const shortLayout = await marker.boundingBox();
    const spacer = page.locator('#root-spacer');
    await spacer.evaluate((element) => { element.style.height = '1200px'; });
    expect(await marker.boundingBox()).toMatchObject({ x: shortLayout?.x, width: shortLayout?.width });
    await spacer.evaluate((element) => { element.style.height = ''; });
    await docs.evaluate((element) => { (element as HTMLElement).style.display = ''; });

    const trigger = page.getByRole('button', { name: 'Edit project' });
    await trigger.press('Enter');
    await expect(page.getByRole('dialog').getByRole('textbox')).toBeFocused();
    await expect.poll(() => marker.evaluate((element) => ({
      x: element.getBoundingClientRect().x,
      width: element.clientWidth,
    }))).toEqual(bodyWidth);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect.poll(() => nested.evaluate((element) => element.scrollTop)).toBe(40);
  });
}
