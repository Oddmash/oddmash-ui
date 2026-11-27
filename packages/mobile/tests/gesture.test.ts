import { describe, expect, it } from 'vitest';
import { clamp, getIntent, nearestSnapPoint, normalizeSnapPoints } from '../src/gesture.js';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { ActionSheet, BottomNavigation, BottomSheet, AdaptiveDialog, SwipeAction, PullToRefresh } from '../src/index.js';

describe('gesture contracts', () => {
  it('waits for intent and rejects cross-axis movement', () => {expect(getIntent(3, 4)).toBe('pending');expect(getIntent(9, 2)).toBe('primary');expect(getIntent(3, 20)).toBe('cross');});
  it('normalizes and validates snap points', () => {expect(normalizeSnapPoints([0.9, 0.5, 0.5])).toEqual([0.5, 0.9]);expect(() => normalizeSnapPoints([0])).toThrow();expect(() => normalizeSnapPoints([])).toThrow();expect(() => normalizeSnapPoints([NaN])).toThrow();});
  it('clamps and selects valid points', () => {expect(clamp(15, 0, 10)).toBe(10);expect(nearestSnapPoint([0.5, 0.9], 0.8)).toBe(0.9);});
  it('renders every public component without a browser', () => {
    expect(renderToString(createElement(BottomSheet, {title:'Sheet', children:'Content'}))).toContain('dialog');
    expect(renderToString(createElement(AdaptiveDialog, {title:'Dialog', children:'Content'}))).toContain('dialog');
    expect(renderToString(createElement(SwipeAction, {actions:'Actions', children:'Item'}))).toContain('Show actions');
    expect(renderToString(createElement(PullToRefresh, {onRefresh:()=>{}, children:'Content'}))).toContain('Refresh');
    expect(renderToString(createElement(ActionSheet, {title:'Actions', actions:[], onSelect:()=>{}}))).toContain('dialog');
    expect(renderToString(createElement(BottomNavigation, {label:'App', items:[{id:'home',label:'Home',href:'/'}], activeId:'home'}))).toContain('aria-current="page"');
  });
});
