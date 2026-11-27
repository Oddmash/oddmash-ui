// @vitest-environment jsdom

import { act, createElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useViewport } from '../src/use-viewport.js';

describe('viewport snapshots', () => {
  let root: Root;
  let snapshot: ReturnType<typeof useViewport>;

  const Probe = () => {
    snapshot = useViewport();
    return null;
  };

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('innerWidth', 390);
    root = createRoot(document.createElement('div'));
  });

  afterEach(async () => {
    await act(() => root.unmount());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uses layout dimensions and listens for window resize without VisualViewport', async () => {
    vi.stubGlobal('visualViewport', undefined);
    await act(() => root.render(createElement(Probe)));

    expect(snapshot).toEqual({ height: 800, width: 390, offsetTop: 0, bottomInset: 0 });

    vi.stubGlobal('innerHeight', 720);
    vi.stubGlobal('innerWidth', 420);
    await act(() => window.dispatchEvent(new Event('resize')));

    expect(snapshot).toEqual({ height: 720, width: 420, offsetTop: 0, bottomInset: 0 });
  });

  it('updates the visible viewport on resize and scroll and clamps negative insets', async () => {
    const visual = Object.assign(new EventTarget(), { height: 540, width: 360, offsetTop: 40 });
    vi.stubGlobal('visualViewport', visual);
    await act(() => root.render(createElement(Probe)));

    expect(snapshot).toEqual({ height: 540, width: 360, offsetTop: 40, bottomInset: 220 });

    visual.height = 720;
    visual.width = 380;
    await act(() => visual.dispatchEvent(new Event('resize')));
    expect(snapshot).toEqual({ height: 720, width: 380, offsetTop: 40, bottomInset: 40 });

    visual.offsetTop = 100;
    await act(() => visual.dispatchEvent(new Event('scroll')));
    expect(snapshot).toEqual({ height: 720, width: 380, offsetTop: 100, bottomInset: 0 });
  });

  it('removes every registered listener with its original callback', async () => {
    const visual = Object.assign(new EventTarget(), { height: 800, width: 390, offsetTop: 0 });
    vi.stubGlobal('visualViewport', visual);
    const windowAdd = vi.spyOn(window, 'addEventListener');
    const windowRemove = vi.spyOn(window, 'removeEventListener');
    const visualAdd = vi.spyOn(visual, 'addEventListener');
    const visualRemove = vi.spyOn(visual, 'removeEventListener');
    await act(() => root.render(createElement(Probe)));
    await act(() => root.render(null));

    const onResize = windowAdd.mock.calls.find(([type]) => type === 'resize')?.[1];
    const onVisualResize = visualAdd.mock.calls.find(([type]) => type === 'resize')?.[1];
    const onVisualScroll = visualAdd.mock.calls.find(([type]) => type === 'scroll')?.[1];
    expect(onResize).toBeTypeOf('function');
    expect(onVisualResize).toBeTypeOf('function');
    expect(onVisualScroll).toBeTypeOf('function');
    expect(windowRemove).toHaveBeenCalledWith('resize', onResize);
    expect(visualRemove).toHaveBeenCalledWith('resize', onVisualResize);
    expect(visualRemove).toHaveBeenCalledWith('scroll', onVisualScroll);
  });
});
