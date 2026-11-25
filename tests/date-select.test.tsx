import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DateSelect } from '../src';

describe('DateSelect', () => {
  it('provides a named group, localized native choices and second precision', async () => {
    const onValueChange = vi.fn();
    const ref = createRef<HTMLFieldSetElement>();
    render(<form data-testid="form"><DateSelect ref={ref} className="custom" label="날짜 및 시간" labels={{ second: '초' }} name="since" defaultValue="2024-02-29T01:02:03" minYear={2023} maxYear={2025} onValueChange={onValueChange} /></form>);
    const group = screen.getByRole('group', { name: '날짜 및 시간' });
    expect(group).toBe(ref.current);
    expect(group).toHaveClass('om-date-select', 'custom');
    expect(screen.getAllByRole('combobox')).toHaveLength(6);
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveValue('2024');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: '초' }), '59');
    expect(onValueChange).toHaveBeenLastCalledWith('2024-02-29T01:02:59');
    expect(new FormData(screen.getByTestId('form') as HTMLFormElement).get('since')).toBe('2024-02-29T01:02:59');
  });

  it('clamps the day when the year or month changes, including leap centuries', async () => {
    const onValueChange = vi.fn();
    render(<DateSelect label="Date" defaultValue="2000-02-29T03:04:05" minYear={1900} maxYear={2001} onValueChange={onValueChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Year' }), '1900');
    expect(onValueChange).toHaveBeenLastCalledWith('1900-02-28T03:04:05');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Month' }), '1');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Day' }), '31');
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Month' }), '4');
    expect(onValueChange).toHaveBeenLastCalledWith('1900-04-30T03:04:05');
    expect(screen.getByRole('combobox', { name: 'Day' })).toHaveValue('30');
  });

  it('supports controlled values and clear restores focus without submitting', async () => {
    const onSubmit = vi.fn(event => event.preventDefault());
    const Example = () => {
      const [value, setValue] = useState('2024-05-06T07:08:09');
      return <form onSubmit={onSubmit}><DateSelect label="Date" value={value} onValueChange={setValue} minYear={2024} maxYear={2024} /><output>{value}</output></form>;
    };
    render(<Example />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Hour' }), '23');
    expect(screen.getByRole('status')).toHaveTextContent('2024-05-06T23:08:09');
    await userEvent.click(screen.getByRole('button', { name: 'Clear date and time' }));
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveFocus();
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveValue('');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not accept an invalid supplied date; required and disabled retain form semantics', () => {
    const { rerender } = render(<form data-testid="form"><DateSelect label="Date" value="2025-02-30T12:00:00" required name="since" /></form>);
    const form = screen.getByTestId('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    expect(screen.getByRole('combobox', { name: 'Year' })).toHaveValue('');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<form data-testid="form"><DateSelect label="Date" value="2025-05-05T23:59:59" disabled name="since" required /></form>);
    expect(screen.getByRole('combobox', { name: 'Year' })).toBeDisabled();
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).has('since')).toBe(false);
  });

  it('resets an uncontrolled value to its initial value', async () => {
    render(<form data-testid="form"><DateSelect label="Date" defaultValue="2026-01-01T00:00:00" /></form>);
    const minute = screen.getByRole('combobox', { name: 'Minute' });
    await userEvent.selectOptions(minute, '55');
    fireEvent.reset(screen.getByTestId('form'));
    expect(minute).toHaveValue('0');
  });
});
