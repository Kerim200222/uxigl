import React from 'react';
import { DollarSign, Users, Activity } from 'lucide-react';
import { Card } from '../../components/composites/Card/Card';
import { StatCard } from '../../components/composites/StatCard/StatCard';
import { Badge } from '../../components/primitives/Badge/Badge';
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
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div
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
        </div>
        <Badge tone="primary" variant="tonal" pulse>
          Live Telemetry · 150 Rows
        </Badge>
      </header>

      {/* KPI Indicator Strip */}
      <div
        className="uxu-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          width: '100%',
        }}
      >
        <StatCard
          id="kpi-total-revenue"
          label="Total Revenue"
          value="$4,820,450"
          delta="+18.4%"
          trend="up"
          tone="primary"
          icon={<DollarSign size={16} />}
          sparklineData={[38, 45, 42, 61, 68, 82, 96]}
          subtitle="vs. previous 30-day cycle"
        />

        <StatCard
          id="kpi-active-users"
          label="Active Users"
          value="28,490"
          delta="+12.1%"
          trend="up"
          tone="info"
          icon={<Users size={16} />}
          sparklineData={[24, 31, 35, 44, 52, 63, 78]}
          subtitle="Enterprise SSO & Passkey sessions"
        />

        <StatCard
          id="kpi-system-uptime"
          label="System Uptime"
          value="99.99%"
          delta="+0.02%"
          trend="up"
          tone="success"
          icon={<Activity size={16} />}
          sparklineData={[98, 99, 99, 100, 99, 100, 100]}
          subtitle="90-day global edge SLA"
        />
      </div>

      <Card
        variant="glass"
        padding="lg"
        title="Enterprise Financial Telemetry Grid"
        subtitle="Interactive SheetGL DataGrid — Finance & ERP Scenario (150 Rows)"
        headerAction={
          <Badge tone="success" variant="glass" size="sm">
            SOC2 · GDPR · ISO27001
          </Badge>
        }
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

