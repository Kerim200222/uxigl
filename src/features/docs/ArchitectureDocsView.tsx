import React, { useState } from 'react';
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
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  RadiusScale,
  ThemeMode,
  UIDensity,
  WebGLShaderPreset,
} from '../../core/contracts/ThemeContract';

export type DocsTopicId =
  | 'getting-started'
  | 'theming-tokens'
  | 'layout-shell'
  | 'cli-shortcuts'
  | 'page-templates';

export interface ArchitectureDocsViewProps {
  activeTopic?: DocsTopicId;
  onTopicChange?: (topic: DocsTopicId) => void;
  onSelectComponent?: (componentId: string) => void;
  onOpenCommandPalette?: () => void;
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
      subtitle="Liquid Glass Cam Yüzeyi × Google Material You Tonal Kontroller"
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
              title: 'Bağlantı Başarılı!',
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

const THEME_HOOK_SNIPPET = `import { useTheme, Button } from 'truncgil-uxigl';

export function ThemeSwitcherButton() {
  const {
    resolvedMode,
    preferences,
    toggleMode,
    setSeedPalette,
    setRadiusScale,
  } = useTheme();

  return (
    <div className="uxu-stage-row">
      <Button variant="filled" onClick={toggleMode}>
        Aktif Mod: {resolvedMode.toUpperCase()}
      </Button>
      <Button variant="tonal" onClick={() => setSeedPalette('material-violet')}>
        Material Iris Paletine Geç
      </Button>
      <Button variant="glass" onClick={() => setRadiusScale('squircle')}>
        Squircle Köşe
      </Button>
    </div>
  );
}`;

const LAYOUT_SHELL_SNIPPET = `import { Sidebar, TopHeader, type SidebarNavGroup } from 'truncgil-uxigl';
import { LayoutDashboard } from 'lucide-react';

const SIDEBAR_GROUPS: SidebarNavGroup[] = [
  {
    id: 'main',
    title: 'OPERASYON & YÖNETİM',
    items: [
      {
        id: 'dashboard',
        label: 'Komuta Merkezi',
        icon: <LayoutDashboard size={18} />,
        badge: 'Canlı',
        badgeTone: 'success',
        subItems: [
          { id: 'overview', label: 'Genel Bakış', badge: '4 KPI' },
          { id: 'analytics', label: 'Gelir Analitiği', badge: '+22%' },
        ],
      },
    ],
  },
];

export function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="uxu-app-frame">
      <Sidebar groups={SIDEBAR_GROUPS} />
      <div className="uxu-app-body">
        <TopHeader breadcrumbs={[{ id: '1', label: 'Ana Sayfa' }]} />
        <main className="uxu-workspace-viewport">{children}</main>
      </div>
    </div>
  );
}`;

const TOAST_CMD_SNIPPET = `import { useToast, useKeyboardShortcut } from 'truncgil-uxigl';

export function NotificationAndShortcutDemo() {
  const { notify } = useToast();

  // Global Cmd/Ctrl + K kısayolunu dinle
  useKeyboardShortcut('k', () => {
    console.log('Komut paleti açıldı!');
  }, { metaOrCtrl: true });

  const handleSave = () => {
    notify({
      title: 'Ayarlar Kaydedildi',
      description: 'Değişiklikler tüm bulut düğümlerine uygulandı.',
      tone: 'success',
      actionLabel: 'Geri Al',
      onAction: () => console.log('Geri alındı'),
    });
  };

  return <button onClick={handleSave}>Kaydet</button>;
};`;

export const ArchitectureDocsView: React.FC<ArchitectureDocsViewProps> = ({
  activeTopic = 'getting-started',
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

  const [internalTopic, setInternalTopic] =
    useState<DocsTopicId>('getting-started');
  const currentTopic = activeTopic ?? internalTopic;

  const handleTopicSelect = (topic: DocsTopicId) => {
    setInternalTopic(topic);
    onTopicChange?.(topic);
  };

  // Interactive states for the "Get Started" live mini-app card
  const [demoEmail, setDemoEmail] = useState('mimar@uxigl.dev');
  const [demoPass, setDemoPass] = useState('••••••••••••');
  const [demoRemember, setDemoRemember] = useState(true);
  const [docsPageTemplate, setDocsPageTemplate] =
    useState<PageTemplateId>('page-login');

  const activeColorSet =
    resolvedMode === 'dark' ? activePalette.dark : activePalette.light;

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
                title: 'Kod Panoya Kopyalandı',
                description: title,
                tone: 'success',
              });
            }}
          >
            {isCopied ? 'Kopyalandı' : 'Kodu Kopyala'}
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
      {/* Top Documentation Navigation Header */}
      <Card
        variant="glass"
        padding="md"
        eyebrow="UXIGL GELİŞTİRİCİ REHBERİ"
        title="uxiGL Hızlı Başlangıç & Sistem Dokümantasyonu"
        subtitle="Kurulum, tema/font ölçekleme, yerleşim ve tüm bileşenlerin uygulamalı kullanımı."
        headerIcon={<Rocket size={20} />}
        headerAction={
          <Badge tone="primary" variant="tonal" pulse size="sm">
            v{__UXIGL_VERSION__}
          </Badge>
        }
      >
        <SegmentedControl<DocsTopicId>
          value={currentTopic}
          onChange={handleTopicSelect}
          fullWidth
          options={[
            {
              value: 'getting-started',
              label: '1. Kurulum',
              href: '/docs/getting-started',
              icon: <Rocket size={14} />,
            },
            {
              value: 'theming-tokens',
              label: '2. Tema & Font',
              href: '/docs/theming-tokens',
              icon: <Palette size={14} />,
            },
            {
              value: 'layout-shell',
              label: '3. Yerleşim',
              href: '/docs/layout-shell',
              icon: <Layout size={14} />,
            },
            {
              value: 'cli-shortcuts',
              label: '4. Bildirim & ⌘K',
              href: '/docs/cli-shortcuts',
              icon: <Bell size={14} />,
            },
            {
              value: 'page-templates',
              label: '5. Sayfa Şablonları',
              href: '/docs/page-templates',
              icon: <Layers size={14} />,
            },
          ]}
        />
      </Card>

      {/* =====================================================================
       * SECTION 1: GETTING STARTED (KURULUM & İLK UYGULAMALI BİLEŞEN)
       * ===================================================================== */}
      {currentTopic === 'getting-started' && (
        <div className="uxu-stack-md">
          <div className="uxu-stage-grid-2">
            <Card
              variant="glass"
              title="Adım 1 — Kurulum & Sağlayıcı (Provider) Yapılandırması"
              subtitle="Uygulamanızı ThemeProvider ve ToastProvider ile sarmalayın"
              headerIcon={<Terminal size={19} />}
            >
              <div className="uxu-stack-md">
                <p className="uxu-muted-p">
                  uxiGL Design System; tüm renk, köşe yuvarlaklığı, yoğunluk ve
                  cam bulanıklığı değişkenlerini <code>ThemeProvider</code>{' '}
                  üzerinden, bildirimleri ise <code>ToastProvider</code>{' '}
                  üzerinden yönetir.
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
              title="Adım 2 — İlk Uygulamalı Bileşeninizi Oluşturun"
              subtitle="Aşağıdaki canlı formu deneyin ve sağ üstten kodunu kopyalayın"
              headerIcon={<Code2 size={19} />}
            >
              <div className="uxu-stack-md">
                {/* Live Interactive Demo Card */}
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
        </div>
      )}

      {/* =====================================================================
       * SECTION 2: THEMING, DARK/LIGHT MODE & DESIGN TOKENS
       * ===================================================================== */}
      {currentTopic === 'theming-tokens' && (
        <div className="uxu-stack-md">
          <div className="uxu-stage-grid-2">
            <Card
              variant="glass"
              title="Canlı Tema & Görünüm Laboratuvarı"
              subtitle="Buradan yaptığınız her değişiklik anında tüm uygulamaya uygulanır"
              headerIcon={<Palette size={19} />}
            >
              <div className="uxu-stack-md">
                <div>
                  <div className="uxu-field__label" style={{ marginBottom: 6 }}>
                    1. Görünüm Modu (Light / Dark / System Auto)
                  </div>
                  <SegmentedControl<ThemeMode>
                    value={preferences.mode}
                    onChange={setMode}
                    fullWidth
                    size="sm"
                    options={[
                      {
                        value: 'light',
                        label: 'Aydınlık (Light)',
                        icon: <Sun size={14} />,
                      },
                      {
                        value: 'dark',
                        label: 'Karanlık (Dark)',
                        icon: <Moon size={14} />,
                      },
                      {
                        value: 'system',
                        label: 'Sistem Otomatik',
                        icon: <Monitor size={14} />,
                      },
                    ]}
                  />
                </div>

                <div>
                  <div className="uxu-field__label" style={{ marginBottom: 8 }}>
                    2. Tohum Renk Paletleri (Tıklayarak Değiştirin)
                  </div>
                  <div className="uxu-palette-grid">
                    {availablePalettes.map((p) => {
                      const isSelected = preferences.seedPalette === p.id;
                      const colors =
                        resolvedMode === 'dark' ? p.dark : p.light;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSeedPalette(p.id)}
                          className={`uxu-palette-card ${
                            isSelected ? 'uxu-palette-card--active' : ''
                          }`}
                        >
                          <div className="uxu-palette-card__swatches">
                            <span style={{ background: colors.primary }} />
                            <span
                              style={{ background: colors.primaryContainer }}
                            />
                            <span style={{ background: colors.secondary }} />
                          </div>
                          <div className="uxu-palette-card__info">
                            <strong>{p.name}</strong>
                            <small>{p.description}</small>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="uxu-stage-grid-2">
                  <SegmentedControl<RadiusScale>
                    label="3. Köşe Yuvarlaklığı (Border Radius)"
                    value={preferences.radiusScale}
                    onChange={setRadiusScale}
                    fullWidth
                    size="sm"
                    options={[
                      { value: 'sharp', label: 'Keskin' },
                      { value: 'squircle', label: 'Squircle' },
                      { value: 'pill', label: 'Kapsül' },
                    ]}
                  />
                  <SegmentedControl<UIDensity>
                    label="4. Arayüz Yoğunluğu"
                    value={preferences.density}
                    onChange={setDensity}
                    fullWidth
                    size="sm"
                    options={[
                      { value: 'compact', label: 'Kompakt' },
                      { value: 'comfortable', label: 'Dengeli' },
                      { value: 'spacious', label: 'Ferah' },
                    ]}
                  />
                </div>

                <Slider
                  label="Hassas Border Radius (px)"
                  value={preferences.customRadiusPx ?? 12}
                  onChange={setCustomRadiusPx}
                  min={0}
                  max={32}
                  step={1}
                  showTicks
                  valueSuffix="px"
                />

                <Slider
                  label="5. Genel Yazı Boyutu (Font Ölçeği)"
                  value={preferences.fontScale ?? 100}
                  onChange={setFontScale}
                  min={80}
                  max={125}
                  step={5}
                  showTicks
                  valueSuffix="%"
                />

                <Slider
                  label="6. Cam Bulanıklığı (Backdrop Blur)"
                  value={preferences.glassIntensity}
                  onChange={setGlassIntensity}
                  valueSuffix="%"
                />

                <Switch
                  label="7. Opsiyonel WebGL Ambiyansı (Varsayılan: Kapalı)"
                  description="Kapalıyken 0% GPU yükü. Açıldığında hafif ambiyans arka planı çalışır."
                  value={preferences.webglEnabled}
                  onChange={setWebglEnabled}
                  size="sm"
                />

                {preferences.webglEnabled && (
                  <div className="uxu-stage-grid-2">
                    <SegmentedControl<WebGLShaderPreset>
                      label="WebGL Modu"
                      value={preferences.webglPreset}
                      onChange={setWebglPreset}
                      fullWidth
                      size="sm"
                      options={[
                        { value: 'aurora-borealis', label: 'Aurora' },
                        { value: 'spatial-nebula', label: 'Nebula' },
                        { value: 'material-lava', label: 'Küreler' },
                      ]}
                    />
                    <Slider
                      label="WebGL Yoğunluğu"
                      value={preferences.webglIntensity}
                      onChange={setWebglIntensity}
                      min={15}
                      max={80}
                      step={5}
                      valueSuffix="%"
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card
              variant="tonal"
              title="useTheme() Kancası & Aktif CSS Değişkenleri"
              subtitle="Bileşenlerinizde tema durumunu okuma ve değiştirme"
              headerIcon={<Code2 size={19} />}
            >
              <div className="uxu-stack-md">
                {renderCodeBox(
                  'useTheme() Uygulamalı Kullanımı',
                  THEME_HOOK_SNIPPET
                )}

                <div className="uxu-field__label">
                  Aktif CSS Değişkenleri (Tıklayarak Kopyalayın):
                </div>
                <div className="uxu-token-swatch-grid">
                  {[
                    {
                      token: '--uxu-primary',
                      val: activeColorSet.primary,
                    },
                    {
                      token: '--uxu-primary-container',
                      val: activeColorSet.primaryContainer,
                    },
                    {
                      token: '--uxu-on-primary-container',
                      val: activeColorSet.onPrimaryContainer,
                    },
                    {
                      token: '--uxu-secondary',
                      val: activeColorSet.secondary,
                    },
                  ].map((item) => (
                    <div
                      key={item.token}
                      className="uxu-token-swatch"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        copy(`var(${item.token})`);
                        notify({
                          title: 'Token Kopyalandı',
                          description: `var(${item.token}) — ${item.val}`,
                          tone: 'info',
                        });
                      }}
                    >
                      <span
                        className="uxu-token-swatch__color"
                        style={{ background: item.val }}
                      />
                      <div>
                        <strong>{item.token}</strong>
                        <code>{item.val}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* GOOGLE FONTS & GOOGLE MATERIAL SYMBOLS INTERACTIVE STUDIO */}
          <Card
            variant="glass"
            eyebrow="GOOGLE FONTS × GOOGLE MATERIAL SYMBOLS VARIABLE ICONS"
            title="Google Fonts Tipografi Aileleri & Değişken Font İkonları (<GoogleIcon />)"
            subtitle="5 Google Font eşleşmesi (Inter, Plus Jakarta Sans, Outfit, DM Sans, Space Grotesk, JetBrains Mono, Fira Code) ve 4 eksenli (FILL, wght, GRAD, opsz) Google Material Symbols (Rounded / Outlined / Sharp)"
            headerIcon={<GoogleIcon name="font_download" tone="primary" size={22} />}
          >
            <div className="uxu-stage-grid-2">
              <div className="uxu-stack-md">
                <div className="uxu-field__label">
                  1. Google Fonts Ailesi Seçimi (Tüm Uygulamaya Anında Uygulanır)
                </div>
                <div className="uxu-palette-grid">
                  {availableFontPresets.map((preset) => {
                    const isSelected =
                      (preferences.fontFamilyPreset ?? 'inter-jakarta') ===
                      preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setFontFamilyPreset(preset.id as FontFamilyPreset)
                        }
                        className={`uxu-palette-card ${
                          isSelected ? 'uxu-palette-card--active' : ''
                        }`}
                        style={{ fontFamily: preset.sansStack }}
                      >
                        <div className="uxu-palette-card__info">
                          <strong style={{ fontFamily: preset.displayStack }}>
                            {preset.name}
                          </strong>
                          <small>{preset.badge}</small>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <SegmentedControl<GoogleIconStyle>
                  label="2. Google Material Symbols İkon Ailesi"
                  value={preferences.iconStyle ?? 'rounded'}
                  onChange={setIconStyle}
                  fullWidth
                  size="sm"
                  options={[
                    { value: 'rounded', label: 'Material Symbols Rounded' },
                    { value: 'outlined', label: 'Material Symbols Outlined' },
                    { value: 'sharp', label: 'Material Symbols Sharp' },
                  ]}
                />

                <Slider
                  label="3. Değişken İkon Kalınlığı (wght: 100 – 700)"
                  value={preferences.iconWeight ?? 400}
                  onChange={setIconWeight}
                  min={100}
                  max={700}
                  step={100}
                  showTicks
                />

                <Switch
                  label="4. Dolgulu İkon Eksen Modu (FILL: 0 ↔ 1)"
                  description="Aktif edildiğinde tüm <GoogleIcon /> bileşenleri yumuşak geçişle dolgulu (filled) görünüm alır"
                  value={Boolean(preferences.iconFilled)}
                  onChange={setIconFilled}
                  size="sm"
                />
              </div>

              <div className="uxu-stack-md">
                <div className="uxu-field__label">
                  Canlı Google Material Symbols İkon Galerisi (Kopyalamak İçin Tıklayın)
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
                    gap: 10,
                  }}
                >
                  {[
                    { name: 'auto_awesome', tone: 'primary' as const },
                    { name: 'dashboard', tone: 'info' as const },
                    { name: 'palette', tone: 'secondary' as const },
                    { name: 'table_chart', tone: 'success' as const },
                    { name: 'folder_open', tone: 'warning' as const },
                    { name: 'bolt', tone: 'danger' as const },
                    { name: 'verified', tone: 'primary' as const },
                    { name: 'deployed_code', tone: 'info' as const },
                    { name: 'terminal', tone: 'secondary' as const },
                    { name: 'tune', tone: 'success' as const },
                    { name: 'rocket_launch', tone: 'warning' as const },
                    { name: 'shield_lock', tone: 'danger' as const },
                  ].map((item) => {
                    const snippet = `<GoogleIcon name="${item.name}" tone="${item.tone}" size={22} />`;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          copy(snippet);
                          notify({
                            title: 'GoogleIcon Kodu Kopyalandı',
                            description: snippet,
                            tone: 'success',
                          });
                        }}
                        className="uxu-token-swatch"
                        style={{
                          cursor: 'pointer',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          padding: '12px 8px',
                          gap: 6,
                        }}
                      >
                        <GoogleIcon
                          name={item.name}
                          tone={item.tone}
                          size={26}
                        />
                        <code style={{ fontSize: '0.7rem' }}>{item.name}</code>
                      </button>
                    );
                  })}
                </div>

                {renderCodeBox(
                  'GoogleIcon & Google Fonts Kullanımı',
                  `import { GoogleIcon } from '@/components/primitives';
import { useTheme } from '@/providers/ThemeProvider';

export function IconDemo() {
  const { setFontFamilyPreset, setIconStyle, setIconFilled } = useTheme();
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <GoogleIcon name="auto_awesome" tone="primary" size="lg" />
      <GoogleIcon name="table_chart" iconStyle="rounded" filled weight={500} />
      <GoogleIcon name="folder_open" iconStyle="sharp" tone="warning" size={24} />
    </div>
  );
}`
                )}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* =====================================================================
       * SECTION 3: FULL-SCREEN DASHBOARD & SIDEBAR SHELL
       * ===================================================================== */}
      {currentTopic === 'layout-shell' && (
        <div className="uxu-stage-grid-2">
          <Card
            variant="glass"
            title="Tam Ekran Dashboard İskeleti & Alt Menülü Sidebar"
            subtitle="100vw × 100vh ortalanmamış kurumsal yerleşim mimarisi"
            headerIcon={<Layout size={19} />}
          >
            <div className="uxu-stack-md">
              <p className="uxu-muted-p">
                uxiGL uygulama iskeleti <code>.uxu-app-frame</code> kapsayıcısı
                içinde sol tarafta hiyerarşik alt menülere sahip{' '}
                <code>&lt;Sidebar /&gt;</code> ve sağ tarafta{' '}
                <code>&lt;TopHeader /&gt;</code> +{' '}
                <code>.uxu-workspace-viewport</code> yapısından oluşur.
              </p>

              <div className="uxu-inspiration-box">
                <div className="uxu-inspiration-box__title">
                  Hazır Responsive Izgara (Grid) Sınıfları
                </div>
                <ul style={{ paddingLeft: 18, marginTop: 6, lineHeight: 1.7 }}>
                  <li>
                    <code>.uxu-kpi-grid</code> — Masaüstünde 4 sütun, tablette 2
                    sütun, mobilde 1 sütun KPI kart dizilimi.
                  </li>
                  <li>
                    <code>.uxu-bento-grid</code> — 3 sütunlu esnek Bento kart
                    ızgarası.
                  </li>
                  <li>
                    <code>.uxu-stage-grid-2</code> — 2 sütunlu (%50 - %50) form
                    ve içerik ızgarası.
                  </li>
                  <li>
                    <code>.uxu-dash-chart-and-feed</code> — Sol geniş grafik
                    (1.55fr) ve sağ canlı akış (1fr) düzeni.
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
            {renderCodeBox(
              'EnterpriseLayout.tsx — Sidebar & Alt Menü Yapılandırması',
              LAYOUT_SHELL_SNIPPET
            )}
          </Card>

          {/* Full Interactive Multi-Variant Sidebar Suite */}
          <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
            <SidebarShowcaseView />
          </div>
        </div>
      )}

      {/* =====================================================================
       * SECTION 4: TOAST NOTIFICATIONS & SPOTLIGHT COMMAND PALETTE (⌘K)
       * ===================================================================== */}
      {currentTopic === 'cli-shortcuts' && (
        <div className="uxu-stage-grid-2">
          <Card
            variant="glass"
            title="Canlı Bildirim (useToast) & Spotlight (⌘K) Test Sahnesi"
            subtitle="Farklı bildirim tonlarını ve klavye komut paletini hemen deneyin"
            headerIcon={<Bell size={19} />}
          >
            <div className="uxu-stack-md">
              <div className="uxu-field__label">
                1. Bildirim Tonlarını Canlı Tetikleyin:
              </div>
              <div className="uxu-stage-row">
                <Button
                  variant="filled"
                  size="sm"
                  onClick={() =>
                    notify({
                      title: 'Birincil Sistem Bildirimi',
                      description: 'Yeni çalışma alanı senkronize edildi.',
                      tone: 'primary',
                    })
                  }
                >
                  Primary Toast
                </Button>
                <Button
                  variant="tonal"
                  size="sm"
                  onClick={() =>
                    notify({
                      title: 'İşlem Başarıyla Tamamlandı',
                      description: 'Veritabanı yedeği alındı.',
                      tone: 'success',
                      actionLabel: 'İncele',
                      onAction: () => {},
                    })
                  }
                >
                  Success Toast
                </Button>
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() =>
                    notify({
                      title: 'Yüksek Bellek Kullanımı',
                      description: 'Küme #04 %88 kapasiteye ulaştı.',
                      tone: 'warning',
                    })
                  }
                >
                  Warning Toast
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() =>
                    notify({
                      title: 'Bağlantı Zaman Aşımı',
                      description: 'Frankfurt düğümüne ulaşılamadı.',
                      tone: 'danger',
                    })
                  }
                >
                  Danger Toast
                </Button>
              </div>

              <div className="uxu-stage-divider" />

              <div className="uxu-field__label">
                2. Global Spotlight Komut Paleti (⌘K / Ctrl+K):
              </div>
              <p className="uxu-muted-p">
                Uygulamanın herhangi bir yerinde klavyeden <kbd>⌘K</kbd> veya{' '}
                <kbd>Ctrl+K</kbd> tuşlarına basarak (veya aşağıdaki butona
                tıklayarak) tüm bileşenler ve sayfalar arasında arama
                yapabilirsiniz.
              </p>
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
      )}

      {/* =====================================================================
       * SECTION 5: READY-MADE ENTERPRISE PAGE TEMPLATES SUITE
       * ===================================================================== */}
      {currentTopic === 'page-templates' && (
        <div className="uxu-stack-md">
          <div className="uxu-stage-grid-2">
            <Card
              variant="glass"
              title="7 Hazır Kurumsal Sayfa Şablonu (Apple HIG × Material 3)"
              subtitle="Login, Register/2FA, Pricing, Profile, B2B e-Fatura, Kanban ve 404/Status"
              headerIcon={<Layers size={19} />}
            >
              <div className="uxu-stack-md">
                <p className="uxu-muted-p">
                  <code>truncgil-uxigl</code>; yalnızca atomik form ve yüzey
                  bileşenleri değil, aynı zamanda kurumsal SaaS projelerinde
                  doğrudan kullanabileceğiniz <strong>7 adet tam etkileşimli hazır
                  sayfa tasarımı</strong> sunar. Her şablon 8pt Apple HIG uzamsal
                  ızgarası ve Liquid Glass cam katmanlarıyla uyumludur.
                </p>

                <div className="uxu-inspiration-box">
                  <div className="uxu-inspiration-box__title">
                    Hazır Sayfa Rotaları &amp; Canlı Demo Geçişi
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    {(
                      [
                        {
                          id: 'page-login' as PageTemplateId,
                          title: '1. Login & Auth',
                          desc: 'Split-screen SSO, Passkey & iCloud Glass',
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
                            <code style={{ fontSize: '0.68rem', color: 'var(--uxu-primary)' }}>
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
  // 'page-login' | 'page-register' | 'page-pricing' | 'page-profile'
  // 'page-invoice' | 'page-kanban' | 'page-status'
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

          {/* Live Interactive Page Templates Demo Embedded Directly in Docs */}
          <PageTemplatesShowcaseView
            activePageId={docsPageTemplate}
            onPageChange={setDocsPageTemplate}
          />
        </div>
      )}

      {/* =====================================================================
       * ALL COMPONENTS INTERACTIVE DIRECTORY (QUICK JUMP CARDS)
       * ===================================================================== */}
      <Card
        variant="glass"
        padding="md"
        eyebrow="BİLEŞEN KATALOĞU"
        title="Bileşenlere Hızlı Geçiş"
        subtitle="Bileşene tıklayarak canlı önizleme ve Props API sayfasını açın."
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
                <span className="uxu-comp-dir-card__tr">{comp.turkishTitle}</span>
                <p className="uxu-comp-dir-card__desc">{comp.summary}</p>
                <div className="uxu-comp-dir-card__footer">
                  <code>{compHref}</code>
                  <span>{comp.propsTable.length} Prop • {comp.examples.length} Örnek</span>
                </div>
              </a>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
