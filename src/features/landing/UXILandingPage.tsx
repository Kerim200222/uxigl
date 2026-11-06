import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  BookOpen,
  Play,
  Copy,
  Check,
  Sun,
  Moon,
  Table2,
  HardDrive,
} from 'lucide-react';
import { UXILogo } from '../../components/brand/UXILogo';
import { GithubIcon } from '../../components/brand/GithubIcon';
import {
  Switch,
  Slider,
  Progress,
  Avatar,
  AvatarGroup,
  Chip,
  GoogleIcon,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  DataTable,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
} from '../../components/composites';
import { useTheme } from '../../providers/ThemeProvider';
import { RouteService } from '../../core/services/RouteService';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  RadiusScale,
  SeedPaletteId,
} from '../../core/contracts/ThemeContract';

export interface UXILandingPageProps {
  onNavigate: (sectionId: string, subItemId?: string) => void;
  onOpenCommandPalette: () => void;
}

type LandingPreviewTab = 'components' | 'sheetgl' | 'filemangl';

export const UXILandingPage: React.FC<UXILandingPageProps> = ({
  onNavigate,
  onOpenCommandPalette,
}) => {
  const {
    resolvedMode,
    preferences,
    availablePalettes,
    availableFontPresets,
    toggleMode,
    setSeedPalette,
    setRadiusScale,
    setCustomRadiusPx,
    setFontFamilyPreset,
    setIconStyle,
    setIconFilled,
  } = useTheme();

  const isDark = resolvedMode === 'dark';
  const [lang, setLang] = useState<'tr' | 'en'>('tr');
  const isTR = lang === 'tr';

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 860 : false
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<LandingPreviewTab>('components');
  const [installTab, setInstallTab] = useState<
    'npm' | 'npx' | 'pnpm' | 'yarn' | 'bun'
  >('npm');
  const [copiedCmdKey, setCopiedCmdKey] = useState<string | null>(null);
  const [showQuickUsage, setShowQuickUsage] = useState<boolean>(false);

  const copyCommand = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmdKey(key);
    setTimeout(() => {
      setCopiedCmdKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const installCommands = {
    npm: {
      label: 'npm',
      cmd: 'npm install truncgil-uxigl',
      hint: isTR
        ? 'Tek komutla uxiGL + SheetGL + FileManGL kurulumu'
        : 'Single-command install: uxiGL + SheetGL + FileManGL',
    },
    npx: {
      label: 'npx init',
      cmd: 'npx truncgil-uxigl init',
      hint: isTR
        ? 'Hazır <UXIWorkspace /> bileşenini ve tema sağlayıcısını oluşturur'
        : 'Scaffolds ready-to-use <UXIWorkspace /> & theme provider',
    },
    pnpm: {
      label: 'pnpm',
      cmd: 'pnpm add truncgil-uxigl',
      hint: 'PNPM Workspace',
    },
    yarn: {
      label: 'yarn',
      cmd: 'yarn add truncgil-uxigl',
      hint: 'Yarn Package Manager',
    },
    bun: {
      label: 'bun',
      cmd: 'bun add truncgil-uxigl',
      hint: 'Bun Runtime',
    },
  } as const;

  const uxiUsageSnippet = `import { ThemeProvider, ToastProvider, Button, Card, SheetGLGridAdapter, FileManGLExplorerAdapter } from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" defaultRadius={12}>
      <ToastProvider>
        <Card variant="glass" title="uxiGL Enterprise Dashboard">
          <SheetGLGridAdapter scenario="saas_finance" />
        </Card>
      </ToastProvider>
    </ThemeProvider>
  );
}`;

  // Interactive demo states inside the Landing Page preview box
  const [demoSwitch, setDemoSwitch] = useState(true);
  const [demoProgress, setDemoProgress] = useState(78);

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 860;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currentRadiusPx =
    typeof preferences.customRadiusPx === 'number'
      ? preferences.customRadiusPx
      : preferences.radiusScale === 'sharp'
      ? 4
      : preferences.radiusScale === 'pill'
      ? 22
      : 12;

  const colors = {
    bg: isDark ? '#06080F' : '#F8FAFC',
    navBg: isDark ? 'rgba(6, 8, 15, 0.82)' : 'rgba(248, 250, 252, 0.88)',
    card: isDark ? 'rgba(15, 21, 35, 0.78)' : '#FFFFFF',
    cardBorder: isDark
      ? 'rgba(56, 189, 248, 0.22)'
      : 'rgba(15, 23, 42, 0.1)',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
    text: isDark ? '#F8FAFC' : '#0F172A',
    muted: isDark ? '#94A3B8' : '#475569',
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = isTR
    ? [
        {
          icon: '✨',
          title: 'Liquid Glass & Katmanlı Yüzey Malzemeleri',
          desc: 'Gezinme ve kontrol katmanında yüzen Liquid Glass (Regular & Clear), içerik katmanında ise 4 kademeli Standart Yüzey Malzemeleri (UltraThin, Thin, Regular, Thick) ve Vibrancy hiyerarşisi.',
        },
        {
          icon: '🎨',
          title: 'Google Material You (M3) & 0–32px Border Radius',
          desc: '6 hazır tohum renk paleti (Cupertino Blue, Material Iris, Emerald Mint, Sunset Coral, Amber Gold, Graphite Mono) ve 0px ile 32px arasında anlık ayarlanabilir köşe geometrisi.',
        },
        {
          icon: '📊',
          title: 'SheetGL WebGL Tablo + Native DataTable',
          desc: '100.000+ satır için 4 kurumsal senaryolu (Finans, Telemetri, İK, Stok) SheetGL kanvas tablosu ve sıfır GPU yüküyle çalışan 4 varyantlı semantik HTML <DataTable />.',
        },
        {
          icon: '🗂️',
          title: 'FileManGL WebGL2 Sanal Dosya Sistemi (VFS)',
          desc: 'Sekmeli Windows 11 gezgin deneyimi, 3D uzamsal sahne (webgl_spatial), disk ısı haritası (webgl_diskmap) ve 5 katmanlı NTFS ACL + POSIX (0755) izin motoru.',
        },
        {
          icon: '🔗',
          title: 'Gerçek URL Route & localStorage Kalıcılığı',
          desc: 'Her sayfa, alt menü ve bileşen kendi URL adresine (/dashboard/*, /components/*, /docs/*) sahiptir. Tema, font ölçeği ve border-radius tercihleri F5 sonrasında korunur.',
        },
        {
          icon: '⚡',
          title: 'Sıfır Kaynak Tüketimli Eko-Mimari & SOLID',
          desc: 'Opsiyonel düşük çözünürlüklü WebGL ambiyansı, tek-aktif-motor (Single-Active-Engine) politikası ve Bağımlılıkların Tersine Çevrilmesi (DIP) prensipleriyle %0 boşta CPU/GPU yükü.',
        },
      ]
    : [
        {
          icon: '✨',
          title: 'Liquid Glass & Standard Materials',
          desc: 'Floating Liquid Glass (Regular & Clear) for navigation and transient controls, paired with 4-tier Standard Materials and Vibrancy for the content layer.',
        },
        {
          icon: '🎨',
          title: 'Google Material You (M3) & 0–32px Border Radius',
          desc: '6 seed color palettes with automatic dark/light tonal adaptation and a live 0px–32px border-radius engine persisted in localStorage.',
        },
        {
          icon: '📊',
          title: 'SheetGL WebGL Grid + Native DataTable',
          desc: 'Includes 4 enterprise SheetGL presets (Finance, Telemetry, HR, Inventory) plus a lightweight 4-variant semantic HTML <DataTable />.',
        },
        {
          icon: '🗂️',
          title: 'FileManGL WebGL2 Virtual File System (VFS)',
          desc: 'Tabbed Windows 11 explorer UX, 3D spatial view, interactive disk treemap, and 5-layer NTFS ACL + POSIX (0755) permission engine.',
        },
        {
          icon: '🔗',
          title: 'Clean URL Routing & Persistent State',
          desc: 'Every page, sub-menu, and component has a dedicated URL route (/dashboard/*, /components/*, /docs/*) with HTML5 History API support.',
        },
        {
          icon: '⚡',
          title: 'Zero Idle Resource Architecture & SOLID',
          desc: 'Single-active-engine lifecycle and strict backdrop-filter discipline keep idle CPU & GPU usage near 0%.',
        },
      ];

  const faqs = isTR
    ? [
        {
          q: 'Neden proje adı uxiGL olarak seçildi?',
          a: 'uxiGL; User Experience (UX), User Interface (UI) ve donanım hızlandırmalı GL (SheetGL & FileManGL) ekosisteminin tek bir çatı altında birleşimini simgeler.',
        },
        {
          q: 'uxiGL içinde hem SheetGL hem de FileManGL hazır geliyor mu?',
          a: 'Evet! SheetGL (WebGL veri tablosu + 4 kurumsal senaryo) ve FileManGL (WebGL2 sanal dosya yöneticisi) uxiGL mimarisine tam entegredir. Ayrıca hafif tablolar için sıfır GPU yüküyle çalışan native <DataTable /> bileşeni de mevcuttur.',
        },
        {
          q: 'Border Radius, Font Ölçeği ve Tema seçimleri sayfa yenilenince (F5) korunuyor mu?',
          a: 'Evet. Tüm görünüm tercihleri (Dark/Light mod, 6 tohum renk paleti, 0px–32px Border Radius, %80–%125 yazı boyutu ve aktif URL route) localStorage üzerinde anında saklanır.',
        },
      ]
    : [
        {
          q: 'Why is the project named uxiGL?',
          a: 'uxiGL represents the convergence of User Experience (UX), User Interface (UI), and our GL engine family (SheetGL & FileManGL) into a unified design system.',
        },
        {
          q: 'Are SheetGL and FileManGL built directly into uxiGL?',
          a: 'Yes! Both SheetGL (Canvas/WebGL DataGrid) and FileManGL (WebGL2 Virtual File System) are natively integrated alongside uxiGL’s lightweight semantic <DataTable />.',
        },
        {
          q: 'Do Border Radius, Font Scale, and Theme preferences persist across F5 reloads?',
          a: 'Yes. All theme tokens (Dark/Light mode, 6 seed palettes, 0px–32px Border Radius, 80%–125% font scale) and URL routes persist automatically.',
        },
      ];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        backgroundColor: colors.bg,
        backgroundImage: isDark
          ? `radial-gradient(ellipse 90% 55% at 50% -8%, rgba(47, 245, 142, 0.14) 0%, rgba(0, 200, 255, 0.16) 35%, rgba(139, 92, 246, 0.14) 60%, rgba(6, 8, 15, 0) 85%), linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px)`
          : `radial-gradient(ellipse 85% 50% at 50% -5%, rgba(14, 165, 233, 0.12) 0%, rgba(139, 92, 246, 0.10) 40%, rgba(248, 250, 252, 0) 85%), linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)`,
        backgroundSize: '100% 100%, 44px 44px, 44px 44px',
        color: colors.text,
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* ====================================================================
          SHEETGL & FILEMANGL STYLE STICKY GLASSMORPHISM HEADER (1280px • 68px)
      ==================================================================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 500,
          width: '100%',
          backgroundColor: colors.navBg,
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          borderBottom: `1px solid ${colors.border}`,
          userSelect: 'none',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: isMobile ? '0 14px' : '0 24px',
            height: isMobile ? 60 : 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          {/* LEFT: BRAND LOGO (SheetGL & FileManGL Exact Proportions) */}
          <a
            href="/"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 8 : 10,
              cursor: 'pointer',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <UXILogo size={isMobile ? 28 : 34} glow={true} preserveRatio />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? 5 : 8 }}>
              <span
                style={{
                  fontSize: isMobile ? 20 : 23,
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  color: colors.text,
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', sans-serif",
                }}
              >
                uxi
                <span
                  style={{
                    background:
                      'linear-gradient(110deg, #2FF58E 0%, #00C8FF 45%, #818CF8 75%, #C084FC 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  GL
                </span>
              </span>
              <span
                style={{
                  fontSize: isMobile ? 10.5 : 11.5,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: isDark ? '#38BDF8' : '#0284C7',
                  letterSpacing: '-0.02em',
                  opacity: 0.92,
                }}
              >
                v{__UXIGL_VERSION__}
              </span>
            </div>
          </a>

          {/* CENTER: NAV LINKS (Desktop — All with Real Route URLs) */}
          {!isMobile && (
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <a
                href="#preview"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('preview');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Canlı Önizleme' : 'Live Preview'}
              </a>

              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('features');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Özellikler' : 'Features'}
              </a>

              <a
                href="/dashboard/overview"
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate('dashboard', 'overview');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Dashboard
              </a>

              <a
                href="/components/inputs/button"
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate('components-inputs', 'button');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Bileşenler' : 'Components'}
              </a>

              <a
                href="/docs/getting-started"
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate('docs-guide', 'getting-started');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'Dokümantasyon' : 'Docs'}
              </a>

              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
                style={{
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {isTR ? 'SSS' : 'FAQ'}
              </a>

              <a
                href="https://github.com/umitunc/uxigl"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: isDark ? '#D1D5DB' : '#334155',
                  fontSize: 13.5,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>
            </nav>
          )}

          {/* RIGHT: SEARCH (⌘K), LANG, THEME TOGGLE, PILL CTA BUTTON */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10, flexShrink: 0 }}>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title="Spotlight Komut Paleti (⌘K)"
              style={{
                padding: '6px 10px',
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                color: colors.text,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ⌘K
            </button>

            <button
              type="button"
              onClick={() => setLang((l) => (l === 'tr' ? 'en' : 'tr'))}
              title={isTR ? 'Switch to English' : 'Türkçeye Geç'}
              style={{
                padding: '6px 10px',
                borderRadius: 9,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
                color: colors.text,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {lang.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              title={isTR ? 'Temayı Değiştir (Dark / Light)' : 'Toggle Theme'}
              style={{
                width: isMobile ? 34 : 38,
                height: isMobile ? 34 : 38,
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? '#0D1322' : '#F1F5F9',
                color: isDark ? '#FBBF24' : '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              href="https://github.com/umitunc/uxigl"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Deposu (umitunc/uxigl)"
              aria-label="GitHub Repository"
              style={{
                width: isMobile ? 34 : 38,
                height: isMobile ? 34 : 38,
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? '#0D1322' : '#F1F5F9',
                color: colors.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              <GithubIcon size={16} />
            </a>

            <a
              href="/dashboard/overview"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onNavigate('dashboard', 'overview');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: isMobile ? 5 : 8,
                padding: isMobile ? '7px 13px' : '10px 20px',
                borderRadius: 999,
                background:
                  'linear-gradient(135deg, #10B981 0%, #0284C7 52%, #6366F1 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: isMobile ? 12.5 : 13.5,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 18px rgba(2, 132, 199, 0.42)',
              }}
            >
              <span>
                {isMobile
                  ? isTR
                    ? 'Stüdyo'
                    : 'Studio'
                  : isTR
                  ? 'Uygulamaya Git'
                  : 'Launch uxiGL'}
              </span>
              <span style={{ fontSize: isMobile ? 13 : 15 }}>→</span>
            </a>

            {isMobile && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Menü"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            )}
          </div>
        </div>

        {/* MOBILE COLLAPSIBLE MENU */}
        {isMobile && mobileMenuOpen && (
          <div
            style={{
              padding: '12px 16px 16px',
              borderTop: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(6, 8, 15, 0.96)' : 'rgba(255, 255, 255, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <a
              href="/dashboard/overview"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigate('dashboard', 'overview');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              🚀 Komuta Merkezi (/dashboard/overview)
            </a>
            <a
              href="/components/inputs/button"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigate('components-inputs', 'button');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              🎛️ Bileşen Laboratuvarı (/components/inputs/button)
            </a>
            <a
              href="/docs/getting-started"
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                setMobileMenuOpen(false);
                onNavigate('docs-guide', 'getting-started');
              }}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              📚 Dokümantasyon (/docs/getting-started)
            </a>
            <a
              href="https://github.com/umitunc/uxigl"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: colors.text,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <GithubIcon size={16} />
              <span>GitHub (umitunc/uxigl)</span>
            </a>
          </div>
        )}
      </header>

      {/* ====================================================================
          HERO SECTION (SHEETGL & FILEMANGL CENTERED EMBLEM + GRADIENT TITLE)
      ==================================================================== */}
      <section
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          padding: isMobile ? '28px 14px 24px' : '46px 24px 36px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* LARGE FRAMELESS 3D HERO EMBLEM */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: isMobile ? 18 : 26,
            position: 'relative',
          }}
        >
          {/* Subtle ambient backlight aura for 3D emblem */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile ? 160 : 230,
              height: isMobile ? 160 : 230,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(0, 200, 255, 0.22) 0%, rgba(255, 107, 26, 0.16) 42%, transparent 72%)',
              filter: 'blur(36px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <UXILogo
            width={isMobile ? 220 : 340}
            height={isMobile ? 125 : 193}
            glow={true}
            style={{
              position: 'relative',
              zIndex: 1,
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.35s ease',
            }}
          />
        </div>

        {/* HERO TITLE */}
        <h1
          style={{
            fontSize: 'clamp(30px, 5.4vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.12,
            margin: '0 auto 18px',
            maxWidth: 1060,
            letterSpacing: '-0.035em',
            color: colors.text,
          }}
        >
          {isTR ? (
            <>
              Yeni Nesil{' '}
              <span
                style={{
                  background:
                    'linear-gradient(110deg, #2FF58E 0%, #00C8FF 42%, #818CF8 75%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Liquid Glass × Material 3
              </span>{' '}
              Tasarım Sistemi
            </>
          ) : (
            <>
              The Next-Gen{' '}
              <span
                style={{
                  background:
                    'linear-gradient(110deg, #2FF58E 0%, #00C8FF 42%, #818CF8 75%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Liquid Glass × Material 3
              </span>{' '}
              Design System
            </>
          )}
        </h1>

        {/* HERO SUBTITLE */}
        <p
          style={{
            fontSize: isMobile ? 15 : 17.5,
            color: colors.muted,
            maxWidth: 840,
            margin: '0 auto 30px',
            lineHeight: 1.68,
          }}
        >
          {isTR
            ? 'UX, UI ve WebGL dünyasını tek bir mimaride birleştiren uxiGL; Liquid Glass & Standart Yüzey Malzemeleri, Google Material You tohum paletleri, 0–32px canlı Border Radius motoru, SheetGL WebGL DataGrid ve FileManGL WebGL2 dosya yöneticisiyle eksiksiz bir kurumsal ekosistem sunar.'
            : 'Uniting UX, UI, and WebGL in a single architecture: Liquid Glass & Standard Materials, Google Material You tonal palettes, a live 0–32px Border Radius engine, SheetGL WebGL DataGrid, and FileManGL WebGL2 Virtual File System.'}
        </p>

        {/* PRIMARY CTA BUTTONS (All with Real Route Hrefs) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            flexWrap: 'wrap',
            marginBottom: 34,
          }}
        >
          <a
            href="/dashboard/overview"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'overview');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 26px',
              borderRadius: 999,
              background:
                'linear-gradient(135deg, #10B981 0%, #0284C7 55%, #6366F1 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 14.5,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.38)',
            }}
          >
            <Play size={15} fill="#FFFFFF" />
            <span>
              {isTR ? 'Komuta Merkezini Başlat (/dashboard)' : 'Launch Dashboard (/dashboard)'}
            </span>
          </a>

          <a
            href="/components/inputs/button"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('components-inputs', 'button');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              color: colors.text,
              fontWeight: 700,
              fontSize: 14.5,
              textDecoration: 'none',
            }}
          >
            <Sliders size={15} />
            <span>
              {isTR ? 'Bileşen Laboratuvarı (/components)' : 'Component Playground (/components)'}
            </span>
          </a>

          <a
            href="/docs/getting-started"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('docs-guide', 'getting-started');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 22px',
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              color: colors.text,
              fontWeight: 700,
              fontSize: 14.5,
              textDecoration: 'none',
            }}
          >
            <BookOpen size={15} />
            <span>{isTR ? 'Dokümantasyon (/docs)' : 'Documentation (/docs)'}</span>
          </a>
        </div>

        {/* ==================================================================
            INTERACTIVE NPM / NPX / PNPM / BUN CLI & REACT USAGE BAR
        ================================================================== */}
        <div
          style={{
            maxWidth: 820,
            margin: '0 auto 34px',
            borderRadius: 16,
            border: `1px solid ${colors.cardBorder}`,
            backgroundColor: isDark ? 'rgba(9, 14, 26, 0.92)' : '#FFFFFF',
            boxShadow: isDark
              ? '0 18px 42px -12px rgba(0, 0, 0, 0.65)'
              : '0 12px 32px -10px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
              padding: '8px 14px',
              borderBottom: `1px solid ${colors.border}`,
              backgroundColor: isDark ? 'rgba(6, 10, 18, 0.9)' : '#F1F5F9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {(
                Object.keys(installCommands) as Array<keyof typeof installCommands>
              ).map((key) => {
                const item = installCommands[key];
                const active = installTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setInstallTab(key)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 8,
                      border: active
                        ? '1px solid rgba(56, 189, 248, 0.45)'
                        : '1px solid transparent',
                      backgroundColor: active
                        ? isDark
                          ? 'rgba(2, 132, 199, 0.22)'
                          : 'rgba(2, 132, 199, 0.12)'
                        : 'transparent',
                      color: active
                        ? isDark
                          ? '#7DD3FC'
                          : '#0369A1'
                        : colors.muted,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowQuickUsage((p) => !p)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                backgroundColor: showQuickUsage
                  ? 'rgba(16, 185, 129, 0.18)'
                  : isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : '#FFFFFF',
                color: showQuickUsage ? '#10B981' : colors.text,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showQuickUsage
                ? isTR
                  ? 'Örnek Kodu Gizle'
                  : 'Hide Code'
                : isTR
                ? 'Örnek Kullanım (TSX)'
                : 'Code Usage (TSX)'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflowX: 'auto' }}>
              <span style={{ color: '#10B981', fontWeight: 800 }}>$</span>
              <code style={{ color: colors.text, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {installCommands[installTab].cmd}
              </code>
              {!isMobile && (
                <span style={{ fontSize: 11.5, color: colors.muted, fontFamily: 'Inter, sans-serif' }}>
                  — {installCommands[installTab].hint}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                copyCommand(`hero-${installTab}`, installCommands[installTab].cmd)
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC',
                color: colors.text,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {copiedCmdKey === `hero-${installTab}` ? (
                <>
                  <Check size={13} color="#10B981" />
                  <span style={{ color: '#10B981' }}>
                    {isTR ? 'Kopyalandı' : 'Copied'}
                  </span>
                </>
              ) : (
                <>
                  <Copy size={13} color="#38BDF8" />
                  <span>{isTR ? 'Kopyala' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          {showQuickUsage && (
            <div
              style={{
                padding: '12px 16px',
                borderTop: `1px solid ${colors.border}`,
                backgroundColor: isDark ? '#050811' : '#F8FAFC',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: isDark ? '#A5F3FC' : '#0F172A',
                  overflowX: 'auto',
                }}
              >
                <code>{uxiUsageSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* 4-PILLAR QUICK-JUMP STRIP (FileManGL & SheetGL Style) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(4, minmax(0, 1fr))',
            gap: 12,
            maxWidth: 1180,
            margin: '0 auto 40px',
          }}
        >
          {[
            {
              icon: <Sparkles size={16} color="#2FF58E" />,
              title: 'Liquid Glass Yüzeyler',
              tag: 'HIG',
              href: '/components/surfaces/card',
              sec: 'components-surfaces',
              sub: 'card',
            },
            {
              icon: <Sliders size={16} color="#00C8FF" />,
              title: 'Material 3 & Radius',
              tag: '0–32px',
              href: '/docs/theming-tokens',
              sec: 'docs-guide',
              sub: 'theming-tokens',
            },
            {
              icon: <Table2 size={16} color="#818CF8" />,
              title: 'SheetGL & Tablo',
              tag: 'DataGrid',
              href: '/dashboard/crm-orders',
              sec: 'dashboard',
              sub: 'crm-orders',
            },
            {
              icon: <HardDrive size={16} color="#C084FC" />,
              title: 'FileManGL VFS',
              tag: 'ACL + 0755',
              href: '/dashboard/file-manager',
              sec: 'dashboard',
              sub: 'file-manager',
            },
          ].map((pillar) => (
            <a
              key={pillar.href}
              href={pillar.href}
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onNavigate(pillar.sec, pillar.sub);
              }}
              style={{
                padding: '14px 16px',
                borderRadius: 16,
                backgroundColor: colors.card,
                border: `1px solid ${colors.cardBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                textDecoration: 'none',
                color: colors.text,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                {pillar.icon}
                <strong style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pillar.title}
                </strong>
              </div>
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: '2px 8px',
                  borderRadius: 999,
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(15,23,42,0.06)',
                  color: colors.muted,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {pillar.tag}
              </span>
            </a>
          ))}
        </div>

        {/* ====================================================================
            LIVE INTERACTIVE EMBEDDED WORKSPACE PREVIEW (#preview)
        ==================================================================== */}
        <div
          id="preview"
          style={{
            maxWidth: 1220,
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginBottom: 12,
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <strong style={{ fontSize: 13.5 }}>
                {isTR
                  ? 'Canlı İnteraktif uxiGL Sahnesi (Hemen Aşağıda Test Edin)'
                  : 'Live Interactive uxiGL Stage (Test Below)'}
              </strong>
            </div>

            <SegmentedControl<LandingPreviewTab>
              size="sm"
              value={previewTab}
              onChange={setPreviewTab}
              options={[
                { value: 'components', label: isTR ? 'uxiGL Bileşen & Tema Sahnesi' : 'uxiGL Components & Theme' },
                { value: 'sheetgl', label: isTR ? 'SheetGL Tablo' : 'SheetGL Grid' },
                { value: 'filemangl', label: 'FileManGL Dosya' },
              ]}
            />
          </div>

          <div
            style={{
              borderRadius: currentRadiusPx + 4,
              padding: isMobile ? 14 : 22,
              backgroundColor: colors.card,
              border: `1px solid ${colors.cardBorder}`,
              boxShadow: isDark
                ? '0 28px 70px rgba(0, 0, 0, 0.72), 0 0 35px rgba(56, 189, 248, 0.12)'
                : '0 24px 60px rgba(15, 23, 42, 0.08)',
            }}
          >
            {previewTab === 'components' && (
              <div className="uxu-stage-grid-2">
                <Card
                  variant="glass"
                  eyebrow="LIQUID GLASS × MATERIAL 3"
                  title="Canlı Tema, Renk Paleti & Border Radius"
                  subtitle="Değişiklikler tüm uxiGL bileşenlerine ve localStorage’a anında uygulanır"
                >
                  <div className="uxu-stack-md">
                    <div className="uxu-stage-row">
                      {availablePalettes.map((p) => (
                        <Chip
                          key={p.id}
                          size="sm"
                          tone="primary"
                          selected={preferences.seedPalette === p.id}
                          onClick={() => setSeedPalette(p.id as SeedPaletteId)}
                        >
                          {p.name}
                        </Chip>
                      ))}
                    </div>

                    <SegmentedControl<RadiusScale>
                      label={`Border Radius (Köşe Yuvarlaklığı: ${currentRadiusPx}px)`}
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

                    <Slider
                      label="Hassas Border Radius (0px – 32px)"
                      value={currentRadiusPx}
                      min={0}
                      max={32}
                      step={1}
                      size="sm"
                      valueSuffix="px"
                      onChange={setCustomRadiusPx}
                    />

                    <Switch
                      label="Geçici Liquid Glass Kontrolleri"
                      description="Kaydırıcı ve anahtarlar etkileşim anında sıvı cam kapsülüne dönüşür"
                      value={demoSwitch}
                      onChange={setDemoSwitch}
                    />

                    <div>
                      <div className="uxu-field__label" style={{ marginBottom: 6 }}>
                        Google Fonts Tipografi Ailesi
                      </div>
                      <div className="uxu-stage-row">
                        {availableFontPresets.map((fp) => (
                          <Chip
                            key={fp.id}
                            size="sm"
                            tone="info"
                            selected={
                              (preferences.fontFamilyPreset ?? 'inter-jakarta') ===
                              fp.id
                            }
                            onClick={() =>
                              setFontFamilyPreset(fp.id as FontFamilyPreset)
                            }
                          >
                            {fp.name}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  variant="tonal"
                  eyebrow="GOOGLE MATERIAL SYMBOLS & UXIGL PRIMITIVES"
                  title="Değişken Google Font İkonları & Bileşenler"
                  subtitle="Google Material Symbols (Rounded / Outlined / Sharp • FILL / wght), ilerleme halkaları ve tablo"
                >
                  <div className="uxu-stack-md">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        flexWrap: 'wrap',
                      }}
                    >
                      <SegmentedControl<GoogleIconStyle>
                        size="sm"
                        value={preferences.iconStyle ?? 'rounded'}
                        onChange={setIconStyle}
                        options={[
                          { value: 'rounded', label: 'Rounded' },
                          { value: 'outlined', label: 'Outlined' },
                          { value: 'sharp', label: 'Sharp' },
                        ]}
                      />
                      <Chip
                        size="sm"
                        tone="primary"
                        selected={Boolean(preferences.iconFilled)}
                        onClick={() => setIconFilled(!preferences.iconFilled)}
                      >
                        FILL: {preferences.iconFilled ? '1 (Dolgulu)' : '0 (Kontur)'}
                      </Chip>
                      <div className="uxu-stage-row" style={{ gap: 8 }}>
                        <GoogleIcon name="auto_awesome" tone="primary" size={22} />
                        <GoogleIcon name="dashboard" tone="info" size={22} />
                        <GoogleIcon name="table_chart" tone="success" size={22} />
                        <GoogleIcon name="folder_open" tone="warning" size={22} />
                        <GoogleIcon name="bolt" tone="danger" size={22} />
                      </div>
                    </div>

                    <div className="uxu-stage-row">
                      <Progress
                        variant="circular"
                        value={demoProgress}
                        tone="primary"
                        size="md"
                      />
                      <Progress
                        variant="circular"
                        value={92}
                        tone="success"
                        size="md"
                      />
                      <AvatarGroup max={4} size="md">
                        <Avatar name="Ümit Uz" status="online" tone="primary" />
                        <Avatar name="Deniz Kaya" status="online" tone="success" />
                        <Avatar name="Selin Yılmaz" status="busy" tone="warning" />
                        <Avatar name="Mert Can" tone="info" />
                      </AvatarGroup>
                    </div>

                    <Slider
                      label="Canlı İlerleme Testi (%)"
                      value={demoProgress}
                      min={0}
                      max={100}
                      step={1}
                      size="sm"
                      valueSuffix="%"
                      onChange={setDemoProgress}
                    />

                    <DataTable
                      rowKey="id"
                      variant="striped"
                      size="sm"
                      data={[
                        {
                          id: '1',
                          pkg: 'truncgil-uxigl',
                          arch: 'Liquid Glass × Material 3 UI',
                          tag: `v${__UXIGL_VERSION__}`,
                        },
                        {
                          id: '2',
                          pkg: 'sheetgl',
                          arch: 'WebGL / Canvas DataGrid',
                          tag: '4 Senaryo',
                        },
                        {
                          id: '3',
                          pkg: 'filemangl',
                          arch: 'WebGL2 VFS Explorer',
                          tag: 'ACL + 0755',
                        },
                      ]}
                      columns={[
                        { key: 'pkg', header: 'Modül', sortable: true },
                        { key: 'arch', header: 'Mimari' },
                        { key: 'tag', header: 'Etiket', align: 'right' },
                      ]}
                    />
                  </div>
                </Card>
              </div>
            )}

            {previewTab === 'sheetgl' && (
              <SheetGLGridAdapter initialRowCount={150} height={460} />
            )}

            {previewTab === 'filemangl' && (
              <FileManGLExplorerAdapter height={500} />
            )}
          </div>
        </div>
      </section>

      {/* ====================================================================
          6-CARD ENTERPRISE FEATURE PILLARS GRID (#features)
      ==================================================================== */}
      <section
        id="features"
        style={{
          maxWidth: 1260,
          margin: '0 auto',
          padding: isMobile ? '28px 14px 44px' : '40px 24px 64px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isMobile ? 24 : 32,
            fontWeight: 800,
            marginBottom: isMobile ? 22 : 34,
            letterSpacing: '-0.02em',
          }}
        >
          {isTR
            ? 'Kurumsal Mimari ve Öne Çıkan Yetenekler'
            : 'Enterprise Architecture & Key Capabilities'}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? '1fr'
              : 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: isMobile ? 14 : 20,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 24,
                borderRadius: currentRadiusPx + 2,
                backgroundColor: colors.card,
                border: `1px solid ${colors.cardBorder}`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  marginBottom: 14,
                  backgroundColor: isDark
                    ? 'rgba(56, 189, 248, 0.14)'
                    : 'rgba(2, 132, 199, 0.10)',
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 16.5,
                  marginBottom: 8,
                  color: colors.text,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: colors.muted,
                  lineHeight: 1.65,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          FAQ SECTION (#faq — SheetGL Style)
      ==================================================================== */}
      <section
        id="faq"
        style={{
          maxWidth: 880,
          margin: '0 auto',
          padding: '16px 24px 68px',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 28,
            letterSpacing: '-0.02em',
          }}
        >
          {isTR ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px 24px',
                borderRadius: currentRadiusPx + 2,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15.5,
                  marginBottom: 8,
                  color: colors.text,
                }}
              >
                {faq.q}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: colors.muted,
                  lineHeight: 1.6,
                }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          FOOTER (SheetGL & FileManGL Style with Route Links)
      ==================================================================== */}
      <footer
        style={{
          borderTop: `1px solid ${colors.border}`,
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: 13,
          color: colors.muted,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <UXILogo size={20} preserveRatio />
          <span style={{ fontWeight: 800, color: colors.text }}>
            uxi
            <span
              style={{
                background:
                  'linear-gradient(110deg, #2FF58E 0%, #00C8FF 45%, #818CF8 75%, #C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GL
            </span>
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              color: isDark ? '#38BDF8' : '#0284C7',
            }}
          >
            v{__UXIGL_VERSION__}
          </span>
        </div>

        <nav
          aria-label="Footer Route Links"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px 18px',
            marginBottom: 10,
            fontSize: 12.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <a
            href="/"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            / (Landing)
          </a>
          <a
            href="/dashboard/overview"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'overview');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /dashboard/overview
          </a>
          <a
            href="/dashboard/crm-orders"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'crm-orders');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /dashboard/crm-orders (SheetGL)
          </a>
          <a
            href="/dashboard/file-manager"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('dashboard', 'file-manager');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /dashboard/file-manager (FileManGL)
          </a>
          <a
            href="/components/inputs/button"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('components-inputs', 'button');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /components/inputs/button
          </a>
          <a
            href="/docs/getting-started"
            onClick={(e) => {
              if (RouteService.isModifiedClick(e)) return;
              e.preventDefault();
              onNavigate('docs-guide', 'getting-started');
            }}
            style={{ color: colors.muted, textDecoration: 'none' }}
          >
            /docs/getting-started
          </a>
        </nav>

        {/* Quick Copyable NPM & NPX Usage Pills in Footer */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 14,
          }}
        >
          {[
            { id: 'ft-uxigl', cmd: 'npm i truncgil-uxigl' },
            { id: 'ft-npx-uxi', cmd: 'npx truncgil-uxigl init' },
            { id: 'ft-sheetgl', cmd: 'npm i sheetgl' },
            { id: 'ft-filemangl', cmd: 'npm i filemangl' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => copyCommand(item.id, item.cmd)}
              title={isTR ? 'Panoya kopyala' : 'Copy to clipboard'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 11px',
                borderRadius: 8,
                border: `1px solid ${colors.border}`,
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF',
                color: colors.text,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span style={{ color: '#10B981', fontWeight: 800 }}>$</span>
              <span>{item.cmd}</span>
              {copiedCmdKey === item.id ? (
                <Check size={12} color="#10B981" />
              ) : (
                <Copy size={12} color={colors.muted} />
              )}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            paddingTop: 12,
            borderTop: `1px solid ${colors.border}`,
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          <span>MIT License • © {new Date().getFullYear()} uxiGL Design System</span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>Crafted with ❤️ by</span>
            <a
              href="https://www.truncgil.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 999,
                background:
                  'linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(249, 115, 22, 0.16), rgba(244, 63, 94, 0.16))',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                color: isDark ? '#FDBA74' : '#EA580C',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              🍊 Trunçgil Teknoloji
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};
