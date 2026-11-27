import { createRef, useState } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateCalendar, DatePicker, DateRangePicker, type DateRange } from '../src';

describe('DateCalendar', () => {
  it('renders a named monthly grid including leap day and selects via keyboard across months', async () => {
    const onValueChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<DateCalendar ref={ref} defaultValue="2024-02-29" onValueChange={onValueChange} />);
    expect(ref.current).toHaveClass('om-date-calendar');
    expect(screen.getByRole('grid', { name: 'February 2024' })).toBeVisible();
    const leapDay = screen.getByRole('button', { name: 'Thursday, February 29, 2024' });
    expect(leapDay).toHaveAttribute('tabindex', '0');
    leapDay.focus();
    await userEvent.keyboard('{ArrowRight}');
    const march = screen.getByRole('button', { name: 'Friday, March 1, 2024' });
    expect(march).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('2024-03-01');
    expect(march.closest('td')).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{PageDown}');
    expect(screen.getByRole('button', { name: 'Monday, April 1, 2024' })).toHaveFocus();
  });

  it('respects bounds, localizes labels and prevents disabled interaction', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<DateCalendar value="2024-01-01" minYear={2024} maxYear={2024} locale="ko" labels={{ previousMonth: '이전 달', nextMonth: '다음 달', today: '오늘' }} onValueChange={onValueChange} />);
    expect(screen.getByRole('grid', { name: '2024년 1월' })).toBeVisible();
    expect(screen.getByRole('button', { name: '이전 달' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: '다음 달' }));
    expect(screen.getByRole('grid', { name: '2024년 2월' })).toBeVisible();
    rerender(<DateCalendar value="2024-12-31" minYear={2024} maxYear={2024} disabled onValueChange={onValueChange} />);
    expect(screen.getByRole('grid', { name: 'December 2024' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Tuesday, December 31, 2024' })).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disables dates outside exact inclusive bounds and clamps keyboard movement through leap day', async () => {
    const onValueChange = vi.fn();
    render(<DateCalendar defaultValue="2024-02-28" minDate="2024-02-28" maxDate="2024-03-02" onValueChange={onValueChange} />);
    const first = screen.getByRole('button', { name: 'Wednesday, February 28, 2024' });
    expect(screen.getByRole('button', { name: 'Tuesday, February 27, 2024' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    first.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(first).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    const leap = screen.getByRole('button', { name: 'Thursday, February 29, 2024' });
    expect(leap).toHaveFocus();
    await userEvent.keyboard('{PageDown}');
    const last = screen.getByRole('button', { name: 'Saturday, March 2, 2024' });
    expect(last).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Sunday, March 3, 2024' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(last).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('2024-03-02');
  });

  it('clamps an empty or outside selection to the only selectable day and respects Today', async () => {
    vi.setSystemTime(new Date(2024, 1, 28, 12));
    try {
      const onValueChange = vi.fn();
      const { rerender } = render(<DateCalendar value="2024-02-27" minYear={2024} maxYear={2024} minDate="2024-02-28" maxDate="2024-02-28" onValueChange={onValueChange} />);
      const day = screen.getByRole('button', { name: 'Wednesday, February 28, 2024' });
      expect(day).toHaveAttribute('tabindex', '0');
      expect(day.closest('td')).toHaveAttribute('aria-selected', 'false');
      expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
      await userEvent.click(screen.getByRole('button', { name: 'Today' }));
      expect(onValueChange).toHaveBeenLastCalledWith('2024-02-28');
      rerender(<DateCalendar value="" minDate="2024-03-02" maxDate="2024-03-02" />);
      expect(screen.getByRole('button', { name: 'Today' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Saturday, March 2, 2024' })).toHaveAttribute('tabindex', '0');
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects malformed, inverted or disjoint dates and year bounds', () => {
    expect(() => render(<DateCalendar minDate="2025-02-29" />)).toThrow(RangeError);
    expect(() => render(<DateCalendar maxDate="0000-01-01" />)).toThrow(RangeError);
    expect(() => render(<DateCalendar minDate="2024-03-02" maxDate="2024-03-01" />)).toThrow(RangeError);
    expect(() => render(<DateCalendar minYear={2025} maxDate="2024-12-31" />)).toThrow(RangeError);
  });
});

describe('DatePicker', () => {
  it('keeps calendar optional and preserves local ISO seconds on a calendar selection', async () => {
    const onValueChange = vi.fn();
    render(<DatePicker label="Timestamp" mode="date-time" defaultValue="2024-02-29T23:58:59" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button', { name: 'Calendar' });
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Thursday, February 29, 2024' })).toHaveFocus();
    await userEvent.click(screen.getByRole('button', { name: 'Wednesday, February 28, 2024' }));
    expect(onValueChange).toHaveBeenLastCalledWith('2024-02-28T23:58:59');
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    await userEvent.click(trigger);
    screen.getByRole('button', { name: 'Wednesday, February 28, 2024' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });

  it('uses the requested date precision and native hidden form value', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<form data-testid="form"><DatePicker key="date" label="Date" name="date" defaultValue="2024-02-29" onValueChange={onValueChange} /></form>);
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Month' }), '4');
    expect(onValueChange).toHaveBeenLastCalledWith('2024-04-29');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('date')).toBe('2024-04-29');
    rerender(<form data-testid="form"><DatePicker key="month" label="Month" mode="year-month" name="month" defaultValue="2024-02" onValueChange={onValueChange} /></form>);
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Calendar' })).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Month' }), '12');
    expect(onValueChange).toHaveBeenLastCalledWith('2024-12');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('month')).toBe('2024-12');
  });
});

describe('DateRangePicker', () => {
  it('retains a reversed draft, reports native invalidity, clears independent bounds and preserves seconds', async () => {
    const changed = vi.fn();
    const Example = () => {
      const [value, setValue] = useState<DateRange>({ start: '2024-03-01T12:00:00', end: '2024-03-01T12:00:01' });
      return <form data-testid="form"><DateRangePicker label="Period" withTime value={value} onValueChange={next => { changed(next); setValue(next); }} startName="start" endName="end" invalidMessage="Invalid order" /></form>;
    };
    render(<Example />);
    const start = within(screen.getByRole('group', { name: 'Start date' }));
    const end = within(screen.getByRole('group', { name: 'End date' }));
    const form = screen.getByTestId('form') as HTMLFormElement;
    await userEvent.selectOptions(start.getByRole('combobox', { name: 'Second' }), '2');
    expect(changed).toHaveBeenLastCalledWith({ start: '2024-03-01T12:00:02', end: '2024-03-01T12:00:01' });
    expect(screen.getByRole('status')).toHaveTextContent('Invalid order');
    expect(form.checkValidity()).toBe(false);
    await userEvent.click(start.getByRole('button', { name: 'Clear date and time' }));
    expect(changed).toHaveBeenLastCalledWith({ start: '', end: '2024-03-01T12:00:01' });
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('end')).toBe('2024-03-01T12:00:01');
    await userEvent.click(end.getByRole('button', { name: 'Clear date and time' }));
    expect(changed).toHaveBeenLastCalledWith({ start: '', end: '' });
  });

  it('resets uncontrolled ranges and keeps required and disabled semantics', async () => {
    const initial = { start: '2024-02-01', end: '2024-02-29' };
    const { rerender } = render(<form data-testid="form"><DateRangePicker label="Period" defaultValue={initial} startName="start" endName="end" /></form>);
    const form = screen.getByTestId('form') as HTMLFormElement;
    const end = within(screen.getByRole('group', { name: 'End date' }));
    await userEvent.click(end.getByRole('button', { name: 'Clear date' }));
    expect(new FormData(form).get('end')).toBe('');
    await act(async () => form.reset());
    expect(new FormData(form).get('end')).toBe(initial.end);
    rerender(<form data-testid="form"><DateRangePicker label="Period" value={{ start: initial.start, end: '' }} required disabled startName="start" endName="end" /></form>);
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).has('start')).toBe(false);
    rerender(<form data-testid="form"><DateRangePicker label="Period" value={{ start: initial.start, end: '' }} required startName="start" endName="end" /></form>);
    expect(form.checkValidity()).toBe(false);
  });
});
