import type { Page } from '@playwright/test';

export const chooseDocsTheme = async (page: Page, theme: 'System' | 'Light' | 'Dark') => {
  const select = page.getByRole('combobox', { name: 'Theme', exact: true });
  await select.click();
  await page.getByRole('listbox', { name: 'Theme', exact: true }).getByRole('option', { name: theme, exact: true }).click();
};
