import type { AnalyticsDataset, AnalyticsPeriod } from './types';

/**
 * Builds the localized KPI, time-series, traffic channel, and device breakdown
 * dataset for the given {@link AnalyticsPeriod}.
 *
 * @param period - Selected time window (`'24h' | '7d' | '30d' | '1y'`).
 * @param locale - Display locale (`'tr' | 'en'`, defaults to `'tr'`).
 * @returns Complete {@link AnalyticsDataset} for the requested period.
 */
export function buildAnalyticsDataset(
  period: AnalyticsPeriod,
  locale: 'tr' | 'en' = 'tr'
): AnalyticsDataset {
  const isTR = locale === 'tr';

  const seriesByPeriod: Record<AnalyticsPeriod, AnalyticsDataset['series']> = {
    '24h': [
      { label: '00:00', primary: 11.2, secondary: 4.1 },
      { label: '04:00', primary: 9.8, secondary: 3.5 },
      { label: '08:00', primary: 16.4, secondary: 6.2 },
      { label: '12:00', primary: 22.8, secondary: 8.9 },
      { label: '16:00', primary: 20.5, secondary: 8.1 },
      { label: '20:00', primary: 25.4, secondary: 9.4 },
      { label: isTR ? 'Şimdi' : 'Now', primary: 28.9, secondary: 10.8 },
    ],
    '7d': [
      { label: isTR ? 'Pzt' : 'Mon', primary: 14.5, secondary: 5.4 },
      { label: isTR ? 'Sal' : 'Tue', primary: 16.8, secondary: 6.1 },
      { label: isTR ? 'Çar' : 'Wed', primary: 15.9, secondary: 5.8 },
      { label: isTR ? 'Per' : 'Thu', primary: 19.4, secondary: 7.2 },
      { label: isTR ? 'Cum' : 'Fri', primary: 22.6, secondary: 8.4 },
      { label: isTR ? 'Cmt' : 'Sat', primary: 20.1, secondary: 7.6 },
      { label: isTR ? 'Paz' : 'Sun', primary: 24.8, secondary: 9.1 },
    ],
    '30d': [
      { label: isTR ? '1.Hft' : 'W1', primary: 13.2, secondary: 4.8 },
      { label: isTR ? '2.Hft' : 'W2', primary: 15.6, secondary: 5.5 },
      { label: isTR ? '3.Hft' : 'W3', primary: 17.8, secondary: 6.4 },
      { label: isTR ? '4.Hft' : 'W4', primary: 16.9, secondary: 6.1 },
      { label: isTR ? '5.Hft' : 'W5', primary: 20.4, secondary: 7.5 },
      { label: isTR ? '6.Hft' : 'W6', primary: 22.9, secondary: 8.3 },
      { label: isTR ? '7.Hft' : 'W7', primary: 25.8, secondary: 9.4 },
    ],
    '1y': [
      { label: isTR ? 'Oca' : 'Jan', primary: 68.0, secondary: 24.2 },
      { label: isTR ? 'Şub' : 'Feb', primary: 82.4, secondary: 29.8 },
      { label: isTR ? 'Nis' : 'Apr', primary: 94.2, secondary: 34.5 },
      { label: isTR ? 'Haz' : 'Jun', primary: 105.8, secondary: 38.9 },
      { label: isTR ? 'Ağu' : 'Aug', primary: 114.6, secondary: 42.1 },
      { label: isTR ? 'Eki' : 'Oct', primary: 124.6, secondary: 45.7 },
      { label: isTR ? 'Ara' : 'Dec', primary: 138.4, secondary: 51.2 },
    ],
  };

  const kpiSummary: Record<
    AnalyticsPeriod,
    { rev: string; revD: string; vis: string; visD: string; conv: string; convD: string; bounce: string; bounceD: string }
  > = {
    '24h': {
      rev: '$18,420',
      revD: '+9.4%',
      vis: '8,452',
      visD: '+11.2%',
      conv: '3.68%',
      convD: '+0.4%',
      bounce: '23.1%',
      bounceD: '-1.2%',
    },
    '7d': {
      rev: '$42,890',
      revD: '+14.2%',
      vis: '19,840',
      visD: '+9.6%',
      conv: '3.52%',
      convD: '+1.4%',
      bounce: '24.2%',
      bounceD: '-1.5%',
    },
    '30d': {
      rev: '$124,592',
      revD: '+12.5%',
      vis: '45,672',
      visD: '+8.2%',
      conv: '3.45%',
      convD: '+2.1%',
      bounce: '24.8%',
      bounceD: '-1.8%',
    },
    '1y': {
      rev: '$1,284,900',
      revD: '+34.8%',
      vis: '482,310',
      visD: '+26.4%',
      conv: '3.45%',
      convD: '+2.1%',
      bounce: '24.8%',
      bounceD: '-1.8%',
    },
  };

  const summary = kpiSummary[period];
  const series = seriesByPeriod[period];

  return {
    kpis: [
      {
        id: 'revenue',
        label: isTR ? 'Toplam Gelir' : 'Total Revenue',
        value: summary.rev,
        delta: summary.revD,
        trend: 'up',
        tone: 'primary',
        sparklineData: series.map((s) => s.primary),
        subtitle: isTR ? 'Önceki döneme göre' : 'vs previous period',
      },
      {
        id: 'visitors',
        label: isTR ? 'Aktif Ziyaretçi' : 'Active Visitors',
        value: summary.vis,
        delta: summary.visD,
        trend: 'up',
        tone: 'info',
        sparklineData: series.map((s) => s.secondary ?? s.primary * 0.4),
        subtitle: isTR ? 'Benzersiz oturum' : 'Unique sessions',
      },
      {
        id: 'conversion',
        label: isTR ? 'Dönüşüm Oranı' : 'Conversion Rate',
        value: summary.conv,
        delta: summary.convD,
        trend: 'up',
        tone: 'success',
        sparklineData: [2.8, 3.0, 3.2, 3.1, 3.4, 3.5, 3.7],
        subtitle: isTR ? 'Ödeme tamamlama' : 'Checkout completion',
      },
      {
        id: 'bounce',
        label: isTR ? 'Hemen Çıkma' : 'Bounce Rate',
        value: summary.bounce,
        delta: summary.bounceD,
        trend: 'down',
        tone: 'warning',
        sparklineData: [27.1, 26.4, 25.8, 25.1, 24.9, 24.5, 24.2],
        subtitle: isTR ? 'Düşüş olumlu' : 'Lower is better',
      },
    ],
    series,
    channels: [
      { id: 'organic', label: isTR ? 'Organik Arama' : 'Organic Search', value: '19,180', sharePct: 42, color: 'var(--uxu-primary)' },
      { id: 'direct', label: isTR ? 'Doğrudan' : 'Direct', value: '12,788', sharePct: 28, color: '#06B6D4' },
      { id: 'referral', label: isTR ? 'Referans & Partner' : 'Referral & Partner', value: '8,220', sharePct: 18, color: '#10B981' },
      { id: 'social', label: isTR ? 'Sosyal Medya' : 'Social Media', value: '5,484', sharePct: 12, color: '#8B5CF6' },
    ],
    devices: [
      { id: 'desktop', label: isTR ? 'Masaüstü' : 'Desktop', value: '28,316', sharePct: 62, color: 'var(--uxu-primary)' },
      { id: 'mobile', label: isTR ? 'Mobil' : 'Mobile', value: '13,245', sharePct: 29, color: '#06B6D4' },
      { id: 'tablet', label: isTR ? 'Tablet' : 'Tablet', value: '4,111', sharePct: 9, color: '#F59E0B' },
    ],
  };
}
