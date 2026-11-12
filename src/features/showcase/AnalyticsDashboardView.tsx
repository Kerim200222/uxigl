import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Activity,
  Briefcase,
  Cpu,
  Package,
  Server,
  ShieldCheck,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { Card } from '../../components/composites/Card/Card';
import {
  SegmentedControl,
  type SegmentedOption,
} from '../../components/composites/SegmentedControl/SegmentedControl';
import {
  StatCard,
  type StatCardProps,
} from '../../components/composites/StatCard/StatCard';
import { Badge } from '../../components/primitives/Badge/Badge';
import {
  SheetGLGridAdapter,
  SHEETGL_PRESET_META,
  type SheetGLDatasetPreset,
} from '../../components/composites/SheetGLGridAdapter/SheetGLGridAdapter';
import type { SemanticTone } from '../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL SHOWCASE — MULTI-SCENARIO ANALYTICS & TELEMETRY DASHBOARD VIEW
 * ============================================================================
 */

interface ScenarioTelemetryConfig {
  badgeLabel: string;
  badgeTone: SemanticTone;
  complianceTag: string;
  kpis: [StatCardProps, StatCardProps, StatCardProps];
}

const PRESET_SEGMENT_OPTIONS: SegmentedOption<SheetGLDatasetPreset>[] = [
  {
    value: 'finance-erp',
    label: 'Finance & ERP',
    icon: <Briefcase size={14} />,
  },
  {
    value: 'cloud-telemetry',
    label: 'Cloud Telemetry',
    icon: <Cpu size={14} />,
  },
  {
    value: 'hr-payroll',
    label: 'HR & Payroll',
    icon: <Users size={14} />,
  },
  {
    value: 'inventory-supply',
    label: 'Supply Chain',
    icon: <Package size={14} />,
  },
];

const SCENARIO_TELEMETRY_CONFIG: Record<
  SheetGLDatasetPreset,
  ScenarioTelemetryConfig
> = {
  'finance-erp': {
    badgeLabel: 'Live Ledger · 150 Rows',
    badgeTone: 'primary',
    complianceTag: 'SOC2 · GDPR · ISO27001',
    kpis: [
      {
        id: 'kpi-finance-revenue',
        label: 'Total Revenue',
        value: '$4,820,450',
        delta: '+18.4%',
        trend: 'up',
        tone: 'primary',
        icon: <DollarSign size={16} />,
        sparklineData: [38, 45, 42, 61, 68, 82, 96],
        subtitle: 'vs. previous 30-day cycle',
      },
      {
        id: 'kpi-finance-accounts',
        label: 'Active Enterprise Accounts',
        value: '28,490',
        delta: '+12.1%',
        trend: 'up',
        tone: 'info',
        icon: <Users size={16} />,
        sparklineData: [24, 31, 35, 44, 52, 63, 78],
        subtitle: 'Enterprise SSO & Passkey sessions',
      },
      {
        id: 'kpi-finance-compliance',
        label: 'Audit & SLA Compliance',
        value: '99.99%',
        delta: '+0.02%',
        trend: 'up',
        tone: 'success',
        icon: <ShieldCheck size={16} />,
        sparklineData: [98, 99, 99, 100, 99, 100, 100],
        subtitle: '90-day global edge SLA',
      },
    ],
  },
  'cloud-telemetry': {
    badgeLabel: 'K8s Cluster Stream · 150 Nodes',
    badgeTone: 'info',
    complianceTag: 'HPA Active · Zero-Trust Mesh',
    kpis: [
      {
        id: 'kpi-cloud-rps',
        label: 'Cluster Throughput (RPS)',
        value: '1.42M req/s',
        delta: '+24.6%',
        trend: 'up',
        tone: 'info',
        icon: <Server size={16} />,
        sparklineData: [52, 58, 64, 71, 79, 88, 95],
        subtitle: 'Across 5 global cloud regions',
      },
      {
        id: 'kpi-cloud-latency',
        label: 'Global P99 Latency',
        value: '8.4 ms',
        delta: '-14.2%',
        trend: 'up',
        tone: 'success',
        icon: <Activity size={16} />,
        sparklineData: [28, 25, 22, 19, 15, 11, 8],
        subtitle: 'Sub-10ms edge shader routing',
      },
      {
        id: 'kpi-cloud-uptime',
        label: 'System Uptime SLA',
        value: '99.99%',
        delta: '+0.01%',
        trend: 'up',
        tone: 'primary',
        icon: <Cpu size={16} />,
        sparklineData: [99, 99, 100, 100, 99, 100, 100],
        subtitle: 'Automated failover & HPA scaling',
      },
    ],
  },
  'hr-payroll': {
    badgeLabel: 'Workforce Matrix · 150 Staff',
    badgeTone: 'success',
    complianceTag: 'OKR Q4 · Global Payroll',
    kpis: [
      {
        id: 'kpi-hr-payroll',
        label: 'Monthly Payroll & RSU',
        value: '$2,140,800',
        delta: '+6.8%',
        trend: 'up',
        tone: 'primary',
        icon: <DollarSign size={16} />,
        sparklineData: [60, 62, 65, 68, 71, 74, 78],
        subtitle: 'Base compensation + annual RSU vest',
      },
      {
        id: 'kpi-hr-headcount',
        label: 'Active Engineering & R&D',
        value: '1,284',
        delta: '+9.4%',
        trend: 'up',
        tone: 'info',
        icon: <Users size={16} />,
        sparklineData: [40, 44, 49, 53, 58, 64, 72],
        subtitle: 'Hybrid (3+2) & Global Remote teams',
      },
      {
        id: 'kpi-hr-okr',
        label: 'Mean OKR Attainment',
        value: '91.4%',
        delta: '+5.3%',
        trend: 'up',
        tone: 'success',
        icon: <TrendingUp size={16} />,
        sparklineData: [72, 75, 79, 82, 86, 89, 91],
        subtitle: 'L4–L7 performance velocity',
      },
    ],
  },
  'inventory-supply': {
    badgeLabel: 'Live SKU Telemetry · 150 SKUs',
    badgeTone: 'warning',
    complianceTag: 'Insured · 7 Global Hubs',
    kpis: [
      {
        id: 'kpi-supply-valuation',
        label: 'Total Inventory Valuation',
        value: '$18,940,200',
        delta: '+15.2%',
        trend: 'up',
        tone: 'primary',
        icon: <DollarSign size={16} />,
        sparklineData: [45, 50, 56, 62, 70, 79, 88],
        subtitle: 'B200 GPU blades, M4 Ultra & Gen5 NVMe',
      },
      {
        id: 'kpi-supply-utilization',
        label: 'Warehouse Capacity',
        value: '84.6%',
        delta: '+4.1%',
        trend: 'up',
        tone: 'warning',
        icon: <Package size={16} />,
        sparklineData: [68, 70, 74, 76, 79, 82, 85],
        subtitle: 'Istanbul, Zurich, Tokyo & Singapore hubs',
      },
      {
        id: 'kpi-supply-fulfillment',
        label: 'On-Time Dispatch SLA',
        value: '98.7%',
        delta: '+1.9%',
        trend: 'up',
        tone: 'success',
        icon: <Truck size={16} />,
        sparklineData: [92, 94, 95, 96, 97, 98, 99],
        subtitle: '30-day hardware logistics velocity',
      },
    ],
  },
};

export interface AnalyticsDashboardViewProps {
  /** Initial active telemetry scenario preset (defaults to `'finance-erp'`). */
  initialPreset?: SheetGLDatasetPreset;
  /** Initial row count for the embedded SheetGL DataGrid (defaults to `150`). */
  initialRowCount?: number;
  /** Optional custom CSS class name. */
  className?: string;
  /** Optional inline style overrides. */
  style?: React.CSSProperties;
}

export const AnalyticsDashboardView: React.FC<AnalyticsDashboardViewProps> = ({
  initialPreset = 'finance-erp',
  initialRowCount = 150,
  className = '',
  style,
}) => {
  const [activePreset, setActivePreset] =
    useState<SheetGLDatasetPreset>(initialPreset);

  const presetMeta = SHEETGL_PRESET_META[activePreset];
  const activeTelemetry = SCENARIO_TELEMETRY_CONFIG[activePreset];

  return (
    <div
      className={`uxu-analytics-dashboard-view ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        ...style,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexWrap: 'wrap',
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
            <Badge
              tone={activeTelemetry.badgeTone}
              variant="tonal"
              size="sm"
              pulse
            >
              {activeTelemetry.badgeLabel}
            </Badge>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: 'var(--uxu-text-secondary)',
            }}
          >
            {presetMeta.label} — {presetMeta.description}
          </p>
        </div>

        <SegmentedControl<SheetGLDatasetPreset>
          id="analytics-scenario-switcher"
          value={activePreset}
          onChange={setActivePreset}
          options={PRESET_SEGMENT_OPTIONS}
          size="sm"
        />
      </header>

      {/* Dynamic KPI Indicator Strip */}
      <div
        className="uxu-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1rem',
          width: '100%',
        }}
      >
        {activeTelemetry.kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            id={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            tone={kpi.tone}
            icon={kpi.icon}
            sparklineData={kpi.sparklineData}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      <Card
        variant="glass"
        padding="lg"
        title={`Enterprise Telemetry Grid — ${presetMeta.shortLabel}`}
        subtitle={`${presetMeta.label} (${presetMeta.description})`}
        headerAction={
          <Badge tone={activeTelemetry.badgeTone} variant="glass" size="sm">
            {activeTelemetry.complianceTag}
          </Badge>
        }
        style={{ width: '100%' }}
      >
        <SheetGLGridAdapter
          datasetPreset={activePreset}
          initialRowCount={initialRowCount}
          showControlBar
        />
      </Card>
    </div>
  );
};

export default AnalyticsDashboardView;
