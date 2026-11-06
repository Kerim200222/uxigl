import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Code2,
  Sliders,
  BookOpen,
  Layers,
  ShieldCheck,
  Send,
  Search,
  Bell,
  Volume2,
  Sun,
  Zap,
  Terminal,
  Cpu,
  Globe,
  Lock,
  CheckCircle2,
  XCircle,
  Keyboard,
  Filter,
  Download,
  Plus,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  Building2,
  Phone,
  Share2,
  FileSpreadsheet,
  Archive,
} from 'lucide-react';
import {
  COMPONENT_CATALOG,
  type ComponentCatalogEntry,
} from '../catalog/componentCatalog';
import { SidebarShowcaseView } from '../showcase/SidebarShowcaseView';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from '../showcase/PageTemplatesShowcaseView';
import {
  Button,
  type ButtonVariant,
  Input,
  type InputSurfaceStyle,
  type InputMaskPreset,
  type InputValidationState,
  CurrencyInput,
  type CurrencyCode,
  DateTimePickerInput,
  MultiSelectTagInput,
  FileUploadDropzone,
  type UploadedFileItem,
  Select,
  Textarea,
  Alert,
  Switch,
  Slider,
  Badge,
  Chip,
  Avatar,
  AvatarGroup,
  Progress,
  Tooltip,
  Skeleton,
  Checkbox,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  Tabs,
  Accordion,
  Modal,
  type ModalVariant,
  Drawer,
  type DrawerPlacement,
  Stepper,
  Timeline,
  Pagination,
  StatCard,
  DataTable,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
  type NativeTableVariant,
} from '../../components/composites';
import type {
  ComponentSize,
  SemanticTone,
  SurfaceVariant,
} from '../../core/contracts/ComponentContracts';
import type {
  ToastPlacement,
  ToastTone,
} from '../../core/contracts/NotificationContract';
import type { RadiusScale } from '../../core/contracts/ThemeContract';
import { CodeGeneratorService } from '../../core/services/CodeGeneratorService';
import { RouteService } from '../../core/services/RouteService';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';

export interface InteractivePlaygroundProps {
  selectedComponentId: string;
  onSelectComponent: (id: string) => void;
  onOpenCommandPalette: () => void;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  selectedComponentId,
  onSelectComponent,
  onOpenCommandPalette,
}) => {
  const { preferences, setRadiusScale, setCustomRadiusPx } = useTheme();
  const { notify } = useToast();
  const { copiedText, copy } = useCopyToClipboard();

  const currentRadiusPx =
    typeof preferences.customRadiusPx === 'number'
      ? preferences.customRadiusPx
      : preferences.radiusScale === 'sharp'
      ? 4
      : preferences.radiusScale === 'pill'
      ? 22
      : 12;

  // Shared live playground controls
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('filled');
  const [buttonMode, setButtonMode] = useState<
    'standard' | 'switch-toggle' | 'collapse-expand' | 'split' | 'icon-only'
  >('standard');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    autoSync: true,
    liveWebhook: false,
    auditTrail: true,
    zeroTrust: true,
  });
  const [collapseExpanded, setCollapseExpanded] = useState<boolean>(true);

  const [controlSize, setControlSize] = useState<ComponentSize>('md');
  const [semanticTone, setSemanticTone] = useState<SemanticTone>('primary');
  const [surfaceVariant, setSurfaceVariant] = useState<SurfaceVariant>('glass');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPill, setIsPill] = useState(false);

  // Component interactive states
  const [inputValue, setInputValue] = useState('uxi@design.system');
  const [inputSurface, setInputSurface] = useState<InputSurfaceStyle>('glass');
  const [inputError, setInputError] = useState(false);
  const [inputValidation, setInputValidation] =
    useState<InputValidationState>('default');
  const [inputMaskPreset, setInputMaskPreset] = useState<
    'none' | InputMaskPreset
  >('none');

  // Enterprise Input Showcase states
  const [phoneVal, setPhoneVal] = useState('+90 (532) 480 19 23');
  const [ibanVal, setIbanVal] = useState(
    'TR33 0006 1005 1978 6457 8413 26'
  );
  const [taxIdVal, setTaxIdVal] = useState('8940284910');
  const [cardVal, setCardVal] = useState('4543 6012 8941 0098');
  const [secretKeyVal, setSecretKeyVal] = useState('uxigl_live_98a4f2c1b7e');
  const [subdomainVal, setSubdomainVal] = useState('kurumsal-erp');
  const [currencyAmount, setCurrencyAmount] = useState<number>(148500);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('TRY');
  const [invoiceDate, setInvoiceDate] = useState('2026-10-25');
  const [invoiceTime, setInvoiceTime] = useState('14:30');
  const [selectedEnterpriseTags, setSelectedEnterpriseTags] = useState<
    string[]
  >(['B2B Kurumsal', 'e-Fatura Mükellefi', 'Öncelikli SLA']);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([
    {
      id: 'f-1',
      name: 'B2B_Tedarikci_Sozlesmesi_2026.pdf',
      sizeKb: 1480,
      type: 'pdf',
      status: 'completed',
      progress: 100,
    },
    {
      id: 'f-2',
      name: 'Ekim_Mutabakat_Tablosu.xlsx',
      sizeKb: 428,
      type: 'doc',
      status: 'completed',
      progress: 100,
    },
  ]);

  // Modal, Alert & Toast interactive states
  const [toastPlacement, setToastPlacement] =
    useState<ToastPlacement>('bottom-right');
  const [toastTone, setToastTone] = useState<ToastTone>('primary');
  const [modalVariant, setModalVariant] = useState<ModalVariant>('default');

  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [sliderValue, setSliderValue] = useState(72);
  const [showSliderTicks, setShowSliderTicks] = useState(true);

  const [segmentValue, setSegmentValue] = useState<
    'spatial' | 'tonal' | 'adaptive'
  >('spatial');
  const [activeTabId, setActiveTabId] = useState('overview');
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Liquid Glass',
    'Material Design 3',
  ]);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoDrawerOpen, setDemoDrawerOpen] = useState(false);
  const [drawerPlacement, setDrawerPlacement] =
    useState<DrawerPlacement>('right');
  const [selectedBankCode, setSelectedBankCode] = useState('garanti-bbva');
  const [invoiceNotes, setInvoiceNotes] = useState(
    'Kurumsal B2B mutabakat kapsamında %20 KDV dahil e-Fatura düzenlenmiştir.'
  );
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [tablePage, setTablePage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(10);
  const [playgroundTableVariant, setPlaygroundTableVariant] =
    useState<NativeTableVariant>('default');
  const [animDurationSec, setAnimDurationSec] = useState<number>(3.2);
  const [skeletonAnimated, setSkeletonAnimated] = useState<boolean>(true);
  const [playgroundPageId, setPlaygroundPageId] =
    useState<PageTemplateId>('page-login');

  const activeEntry: ComponentCatalogEntry =
    COMPONENT_CATALOG.find((c) => c.id === selectedComponentId) ??
    COMPONENT_CATALOG[0];

  const toggleChip = (tag: string) => {
    setSelectedChips((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Generate dynamic TSX snippet based on current component & prop selections
  const generatedCode = React.useMemo(() => {
    switch (activeEntry.id) {
      case 'button':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Button',
          importPath: activeEntry.importPath,
          props: {
            variant: btnVariant,
            size: controlSize,
            pill: isPill || undefined,
            toggleable: buttonMode === 'switch-toggle' ? true : undefined,
            pressed:
              buttonMode === 'switch-toggle'
                ? toggleStates.autoSync
                : undefined,
            statusDot: buttonMode === 'switch-toggle' ? true : undefined,
            collapsible: buttonMode === 'collapse-expand' ? true : undefined,
            expanded:
              buttonMode === 'collapse-expand' ? collapseExpanded : undefined,
            splitAction: buttonMode === 'split' ? true : undefined,
            iconOnly: buttonMode === 'icon-only' ? true : undefined,
            loading: isLoading || undefined,
            disabled: isDisabled || undefined,
          },
          childrenCode:
            buttonMode === 'icon-only'
              ? '<Sparkles size={16} />'
              : buttonMode === 'switch-toggle'
              ? 'Canlı Senkronizasyon'
              : buttonMode === 'collapse-expand'
              ? 'Gelişmiş Filtreleri Göster'
              : 'uxiGL Eylemi Başlat',
        });
      case 'input':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Input',
          importPath: activeEntry.importPath,
          props: {
            label:
              inputMaskPreset === 'iban'
                ? 'Kurumsal TR IBAN'
                : inputMaskPreset === 'phone'
                ? 'Kurumsal Telefon'
                : 'Kurumsal E-Posta',
            value:
              inputMaskPreset === 'iban'
                ? ibanVal
                : inputMaskPreset === 'phone'
                ? phoneVal
                : inputValue,
            surface: inputSurface,
            size: controlSize,
            mask: inputMaskPreset !== 'none' ? inputMaskPreset : undefined,
            validationState:
              inputValidation !== 'default' ? inputValidation : undefined,
            clearable: true,
            shortcutHint: '⌘K',
            errorText:
              inputError || inputValidation === 'error'
                ? 'Geçerli bir değer giriniz'
                : undefined,
            disabled: isDisabled || undefined,
          },
        });
      case 'modal-command':
        return `import { Modal, Alert, useToast } from '@uxigl/ui';

const { notify } = useToast();

// 5 Yönlü & 6 Tonlu Canlı Toast Bildirimi
notify({
  title: 'Fatura #INV-2026-842 Onaylandı',
  description: 'Muhasebe fişi ERP sistemine başarıyla işlendi.',
  tone: '${toastTone}',
  placement: '${toastPlacement}',
  durationMs: 4200,
});`;
      case 'switch':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Switch',
          importPath: activeEntry.importPath,
          props: {
            label: 'Uzamsal Cam Efektleri',
            value: switchChecked,
            tone: semanticTone,
            size: controlSize,
            showThumbIcon: true,
            disabled: isDisabled || undefined,
          },
        });
      case 'checkbox':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Checkbox',
          importPath: activeEntry.importPath,
          props: {
            label: 'Tüm İzinleri Onayla',
            value: checkboxChecked,
            tone: semanticTone,
            size: controlSize,
            disabled: isDisabled || undefined,
          },
        });
      case 'slider':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Slider',
          importPath: activeEntry.importPath,
          props: {
            label: 'Akustik Uzamsal Derinlik',
            value: sliderValue,
            min: 0,
            max: 100,
            step: 5,
            tone: semanticTone,
            valueSuffix: '%',
            showTicks: showSliderTicks,
            disabled: isDisabled || undefined,
          },
        });
      case 'segmented-control':
        return CodeGeneratorService.generateSnippet({
          componentName: 'SegmentedControl',
          importPath: activeEntry.importPath,
          props: {
            label: 'Görünüm Modu Seçici',
            value: segmentValue,
            size: controlSize,
            fullWidth: true,
            disabled: isDisabled || undefined,
          },
        });
      case 'chips-badges':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Chip',
          importPath: activeEntry.importPath,
          props: {
            tone: semanticTone,
            size: controlSize,
            pill: isPill || undefined,
            selected: true,
            disabled: isDisabled || undefined,
          },
          childrenCode: 'Liquid Glass & Dinamik Ton',
        });
      case 'progress-avatar':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Progress',
          importPath: activeEntry.importPath,
          props: {
            variant: 'circular',
            value: sliderValue,
            tone: semanticTone,
            size: controlSize,
            indeterminate: isLoading || undefined,
            speed: animDurationSec,
          },
        });
      case 'tabs-accordion':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Tabs',
          importPath: activeEntry.importPath,
          props: {
            activeId: activeTabId,
            variant: isPill ? 'pill' : 'underline',
            size: controlSize,
          },
        });
      case 'sidebar':
        return `// 1. Dikey İkon-Etiket Yığınlı Menü
<Sidebar
  variant="stacked-vertical"
  accentColor="#F59E0B"
  groups={navGroups}
  activeItemId="dashboard"
  activeSubItemId="overview"
  onSelect={(itemId, subId) => handleSelect(itemId, subId)}
/>

// 2. Standart Açık Hiyerarşik Menü
// <Sidebar variant="standard" collapsed={false} ... />

// 3. Kompakt Kapalı Ray Menü
// <Sidebar variant="mini-rail" collapsed={true} ... />

// 4. Çift Kolonlu Menü (Master-Detail)
// <Sidebar variant="dual-column" ... />

// 5. Tam Kapalı Çekmece Menü (Off-Canvas)
// <Sidebar variant="drawer" drawerOpen={open} onCloseDrawer={() => setOpen(false)} ... />`;
      case 'card':
        return CodeGeneratorService.generateSnippet({
          componentName: 'Card',
          importPath: activeEntry.importPath,
          props: {
            variant: surfaceVariant,
            padding:
              controlSize === 'xs' || controlSize === 'sm'
                ? 'sm'
                : controlSize === 'lg'
                ? 'lg'
                : 'md',
            title: 'Frankfurt M4 Ultra Node',
            subtitle: 'Liquid Glass × Dinamik Tonal Yüzey',
            interactive: true,
            glowOnHover: true,
          },
          childrenCode: '<p>Yüzey içeriği buraya yerleşir</p>',
        });
      case 'datatable-statcard':
        return CodeGeneratorService.generateSnippet({
          componentName: 'DataTable',
          importPath: activeEntry.importPath,
          props: {
            rowKey: 'id',
            variant: playgroundTableVariant,
            size:
              controlSize === 'xs' || controlSize === 'sm'
                ? 'sm'
                : controlSize === 'lg'
                ? 'lg'
                : 'md',
            selectable: true,
          },
        });
      case 'filemangl-explorer':
        return `import { FileManGL, I18nProvider, DEFAULT_FILE_MANAGER_CONFIG } from 'filemangl';
import 'filemangl/style.css';

export function CloudFileManagerExample() {
  return (
    <I18nProvider locale="tr" onLocaleChange={() => {}}>
      <FileManGL
        config={{
          ...DEFAULT_FILE_MANAGER_CONFIG,
          theme: 'dark',
          defaultViewMode: 'grid',
          enableDualPane: false,
          enableWebGLAcceleration: true,
        }}
      />
    </I18nProvider>
  );
}`;
      default:
        return CodeGeneratorService.generateSnippet({
          componentName: activeEntry.name.split(',')[0].split(' ')[0],
          importPath: activeEntry.importPath,
          props: {
            size: controlSize,
            tone: semanticTone,
          },
        });
    }
  }, [
    activeEntry,
    btnVariant,
    buttonMode,
    toggleStates.autoSync,
    collapseExpanded,
    controlSize,
    isPill,
    isLoading,
    isDisabled,
    inputValue,
    ibanVal,
    phoneVal,
    inputSurface,
    inputError,
    inputValidation,
    inputMaskPreset,
    toastTone,
    toastPlacement,
    switchChecked,
    checkboxChecked,
    semanticTone,
    sliderValue,
    showSliderTicks,
    surfaceVariant,
    segmentValue,
    activeTabId,
    animDurationSec,
    playgroundTableVariant,
  ]);

  const renderLiveStage = (entryId: string) => {
    switch (entryId) {
      case 'button':
        return (
          <div className="uxu-stage-showcase">
            {/* 1. Primary Live Demo (Driven by Prop Inspector & Button Mode) */}
            <div className="uxu-stage-primary-demo" style={{ gap: 12, flexWrap: 'wrap' }}>
              {buttonMode === 'standard' && (
                <Button
                  variant={btnVariant}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  loading={isLoading}
                  loadingText="İşleniyor..."
                  leadingIcon={<Sparkles size={16} />}
                  onClick={() =>
                    notify({
                      title: 'Standart Buton Etkileşimi',
                      description: `Varyant: ${btnVariant} • Boyut: ${controlSize}`,
                      tone: 'primary',
                    })
                  }
                >
                  uxiGL Eylemi Başlat
                </Button>
              )}

              {buttonMode === 'switch-toggle' && (
                <Button
                  variant={btnVariant}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  loading={isLoading}
                  toggleable
                  statusDot
                  pressed={toggleStates.autoSync}
                  leadingIcon={<RefreshCw size={15} />}
                  onToggle={(next) => {
                    setToggleStates((prev) => ({ ...prev, autoSync: next }));
                    notify({
                      title: next
                        ? 'Canlı Senkronizasyon Açıldı'
                        : 'Canlı Senkronizasyon Duraklatıldı',
                      description: `aria-pressed="${String(next)}" olarak güncellendi.`,
                      tone: next ? 'success' : 'warning',
                    });
                  }}
                >
                  Canlı ERP Senkronizasyonu ({toggleStates.autoSync ? 'Açık' : 'Kapalı'})
                </Button>
              )}

              {buttonMode === 'collapse-expand' && (
                <Button
                  variant={btnVariant}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  loading={isLoading}
                  collapsible
                  expanded={collapseExpanded}
                  badgeCount={4}
                  leadingIcon={<Filter size={15} />}
                  onExpandChange={(next) => setCollapseExpanded(next)}
                >
                  {collapseExpanded
                    ? 'Gelişmiş Filtre Panelini Daralt'
                    : 'Gelişmiş Filtre Panelini Genişlet'}
                </Button>
              )}

              {buttonMode === 'split' && (
                <Button
                  variant={btnVariant}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  loading={isLoading}
                  leadingIcon={<Download size={15} />}
                  splitAction
                  splitItems={[
                    {
                      id: 'xlsx',
                      label: 'Excel (.xlsx) Olarak İndir',
                      icon: <FileSpreadsheet size={14} />,
                      onClick: () =>
                        notify({
                          title: 'Excel Raporu Hazırlanıyor',
                          description: 'Finansal mutabakat tablosu dışa aktarılıyor.',
                          tone: 'success',
                        }),
                    },
                    {
                      id: 'csv',
                      label: 'CSV Veri Akışı İndir',
                      icon: <Download size={14} />,
                      onClick: () =>
                        notify({
                          title: 'CSV İndirildi',
                          description: 'UTF-8 BOM formatında kaydedildi.',
                          tone: 'info',
                        }),
                    },
                    {
                      id: 'archive',
                      label: 'Şifreli ZIP Arşivi Oluştur',
                      icon: <Archive size={14} />,
                      onClick: () =>
                        notify({
                          title: 'ZIP Arşivi Oluşturuldu',
                          description: 'AES-256 korumalı paket hazır.',
                          tone: 'primary',
                        }),
                    },
                  ]}
                  onClick={() =>
                    notify({
                      title: 'Varsayılan Rapor İndirildi',
                      description: 'Ana aksiyon tetiklendi (Split Button).',
                      tone: 'primary',
                    })
                  }
                >
                  Finansal Raporu Dışa Aktar
                </Button>
              )}

              {buttonMode === 'icon-only' && (
                <div className="uxu-stage-row">
                  {(['xs', 'sm', 'md', 'lg'] as ComponentSize[]).map((sz) => (
                    <Tooltip key={sz} content={`Icon-Only (${sz.toUpperCase()})`}>
                      <Button
                        variant={btnVariant}
                        size={sz}
                        pill={isPill}
                        disabled={isDisabled}
                        loading={isLoading}
                        iconOnly
                        aria-label={`Hızlı Eylem ${sz}`}
                        onClick={() =>
                          notify({
                            title: `Icon-Only Buton (${sz.toUpperCase()})`,
                            description: 'Kompakt araç çubuğu aksiyonu çalıştı.',
                            tone: 'info',
                          })
                        }
                      >
                        <Sparkles size={sz === 'xs' ? 13 : sz === 'lg' ? 19 : 16} />
                      </Button>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>

            <div className="uxu-stage-divider" />

            {/* 2. Surface & Semantic Variants Matrix */}
            <div className="uxu-stage-matrix-label">
              Tüm Yüzey & Semantik Varyantlar (Tıklayarak Aktif Varyantı Seçin)
            </div>
            <div className="uxu-stage-row">
              {(
                [
                  'filled',
                  'tonal',
                  'glass',
                  'outlined',
                  'ghost',
                  'success',
                  'warning',
                  'danger',
                ] as ButtonVariant[]
              ).map((v) => (
                <Button
                  key={v}
                  variant={v}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  loading={isLoading}
                  onClick={() => setBtnVariant(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>

            <div className="uxu-stage-divider" />

            {/* 3. Rich Button Variations Showcase Grid */}
            <div className="uxu-stage-grid-2">
              {/* Switch / Toggle Buttons */}
              <Card
                variant="tonal"
                padding="md"
                title="1. Switch (Toggle) Butonlar"
                subtitle="aria-pressed, canlı durum noktası (statusDot) ve çoklu filtre seçimi"
              >
                <div className="uxu-stage-row">
                  <Button
                    variant="glass"
                    size={controlSize}
                    pill={isPill}
                    disabled={isDisabled}
                    toggleable
                    statusDot
                    pressed={toggleStates.autoSync}
                    leadingIcon={<RefreshCw size={14} />}
                    onToggle={(next) =>
                      setToggleStates((prev) => ({ ...prev, autoSync: next }))
                    }
                  >
                    Otomatik Eşitleme
                  </Button>
                  <Button
                    variant="tonal"
                    size={controlSize}
                    pill={isPill}
                    disabled={isDisabled}
                    toggleable
                    statusDot
                    pressed={toggleStates.liveWebhook}
                    leadingIcon={<Zap size={14} />}
                    onToggle={(next) =>
                      setToggleStates((prev) => ({ ...prev, liveWebhook: next }))
                    }
                  >
                    Webhook Akışı
                  </Button>
                  <Button
                    variant="outlined"
                    size={controlSize}
                    pill={isPill}
                    disabled={isDisabled}
                    toggleable
                    statusDot
                    pressed={toggleStates.zeroTrust}
                    leadingIcon={<ShieldCheck size={14} />}
                    onToggle={(next) =>
                      setToggleStates((prev) => ({ ...prev, zeroTrust: next }))
                    }
                  >
                    Zero-Trust Kalkanı
                  </Button>
                </div>
              </Card>

              {/* Collapse / Expand Action Button */}
              <Card
                variant="tonal"
                padding="md"
                title="2. Collapse / Expand Aksiyon Butonları"
                subtitle="Dönen chevron ikonu, aria-expanded ve açılır/kapanır detay yüzeyi"
              >
                <div className="uxu-stack-sm">
                  <div className="uxu-stage-row">
                    <Button
                      variant="glass"
                      size={controlSize}
                      pill={isPill}
                      disabled={isDisabled}
                      collapsible
                      expanded={collapseExpanded}
                      badgeCount={3}
                      leadingIcon={<Filter size={15} />}
                      onExpandChange={setCollapseExpanded}
                    >
                      {collapseExpanded ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                    </Button>
                    <Button
                      variant="outlined"
                      size={controlSize}
                      pill={isPill}
                      disabled={isDisabled}
                      collapsible
                      expanded={!collapseExpanded}
                      onExpandChange={(next) => setCollapseExpanded(!next)}
                    >
                      Hızlı Detay Özeti
                    </Button>
                  </div>

                  {collapseExpanded && (
                    <div className="uxu-collapse-demo-panel">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 6,
                        }}
                      >
                        <strong style={{ fontSize: '0.8rem' }}>
                          Aktif Kurumsal Filtre Kriterleri
                        </strong>
                        <Badge tone="success" size="xs">
                          3 Kural Aktif
                        </Badge>
                      </div>
                      <p className="uxu-text-xs">
                        Bölge: EMEA • Fatura Limiti: &gt; ₺50.000 • Durum: Onay
                        Bekleyen Siparişler
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Split Buttons */}
              <Card
                variant="tonal"
                padding="md"
                title="3. Split (Bölünmüş) Aksiyon Butonları"
                subtitle="Birincil eylem + açılır bağlamsal menü seçenekleri"
              >
                <div className="uxu-stage-row">
                  <Button
                    variant="filled"
                    size={controlSize}
                    pill={isPill}
                    disabled={isDisabled}
                    leadingIcon={<Send size={14} />}
                    splitAction
                    splitItems={[
                      {
                        id: 'now',
                        label: 'Hemen Gönder (Canlı Küme)',
                        icon: <Zap size={14} />,
                        onClick: () =>
                          notify({
                            title: 'Canlı Dağıtım Başlatıldı',
                            description: 'Tüm uç düğümlere iletildi.',
                            tone: 'success',
                          }),
                      },
                      {
                        id: 'schedule',
                        label: 'Gece 03:00 İçin Zamanla',
                        icon: <RefreshCw size={14} />,
                        onClick: () =>
                          notify({
                            title: 'Zamanlanmış Görev Eklendi',
                            description: 'Gece 03:00 bakım penceresine alındı.',
                            tone: 'info',
                          }),
                      },
                      {
                        id: 'rollback',
                        label: 'Önceki Sürüme Geri Dön',
                        icon: <AlertTriangle size={14} />,
                        danger: true,
                        onClick: () =>
                          notify({
                            title: 'Rollback Başlatıldı',
                            description: 'v2.4.9 kararlı sürümüne dönülüyor.',
                            tone: 'danger',
                          }),
                      },
                    ]}
                    onClick={() =>
                      notify({
                        title: 'Yayınlama Başlatıldı',
                        description: 'Birincil Split Button aksiyonu çalıştı.',
                        tone: 'primary',
                      })
                    }
                  >
                    Üretime Yayınla
                  </Button>

                  <Button
                    variant="glass"
                    size={controlSize}
                    pill={isPill}
                    disabled={isDisabled}
                    leadingIcon={<Download size={14} />}
                    splitAction
                    splitItems={[
                      {
                        id: 'pdf',
                        label: 'İmzalı e-Fatura PDF İndir',
                        onClick: () =>
                          notify({ title: 'PDF İndirildi', tone: 'success' }),
                      },
                      {
                        id: 'ubl',
                        label: 'GİB UBL-TR XML İndir',
                        onClick: () =>
                          notify({ title: 'UBL-TR XML İndirildi', tone: 'info' }),
                      },
                    ]}
                    onClick={() =>
                      notify({ title: 'Dışa Aktarma Başladı', tone: 'primary' })
                    }
                  >
                    e-Fatura İndir
                  </Button>
                </div>
              </Card>

              {/* Icon-Only & Loading Variations */}
              <Card
                variant="tonal"
                padding="md"
                title="4. Icon-Only, Rozetli & Loading Durumları"
                subtitle="Araç çubuğu ikon butonları, bildirim sayaçları ve asenkron yükleme"
              >
                <div className="uxu-stage-row">
                  <Tooltip content="Yeni Kayıt Oluştur">
                    <Button
                      variant="filled"
                      size={controlSize}
                      pill={isPill}
                      iconOnly
                      aria-label="Yeni Ekle"
                    >
                      <Plus size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Paylaşım Bağlantısı">
                    <Button
                      variant="glass"
                      size={controlSize}
                      pill={isPill}
                      iconOnly
                      aria-label="Paylaş"
                    >
                      <Share2 size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Bildirim Merkezi">
                    <Button
                      variant="tonal"
                      size={controlSize}
                      pill={isPill}
                      iconOnly
                      aria-label="Bildirimler"
                    >
                      <Bell size={16} />
                    </Button>
                  </Tooltip>
                  <Button
                    variant="glass"
                    size={controlSize}
                    pill={isPill}
                    badgeCount={12}
                    leadingIcon={<Bell size={15} />}
                  >
                    Onay Bekleyenler
                  </Button>
                  <Button
                    variant="tonal"
                    size={controlSize}
                    pill={isPill}
                    loading
                    loadingText="Doğrulanıyor..."
                  >
                    Gönder
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'input':
        return (
          <div className="uxu-stage-showcase">
            {/* 1. Standard, Validation States, Password Reveal & Affixes */}
            <div className="uxu-stage-grid-2">
              <Input
                label="Spotlight & Material Hibrit Giriş"
                placeholder="Komut veya e-posta yazın..."
                value={inputValue}
                onChange={setInputValue}
                surface={inputSurface}
                size={controlSize}
                disabled={isDisabled}
                clearable
                shortcutHint="⌘K"
                validationState={inputError ? 'error' : inputValidation}
                leadingIcon={<Search size={16} />}
                helperText="Sağdaki denetçiden doğrulama (success/warning/error) durumlarını test edin."
                successText={
                  inputValidation === 'success'
                    ? 'Kurumsal alan adı doğrulandı (MX kaydı aktif).'
                    : undefined
                }
                warningText={
                  inputValidation === 'warning'
                    ? 'Bu e-posta adresi harici bir organizasyona ait.'
                    : undefined
                }
                errorText={
                  inputError || inputValidation === 'error'
                    ? 'Format doğrulaması başarısız oldu.'
                    : undefined
                }
              />

              <Input
                label="Göster/Gizle Destekli API & Parola Girişi"
                placeholder="Gizli anahtarınızı girin..."
                value={secretKeyVal}
                onChange={setSecretKeyVal}
                surface={inputSurface}
                size={controlSize}
                disabled={isDisabled}
                revealablePassword
                maxLength={42}
                showCount
                leadingIcon={<Lock size={16} />}
                helperText="Göz ikonuna tıklayarak parolayı gösterebilir veya gizleyebilirsiniz."
              />
            </div>

            {/* 2. Masked Enterprise Inputs (Phone, IBAN, Tax ID, Credit Card) */}
            <Card
              variant="tonal"
              padding="md"
              eyebrow="B2B • FİNANS • MUHASEBE FORMAT MASKELERİ"
              title="Maskeli Kurumsal Giriş Alanları (Input Masking)"
              subtitle="Yazım sırasında otomatik formatlanan Telefon, TR IBAN, Vergi/TCKN ve Kredi Kartı alanları"
            >
              <div className="uxu-stage-grid-2">
                <Input
                  label="Kurumsal Telefon (mask='phone')"
                  value={phoneVal}
                  onChange={setPhoneVal}
                  mask="phone"
                  surface={inputSurface}
                  size={controlSize}
                  disabled={isDisabled}
                  leadingIcon={<Phone size={15} />}
                  validationState={phoneVal.length >= 19 ? 'success' : 'default'}
                  successText={
                    phoneVal.length >= 19 ? 'SMS doğrulamasına hazır' : undefined
                  }
                />

                <Input
                  label="Banka Hesabı TR IBAN (mask='iban')"
                  value={ibanVal}
                  onChange={setIbanVal}
                  mask="iban"
                  surface={inputSurface}
                  size={controlSize}
                  disabled={isDisabled}
                  leadingIcon={<Building2 size={15} />}
                  validationState={
                    ibanVal.replace(/\s/g, '').length === 26
                      ? 'success'
                      : 'warning'
                  }
                  successText="TR IBAN 26 hane kontrolü başarılı"
                  warningText="TR IBAN 26 karakter olmalıdır"
                />

                <Input
                  label="Vergi Kimlik / TCKN (mask='tax-id')"
                  value={taxIdVal}
                  onChange={setTaxIdVal}
                  mask="tax-id"
                  surface={inputSurface}
                  size={controlSize}
                  disabled={isDisabled}
                  prefixText="VKN"
                  showCount
                  maxLength={11}
                  helperText="Sadece rakam kabul eder (10 hane VKN veya 11 hane TCKN)"
                />

                <Input
                  label="Kurumsal Ticari Kart (mask='credit-card')"
                  value={cardVal}
                  onChange={setCardVal}
                  mask="credit-card"
                  surface={inputSurface}
                  size={controlSize}
                  disabled={isDisabled}
                  leadingIcon={<CreditCard size={15} />}
                  suffixText="VISA"
                  helperText="16 haneli kart numarası 4'lü bloklar halinde gruplanır"
                />
              </div>
            </Card>

            {/* 3. Currency Input & Date/Time Picker */}
            <div className="uxu-stage-grid-2">
              <Card
                variant="tonal"
                padding="md"
                title="Para Birimi & KDV Hesaplayıcı (CurrencyInput)"
                subtitle="Çoklu döviz seçimi (TRY, USD, EUR, GBP), hızlı tutar adımları ve otomatik %20 KDV"
              >
                <div className="uxu-stack-md">
                  <CurrencyInput
                    label="Fatura Net Hizmet Bedeli"
                    value={currencyAmount}
                    onChange={setCurrencyAmount}
                    currency={currencyCode}
                    onCurrencyChange={setCurrencyCode}
                    size={controlSize}
                    disabled={isDisabled}
                    vatRate={20}
                    helperText="Alt satırda KDV (%20) dahil genel toplam anlık hesaplanır."
                  />
                  <Input
                    label="Kurumsal Kiracı (Tenant) Alt Alan Adı"
                    value={subdomainVal}
                    onChange={setSubdomainVal}
                    surface={inputSurface}
                    size={controlSize}
                    disabled={isDisabled}
                    prefixText="https://"
                    suffixText=".uxigl.cloud"
                    validationState="success"
                    successText="Alt alan adı SSL sertifikası ile kullanıma hazır."
                  />
                </div>
              </Card>

              <Card
                variant="tonal"
                padding="md"
                title="Tarih & Saat Seçici (DateTimePickerInput)"
                subtitle="Hızlı vade kısayolları (Bugün, Yarın, +7 Gün, +30 Gün Vade) ve saat seçimi"
              >
                <DateTimePickerInput
                  label="e-Fatura Düzenleme & Vade Tarihi"
                  dateValue={invoiceDate}
                  timeValue={invoiceTime}
                  onDateChange={setInvoiceDate}
                  onTimeChange={setInvoiceTime}
                  size={controlSize}
                  disabled={isDisabled}
                  helperText="Vade butonlarıyla hızlıca ileri tarihli ödeme planı seçebilirsiniz."
                />
              </Card>
            </div>

            {/* 4. Multi-Select Tag Input & File Upload Dropzone */}
            <div className="uxu-stage-grid-2">
              <Card
                variant="tonal"
                padding="md"
                title="Çoklu Seçim & Etiket Girişi (MultiSelectTagInput)"
                subtitle="Klavyeden Enter/Virgül ile etiket ekleme ve öneri havuzu"
              >
                <MultiSelectTagInput
                  label="Müşteri Segmenti & Muhasebe Etiketleri"
                  tags={selectedEnterpriseTags}
                  onChange={setSelectedEnterpriseTags}
                  maxTags={8}
                  disabled={isDisabled}
                  helperText="Listeden seçin veya yeni etiket yazıp Enter'a basın."
                />
              </Card>

              <Card
                variant="tonal"
                padding="md"
                title="Sürükle-Bırak Dosya Yükleme Alanı (FileUploadDropzone)"
                subtitle="Çoklu belge yükleme, boyut kontrolü ve canlı durum listesi"
              >
                <FileUploadDropzone
                  label="Sözleşme, İrsaliye & Dekont Ekleri"
                  files={uploadedFiles}
                  onChange={setUploadedFiles}
                  disabled={isDisabled}
                />
              </Card>
            </div>

            {/* 5. Searchable Select Combobox & Rich Textarea */}
            <div className="uxu-stage-grid-2">
              <Card
                variant="tonal"
                padding="md"
                title="Aranabilir Açılır Seçici (<Select /> Combobox)"
                subtitle="Grup başlıkları, klavye navigasyonu, canlı arama filtresi ve rozet desteği"
              >
                <Select
                  label="Tahsilat & Havale Bankası Seçimi"
                  value={selectedBankCode}
                  onChange={setSelectedBankCode}
                  surface={inputSurface}
                  size={controlSize}
                  disabled={isDisabled}
                  searchable
                  clearable
                  helperText="Klavye ok tuşları veya canlı arama kutusu ile filtreleyebilirsiniz."
                  options={[
                    {
                      value: 'garanti-bbva',
                      label: 'Garanti BBVA Kurumsal',
                      description: 'TR33 0006 2000 • FAST & SWIFT Aktif',
                      badge: 'Varsayılan',
                      group: 'Özel Sektör Bankaları',
                      icon: <Building2 size={15} />,
                    },
                    {
                      value: 'is-bankasi',
                      label: 'Türkiye İş Bankası Ticari',
                      description: 'TR12 0006 4000 • Otomatik DBS Entegrasyonu',
                      badge: 'DBS',
                      group: 'Özel Sektör Bankaları',
                      icon: <Building2 size={15} />,
                    },
                    {
                      value: 'ziraat-katilim',
                      label: 'Ziraat Bankası Kurumsal',
                      description: 'TR89 0001 0000 • Kamu & GİB Vergi Ödemeleri',
                      badge: 'GİB',
                      group: 'Kamu Bankaları',
                      icon: <CreditCard size={15} />,
                    },
                    {
                      value: 'wise-eu',
                      label: 'Wise Europe (SEPA / IBAN)',
                      description: 'BE68 9670 1234 • EUR & GBP Tahsilat Hesabı',
                      badge: 'SEPA',
                      group: 'Küresel Ödeme Ağ Geçitleri',
                      icon: <Globe size={15} />,
                    },
                  ]}
                />
              </Card>

              <Card
                variant="tonal"
                padding="md"
                title="Çok Satırlı Zengin Metin Alanı (<Textarea />)"
                subtitle="Hızlı şablon ekleme çipleri, karakter/kelime sayacı ve doğrulama durumu"
              >
                <Textarea
                  label="e-Fatura & Muhasebe Açıklama Notu"
                  value={invoiceNotes}
                  onChange={setInvoiceNotes}
                  surface={inputSurface}
                  size={controlSize}
                  disabled={isDisabled}
                  rows={3}
                  maxLength={280}
                  showCount
                  clearable
                  quickTemplates={[
                    'İrsaliye yerine geçer.',
                    'Tevkifatlı fatura (%9/10 KDV)',
                    '30 gün vadeli B2B cari mutabakat.',
                  ]}
                  helperText="Üstteki hazır şablonlara tıklayarak metne hızlıca ekleme yapabilirsiniz."
                />
              </Card>
            </div>
          </div>
        );

      case 'switch':
      case 'checkbox':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant="glass"
                padding="md"
                title="Switch — Taktil Anahtar Kontrolleri"
                subtitle="Anlık devreye giren sistem ayarları için"
              >
                <div className="uxu-stack-md">
                  <Switch
                    label="Uzamsal Cam Efektleri (Vibrancy)"
                    description="Arka plan bulanıklığı ve speküler kenar yansıması"
                    value={switchChecked}
                    onChange={setSwitchChecked}
                    tone={semanticTone}
                    size={controlSize}
                    disabled={isDisabled}
                  />
                  <Switch
                    label="Dinamik Tohum Renk Uyumu"
                    description="Adaptif tonal palet motorunu etkinleştir"
                    value={!switchChecked}
                    onChange={(v) => setSwitchChecked(!v)}
                    tone="success"
                    size={controlSize}
                    disabled={isDisabled}
                  />
                </div>
              </Card>

              <Card
                variant="tonal"
                padding="md"
                title="Checkbox — Onay Kutusu & Indeterminate"
                subtitle="Çoklu seçim listeleri ve sözleşme onayları için"
              >
                <div className="uxu-stack-md">
                  <Checkbox
                    label="Okuma, Yazma ve Dağıtım İzinlerini Onayla"
                    description="Yönetici rolü için tam yetki ataması"
                    value={checkboxChecked}
                    onChange={setCheckboxChecked}
                    tone={semanticTone}
                    size={controlSize}
                    disabled={isDisabled}
                  />
                  <Checkbox
                    label="Alt Küme Servisleri (Kısmi Seçim / Indeterminate)"
                    description="indeterminate={true} olduğunda eksi (-) ikonu görünür"
                    value={false}
                    indeterminate={true}
                    onChange={() => setCheckboxChecked((prev) => !prev)}
                    tone="warning"
                    size={controlSize}
                    disabled={isDisabled}
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant="glass"
                padding="md"
                title="Kontrol Merkezi Kaydırıcı"
              >
                <div className="uxu-stack-md">
                  <Slider
                    label="Ekran Parlaklığı & True Tone"
                    value={sliderValue}
                    onChange={setSliderValue}
                    min={0}
                    max={100}
                    step={5}
                    tone={semanticTone}
                    size={controlSize}
                    disabled={isDisabled}
                    showTicks={showSliderTicks}
                    valueSuffix="%"
                    leadingIcon={<Sun size={16} />}
                  />
                  <Slider
                    label="Uzamsal Ses Seviyesi (Spatial Audio)"
                    value={Math.max(10, 100 - sliderValue)}
                    onChange={(v) => setSliderValue(100 - v)}
                    min={0}
                    max={100}
                    step={10}
                    tone="success"
                    size={controlSize}
                    disabled={isDisabled}
                    showTicks={showSliderTicks}
                    valueSuffix=" dB"
                    leadingIcon={<Volume2 size={16} />}
                  />
                </div>
              </Card>

              <div className="uxu-stack-md">
                <Switch
                  label="Adım Noktalarını (showTicks) Göster"
                  value={showSliderTicks}
                  onChange={setShowSliderTicks}
                />
                <Progress
                  label="Kaydırıcı ile Senkronize İlerleme Çubuğu"
                  value={sliderValue}
                  tone={semanticTone}
                  size={controlSize}
                />
              </div>
            </div>
          </div>
        );

      case 'segmented-control':
        return (
          <div className="uxu-stage-showcase">
            <SegmentedControl
              label="Görünüm Modu Seçici (Sliding Pill)"
              value={segmentValue}
              onChange={setSegmentValue}
              size={controlSize}
              disabled={isDisabled}
              fullWidth
              options={[
                {
                  value: 'spatial',
                  label: 'Spatial Liquid Glass',
                  icon: <Sparkles size={15} />,
                  badge: 'Glass',
                },
                {
                  value: 'tonal',
                  label: 'Dinamik Tonal Yüzey',
                  icon: <Layers size={15} />,
                  badge: 'Tonal',
                },
                {
                  value: 'adaptive',
                  label: 'uxiGL Hibrit Sentez',
                  icon: <Zap size={15} />,
                  badge: 'Pro',
                },
              ]}
            />

            <Card
              variant={segmentValue === 'tonal' ? 'tonal' : 'glass'}
              title={`Seçili Görünüm: ${segmentValue.toUpperCase()}`}
              subtitle="Kayan kapsül (thumb) CSS değişkenleri ile akıcı yay fiziği kullanır."
            >
              <p className="uxu-muted-p">
                Seçeneklerde ikon (<code>icon</code>), sayaç rozeti (
                <code>badge</code>) ve devre dışı bırakma (<code>disabled</code>
                ) özellikleri doğrudan tanımlanabilir.
              </p>
            </Card>
          </div>
        );

      case 'card':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant={surfaceVariant}
                padding={
                  controlSize === 'xs' || controlSize === 'sm'
                    ? 'sm'
                    : controlSize === 'lg'
                    ? 'lg'
                    : 'md'
                }
                interactive
                glowOnHover
                eyebrow="SUNUCU KÜMESİ"
                title="Çok Katmanlı Yüzey Kartı"
                subtitle="Sağdaki listeden Glass, Tonal, Elevated ve Outlined modlarını deneyin."
                headerIcon={<Layers size={20} />}
                headerAction={
                  <Badge
                    tone={semanticTone}
                    size={controlSize}
                    pill={isPill}
                    pulse
                  >
                    Canlı
                  </Badge>
                }
                footer={
                  <div className="uxu-card-footer-row">
                    <span className="uxu-text-xs">Son senkron: Şimdi</span>
                    <Button
                      variant="tonal"
                      size={controlSize}
                      pill={isPill}
                      loading={isLoading}
                      disabled={isDisabled}
                    >
                      Detayları İncele
                    </Button>
                  </div>
                }
              >
                <p className="uxu-muted-p">
                  Kart bileşeni; üst başlık, alt başlık, ikon, sağ aksiyon rozeti
                  ve alt çubuk (footer) alanlarını hazır prop olarak sunar.
                </p>
              </Card>

              <div className="uxu-stack-md">
                {(
                  ['glass', 'tonal', 'elevated', 'outlined'] as SurfaceVariant[]
                ).map((v) => (
                  <Card
                    key={v}
                    variant={v}
                    padding="sm"
                    interactive
                    onClick={() => setSurfaceVariant(v)}
                  >
                    <div className="uxu-card-footer-row">
                      <strong>Yüzey Varyantı: {v.toUpperCase()}</strong>
                      <Badge
                        tone={surfaceVariant === v ? semanticTone : 'neutral'}
                        variant={surfaceVariant === v ? 'filled' : 'tonal'}
                        size={controlSize}
                        pill={isPill}
                      >
                        {surfaceVariant === v ? 'Aktif' : 'Seç'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'chips-badges':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-matrix-label">
              Etkileşimli Filtre Çipleri (Tıklayarak Seçimi Değiştirin)
            </div>
            <div className="uxu-stage-row">
              {[
                'Liquid Glass',
                'Material Design 3',
                'Dark / Light Mode',
                'Responsive Grid',
                '120Hz Motion',
              ].map((tag) => (
                <Chip
                  key={tag}
                  selected={selectedChips.includes(tag)}
                  tone={semanticTone}
                  size={controlSize}
                  pill={isPill}
                  disabled={isDisabled}
                  onClick={() => toggleChip(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>

            <div className="uxu-stage-divider" />

            <div className="uxu-stage-matrix-label">
              Durum Rozetleri (Canlı Sinyal &amp; Anlamsal Tonlar)
            </div>
            <div className="uxu-stage-row">
              <Badge
                tone={semanticTone}
                variant="tonal"
                pulse
                size={controlSize}
                pill={isPill}
              >
                Sistem Aktif ({semanticTone})
              </Badge>
              <Badge
                tone="success"
                variant="glass"
                pulse
                size={controlSize}
                pill={isPill}
              >
                %99.98 Çalışma Süresi
              </Badge>
              <Badge
                tone="warning"
                variant="outlined"
                size={controlSize}
                pill={isPill}
              >
                Bellek Optimizasyonu
              </Badge>
              <Badge
                tone="danger"
                variant="filled"
                size={controlSize}
                pill={isPill}
              >
                Kritik Uyarı (2)
              </Badge>
              <Badge
                tone="info"
                variant="tonal"
                size={controlSize}
                pill={isPill}
              >
                v2.5 Spatial
              </Badge>
            </div>
          </div>
        );

      case 'progress-avatar':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <Card
                variant="glass"
                title="Dairesel & Doğrusal İlerleme (Progress)"
                subtitle="Sağdaki Boyut (XS/SM/MD/LG), Ton ve Yükleniyor ayarlarına anında tepki verir"
              >
                <div className="uxu-stage-row" style={{ marginBottom: 16 }}>
                  <Progress
                    variant="circular"
                    value={sliderValue}
                    indeterminate={isLoading}
                    speed={animDurationSec}
                    tone={semanticTone}
                    size={controlSize}
                  />
                  <Progress
                    variant="circular"
                    value={88}
                    tone="success"
                    size={controlSize}
                  />
                  <Progress
                    variant="circular"
                    value={64}
                    tone="warning"
                    size={controlSize}
                  />
                  <Progress
                    variant="circular"
                    indeterminate={skeletonAnimated || isLoading}
                    value={skeletonAnimated || isLoading ? 0 : 45}
                    speed={animDurationSec}
                    tone="info"
                    size={controlSize}
                  />
                </div>

                <div className="uxu-stack-md">
                  <Progress
                    label="Bulut Yedekleme & Dosya Aktarım İlerlemesi"
                    value={sliderValue}
                    indeterminate={isLoading}
                    speed={skeletonAnimated || isLoading ? animDurationSec : undefined}
                    tone={semanticTone}
                    size={controlSize}
                  />

                  <Slider
                    label="İlerleme Yüzdesi (%)"
                    value={sliderValue}
                    min={0}
                    max={100}
                    step={1}
                    size={controlSize}
                    tone={semanticTone}
                    disabled={isDisabled}
                    valueSuffix="%"
                    onChange={setSliderValue}
                  />
                </div>
              </Card>

              <Card
                variant="tonal"
                title="Squircle / Daire Avatarlar, Tooltip & Skeleton"
                subtitle="Boyut (XS/SM/MD/LG) ve Kapsül Köşe (Squircle / Circle) ile ölçeklenir"
              >
                <div className="uxu-stage-row" style={{ marginBottom: 16 }}>
                  <Tooltip
                    content="Deniz Kaya • Baş Mimar (Çevrimiçi)"
                    shortcut="⌘1"
                  >
                    <Avatar
                      name="Deniz Kaya"
                      status="online"
                      tone={semanticTone}
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                  </Tooltip>
                  <Tooltip content="Selin Yılmaz • UI/UX Direktörü (Meşgul)">
                    <Avatar
                      name="Selin Yılmaz"
                      status="busy"
                      tone="danger"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                  </Tooltip>
                  <AvatarGroup
                    max={3}
                    size={controlSize}
                    shape={isPill ? 'circle' : 'squircle'}
                  >
                    <Avatar
                      name="Arda Demir"
                      tone="success"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Zeynep Ak"
                      tone="warning"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Mert Can"
                      tone="info"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Elif Su"
                      tone="primary"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                    <Avatar
                      name="Bora Öz"
                      tone="secondary"
                      size={controlSize}
                      shape={isPill ? 'circle' : 'squircle'}
                    />
                  </AvatarGroup>
                </div>

                <div className="uxu-stack-md">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={controlSize === 'xs' ? 34 : controlSize === 'lg' ? 52 : 42}
                      height={controlSize === 'xs' ? 34 : controlSize === 'lg' ? 52 : 42}
                      animated={skeletonAnimated}
                      speed={animDurationSec}
                      style={{ flexShrink: 0 }}
                    />
                    <div className="uxu-stack-sm" style={{ flex: 1, minWidth: 0 }}>
                      <Skeleton
                        variant="text"
                        width="75%"
                        height={controlSize === 'xs' ? 10 : controlSize === 'lg' ? 18 : 14}
                        animated={skeletonAnimated}
                        speed={animDurationSec}
                      />
                      <Skeleton
                        variant="squircle"
                        width="100%"
                        height={controlSize === 'xs' ? 24 : controlSize === 'lg' ? 40 : 30}
                        animated={skeletonAnimated}
                        speed={animDurationSec}
                      />
                    </div>
                    <Progress
                      variant="circular"
                      indeterminate={skeletonAnimated || isLoading}
                      value={skeletonAnimated || isLoading ? 0 : 75}
                      speed={animDurationSec}
                      tone="info"
                      size={controlSize === 'lg' ? 'md' : 'sm'}
                    />
                  </div>

                  <Slider
                    label="Döngü & Shimmer Süresi (Yüksek sn = Daha Yavaş)"
                    value={animDurationSec}
                    min={0.8}
                    max={6.0}
                    step={0.2}
                    size={controlSize}
                    valueSuffix=" sn"
                    tone="info"
                    disabled={isDisabled}
                    onChange={setAnimDurationSec}
                  />

                  <Switch
                    size={controlSize}
                    tone={semanticTone}
                    disabled={isDisabled}
                    label="Dönen Halka & İskelet Animasyonu"
                    description="Kapatıldığında dönen halka ve iskelet (shimmer) hareketi durur"
                    value={skeletonAnimated}
                    onChange={setSkeletonAnimated}
                  />
                </div>
              </Card>
            </div>
          </div>
        );

      case 'modal-command':
        return (
          <div className="uxu-stage-showcase">
            {/* 1. Primary Action Bar */}
            <div className="uxu-stage-row">
              <Button
                variant="filled"
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                loading={isLoading}
                leadingIcon={<Layers size={16} />}
                onClick={() => setDemoModalOpen(true)}
              >
                Modal Diyaloğu Aç ({modalVariant.toUpperCase()})
              </Button>
              <Button
                variant="glass"
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                leadingIcon={<Terminal size={16} />}
                onClick={onOpenCommandPalette}
              >
                Spotlight Komut Paletini Aç (⌘K)
              </Button>
              <Button
                variant="tonal"
                size={controlSize}
                pill={isPill}
                disabled={isDisabled}
                leadingIcon={<Bell size={16} />}
                onClick={() =>
                  notify({
                    title: `Canlı Bildirim (${toastPlacement})`,
                    description: `Seçili ton: ${toastTone} • Konum: ${toastPlacement}`,
                    tone: toastTone,
                    placement: toastPlacement,
                    actionLabel: 'Detayı Gör',
                    onAction: () => {},
                  })
                }
              >
                Seçili Yönde Toast Tetikle ({toastPlacement})
              </Button>
            </div>

            {/* 2. Live Multi-Direction & Multi-Tone Toast Launcher Matrix */}
            <Card
              variant="tonal"
              padding="md"
              eyebrow="5 EKRAN YÖNÜ × 6 SEMANTİK & GLASS TONU"
              title="Canlı Toast Bildirim Stüdyosu (Multi-Viewport Toast Engine)"
              subtitle="Bildirimleri ekranın 5 farklı köşesinde ve 6 farklı semantik/glass tonda canlı test edin"
              headerAction={
                <Button
                  variant="glass"
                  size="xs"
                  leadingIcon={<Sparkles size={13} />}
                  onClick={() => {
                    const demoCorners: Array<{
                      placement: ToastPlacement;
                      tone: ToastTone;
                      label: string;
                    }> = [
                      {
                        placement: 'top-left',
                        tone: 'info',
                        label: 'Sol Üst (Top-Left) • Bilgi',
                      },
                      {
                        placement: 'top-center',
                        tone: 'glass',
                        label: 'Üst Orta (Top-Center) • Liquid Glass',
                      },
                      {
                        placement: 'top-right',
                        tone: 'success',
                        label: 'Sağ Üst (Top-Right) • Başarılı',
                      },
                      {
                        placement: 'bottom-left',
                        tone: 'warning',
                        label: 'Sol Alt (Bottom-Left) • Uyarı',
                      },
                      {
                        placement: 'bottom-right',
                        tone: 'danger',
                        label: 'Sağ Alt (Bottom-Right) • Kritik Alarm',
                      },
                    ];
                    demoCorners.forEach((item, idx) => {
                      window.setTimeout(() => {
                        notify({
                          title: item.label,
                          description: `Yön: ${item.placement} • Ton: ${item.tone}`,
                          placement: item.placement,
                          tone: item.tone,
                          durationMs: 4500,
                        });
                      }, idx * 140);
                    });
                  }}
                >
                  5 Yönü Aynı Anda Ateşle
                </Button>
              }
            >
              <div className="uxu-stack-md">
                <div>
                  <div className="uxu-stage-matrix-label" style={{ marginBottom: 8 }}>
                    1. Ekran Yönü Seçin ve Anında Tetikleyin (placement)
                  </div>
                  <div className="uxu-stage-row">
                    {(
                      [
                        { id: 'top-left', label: '↖ Sol Üst (top-left)' },
                        { id: 'top-center', label: '↑ Üst Orta (top-center)' },
                        { id: 'top-right', label: '↗ Sağ Üst (top-right)' },
                        { id: 'bottom-left', label: '↙ Sol Alt (bottom-left)' },
                        { id: 'bottom-right', label: '↘ Sağ Alt (bottom-right)' },
                      ] as Array<{ id: ToastPlacement; label: string }>
                    ).map((pos) => (
                      <Button
                        key={pos.id}
                        variant={toastPlacement === pos.id ? 'filled' : 'glass'}
                        size="sm"
                        pill={isPill}
                        onClick={() => {
                          setToastPlacement(pos.id);
                          notify({
                            title: `${pos.label} Bildirimi`,
                            description: `Aktif renk tonu: ${toastTone.toUpperCase()}`,
                            placement: pos.id,
                            tone: toastTone,
                            actionLabel: 'Onayla',
                            onAction: () => {},
                          });
                        }}
                      >
                        {pos.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="uxu-stage-matrix-label" style={{ marginBottom: 8 }}>
                    2. Semantik Renk veya Liquid Glass Tonu Seçip Tetikleyin (tone)
                  </div>
                  <div className="uxu-stage-row">
                    {(
                      [
                        { tone: 'primary', label: 'Primary (Vurgu)', btn: 'filled' },
                        { tone: 'success', label: 'Success (Başarılı)', btn: 'success' },
                        { tone: 'warning', label: 'Warning (Uyarı)', btn: 'warning' },
                        { tone: 'danger', label: 'Danger (Kritik Hata)', btn: 'danger' },
                        { tone: 'info', label: 'Info (Sistem Bilgisi)', btn: 'tonal' },
                        { tone: 'glass', label: 'Liquid Glass (Buzlu Cam)', btn: 'glass' },
                      ] as Array<{
                        tone: ToastTone;
                        label: string;
                        btn: ButtonVariant;
                      }>
                    ).map((item) => (
                      <Button
                        key={item.tone}
                        variant={toastTone === item.tone ? item.btn : 'outlined'}
                        size="sm"
                        pill={isPill}
                        onClick={() => {
                          setToastTone(item.tone);
                          notify({
                            title: `${item.label} Bildirimi`,
                            description: `Konum: ${toastPlacement} • Otomatik geri sayım çubuğu aktif.`,
                            tone: item.tone,
                            placement: toastPlacement,
                            actionLabel: 'Geri Al',
                            onAction: () => {},
                          });
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. Modal Dialog Archetypes */}
            <Card
              variant="tonal"
              padding="md"
              title="Modal Diyalog Varyasyonları (6 Kurumsal Arketip)"
              subtitle="Standart, Onay (Confirm), Yıkıcı İşlem (Danger), Uyarı (Alert), Alt Çekmece (Sheet) ve Saf Liquid Glass"
            >
              <div className="uxu-stage-row">
                {(
                  [
                    { v: 'default', label: 'Standart Modal' },
                    { v: 'confirm', label: 'Onay Diyaloğu (Confirm)' },
                    { v: 'danger', label: 'Yıkıcı Silme Onayı (Danger)' },
                    { v: 'alert', label: 'Sistem Uyarısı (Alert)' },
                    { v: 'sheet', label: 'Alt Çekmece (Sheet)' },
                    { v: 'glass', label: 'Saf Liquid Glass' },
                  ] as Array<{ v: ModalVariant; label: string }>
                ).map((m) => (
                  <Button
                    key={m.v}
                    variant={
                      m.v === 'danger'
                        ? 'danger'
                        : modalVariant === m.v
                        ? 'filled'
                        : 'glass'
                    }
                    size="sm"
                    pill={isPill}
                    onClick={() => {
                      setModalVariant(m.v);
                      setDemoModalOpen(true);
                    }}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* 4. Inline Alert Banners */}
            <Card
              variant="tonal"
              padding="md"
              title="Satır İçi Uyarı & Durum Bantları (<Alert />)"
              subtitle="Sayfa içi bilgi, başarı, uyarı, kritik hata ve Liquid Glass bildirim yüzeyleri"
            >
              <div className="uxu-stack-sm">
                <Alert
                  tone="success"
                  variant="tonal"
                  title="e-Fatura GİB Entegrasyonu Aktif"
                  description="Gelir İdaresi Başkanlığı (GİB) ağ geçidi ile çift yönlü zarf senkronizasyonu sorunsuz çalışıyor."
                />
                <Alert
                  tone="warning"
                  variant="tonal"
                  title="Kredi Limiti Eşiği (%85) Aşıldı"
                  description="Müşteri cari hesabının açık risk bakiyesi ₺850.000 seviyesine ulaştı. Ek teminat mektubu talep edilebilir."
                />
                <Alert
                  tone="danger"
                  variant="outlined"
                  title="Kritik Güvenlik Uyarısı: İmza Sertifikası Süresi Doluyor"
                  description="Mali mühür zaman damgası sertifikasının geçerlilik süresi 48 saat içinde sona erecek."
                />
                <Alert
                  tone="glass"
                  variant="glass"
                  title="Liquid Glass Sistem Duyurusu"
                  description="uxiGL v2.5 tema kalıtımı motoru ile tüm WebGL yüzeyleri (SheetGL & FileManGL) aktif paletle %100 senkronize edildi."
                />
              </div>
            </Card>

            {/* 5. Slide-Over Drawer Component */}
            <Card
              variant="tonal"
              padding="md"
              title="Kayar Yan & Alt Çekmece Paneli (<Drawer />)"
              subtitle="Sağ (right), Sol (left) ve Alt (bottom) yönlerden açılan Liquid Glass denetim ve filtre çekmecesi"
            >
              <div className="uxu-stage-row">
                {(
                  [
                    { pos: 'right', label: 'Sağdan Aç (Right Drawer)' },
                    { pos: 'left', label: 'Soldan Aç (Left Drawer)' },
                    { pos: 'bottom', label: 'Alttan Aç (Bottom Sheet Drawer)' },
                  ] as Array<{ pos: DrawerPlacement; label: string }>
                ).map((d) => (
                  <Button
                    key={d.pos}
                    variant={drawerPlacement === d.pos ? 'filled' : 'glass'}
                    size="sm"
                    pill={isPill}
                    onClick={() => {
                      setDrawerPlacement(d.pos);
                      setDemoDrawerOpen(true);
                    }}
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
            </Card>

            <Drawer
              open={demoDrawerOpen}
              onClose={() => setDemoDrawerOpen(false)}
              placement={drawerPlacement}
              size="md"
              badge="DRAWER COMPOSITE"
              title="Canlı Denetim & Filtre Çekmecesi"
              subtitle={`Yön: ${drawerPlacement.toUpperCase()} • ESC veya arka plan tıklaması ile kapanır`}
              footer={
                <div className="uxu-modal-footer-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDemoDrawerOpen(false)}
                  >
                    Kapat
                  </Button>
                  <Button
                    variant="filled"
                    size="sm"
                    onClick={() => {
                      setDemoDrawerOpen(false);
                      notify({
                        title: 'Çekmece Ayarları Uygulandı',
                        description: `${drawerPlacement.toUpperCase()} çekmece filtreleri kaydedildi.`,
                        tone: 'success',
                      });
                    }}
                  >
                    Filtreleri Uygula
                  </Button>
                </div>
              }
            >
              <div className="uxu-stack-md">
                <Alert
                  tone="info"
                  variant="tonal"
                  title="Uzamsal Yan Panel (<Drawer />)"
                  description="Tablo satır detaylarını, gelişmiş filtre formlarını veya işlem geçmişini sayfadan ayrılmadan yan panelde göstermek için kullanılır."
                />
                <Select
                  label="Denetim Bölgesi"
                  value={selectedBankCode}
                  onChange={setSelectedBankCode}
                  options={[
                    {
                      value: 'garanti-bbva',
                      label: 'Avrupa-Merkez (Frankfurt M4)',
                      badge: 'Aktif',
                    },
                    {
                      value: 'is-bankasi',
                      label: 'Türkiye-Batı (İstanbul Edge)',
                      badge: '11ms',
                    },
                  ]}
                />
                <Textarea
                  label="Operasyonel Denetim Notu"
                  value={invoiceNotes}
                  onChange={setInvoiceNotes}
                  rows={3}
                />
              </div>
            </Drawer>

            <Modal
              open={demoModalOpen}
              onClose={() => setDemoModalOpen(false)}
              variant={modalVariant}
              tone={
                modalVariant === 'danger'
                  ? 'danger'
                  : modalVariant === 'alert'
                  ? 'warning'
                  : modalVariant === 'confirm'
                  ? 'success'
                  : semanticTone
              }
              showMacTrafficLights
              title={
                modalVariant === 'danger'
                  ? 'Üretim Veritabanı Kümesini Kalıcı Olarak Sil?'
                  : modalVariant === 'confirm'
                  ? 'Toplu e-Fatura Gönderim Onayı'
                  : modalVariant === 'alert'
                  ? 'Yüksek Gecikme Süresi Algılandı'
                  : modalVariant === 'sheet'
                  ? 'Hızlı Denetim & Filtre Çekmecesi (Sheet)'
                  : 'Sunucu Kümesi Yapılandırma Onayı'
              }
              subtitle={`Varyant: ${modalVariant.toUpperCase()} • Liquid Glass + Dinamik Tonal Diyalog`}
              footer={
                <div className="uxu-modal-footer-actions">
                  <Button
                    variant="ghost"
                    onClick={() => setDemoModalOpen(false)}
                  >
                    Vazgeç
                  </Button>
                  <Button
                    variant={modalVariant === 'danger' ? 'danger' : 'filled'}
                    leadingIcon={<Send size={15} />}
                    onClick={() => {
                      setDemoModalOpen(false);
                      notify({
                        title:
                          modalVariant === 'danger'
                            ? 'Silme İşlemi Tamamlandı'
                            : 'Değişiklikler Kaydedildi',
                        description: `Modal (${modalVariant}) aksiyonu başarıyla uygulandı.`,
                        tone: modalVariant === 'danger' ? 'danger' : 'success',
                        placement: toastPlacement,
                      });
                    }}
                  >
                    {modalVariant === 'danger'
                      ? 'Evet, Kalıcı Olarak Sil'
                      : 'Onayla ve Uygula'}
                  </Button>
                </div>
              }
            >
              <div className="uxu-stack-sm">
                <p className="uxu-muted-p">
                  Bu diyalog penceresi <code>variant=&quot;{modalVariant}&quot;</code>{' '}
                  kipinde çalışmaktadır. Klavyeden <code>ESC</code> tuşuna
                  basıldığında veya bulanık arka plana tıklandığında otomatik
                  olarak kapanır.
                </p>
                {modalVariant === 'danger' && (
                  <Alert
                    tone="danger"
                    variant="tonal"
                    title="Geri Alınamaz İşlem"
                    description="Bu işlem sonucunda 142 mikroservis düğümü ve anlık önbellek kopyaları sıfırlanacaktır."
                  />
                )}
              </div>
            </Modal>
          </div>
        );

      case 'sidebar':
        return (
          <div className="uxu-stage-showcase" style={{ width: '100%', padding: 0 }}>
            <SidebarShowcaseView />
          </div>
        );

      case 'page-templates':
        return (
          <div className="uxu-stage-showcase" style={{ width: '100%', padding: 0 }}>
            <PageTemplatesShowcaseView
              activePageId={playgroundPageId}
              onPageChange={setPlaygroundPageId}
            />
          </div>
        );

      case 'tabs-accordion':
        return (
          <div className="uxu-stage-showcase">
            <Tabs
              items={[
                {
                  id: 'overview',
                  label: 'Genel Bakış',
                  icon: <Sparkles size={15} />,
                  count: 4,
                  disabled: isDisabled,
                },
                {
                  id: 'tokens',
                  label: 'Tasarım Tokenları',
                  icon: <Sliders size={15} />,
                  count: 24,
                  disabled: isDisabled,
                },
                {
                  id: 'security',
                  label: 'Güvenlik Kuralları',
                  icon: <ShieldCheck size={15} />,
                  count: 5,
                  disabled: isDisabled,
                },
              ]}
              activeId={activeTabId}
              onChange={setActiveTabId}
              variant={isPill ? 'pill' : 'underline'}
              size={controlSize}
            />

            <Accordion
              variant={
                surfaceVariant === 'tonal' || surfaceVariant === 'outlined'
                  ? surfaceVariant
                  : 'glass'
              }
              defaultExpandedIds={['acc-1']}
              items={[
                {
                  id: 'acc-1',
                  title: '1. Sekme ve Akordeon Ne Zaman Kullanılmalı?',
                  subtitle: 'Bilgi mimarisi ve sayfa içi gezinme rehberi',
                  icon: <Sparkles size={17} />,
                  content:
                    'Farklı içerik görünümleri arasında geçiş yapmak için Tabs; sıkça sorulan sorular veya daraltılabilir ayar grupları için Accordion tercih edilmelidir.',
                },
                {
                  id: 'acc-2',
                  title: '2. Çoklu Açılım (allowMultiple) Özelliği',
                  subtitle: 'Aynı anda birden fazla paneli açık tutma',
                  icon: <Layers size={17} />,
                  content:
                    'Accordion bileşenine allowMultiple={true} prop’u verildiğinde kullanıcı bir paneli açtığında diğer açık paneller kapanmaz.',
                },
              ]}
            />

            <div className="uxu-stage-grid-2">
              <Card
                variant="tonal"
                padding="md"
                title="Çok Adımlı Süreç Sihirbazı (<Stepper />)"
                subtitle="Adımlara tıklayarak ilerlemeyi canlı değiştirebilirsiniz"
              >
                <div className="uxu-stack-md">
                  <Stepper
                    activeStep={activeWorkflowStep}
                    onStepClick={setActiveWorkflowStep}
                    steps={[
                      {
                        id: 's1',
                        title: 'Cari Doğrulama',
                        subtitle: 'VKN & MERSİS Kontrolü',
                        meta: 'Adım 1',
                      },
                      {
                        id: 's2',
                        title: 'Sözleşme & Limit',
                        subtitle: 'Teminat Onayı',
                        meta: 'Adım 2',
                      },
                      {
                        id: 's3',
                        title: 'Canlı Aktivasyon',
                        subtitle: 'ERP & GİB Bağlantısı',
                        meta: 'Adım 3',
                      },
                    ]}
                  />
                  <div className="uxu-stage-row">
                    <Button
                      variant="outlined"
                      size="xs"
                      disabled={activeWorkflowStep <= 0}
                      onClick={() =>
                        setActiveWorkflowStep((s) => Math.max(0, s - 1))
                      }
                    >
                      ← Önceki Adım
                    </Button>
                    <Button
                      variant="filled"
                      size="xs"
                      disabled={activeWorkflowStep >= 2}
                      onClick={() =>
                        setActiveWorkflowStep((s) => Math.min(2, s + 1))
                      }
                    >
                      Sonraki Adım →
                    </Button>
                  </div>
                </div>
              </Card>

              <Card
                variant="tonal"
                padding="md"
                title="Kurumsal Denetim & Aktivite Akışı (<Timeline />)"
                subtitle="Zaman damgalı işlem geçmişi ve durum izleme bileşeni"
              >
                <Timeline
                  items={[
                    {
                      id: 't1',
                      title: 'GİB e-Fatura Zarfı Onaylandı',
                      description: 'ETTN: 9482-4810-AB21 • Otomatik muhasebeleşti.',
                      timestamp: '10:42',
                      tone: 'success',
                      badge: 'GİB #200',
                    },
                    {
                      id: 't2',
                      title: 'Hazine Onayı Bekleniyor',
                      description: '₺148.500,00 ödeme emri çift imza kuyruğunda.',
                      timestamp: '09:15',
                      tone: 'warning',
                      badge: 'Onayda',
                    },
                    {
                      id: 't3',
                      title: 'SheetGL Veri Kümesi Güncellendi',
                      description: '10.000 satırlık stok hareketi içe aktarıldı.',
                      timestamp: 'Dün',
                      tone: 'primary',
                    },
                  ]}
                />
              </Card>
            </div>
          </div>
        );

      case 'datatable-statcard':
        return (
          <div className="uxu-stage-showcase">
            <div className="uxu-stage-grid-2">
              <StatCard
                label="Toplam Bulut İşlem Kapasitesi"
                value="148.6 TFLOPS"
                delta="+18.4%"
                trend="up"
                tone={semanticTone}
                subtitle="Son 24 saatlik küme ortalaması"
                icon={<Cpu size={18} />}
                sparklineData={[32, 45, 41, 64, 72, 85, 96]}
              />
              <StatCard
                label="Küresel Uç Gecikmesi (Edge Latency)"
                value="11.2 ms"
                delta="-3.1 ms"
                trend="up"
                tone="success"
                subtitle="İstanbul • Frankfurt • Tokyo"
                icon={<Globe size={18} />}
                sparklineData={[22, 19, 17, 15, 14, 12, 11]}
              />
            </div>

            {/* 1. SheetGL Multi-Scenario WebGL Enterprise DataGrid */}
            <SheetGLGridAdapter initialRowCount={150} height={440} />

            {/* 2. Simple Lightweight Native HTML DataTable */}
            <Card
              variant="tonal"
              padding="md"
              eyebrow="UXIGL NATIVE HTML TABLE (BASİT VE HAFİF TABLO)"
              title="Basit Native Tablo Tasarımı (<DataTable />)"
              subtitle="Sıfır WebGL yüküyle çalışan, 4 görsel varyantlı ve satır seçimi destekli semantik HTML tablo"
              headerAction={
                <SegmentedControl
                  size="sm"
                  value={playgroundTableVariant}
                  onChange={setPlaygroundTableVariant}
                  options={[
                    { value: 'default', label: 'Standart' },
                    { value: 'striped', label: 'Zebra' },
                    { value: 'bordered', label: 'Çerçeveli' },
                    { value: 'minimal', label: 'Minimal' },
                  ]}
                />
              }
            >
              <DataTable
                rowKey="id"
                variant={playgroundTableVariant}
                size={
                  controlSize === 'xs' || controlSize === 'sm'
                    ? 'sm'
                    : controlSize === 'lg' || controlSize === 'xl'
                    ? 'lg'
                    : 'md'
                }
                selectable
                data={[
                  {
                    id: '1',
                    module: '@uxigl/core-tokens',
                    version: `v${__UXIGL_VERSION__}`,
                    bundleSize: '4.2 kB',
                    status: 'Stable',
                  },
                  {
                    id: '2',
                    module: '@uxigl/native-table',
                    version: `v${__UXIGL_VERSION__}`,
                    bundleSize: '3.1 kB',
                    status: 'Stable',
                  },
                  {
                    id: '3',
                    module: 'sheetgl-adapter',
                    version: 'v2.0.0',
                    bundleSize: '60.7 kB (gzip)',
                    status: 'WebGL',
                  },
                  {
                    id: '4',
                    module: 'filemangl-vfs',
                    version: 'v1.0.4',
                    bundleSize: '93.1 kB (gzip)',
                    status: 'WebGL2',
                  },
                ]}
                columns={[
                  {
                    key: 'module',
                    header: 'Paket Adı',
                    sortable: true,
                    render: (r) => (
                      <code className="uxu-prop-name">{String(r.module)}</code>
                    ),
                  },
                  {
                    key: 'version',
                    header: 'Sürüm',
                    sortable: true,
                  },
                  {
                    key: 'bundleSize',
                    header: 'Boyut',
                    sortable: true,
                  },
                  {
                    key: 'status',
                    header: 'Mimari',
                    align: 'right',
                    render: (r) => (
                      <Badge
                        size={controlSize === 'lg' ? 'sm' : 'xs'}
                        pill={isPill}
                        tone={r.status === 'Stable' ? 'success' : semanticTone}
                      >
                        {String(r.status)}
                      </Badge>
                    ),
                  },
                ]}
              />
              <div style={{ marginTop: 14 }}>
                <Pagination
                  page={tablePage}
                  totalPages={8}
                  totalItems={76}
                  pageSize={tablePageSize}
                  onPageChange={setTablePage}
                  onPageSizeChange={setTablePageSize}
                />
              </div>
            </Card>
          </div>
        );

      case 'filemangl-explorer':
        return (
          <div className="uxu-stage-showcase">
            <FileManGLExplorerAdapter height={540} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="uxu-playground-main">
      {/* 1. Component Header & Copyable Import Bar */}
      <Card variant="glass" padding="md" className="uxu-component-hero">
        <div className="uxu-component-hero__top">
          <div>
            <div className="uxu-component-hero__badges">
              <Badge tone="primary" variant="tonal" size="xs">
                {activeEntry.importPath}
              </Badge>
              <Badge tone="info" variant="tonal" size="xs">
                Route: {RouteService.buildComponentPath(activeEntry.id)}
              </Badge>
              <Badge tone="success" variant="outlined" size="xs">
                {activeEntry.examples.length} Örnek
              </Badge>
              <Badge tone="info" variant="outlined" size="xs">
                {activeEntry.propsTable.length} Prop
              </Badge>
            </div>
            <h1 className="uxu-component-hero__title">
              {activeEntry.name}{' '}
              <span className="uxu-component-hero__subtitle">
                — {activeEntry.turkishTitle}
              </span>
            </h1>
            <p className="uxu-component-hero__desc">{activeEntry.summary}</p>
          </div>
        </div>

        {/* Copyable Import Bar */}
        <div className="uxu-import-bar">
          <code className="uxu-import-bar__code">
            {CodeGeneratorService.tokenize(activeEntry.importStatement).map(
              (tok, idx) =>
                tok.type === 'plain' ? (
                  <React.Fragment key={idx}>{tok.value}</React.Fragment>
                ) : (
                  <span key={idx} className={`uxu-syn-${tok.type}`}>
                    {tok.value}
                  </span>
                )
            )}
          </code>
          <Button
            variant="tonal"
            size="xs"
            leadingIcon={
              copiedText === activeEntry.importStatement ? (
                <Check size={13} />
              ) : (
                <Copy size={13} />
              )
            }
            onClick={() => {
              copy(activeEntry.importStatement);
              notify({
                title: 'Kopyalandı',
                description: activeEntry.importStatement,
                tone: 'success',
              });
            }}
          >
            {copiedText === activeEntry.importStatement
              ? 'Kopyalandı'
              : 'Kopyala'}
          </Button>
        </div>
      </Card>

      {/* 2. Live Interactive Sandbox + Prop Inspector */}
      <div className="uxu-stage-and-inspector">
        <Card
          variant="glass"
          padding="md"
          title="Canlı Önizleme"
          subtitle="Sağ panelden özellikleri değiştirin"
          headerIcon={<Sliders size={17} />}
        >
          {renderLiveStage(activeEntry.id)}
        </Card>

        {/* Right Live Prop Controls (Context-Aware Inspector) */}
        <Card
          variant="tonal"
          padding="md"
          title="Prop Ayarları"
          subtitle={`${activeEntry.name.split(',')[0]} için canlı denetçi`}
          headerIcon={<Sliders size={16} />}
          headerAction={
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setControlSize('md');
                setSemanticTone('primary');
                setBtnVariant('filled');
                setInputSurface('glass');
                setSurfaceVariant('glass');
                setPlaygroundTableVariant('default');
                setIsDisabled(false);
                setIsLoading(false);
                setIsPill(false);
                setInputError(false);
                setSliderValue(72);
                setAnimDurationSec(3.2);
                setSkeletonAnimated(true);
              }}
            >
              Sıfırla
            </Button>
          }
        >
          <div className="uxu-inspector-controls">
            {/* 1. Universal Size Selector */}
            <div className="uxu-inspector-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="uxu-inspector-label">Boyut (size)</span>
                <Badge size="xs" tone="info" variant="outlined">
                  {controlSize.toUpperCase()}
                </Badge>
              </div>
              <SegmentedControl<ComponentSize>
                value={controlSize}
                onChange={setControlSize}
                size="sm"
                fullWidth
                options={[
                  { value: 'xs', label: 'XS' },
                  { value: 'sm', label: 'SM' },
                  { value: 'md', label: 'MD' },
                  { value: 'lg', label: 'LG' },
                ]}
              />
            </div>

            {/* 2. Universal Semantic Tone Selector */}
            <div className="uxu-inspector-group">
              <span className="uxu-inspector-label">Anlamsal Ton (tone)</span>
              <div className="uxu-tone-chips">
                {(
                  [
                    'primary',
                    'success',
                    'warning',
                    'danger',
                    'info',
                  ] as SemanticTone[]
                ).map((t) => (
                  <Chip
                    key={t}
                    size="sm"
                    tone={t}
                    selected={semanticTone === t}
                    onClick={() => setSemanticTone(t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            {/* 2.5 Global & Component Border Radius Control */}
            <div className="uxu-inspector-group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span className="uxu-inspector-label">
                  Border Radius (Köşe Yuvarlaklığı)
                </span>
                <Badge size="xs" tone="primary" variant="tonal">
                  {currentRadiusPx}px
                </Badge>
              </div>
              <SegmentedControl<RadiusScale>
                value={preferences.radiusScale}
                onChange={(scale) => {
                  setRadiusScale(scale);
                  setIsPill(scale === 'pill');
                }}
                size="sm"
                fullWidth
                options={[
                  { value: 'sharp', label: 'Keskin' },
                  { value: 'squircle', label: 'Squircle' },
                  { value: 'pill', label: 'Kapsül' },
                ]}
              />
              <Slider
                label="Hassas Border Radius (px)"
                value={currentRadiusPx}
                min={0}
                max={32}
                step={1}
                size="sm"
                valueSuffix="px"
                tone={semanticTone}
                onChange={(px) => {
                  setCustomRadiusPx(px);
                  setIsPill(px >= 20);
                }}
              />
            </div>

            {/* 3. Component-Specific Quick Controls */}
            {activeEntry.id === 'button' && (
              <>
                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">
                    Buton Davranış Modu (mode)
                  </span>
                  <div className="uxu-tone-chips">
                    {(
                      [
                        { id: 'standard', label: 'Standart' },
                        { id: 'switch-toggle', label: 'Switch Buton' },
                        { id: 'collapse-expand', label: 'Collapse/Expand' },
                        { id: 'split', label: 'Split Buton' },
                        { id: 'icon-only', label: 'Icon-Only' },
                      ] as const
                    ).map((m) => (
                      <Chip
                        key={m.id}
                        size="xs"
                        tone="info"
                        selected={buttonMode === m.id}
                        onClick={() => setButtonMode(m.id)}
                      >
                        {m.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">Buton Varyantı (variant)</span>
                  <div className="uxu-tone-chips">
                    {(
                      [
                        'filled',
                        'tonal',
                        'glass',
                        'outlined',
                        'ghost',
                        'success',
                        'warning',
                        'danger',
                      ] as ButtonVariant[]
                    ).map((v) => (
                      <Chip
                        key={v}
                        size="xs"
                        tone="primary"
                        selected={btnVariant === v}
                        onClick={() => setBtnVariant(v)}
                      >
                        {v}
                      </Chip>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeEntry.id === 'input' && (
              <>
                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">Giriş Yüzeyi (surface)</span>
                  <SegmentedControl<InputSurfaceStyle>
                    value={inputSurface}
                    onChange={setInputSurface}
                    size="sm"
                    fullWidth
                    options={[
                      { value: 'glass', label: 'Glass' },
                      { value: 'tonal', label: 'Tonal' },
                      { value: 'outlined', label: 'Outlined' },
                    ]}
                  />
                </div>

                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">
                    Doğrulama Durumu (validationState)
                  </span>
                  <div className="uxu-tone-chips">
                    {(
                      ['default', 'success', 'warning', 'error'] as InputValidationState[]
                    ).map((st) => (
                      <Chip
                        key={st}
                        size="xs"
                        tone={
                          st === 'error'
                            ? 'danger'
                            : st === 'default'
                            ? 'primary'
                            : st
                        }
                        selected={inputValidation === st}
                        onClick={() => {
                          setInputValidation(st);
                          setInputError(st === 'error');
                        }}
                      >
                        {st}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">
                    Format Maskesi (mask)
                  </span>
                  <div className="uxu-tone-chips">
                    {(
                      ['none', 'phone', 'iban', 'tax-id', 'credit-card'] as const
                    ).map((msk) => (
                      <Chip
                        key={msk}
                        size="xs"
                        tone="info"
                        selected={inputMaskPreset === msk}
                        onClick={() => setInputMaskPreset(msk)}
                      >
                        {msk}
                      </Chip>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeEntry.id === 'modal-command' && (
              <>
                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">
                    Toast Ekran Yönü (placement)
                  </span>
                  <div className="uxu-tone-chips">
                    {(
                      [
                        'top-left',
                        'top-center',
                        'top-right',
                        'bottom-left',
                        'bottom-right',
                      ] as ToastPlacement[]
                    ).map((pos) => (
                      <Chip
                        key={pos}
                        size="xs"
                        tone="info"
                        selected={toastPlacement === pos}
                        onClick={() => setToastPlacement(pos)}
                      >
                        {pos}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="uxu-inspector-group">
                  <span className="uxu-inspector-label">
                    Toast Renk Tonu (tone)
                  </span>
                  <div className="uxu-tone-chips">
                    {(
                      [
                        'primary',
                        'success',
                        'warning',
                        'danger',
                        'info',
                        'glass',
                      ] as ToastTone[]
                    ).map((t) => (
                      <Chip
                        key={t}
                        size="xs"
                        tone={t === 'glass' ? 'primary' : t}
                        selected={toastTone === t}
                        onClick={() => setToastTone(t)}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(activeEntry.id === 'card' || activeEntry.id === 'tabs-accordion') && (
              <div className="uxu-inspector-group">
                <span className="uxu-inspector-label">Yüzey Stili (variant)</span>
                <SegmentedControl<SurfaceVariant>
                  value={surfaceVariant}
                  onChange={setSurfaceVariant}
                  size="sm"
                  fullWidth
                  options={[
                    { value: 'glass', label: 'Glass' },
                    { value: 'tonal', label: 'Tonal' },
                    { value: 'elevated', label: 'Elevated' },
                    { value: 'outlined', label: 'Outlined' },
                  ]}
                />
              </div>
            )}

            {activeEntry.id === 'progress-avatar' && (
              <div className="uxu-inspector-group">
                <Slider
                  label="İlerleme Değeri (%)"
                  value={sliderValue}
                  min={0}
                  max={100}
                  step={1}
                  size="sm"
                  valueSuffix="%"
                  tone={semanticTone}
                  onChange={setSliderValue}
                />
                <Slider
                  label="Animasyon Süresi (sn)"
                  value={animDurationSec}
                  min={0.8}
                  max={6.0}
                  step={0.2}
                  size="sm"
                  valueSuffix=" sn"
                  tone="info"
                  onChange={setAnimDurationSec}
                />
              </div>
            )}

            {activeEntry.id === 'datatable-statcard' && (
              <div className="uxu-inspector-group">
                <span className="uxu-inspector-label">Native Tablo Stili</span>
                <SegmentedControl<NativeTableVariant>
                  value={playgroundTableVariant}
                  onChange={setPlaygroundTableVariant}
                  size="sm"
                  fullWidth
                  options={[
                    { value: 'default', label: 'Standart' },
                    { value: 'striped', label: 'Zebra' },
                    { value: 'bordered', label: 'Çerçeve' },
                    { value: 'minimal', label: 'Minimal' },
                  ]}
                />
              </div>
            )}

            {/* 4. State Toggles */}
            <div className="uxu-inspector-group">
              <Switch
                size="sm"
                label="Devre Dışı (disabled)"
                value={isDisabled}
                onChange={setIsDisabled}
              />
              <Switch
                size="sm"
                label={
                  activeEntry.id === 'progress-avatar'
                    ? 'Belirsiz Döngü (indeterminate)'
                    : 'Yükleniyor (loading)'
                }
                value={isLoading}
                onChange={setIsLoading}
              />
              <Switch
                size="sm"
                label={
                  activeEntry.id === 'progress-avatar'
                    ? 'Daire Kesim (circle / squircle)'
                    : activeEntry.id === 'tabs-accordion'
                    ? 'Kapsül Sekme (pill / underline)'
                    : 'Kapsül Köşe (pill)'
                }
                value={isPill}
                onChange={setIsPill}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Auto-Generated Code & Real-World Practical Examples */}
      <div className="uxu-stage-grid-2">
        <Card
          variant="glass"
          padding="md"
          title="Üretilen Kod (TSX)"
          subtitle="Seçili prop değerlerine göre güncellenir"
          headerIcon={<Code2 size={17} />}
          headerAction={
            <Button
              variant="tonal"
              size="xs"
              leadingIcon={
                copiedText === generatedCode ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} />
                )
              }
              onClick={() => {
                copy(generatedCode);
                notify({
                  title: 'Kod Kopyalandı',
                  description: `${activeEntry.name} kodu panoda.`,
                  tone: 'success',
                });
              }}
            >
              {copiedText === generatedCode ? 'Kopyalandı' : 'Kopyala'}
            </Button>
          }
        >
          <pre className="uxu-code-block">
            <code>
              {CodeGeneratorService.tokenize(generatedCode).map((tok, idx) =>
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
        </Card>

        <Card
          variant="glass"
          padding="md"
          title="Kullanım Örnekleri"
          subtitle="Hazır kod şablonları"
          headerIcon={<Sparkles size={17} />}
        >
          <div className="uxu-stack-md">
            {activeEntry.examples.map((ex) => (
              <div key={ex.id} className="uxu-code-panel-wrapper">
                <div className="uxu-code-panel-header">
                  <div>
                    <strong>{ex.title}</strong>
                    <div className="uxu-text-xs">{ex.description}</div>
                  </div>
                  <Button
                    variant="tonal"
                    size="xs"
                    leadingIcon={
                      copiedText === ex.code ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )
                    }
                    onClick={() => {
                      copy(ex.code);
                      notify({
                        title: 'Örnek Kopyalandı',
                        description: ex.title,
                        tone: 'success',
                      });
                    }}
                  >
                    {copiedText === ex.code ? 'Kopyalandı' : 'Kopyala'}
                  </Button>
                </div>
                <pre className="uxu-code-block">
                  <code>
                    {CodeGeneratorService.tokenize(ex.code).map((tok, idx) =>
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
            ))}
          </div>
        </Card>
      </div>

      {/* 4. UX Best Practices: Do's, Don'ts & Accessibility */}
      <div className="uxu-bento-grid">
        <Card
          variant="glass"
          padding="md"
          title="Doğru Kullanım"
          subtitle="Önerilen pratikler"
          headerIcon={
            <CheckCircle2 size={17} style={{ color: 'var(--uxu-success)' }} />
          }
        >
          <ul className="uxu-guideline-list uxu-guideline-list--do">
            {activeEntry.dos.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card
          variant="glass"
          padding="md"
          title="Kaçınılması Gerekenler"
          subtitle="Yaygın hatalar"
          headerIcon={
            <XCircle size={17} style={{ color: 'var(--uxu-danger)' }} />
          }
        >
          <ul className="uxu-guideline-list uxu-guideline-list--dont">
            {activeEntry.donts.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card
          variant="tonal"
          padding="md"
          title="Erişilebilirlik (A11y)"
          subtitle="Klavye & ARIA"
          headerIcon={<Keyboard size={17} />}
        >
          <ul className="uxu-guideline-list">
            {activeEntry.accessibilityNotes.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 5. Props API Reference Table */}
      <Card
        variant="glass"
        padding="md"
        title={`${activeEntry.name} — Props API`}
        subtitle="Özellikler, veri tipleri ve varsayılanlar"
        headerIcon={<BookOpen size={17} />}
      >
        <div className="uxu-table-scroll">
          <table className="uxu-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Tip</th>
                <th>Varsayılan</th>
                <th>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {activeEntry.propsTable.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code className="uxu-prop-name">{prop.name}</code>
                    {prop.required && (
                      <Badge tone="danger" size="xs" className="uxu-ml-1">
                        Zorunlu
                      </Badge>
                    )}
                  </td>
                  <td>
                    <code className="uxu-prop-type">{prop.type}</code>
                  </td>
                  <td>
                    <code className="uxu-prop-default">
                      {prop.defaultValue}
                    </code>
                  </td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
