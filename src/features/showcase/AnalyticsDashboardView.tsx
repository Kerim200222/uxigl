import React from 'react';
import { Card } from '../../components/composites/Card/Card';
import {
  SheetGLGridAdapter,
  type SheetGLDatasetPreset,
} from '../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';

declare module '../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter' {
  interface SheetGLGridAdapterProps {
    scenario?: SheetGLDatasetPreset;
  }
}

/**
 * ============================================================================
 * uxiGL SHOWCASE — ANALYTICS & FINANCIAL TELEMETRY DASHBOARD VIEW
 * ============================================================================
 */

export const AnalyticsDashboardView: React.FC = () => {
  return (
    <div
      className="uxu-analytics-dashboard-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--uxu-text-primary)',
          }}
        >
          Analytics &amp; Financial Telemetry
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: 'var(--uxu-text-secondary)',
          }}
        >
          Real-time enterprise ledger, cascading regional tax telemetry, and compliance analytics powered by SheetGL.
        </p>
      </header>

      <Card
        variant="glass"
        padding="lg"
        title="Enterprise Financial Telemetry Grid"
        subtitle="Interactive SheetGL DataGrid — Finance & ERP Scenario (150 Rows)"
        style={{ width: '100%' }}
      >
        <SheetGLGridAdapter
          scenario="finance-erp"
          datasetPreset="finance-erp"
          initialRowCount={150}
          showControlBar
        />
      </Card>
    </div>
  );
};

export default AnalyticsDashboardView;

