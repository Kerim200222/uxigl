// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

// Stub out SheetGLGridAdapter's WebGL/Canvas rendering in jsdom while keeping
// SHEETGL_PRESET_META intact and surfacing datasetPreset / initialRowCount props.
vi.mock(
  '../../src/components/composites/SheetGLGridAdapter/SheetGLGridAdapter',
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import('../../src/components/composites/SheetGLGridAdapter/SheetGLGridAdapter')
    >();
    return {
      ...actual,
      SheetGLGridAdapter: ({
        datasetPreset = 'finance-erp',
        initialRowCount = 150,
      }: {
        datasetPreset?: string;
        initialRowCount?: number;
      }) =>
        React.createElement(
          'div',
          {
            'data-testid': 'sheetgl-grid-adapter-stub',
            'data-preset': datasetPreset,
            'data-rows': String(initialRowCount),
          },
          `SheetGL Stub: ${datasetPreset}`
        ),
    };
  }
);

import { AnalyticsDashboardView } from '../../src/features/showcase/AnalyticsDashboardView';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('AnalyticsDashboardView', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders default finance-erp scenario KPI metrics and compliance badges', () => {
    act(() => {
      root.render(React.createElement(AnalyticsDashboardView));
    });

    const text = container.textContent ?? '';
    expect(text).toContain('Analytics & Financial Telemetry');
    expect(text).toContain('Live Ledger · 150 Rows');
    expect(text).toContain('SOC2 · GDPR · ISO27001');

    // Finance & ERP KPI metrics
    expect(text).toContain('Total Revenue');
    expect(text).toContain('$4,820,450');
    expect(text).toContain('Active Enterprise Accounts');
    expect(text).toContain('28,490');
    expect(text).toContain('Audit & SLA Compliance');
    expect(text).toContain('99.99%');

    const gridStub = container.querySelector(
      '[data-testid="sheetgl-grid-adapter-stub"]'
    );
    expect(gridStub?.getAttribute('data-preset')).toBe('finance-erp');
  });

  it('switches interactively across cloud-telemetry, hr-payroll, and inventory-supply scenarios', () => {
    act(() => {
      root.render(React.createElement(AnalyticsDashboardView));
    });

    const getTabByLabel = (label: string): HTMLButtonElement => {
      const tabs = Array.from(
        container.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      );
      const match = tabs.find((tab) => tab.textContent?.includes(label));
      if (!match) {
        throw new Error(`Could not find tab with label "${label}"`);
      }
      return match;
    };

    // 1. Switch to Cloud Telemetry ('cloud-telemetry')
    act(() => {
      getTabByLabel('Cloud Telemetry').click();
    });

    let text = container.textContent ?? '';
    expect(text).toContain('K8s Cluster Stream · 150 Nodes');
    expect(text).toContain('HPA Active · Zero-Trust Mesh');
    expect(text).toContain('Cluster Throughput (RPS)');
    expect(text).toContain('1.42M req/s');
    expect(text).toContain('Global P99 Latency');
    expect(text).toContain('8.4 ms');
    expect(text).toContain('System Uptime SLA');
    expect(text).toContain('99.99%');
    expect(
      container
        .querySelector('[data-testid="sheetgl-grid-adapter-stub"]')
        ?.getAttribute('data-preset')
    ).toBe('cloud-telemetry');

    // 2. Switch to HR & Payroll ('hr-payroll')
    act(() => {
      getTabByLabel('HR & Payroll').click();
    });

    text = container.textContent ?? '';
    expect(text).toContain('Workforce Matrix · 150 Staff');
    expect(text).toContain('OKR Q4 · Global Payroll');
    expect(text).toContain('Monthly Payroll & RSU');
    expect(text).toContain('$2,140,800');
    expect(text).toContain('Active Engineering & R&D');
    expect(text).toContain('1,284');
    expect(text).toContain('Mean OKR Attainment');
    expect(text).toContain('91.4%');
    expect(
      container
        .querySelector('[data-testid="sheetgl-grid-adapter-stub"]')
        ?.getAttribute('data-preset')
    ).toBe('hr-payroll');

    // 3. Switch to Supply Chain ('inventory-supply')
    act(() => {
      getTabByLabel('Supply Chain').click();
    });

    text = container.textContent ?? '';
    expect(text).toContain('Live SKU Telemetry · 150 SKUs');
    expect(text).toContain('Insured · 7 Global Hubs');
    expect(text).toContain('Total Inventory Valuation');
    expect(text).toContain('$18,940,200');
    expect(text).toContain('Warehouse Capacity');
    expect(text).toContain('84.6%');
    expect(text).toContain('On-Time Dispatch SLA');
    expect(text).toContain('98.7%');
    expect(
      container
        .querySelector('[data-testid="sheetgl-grid-adapter-stub"]')
        ?.getAttribute('data-preset')
    ).toBe('inventory-supply');
  });
});

