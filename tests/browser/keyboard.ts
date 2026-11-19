// macOS WebKit's default Tab order skips buttons unless Option is held.
export const tabToAllControls = (browserName: string) =>
  browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
