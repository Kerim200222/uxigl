import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  SheetGL,
  type ColumnDef,
  type IGridThemeTokens,
} from 'sheetgl';
import {
  Database,
  RefreshCw,
  Sparkles,
  Layers,
  Terminal,
  Briefcase,
  Cpu,
  Users,
  Package,
} from 'lucide-react';
import { useTheme } from '../../../providers/ThemeProvider';
import { buildInheritedSheetGLTheme } from '../../../core/services/ThemeEngineService';

/**
 * ============================================================================
 * uxiGL COMPOSITE — SHEETGL MULTI-SCENARIO ENTERPRISE DATAGRID ADAPTER
 * ============================================================================
 * Supports 4 distinct SheetGL enterprise table scenarios:
 * 1. `finance-erp`      — Kurumsal Finans & Sipariş Defteri
 * 2. `cloud-telemetry`  — Bulut Kümesi & Mikroservis Telemetrisi (SRE/DevOps)
 * 3. `hr-payroll`       — İK Yetenek, Performans & Bordro Matrisi
 * 4. `inventory-supply` — Akıllı Stok, Lojistik & Tedarik Zinciri (SKU)
 */

export type SheetGLDatasetPreset =
  | 'finance-erp'
  | 'cloud-telemetry'
  | 'hr-payroll'
  | 'inventory-supply';

export const SHEETGL_PRESET_META: Record<
  SheetGLDatasetPreset,
  {
    id: SheetGLDatasetPreset;
    label: string;
    shortLabel: string;
    description: string;
  }
> = {
  'finance-erp': {
    id: 'finance-erp',
    label: 'Kurumsal Finans & Sipariş Defteri',
    shortLabel: 'Finans & ERP',
    description:
      'Cascading bölge-vergi hesaplama, Brüt/Net bakiye, SOC2/GDPR uyumluluk etiketleri ve 7G trend',
  },
  'cloud-telemetry': {
    id: 'cloud-telemetry',
    label: 'Bulut Kümesi & Mikroservis Telemetrisi',
    shortLabel: 'Bulut Telemetri',
    description:
      'Kubernetes node metrikleri, CPU/RAM kullanımı, P99 gecikme, saniyelik istek (RPS) ve SLA izleme',
  },
  'hr-payroll': {
    id: 'hr-payroll',
    label: 'İK Yetenek, Performans & Bordro Matrisi',
    shortLabel: 'İK & Bordro',
    description:
      'Departman bazlı maaş bordrosu, RSU hisse paketi, OKR hedef ilerlemesi ve çalışma modeli',
  },
  'inventory-supply': {
    id: 'inventory-supply',
    label: 'Akıllı Stok, Lojistik & Tedarik Zinciri',
    shortLabel: 'Stok & Lojistik',
    description:
      'Donanım SKU takibi, depo doluluk oranı, birim/toplam stok maliyeti ve 30G talep eğrisi',
  },
};

const CITY_OPTIONS = [
  { value: 'Istanbul', label: 'İstanbul (TR)' },
  { value: 'London', label: 'London (UK)' },
  { value: 'Zurich', label: 'Zürich (CH)' },
  { value: 'Berlin', label: 'Berlin (DE)' },
  { value: 'New York', label: 'New York (US)' },
  { value: 'Tokyo', label: 'Tokyo (JP)' },
  { value: 'Singapore', label: 'Singapore (SG)' },
];

const STATUS_OPTIONS = [
  {
    value: 'active',
    label: 'Aktif',
    bg: '#DCFCE7',
    fg: '#166534',
    darkBg: 'rgba(48, 209, 88, 0.16)',
    darkFg: '#30D158',
  },
  {
    value: 'pending',
    label: 'Beklemede',
    bg: '#FEF3C7',
    fg: '#92400E',
    darkBg: 'rgba(255, 159, 10, 0.16)',
    darkFg: '#FF9F0A',
  },
  {
    value: 'review',
    label: 'İncelemede',
    bg: '#E0F2FE',
    fg: '#075985',
    darkBg: 'rgba(10, 132, 255, 0.16)',
    darkFg: '#64D2FF',
  },
  {
    value: 'rejected',
    label: 'İptal',
    bg: '#FEE2E2',
    fg: '#991B1B',
    darkBg: 'rgba(255, 69, 58, 0.16)',
    darkFg: '#FF453A',
  },
];

const COMPLIANCE_TAGS = [
  {
    value: 'SOC2',
    label: 'SOC2 Type II',
    bg: '#E0E7FF',
    fg: '#3730A3',
    darkBg: 'rgba(99, 102, 241, 0.18)',
    darkFg: '#A5B4FC',
  },
  {
    value: 'GDPR',
    label: 'GDPR',
    bg: '#DBEAFE',
    fg: '#1E40AF',
    darkBg: 'rgba(59, 130, 246, 0.18)',
    darkFg: '#93C5FD',
  },
  {
    value: 'ISO27001',
    label: 'ISO-27001',
    bg: '#DCFCE7',
    fg: '#166534',
    darkBg: 'rgba(34, 197, 94, 0.18)',
    darkFg: '#86EFAC',
  },
  {
    value: 'HIPAA',
    label: 'HIPAA',
    bg: '#FCE7F3',
    fg: '#9D174D',
    darkBg: 'rgba(236, 72, 153, 0.18)',
    darkFg: '#F472B6',
  },
];

const COMPANIES = [
  'Nexus Cloud Systems',
  'Quantum Neural Labs',
  'Truncgil Teknoloji A.Ş.',
  'Global FinTech Treasury',
  'Orion Workspace Inc.',
  'HyperEdge Network',
  'Prism Design Systems',
  'Aegis Safety Corp',
  'Helios Lakehouse',
  'Vanguard ZeroTrust',
];

const TAX_RATE_BY_CITY: Record<string, number> = {
  Istanbul: 20,
  London: 19,
  Zurich: 15,
  Berlin: 25,
  'New York': 21,
  Tokyo: 23,
  Singapore: 17,
};

// --- Scenario 2: Cloud Telemetry Options ---
const CLOUD_REGIONS = [
  { value: 'eu-central-1', label: 'eu-central-1 (Frankfurt)' },
  { value: 'eu-west-1', label: 'eu-west-1 (Dublin)' },
  { value: 'us-east-1', label: 'us-east-1 (N. Virginia)' },
  { value: 'ap-northeast-1', label: 'ap-northeast-1 (Tokyo)' },
  { value: 'tr-istanbul-1', label: 'tr-istanbul-1 (İstanbul)' },
];

const NODE_HEALTH_OPTIONS = [
  {
    value: 'healthy',
    label: 'Healthy',
    bg: '#DCFCE7',
    fg: '#166534',
    darkBg: 'rgba(48, 209, 88, 0.16)',
    darkFg: '#30D158',
  },
  {
    value: 'scaling',
    label: 'Auto-Scaling',
    bg: '#E0F2FE',
    fg: '#075985',
    darkBg: 'rgba(10, 132, 255, 0.16)',
    darkFg: '#64D2FF',
  },
  {
    value: 'degraded',
    label: 'Degraded',
    bg: '#FEF3C7',
    fg: '#92400E',
    darkBg: 'rgba(255, 159, 10, 0.16)',
    darkFg: '#FF9F0A',
  },
  {
    value: 'critical',
    label: 'Critical Alert',
    bg: '#FEE2E2',
    fg: '#991B1B',
    darkBg: 'rgba(255, 69, 58, 0.16)',
    darkFg: '#FF453A',
  },
];

const MICROSERVICES = [
  'auth-zero-trust-gw',
  'webgl-shader-compiler',
  'sheetgl-virtual-engine',
  'filemangl-vfs-daemon',
  'payment-ledger-core',
  'realtime-telemetry-bus',
  'neural-search-indexer',
  'edge-cdn-invalidator',
];

// --- Scenario 3: HR & Payroll Options ---
const DEPARTMENTS = [
  { value: 'Engineering', label: 'Platform Mühendisliği' },
  { value: 'Design', label: 'Tasarım Sistemleri (UX/UI)' },
  { value: 'AI_Research', label: 'Yapay Zeka & GPU' },
  { value: 'Security', label: 'Siber Güvenlik (SecOps)' },
  { value: 'Product', label: 'Ürün Yönetimi' },
];

const SENIORITY_LEVELS = [
  {
    value: 'L4',
    label: 'L4 • Mid-Level',
    bg: '#E0F2FE',
    fg: '#075985',
    darkBg: 'rgba(10, 132, 255, 0.16)',
    darkFg: '#64D2FF',
  },
  {
    value: 'L5',
    label: 'L5 • Senior',
    bg: '#DCFCE7',
    fg: '#166534',
    darkBg: 'rgba(48, 209, 88, 0.16)',
    darkFg: '#30D158',
  },
  {
    value: 'L6',
    label: 'L6 • Staff',
    bg: '#E0E7FF',
    fg: '#3730A3',
    darkBg: 'rgba(99, 102, 241, 0.18)',
    darkFg: '#A5B4FC',
  },
  {
    value: 'L7',
    label: 'L7 • Principal',
    bg: '#FCE7F3',
    fg: '#9D174D',
    darkBg: 'rgba(236, 72, 153, 0.18)',
    darkFg: '#F472B6',
  },
];

const WORK_MODES = [
  {
    value: 'Hybrid',
    label: 'Hibrit (3+2)',
    bg: '#DBEAFE',
    fg: '#1E40AF',
    darkBg: 'rgba(59, 130, 246, 0.18)',
    darkFg: '#93C5FD',
  },
  {
    value: 'Remote',
    label: 'Global Remote',
    bg: '#DCFCE7',
    fg: '#166534',
    darkBg: 'rgba(34, 197, 94, 0.18)',
    darkFg: '#86EFAC',
  },
  {
    value: 'OnSite',
    label: 'Kampüs (Ar-Ge)',
    bg: '#FEF3C7',
    fg: '#92400E',
    darkBg: 'rgba(255, 159, 10, 0.16)',
    darkFg: '#FF9F0A',
  },
];

const EMPLOYEE_NAMES = [
  'Deniz Kaya',
  'Selin Yılmaz',
  'Mert Can',
  'Zeynep Ak',
  'Barış Özdemir',
  'Elif Demirci',
  'Kaan Arslan',
  'Ayşe Çelik',
  'Emre Koç',
  'Defne Şahin',
];

// --- Scenario 4: Inventory & Supply Chain Options ---
const HARDWARE_CATEGORIES = [
  { value: 'GPU_Node', label: 'Yüksek Yoğunluklu GPU Kümesi' },
  { value: 'Apple_Silicon', label: 'ARM64 Ultra İş İstasyonu' },
  { value: 'NVMe_Array', label: 'Kurumsal Gen5 NVMe Depolama' },
  { value: 'Optical_Switch', label: '800G Optik Ağ Anahtarı' },
];

const STOCK_STATUS_OPTIONS = [
  {
    value: 'in_stock',
    label: 'Stokta Hazır',
    bg: '#DCFCE7',
    fg: '#166534',
    darkBg: 'rgba(48, 209, 88, 0.16)',
    darkFg: '#30D158',
  },
  {
    value: 'low_stock',
    label: 'Kritik Stok',
    bg: '#FEF3C7',
    fg: '#92400E',
    darkBg: 'rgba(255, 159, 10, 0.16)',
    darkFg: '#FF9F0A',
  },
  {
    value: 'in_transit',
    label: 'Sevkiyatta',
    bg: '#E0F2FE',
    fg: '#075985',
    darkBg: 'rgba(10, 132, 255, 0.16)',
    darkFg: '#64D2FF',
  },
  {
    value: 'out_of_stock',
    label: 'Tükendi',
    bg: '#FEE2E2',
    fg: '#991B1B',
    darkBg: 'rgba(255, 69, 58, 0.16)',
    darkFg: '#FF453A',
  },
];

const HARDWARE_ITEMS = [
  'NVIDIA DGX B200 Pod Blade',
  'Mac Studio M4 Ultra 192GB',
  'Samsung PM1743 15.36TB NVMe',
  'Mellanox Quantum-2 QM9700',
  'Pro Display XDR Nano',
  'Cisco Nexus 9364D-GX2A',
  'Micron 9400 Pro 30.72TB U.3',
  'APC Symmetra PX 100kW UPS',
];

export function generateSheetGLDataset(
  count: number,
  preset: SheetGLDatasetPreset = 'finance-erp'
) {
  const result = new Array(count);
  const now = new Date();

  for (let idx = 0; idx < count; idx++) {
    const i = idx + 1;
    const auditDate = new Date(now.getTime() - (i % 28) * 86400000);
    const dateStr = auditDate.toISOString().slice(0, 10);
    const timeStr = `${String(9 + (i % 9)).padStart(2, '0')}:${String(
      (i * 7) % 60
    ).padStart(2, '0')}`;
    const spark = [
      20 + ((i * 5) % 30),
      35 + ((i * 7) % 40),
      25 + ((i * 11) % 45),
      60 + ((i * 3) % 30),
      50 + ((i * 8) % 40),
      75 + ((i * 4) % 25),
      90 + ((i * 2) % 10),
    ];

    if (preset === 'cloud-telemetry') {
      const cpu = 18 + ((i * 13) % 78);
      const rps = 1200 + ((i * 430) % 24000);
      result[idx] = {
        id: i,
        nodeId: `k8s-node-${String(100 + i).padStart(4, '0')}`,
        service: MICROSERVICES[i % MICROSERVICES.length],
        region: CLOUD_REGIONS[i % CLOUD_REGIONS.length].value,
        healthStatus: NODE_HEALTH_OPTIONS[i % NODE_HEALTH_OPTIONS.length].value,
        cpuUsage: cpu,
        ramGb: 32 * (((i % 4) + 1) * 2),
        latencyMs: Math.round((4.2 + ((i * 3.7) % 48)) * 10) / 10,
        requestsPerSec: rps,
        monthlyCost: Math.round((420 + rps * 0.085) * 100) / 100,
        autoScale: i % 3 !== 0,
        slaScore: ((i * 3) % 5) + 1,
        lastDeployDate: dateStr,
        sparkline: spark,
      };
    } else if (preset === 'hr-payroll') {
      const baseSalary = 4800 + ((i * 650) % 9500);
      const bonusPct = 65 + ((i * 7) % 35);
      result[idx] = {
        id: i,
        empCode: `EMP-${String(2000 + i).padStart(4, '0')}`,
        fullName: EMPLOYEE_NAMES[i % EMPLOYEE_NAMES.length],
        department: DEPARTMENTS[i % DEPARTMENTS.length].value,
        level: SENIORITY_LEVELS[i % SENIORITY_LEVELS.length].value,
        workMode:
          i % 2 === 0 ? ['Hybrid', 'Remote'] : [WORK_MODES[i % 3].value],
        monthlySalary: baseSalary,
        okrProgress: bonusPct,
        annualRsu: Math.round(baseSalary * 3.2),
        isActiveStaff: i % 7 !== 0,
        perfRating: ((i * 2) % 5) + 1,
        hireDate: dateStr,
        sparkline: spark,
      };
    } else if (preset === 'inventory-supply') {
      const qty = (i * 17) % 240;
      const unitPrice = Math.round((450 + ((i * 320) % 6800)) * 100) / 100;
      result[idx] = {
        id: i,
        sku: `SKU-${String(50000 + i).padStart(5, '0')}`,
        itemName: HARDWARE_ITEMS[i % HARDWARE_ITEMS.length],
        category: HARDWARE_CATEGORIES[i % HARDWARE_CATEGORIES.length].value,
        warehouse: CITY_OPTIONS[i % CITY_OPTIONS.length].value,
        stockStatus:
          qty === 0
            ? 'out_of_stock'
            : qty < 30
            ? 'low_stock'
            : STOCK_STATUS_OPTIONS[i % 3].value,
        quantity: qty,
        capacityPct: Math.min(100, Math.round((qty / 240) * 100)),
        unitPrice,
        totalValue: Math.round(qty * unitPrice * 100) / 100,
        insured: i % 2 === 0,
        vendorRating: ((i * 4) % 5) + 1,
        lastCountDate: dateStr,
        sparkline: spark,
      };
    } else {
      const city = CITY_OPTIONS[i % CITY_OPTIONS.length].value;
      const taxRate = TAX_RATE_BY_CITY[city] ?? 20;
      const gross = Math.round((18000 + ((i * 173.65) % 165000)) * 100) / 100;
      const net = Math.round(gross * (1 - taxRate / 100) * 100) / 100;

      result[idx] = {
        id: i,
        code: `UXIGL-${String(10000 + i).padStart(6, '0')}`,
        company: COMPANIES[i % COMPANIES.length],
        city,
        status: STATUS_OPTIONS[i % STATUS_OPTIONS.length].value,
        compliance:
          i % 3 === 0
            ? ['SOC2', 'GDPR', 'ISO27001']
            : i % 2 === 0
            ? ['SOC2', 'GDPR']
            : ['ISO27001'],
        balance: gross,
        taxRate,
        netBalance: net,
        isApproved: i % 2 === 0,
        rating: ((i * 3) % 5) + 1,
        date: dateStr,
        lastAuditAt: `${dateStr} ${timeStr}`,
        cutoffTime: '17:30',
        sparkline: spark,
      };
    }
  }

  return result;
}

export interface SheetGLGridAdapterProps {
  datasetPreset?: SheetGLDatasetPreset;
  showPresetSwitcher?: boolean;
  initialRowCount?: number;
  height?: number | string;
  showControlBar?: boolean;
  showFormulaBar?: boolean;
  batchEditMode?: boolean;
  presetStyle?: 'apple' | 'google';
  locale?: 'tr' | 'en';
}

export const SheetGLGridAdapter: React.FC<SheetGLGridAdapterProps> = ({
  datasetPreset: initialDatasetPreset = 'finance-erp',
  showPresetSwitcher = true,
  initialRowCount = 150,
  height = 520,
  showControlBar = false,
  showFormulaBar: initialFormulaBar = true,
  batchEditMode: initialBatchEdit = true,
  presetStyle: initialPresetStyle = 'apple',
  locale = 'tr',
}) => {
  const { resolvedMode, activePalette, preferences } = useTheme();

  const [activePreset, setActivePreset] =
    useState<SheetGLDatasetPreset>(initialDatasetPreset);
  const [rowCount, setRowCount] = useState<number>(initialRowCount);
  const [data, setData] = useState(() =>
    generateSheetGLDataset(initialRowCount, initialDatasetPreset)
  );
  const [presetStyle, setPresetStyle] = useState<'apple' | 'google'>(
    initialPresetStyle
  );
  const [batchEdit, setBatchEdit] = useState<boolean>(initialBatchEdit);
  const [formulaBar, setFormulaBar] = useState<boolean>(initialFormulaBar);
  const [lastEventText, setLastEventText] = useState<string>(
    `${SHEETGL_PRESET_META[initialDatasetPreset].label} (${initialRowCount.toLocaleString('tr-TR')} satır) hazır`
  );

  useEffect(() => {
    setFormulaBar(initialFormulaBar);
  }, [initialFormulaBar]);

  useEffect(() => {
    setBatchEdit(initialBatchEdit);
  }, [initialBatchEdit]);

  useEffect(() => {
    setPresetStyle(initialPresetStyle);
  }, [initialPresetStyle]);

  useEffect(() => {
    setActivePreset(initialDatasetPreset);
    setData(generateSheetGLDataset(rowCount, initialDatasetPreset));
    setLastEventText(
      `Tablo değiştirildi: ${SHEETGL_PRESET_META[initialDatasetPreset].label}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDatasetPreset]);

  useEffect(() => {
    if (initialRowCount !== rowCount) {
      setRowCount(initialRowCount);
      setData(generateSheetGLDataset(initialRowCount, activePreset));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRowCount]);

  const handlePresetSwitch = useCallback(
    (nextPreset: SheetGLDatasetPreset) => {
      setActivePreset(nextPreset);
      setData(generateSheetGLDataset(rowCount, nextPreset));
      setLastEventText(
        `Tablo şeması yüklendi: ${SHEETGL_PRESET_META[nextPreset].label}`
      );
    },
    [rowCount]
  );

  const handleRowCountSwitch = useCallback(
    (count: number) => {
      const t0 = performance.now();
      setRowCount(count);
      setData(generateSheetGLDataset(count, activePreset));
      const dt = Math.max(1, Math.round(performance.now() - t0));
      setLastEventText(
        `${count.toLocaleString('tr-TR')} satır (${
          SHEETGL_PRESET_META[activePreset].shortLabel
        }) ${dt}ms içinde oluşturuldu`
      );
    },
    [activePreset]
  );

  const sheetTheme = useMemo<IGridThemeTokens>(() => {
    return buildInheritedSheetGLTheme(preferences, resolvedMode, presetStyle);
  }, [preferences, resolvedMode, presetStyle]);

  const sparkColor =
    resolvedMode === 'dark'
      ? activePalette.dark.primary
      : activePalette.light.primary;

  const columns = useMemo<ColumnDef[]>(() => {
    if (activePreset === 'cloud-telemetry') {
      return [
        {
          id: 'id',
          title: '#',
          type: 'number',
          decimalDigits: 0,
          width: 64,
          pinned: 'left',
          readonly: true,
          summaryType: 'count',
        },
        {
          id: 'nodeId',
          title: 'Node ID ⚡',
          type: 'text',
          width: 145,
          pinned: 'left',
          sortable: true,
          filterable: true,
        },
        {
          id: 'service',
          title: 'Mikroservis',
          type: 'text',
          width: 195,
          pinned: 'left',
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'region',
          title: 'Bölge (Region)',
          type: 'dropdown',
          width: 185,
          options: CLOUD_REGIONS,
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'healthStatus',
          title: 'Küme Durumu',
          type: 'select',
          width: 145,
          options: NODE_HEALTH_OPTIONS,
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'cpuUsage',
          title: 'CPU Yükü (%)',
          type: 'progress',
          width: 130,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'ramGb',
          title: 'RAM (GB)',
          type: 'number',
          decimalDigits: 0,
          width: 110,
          sortable: true,
          summaryType: 'sum',
        },
        {
          id: 'latencyMs',
          title: 'P99 Gecikme (ms)',
          type: 'number',
          decimalDigits: 1,
          width: 140,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'requestsPerSec',
          title: 'İstek / sn (RPS)',
          type: 'number',
          decimalDigits: 0,
          width: 140,
          sortable: true,
          summaryType: 'sum',
        },
        {
          id: 'monthlyCost',
          title: 'Aylık Maliyet ($)',
          type: 'currency',
          currencySymbol: '$',
          width: 145,
          sortable: true,
          summaryType: 'sum',
        },
        {
          id: 'autoScale',
          title: 'HPA Aktif',
          type: 'boolean',
          width: 100,
          sortable: true,
        },
        {
          id: 'slaScore',
          title: 'SLA Puanı',
          type: 'rating',
          width: 120,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'lastDeployDate',
          title: 'Son Dağıtım',
          type: 'date',
          width: 125,
          sortable: true,
        },
        {
          id: 'sparkline',
          title: 'Canlı Trafik',
          type: 'sparkline',
          width: 135,
          sparklineColor: sparkColor,
        },
      ];
    }

    if (activePreset === 'hr-payroll') {
      return [
        {
          id: 'id',
          title: '#',
          type: 'number',
          decimalDigits: 0,
          width: 64,
          pinned: 'left',
          readonly: true,
          summaryType: 'count',
        },
        {
          id: 'empCode',
          title: 'Sicil No',
          type: 'text',
          width: 120,
          pinned: 'left',
          sortable: true,
          filterable: true,
        },
        {
          id: 'fullName',
          title: 'Çalışan Adı Soyadı',
          type: 'text',
          width: 185,
          pinned: 'left',
          sortable: true,
          filterable: true,
        },
        {
          id: 'department',
          title: 'Departman',
          type: 'dropdown',
          width: 185,
          options: DEPARTMENTS,
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'level',
          title: 'Kıdem Seviyesi',
          type: 'select',
          width: 150,
          options: SENIORITY_LEVELS,
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'workMode',
          title: 'Çalışma Modeli',
          type: 'multiselect',
          width: 185,
          options: WORK_MODES,
          sortable: true,
        },
        {
          id: 'monthlySalary',
          title: 'Aylık Maaş ($)',
          type: 'currency',
          currencySymbol: '$',
          width: 145,
          sortable: true,
          summaryType: 'sum',
        },
        {
          id: 'okrProgress',
          title: 'OKR Hedefi (%)',
          type: 'progress',
          width: 135,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'annualRsu',
          title: 'Yıllık RSU Paketi ($)',
          type: 'currency',
          currencySymbol: '$',
          width: 160,
          sortable: true,
          summaryType: 'sum',
        },
        {
          id: 'isActiveStaff',
          title: 'Aktif Kadro',
          type: 'boolean',
          width: 105,
          sortable: true,
        },
        {
          id: 'perfRating',
          title: 'Performans',
          type: 'rating',
          width: 125,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'hireDate',
          title: 'Başlangıç Tarihi',
          type: 'date',
          width: 135,
          sortable: true,
        },
        {
          id: 'sparkline',
          title: 'Verimlilik İzi',
          type: 'sparkline',
          width: 135,
          sparklineColor: sparkColor,
        },
      ];
    }

    if (activePreset === 'inventory-supply') {
      return [
        {
          id: 'id',
          title: '#',
          type: 'number',
          decimalDigits: 0,
          width: 64,
          pinned: 'left',
          readonly: true,
          summaryType: 'count',
        },
        {
          id: 'sku',
          title: 'SKU Kodu',
          type: 'text',
          width: 130,
          pinned: 'left',
          sortable: true,
          filterable: true,
        },
        {
          id: 'itemName',
          title: 'Donanım / Ürün Adı',
          type: 'text',
          width: 220,
          pinned: 'left',
          sortable: true,
          filterable: true,
        },
        {
          id: 'category',
          title: 'Donanım Kategorisi',
          type: 'dropdown',
          width: 200,
          options: HARDWARE_CATEGORIES,
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'warehouse',
          title: 'Lojistik Merkezi',
          type: 'dropdown',
          width: 155,
          options: CITY_OPTIONS,
          sortable: true,
          groupable: true,
        },
        {
          id: 'stockStatus',
          title: 'Stok Durumu',
          type: 'select',
          width: 140,
          options: STOCK_STATUS_OPTIONS,
          sortable: true,
          filterable: true,
          groupable: true,
        },
        {
          id: 'quantity',
          title: 'Mevcut Adet',
          type: 'number',
          decimalDigits: 0,
          width: 120,
          sortable: true,
          summaryType: 'sum',
          setCellValue: async (newData, newQty, currentRow) => {
            const q = Math.max(0, Number(newQty) || 0);
            const price = Number(currentRow.unitPrice) || 0;
            newData.totalValue = Math.round(q * price * 100) / 100;
            newData.capacityPct = Math.min(100, Math.round((q / 240) * 100));
          },
        },
        {
          id: 'capacityPct',
          title: 'Depo Doluluk (%)',
          type: 'progress',
          width: 135,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'unitPrice',
          title: 'Birim Fiyat ($)',
          type: 'currency',
          currencySymbol: '$',
          width: 140,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'totalValue',
          title: 'Toplam Değer ($)',
          type: 'currency',
          currencySymbol: '$',
          width: 155,
          readonly: true,
          sortable: true,
          summaryType: 'sum',
        },
        {
          id: 'insured',
          title: 'Sigortalı',
          type: 'boolean',
          width: 95,
          sortable: true,
        },
        {
          id: 'vendorRating',
          title: 'Tedarikçi Puanı',
          type: 'rating',
          width: 130,
          sortable: true,
          summaryType: 'avg',
        },
        {
          id: 'lastCountDate',
          title: 'Son Sayım',
          type: 'date',
          width: 125,
          sortable: true,
        },
        {
          id: 'sparkline',
          title: '30G Talep',
          type: 'sparkline',
          width: 135,
          sparklineColor: sparkColor,
        },
      ];
    }

    // Default: 'finance-erp'
    return [
      {
        id: 'id',
        title: 'ID',
        type: 'number',
        decimalDigits: 0,
        width: 72,
        pinned: 'left',
        readonly: true,
        summaryType: 'count',
      },
      {
        id: 'code',
        title: 'Hesap Kodu ⚡',
        type: 'text',
        width: 135,
        pinned: 'left',
        sortable: true,
        filterable: true,
      },
      {
        id: 'company',
        title: 'Kurumsal Müşteri',
        type: 'text',
        width: 210,
        pinned: 'left',
        sortable: true,
        filterable: true,
        groupable: true,
      },
      {
        id: 'city',
        title: 'Bölge (Cascading) 🔄',
        type: 'dropdown',
        width: 165,
        options: CITY_OPTIONS,
        sortable: true,
        filterable: true,
        groupable: true,
        setCellValue: async (newData, newCity, currentRow) => {
          const tax = TAX_RATE_BY_CITY[newCity] ?? 20;
          newData.taxRate = tax;
          const gross = Number(currentRow.balance) || 0;
          const net = Math.round(gross * (1 - tax / 100) * 100) / 100;
          newData.netBalance = net;
          setLastEventText(
            `Cascading: "${newCity}" → Vergi %${tax}, Net $${net.toLocaleString()}`
          );
        },
      },
      {
        id: 'status',
        title: 'Durum',
        type: 'select',
        width: 135,
        options: STATUS_OPTIONS,
        sortable: true,
        filterable: true,
        groupable: true,
      },
      {
        id: 'compliance',
        title: 'Uyumluluk Sertifikası',
        type: 'multiselect',
        width: 210,
        options: COMPLIANCE_TAGS,
        sortable: true,
        filterable: true,
      },
      {
        id: 'balance',
        title: 'Brüt Tutar ($)',
        type: 'currency',
        currencySymbol: '$',
        width: 150,
        sortable: true,
        filterable: true,
        summaryType: 'sum',
      },
      {
        id: 'taxRate',
        title: 'Vergi (%)',
        type: 'progress',
        width: 115,
        sortable: true,
        summaryType: 'avg',
      },
      {
        id: 'netBalance',
        title: 'Net Tutar ($)',
        type: 'currency',
        currencySymbol: '$',
        width: 150,
        readonly: true,
        sortable: true,
        filterable: true,
        summaryType: 'sum',
      },
      {
        id: 'isApproved',
        title: 'Onaylı',
        type: 'boolean',
        width: 95,
        sortable: true,
        filterable: true,
      },
      {
        id: 'rating',
        title: 'Skor',
        type: 'rating',
        width: 125,
        sortable: true,
        summaryType: 'avg',
      },
      {
        id: 'date',
        title: 'Kayıt Tarihi',
        type: 'date',
        width: 130,
        sortable: true,
        filterable: true,
      },
      {
        id: 'lastAuditAt',
        title: 'Son Denetim',
        type: 'datetime',
        width: 170,
        sortable: true,
      },
      {
        id: 'cutoffTime',
        title: 'Kesim Saati',
        type: 'time',
        width: 115,
      },
      {
        id: 'sparkline',
        title: '7G Trend',
        type: 'sparkline',
        width: 135,
        sparklineColor: sparkColor,
      },
    ];
  }, [activePreset, sparkColor]);

  const scaleRatio = (preferences.fontScale || 100) / 100;

  return (
    <div className="uxu-sheetgl-wrapper">
      {showControlBar && (
        <div className="uxu-sheetgl-toolbar">
          <div className="uxu-sheetgl-toolbar__left">
            {showPresetSwitcher && (
              <div className="uxu-sheetgl-pill-group">
                <button
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    activePreset === 'finance-erp'
                      ? 'uxu-sheetgl-pill--active'
                      : ''
                  }`}
                  onClick={() => handlePresetSwitch('finance-erp')}
                >
                  <Briefcase size={11} /> Finans & ERP
                </button>
                <button
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    activePreset === 'cloud-telemetry'
                      ? 'uxu-sheetgl-pill--active'
                      : ''
                  }`}
                  onClick={() => handlePresetSwitch('cloud-telemetry')}
                >
                  <Cpu size={11} /> Bulut Telemetri
                </button>
                <button
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    activePreset === 'hr-payroll'
                      ? 'uxu-sheetgl-pill--active'
                      : ''
                  }`}
                  onClick={() => handlePresetSwitch('hr-payroll')}
                >
                  <Users size={11} /> İK & Bordro
                </button>
                <button
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    activePreset === 'inventory-supply'
                      ? 'uxu-sheetgl-pill--active'
                      : ''
                  }`}
                  onClick={() => handlePresetSwitch('inventory-supply')}
                >
                  <Package size={11} /> Stok & Lojistik
                </button>
              </div>
            )}

            <div className="uxu-sheetgl-pill-group">
              {[150, 1000, 10000].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  className={`uxu-sheetgl-pill ${
                    rowCount === cnt ? 'uxu-sheetgl-pill--active' : ''
                  }`}
                  onClick={() => handleRowCountSwitch(cnt)}
                >
                  <Database size={11} />
                  {cnt >= 1000 ? `${cnt / 1000}B` : cnt} Satır
                </button>
              ))}
            </div>
          </div>

          <div className="uxu-sheetgl-toolbar__right">
            <div className="uxu-sheetgl-pill-group">
              <button
                type="button"
                className={`uxu-sheetgl-pill ${
                  presetStyle === 'apple' ? 'uxu-sheetgl-pill--active' : ''
                }`}
                onClick={() => setPresetStyle('apple')}
              >
                <Sparkles size={11} /> Liquid Glass
              </button>
              <button
                type="button"
                className={`uxu-sheetgl-pill ${
                  presetStyle === 'google' ? 'uxu-sheetgl-pill--active' : ''
                }`}
                onClick={() => setPresetStyle('google')}
              >
                <Layers size={11} /> Dinamik Ton
              </button>
            </div>

            <button
              type="button"
              className={`uxu-sheetgl-pill ${
                formulaBar ? 'uxu-sheetgl-pill--active' : ''
              }`}
              onClick={() => setFormulaBar((p) => !p)}
              title="Excel Formül Çubuğu (fx)"
            >
              fx Formül
            </button>

            <button
              type="button"
              className={`uxu-sheetgl-pill ${
                batchEdit ? 'uxu-sheetgl-pill--active' : ''
              }`}
              onClick={() => setBatchEdit((p) => !p)}
              title="Toplu Düzenleme (Batch CRUD)"
            >
              Batch CRUD
            </button>

            <button
              type="button"
              className="uxu-sheetgl-pill"
              onClick={() => handleRowCountSwitch(rowCount)}
              title="Veri Setini Yenile"
            >
              <RefreshCw size={11} />
            </button>
          </div>
        </div>
      )}

      <div
        className="uxu-sheetgl-canvas-host"
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
        }}
      >
        <SheetGL
          key={activePreset}
          dataSource={data}
          columns={columns}
          theme={sheetTheme}
          locale={locale}
          rowHeight={Math.round(36 * scaleRatio)}
          headerHeight={Math.round(40 * scaleRatio)}
          batchEditMode={batchEdit}
          showFormulaBar={formulaBar}
          toolbar={{
            visible: true,
            buttonDisplayMode: 'icon-text',
            showSearch: true,
            showGroupBy: true,
            showAddRow: true,
            showBatchActions: true,
            showExportCsv: true,
            showColumnSettings: true,
          }}
          summaryRow={{
            visible: true,
            showTotalCount: true,
            showSelectionStats: true,
            showColumnSummaries: true,
          }}
          onCellValueChanged={(e) => {
            setLastEventText(
              `Hücre güncellendi: [${e.column.id}] ${String(
                e.oldValue
              )} → ${String(e.newValue)}`
            );
          }}
          onSaved={(e) => {
            const totalOps =
              (e.changes.inserted?.length ?? 0) +
              (e.changes.updated?.length ?? 0) +
              (e.changes.deleted?.length ?? 0);
            setLastEventText(
              `Batch kayıt tamamlandı (${totalOps} değişiklik işlendi)`
            );
          }}
        />
      </div>

      {showControlBar && (
        <div className="uxu-sheetgl-statusbar">
          <span className="uxu-sheetgl-statusbar__log">
            <Terminal size={12} /> {lastEventText}
          </span>
          <span className="uxu-sheetgl-statusbar__meta">
            Şema: {SHEETGL_PRESET_META[activePreset].shortLabel} ·{' '}
            {columns.length} Sütun · Tema: {resolvedMode.toUpperCase()} (
            {activePalette.name})
          </span>
        </div>
      )}
    </div>
  );
};
