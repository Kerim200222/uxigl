// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import {
  Analytics,
  buildAnalyticsDataset,
} from '../../src/components/composites/Analytics';

describe('Analytics Composite & analyticsUtils', () => {
  afterEach(() => {
    cleanup();
  });

  it('builds deterministic localized datasets across periods (24h, 7d, 30d, 1y) and locales (tr, en)', () => {
    const dsTr24h = buildAnalyticsDataset('24h', 'tr');
    const dsEn7d = buildAnalyticsDataset('7d', 'en');
    const dsEn30d = buildAnalyticsDataset('30d', 'en');
    const dsEn1y = buildAnalyticsDataset('1y', 'en');

    expect(dsTr24h.kpis).toHaveLength(4);
    expect(dsTr24h.kpis[0].label).toBe('Toplam Gelir');
    expect(dsTr24h.kpis[0].value).toBe('$18,420');
    expect(dsTr24h.series).toHaveLength(7);

    expect(dsEn7d.kpis[0].label).toBe('Total Revenue');
    expect(dsEn7d.kpis[0].value).toBe('$42,890');
    expect(dsEn30d.kpis[0].value).toBe('$124,592');
    expect(dsEn1y.kpis[0].value).toBe('$1,284,900');

    expect(dsEn30d.channels.reduce((acc, c) => acc + c.sharePct, 0)).toBe(100);
    expect(dsEn30d.devices.reduce((acc, d) => acc + d.sharePct, 0)).toBe(100);
  });

  it('switches periods, toggles between Area and Bar chart modes, and triggers onExport', async () => {
    const user = userEvent.setup();
    const onPeriodChange = vi.fn();
    const onExport = vi.fn();

    render(
      <Analytics
        locale="en"
        defaultPeriod="30d"
        onPeriodChange={onPeriodChange}
        onExport={onExport}
      />
    );

    expect(screen.getByText('$124,592')).toBeInTheDocument();

    // Switch period to 7D
    await user.click(screen.getByRole('tab', { name: '7D' }));
    expect(onPeriodChange).toHaveBeenCalledWith('7d');
    expect(screen.getByText('$42,890')).toBeInTheDocument();

    // Initially in Area mode -> graphics-symbol points are <circle> elements
    const areaPoints = screen.getAllByRole('graphics-symbol');
    expect(areaPoints.length).toBeGreaterThan(0);
    expect(areaPoints[0].tagName.toLowerCase()).toBe('circle');

    // Toggle to Bar mode -> graphics-symbol points become <rect> elements
    await user.click(screen.getByRole('tab', { name: /Bar/i }));
    const barPoints = screen.getAllByRole('graphics-symbol');
    expect(barPoints[0].tagName.toLowerCase()).toBe('rect');

    // Click Export button
    await user.click(screen.getByRole('button', { name: /Export/i }));
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onExport.mock.calls[0][0]).toBe('7d');
  });

  it('shows chart tooltip on keyboard focus of graphics-symbol points and renders WAI-ARIA progressbars for breakdowns', () => {
    render(<Analytics locale="en" defaultPeriod="7d" />);

    expect(
      screen.queryByTestId('analytics-chart-tooltip')
    ).not.toBeInTheDocument();

    const firstPoint = screen.getAllByRole('graphics-symbol')[0];
    expect(firstPoint).toHaveAttribute('aria-label', 'Mon: $14.5K');

    // Focus data point via keyboard -> tooltip appears
    fireEvent.focus(firstPoint);
    expect(screen.getByTestId('analytics-chart-tooltip')).toHaveTextContent(
      'Mon: $14.5K'
    );

    // Blur data point -> tooltip hides
    fireEvent.blur(firstPoint);
    expect(
      screen.queryByTestId('analytics-chart-tooltip')
    ).not.toBeInTheDocument();

    // Breakdown WAI-ARIA progressbars
    const organicBar = screen.getByRole('progressbar', {
      name: 'Organic Search',
    });
    expect(organicBar).toHaveAttribute('aria-valuenow', '42');
    expect(organicBar).toHaveAttribute('aria-valuemin', '0');
    expect(organicBar).toHaveAttribute('aria-valuemax', '100');

    const desktopBar = screen.getByRole('progressbar', { name: 'Desktop' });
    expect(desktopBar).toHaveAttribute('aria-valuenow', '62');
  });
});
