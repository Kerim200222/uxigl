import React from 'react';
import { Card } from '../Card/Card';
import type { AnalyticsBreakdownItem } from './types';

/**
 * Props contract for {@link AnalyticsBreakdownCard}.
 */
export interface AnalyticsBreakdownCardProps {
  /** Card header title. */
  title: string;
  /** Optional card subtitle. */
  subtitle?: string;
  /** Array of breakdown items with percentage shares. */
  items: AnalyticsBreakdownItem[];
}

const BREAKDOWN_STYLES = {
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'flex', flexDirection: 'column', gap: 5 },
  rowHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
  },
  label: { fontWeight: 600 },
  value: { color: 'var(--uxu-text-secondary)', fontWeight: 600 },
  track: {
    height: 7,
    borderRadius: 999,
    background: 'var(--uxu-surface-tonal)',
    overflow: 'hidden',
  },
} satisfies Record<string, React.CSSProperties>;

/**
 * Channel or device share breakdown card rendering labeled WAI-ARIA `progressbar` meters.
 *
 * @param props - {@link AnalyticsBreakdownCardProps} configuration options.
 * @returns Rendered breakdown card.
 */
export const AnalyticsBreakdownCard: React.FC<AnalyticsBreakdownCardProps> = ({
  title,
  subtitle,
  items,
}) => {
  return (
    <Card variant="glass" padding="md" title={title} subtitle={subtitle}>
      <div style={BREAKDOWN_STYLES.list}>
        {items.map((item) => {
          const clampedPct = Math.max(0, Math.min(100, item.sharePct));
          return (
            <div key={item.id} style={BREAKDOWN_STYLES.row}>
              <div style={BREAKDOWN_STYLES.rowHeader}>
                <span style={BREAKDOWN_STYLES.label}>{item.label}</span>
                <span style={BREAKDOWN_STYLES.value}>
                  {item.value} ({item.sharePct}%)
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={item.label}
                aria-valuenow={clampedPct}
                aria-valuemin={0}
                aria-valuemax={100}
                style={BREAKDOWN_STYLES.track}
              >
                <div
                  style={{
                    width: `${clampedPct}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: item.color,
                    transition: 'width 220ms ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
