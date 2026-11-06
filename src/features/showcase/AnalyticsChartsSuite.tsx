import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  MousePointerClick,
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  Radio,
  Layers,
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  Badge,
  Button,
  Chip,
  Progress,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  DataTable,
  StatCard,
} from '../../components/composites';

export type AnalyticsPeriod = '24h' | '7d' | '30d' | '1y';
export type RevenueChartType = 'area' | 'bar' | 'combo';

interface PeriodAnalyticsDataset {
  labels: string[];
  revenueK: number[]; // in $ thousands
  visitorsK: number[]; // in thousands
  conversionPct: number[];
  totalRevenue: string;
  revenueDelta: string;
  totalVisitors: string;
  visitorsDelta: string;
  conversionRate: string;
  conversionDelta: string;
  bounceRate: string;
  bounceDelta: string;
}

export const ANALYTICS_PERIOD_DATA: Record<
  AnalyticsPeriod,
  PeriodAnalyticsDataset
> = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Şimdi'],
    revenueK: [11.2, 9.8, 16.4, 22.8, 20.5, 25.4, 28.9],
    visitorsK: [4.1, 3.5, 6.2, 8.9, 8.1, 9.4, 10.8],
    conversionPct: [2.8, 2.6, 3.1, 3.6, 3.4, 3.8, 4.1],
    totalRevenue: '$18,420.00',
    revenueDelta: '+9.4% dün aynı saate göre',
    totalVisitors: '8,452',
    visitorsDelta: '+11.2% dün aynı saate göre',
    conversionRate: '3.68%',
    conversionDelta: '+0.4% dün aynı saate göre',
    bounceRate: '23.1%',
    bounceDelta: '-1.2% dün aynı saate göre',
  },
  '7d': {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    revenueK: [14.5, 16.8, 15.9, 19.4, 22.6, 20.1, 24.8],
    visitorsK: [5.4, 6.1, 5.8, 7.2, 8.4, 7.6, 9.1],
    conversionPct: [3.1, 3.3, 3.2, 3.5, 3.7, 3.4, 3.9],
    totalRevenue: '$42,890.00',
    revenueDelta: '+14.2% geçen haftaya göre',
    totalVisitors: '19,840',
    visitorsDelta: '+9.6% geçen haftaya göre',
    conversionRate: '3.52%',
    conversionDelta: '+1.4% geçen haftaya göre',
    bounceRate: '24.2%',
    bounceDelta: '-1.5% geçen haftaya göre',
  },
  '30d': {
    labels: ['1.Hft', '2.Hft', '3.Hft', '4.Hft', '5.Hft', '6.Hft', '7.Hft'],
    revenueK: [13.2, 15.6, 17.8, 16.9, 20.4, 22.9, 25.8],
    visitorsK: [4.8, 5.5, 6.4, 6.1, 7.5, 8.3, 9.4],
    conversionPct: [2.9, 3.1, 3.3, 3.2, 3.5, 3.6, 3.8],
    totalRevenue: '$124,592.00',
    revenueDelta: '+12.5% geçen aya göre',
    totalVisitors: '45,672',
    visitorsDelta: '+8.2% geçen aya göre',
    conversionRate: '3.45%',
    conversionDelta: '+2.1% geçen aya göre',
    bounceRate: '24.8%',
    bounceDelta: '-1.8% geçen aya göre',
  },
  '1y': {
    labels: ['Oca', 'Şub', 'Nis', 'Haz', 'Ağu', 'Eki', 'Ara'],
    revenueK: [68.0, 82.4, 94.2, 105.8, 114.6, 124.6, 138.4],
    visitorsK: [24.2, 29.8, 34.5, 38.9, 42.1, 45.7, 51.2],
    conversionPct: [2.7, 2.9, 3.1, 3.2, 3.3, 3.45, 3.7],
    totalRevenue: '$1,284,900.00',
    revenueDelta: '+34.8% geçen yıla göre',
    totalVisitors: '482,310',
    visitorsDelta: '+26.4% geçen yıla göre',
    conversionRate: '3.45%',
    conversionDelta: '+2.1% geçen yıla göre',
    bounceRate: '24.8%',
    bounceDelta: '-1.8% geçen yıla göre',
  },
};

export interface TrafficSourceItem {
  id: string;
  label: string;
  trLabel: string;
  share: number;
  visitors: string;
  color: string;
}

export const TRAFFIC_SOURCES: TrafficSourceItem[] = [
  {
    id: 'organic',
    label: 'Organic Search',
    trLabel: 'Organik Arama',
    share: 42.3,
    visitors: '19,314',
    color: '#2997FF',
  },
  {
    id: 'direct',
    label: 'Direct',
    trLabel: 'Doğrudan Trafik',
    share: 31.8,
    visitors: '14,519',
    color: '#2FF58E',
  },
  {
    id: 'social',
    label: 'Social Media',
    trLabel: 'Sosyal Medya',
    share: 16.4,
    visitors: '7,490',
    color: '#A855F7',
  },
  {
    id: 'referral',
    label: 'Referral',
    trLabel: 'Yönlendirme (Referral)',
    share: 9.5,
    visitors: '4,349',
    color: '#F59E0B',
  },
];

export interface TopPerformingPageRow extends Record<string, unknown> {
  id: string;
  path: string;
  title: string;
  views: string;
  uniqueViews: string;
  avgTime: string;
  bounceRate: number;
  conversion: number;
}

export const TOP_PERFORMING_PAGES: TopPerformingPageRow[] = [
  {
    id: 'p-1',
    path: '/dashboard',
    title: 'Main Dashboard',
    views: '12,847',
    uniqueViews: '8,921',
    avgTime: '4m 32s',
    bounceRate: 22.1,
    conversion: 8.4,
  },
  {
    id: 'p-2',
    path: '/analytics',
    title: 'Analytics Page',
    views: '9,234',
    uniqueViews: '7,156',
    avgTime: '6m 18s',
    bounceRate: 18.7,
    conversion: 12.3,
  },
  {
    id: 'p-3',
    path: '/products',
    title: 'Product Catalog',
    views: '7,892',
    uniqueViews: '5,467',
    avgTime: '3m 45s',
    bounceRate: 45.2,
    conversion: 6.7,
  },
  {
    id: 'p-4',
    path: '/checkout',
    title: 'Checkout Process',
    views: '4,567',
    uniqueViews: '3,891',
    avgTime: '2m 23s',
    bounceRate: 15.6,
    conversion: 67.8,
  },
  {
    id: 'p-5',
    path: '/contact',
    title: 'Contact Form',
    views: '3,421',
    uniqueViews: '2,876',
    avgTime: '1m 54s',
    bounceRate: 68.4,
    conversion: 3.2,
  },
];

export const GEOGRAPHIC_DISTRIBUTION = [
  {
    code: 'US',
    country: 'United States',
    share: 38.2,
    visitors: '17,446',
    color: '#2997FF',
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    share: 22.7,
    visitors: '10,367',
    color: '#2FF58E',
  },
  {
    code: 'CA',
    country: 'Canada',
    share: 15.8,
    visitors: '7,215',
    color: '#818CF8',
  },
  {
    code: 'DE',
    country: 'Germany',
    share: 12.4,
    visitors: '5,663',
    color: '#F59E0B',
  },
  {
    code: 'AU',
    country: 'Australia',
    share: 10.9,
    visitors: '4,981',
    color: '#EC4899',
  },
];

export const DEVICE_ANALYTICS = [
  {
    id: 'desktop',
    label: 'Desktop',
    share: 68.4,
    users: '31,247 users',
    color: '#2997FF',
    icon: <Monitor size={18} />,
  },
  {
    id: 'mobile',
    label: 'Mobile',
    share: 24.8,
    users: '11,327 users',
    color: '#2FF58E',
    icon: <Smartphone size={18} />,
  },
  {
    id: 'tablet',
    label: 'Tablet',
    share: 6.8,
    users: '3,098 users',
    color: '#A855F7',
    icon: <Tablet size={18} />,
  },
];

export const BROWSER_DISTRIBUTION = [
  { name: 'Chromium Engine', version: 'v130+', share: 58.4, color: '#2997FF' },
  { name: 'WebKit Engine', version: 'v18.1', share: 22.1, color: '#2FF58E' },
  { name: 'Blink Desktop', version: 'v130', share: 10.6, color: '#818CF8' },
  { name: 'Gecko Quantum', version: 'v132', share: 6.2, color: '#F59E0B' },
  { name: 'Diğer Modern', version: 'WebGL2', share: 2.7, color: '#EC4899' },
];

export const USER_BEHAVIOR_FLOW = [
  {
    step: '01',
    stage: 'Landing & Giriş (/dashboard)',
    users: '45,672',
    rate: 100,
    dropOff: '-37.8% ayrılma',
    color: '#2997FF',
  },
  {
    step: '02',
    stage: 'Ürün Kataloğu (/products)',
    users: '28,410',
    rate: 62.2,
    dropOff: '-59.8% ayrılma',
    color: '#00C8FF',
  },
  {
    step: '03',
    stage: 'Sepet & Plan Seçimi (/cart)',
    users: '11,420',
    rate: 25.0,
    dropOff: '-60.0% ayrılma',
    color: '#818CF8',
  },
  {
    step: '04',
    stage: 'Ödeme Adımı (/checkout)',
    users: '4,567',
    rate: 10.0,
    dropOff: '+67.8% tamamlanma',
    color: '#A855F7',
  },
  {
    step: '05',
    stage: 'Tamamlanan Sipariş (Conversion)',
    users: '1,576',
    rate: 3.45,
    dropOff: 'Net Dönüşüm %3.45',
    color: '#2FF58E',
  },
];

/**
 * Helper to build a smooth cubic-bezier SVG path from an array of (x, y) coordinates.
 */
function buildSmoothSvgPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const ctrlX1 = curr.x + (next.x - curr.x) * 0.45;
    const ctrlY1 = curr.y;
    const ctrlX2 = curr.x + (next.x - curr.x) * 0.55;
    const ctrlY2 = next.y;
    path += ` C ${ctrlX1.toFixed(1)} ${ctrlY1.toFixed(1)}, ${ctrlX2.toFixed(
      1
    )} ${ctrlY2.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return path;
}

export interface AnalyticsChartsSuiteProps {
  period: AnalyticsPeriod;
  onPeriodChange: (next: AnalyticsPeriod) => void;
  /** If true, renders the full Metis Analytics Dashboard (all 8 sections). If false, renders the top Revenue + Traffic Sources row for Overview. */
  fullAnalyticsMode?: boolean;
}

export const AnalyticsChartsSuite: React.FC<AnalyticsChartsSuiteProps> = ({
  period,
  onPeriodChange,
  fullAnalyticsMode = true,
}) => {
  const [chartType, setChartType] = useState<RevenueChartType>('area');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(5);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [showSecondarySeries, setShowSecondarySeries] = useState<boolean>(true);
  const [realtimeTick, setRealtimeTick] = useState<number>(0);

  const data = ANALYTICS_PERIOD_DATA[period];
  const maxRev = Math.max(...data.revenueK) * 1.12;
  const maxVis = Math.max(...data.visitorsK) * 1.15;

  // SVG coordinate system for Revenue Analytics Chart
  const svgWidth = 680;
  const svgHeight = 230;
  const padLeft = 44;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 34;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const revPoints = data.revenueK.map((val, idx) => {
    const x =
      padLeft +
      (idx / Math.max(1, data.revenueK.length - 1)) * plotW;
    const y = padTop + plotH - (val / maxRev) * plotH;
    return { x, y, val };
  });

  const visPoints = data.visitorsK.map((val, idx) => {
    const x =
      padLeft +
      (idx / Math.max(1, data.visitorsK.length - 1)) * plotW;
    const y = padTop + plotH - (val / maxVis) * plotH;
    return { x, y, val };
  });

  const revLinePath = buildSmoothSvgPath(revPoints);
  const revAreaPath = `${revLinePath} L ${
    revPoints[revPoints.length - 1].x
  } ${padTop + plotH} L ${revPoints[0].x} ${padTop + plotH} Z`;

  const visLinePath = buildSmoothSvgPath(visPoints);
  const visAreaPath = `${visLinePath} L ${
    visPoints[visPoints.length - 1].x
  } ${padTop + plotH} L ${visPoints[0].x} ${padTop + plotH} Z`;

  const activePointIdx = hoveredIdx !== null ? hoveredIdx : revPoints.length - 1;
  const activePoint = revPoints[activePointIdx] ?? revPoints[0];

  // Donut Chart geometry
  const donutRadius = 64;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativeShare = 0;

  const activeTrafficSource = TRAFFIC_SOURCES.find(
    (s) => s.id === selectedSourceId
  );

  // Real-time pulse bars
  const realtimeBars = [
    48, 62, 55, 71, 84, 78, 92, 66, 74, 88, 95, 81, 76, 89, 94, 72, 85, 91, 98,
    86, 79, 93, 88, 96,
  ].map((v, i) => {
    const offset = ((i + realtimeTick) * 13) % 15;
    return Math.min(100, Math.max(30, v - 7 + offset));
  });

  return (
    <div className="uxu-stack-md">
      {/* 1. METIS ANALYTICS 4-CARD KPI STRIP */}
      <div className="uxu-kpi-grid">
        <StatCard
          label="Total Revenue (Toplam Gelir)"
          value={data.totalRevenue}
          delta={data.revenueDelta}
          trend="up"
          tone="primary"
          subtitle="Comprehensive insights"
          icon={<TrendingUp size={17} />}
          sparklineData={data.revenueK}
        />
        <StatCard
          label="Total Visitors (Toplam Ziyaretçi)"
          value={data.totalVisitors}
          delta={data.visitorsDelta}
          trend="up"
          tone="success"
          subtitle="Tekil & organik oturumlar"
          icon={<Users size={17} />}
          sparklineData={data.visitorsK}
        />
        <StatCard
          label="Conversion Rate (Dönüşüm)"
          value={data.conversionRate}
          delta={data.conversionDelta}
          trend="up"
          tone="info"
          subtitle="Ödeme tamamlama oranı"
          icon={<MousePointerClick size={17} />}
          sparklineData={data.conversionPct}
        />
        <StatCard
          label="Bounce Rate (Hemen Çıkma)"
          value={data.bounceRate}
          delta={data.bounceDelta}
          trend="down"
          tone="warning"
          subtitle="Daha düşük = daha iyi etkileşim"
          icon={<Activity size={17} />}
          sparklineData={[28.4, 27.9, 26.8, 26.1, 25.5, 25.1, 24.8]}
        />
      </div>

      {/* 2. REVENUE ANALYTICS (MULTI-MODE SVG CHART) + TRAFFIC SOURCES (DONUT CHART) */}
      <div className="uxu-dash-chart-and-feed">
        {/* Left: Revenue Analytics Multi-Mode Chart */}
        <Card
          variant="glass"
          glowOnHover
          eyebrow="REVENUE ANALYTICS • GELİR VE ZİYARETÇİ TRENDİ"
          title="Revenue Analytics"
          subtitle="Etkileşimli Alan (Spline Area), Sütun (Bar) ve Hibrit (Combo) Grafik Motoru"
          headerIcon={<LineChart size={18} />}
          headerAction={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <SegmentedControl<RevenueChartType>
                value={chartType}
                onChange={setChartType}
                size="sm"
                options={[
                  { value: 'area', label: 'Alan (Spline)' },
                  { value: 'bar', label: 'Sütun (Bar)' },
                  { value: 'combo', label: 'Hibrit' },
                ]}
              />
              <SegmentedControl<AnalyticsPeriod>
                value={period}
                onChange={onPeriodChange}
                size="sm"
                options={[
                  { value: '24h', label: '24S' },
                  { value: '7d', label: '7G' },
                  { value: '30d', label: '30G' },
                  { value: '1y', label: '1Y' },
                ]}
              />
            </div>
          }
        >
          <div className="uxu-stack-sm">
            {/* Interactive Tooltip Readout Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <Badge tone="primary" size="xs">
                  Dönem: {data.labels[activePointIdx]}
                </Badge>
                <span style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)' }}>
                  Gelir:{' '}
                  <strong style={{ color: 'var(--uxu-text-primary)', fontFamily: 'var(--uxu-font-mono)' }}>
                    ${data.revenueK[activePointIdx].toFixed(1)}k
                  </strong>
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)' }}>
                  Ziyaretçi:{' '}
                  <strong style={{ color: '#2FF58E', fontFamily: 'var(--uxu-font-mono)' }}>
                    {data.visitorsK[activePointIdx].toFixed(1)}k
                  </strong>
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)' }}>
                  Dönüşüm:{' '}
                  <strong style={{ color: '#38BDF8', fontFamily: 'var(--uxu-font-mono)' }}>
                    %{data.conversionPct[activePointIdx].toFixed(2)}
                  </strong>
                </span>
              </div>

              <Chip
                size="xs"
                tone="info"
                selected={showSecondarySeries}
                onClick={() => setShowSecondarySeries((prev) => !prev)}
              >
                Ziyaretçi Katmanını Göster
              </Chip>
            </div>

            {/* Responsive SVG Multi-Mode Chart */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                style={{ width: '100%', height: 'auto', minHeight: 205, display: 'block' }}
                role="img"
                aria-label="Revenue Analytics Interactive Chart"
              >
                <defs>
                  <linearGradient id="uxiglRevAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--uxu-primary)" stopOpacity="0.42" />
                    <stop offset="65%" stopColor="var(--uxu-primary)" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="var(--uxu-primary)" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="uxiglVisAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2FF58E" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#2FF58E" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="uxiglBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2997FF" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines & Y-Axis Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = padTop + plotH - ratio * plotH;
                  const valLabel = `$${Math.round(ratio * maxRev)}k`;
                  return (
                    <g key={idx}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={svgWidth - padRight}
                        y2={y}
                        stroke="var(--uxu-border-subtle)"
                        strokeDasharray={ratio === 0 ? undefined : '4 4'}
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 8}
                        y={y + 4}
                        textAnchor="end"
                        fill="var(--uxu-text-tertiary)"
                        fontSize="10"
                        fontFamily="var(--uxu-font-mono)"
                      >
                        {valLabel}
                      </text>
                    </g>
                  );
                })}

                {/* MODE 1: AREA / SPLINE CHART */}
                {chartType === 'area' && (
                  <>
                    {showSecondarySeries && (
                      <>
                        <path d={visAreaPath} fill="url(#uxiglVisAreaGrad)" />
                        <path
                          d={visLinePath}
                          fill="none"
                          stroke="#2FF58E"
                          strokeWidth="2.2"
                          strokeDasharray="5 3"
                        />
                      </>
                    )}
                    <path d={revAreaPath} fill="url(#uxiglRevAreaGrad)" />
                    <path
                      d={revLinePath}
                      fill="none"
                      stroke="var(--uxu-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* MODE 2: GROUPED BAR CHART */}
                {chartType === 'bar' &&
                  revPoints.map((pt, idx) => {
                    const barW = showSecondarySeries ? 18 : 28;
                    const revBarH = padTop + plotH - pt.y;
                    const visPt = visPoints[idx];
                    const visBarH = padTop + plotH - visPt.y;
                    return (
                      <g
                        key={idx}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredIdx(idx)}
                      >
                        <rect
                          x={pt.x - (showSecondarySeries ? barW + 2 : barW / 2)}
                          y={pt.y}
                          width={barW}
                          height={Math.max(4, revBarH)}
                          rx={5}
                          fill="url(#uxiglBarGrad)"
                          opacity={activePointIdx === idx ? 1 : 0.82}
                        />
                        {showSecondarySeries && (
                          <rect
                            x={pt.x + 2}
                            y={visPt.y}
                            width={barW}
                            height={Math.max(4, visBarH)}
                            rx={5}
                            fill="#2FF58E"
                            opacity={activePointIdx === idx ? 0.95 : 0.68}
                          />
                        )}
                      </g>
                    );
                  })}

                {/* MODE 3: COMBO CHART (BARS + SPLINE LINE) */}
                {chartType === 'combo' && (
                  <>
                    {revPoints.map((pt, idx) => {
                      const barW = 26;
                      const revBarH = padTop + plotH - pt.y;
                      return (
                        <rect
                          key={idx}
                          x={pt.x - barW / 2}
                          y={pt.y}
                          width={barW}
                          height={Math.max(4, revBarH)}
                          rx={6}
                          fill="url(#uxiglBarGrad)"
                          opacity={activePointIdx === idx ? 0.92 : 0.55}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredIdx(idx)}
                        />
                      );
                    })}
                    {showSecondarySeries && (
                      <path
                        d={visLinePath}
                        fill="none"
                        stroke="#2FF58E"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    )}
                  </>
                )}

                {/* Vertical Crosshair Line on Active Point */}
                <line
                  x1={activePoint.x}
                  y1={padTop}
                  x2={activePoint.x}
                  y2={padTop + plotH}
                  stroke="var(--uxu-primary)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.65"
                />

                {/* Interactive Data Nodes & X-Axis Labels */}
                {revPoints.map((pt, idx) => {
                  const isCurrent = activePointIdx === idx;
                  const visPt = visPoints[idx];
                  return (
                    <g
                      key={idx}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onClick={() => setHoveredIdx(idx)}
                    >
                      {/* Invisible wider hit target for smooth hover */}
                      <rect
                        x={pt.x - plotW / (revPoints.length * 2)}
                        y={padTop}
                        width={plotW / revPoints.length}
                        height={plotH + 24}
                        fill="transparent"
                      />

                      {chartType !== 'bar' && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isCurrent ? 6 : 4}
                          fill="var(--uxu-surface-elevated)"
                          stroke="var(--uxu-primary)"
                          strokeWidth={isCurrent ? 3 : 2}
                        />
                      )}

                      {showSecondarySeries && chartType !== 'bar' && (
                        <circle
                          cx={visPt.x}
                          cy={visPt.y}
                          r={isCurrent ? 5 : 3.5}
                          fill="#0B132B"
                          stroke="#2FF58E"
                          strokeWidth={2}
                        />
                      )}

                      {/* Value pill above active point */}
                      {isCurrent && (
                        <g transform={`translate(${pt.x}, ${Math.max(18, pt.y - 14)})`}>
                          <rect
                            x="-30"
                            y="-14"
                            width="60"
                            height="19"
                            rx="6"
                            fill="var(--uxu-primary)"
                          />
                          <text
                            x="0"
                            y="-1"
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontSize="10"
                            fontWeight="700"
                            fontFamily="var(--uxu-font-mono)"
                          >
                            ${pt.val.toFixed(1)}k
                          </text>
                        </g>
                      )}

                      {/* X-Axis Label */}
                      <text
                        x={pt.x}
                        y={svgHeight - 10}
                        textAnchor="middle"
                        fill={
                          isCurrent
                            ? 'var(--uxu-text-primary)'
                            : 'var(--uxu-text-secondary)'
                        }
                        fontWeight={isCurrent ? '700' : '500'}
                        fontSize="11"
                      >
                        {data.labels[idx]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="uxu-chart-legend" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <span className="uxu-chart-legend__item">
                  <i className="uxu-legend-dot uxu-legend-dot--primary" />
                  Total Revenue (Gelir $)
                </span>
                <span className="uxu-chart-legend__item">
                  <i
                    className="uxu-legend-dot"
                    style={{ background: '#2FF58E' }}
                  />
                  Total Visitors (Ziyaretçi Bin)
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--uxu-text-tertiary)' }}>
                Noktaların üzerine gelerek dönem detaylarını inceleyin
              </span>
            </div>
          </div>
        </Card>

        {/* Right: Traffic Sources Interactive Donut Chart */}
        <Card
          variant="tonal"
          glowOnHover
          eyebrow="TRAFFIC SOURCES • KANAL DAĞILIMI"
          title="Traffic Sources"
          subtitle="Organik, Doğrudan, Sosyal Medya ve Yönlendirme"
          headerIcon={<PieChart size={18} />}
          headerAction={
            <Badge tone="success" size="xs" pulse>
              45,672 Toplam
            </Badge>
          }
        >
          <div className="uxu-stack-md">
            {/* Interactive SVG Donut Ring + Center Readout */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                flexWrap: 'wrap',
                padding: '4px 0',
              }}
            >
              <div style={{ position: 'relative', width: 164, height: 164 }}>
                <svg
                  viewBox="0 0 164 164"
                  style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
                >
                  <circle
                    cx="82"
                    cy="82"
                    r={donutRadius}
                    fill="none"
                    stroke="var(--uxu-border-subtle)"
                    strokeWidth="16"
                  />
                  {TRAFFIC_SOURCES.map((src) => {
                    const segLength = (src.share / 100) * donutCircumference;
                    const dashArray = `${Math.max(0, segLength - 3)} ${donutCircumference}`;
                    const dashOffset = -(cumulativeShare / 100) * donutCircumference;
                    cumulativeShare += src.share;
                    const isSelected = selectedSourceId === src.id;

                    return (
                      <circle
                        key={src.id}
                        cx="82"
                        cy="82"
                        r={donutRadius}
                        fill="none"
                        stroke={src.color}
                        strokeWidth={isSelected ? 20 : 16}
                        strokeDasharray={dashArray}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="butt"
                        style={{
                          cursor: 'pointer',
                          transition: 'stroke-width 200ms ease, opacity 200ms ease',
                          opacity:
                            selectedSourceId && !isSelected ? 0.45 : 1,
                        }}
                        onClick={() =>
                          setSelectedSourceId((prev) =>
                            prev === src.id ? null : src.id
                          )
                        }
                      />
                    );
                  })}
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--uxu-text-primary)',
                      fontFamily: 'var(--uxu-font-mono)',
                    }}
                  >
                    {activeTrafficSource
                      ? `${activeTrafficSource.share}%`
                      : '45.6K'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--uxu-text-secondary)',
                      maxWidth: 92,
                      lineHeight: 1.2,
                    }}
                  >
                    {activeTrafficSource
                      ? activeTrafficSource.label
                      : 'Toplam Oturum'}
                  </span>
                </div>
              </div>

              {/* Channel Breakdown List */}
              <div className="uxu-stack-sm" style={{ flex: 1, minWidth: 200 }}>
                {TRAFFIC_SOURCES.map((src) => {
                  const isSelected = selectedSourceId === src.id;
                  return (
                    <div
                      key={src.id}
                      onClick={() =>
                        setSelectedSourceId((prev) =>
                          prev === src.id ? null : src.id
                        )
                      }
                      style={{
                        padding: '7px 10px',
                        borderRadius: 'var(--uxu-radius-sm)',
                        background: isSelected
                          ? 'var(--uxu-surface-elevated)'
                          : 'transparent',
                        border: isSelected
                          ? `1px solid ${src.color}`
                          : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 160ms ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 4,
                          fontSize: '0.8rem',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 7,
                            fontWeight: 600,
                            color: 'var(--uxu-text-primary)',
                          }}
                        >
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: '50%',
                              background: src.color,
                              display: 'inline-block',
                            }}
                          />
                          {src.label}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--uxu-font-mono)',
                            fontSize: '0.76rem',
                            color: 'var(--uxu-text-secondary)',
                          }}
                        >
                          <strong style={{ color: 'var(--uxu-text-primary)' }}>
                            {src.share}%
                          </strong>{' '}
                          ({src.visitors})
                        </span>
                      </div>
                      <div
                        style={{
                          height: 5,
                          borderRadius: 999,
                          background: 'var(--uxu-border-subtle)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${src.share}%`,
                            height: '100%',
                            background: src.color,
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* IF FULL ANALYTICS MODE: RENDER REMAINING METIS ANALYTICS SECTIONS */}
      {fullAnalyticsMode && (
        <>
          {/* 3. USER BEHAVIOR FLOW (FUNNEL) + REAL-TIME ACTIVITY (LIVE) */}
          <div className="uxu-dash-chart-and-feed">
            {/* Left: User Behavior Flow */}
            <Card
              variant="glass"
              glowOnHover
              eyebrow="USER BEHAVIOR FLOW • DÖNÜŞÜM HUNİSİ"
              title="User Behavior Flow"
              subtitle="Adım adım oturum ilerleyişi, sepet etkileşimi ve ödeme dönüşüm hunisi"
              headerIcon={<Filter size={18} />}
              headerAction={
                <Badge tone="info" size="xs">
                  5 Aşamalı Huni
                </Badge>
              }
            >
              <div className="uxu-stack-sm">
                {USER_BEHAVIOR_FLOW.map((item) => (
                  <div
                    key={item.step}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Badge tone="primary" size="xs">
                          {item.step}
                        </Badge>
                        <strong style={{ fontSize: '0.84rem' }}>{item.stage}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            color: 'var(--uxu-text-tertiary)',
                          }}
                        >
                          {item.dropOff}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--uxu-font-mono)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            color: 'var(--uxu-text-primary)',
                          }}
                        >
                          {item.users} ({item.rate}%)
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 999,
                        background: 'var(--uxu-border-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(6, item.rate)}%`,
                          height: '100%',
                          background: item.color,
                          borderRadius: 999,
                          transition: 'width 400ms ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right: Real-time Activity (LIVE) */}
            <Card
              variant="glass"
              glowOnHover
              eyebrow="REAL-TIME ACTIVITY • CANLI TELEMETRİ"
              title="Real-time Activity"
              subtitle="Anlık aktif oturumlar, sayfa görüntülemeleri ve canlı trafik dalgası"
              headerIcon={<Radio size={18} />}
              headerAction={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Badge tone="success" size="xs" pulse>
                    LIVE
                  </Badge>
                  <Button
                    variant="tonal"
                    size="xs"
                    onClick={() => setRealtimeTick((t) => t + 1)}
                  >
                    Simüle Et
                  </Button>
                </div>
              }
            >
              <div className="uxu-stack-md">
                {/* Active Users Hero Counter */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--uxu-text-secondary)',
                      }}
                    >
                      Active Users
                    </div>
                    <div
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#2FF58E',
                        fontFamily: 'var(--uxu-font-mono)',
                      }}
                    >
                      {(1247 + realtimeTick * 7).toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--uxu-text-secondary)',
                      }}
                    >
                      Page Views
                    </div>
                    <div
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: 'var(--uxu-text-primary)',
                        fontFamily: 'var(--uxu-font-mono)',
                      }}
                    >
                      {(8452 + realtimeTick * 19).toLocaleString()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--uxu-text-secondary)',
                      }}
                    >
                      Sessions
                    </div>
                    <div
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#38BDF8',
                        fontFamily: 'var(--uxu-font-mono)',
                      }}
                    >
                      {(2931 + realtimeTick * 5).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Live 24-Bar Waveform Histogram */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.74rem',
                      color: 'var(--uxu-text-secondary)',
                      marginBottom: 6,
                    }}
                  >
                    <span>Son 60 Dakika İstek Yoğunluğu</span>
                    <span style={{ color: '#2FF58E', fontWeight: 600 }}>
                      ~142 req/sn
                    </span>
                  </div>
                  <div
                    style={{
                      height: 96,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(24, 1fr)',
                      alignItems: 'end',
                      gap: 4,
                      padding: '10px 8px 6px',
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                    }}
                  >
                    {realtimeBars.map((val, idx) => (
                      <div
                        key={idx}
                        title={`${val}% yük`}
                        style={{
                          height: `${val}%`,
                          borderRadius: '3px 3px 1px 1px',
                          background:
                            idx >= 20
                              ? 'linear-gradient(180deg, #2FF58E, #00C8FF)'
                              : 'var(--uxu-primary)',
                          opacity: idx >= 20 ? 1 : 0.65,
                          transition: 'height 300ms ease',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.76rem',
                    color: 'var(--uxu-text-secondary)',
                  }}
                >
                  <span>En yoğun rota: <code>/dashboard/analytics</code> (%34)</span>
                  <span>Ortalama gecikme: <strong>14 ms</strong></span>
                </div>
              </div>
            </Card>
          </div>

          {/* 4. TOP PERFORMING PAGES TABLE + GEOGRAPHIC DISTRIBUTION */}
          <div className="uxu-dash-chart-and-feed">
            {/* Left: Top Performing Pages */}
            <Card
              variant="glass"
              padding="md"
              eyebrow="TOP PERFORMING PAGES • SAYFA PERFORMANSI"
              title="Top Performing Pages"
              subtitle="Sayfa görüntülemeleri, tekil ziyaretçiler, ortalama süre, hemen çıkma ve dönüşüm oranları"
              headerIcon={<BarChart3 size={18} />}
            >
              <DataTable<TopPerformingPageRow>
                rowKey="id"
                variant="striped"
                size="md"
                data={TOP_PERFORMING_PAGES}
                columns={[
                  {
                    key: 'path',
                    header: 'Page (Sayfa)',
                    sortable: true,
                    render: (row) => (
                      <div>
                        <code
                          style={{
                            fontFamily: 'var(--uxu-font-mono)',
                            fontWeight: 700,
                            color: 'var(--uxu-primary)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {row.path}
                        </code>
                        <div
                          style={{
                            fontSize: '0.73rem',
                            color: 'var(--uxu-text-secondary)',
                          }}
                        >
                          {row.title}
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'views',
                    header: 'Views',
                    sortable: true,
                    align: 'right',
                    render: (row) => (
                      <strong style={{ fontFamily: 'var(--uxu-font-mono)' }}>
                        {row.views}
                      </strong>
                    ),
                  },
                  {
                    key: 'uniqueViews',
                    header: 'Unique Views',
                    sortable: true,
                    align: 'right',
                    render: (row) => (
                      <span style={{ fontFamily: 'var(--uxu-font-mono)' }}>
                        {row.uniqueViews}
                      </span>
                    ),
                  },
                  {
                    key: 'avgTime',
                    header: 'Avg. Time',
                    align: 'right',
                  },
                  {
                    key: 'bounceRate',
                    header: 'Bounce Rate',
                    sortable: true,
                    align: 'right',
                    render: (row) => (
                      <Badge
                        size="xs"
                        tone={
                          row.bounceRate < 25
                            ? 'success'
                            : row.bounceRate < 50
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {row.bounceRate}%
                      </Badge>
                    ),
                  },
                  {
                    key: 'conversion',
                    header: 'Conversion',
                    sortable: true,
                    align: 'right',
                    render: (row) => (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontWeight: 700,
                          color:
                            row.conversion >= 10
                              ? '#2FF58E'
                              : 'var(--uxu-text-primary)',
                          fontFamily: 'var(--uxu-font-mono)',
                        }}
                      >
                        {row.conversion}%
                        <ArrowUpRight size={13} />
                      </span>
                    ),
                  },
                ]}
              />
            </Card>

            {/* Right: Geographic Distribution */}
            <Card
              variant="tonal"
              glowOnHover
              eyebrow="GEOGRAPHIC DISTRIBUTION • BÖLGESEL DAĞILIM"
              title="Geographic Distribution"
              subtitle="Ülkelere göre ziyaretçi yoğunluğu ve pazar payı"
              headerIcon={<Globe size={18} />}
              headerAction={
                <Badge tone="primary" size="xs">
                  5 Küresel Bölge
                </Badge>
              }
            >
              <div className="uxu-stack-md">
                {GEOGRAPHIC_DISTRIBUTION.map((geo) => (
                  <div key={geo.code} className="uxu-stack-xs">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.83rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontWeight: 600,
                        }}
                      >
                        <Badge tone="neutral" size="xs">
                          {geo.code}
                        </Badge>
                        {geo.country}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--uxu-font-mono)',
                          fontSize: '0.78rem',
                          color: 'var(--uxu-text-secondary)',
                        }}
                      >
                        <strong style={{ color: 'var(--uxu-text-primary)' }}>
                          {geo.share}%
                        </strong>{' '}
                        • {geo.visitors}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 999,
                        background: 'var(--uxu-border-subtle)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${geo.share}%`,
                          height: '100%',
                          background: geo.color,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 5. DEVICE ANALYTICS & BROWSER DISTRIBUTION */}
          <div className="uxu-dash-chart-and-feed">
            {/* Left: Device Analytics */}
            <Card
              variant="glass"
              glowOnHover
              eyebrow="DEVICE ANALYTICS • CİHAZ KIRILIMI"
              title="Device Analytics"
              subtitle="Desktop (68.4%), Mobile (24.8%) ve Tablet (6.8%) oturum dağılımı"
              headerIcon={<Monitor size={18} />}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 12,
                }}
              >
                {DEVICE_ANALYTICS.map((dev) => (
                  <div
                    key={dev.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--uxu-radius-lg)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontWeight: 700,
                          color: 'var(--uxu-text-primary)',
                        }}
                      >
                        <span style={{ color: dev.color }}>{dev.icon}</span>
                        {dev.label}
                      </span>
                      <Badge tone="primary" size="xs">
                        {dev.share}%
                      </Badge>
                    </div>

                    <div
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        fontFamily: 'var(--uxu-font-mono)',
                        color: dev.color,
                      }}
                    >
                      {dev.share}%
                    </div>

                    <Progress
                      value={dev.share}
                      tone={
                        dev.id === 'desktop'
                          ? 'primary'
                          : dev.id === 'mobile'
                          ? 'success'
                          : 'info'
                      }
                      size="sm"
                    />

                    <span
                      style={{
                        fontSize: '0.76rem',
                        color: 'var(--uxu-text-secondary)',
                      }}
                    >
                      {dev.users}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right: Browser Distribution */}
            <Card
              variant="tonal"
              glowOnHover
              eyebrow="BROWSER DISTRIBUTION • TARAYICI MOTORLARI"
              title="Browser Distribution"
              subtitle="WebGL2 & CSS Backdrop-Filter uyumlu modern tarayıcı dağılımı"
              headerIcon={<Layers size={18} />}
              headerAction={
                <Badge tone="success" size="xs">
                  WebGL2 %99.4
                </Badge>
              }
            >
              <div className="uxu-stack-md">
                {/* Stacked Multi-Segment Progress Bar */}
                <div
                  style={{
                    height: 14,
                    borderRadius: 999,
                    overflow: 'hidden',
                    display: 'flex',
                    gap: 2,
                    background: 'var(--uxu-border-subtle)',
                  }}
                >
                  {BROWSER_DISTRIBUTION.map((b) => (
                    <div
                      key={b.name}
                      title={`${b.name}: ${b.share}%`}
                      style={{
                        width: `${b.share}%`,
                        height: '100%',
                        background: b.color,
                      }}
                    />
                  ))}
                </div>

                {/* Browser Breakdown Rows */}
                <div className="uxu-stack-xs">
                  {BROWSER_DISTRIBUTION.map((b) => (
                    <div
                      key={b.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 'var(--uxu-radius-sm)',
                        background: 'var(--uxu-surface-elevated)',
                        border: '1px solid var(--uxu-border-subtle)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 3,
                            background: b.color,
                            display: 'inline-block',
                          }}
                        />
                        <strong>{b.name}</strong>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--uxu-text-tertiary)',
                          }}
                        >
                          ({b.version})
                        </span>
                      </div>
                      <strong
                        style={{
                          fontFamily: 'var(--uxu-font-mono)',
                          color: 'var(--uxu-text-primary)',
                        }}
                      >
                        {b.share}%
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
