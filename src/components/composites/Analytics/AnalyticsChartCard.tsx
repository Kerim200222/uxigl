import React, { useMemo, useState } from 'react';
import { BarChart3, LineChart } from 'lucide-react';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import type { AnalyticsChartType, AnalyticsSeriesPoint } from './types';

/**
 * Props contract for {@link AnalyticsChartCard}.
 */
export interface AnalyticsChartCardProps {
  /** Primary card title. */
  title: string;
  /** Secondary subtitle description. */
  subtitle: string;
  /** Ordered time-series data points to plot. */
  series: AnalyticsSeriesPoint[];
  /** Display locale (`'tr' | 'en'`). */
  locale: 'tr' | 'en';
}

const CHART_WIDTH = 560;
const CHART_HEIGHT = 210;
const PAD_X = 28;
const PAD_Y = 20;
const PLOT_W = CHART_WIDTH - PAD_X * 2;
const PLOT_H = CHART_HEIGHT - PAD_Y * 2;
const GRID_RATIOS = [0.25, 0.5, 0.75, 1] as const;

const CHART_STYLES = {
  container: { position: 'relative', width: '100%' },
  tooltip: {
    position: 'absolute',
    top: 6,
    right: 8,
    padding: '4px 10px',
    borderRadius: 'var(--uxu-radius-sm)',
    background: 'var(--uxu-bg-elevated)',
    border: '1px solid var(--uxu-border-subtle)',
    fontSize: '0.75rem',
    fontWeight: 700,
    pointerEvents: 'none',
  },
  svg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    overflow: 'visible',
  },
  pointCursor: { cursor: 'pointer' },
} satisfies Record<string, React.CSSProperties>;

/**
 * Interactive SVG Area and Bar chart card with memoized path geometry and
 * pointer/keyboard focusable data point tooltips.
 *
 * @param props - {@link AnalyticsChartCardProps} configuration options.
 * @returns Rendered analytics chart card.
 */
export const AnalyticsChartCard: React.FC<AnalyticsChartCardProps> = ({
  title,
  subtitle,
  series,
  locale,
}) => {
  const isTR = locale === 'tr';
  const [chartType, setChartType] = useState<AnalyticsChartType>('area');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { points, linePath, areaPath, barW } = useMemo(() => {
    const maxVal = Math.max(1, ...series.map((s) => s.primary)) * 1.15;
    const computedPoints = series.map((s, idx) => {
      const x =
        series.length > 1
          ? PAD_X + (idx / (series.length - 1)) * PLOT_W
          : PAD_X + PLOT_W / 2;
      const y = PAD_Y + PLOT_H - (s.primary / maxVal) * PLOT_H;
      return { x, y, item: s };
    });

    const computedLinePath = computedPoints
      .map(
        (p, idx) =>
          `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      )
      .join(' ');

    const computedAreaPath =
      computedPoints.length > 0
        ? `${computedLinePath} L ${computedPoints[computedPoints.length - 1].x.toFixed(1)} ${(PAD_Y + PLOT_H).toFixed(1)} L ${computedPoints[0].x.toFixed(1)} ${(PAD_Y + PLOT_H).toFixed(1)} Z`
        : '';

    const computedBarW = Math.max(
      18,
      Math.min(36, PLOT_W / Math.max(1, series.length) - 14)
    );

    return {
      points: computedPoints,
      linePath: computedLinePath,
      areaPath: computedAreaPath,
      barW: computedBarW,
    };
  }, [series]);

  const hovered = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <Card
      variant="glass"
      padding="md"
      title={title}
      subtitle={subtitle}
      headerAction={
        <SegmentedControl<AnalyticsChartType>
          size="sm"
          value={chartType}
          onChange={setChartType}
          options={[
            {
              value: 'area',
              label: isTR ? 'Alan' : 'Area',
              icon: <LineChart size={13} />,
            },
            {
              value: 'bar',
              label: isTR ? 'Sütun' : 'Bar',
              icon: <BarChart3 size={13} />,
            },
          ]}
        />
      }
    >
      <div style={CHART_STYLES.container}>
        {hovered && (
          <div style={CHART_STYLES.tooltip} data-testid="analytics-chart-tooltip">
            {hovered.item.label}: ${hovered.item.primary.toFixed(1)}K
          </div>
        )}

        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          style={CHART_STYLES.svg}
          role="img"
          aria-label={title}
        >
          <defs>
            <linearGradient
              id="uxuAnalyticsAreaGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="var(--uxu-primary)"
                stopOpacity="0.35"
              />
              <stop
                offset="100%"
                stopColor="var(--uxu-primary)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {GRID_RATIOS.map((ratio) => {
            const y = PAD_Y + PLOT_H * (1 - ratio);
            return (
              <line
                key={ratio}
                x1={PAD_X}
                y1={y}
                x2={CHART_WIDTH - PAD_X}
                y2={y}
                stroke="var(--uxu-border-subtle)"
                strokeDasharray="3 4"
              />
            );
          })}

          {chartType === 'area' ? (
            <>
              {areaPath && (
                <path d={areaPath} fill="url(#uxuAnalyticsAreaGrad)" />
              )}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--uxu-primary)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {points.map((p, idx) => (
                <g key={p.item.label}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredIdx === idx ? 5.5 : 3.5}
                    fill="var(--uxu-primary)"
                    stroke="var(--uxu-bg-elevated)"
                    strokeWidth={2}
                    tabIndex={0}
                    role="graphics-symbol"
                    aria-label={`${p.item.label}: $${p.item.primary.toFixed(1)}K`}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onFocus={() => setHoveredIdx(idx)}
                    onBlur={() => setHoveredIdx(null)}
                    style={CHART_STYLES.pointCursor}
                  />
                </g>
              ))}
            </>
          ) : (
            points.map((p, idx) => {
              const barH = PAD_Y + PLOT_H - p.y;
              return (
                <rect
                  key={p.item.label}
                  x={p.x - barW / 2}
                  y={p.y}
                  width={barW}
                  height={Math.max(2, barH)}
                  rx={6}
                  fill="var(--uxu-primary)"
                  opacity={
                    hoveredIdx === null || hoveredIdx === idx ? 0.88 : 0.45
                  }
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${p.item.label}: $${p.item.primary.toFixed(1)}K`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => setHoveredIdx(idx)}
                  onBlur={() => setHoveredIdx(null)}
                  style={CHART_STYLES.pointCursor}
                />
              );
            })
          )}

          {points.map((p) => (
            <text
              key={`lbl-${p.item.label}`}
              x={p.x}
              y={CHART_HEIGHT - 2}
              textAnchor="middle"
              fontSize="11"
              fill="var(--uxu-text-secondary)"
            >
              {p.item.label}
            </text>
          ))}
        </svg>
      </div>
    </Card>
  );
};
