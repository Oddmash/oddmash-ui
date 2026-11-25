export const themeOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

export type ThemePreference = (typeof themeOptions)[number]['value'];

export const readThemePreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem('om-docs-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'system';
};

export const readSystemTheme = (): 'light' | 'dark' =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
