// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import {
  SegmentedControl,
  type SegmentedOption,
} from '../../src/components/composites/SegmentedControl/SegmentedControl';

type Period = 'day' | 'week' | 'month' | 'year';

const SAMPLE_OPTIONS: SegmentedOption<Period>[] = [
  { value: 'day', label: '24 Saat', badge: 'Canlı' },
  { value: 'week', label: '7 Gün' },
  { value: 'month', label: '30 Gün', disabled: true },
  { value: 'year', label: '1 Yıl', href: '/analytics/yearly' },
];

describe('SegmentedControl', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders tablist, tabs, aria-selected, roving tabIndex, badges, and modifier classes', () => {
    const { container } = render(
      <SegmentedControl<Period>
        id="period-switcher"
        label="Veri Periyodu"
        value="day"
        onChange={() => {}}
        options={SAMPLE_OPTIONS}
        size="sm"
        fullWidth
      />
    );

    const tablist = screen.getByRole('tablist', { name: 'Veri Periyodu' });
    expect(tablist).toHaveClass('uxu-segmented--sm', 'uxu-segmented--full');
    expect(
      container.querySelector('.uxu-segmented-wrapper')
    ).toHaveClass('uxu-segmented-wrapper--full');

    const dayTab = screen.getByRole('tab', { name: /24 Saat/i });
    const weekTab = screen.getByRole('tab', { name: /7 Gün/i });
    const monthTab = screen.getByRole('tab', { name: /30 Gün/i });
    const yearTab = screen.getByRole('tab', { name: /1 Yıl/i });

    expect(dayTab).toHaveAttribute('aria-selected', 'true');
    expect(dayTab).toHaveAttribute('tabIndex', '0');
    expect(weekTab).toHaveAttribute('aria-selected', 'false');
    expect(weekTab).toHaveAttribute('tabIndex', '-1');
    expect(monthTab).toBeDisabled();
    expect(monthTab).toHaveAttribute('aria-disabled', 'true');
    expect(yearTab.tagName).toBe('A');
    expect(yearTab).toHaveAttribute('href', '/analytics/yearly');
  });

  it('supports click and WAI-ARIA keyboard navigation (ArrowRight, ArrowLeft, Home, End) skipping disabled options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SegmentedControl<Period>
        value="day"
        onChange={onChange}
        options={SAMPLE_OPTIONS}
      />
    );

    const dayTab = screen.getByRole('tab', { name: /24 Saat/i });
    const weekTab = screen.getByRole('tab', { name: /7 Gün/i });
    const yearTab = screen.getByRole('tab', { name: /1 Yıl/i });

    // Click selection
    await user.click(weekTab);
    expect(onChange).toHaveBeenCalledWith('week');

    // Keyboard ArrowRight from 'week' skips disabled 'month' -> 'year'
    weekTab.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('year');
    expect(yearTab).toHaveFocus();

    // Keyboard ArrowRight from 'year' wraps around -> 'day'
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('day');
    expect(dayTab).toHaveFocus();

    // Keyboard ArrowLeft from 'day' wraps around -> 'year'
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('year');
    expect(yearTab).toHaveFocus();

    // Keyboard Home -> 'day', End -> 'year'
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith('day');
    expect(dayTab).toHaveFocus();

    await user.keyboard('{End}');
    expect(onChange).toHaveBeenLastCalledWith('year');
    expect(yearTab).toHaveFocus();
  });

  it('prevents interaction when control is globally disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SegmentedControl<Period>
        value="day"
        onChange={onChange}
        options={SAMPLE_OPTIONS}
        disabled
      />
    );

    const weekTab = screen.getByRole('tab', { name: /7 Gün/i });
    expect(weekTab).toBeDisabled();
    expect(weekTab).toHaveAttribute('aria-disabled', 'true');

    await user.click(weekTab);
    expect(onChange).not.toHaveBeenCalled();
  });
});
