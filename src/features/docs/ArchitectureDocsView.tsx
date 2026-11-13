import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Code2,
  Check,
  Copy,
  Terminal,
  Palette,
  Layout,
  Bell,
  Rocket,
  Sun,
  Moon,
  Monitor,
  ArrowRight,
  Layers,
  Mail,
  Lock,
  Search,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Table2,
  FormInput,
  FileCode2,
} from 'lucide-react';
import { Card, SegmentedControl } from '../../components/composites';
import {
  Badge,
  Button,
  Input,
  Switch,
  Slider,
  GoogleIcon,
} from '../../components/primitives';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { CodeGeneratorService } from '../../core/services/CodeGeneratorService';
import { RouteService } from '../../core/services/RouteService';
import { COMPONENT_CATALOG } from '../catalog/componentCatalog';
import { SidebarShowcaseView } from '../showcase/SidebarShowcaseView';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from '../showcase/PageTemplatesShowcaseView';
import {
  ComponentDocCard,
  FORM_CONTROL_GUIDES,
  SURFACE_NAVIGATION_GUIDES,
  DATA_FEEDBACK_WEBGL_GUIDES,
} from './docsComponentGuides';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  RadiusScale,
  ThemeMode,
  UIDensity,
  WebGLShaderPreset,
} from '../../core/contracts/ThemeContract';
import type { ToastPlacement, ToastTone } from '../../core/contracts/NotificationContract';

export type DocsTopicId =
  | 'getting-started'
  | 'form-controls'
  | 'surfaces-navigation'
  | 'data-feedback-webgl'
  | 'layout-shell'
  | 'page-templates'
  | 'theming-tokens'
  | 'cli-shortcuts';

export interface ArchitectureDocsViewProps {
  activeTopic?: DocsTopicId;
  onTopicChange?: (topic: DocsTopicId) => void;
  onSelectComponent?: (componentId: string) => void;
  onOpenCommandPalette?: () => void;
}

interface DocSubNavItem {
  id: string;
  labelTr: string;
  labelEn: string;
  onSelect?: () => void;
}

interface DocChapterMeta {
  id: DocsTopicId;
  step: string;
  badgeTr: string;
  badgeEn: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  icon: React.ReactNode;
  subItems: DocSubNavItem[];
}

const INSTALL_SNIPPET = `# 1. Tek Komutla uxiGL Kurulumu (SheetGL, FileManGL ve Simgeler Dahildir)
npm install truncgil-uxigl
# veya: pnpm add truncgil-uxigl | yarn add truncgil-uxigl | bun add truncgil-uxigl

# 2. NPX CLI ile Hazır Çalışma Alanı Bileşenini Otomatik Oluşturun
npx truncgil-uxigl init

# 3. Geliştirme Sunucusunu Başlatın
npm run dev`;

const PROVIDER_SETUP_SNIPPET = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, ToastProvider } from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);`;

const QUICK_START_COMPONENT_SNIPPET = `import { useState } from 'react';
import { Card, Input, Switch, Button, Badge, useToast } from 'truncgil-uxigl';
import { Mail, Sparkles } from 'lucide-react';

export function QuickWorkspaceCard() {
  const { notify } = useToast();
  const [email, setEmail] = useState('mimar@uxigl.dev');
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <Card
      variant="glass"
      title="uxiGL Çalışma Alanına Bağlan"
      subtitle="Liquid Glass Cam Yüzeyi × Dinamik Tonal Kontroller"
      headerAction={<Badge tone="success" pulse>Hazır</Badge>}
    >
      <div className="uxu-stack-md">
        <Input
          label="Kurumsal E-Posta"
          value={email}
          onChange={setEmail}
          leadingIcon={<Mail size={16} />}
          clearable
        />
        <Switch
          label="Oturumu Açık Tut ve Tema Tercihlerini Eşitle"
          value={rememberMe}
          onChange={setRememberMe}
          tone="primary"
        />
        <Button
          variant="filled"
          fullWidth
          leadingIcon={<Sparkles size={16} />}
          onClick={() =>
            notify({
              title: 'Bağlantı Kuruldu',
              description: \`Hoş geldiniz, \${email}\`,
              tone: 'success',
            })
          }
        >
          Çalışma Alanını Başlat
        </Button>
      </div>
    </Card>
  );
}`;

const THEME_HOOK_SNIPPET = `import { useTheme, Button, SegmentedControl, Slider } from 'truncgil-uxigl';

export function ThemeSwitcherBar() {
  const {
    resolvedMode,
    preferences,
    availablePalettes,
    toggleMode,
    setSeedPalette,
    setRadiusScale,
    setCustomRadiusPx,
    setFontScale,
  } = useTheme();

  return (
    <div className="uxu-stage-row">
      <Button variant="tonal" onClick={toggleMode}>
        Aktif Mod: {resolvedMode === 'dark' ? 'Karanlık (Dark)' : 'Aydınlık (Light)'}
      </Button>
      {availablePalettes.map((palette) => (
        <Button
          key={palette.id}
          variant={preferences.seedPalette === palette.id ? 'filled' : 'outlined'}
          size="sm"
          onClick={() => setSeedPalette(palette.id)}
        >
          {palette.name}
        </Button>
      ))}
    </div>
  );
}`;

const LAYOUT_SHELL_SNIPPET = `import { useState } from 'react';
import { Sidebar, TopHeader, type SidebarNavGroup } from 'truncgil-uxigl';

const SIDEBAR_GROUPS: SidebarNavGroup[] = [
  {
    id: 'grp-main',
    title: 'WORKSPACE',
    railLabel: 'DASH',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        subItems: [
          { id: 'overview', label: 'Overview' },
          { id: 'analytics', label: 'Analytics', badge: 'Live' },
        ],
      },
    ],
  },
];

export function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSub, setActiveSub] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="uxu-app-frame">
      <Sidebar
        variant="stacked-vertical" // 'stacked-vertical' | 'standard' | 'mini-rail' | 'dual-column' | 'drawer'
        groups={SIDEBAR_GROUPS}
        activeItemId={activeSection}
        activeSubItemId={activeSub}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((p) => !p)}
        onSelect={(itemId, subId) => {
          setActiveSection(itemId);
          if (subId) setActiveSub(subId);
        }}
        onOpenCommandPalette={() => {}}
        onOpenThemeStudio={() => {}}
      />
      <div className="uxu-app-body">
        <main className="uxu-workspace-viewport">{children}</main>
      </div>
    </div>
  );
}`;

const TOAST_CMD_SNIPPET = `import { useToast, useKeyboardShortcut, Button } from 'truncgil-uxigl';

export function NotificationAndShortcutDemo() {
  const { notify } = useToast();

  // Global Cmd/Ctrl + B kısayolunu dinle
  useKeyboardShortcut('b', () => {
    notify({
      title: 'Kısayol Tetiklendi (⌘B)',
      description: 'Arka plan derleme işlemi başlatıldı.',
      tone: 'info',
      placement: 'top-right', // 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-right'
    });
  }, { metaOrCtrl: true });

  return (
    <Button
      variant="filled"
      onClick={() =>
        notify({
          title: 'Kayıt Başarıyla Güncellendi',
          description: 'Değişiklikler tüm kümelere senkronize edildi.',
          tone: 'success',
          placement: 'bottom-right',
          actionLabel: 'Geri Al',
          onAction: () => console.log('Geri alındı'),
        })
      }
    >
      Bildirim Gönder
    </Button>
  );
}`;

export const ArchitectureDocsView: React.FC<ArchitectureDocsViewProps> = ({
  activeTopic,
  onTopicChange,
  onSelectComponent,
  onOpenCommandPalette,
}) => {
  const {
    preferences,
    resolvedMode,
    activePalette,
    availablePalettes,
    availableFontPresets,
    setMode,
    toggleMode,
    setSeedPalette,
    setRadiusScale,
    setCustomRadiusPx,
    setDensity,
    setFontScale,
    setFontFamilyPreset,
    setIconStyle,
    setIconFilled,
    setIconWeight,
    setGlassIntensity,
    setWebglEnabled,
    setWebglPreset,
    setWebglIntensity,
  } = useTheme();
  const { notify } = useToast();
  const { copiedText, copy } = useCopyToClipboard();

  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const isTR = lang === 'tr';

  const [internalTopic, setInternalTopic] =
    useState<DocsTopicId>('getting-started');
  const currentTopic: DocsTopicId = activeTopic ?? internalTopic;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubId, setActiveSubId] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    'getting-started': true,
    'form-controls': true,
    'surfaces-navigation': true,
    'data-feedback-webgl': true,
    'page-templates': true,
  });

  // Interactive states for the "Get Started" live mini-app card
  const [demoEmail, setDemoEmail] = useState('mimar@uxigl.dev');
  const [demoPass, setDemoPass] = useState('••••••••••••');
  const [demoRemember, setDemoRemember] = useState(true);
  const [docsPageTemplate, setDocsPageTemplate] =
    useState<PageTemplateId>('page-login');
  const [toastPlacement, setToastPlacement] =
    useState<ToastPlacement>('top-right');

  const activeColorSet =
    resolvedMode === 'dark' ? activePalette.dark : activePalette.light;

  const chapters = useMemo<DocChapterMeta[]>(
    () => [
      {
        id: 'getting-started',
        step: '1',
        badgeTr: 'BÖLÜM 1 • KURULUM & MİMARİ',
        badgeEn: 'CHAPTER 1 • SETUP & ARCHITECTURE',
        titleTr: '1. Kurulum, Mimari & Hızlı Başlangıç',
        titleEn: '1. Installation, Architecture & Quick Start',
        subtitleTr:
          'truncgil-uxigl paketini NPM veya NPX CLI ile kurun; ThemeProvider, ToastProvider ve SOLID mimari ilkelerini inceleyin.',
        subtitleEn:
          'Install truncgil-uxigl via NPM or NPX CLI; configure ThemeProvider, ToastProvider, and explore the SOLID architecture.',
        icon: <Rocket size={15} />,
        subItems: [
          { id: 'doc-sec-install', labelTr: 'NPM & NPX CLI Kurulumu', labelEn: 'NPM & NPX CLI Setup' },
          { id: 'doc-sec-live-starter', labelTr: 'Canlı İlk Bileşen Örneği', labelEn: 'Live Starter Component' },
          { id: 'doc-sec-solid', labelTr: 'SOLID & Sıfır Boşta GPU Mimarisi', labelEn: 'SOLID & Zero-Idle GPU Architecture' },
        ],
      },
      {
        id: 'form-controls',
        step: '2',
        badgeTr: 'BÖLÜM 2 • 12 FORM & EYLEM BİLEŞENİ',
        badgeEn: 'CHAPTER 2 • 12 FORM & ACTION PRIMITIVES',
        titleTr: '2. Form & Eylem Bileşenleri Rehberi (12 Bileşen)',
        titleEn: '2. Complete Guide to Form & Action Controls (12 Components)',
        subtitleTr:
          'Button, Input (5 Maske), CurrencyInput, DateTimePickerInput, MultiSelectTagInput, FileUploadDropzone, Select, Textarea, Switch, Checkbox, Slider ve İkonlar.',
        subtitleEn:
          'Button, Input (5 Masks), CurrencyInput, DateTimePickerInput, MultiSelectTagInput, FileUploadDropzone, Select, Textarea, Switch, Checkbox, Slider & Icons.',
        icon: <FormInput size={15} />,
        subItems: FORM_CONTROL_GUIDES.map((g) => ({
          id: `doc-comp-${g.id}`,
          labelTr: `${g.tag} — ${g.titleTr.split(' (')[0]}`,
          labelEn: `${g.tag} — ${g.titleEn.split(' (')[0]}`,
        })),
      },
      {
        id: 'surfaces-navigation',
        step: '3',
        badgeTr: 'BÖLÜM 3 • 11 YÜZEY, DİYALOG & GEZİNME BİLEŞENİ',
        badgeEn: 'CHAPTER 3 • 11 SURFACES, DIALOGS & NAVIGATION',
        titleTr: '3. Yüzey, Kart, Modal & Gezinme Rehberi (11 Bileşen)',
        titleEn: '3. Complete Guide to Surfaces, Modals & Navigation (11 Components)',
        subtitleTr:
          'Card, SegmentedControl, Tabs, Accordion, Stepper, Timeline, 6 Varyantlı Modal, 3 Yönlü Drawer, Alert ve CommandPalette (⌘K).',
        subtitleEn:
          'Card, SegmentedControl, Tabs, Accordion, Stepper, Timeline, 6-Variant Modal, 3-Way Drawer, Alert, and CommandPalette (⌘K).',
        icon: <Layers size={15} />,
        subItems: SURFACE_NAVIGATION_GUIDES.map((g) => ({
          id: `doc-comp-${g.id}`,
          labelTr: `${g.tag} — ${g.titleTr.split(' (')[0]}`,
          labelEn: `${g.tag} — ${g.titleEn.split(' (')[0]}`,
        })),
      },
      {
        id: 'data-feedback-webgl',
        step: '4',
        badgeTr: 'BÖLÜM 4 • VERİ, DURUM & WEBGL MOTORLARI',
        badgeEn: 'CHAPTER 4 • DATA, FEEDBACK & WEBGL ENGINES',
        titleTr: '4. Veri, Geri Bildirim, SheetGL & FileManGL Rehberi',
        titleEn: '4. Data, Feedback, SheetGL & FileManGL Guide',
        subtitleTr:
          'Badge, Chip, Avatar, Progress, Skeleton, Tooltip, StatCard, Native DataTable, SheetGL 120 FPS WebGL DataGrid ve FileManGL WebGL2 VFS.',
        subtitleEn:
          'Badge, Chip, Avatar, Progress, Skeleton, Tooltip, StatCard, Native DataTable, SheetGL 120 FPS WebGL DataGrid, and FileManGL WebGL2 VFS.',
        icon: <Table2 size={15} />,
        subItems: DATA_FEEDBACK_WEBGL_GUIDES.map((g) => ({
          id: `doc-comp-${g.id}`,
          labelTr: `${g.tag} — ${g.titleTr.split(' (')[0]}`,
          labelEn: `${g.tag} — ${g.titleEn.split(' (')[0]}`,
        })),
      },
      {
        id: 'layout-shell',
        step: '5',
        badgeTr: 'BÖLÜM 5 • 5 FARKLI SIDEBAR & YERLEŞİM İSKELETİ',
        badgeEn: 'CHAPTER 5 • 5 SIDEBAR ARCHITECTURES & LAYOUT SHELL',
        titleTr: '5. 5 Farklı Sidebar Mimarisi & Kurumsal Yerleşim',
        titleEn: '5. 5 Sidebar Architectures & Enterprise Layout Shell',
        subtitleTr:
          'Stacked Vertical, Standard Accordion, Mini-Rail, Dual-Column ve Drawer (Off-Canvas) gezinme modelleri ve 8pt uzamsal ızgara sistemi.',
        subtitleEn:
          'Stacked Vertical, Standard Accordion, Mini-Rail, Dual-Column, and Drawer navigation architectures on an 8pt spatial grid.',
        icon: <Layout size={15} />,
        subItems: [
          { id: 'doc-sec-grid-classes', labelTr: 'Hazır Responsive Grid Sınıfları', labelEn: 'Responsive Grid CSS Classes' },
          { id: 'doc-sec-sidebar-code', labelTr: 'SidebarNavGroup[] Yapılandırması', labelEn: 'SidebarNavGroup[] Configuration' },
          { id: 'doc-sec-sidebar-live', labelTr: '5 Sidebar Varyantı Canlı Stüdyosu', labelEn: '5 Sidebar Variants Live Studio' },
        ],
      },
      {
        id: 'page-templates',
        step: '6',
        badgeTr: 'BÖLÜM 6 • 8 HAZIR SAYFA ŞABLONU & 14 DASHBOARD GÖRÜNÜMÜ',
        badgeEn: 'CHAPTER 6 • 8 PAGE TEMPLATES & 14 DASHBOARD VIEWS',
        titleTr: '6. Hazır Sayfa Şablonları (Login, 2FA, Pricing, Fatura, Kanban, Settings)',
        titleEn: '6. Ready-Made Page Templates (Login, 2FA, Pricing, Invoice, Kanban, Settings)',
        subtitleTr:
          'Kurumsal projelerde doğrudan kullanıma hazır 8 tam sayfa tasarımı ve 14 operasyonel Dashboard alt görünümünün dokümantasyonu ve canlı demosu.',
        subtitleEn:
          'Documentation and live interactive stage for all 8 ready-made enterprise page templates and 14 operational dashboard sub-views.',
        icon: <FileCode2 size={15} />,
        subItems: [
          {
            id: 'doc-tpl-Stage',
            labelTr: 'Login & Auth (Split-Screen + Yüzen Cam)',
            labelEn: 'Login & Auth (Split-Screen + Floating Glass)',
            onSelect: () => setDocsPageTemplate('page-login'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: 'Register, Onboarding & 6 Haneli 2FA OTP',
            labelEn: 'Register, Onboarding & 6-Digit 2FA OTP',
            onSelect: () => setDocsPageTemplate('page-register'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: 'SaaS Pricing & Koltuk Hesaplayıcı',
            labelEn: 'SaaS Pricing & Seat Calculator',
            onSelect: () => setDocsPageTemplate('page-pricing'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: 'User Profile & Geliştirici Portfolyosu',
            labelEn: 'User Profile & Developer Portfolio',
            onSelect: () => setDocsPageTemplate('page-profile'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: 'B2B e-Fatura & Kredi Kartı Checkout',
            labelEn: 'B2B e-Invoice & Credit Card Checkout',
            onSelect: () => setDocsPageTemplate('page-invoice'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: 'Kanban Sprint & Görev Panosu',
            labelEn: 'Kanban Sprint & Task Board',
            onSelect: () => setDocsPageTemplate('page-kanban'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: '404, 500 Bakım & Canlı SLA Monitörü',
            labelEn: '404, 500 Maintenance & Live SLA Monitor',
            onSelect: () => setDocsPageTemplate('page-status'),
          },
          {
            id: 'doc-tpl-Stage',
            labelTr: 'Enterprise Settings & Tercihler (Appearance, Account, Notifications)',
            labelEn: 'Enterprise Settings & Preferences (Appearance, Account, Notifications)',
            onSelect: () => setDocsPageTemplate('page-settings'),
          },
        ],
      },
      {
        id: 'theming-tokens',
        step: '7',
        badgeTr: 'BÖLÜM 7 • TEMA MOTORU, YÜZEY MATERYALLERİ & CSS TOKENLARI',
        badgeEn: 'CHAPTER 7 • THEME ENGINE, SURFACE MATERIALS & CSS TOKENS',
        titleTr: '7. Tema Motoru, Yüzey Materyalleri & CSS Tokenları',
        titleEn: '7. Theme Engine, Surface Materials & CSS Design Tokens',
        subtitleTr:
          'useTheme() kancası, 6 tohum renk paleti, 0–32px canlı Border Radius, tipografi ölçekleme ve --uxu-* CSS değişkenleri.',
        subtitleEn:
          'useTheme() hook API, 6 seed palettes, live 0–32px Border Radius, typography scaling, and --uxu-* CSS custom properties.',
        icon: <Palette size={15} />,
        subItems: [
          { id: 'doc-sec-theme-lab', labelTr: 'Canlı Tema & Radius Laboratuvarı', labelEn: 'Live Theme & Radius Lab' },
          { id: 'doc-sec-theme-tokens', labelTr: 'Aktif CSS Token Denetçisi', labelEn: 'Live CSS Token Inspector' },
          { id: 'doc-sec-fonts-icons', labelTr: 'Tipografi & Değişken İkonlar', labelEn: 'Typography & Variable Icons' },
        ],
      },
      {
        id: 'cli-shortcuts',
        step: '8',
        badgeTr: 'BÖLÜM 8 • 5 YÖNLÜ TOAST, KISAYOLLAR & SERVİSLER',
        badgeEn: 'CHAPTER 8 • 5-CORNER TOAST, SHORTCUTS & SERVICES',
        titleTr: '8. Bildirim Motoru (useToast), Kısayollar & Servis API’si',
        titleEn: '8. Notification Engine (useToast), Shortcuts & Services API',
        subtitleTr:
          '5 ekran köşesinde ve 6 semantik/glass tonda çalışan useToast(), useKeyboardShortcut(), RouteService ve tam bileşen dizini.',
        subtitleEn:
          '5-viewport multi-tone useToast() engine, useKeyboardShortcut(), RouteService URL router, and the complete component directory.',
        icon: <Bell size={15} />,
        subItems: [
          { id: 'doc-sec-toast-live', labelTr: '5 Yönlü Canlı Toast Stüdyosu', labelEn: '5-Corner Live Toast Studio' },
          { id: 'doc-sec-services-table', labelTr: 'Hooks & Core Servisler Tablosu', labelEn: 'Hooks & Core Services Reference' },
          { id: 'doc-sec-all-catalog', labelTr: 'Tüm Bileşenler Hızlı Geçiş Dizini', labelEn: 'All Components Quick Directory' },
        ],
      },
    ],
    []
  );

  const visibleChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    const q = searchQuery.toLowerCase();
    return chapters.filter(
      (ch) =>
        ch.titleTr.toLowerCase().includes(q) ||
        ch.titleEn.toLowerCase().includes(q) ||
        ch.subtitleTr.toLowerCase().includes(q) ||
        ch.subtitleEn.toLowerCase().includes(q) ||
        ch.subItems.some(
          (sub) =>
            sub.labelTr.toLowerCase().includes(q) ||
            sub.labelEn.toLowerCase().includes(q)
        )
    );
  }, [chapters, searchQuery]);

  const activeChapter =
    chapters.find((c) => c.id === currentTopic) ?? chapters[0];
  const currentIdx = chapters.findIndex((c) => c.id === activeChapter.id);
  const prevChapter = currentIdx > 0 ? chapters[currentIdx - 1] : null;
  const nextChapter =
    currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;

  const handleTopicSelect = (topic: DocsTopicId) => {
    setInternalTopic(topic);
    setActiveSubId('');
    setExpandedChapters((prev) => ({ ...prev, [topic]: true }));
    onTopicChange?.(topic);
  };

  const handleSubItemClick = (chapterId: DocsTopicId, sub: DocSubNavItem) => {
    if (currentTopic !== chapterId) {
      handleTopicSelect(chapterId);
    }
    setActiveSubId(sub.id);
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: true }));
    sub.onSelect?.();
    window.setTimeout(() => {
      const el = document.getElementById(sub.id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  const renderCodeBox = (title: string, code: string) => {
    const isCopied = copiedText === code;
    return (
      <div className="uxu-code-panel-wrapper">
        <div className="uxu-code-panel-header">
          <span>{title}</span>
          <Button
            variant="tonal"
            size="xs"
            leadingIcon={isCopied ? <Check size={13} /> : <Copy size={13} />}
            onClick={() => {
              copy(code);
              notify({
                title: isTR ? 'Kod Panoya Kopyalandı' : 'Code Copied',
                description: title,
                tone: 'success',
              });
            }}
          >
            {isCopied
              ? isTR
                ? 'Kopyalandı'
                : 'Copied'
              : isTR
              ? 'Kodu Kopyala'
              : 'Copy Code'}
          </Button>
        </div>
        <pre className="uxu-code-block">
          <code>
            {CodeGeneratorService.tokenize(code).map((tok, idx) =>
              tok.type === 'plain' ? (
                <React.Fragment key={idx}>{tok.value}</React.Fragment>
              ) : (
                <span key={idx} className={`uxu-syn-${tok.type}`}>
                  {tok.value}
                </span>
              )
            )}
          </code>
        </pre>
      </div>
    );
  };

  return (
    <div className="uxu-docs-view">
      {/* =====================================================================
       * TOP DOCUMENTATION PORTAL HEADER (SheetGL DocsPortal Header Style)
       * ===================================================================== */}
      <Card
        variant="glass"
        padding="md"
        eyebrow={
          isTR
            ? 'UXIGL KAPSAMLI DOKÜMANTASYON PORTALI (TÜM BİLEŞENLER, MOTORLAR & ŞABLONLAR)'
            : 'UXIGL COMPREHENSIVE DOCUMENTATION PORTAL (ALL COMPONENTS, ENGINES & TEMPLATES)'
        }
        title={
          isTR
            ? 'uxiGL Mimari, Bileşen & Hazır Şablon Dokümantasyonu'
            : 'uxiGL Architecture, Component & Template Documentation'
        }
        subtitle={
          isTR
            ? '8 ana bölüm, 36+ bileşen ve motor rehberi, Props API tabloları, canlı interaktif deneme alanları ve 8 hazır sayfa tasarımı.'
            : '8 chapters, 36+ component and engine guides, Props API tables, live interactive sandboxes, and 8 ready-made page templates.'
        }
        headerIcon={<BookOpen size={20} />}
        headerAction={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SegmentedControl<'tr' | 'en'>
              size="sm"
              value={lang}
              onChange={setLang}
              options={[
                { value: 'tr', label: '🇹🇷 TR' },
                { value: 'en', label: '🇬🇧 EN' },
              ]}
            />
            <Badge tone="primary" variant="tonal" pulse size="sm">
              v{__UXIGL_VERSION__}
            </Badge>
          </div>
        }
      >
        {/* Quick Top Chapter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
          }}
        >
          {chapters.map((ch) => {
            const active = ch.id === currentTopic;
            return (
              <a
                key={ch.id}
                href={`/docs/${ch.id}`}
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  handleTopicSelect(ch.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 'var(--uxu-radius-md)',
                  border: active
                    ? '1.5px solid var(--uxu-primary)'
                    : '1px solid var(--uxu-border-subtle)',
                  background: active
                    ? 'var(--uxu-primary-container)'
                    : 'var(--uxu-surface-tonal)',
                  color: active ? 'var(--uxu-primary)' : 'var(--uxu-text-primary)',
                  fontSize: '0.78rem',
                  fontWeight: active ? 700 : 600,
                  textDecoration: 'none',
                  transition: 'all 140ms ease',
                }}
              >
                {ch.icon}
                <span>{isTR ? ch.titleTr.split(' (')[0] : ch.titleEn.split(' (')[0]}</span>
              </a>
            );
          })}
        </div>
      </Card>

      {/* =====================================================================
       * SHEETGL-STYLE 2-COLUMN DOCUMENTATION PORTAL (LEFT SIDEBAR + READER)
       * ===================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 295px) minmax(0, 1fr)',
          gap: 20,
          alignItems: 'start',
        }}
        className="uxu-docs-portal-layout"
      >
        {/* LEFT SEARCHABLE DOCUMENTATION TREE SIDEBAR */}
        <Card
          variant="glass"
          padding="sm"
          style={{
            position: 'sticky',
            top: 12,
            maxHeight: 'calc(100vh - 96px)',
            overflowY: 'auto',
          }}
        >
          <div className="uxu-stack-sm">
            <Input
              placeholder={
                isTR
                  ? 'Bileşen veya konu ara (Input, SheetGL...)'
                  : 'Search components or topics...'
              }
              value={searchQuery}
              onChange={setSearchQuery}
              leadingIcon={<Search size={14} />}
              clearable
              size="sm"
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              {visibleChapters.map((sec) => {
                const isActive = sec.id === currentTopic;
                const isExpanded = Boolean(
                  expandedChapters[sec.id] || isActive || searchQuery.trim()
                );
                return (
                  <div
                    key={sec.id}
                    style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 'var(--uxu-radius-sm)',
                        border: isActive
                          ? '1px solid var(--uxu-primary)'
                          : '1px solid transparent',
                        background: isActive
                          ? 'var(--uxu-primary-container)'
                          : 'transparent',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleTopicSelect(sec.id)}
                        style={{
                          flex: 1,
                          textAlign: 'left',
                          padding: '8px 10px',
                          border: 'none',
                          background: 'transparent',
                          color: isActive
                            ? 'var(--uxu-primary)'
                            : 'var(--uxu-text-primary)',
                          fontSize: '0.8rem',
                          fontWeight: isActive ? 700 : 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          lineHeight: 1.3,
                        }}
                      >
                        <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                          {sec.icon}
                        </span>
                        <span>{isTR ? sec.titleTr : sec.titleEn}</span>
                      </button>

                      {sec.subItems.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedChapters((prev) => ({
                              ...prev,
                              [sec.id]: !prev[sec.id],
                            }));
                          }}
                          style={{
                            padding: '6px 8px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--uxu-text-secondary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                      )}
                    </div>

                    {isExpanded && sec.subItems.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          paddingLeft: 14,
                          marginLeft: 10,
                          borderLeft: '1.5px solid var(--uxu-border-subtle)',
                          marginTop: 2,
                          marginBottom: 4,
                        }}
                      >
                        {sec.subItems.map((sub, idx) => {
                          const isSubActive =
                            isActive && activeSubId === sub.id;
                          return (
                            <button
                              key={`${sub.id}-${idx}`}
                              type="button"
                              onClick={() => handleSubItemClick(sec.id, sub)}
                              style={{
                                textAlign: 'left',
                                padding: '5px 8px',
                                borderRadius: 6,
                                border: 'none',
                                background: isSubActive
                                  ? 'var(--uxu-surface-tonal)'
                                  : 'transparent',
                                color: isSubActive
                                  ? 'var(--uxu-primary)'
                                  : 'var(--uxu-text-secondary)',
                                fontSize: '0.74rem',
                                fontWeight: isSubActive ? 700 : 500,
                                cursor: 'pointer',
                                lineHeight: 1.35,
                              }}
                            >
                              {isTR ? sub.labelTr : sub.labelEn}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* RIGHT MAIN DOCUMENTATION CONTENT COLUMN */}
        <div className="uxu-stack-lg" style={{ minWidth: 0 }}>
          {/* Active Chapter Hero Banner */}
          <Card variant="glass" padding="md">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <Badge tone="primary" size="xs">
                  {isTR ? activeChapter.badgeTr : activeChapter.badgeEn}
                </Badge>
              </div>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 800, margin: 0 }}>
                {isTR ? activeChapter.titleTr : activeChapter.titleEn}
              </h2>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--uxu-text-secondary)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {isTR ? activeChapter.subtitleTr : activeChapter.subtitleEn}
              </p>
            </div>
          </Card>

          {/* =================================================================
           * CHAPTER 1: GETTING STARTED & ARCHITECTURE
           * ================================================================= */}
          {currentTopic === 'getting-started' && (
            <div className="uxu-stack-md">
              <div className="uxu-stage-grid-2" id="doc-sec-install">
                <Card
                  variant="glass"
                  title={
                    isTR
                      ? 'Adım 1 — Kurulum & Sağlayıcı (Provider) Yapılandırması'
                      : 'Step 1 — Installation & Provider Setup'
                  }
                  subtitle={
                    isTR
                      ? 'Uygulamanızı ThemeProvider ve ToastProvider ile sarmalayın'
                      : 'Wrap your application with ThemeProvider and ToastProvider'
                  }
                  headerIcon={<Terminal size={19} />}
                >
                  <div className="uxu-stack-md">
                    <p className="uxu-muted-p">
                      {isTR ? (
                        <>
                          <code>truncgil-uxigl</code>; tüm renk, köşe yuvarlaklığı
                          (<code>0px–32px</code>), yoğunluk ve cam bulanıklığı
                          değişkenlerini <code>ThemeProvider</code> üzerinden,
                          5 yönlü bildirimleri ise <code>ToastProvider</code>{' '}
                          üzerinden yönetir. <strong>SheetGL</strong> ve{' '}
                          <strong>FileManGL</strong> paketleri doğrudan dahildir.
                        </>
                      ) : (
                        <>
                          <code>truncgil-uxigl</code> manages color palettes,
                          corner geometry (<code>0px–32px</code>), density, and
                          glass blur via <code>ThemeProvider</code>, and
                          notifications via <code>ToastProvider</code>.{' '}
                          <strong>SheetGL</strong> and <strong>FileManGL</strong>{' '}
                          are bundled out of the box.
                        </>
                      )}
                    </p>
                    {renderCodeBox('Terminal — Paket Kurulumu', INSTALL_SNIPPET)}
                    {renderCodeBox(
                      'src/main.tsx — Uygulama Giriş Noktası',
                      PROVIDER_SETUP_SNIPPET
                    )}
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  title={
                    isTR
                      ? 'Adım 2 — İlk Uygulamalı Bileşeninizi Oluşturun'
                      : 'Step 2 — Build Your First Interactive Component'
                  }
                  subtitle={
                    isTR
                      ? 'Aşağıdaki canlı formu deneyin ve sağ üstten kodunu kopyalayın'
                      : 'Test the live form below and copy its full TSX code'
                  }
                  headerIcon={<Code2 size={19} />}
                >
                  <div className="uxu-stack-md" id="doc-sec-live-starter">
                    <Card
                      variant="glass"
                      glowOnHover
                      title="uxiGL Çalışma Alanına Bağlan"
                      subtitle="Canlı Önizleme: Input, Switch, Badge ve Button bir arada"
                      headerAction={
                        <Badge tone="success" pulse size="sm">
                          Canlı Örnek
                        </Badge>
                      }
                    >
                      <div className="uxu-stack-md">
                        <Input
                          label="Kurumsal E-Posta"
                          value={demoEmail}
                          onChange={setDemoEmail}
                          leadingIcon={<Mail size={16} />}
                          clearable
                        />
                        <Input
                          label="Erişim Anahtarı"
                          type="password"
                          value={demoPass}
                          onChange={setDemoPass}
                          surface="tonal"
                          leadingIcon={<Lock size={16} />}
                        />
                        <Switch
                          label="Oturumu Açık Tut ve Tema Tercihlerini Eşitle"
                          description="Tarayıcı kapandığında seçili renk paletini korur"
                          value={demoRemember}
                          onChange={setDemoRemember}
                          tone="primary"
                        />
                        <Button
                          variant="filled"
                          fullWidth
                          leadingIcon={<Sparkles size={16} />}
                          onClick={() =>
                            notify({
                              title: 'Çalışma Alanı Başlatıldı!',
                              description: `Aktif kullanıcı: ${demoEmail}`,
                              tone: 'success',
                            })
                          }
                        >
                          Çalışma Alanını Başlat (Tıkla &amp; Test Et)
                        </Button>
                      </div>
                    </Card>

                    {renderCodeBox(
                      'QuickWorkspaceCard.tsx — Tam Uygulama Kodu',
                      QUICK_START_COMPONENT_SNIPPET
                    )}
                  </div>
                </Card>
              </div>

              {/* Architectural Overview Table */}
              <Card
                variant="glass"
                padding="md"
                title={
                  isTR
                    ? 'Mimari Katmanlar & Paket İçeriği Özeti'
                    : 'Architectural Layers & Package Contents'
                }
                subtitle={
                  isTR
                    ? 'SOLID prensipleri, 8pt uzamsal ızgara ve WebGL motor entegrasyonu'
                    : 'SOLID principles, 8pt spatial grid, and WebGL engine integration'
                }
              >
                <div id="doc-sec-solid" className="uxu-props-table-scroll">
                  <table className="uxu-props-table">
                    <thead>
                      <tr>
                        <th>{isTR ? 'Katman / Modül' : 'Layer / Module'}</th>
                        <th>{isTR ? 'Kapsanan Bileşenler & Motorlar' : 'Included Components & Engines'}</th>
                        <th>{isTR ? 'Mimari Sözleşme (Contract)' : 'Architectural Contract'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">Primitives (16 Modül)</code>
                        </td>
                        <td>
                          <code>Button</code>, <code>Input</code>, <code>CurrencyInput</code>,{' '}
                          <code>DateTimePickerInput</code>, <code>MultiSelectTagInput</code>,{' '}
                          <code>FileUploadDropzone</code>, <code>Select</code>, <code>Textarea</code>,{' '}
                          <code>Switch</code>, <code>Checkbox</code>, <code>Slider</code>,{' '}
                          <code>Alert</code>, <code>Badge</code>, <code>Chip</code>,{' '}
                          <code>Avatar</code>, <code>Progress</code>, <code>Skeleton</code>,{' '}
                          <code>Tooltip</code>, <code>GoogleIcon</code>
                        </td>
                        <td>
                          <code>FormControlContract&lt;T&gt;</code>, <code>SizableProps</code>,{' '}
                          <code>DisableableProps</code>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">Composites (16 Modül)</code>
                        </td>
                        <td>
                          <code>Card</code>, <code>SegmentedControl</code>, <code>Tabs</code>,{' '}
                          <code>Accordion</code>, <code>Stepper</code>, <code>Timeline</code>,{' '}
                          <code>Modal</code>, <code>Drawer</code>, <code>CommandPalette</code>,{' '}
                          <code>Sidebar</code>, <code>TopHeader</code>, <code>StatCard</code>,{' '}
                          <code>DataTable</code>, <code>Pagination</code>
                        </td>
                        <td>
                          <code>NavigationContract</code>, <code>SurfaceVariant</code>,{' '}
                          <code>WAI-ARIA Dialog/Tab</code>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">WebGL Motorları (3 Motor)</code>
                        </td>
                        <td>
                          <code>SheetGLGridAdapter</code> (120 FPS Canvas/WebGL DataGrid),{' '}
                          <code>FileManGLExplorerAdapter</code> (WebGL2 3D VFS),{' '}
                          <code>WebGLAuroraCanvas</code> (GLSL Shader)
                        </td>
                        <td>
                          <code>Single-Active-Engine</code>, <code>IGridThemeTokens</code>,{' '}
                          <code>IFileManagerConfig</code>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">Hazır Sayfa Şablonları (7 Demo)</code>
                        </td>
                        <td>
                          <code>page-login</code>, <code>page-register</code>,{' '}
                          <code>page-pricing</code>, <code>page-profile</code>,{' '}
                          <code>page-invoice</code>, <code>page-kanban</code>,{' '}
                          <code>page-status</code>
                        </td>
                        <td>
                          <code>PageTemplatesShowcaseView</code>, <code>RouteService</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* =================================================================
           * CHAPTER 2: ALL FORM & ACTION COMPONENTS (DETAILED GUIDE CARDS)
           * ================================================================= */}
          {currentTopic === 'form-controls' && (
            <div className="uxu-stack-lg">
              {FORM_CONTROL_GUIDES.map((guide) => (
                <ComponentDocCard
                  key={guide.id}
                  guide={guide}
                  isTR={isTR}
                  onOpenPlayground={onSelectComponent}
                />
              ))}
            </div>
          )}

          {/* =================================================================
           * CHAPTER 3: ALL SURFACES, MODALS & NAVIGATION (DETAILED GUIDE CARDS)
           * ================================================================= */}
          {currentTopic === 'surfaces-navigation' && (
            <div className="uxu-stack-lg">
              {SURFACE_NAVIGATION_GUIDES.map((guide) => (
                <ComponentDocCard
                  key={guide.id}
                  guide={guide}
                  isTR={isTR}
                  onOpenPlayground={onSelectComponent}
                />
              ))}
            </div>
          )}

          {/* =================================================================
           * CHAPTER 4: DATA, FEEDBACK, SHEETGL & FILEMANGL (DETAILED GUIDE CARDS)
           * ================================================================= */}
          {currentTopic === 'data-feedback-webgl' && (
            <div className="uxu-stack-lg">
              {DATA_FEEDBACK_WEBGL_GUIDES.map((guide) => (
                <ComponentDocCard
                  key={guide.id}
                  guide={guide}
                  isTR={isTR}
                  onOpenPlayground={onSelectComponent}
                />
              ))}
            </div>
          )}

          {/* =================================================================
           * CHAPTER 5: 5 SIDEBAR ARCHITECTURES & LAYOUT SHELL
           * ================================================================= */}
          {currentTopic === 'layout-shell' && (
            <div className="uxu-stack-md">
              <div className="uxu-stage-grid-2" id="doc-sec-grid-classes">
                <Card
                  variant="glass"
                  title="Tam Ekran Dashboard İskeleti & 5 Sidebar Varyantı"
                  subtitle="100vw × 100vh ortalanmamış kurumsal yerleşim mimarisi"
                  headerIcon={<Layout size={19} />}
                >
                  <div className="uxu-stack-md">
                    <p className="uxu-muted-p">
                      uxiGL uygulama iskeleti <code>.uxu-app-frame</code>{' '}
                      kapsayıcısı içinde sol tarafta 5 farklı gezinme moduna
                      sahip <code>&lt;Sidebar /&gt;</code> ve sağ tarafta{' '}
                      <code>&lt;TopHeader /&gt;</code> +{' '}
                      <code>.uxu-workspace-viewport</code> yapısından oluşur.
                    </p>

                    <div className="uxu-inspiration-box">
                      <div className="uxu-inspiration-box__title">
                        Hazır Responsive Izgara (Grid) Sınıfları
                      </div>
                      <ul style={{ paddingLeft: 18, marginTop: 6, lineHeight: 1.7 }}>
                        <li>
                          <code>.uxu-kpi-grid</code> — Masaüstünde 4 sütun,
                          tablette 2 sütun, mobilde 1 sütun KPI kart dizilimi.
                        </li>
                        <li>
                          <code>.uxu-bento-grid</code> — 3 sütunlu esnek Bento
                          kart ızgarası.
                        </li>
                        <li>
                          <code>.uxu-stage-grid-2</code> — 2 sütunlu (%50 - %50)
                          form ve içerik ızgarası.
                        </li>
                        <li>
                          <code>.uxu-dash-chart-and-feed</code> — Sol geniş
                          grafik (1.55fr) ve sağ canlı akış (1fr) düzeni.
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  title="Sidebar Alt Menü & Breadcrumb Kurulum Kodu"
                  subtitle="SidebarNavGroup[] veri yapısı ile sınırsız alt menü tanımlama"
                  headerIcon={<Code2 size={19} />}
                >
                  <div id="doc-sec-sidebar-code">
                    {renderCodeBox(
                      'EnterpriseLayout.tsx — Sidebar & Alt Menü Yapılandırması',
                      LAYOUT_SHELL_SNIPPET
                    )}
                  </div>
                </Card>
              </div>

              <div id="doc-sec-sidebar-live">
                <SidebarShowcaseView />
              </div>
            </div>
          )}

          {/* =================================================================
           * CHAPTER 6: 8 READY-MADE PAGE TEMPLATES & 14 DASHBOARD VIEWS
           * ================================================================= */}
          {currentTopic === 'page-templates' && (
            <div className="uxu-stack-md">
              <div className="uxu-stage-grid-2">
                <Card
                  variant="glass"
                  title="8 Hazır Kurumsal Sayfa Şablonu (Liquid Glass × Dinamik Ton)"
                  subtitle="Login, Register/2FA, Pricing, Profile, B2B e-Fatura, Kanban, 404/Status ve Enterprise Settings"
                  headerIcon={<Layers size={19} />}
                >
                  <div className="uxu-stack-md">
                    <p className="uxu-muted-p">
                      <code>truncgil-uxigl</code>; kurumsal SaaS projelerinde
                      doğrudan kullanabileceğiniz{' '}
                      <strong>8 adet tam etkileşimli hazır sayfa tasarımı</strong>{' '}
                      sunar. Aşağıdaki kartlardan herhangi birine tıklayarak
                      alt kısımdaki canlı sahnede anında test edebilirsiniz.
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: 8,
                      }}
                    >
                      {(
                        [
                          {
                            id: 'page-login' as PageTemplateId,
                            title: '1. Login & Auth',
                            desc: 'Split-screen SSO, Passkey & Yüzen Cam',
                            route: '/dashboard/page-login',
                          },
                          {
                            id: 'page-register' as PageTemplateId,
                            title: '2. Register & 2FA',
                            desc: '3 adımlı kayıt, rol seçimi & 6 haneli OTP',
                            route: '/dashboard/page-register',
                          },
                          {
                            id: 'page-pricing' as PageTemplateId,
                            title: '3. SaaS Pricing',
                            desc: 'Yıllık/Aylık planlar & koltuk hesaplayıcı',
                            route: '/dashboard/page-pricing',
                          },
                          {
                            id: 'page-profile' as PageTemplateId,
                            title: '4. User Profile',
                            desc: 'Kapak, KPI şeridi, cihazlar & zaman çizelgesi',
                            route: '/dashboard/page-profile',
                          },
                          {
                            id: 'page-invoice' as PageTemplateId,
                            title: '5. B2B e-Fatura',
                            desc: 'GİB e-Fatura tablosu & canlı kart ödeme',
                            route: '/dashboard/page-invoice',
                          },
                          {
                            id: 'page-kanban' as PageTemplateId,
                            title: '6. Kanban Board',
                            desc: '4 sütunlu çevik sprint & görev panosu',
                            route: '/dashboard/page-kanban',
                          },
                          {
                            id: 'page-status' as PageTemplateId,
                            title: '7. 404 & SLA Status',
                            desc: '404, 500 bakım & 90 günlük SLA monitörü',
                            route: '/dashboard/page-status',
                          },
                          {
                            id: 'page-settings' as PageTemplateId,
                            title: '8. Enterprise Settings',
                            desc: 'Appearance, Account & Notifications (StorageService & ThemeEngine senkron)',
                            route: '/dashboard/page-settings',
                          },
                        ]
                      ).map((tpl) => {
                        const active = docsPageTemplate === tpl.id;
                        return (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => setDocsPageTemplate(tpl.id)}
                            style={{
                              textAlign: 'left',
                              padding: '10px 12px',
                              borderRadius: 'var(--uxu-radius-md)',
                              border: active
                                ? '1.5px solid var(--uxu-primary)'
                                : '1px solid var(--uxu-border-subtle)',
                              background: active
                                ? 'var(--uxu-primary-container)'
                                : 'var(--uxu-surface-tonal)',
                              color: 'var(--uxu-text-primary)',
                              cursor: 'pointer',
                              transition: 'all 140ms ease',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                              }}
                            >
                              <span>{tpl.title}</span>
                              <code
                                style={{
                                  fontSize: '0.68rem',
                                  color: 'var(--uxu-primary)',
                                }}
                              >
                                {tpl.route}
                              </code>
                            </div>
                            <div
                              style={{
                                fontSize: '0.72rem',
                                color: 'var(--uxu-text-secondary)',
                                marginTop: 2,
                              }}
                            >
                              {tpl.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  title="Hazır Sayfa Şablonlarını Projeye Dahil Etme"
                  subtitle="Tek bileşenle tüm şablonları veya bağımsız sayfa tasarımlarını kullanın"
                  headerIcon={<Code2 size={19} />}
                >
                  <div className="uxu-stack-md">
                    {renderCodeBox(
                      'PageTemplatesUsage.tsx — Hazır Şablon Kullanımı',
                      `import { useState } from 'react';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from 'truncgil-uxigl';

export function EnterprisePagesRouter() {
  const [activePage, setActivePage] = useState<PageTemplateId>('${docsPageTemplate}');

  return (
    <PageTemplatesShowcaseView
      activePageId={activePage}
      onPageChange={setActivePage}
      onNavigateHome={() => setActivePage('page-login')}
    />
  );
}`
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Button
                        variant="filled"
                        size="sm"
                        leadingIcon={<Sparkles size={14} />}
                        onClick={() => onSelectComponent?.('page-templates')}
                      >
                        Bileşen Playground &amp; Props API’sini Aç
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              <div id="doc-tpl-Stage">
                <PageTemplatesShowcaseView
                  activePageId={docsPageTemplate}
                  onPageChange={setDocsPageTemplate}
                />
              </div>
            </div>
          )}

          {/* =================================================================
           * CHAPTER 7: THEMING, APPLE HIG MATERIALS & CSS TOKENS
           * ================================================================= */}
          {currentTopic === 'theming-tokens' && (
            <div className="uxu-stack-md">
              <div className="uxu-stage-grid-2" id="doc-sec-theme-lab">
                <Card
                  variant="glass"
                  title="Canlı Tema, Renk Paleti & Boyut Ölçekleme Laboratuvarı"
                  subtitle="Buradaki değişiklikler tüm uxiGL çalışma alanına anında uygulanır"
                  headerIcon={<Palette size={19} />}
                >
                  <div className="uxu-stack-md">
                    <div>
                      <div className="uxu-field__label" style={{ marginBottom: 6 }}>
                        1. Görünüm Modu (Dark / Light / System):
                      </div>
                      <SegmentedControl<ThemeMode>
                        value={preferences.mode}
                        onChange={setMode}
                        fullWidth
                        size="sm"
                        options={[
                          { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
                          { value: 'light', label: 'Light', icon: <Sun size={14} /> },
                          { value: 'system', label: 'System', icon: <Monitor size={14} /> },
                        ]}
                      />
                    </div>

                    <div>
                      <div className="uxu-field__label" style={{ marginBottom: 6 }}>
                        2. Dinamik Tohum Renk Paleti (Seed Palette):
                      </div>
                      <div className="uxu-palette-picker-grid">
                        {availablePalettes.map((p) => {
                          const isSelected = p.id === preferences.seedPalette;
                          const preview =
                            resolvedMode === 'dark' ? p.dark : p.light;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              className={`uxu-palette-card ${
                                isSelected ? 'uxu-palette-card--selected' : ''
                              }`}
                              onClick={() => setSeedPalette(p.id)}
                            >
                              <div className="uxu-palette-card__swatches">
                                <span style={{ background: preview.primary }} />
                                <span style={{ background: preview.secondary }} />
                                <span style={{ background: preview.primaryContainer }} />
                              </div>
                              <div className="uxu-palette-card__meta">
                                <strong>{p.name}</strong>
                                <span>{p.inspiration}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="uxu-stage-grid-2">
                      <SegmentedControl<RadiusScale>
                        label={`3. Köşe Yuvarlaklığı (${
                          preferences.customRadiusPx ??
                          (preferences.radiusScale === 'sharp'
                            ? 4
                            : preferences.radiusScale === 'pill'
                            ? 22
                            : 12)
                        }px)`}
                        value={preferences.radiusScale}
                        onChange={setRadiusScale}
                        size="sm"
                        fullWidth
                        options={[
                          { value: 'sharp', label: 'Keskin' },
                          { value: 'squircle', label: 'Squircle' },
                          { value: 'pill', label: 'Kapsül' },
                        ]}
                      />
                      <SegmentedControl<UIDensity>
                        label="4. Arayüz Yoğunluğu (Density)"
                        value={preferences.density}
                        onChange={setDensity}
                        size="sm"
                        fullWidth
                        options={[
                          { value: 'compact', label: 'Kompakt' },
                          { value: 'comfortable', label: 'Standart' },
                          { value: 'spacious', label: 'Geniş' },
                        ]}
                      />
                    </div>

                    <Slider
                      label="Hassas Border Radius (0px Keskin – 32px Tam Kapsül)"
                      value={
                        preferences.customRadiusPx ??
                        (preferences.radiusScale === 'sharp'
                          ? 4
                          : preferences.radiusScale === 'pill'
                          ? 22
                          : 12)
                      }
                      min={0}
                      max={32}
                      step={1}
                      valueSuffix="px"
                      tone="info"
                      onChange={setCustomRadiusPx}
                    />

                    <Slider
                      label="5. Global Yazı Boyutu Ölçeği (Font Scale)"
                      value={Math.round((preferences.fontScale ?? 1) * 100)}
                      min={85}
                      max={115}
                      step={5}
                      showTicks
                      valueSuffix="%"
                      onChange={(val) => setFontScale(val / 100)}
                    />

                    <Slider
                      label="6. Liquid Glass Bulanıklık Yoğunluğu (Backdrop Blur)"
                      value={preferences.glassIntensity}
                      min={15}
                      max={100}
                      step={5}
                      valueSuffix="%"
                      onChange={setGlassIntensity}
                    />

                    <div
                      style={{
                        paddingTop: 10,
                        borderTop: '1px solid var(--uxu-border-subtle)',
                      }}
                    >
                      <Switch
                        size="sm"
                        label="7. WebGL Uzamsal Shader Arka Planı"
                        description="Donanım hızlandırmalı GLSL aurora katmanı"
                        value={preferences.webglEnabled ?? true}
                        onChange={setWebglEnabled}
                      />
                      {(preferences.webglEnabled ?? true) && (
                        <div className="uxu-stack-sm" style={{ marginTop: 10 }}>
                          <SegmentedControl<WebGLShaderPreset>
                            size="sm"
                            fullWidth
                            value={preferences.webglPreset ?? 'aurora-borealis'}
                            onChange={setWebglPreset}
                            options={[
                              { value: 'aurora-borealis', label: 'Aurora' },
                              { value: 'spatial-nebula', label: 'Nebula' },
                              { value: 'material-lava', label: 'Lava' },
                              { value: 'cyber-horizon', label: 'Cyber' },
                            ]}
                          />
                          <Slider
                            label="WebGL Shader Parlaklığı"
                            value={preferences.webglIntensity ?? 65}
                            min={15}
                            max={100}
                            step={5}
                            valueSuffix="%"
                            onChange={setWebglIntensity}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  title="Aktif CSS Değişkenleri & useTheme() Kodu"
                  subtitle={`Şu an aktif palet: ${activePalette.name} (${resolvedMode.toUpperCase()})`}
                  headerIcon={<Code2 size={19} />}
                >
                  <div className="uxu-stack-md" id="doc-sec-theme-tokens">
                    <div className="uxu-token-swatch-list">
                      {[
                        { varName: '--uxu-primary', val: activeColorSet.primary, label: 'Primary Accent' },
                        { varName: '--uxu-primary-container', val: activeColorSet.primaryContainer, label: 'Primary Tonal Container' },
                        { varName: '--uxu-secondary', val: activeColorSet.secondary, label: 'Secondary Accent' },
                        { varName: '--uxu-accent-glow', val: activeColorSet.accentGlow, label: 'Accent Glow' },
                        { varName: '--uxu-bg-canvas', val: activeColorSet.bgCanvas, label: 'Canvas Background' },
                        { varName: '--uxu-bg-elevated', val: activeColorSet.surfaceElevated, label: 'Elevated Card Surface' },
                      ].map((t) => (
                        <div key={t.varName} className="uxu-token-swatch-item">
                          <span
                            className="uxu-token-swatch-color"
                            style={{ background: t.val }}
                          />
                          <div className="uxu-token-swatch-info">
                            <code>{t.varName}</code>
                            <span>{t.label}</span>
                          </div>
                          <code className="uxu-token-swatch-hex">{t.val}</code>
                        </div>
                      ))}
                    </div>

                    {renderCodeBox(
                      'ThemeSwitcherBar.tsx — useTheme() Kullanımı',
                      THEME_HOOK_SNIPPET
                    )}
                  </div>
                </Card>
              </div>

              {/* Typography & Variable Font Icons Card */}
              <Card
                variant="glass"
                padding="md"
                eyebrow="TYPOGRAPHY & VARIABLE FONT ICONS"
                title="Tipografi Aileleri & Değişken Vektör Font İkonları"
                subtitle="5 hazır yazı tipi kombinasyonu ve değişken eksenli (FILL, wght, Rounded/Outlined/Sharp) GoogleIcon bileşeni"
              >
                <div className="uxu-stage-grid-2" id="doc-sec-fonts-icons">
                  <div className="uxu-stack-md">
                    <div className="uxu-field__label">
                      1. Yazı Tipi Ailesi Seçin (Anında Uygulanır):
                    </div>
                    <div className="uxu-stack-sm">
                      {availableFontPresets.map((fp) => {
                        const isSelected =
                          (preferences.fontFamilyPreset ?? 'inter-jakarta') ===
                          fp.id;
                        return (
                          <button
                            key={fp.id}
                            type="button"
                            onClick={() =>
                              setFontFamilyPreset(fp.id as FontFamilyPreset)
                            }
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderRadius: 'var(--uxu-radius-md)',
                              border: isSelected
                                ? '1.5px solid var(--uxu-primary)'
                                : '1px solid var(--uxu-border-subtle)',
                              background: isSelected
                                ? 'var(--uxu-primary-container)'
                                : 'var(--uxu-surface-tonal)',
                              color: 'var(--uxu-text-primary)',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.88rem' }}>
                                {fp.name}
                              </strong>
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--uxu-text-secondary)',
                                }}
                              >
                                {fp.badge} — {fp.description}
                              </div>
                            </div>
                            <Badge
                              tone={isSelected ? 'primary' : 'neutral'}
                              size="xs"
                            >
                              {isSelected ? 'Aktif' : 'Seç'}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="uxu-stack-md">
                    <div className="uxu-field__label">
                      2. Değişken Vektör İkon Stil &amp; Eksen Kontrolleri:
                    </div>
                    <SegmentedControl<GoogleIconStyle>
                      size="sm"
                      fullWidth
                      value={preferences.iconStyle ?? 'rounded'}
                      onChange={setIconStyle}
                      options={[
                        { value: 'rounded', label: 'Rounded' },
                        { value: 'outlined', label: 'Outlined' },
                        { value: 'sharp', label: 'Sharp' },
                      ]}
                    />

                    <Switch
                      size="sm"
                      label="İkon İç Dolgusu (FILL: 1)"
                      description="Değişken font ikonlarının FILL eksenini 0 ve 1 arasında değiştirir"
                      value={preferences.iconFilled ?? false}
                      onChange={setIconFilled}
                    />

                    <Slider
                      label="İkon Çizgi Kalınlığı (wght)"
                      value={preferences.iconWeight ?? 400}
                      min={200}
                      max={700}
                      step={100}
                      showTicks
                      onChange={(w) =>
                        setIconWeight(
                          w as 100 | 200 | 300 | 400 | 500 | 600 | 700
                        )
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* =================================================================
           * CHAPTER 8: 5-CORNER TOAST ENGINE, SHORTCUTS & SERVICES
           * ================================================================= */}
          {currentTopic === 'cli-shortcuts' && (
            <div className="uxu-stack-md">
              <div className="uxu-stage-grid-2" id="doc-sec-toast-live">
                <Card
                  variant="glass"
                  title="5 Yönlü Bildirim (useToast) & Spotlight (⌘K) Test Sahnesi"
                  subtitle="5 ekran köşesinde ve 6 semantik/glass tonda bildirimleri canlı tetikleyin"
                  headerIcon={<Bell size={19} />}
                >
                  <div className="uxu-stack-md">
                    <div className="uxu-field__label">
                      1. Bildirim Ekran Yönü Seçin (placement):
                    </div>
                    <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 6 }}>
                      {(
                        [
                          { id: 'top-left', label: '↖ Sol Üst' },
                          { id: 'top-center', label: '↑ Üst Orta' },
                          { id: 'top-right', label: '↗ Sağ Üst' },
                          { id: 'bottom-left', label: '↙ Sol Alt' },
                          { id: 'bottom-right', label: '↘ Sağ Alt' },
                        ] as Array<{ id: ToastPlacement; label: string }>
                      ).map((pos) => (
                        <Button
                          key={pos.id}
                          variant={toastPlacement === pos.id ? 'filled' : 'tonal'}
                          size="xs"
                          onClick={() => setToastPlacement(pos.id)}
                        >
                          {pos.label}
                        </Button>
                      ))}
                    </div>

                    <div className="uxu-field__label">
                      2. Bildirim Tonlarını Canlı Tetikleyin (tone):
                    </div>
                    <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 6 }}>
                      {(
                        [
                          { tone: 'primary', label: 'Primary', variant: 'filled' as const },
                          { tone: 'success', label: 'Success', variant: 'success' as const },
                          { tone: 'warning', label: 'Warning', variant: 'warning' as const },
                          { tone: 'danger', label: 'Danger', variant: 'danger' as const },
                          { tone: 'info', label: 'Info', variant: 'tonal' as const },
                          { tone: 'glass', label: 'Liquid Glass', variant: 'glass' as const },
                        ] as Array<{
                          tone: ToastTone;
                          label: string;
                          variant: 'filled' | 'success' | 'warning' | 'danger' | 'tonal' | 'glass';
                        }>
                      ).map((t) => (
                        <Button
                          key={t.tone}
                          variant={t.variant}
                          size="sm"
                          onClick={() =>
                            notify({
                              title: `${t.label} Bildirimi`,
                              description: `Konum: ${toastPlacement} • Otomatik geri sayım aktif.`,
                              tone: t.tone,
                              placement: toastPlacement,
                            })
                          }
                        >
                          {t.label} Toast
                        </Button>
                      ))}
                    </div>

                    <div className="uxu-stage-divider" />

                    <div className="uxu-field__label">
                      3. Global Spotlight Komut Paleti (⌘K / Ctrl+K):
                    </div>
                    <div>
                      <Button
                        variant="glass"
                        leadingIcon={<Search size={16} />}
                        onClick={onOpenCommandPalette}
                      >
                        Spotlight Komut Paletini Şimdi Aç (⌘K)
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  title="useToast() & useKeyboardShortcut() Kod Örneği"
                  subtitle="Herhangi bir bileşenden bildirim gönderme ve kısayol dinleme"
                  headerIcon={<Code2 size={19} />}
                >
                  {renderCodeBox(
                    'NotificationAndShortcutDemo.tsx',
                    TOAST_CMD_SNIPPET
                  )}
                </Card>
              </div>

              {/* Hooks & Core Services Reference Table */}
              <Card
                variant="glass"
                padding="md"
                title="Kancalar (Hooks) & Çekirdek Servisler API Referansı"
                subtitle="truncgil-uxigl tarafından dışa aktarılan tüm yardımcı kanca ve servisler"
              >
                <div id="doc-sec-services-table" className="uxu-props-table-scroll">
                  <table className="uxu-props-table">
                    <thead>
                      <tr>
                        <th>Kanca / Servis</th>
                        <th>İmza / Metodlar</th>
                        <th>Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">useTheme()</code>
                        </td>
                        <td>
                          <code>
                            resolvedMode, preferences, setMode, toggleMode,
                            setSeedPalette, setRadiusScale, setCustomRadiusPx,
                            setFontScale
                          </code>
                        </td>
                        <td>
                          Aktif renk paletini, Dark/Light modunu, 0–32px köşe
                          yarıçapını ve tipografi ölçeğini okur ve günceller.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">useToast()</code>
                        </td>
                        <td>
                          <code>
                            notify(&#123; title, description, tone, placement,
                            durationMs, actionLabel, onAction &#125;), dismiss(id),
                            clearAll()
                          </code>
                        </td>
                        <td>
                          Ekranın 5 farklı köşesinde ve 6 semantik/glass tonda
                          bildirim tetikler.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">useKeyboardShortcut()</code>
                        </td>
                        <td>
                          <code>
                            useKeyboardShortcut(key, callback, &#123; metaOrCtrl,
                            shift, alt &#125;)
                          </code>
                        </td>
                        <td>
                          Input/Textarea odaklarını ezmeden güvenli global klavye
                          kısayolları tanımlar.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">useCopyToClipboard()</code>
                        </td>
                        <td>
                          <code>const &#123; copiedText, copy &#125; = useCopyToClipboard()</code>
                        </td>
                        <td>
                          Panoya metin/kod kopyalar ve 2 saniyelik onay durumu
                          döndürür.
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code className="uxu-prop-name">RouteService</code>
                        </td>
                        <td>
                          <code>
                            buildPath(sectionId, subId), parsePath(pathname),
                            buildComponentPath(id)
                          </code>
                        </td>
                        <td>
                          HTML5 History API (`pushState` / `popstate`) tabanlı
                          temiz URL yönlendiricisi.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* =================================================================
           * BOTTOM PREV / NEXT CHAPTER NAVIGATION (SheetGL DocsPortal Style)
           * ================================================================= */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid var(--uxu-border-subtle)',
            }}
          >
            {prevChapter ? (
              <Button
                variant="tonal"
                onClick={() => handleTopicSelect(prevChapter.id)}
              >
                ← {isTR ? prevChapter.titleTr : prevChapter.titleEn}
              </Button>
            ) : (
              <div />
            )}

            {nextChapter && (
              <Button
                variant="filled"
                onClick={() => handleTopicSelect(nextChapter.id)}
              >
                {isTR ? nextChapter.titleTr : nextChapter.titleEn} →
              </Button>
            )}
          </div>

          {/* =================================================================
           * ALL COMPONENTS INTERACTIVE DIRECTORY (QUICK JUMP CARDS)
           * ================================================================= */}
          <div id="doc-sec-all-catalog">
            <Card
              variant="glass"
              padding="md"
              eyebrow="BİLEŞEN KATALOĞU & PLAYGROUND DİZİNİ"
              title={
                isTR
                  ? 'Bileşen Laboratuvarına (Playground) Hızlı Geçiş'
                  : 'Quick Jump to Component Playground'
              }
              subtitle={
                isTR
                  ? 'Herhangi bir bileşene tıklayarak tam ekran canlı Prop Denetçisi ve Playground sayfasını açın.'
                  : 'Click any component to open its full-screen interactive Prop Inspector and Playground.'
              }
              headerIcon={<Layers size={19} />}
            >
              <div className="uxu-comp-directory-grid">
                {COMPONENT_CATALOG.map((comp) => {
                  const compHref = RouteService.buildComponentPath(comp.id);
                  return (
                    <a
                      key={comp.id}
                      href={compHref}
                      title={compHref}
                      className="uxu-comp-dir-card"
                      onClick={(e) => {
                        if (RouteService.isModifiedClick(e)) return;
                        e.preventDefault();
                        onSelectComponent?.(comp.id);
                      }}
                    >
                      <div className="uxu-comp-dir-card__top">
                        <strong>{comp.name}</strong>
                        <ArrowRight size={14} className="uxu-comp-dir-card__arrow" />
                      </div>
                      <span className="uxu-comp-dir-card__tr">
                        {comp.turkishTitle}
                      </span>
                      <p className="uxu-comp-dir-card__desc">{comp.summary}</p>
                      <div className="uxu-comp-dir-card__footer">
                        <code>{compHref}</code>
                        <span>
                          {comp.propsTable.length} Prop • {comp.examples.length} Örnek
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
