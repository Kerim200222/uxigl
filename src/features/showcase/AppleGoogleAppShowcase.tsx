import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Headphones,
  Thermometer,
  Sun,
  Shield,
  Wifi,
  Cpu,
  Activity,
  Sparkles,
  CheckCircle2,
  Sliders,
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  Clock,
  Download,
  HardDrive,
} from 'lucide-react';
import {
  Button,
  Input,
  Switch,
  Slider,
  Badge,
  Chip,
  Avatar,
  AvatarGroup,
  Progress,
  Checkbox,
  Tooltip,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  Tabs,
  StatCard,
  DataTable,
  SheetGLGridAdapter,
  SHEETGL_PRESET_META,
  FileManGLExplorerAdapter,
  type NativeTableVariant,
  type NativeTableSize,
  type SheetGLDatasetPreset,
} from '../../components/composites';
import type {
  FormControlContract,
  TonalProps,
} from '../../core/contracts/ComponentContracts';
import { useToast } from '../../providers/ToastProvider';
import {
  AnalyticsChartsSuite,
  type AnalyticsPeriod,
} from './AnalyticsChartsSuite';
import {
  AdminSubViews,
  type ExtendedAdminViewId,
} from './AdminSubViews';
import { SidebarShowcaseView } from './SidebarShowcaseView';
import type { SidebarVariant } from '../../core/contracts/NavigationContract';

export type DashboardSubView =
  | 'overview'
  | 'analytics'
  | 'users'
  | 'products'
  | 'crm-orders'
  | 'forms'
  | 'sidebars'
  | 'sidebar-stacked'
  | 'sidebar-standard'
  | 'sidebar-mini'
  | 'sidebar-dual'
  | 'sidebar-drawer'
  | 'elements-overview'
  | 'sidebar-showcase'
  | 'reports'
  | 'messages'
  | 'calendar'
  | 'file-manager'
  | 'smart-cluster'
  | 'settings'
  | 'security';

interface DeploymentRow extends Record<string, unknown> {
  id: string;
  service: string;
  owner: string;
  environment: string;
  health: number;
  status: 'Healthy' | 'Canary' | 'Deploying';
}

const INITIAL_DEPLOYMENTS: DeploymentRow[] = [
  {
    id: 'dep-1',
    service: 'uxigl-glass-compositor',
    owner: 'Deniz Kaya',
    environment: 'visionOS Spatial Edge',
    health: 99,
    status: 'Healthy',
  },
  {
    id: 'dep-2',
    service: 'material-tonal-engine',
    owner: 'Selin Yılmaz',
    environment: 'Android 15 Dynamic Cloud',
    health: 94,
    status: 'Canary',
  },
  {
    id: 'dep-3',
    service: 'solid-di-orchestrator',
    owner: 'Mert Can',
    environment: 'Global Edge Mesh',
    health: 78,
    status: 'Deploying',
  },
  {
    id: 'dep-4',
    service: 'spotlight-neural-index',
    owner: 'Zeynep Ak',
    environment: 'macOS Sequoia Core',
    health: 100,
    status: 'Healthy',
  },
  {
    id: 'dep-5',
    service: 'sheetgl-canvas-worker',
    owner: 'Barış Özdemir',
    environment: 'WebGL2 Offscreen Thread',
    health: 97,
    status: 'Healthy',
  },
];

interface ApiKeyRow extends Record<string, unknown> {
  id: string;
  keyName: string;
  prefix: string;
  scope: string;
  lastUsed: string;
  rateLimit: string;
  status: 'Active' | 'Rotating' | 'Revoked';
}

const INITIAL_API_KEYS: ApiKeyRow[] = [
  {
    id: 'key-1',
    keyName: 'Production Edge Gateway',
    prefix: 'uxigl_live_98f2...a41c',
    scope: 'read:all, write:ledger',
    lastUsed: '2 dk önce • Frankfurt',
    rateLimit: '12,000 req/dk',
    status: 'Active',
  },
  {
    id: 'key-2',
    keyName: 'SheetGL Telemetry Sync',
    prefix: 'uxigl_live_34b1...e09d',
    scope: 'stream:metrics, read:nodes',
    lastUsed: '8 dk önce • İstanbul',
    rateLimit: '5,000 req/dk',
    status: 'Active',
  },
  {
    id: 'key-3',
    keyName: 'FileManGL Cloud VFS Connector',
    prefix: 'uxigl_rot_77c4...b12a',
    scope: 'vfs:mount, acl:admin',
    lastUsed: '41 dk önce • Londra',
    rateLimit: '2,500 req/dk',
    status: 'Rotating',
  },
  {
    id: 'key-4',
    keyName: 'Legacy Analytics Sandbox',
    prefix: 'uxigl_test_11a0...f88b',
    scope: 'read:reports',
    lastUsed: '14 gün önce • Zürih',
    rateLimit: '500 req/dk',
    status: 'Revoked',
  },
];

interface InvoiceSummaryRow extends Record<string, unknown> {
  id: string;
  invoiceNo: string;
  customer: string;
  plan: string;
  amount: string;
  billingDate: string;
  paymentState: 'Paid' | 'Pending' | 'Overdue';
}

const INITIAL_INVOICES: InvoiceSummaryRow[] = [
  {
    id: 'inv-1',
    invoiceNo: 'INV-2026-0841',
    customer: 'Cupertino Cloud Systems',
    plan: 'Enterprise Unlimited',
    amount: '$48,500.00',
    billingDate: '22 Eki 2026',
    paymentState: 'Paid',
  },
  {
    id: 'inv-2',
    invoiceNo: 'INV-2026-0842',
    customer: 'Google DeepMind Labs',
    plan: 'AI Cluster Pro',
    amount: '$64,200.00',
    billingDate: '21 Eki 2026',
    paymentState: 'Paid',
  },
  {
    id: 'inv-3',
    invoiceNo: 'INV-2026-0843',
    customer: 'Truncgil Teknoloji A.Ş.',
    plan: 'Design System Core',
    amount: '$19,800.00',
    billingDate: '19 Eki 2026',
    paymentState: 'Pending',
  },
  {
    id: 'inv-4',
    invoiceNo: 'INV-2026-0844',
    customer: 'Linear Workspace Inc.',
    plan: 'Team Scale',
    amount: '$8,450.00',
    billingDate: '12 Eki 2026',
    paymentState: 'Overdue',
  },
];

const CHART_SERIES_BY_PERIOD: Record<
  '24h' | '7d' | '30d' | '1y',
  { labels: string[]; primary: number[]; secondary: number[]; totalRevenue: string; growth: string }
> = {
  '24h': {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Şimdi'],
    primary: [42, 38, 65, 84, 79, 92, 98],
    secondary: [28, 24, 44, 58, 62, 70, 76],
    totalRevenue: '₺482.900',
    growth: '+14.8% son 24 saat',
  },
  '7d': {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    primary: [58, 64, 61, 78, 88, 82, 96],
    secondary: [40, 48, 45, 56, 68, 61, 74],
    totalRevenue: '₺3.420.000',
    growth: '+22.4% geçen haftaya göre',
  },
  '30d': {
    labels: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'],
    primary: [45, 52, 68, 74, 81, 89, 95],
    secondary: [32, 39, 51, 58, 64, 72, 80],
    totalRevenue: '₺14.850.000',
    growth: '+31.2% aylık büyüme',
  },
  '1y': {
    labels: ['Oca', 'Şub', 'Nis', 'Haz', 'Ağu', 'Eki', 'Ara'],
    primary: [30, 44, 56, 67, 78, 90, 99],
    secondary: [22, 31, 42, 50, 61, 74, 86],
    totalRevenue: '₺168.4M',
    growth: '+64.5% yıllık büyüme',
  },
};

export interface AppleGoogleAppShowcaseProps {
  activeSubView?: DashboardSubView;
  onSubViewChange?: (subView: DashboardSubView) => void;
  onSelectComponent?: (compId: string) => void;
  sidebarVariant?: SidebarVariant;
  onSidebarVariantChange?: (v: SidebarVariant) => void;
  sidebarAccent?: string;
  onSidebarAccentChange?: (color: string) => void;
  sidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
  onOpenDrawer?: () => void;
}

export const AppleGoogleAppShowcase: React.FC<AppleGoogleAppShowcaseProps> = ({
  activeSubView = 'overview',
  onSubViewChange,
  onSelectComponent,
  sidebarVariant,
  onSidebarVariantChange,
  sidebarAccent,
  onSidebarAccentChange,
  sidebarCollapsed,
  onToggleSidebarCollapse,
  onOpenDrawer,
}) => {
  const { notify } = useToast();

  // Chart period state
  const [chartPeriod, setChartPeriod] = useState<AnalyticsPeriod>('30d');

  // Spatial Audio / Media widget state (Apple HIG style)
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioMode, setAudioMode] = useState<'anc' | 'transparency' | 'spatial'>(
    'spatial'
  );
  const [volume, setVolume] = useState(76);
  const [spatialDepth, setSpatialDepth] = useState(88);
  const [clearGlassDimmed, setClearGlassDimmed] = useState(false);
  const [selectedPlatformGuide, setSelectedPlatformGuide] = useState<
    'ios' | 'macos' | 'tvos' | 'visionos' | 'watchos'
  >('ios');
  const [overviewEngineTab, setOverviewEngineTab] = useState<
    'sheetgl' | 'filemangl'
  >('sheetgl');
  const [activeSheetPreset, setActiveSheetPreset] =
    useState<SheetGLDatasetPreset>('finance-erp');

  // Simple Native HTML DataTable state
  const [nativeTableDataset, setNativeTableDataset] = useState<
    'deployments' | 'apikeys' | 'invoices'
  >('deployments');
  const [nativeTableVariant, setNativeTableVariant] =
    useState<NativeTableVariant>('default');
  const [nativeTableSize, setNativeTableSize] = useState<NativeTableSize>('md');
  const [nativeTableSelectable, setNativeTableSelectable] =
    useState<boolean>(true);

  // Smart Workspace & Climate Hub (Material You + HomeKit fusion)
  const [targetTemp, setTargetTemp] = useState(22.5);
  const [ambientLight, setAmbientLight] = useState(65);
  const [activeZoneTab, setActiveZoneTab] = useState('studio');

  // Liskov Substitution Principle (LSP) live demonstration state:
  const [useCheckboxInsteadOfSwitch, setUseCheckboxInsteadOfSwitch] =
    useState(false);
  const [settingsState, setSettingsState] = useState({
    adaptiveVibrancy: true,
    dynamicSeedSync: true,
    neuralPowerSaver: false,
    zeroTrustEncryption: true,
  });

  // Quick Task / Tag Filter state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([
    'Liquid Glass',
    'Material You',
    'Responsive',
  ]);

  // Polymorphic Boolean Control renderer proving Liskov Substitution Principle (LSP)
  const BooleanControlComponent: React.FC<
    FormControlContract<boolean> & TonalProps & { description?: React.ReactNode }
  > = useCheckboxInsteadOfSwitch ? Checkbox : Switch;

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const currentChart = CHART_SERIES_BY_PERIOD[chartPeriod];

  const isExtendedAdminView = (
    [
      'users',
      'products',
      'forms',
      'elements-overview',
      'reports',
      'messages',
      'calendar',
      'settings',
      'security',
    ] as DashboardSubView[]
  ).includes(activeSubView);

  return (
    <div className="uxu-showcase-dashboard">
      {/* Top Dashboard Sub-Navigation Bar & Action Strip */}
      <div className="uxu-dash-toolbar">
        <div className="uxu-dash-toolbar__left">
          <h1 className="uxu-dash-toolbar__title">
            {activeSubView === 'overview' && 'Dashboard — Genel Bakış'}
            {activeSubView === 'analytics' && 'Analytics Dashboard'}
            {activeSubView === 'users' && 'Users — Kullanıcı Yönetimi'}
            {activeSubView === 'products' && 'Products — Ürün Kataloğu & Stok'}
            {activeSubView === 'crm-orders' && 'Orders — SheetGL Sipariş & Finans'}
            {activeSubView === 'forms' && 'Forms — Kurumsal Form Stüdyosu'}
            {activeSubView === 'elements-overview' && 'Elements — UI Bileşenleri Özeti'}
            {(activeSubView === 'sidebar-showcase' ||
              activeSubView === 'sidebars' ||
              activeSubView?.startsWith('sidebar-')) &&
              'Sidebars — 5 Çeşit Sistem Menüsü (Canlı Sol Menü)'}
            {activeSubView === 'reports' && 'Reports — Raporlar & SLA Analizi'}
            {activeSubView === 'messages' && 'Messages — Mesaj Merkezi (3)'}
            {activeSubView === 'calendar' && 'Calendar — Sürüm & Operasyon Takvimi'}
            {activeSubView === 'file-manager' && 'Files — FileManGL Dosya Yöneticisi'}
            {activeSubView === 'smart-cluster' && 'Cihaz & Sunucu Kümesi'}
            {activeSubView === 'settings' && 'Settings — Çalışma Alanı Ayarları'}
            {activeSubView === 'security' && 'Security — Zero-Trust & API Güvenliği'}
          </h1>
          <span className="uxu-dash-toolbar__subtitle">
            {activeSubView === 'analytics'
              ? 'Comprehensive insights and performance metrics — Gelir, Trafik Kaynakları, Dönüşüm Hunisi, Coğrafi ve Cihaz Analitiği'
              : 'Gerçek zamanlı sistem metrikleri, etkileşimli grafikler, SheetGL tablo ve FileManGL VFS paneli'}
          </span>
        </div>

        <div className="uxu-dash-toolbar__right">
          {onSubViewChange && (
            <SegmentedControl<DashboardSubView>
              value={
                ['overview', 'analytics', 'crm-orders', 'file-manager', 'smart-cluster'].includes(
                  activeSubView
                )
                  ? activeSubView
                  : 'overview'
              }
              onChange={onSubViewChange}
              size="sm"
              options={[
                { value: 'overview', label: 'Dashboard', href: '/dashboard/overview' },
                { value: 'analytics', label: 'Analytics', href: '/dashboard/analytics' },
                { value: 'crm-orders', label: 'Orders', href: '/dashboard/crm-orders' },
                { value: 'file-manager', label: 'Files', href: '/dashboard/file-manager' },
                { value: 'smart-cluster', label: 'Cluster', href: '/dashboard/smart-cluster' },
              ]}
            />
          )}

          <Button
            variant="glass"
            size="sm"
            leadingIcon={<Download size={14} />}
            onClick={() =>
              notify({
                title: 'Rapor İndirildi',
                description: 'uxiGL_Report_2026.pdf hazırlandı.',
                tone: 'success',
              })
            }
          >
            Dışa Aktar
          </Button>
        </div>
      </div>

      {/* Render Dedicated Metis Admin Sub-Views (Users, Products, Forms, Elements Overview, Reports, Messages, Calendar, Settings, Security) */}
      {isExtendedAdminView && (
        <AdminSubViews
          viewId={activeSubView as ExtendedAdminViewId}
          onSelectElementComponent={onSelectComponent}
        />
      )}

      {/* Render Full Multi-Variant Sidebar Showcase */}
      {(activeSubView === 'sidebar-showcase' ||
        activeSubView === 'sidebars' ||
        activeSubView?.startsWith('sidebar-')) && (
        <SidebarShowcaseView
          currentVariant={sidebarVariant}
          onVariantChange={onSidebarVariantChange}
          accentColor={sidebarAccent}
          onAccentColorChange={onSidebarAccentChange}
          onOpenDrawer={onOpenDrawer}
          collapsed={sidebarCollapsed}
          onToggleCollapse={onToggleSidebarCollapse}
        />
      )}

      {/* Render Full 8-Section Metis Analytics Dashboard when activeSubView === 'analytics' */}
      {activeSubView === 'analytics' && (
        <AnalyticsChartsSuite
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
          fullAnalyticsMode={true}
        />
      )}

      {/* Render Top KPI + Interactive Revenue Spline/Bar Chart + Traffic Sources Donut on Overview */}
      {activeSubView === 'overview' && (
        <AnalyticsChartsSuite
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
          fullAnalyticsMode={false}
        />
      )}

      {/* Top 4-Card KPI Strip for Cluster view */}
      {activeSubView === 'smart-cluster' && (
        <div className="uxu-kpi-grid">
          <StatCard
            label="Toplam Gelir"
            value={currentChart.totalRevenue}
            delta={currentChart.growth}
            trend="up"
            tone="primary"
            subtitle="Aktif abonelikler"
            icon={<DollarSign size={17} />}
            sparklineData={currentChart.primary}
          />
          <StatCard
            label="Aktif Kullanıcı"
            value="128.4K"
            delta="+12.6% bu ay"
            trend="up"
            tone="success"
            subtitle="99.98% kararlılık"
            icon={<Users size={17} />}
            sparklineData={[54, 62, 71, 79, 86, 93, 100]}
          />
          <StatCard
            label="Tepki Süresi"
            value="8.3 ms"
            delta="Anlık yanıt"
            trend="up"
            tone="info"
            subtitle="Akıcı etkileşim"
            icon={<Activity size={17} />}
            sparklineData={[118, 120, 119, 120, 120, 120, 120]}
          />
          <StatCard
            label="Küme Verimi"
            value="98.4%"
            delta="-18% güç"
            trend="up"
            tone="warning"
            subtitle="4 aktif bölge"
            icon={<Cpu size={17} />}
            sparklineData={[72, 76, 81, 85, 90, 95, 98.4]}
          />
        </div>
      )}

      {/* 3. SheetGL & FileManGL Enterprise Engines (Single active engine on Overview to save GPU/RAM) */}
      {activeSubView === 'overview' && (
        <Card
          variant="glass"
          padding="md"
          eyebrow={
            overviewEngineTab === 'sheetgl'
              ? 'SHEETGL WEBGL DATAGRID'
              : 'FILEMANGL WEBGL2 FILE MANAGER'
          }
          title={
            overviewEngineTab === 'sheetgl'
              ? 'Kurumsal Finans & Sipariş Tablosu'
              : 'Bulut Dosya & VFS Yöneticisi'
          }
          subtitle={
            overviewEngineTab === 'sheetgl'
              ? 'WebGL/Canvas sanallaştırma, 14 sütun tipi, Cascading Lookup ve Batch CRUD'
              : 'WebGL2 3D Spatial & Disk Haritası, Çift Panel (Dual-Pane), ACL/POSIX İzin Motoru ve ZIP Arşivleme'
          }
          headerIcon={
            overviewEngineTab === 'sheetgl' ? (
              <ShoppingBag size={18} />
            ) : (
              <HardDrive size={18} />
            )
          }
          headerAction={
            <SegmentedControl
              size="sm"
              value={overviewEngineTab}
              onChange={setOverviewEngineTab}
              options={[
                { value: 'sheetgl', label: 'SheetGL DataGrid' },
                { value: 'filemangl', label: 'FileManGL VFS' },
              ]}
            />
          }
        >
          {overviewEngineTab === 'sheetgl' ? (
            <SheetGLGridAdapter
              datasetPreset={activeSheetPreset}
              initialRowCount={150}
              height={460}
            />
          ) : (
            <FileManGLExplorerAdapter height={500} />
          )}
        </Card>
      )}

      {activeSubView === 'crm-orders' && (
        <div className="uxu-stack-md">
          <Card
            variant="glass"
            padding="md"
            eyebrow={`SHEETGL WEBGL DATAGRID • ${SHEETGL_PRESET_META[
              activeSheetPreset
            ].shortLabel.toUpperCase()}`}
            title={SHEETGL_PRESET_META[activeSheetPreset].label}
            subtitle={SHEETGL_PRESET_META[activeSheetPreset].description}
            headerIcon={<ShoppingBag size={18} />}
            headerAction={
              <SegmentedControl<SheetGLDatasetPreset>
                size="sm"
                value={activeSheetPreset}
                onChange={setActiveSheetPreset}
                options={[
                  { value: 'finance-erp', label: 'Finans & ERP' },
                  { value: 'cloud-telemetry', label: 'Telemetri' },
                  { value: 'hr-payroll', label: 'İK & Bordro' },
                  { value: 'inventory-supply', label: 'Stok & Lojistik' },
                ]}
              />
            }
          >
            <SheetGLGridAdapter
              datasetPreset={activeSheetPreset}
              initialRowCount={300}
              height={580}
            />
          </Card>
        </div>
      )}

      {activeSubView === 'file-manager' && (
        <Card
          variant="glass"
          padding="md"
          eyebrow="FILEMANGL WEBGL2 FILE MANAGER"
          title="Bulut Dosya & VFS Yöneticisi"
          subtitle="WebGL2 3D Spatial & Disk Haritası, Çift Panel (Dual-Pane), ACL/POSIX İzin Motoru ve ZIP Arşivleme"
          headerIcon={<HardDrive size={18} />}
        >
          <FileManGLExplorerAdapter height={660} />
        </Card>
      )}

      {/* 4. 3-Column Bento Grid: Apple Spatial Audio + Material Climate + LSP Control Center */}
      {(activeSubView === 'overview' || activeSubView === 'smart-cluster') && (
        <div className="uxu-bento-grid">
          {/* Card 1: Spatial Audio & Control Center */}
          <Card
            variant="glass"
            material="regular"
            glowOnHover
            eyebrow="LIQUID GLASS • STANDART MALZEME (REGULAR)"
            title="Spatial Audio & Control Center"
            subtitle="İçerik Katmanı (Regular) + Medya Üstü Clear Liquid Glass"
            headerIcon={<Headphones size={20} />}
            headerAction={
              <Badge tone="success" pulse size="sm">
                AirPods Max Ultra
              </Badge>
            }
          >
            <div
              className={`uxu-media-player ${
                clearGlassDimmed ? 'uxu-media-player--dimmed' : ''
              }`}
            >
              <div className="uxu-media-player__artwork">
                <div className="uxu-media-player__orb" />
                <div className="uxu-media-player__meta">
                  <span className="uxu-media-player__track">
                    Solaris Symphony (Dolby Atmos)
                  </span>
                  <span className="uxu-media-player__artist">
                    Liquid Glass (Clear) •{' '}
                    {clearGlassDimmed ? '%35 Karartma Açık' : 'Tam Şeffaf'}
                  </span>
                </div>
              </div>

              <div className="uxu-media-player__controls">
                <Button
                  variant="glass"
                  size="sm"
                  iconOnly
                  pill
                  aria-label="Önceki parça"
                  onClick={() =>
                    notify({ title: 'Önceki Parça', tone: 'neutral' })
                  }
                >
                  <SkipBack size={16} />
                </Button>
                <Button
                  variant="filled"
                  size="md"
                  iconOnly
                  pill
                  aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
                  onClick={() => setIsPlaying((prev) => !prev)}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  iconOnly
                  pill
                  aria-label="Sonraki parça"
                  onClick={() =>
                    notify({ title: 'Sonraki Parça', tone: 'neutral' })
                  }
                >
                  <SkipForward size={16} />
                </Button>
              </div>
            </div>

            <div className="uxu-stack-md">
              <Switch
                size="sm"
                label="Clear Liquid Glass %35 Karartma Katmanı"
                description="Parlak medya arka planlarında okunabilirliği korur (HIG: Glass.clear)"
                value={clearGlassDimmed}
                onChange={setClearGlassDimmed}
              />

              <SegmentedControl
                label="Akustik Gürültü Kontrolü (Liquid Glass: Regular)"
                value={audioMode}
                onChange={setAudioMode}
                size="sm"
                fullWidth
                options={[
                  { value: 'anc', label: 'ANC' },
                  { value: 'transparency', label: 'Şeffaf Mod' },
                  { value: 'spatial', label: 'Uzamsal (Spatial)' },
                ]}
              />

              <Slider
                label="Çıkış Seviyesi (Etkinleştirildiğinde Liquid Glass)"
                value={volume}
                onChange={setVolume}
                valueSuffix="%"
                leadingIcon={<Volume2 size={15} />}
              />

              <Slider
                label="Kafa İzleme & Sahne Derinliği"
                value={spatialDepth}
                onChange={setSpatialDepth}
                tone="info"
                valueSuffix="%"
                showTicks
                step={10}
                leadingIcon={<Sparkles size={15} />}
              />
            </div>
          </Card>

          {/* Card 2: Google Material You Smart Climate & Workspace Hub */}
          <Card
            variant="tonal"
            glowOnHover
            eyebrow="GOOGLE MATERIAL YOU (M3)"
            title="Akıllı İklim & Çalışma Alanı"
            subtitle="Dinamik Tonal Konteyner & Filtre Çipleri"
            headerIcon={<Thermometer size={20} />}
            headerAction={
              <Badge tone="primary" variant="filled" size="sm">
                Eko-Simülasyon
              </Badge>
            }
          >
            <Tabs
              variant="pill"
              size="sm"
              activeId={activeZoneTab}
              onChange={setActiveZoneTab}
              items={[
                { id: 'studio', label: 'Tasarım Stüdyosu', count: 4 },
                { id: 'server', label: 'Veri Merkezi', count: 12 },
                { id: 'lounge', label: 'Dinlenme Alanı' },
              ]}
            />

            <div className="uxu-climate-dial-row">
              <Progress
                variant="circular"
                size="lg"
                tone="primary"
                value={Math.round(((targetTemp - 16) / 14) * 100)}
              />
              <div className="uxu-climate-readout">
                <span className="uxu-climate-readout__temp">
                  {targetTemp.toFixed(1)}°C
                </span>
                <span className="uxu-climate-readout__sub">
                  Hedef Sıcaklık • Nem %44
                </span>
                <div className="uxu-climate-btns">
                  <Button
                    variant="outlined"
                    size="xs"
                    onClick={() =>
                      setTargetTemp((t) =>
                        Math.max(16, Number((t - 0.5).toFixed(1)))
                      )
                    }
                  >
                    -0.5°C
                  </Button>
                  <Button
                    variant="filled"
                    size="xs"
                    onClick={() =>
                      setTargetTemp((t) =>
                        Math.min(30, Number((t + 0.5).toFixed(1)))
                      )
                    }
                  >
                    +0.5°C
                  </Button>
                </div>
              </div>
            </div>

            <div className="uxu-stack-md">
              <Slider
                label="Gün Işığı Spektrum Parlaklığı"
                value={ambientLight}
                onChange={setAmbientLight}
                tone="warning"
                valueSuffix="%"
                leadingIcon={<Sun size={15} />}
              />

              <div>
                <div className="uxu-field__label" style={{ marginBottom: 8 }}>
                  Aktif Ortam Senaryoları (Material 3 Filter Chips)
                </div>
                <div className="uxu-stage-row">
                  {[
                    'Liquid Glass',
                    'Material You',
                    'Responsive',
                    'Odak Modu',
                    'Düşük Güç',
                  ].map((tag) => (
                    <Chip
                      key={tag}
                      size="sm"
                      selected={activeTags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Card 3: Quick System Controls */}
          <Card
            variant="glass"
            glowOnHover
            eyebrow="KONTROL MERKEZİ"
            title="Hızlı Sistem Ayarları"
            subtitle="Switch ve Checkbox görünümü arasında geçiş yapın"
            headerIcon={<Sliders size={18} />}
            headerAction={
              <Tooltip content="Kontrol tipini değiştir">
                <Button
                  variant="tonal"
                  size="xs"
                  leadingIcon={<RefreshCw size={12} />}
                  onClick={() =>
                    setUseCheckboxInsteadOfSwitch((prev) => !prev)
                  }
                >
                  {useCheckboxInsteadOfSwitch ? 'Checkbox' : 'Switch'}
                </Button>
              </Tooltip>
            }
            footer={
              <div className="uxu-quick-task-row">
                <Input
                  placeholder="Yeni mimari kural ekle..."
                  value={newTaskTitle}
                  onChange={setNewTaskTitle}
                  size="sm"
                  surface="tonal"
                />
                <Button
                  variant="filled"
                  size="sm"
                  leadingIcon={<Plus size={15} />}
                  onClick={() => {
                    if (!newTaskTitle.trim()) return;
                    notify({
                      title: 'Kural Eklendi',
                      description: newTaskTitle,
                      tone: 'success',
                    });
                    setNewTaskTitle('');
                  }}
                >
                  Ekle
                </Button>
              </div>
            }
          >
            <div className="uxu-stack-md">
              <BooleanControlComponent
                label="Dinamik Cam Geçirgenliği"
                description="Pencere odak durumuna göre blur katmanını optimize et"
                value={settingsState.adaptiveVibrancy}
                onChange={(val) =>
                  setSettingsState((s) => ({ ...s, adaptiveVibrancy: val }))
                }
                tone="primary"
              />
              <BooleanControlComponent
                label="Material You Tohum Renk Senkronu"
                description="Duvar kağıdı ve sistem vurgu rengini otomatik türet"
                value={settingsState.dynamicSeedSync}
                onChange={(val) =>
                  setSettingsState((s) => ({ ...s, dynamicSeedSync: val }))
                }
                tone="success"
              />
              <BooleanControlComponent
                label="Sinirsel Güç Tasarruf Kalkanı"
                description="Arka plan animasyonlarını 60Hz'e sabitle"
                value={settingsState.neuralPowerSaver}
                onChange={(val) =>
                  setSettingsState((s) => ({ ...s, neuralPowerSaver: val }))
                }
                tone="warning"
              />
              <BooleanControlComponent
                label="Zero-Trust Kuantum Şifreleme"
                description="Tüm yerel depolama adaptörlerini imzala"
                value={settingsState.zeroTrustEncryption}
                onChange={(val) =>
                  setSettingsState((s) => ({ ...s, zeroTrustEncryption: val }))
                }
                tone="info"
              />
            </div>
          </Card>
        </div>
      )}

      {/* 5. Lightweight Native HTML DataTable Showcase (Simple Native Table Design) */}
      {(activeSubView === 'overview' ||
        activeSubView === 'crm-orders' ||
        activeSubView === 'smart-cluster') && (
        <Card
          variant="glass"
          padding="md"
          eyebrow="UXIGL NATIVE HTML TABLE (SIFIR WEBGL • HAFİF TABLO TASARIMI)"
          title={
            nativeTableDataset === 'deployments'
              ? 'Dağıtık Mikroservis Durum Tablosu'
              : nativeTableDataset === 'apikeys'
              ? 'API Erişim Anahtarları & Güvenlik Kayıtları'
              : 'Kurumsal Abonelik & Fatura Özeti'
          }
          subtitle="Basit ve hafif listeler için semantik HTML <table> mimarisi: 4 görsel varyant, 3 yoğunluk seviyesi ve satır seçimi"
          headerIcon={<Wifi size={18} />}
          headerAction={
            <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
              <SegmentedControl
                size="sm"
                value={nativeTableDataset}
                onChange={setNativeTableDataset}
                options={[
                  { value: 'deployments', label: 'Servisler' },
                  { value: 'apikeys', label: 'API Anahtarları' },
                  { value: 'invoices', label: 'Faturalar' },
                ]}
              />
              <SegmentedControl
                size="sm"
                value={nativeTableVariant}
                onChange={setNativeTableVariant}
                options={[
                  { value: 'default', label: 'Standart' },
                  { value: 'striped', label: 'Zebra' },
                  { value: 'bordered', label: 'Çerçeveli' },
                  { value: 'minimal', label: 'Minimal' },
                ]}
              />
              <SegmentedControl
                size="sm"
                value={nativeTableSize}
                onChange={setNativeTableSize}
                options={[
                  { value: 'sm', label: 'Kompakt' },
                  { value: 'md', label: 'Normal' },
                  { value: 'lg', label: 'Geniş' },
                ]}
              />
            </div>
          }
        >
          {nativeTableDataset === 'deployments' && (
            <DataTable<DeploymentRow>
              rowKey="id"
              variant={nativeTableVariant}
              size={nativeTableSize}
              selectable={nativeTableSelectable}
              data={INITIAL_DEPLOYMENTS}
              searchPlaceholder="Servis adı, sorumlu mühendis veya ortam ara..."
              toolbarRight={
                <Switch
                  size="sm"
                  label="Satır Seçimi"
                  value={nativeTableSelectable}
                  onChange={setNativeTableSelectable}
                />
              }
              footerSummary={
                <>
                  <span>
                    Toplam <strong>{INITIAL_DEPLOYMENTS.length}</strong> aktif
                    küme düğümü izleniyor
                  </span>
                  <span>Ortalama Küme Sağlığı: %93.6 • SLA: %99.99</span>
                </>
              }
              columns={[
                {
                  key: 'service',
                  header: 'Mikro-Servis',
                  sortable: true,
                  render: (row) => (
                    <code className="uxu-prop-name">{row.service}</code>
                  ),
                },
                {
                  key: 'owner',
                  header: 'Sorumlu Mimar',
                  sortable: true,
                  render: (row) => (
                    <div className="uxu-table-user-cell">
                      <Avatar name={row.owner} size="xs" tone="primary" />
                      <span>{row.owner}</span>
                    </div>
                  ),
                },
                {
                  key: 'environment',
                  header: 'Hedef Platform',
                  sortable: true,
                },
                {
                  key: 'health',
                  header: 'Sağlık Skoru',
                  sortable: true,
                  render: (row) => (
                    <div style={{ minWidth: 130 }}>
                      <Progress
                        value={row.health}
                        size="sm"
                        tone={
                          row.health >= 95
                            ? 'success'
                            : row.health >= 85
                            ? 'primary'
                            : 'warning'
                        }
                      />
                    </div>
                  ),
                },
                {
                  key: 'status',
                  header: 'Durum',
                  sortable: true,
                  align: 'right',
                  render: (row) => (
                    <Badge
                      size="sm"
                      tone={
                        row.status === 'Healthy'
                          ? 'success'
                          : row.status === 'Canary'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {row.status}
                    </Badge>
                  ),
                },
              ]}
            />
          )}

          {nativeTableDataset === 'apikeys' && (
            <DataTable<ApiKeyRow>
              rowKey="id"
              variant={nativeTableVariant}
              size={nativeTableSize}
              selectable={nativeTableSelectable}
              data={INITIAL_API_KEYS}
              searchPlaceholder="Anahtar adı, prefix veya yetki kapsamı ara..."
              toolbarRight={
                <Switch
                  size="sm"
                  label="Satır Seçimi"
                  value={nativeTableSelectable}
                  onChange={setNativeTableSelectable}
                />
              }
              footerSummary={
                <>
                  <span>Zero-Trust HMAC-SHA256 imzalı erişim anahtarları</span>
                  <span>Otomatik Rotasyon Süresi: 30 Gün</span>
                </>
              }
              columns={[
                {
                  key: 'keyName',
                  header: 'Anahtar Adı',
                  sortable: true,
                  render: (row) => <strong>{row.keyName}</strong>,
                },
                {
                  key: 'prefix',
                  header: 'Anahtar Öneki',
                  render: (row) => (
                    <code className="uxu-prop-name">{row.prefix}</code>
                  ),
                },
                {
                  key: 'scope',
                  header: 'Yetki Kapsamı (Scope)',
                  sortable: true,
                },
                {
                  key: 'rateLimit',
                  header: 'Hız Sınırı',
                  sortable: true,
                },
                {
                  key: 'lastUsed',
                  header: 'Son Kullanım',
                  sortable: true,
                },
                {
                  key: 'status',
                  header: 'Durum',
                  sortable: true,
                  align: 'right',
                  render: (row) => (
                    <Badge
                      size="sm"
                      tone={
                        row.status === 'Active'
                          ? 'success'
                          : row.status === 'Rotating'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {row.status}
                    </Badge>
                  ),
                },
              ]}
            />
          )}

          {nativeTableDataset === 'invoices' && (
            <DataTable<InvoiceSummaryRow>
              rowKey="id"
              variant={nativeTableVariant}
              size={nativeTableSize}
              selectable={nativeTableSelectable}
              data={INITIAL_INVOICES}
              searchPlaceholder="Fatura no, kurumsal müşteri veya paket ara..."
              toolbarRight={
                <Switch
                  size="sm"
                  label="Satır Seçimi"
                  value={nativeTableSelectable}
                  onChange={setNativeTableSelectable}
                />
              }
              footerSummary={
                <>
                  <span>Ekim 2026 Dönemi Kurumsal Faturalar</span>
                  <span>Toplam Tahsilat: $140,950.00</span>
                </>
              }
              columns={[
                {
                  key: 'invoiceNo',
                  header: 'Fatura No',
                  sortable: true,
                  render: (row) => (
                    <code className="uxu-prop-name">{row.invoiceNo}</code>
                  ),
                },
                {
                  key: 'customer',
                  header: 'Kurumsal Müşteri',
                  sortable: true,
                  render: (row) => <strong>{row.customer}</strong>,
                },
                {
                  key: 'plan',
                  header: 'Lisans Paketi',
                  sortable: true,
                },
                {
                  key: 'billingDate',
                  header: 'Kesim Tarihi',
                  sortable: true,
                },
                {
                  key: 'amount',
                  header: 'Tutar',
                  sortable: true,
                  align: 'right',
                  render: (row) => (
                    <strong style={{ fontFamily: 'var(--uxu-font-mono)' }}>
                      {row.amount}
                    </strong>
                  ),
                },
                {
                  key: 'paymentState',
                  header: 'Ödeme Durumu',
                  sortable: true,
                  align: 'right',
                  render: (row) => (
                    <Badge
                      size="sm"
                      tone={
                        row.paymentState === 'Paid'
                          ? 'success'
                          : row.paymentState === 'Pending'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {row.paymentState === 'Paid'
                        ? 'Ödendi'
                        : row.paymentState === 'Pending'
                        ? 'Bekliyor'
                        : 'Gecikmiş'}
                    </Badge>
                  ),
                },
              ]}
            />
          )}
        </Card>
      )}

      {/* 6. Materials & Vibrancy Interactive Architecture Matrix */}
      {(activeSubView === 'overview' || activeSubView === 'smart-cluster') && (
        <Card
          variant="glass"
          material="regular"
          eyebrow="LIQUID GLASS & STANDART MALZEMELER • VIBRANCY"
          title="Malzeme Katmanları: Liquid Glass vs. Standart Malzemeler"
          subtitle="Kontrol/Gezinme Katmanı (Liquid Glass: regular & clear) ile İçerik Katmanı (ultraThin, thin, regular, thick) ve UIVibrancyEffectStyle Hiyerarşisi"
          headerIcon={<Sparkles size={20} />}
          headerAction={
            <SegmentedControl
              size="sm"
              value={selectedPlatformGuide}
              onChange={setSelectedPlatformGuide}
              options={[
                { value: 'ios', label: 'iOS / iPadOS' },
                { value: 'macos', label: 'macOS' },
                { value: 'tvos', label: 'tvOS' },
                { value: 'visionos', label: 'visionOS' },
                { value: 'watchos', label: 'watchOS' },
              ]}
            />
          }
        >
          <div className="uxu-hig-materials-showcase">
            <div className="uxu-hig-materials-grid">
              {/* 1. Liquid Glass: Regular */}
              <div className="uxu-hig-mat-tile uxu-material--liquid-regular">
                <div className="uxu-hig-mat-tile__head">
                  <strong className="uxu-vibrancy-label">Liquid Glass: Regular</strong>
                  <span className="uxu-hig-mat-tile__badge">Gezinme Katmanı</span>
                </div>
                <p className="uxu-vibrancy-secondary-label" style={{ fontSize: '0.78rem' }}>
                  Kenar çubuğu, üst araç çubuğu, sekme çubukları ve açılır pencereler için bulanıklık ve parlaklığı otomatik dengeler.
                </p>
                <div className="uxu-hig-vibrancy-pills">
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-fill uxu-vibrancy-label">
                    Glass.regular
                  </span>
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-secondary-fill uxu-vibrancy-secondary-label">
                    Scroll-Edge
                  </span>
                </div>
              </div>

              {/* 2. Liquid Glass: Clear */}
              <div
                className={`uxu-hig-mat-tile uxu-material--liquid-clear ${
                  clearGlassDimmed ? 'uxu-liquid-glass-dimmed' : ''
                }`}
              >
                <div className="uxu-hig-mat-tile__head">
                  <strong className="uxu-vibrancy-label">Liquid Glass: Clear</strong>
                  <span className="uxu-hig-mat-tile__badge">Medya Üstü</span>
                </div>
                <p className="uxu-vibrancy-secondary-label" style={{ fontSize: '0.78rem' }}>
                  Fotoğraf ve video gibi zengin arka planların üzerinde yüzen kontroller içindir; parlak medyada %35 karartma katmanı alır.
                </p>
                <div className="uxu-hig-vibrancy-pills">
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-fill uxu-vibrancy-label">
                    Glass.clear
                  </span>
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-secondary-fill uxu-vibrancy-secondary-label">
                    %35 Dimming
                  </span>
                </div>
              </div>

              {/* 3. Standard Material: ultraThin */}
              <div className="uxu-hig-mat-tile uxu-material--ultraThin">
                <div className="uxu-hig-mat-tile__head">
                  <strong className="uxu-vibrancy-label">Material.ultraThin</strong>
                  <span className="uxu-hig-mat-tile__badge">İçerik • 10px</span>
                </div>
                <p className="uxu-vibrancy-secondary-label" style={{ fontSize: '0.78rem' }}>
                  Arka plandaki bağlamı en yüksek düzeyde koruyan tam ekran veya hafif içerik katmanı malzemesi.
                </p>
                <div className="uxu-hig-vibrancy-pills">
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-fill uxu-vibrancy-label">
                    label
                  </span>
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-secondary-fill uxu-vibrancy-secondary-label">
                    secondaryLabel
                  </span>
                </div>
              </div>

              {/* 4. Standard Material: thin */}
              <div className="uxu-hig-mat-tile uxu-material--thin">
                <div className="uxu-hig-mat-tile__head">
                  <strong className="uxu-vibrancy-label">Material.thin</strong>
                  <span className="uxu-hig-mat-tile__badge">İçerik • 18px</span>
                </div>
                <p className="uxu-vibrancy-secondary-label" style={{ fontSize: '0.78rem' }}>
                  İçerik katmanındaki etkileşimli öğelere, seçili satırlara ve kısmi bindirme görünümlerine dikkat çeker.
                </p>
                <div className="uxu-hig-vibrancy-pills">
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-fill uxu-vibrancy-label">
                    fill
                  </span>
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-secondary-fill uxu-vibrancy-secondary-label">
                    secondaryFill
                  </span>
                </div>
              </div>

              {/* 5. Standard Material: regular */}
              <div className="uxu-hig-mat-tile uxu-material--regular">
                <div className="uxu-hig-mat-tile__head">
                  <strong className="uxu-vibrancy-label">Material.regular</strong>
                  <span className="uxu-hig-mat-tile__badge">Varsayılan • 28px</span>
                </div>
                <p className="uxu-vibrancy-secondary-label" style={{ fontSize: '0.78rem' }}>
                  İçerik kartları, gruplandırılmış tablolar ve uygulama bölümleri arasında görsel ayrım sağlayan standart malzeme.
                </p>
                <div className="uxu-hig-vibrancy-pills">
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-fill uxu-vibrancy-label">
                    tertiaryLabel
                  </span>
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-tertiary-fill uxu-vibrancy-secondary-label">
                    separator
                  </span>
                </div>
              </div>

              {/* 6. Standard Material: thick */}
              <div className="uxu-hig-mat-tile uxu-material--thick">
                <div className="uxu-hig-mat-tile__head">
                  <strong className="uxu-vibrancy-label">Material.thick</strong>
                  <span className="uxu-hig-mat-tile__badge">Yüksek Kontrast • 42px</span>
                </div>
                <p className="uxu-vibrancy-secondary-label" style={{ fontSize: '0.78rem' }}>
                  Yoğun metin ve ince detaylara sahip denetçi panelleri için en yüksek kontrastı sağlayan kalın içerik malzemesi.
                </p>
                <div className="uxu-hig-vibrancy-pills">
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-fill uxu-vibrancy-label">
                    quaternaryLabel
                  </span>
                  <span className="uxu-hig-vibrancy-pill uxu-vibrancy-tertiary-fill uxu-vibrancy-secondary-label">
                    tertiaryFill
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-vibrancy-secondary-fill)',
                border: '1px solid var(--uxu-vibrancy-separator)',
                fontSize: '0.8rem',
              }}
              className="uxu-vibrancy-secondary-label"
            >
              {selectedPlatformGuide === 'ios' && (
                <>
                  <strong className="uxu-vibrancy-label">iOS & iPadOS Kılavuzu:</strong>{' '}
                  İçerik katmanında <code>ultraThin</code>, <code>thin</code>, <code>regular</code> ve <code>thick</code> standart malzemeleri kullanılır; <code>quaternaryLabel</code> düşük kontrast nedeniyle <code>thin</code> ve <code>ultraThin</code> üzerinde otomatik olarak <code>tertiaryLabel</code> seviyesine yükseltilir. Kaydırıcılar (<code>Slider</code>) ve geçiş düğmeleri (<code>Switch</code>) etkinleştirildiğinde geçici olarak <strong>Liquid Glass</strong> görünümünü alır.
                </>
              )}
              {selectedPlatformGuide === 'macos' && (
                <>
                  <strong className="uxu-vibrancy-label">macOS Kılavuzu:</strong>{' '}
                  <code>NSVisualEffectView.Material</code> ile pencere arkası (<em>behindWindow</em>) ve pencere içi (<em>withinWindow</em>) karıştırma modlarını destekler; sistem renklerinin canlı (vibrant) sürümleriyle metin okunabilirliğini korur.
                </>
              )}
              {selectedPlatformGuide === 'tvos' && (
                <>
                  <strong className="uxu-vibrancy-label">tvOS Kılavuzu:</strong>{' '}
                  Liquid Glass, Top Shelf ve Control Center gibi gezinme öğelerinde ve odaklanan (focused) düğmelerde kullanılır; içerik katmanında ise <code>ultraThin</code> (açık şema tam ekran), <code>thin</code>, <code>regular</code> ve <code>thick</code> (koyu şema bindirme) yapı sağlar.
                </>
              )}
              {selectedPlatformGuide === 'visionos' && (
                <>
                  <strong className="uxu-vibrancy-label">visionOS Kılavuzu:</strong>{' '}
                  Pencereler fiziksel ve sanal ortamın ışığına dinamik uyum sağlayan uyarlanabilir <strong>Glass</strong> kullanır; etkileşimli öğeler için <code>thin</code>, bölüm ayrımı için <code>regular</code>, kontrastlı koyu alanlar için <code>thick</code> ve 3 canlılık seviyesi (<code>label</code>, <code>secondaryLabel</code>, <code>tertiaryLabel</code>) uygulanır.
                </>
              )}
              {selectedPlatformGuide === 'watchos' && (
                <>
                  <strong className="uxu-vibrancy-label">watchOS Kılavuzu:</strong>{' '}
                  Tam ekran modal görünümlerde bağlamı korumak ve kontrolleri içerikten ayırmak için varsayılan materyal arka planları korunur.
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
