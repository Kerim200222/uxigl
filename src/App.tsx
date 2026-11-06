import React, { useEffect, useMemo, useState } from 'react';
import {
  Sun,
  Moon,
  Palette,
  Layers,
  LayoutDashboard,
  BookOpen,
  Sliders,
  Box,
  Rocket,
  Sparkles,
  Home,
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  FileText,
  BarChart2,
  MessageSquare,
  Calendar,
  FolderOpen,
  Settings,
  Shield,
  HelpCircle,
  Layout,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Check,
  Menu,
} from 'lucide-react';
import { GithubIcon } from './components/brand/GithubIcon';
import { useTheme } from './providers/ThemeProvider';
import { useToast } from './providers/ToastProvider';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { defaultThemeStorageAdapter } from './core/services/StorageService';
import {
  RouteService,
  DASHBOARD_VIEW_IDS,
  INPUT_COMPONENT_IDS,
  SURFACE_COMPONENT_IDS,
  FEEDBACK_COMPONENT_IDS,
} from './core/services/RouteService';
import {
  CommandPalette,
  type CommandActionItem,
  Sidebar,
  TopHeader,
  WebGLAuroraCanvas,
} from './components/composites';
import { GoogleIcon } from './components/primitives';
import type {
  BreadcrumbItem,
  SidebarNavGroup,
  SidebarVariant,
} from './core/contracts/NavigationContract';
import { COMPONENT_CATALOG } from './features/catalog/componentCatalog';
import { InteractivePlayground } from './features/playground/InteractivePlayground';
import {
  AppleGoogleAppShowcase,
  type DashboardSubView,
} from './features/showcase/AppleGoogleAppShowcase';
import {
  ArchitectureDocsView,
  type DocsTopicId,
} from './features/docs/ArchitectureDocsView';
import { ThemeStudioDrawer } from './features/theme-studio/ThemeStudioDrawer';
import { UXILandingPage } from './features/landing/UXILandingPage';

export type MainSectionId =
  | 'landing'
  | 'docs-guide'
  | 'dashboard'
  | 'components-inputs'
  | 'components-surfaces'
  | 'components-feedback';

export const App: React.FC = () => {
  const {
    resolvedMode,
    availablePalettes,
    toggleMode,
    setSeedPalette,
  } = useTheme();
  const { notify } = useToast();

  // Classic Hierarchical Sidebar Navigation State (URL Route -> localStorage -> Default)
  const [activeSectionId, setActiveSectionId] = useState<MainSectionId>(() => {
    const parsedFromUrl = RouteService.parsePath(window.location.pathname);
    if (parsedFromUrl) return parsedFromUrl.sectionId;
    const saved = defaultThemeStorageAdapter.loadNavState();
    return (saved?.activeSectionId as MainSectionId) || 'dashboard';
  });
  const [activeSubItemId, setActiveSubItemId] = useState<string>(() => {
    const parsedFromUrl = RouteService.parsePath(window.location.pathname);
    if (parsedFromUrl) return parsedFromUrl.subItemId;
    const saved = defaultThemeStorageAdapter.loadNavState();
    return saved?.activeSubItemId || 'overview';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = defaultThemeStorageAdapter.loadNavState();
    return Boolean(saved?.sidebarCollapsed);
  });
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>(() => {
    const saved = defaultThemeStorageAdapter.loadNavState();
    return (saved?.sidebarVariant as SidebarVariant) || 'stacked-vertical';
  });
  const [sidebarAccent, setSidebarAccent] = useState<string>(() => {
    const saved = defaultThemeStorageAdapter.loadNavState();
    return saved?.sidebarAccent || '#F59E0B';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);

  // Listen to sidebar variant changes triggered from demo or header
  useEffect(() => {
    const onVariantChange = (e: Event) => {
      const custom = e as CustomEvent<{
        variant?: SidebarVariant;
        accentColor?: string;
      }>;
      if (custom.detail?.variant) {
        setSidebarVariant(custom.detail.variant);
      }
      if (custom.detail?.accentColor) {
        setSidebarAccent(custom.detail.accentColor);
      }
    };
    window.addEventListener('uxu:sidebar-variant-change', onVariantChange);
    return () =>
      window.removeEventListener('uxu:sidebar-variant-change', onVariantChange);
  }, []);

  const activeRoutePath = useMemo(
    () => RouteService.buildPath(activeSectionId, activeSubItemId),
    [activeSectionId, activeSubItemId]
  );

  // Sync URL address bar (pushState / replaceState) & localStorage whenever active route changes
  useEffect(() => {
    defaultThemeStorageAdapter.saveNavState({
      activeSectionId,
      activeSubItemId,
      sidebarCollapsed,
      sidebarVariant,
      sidebarAccent,
    });

    if (window.location.pathname !== activeRoutePath) {
      if (
        window.location.pathname === '/' ||
        window.location.pathname === ''
      ) {
        window.history.replaceState(
          { sectionId: activeSectionId, subItemId: activeSubItemId },
          '',
          activeRoutePath
        );
      } else {
        window.history.pushState(
          { sectionId: activeSectionId, subItemId: activeSubItemId },
          '',
          activeRoutePath
        );
      }
    }
  }, [activeSectionId, activeSubItemId, sidebarCollapsed, activeRoutePath]);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const onPopState = () => {
      const parsed = RouteService.parsePath(window.location.pathname);
      if (parsed) {
        setActiveSectionId(parsed.sectionId);
        setActiveSubItemId(parsed.subItemId);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Global Cmd/Ctrl + K shortcut for Spotlight Command Palette
  useKeyboardShortcut(
    'k',
    () => {
      setCmdPaletteOpen((prev) => !prev);
    },
    { metaOrCtrl: true }
  );

  // Hierarchical Sidebar Menu Configuration (Metis Admin Template Structure + uxiGL Ecosystem)
  const sidebarGroups = useMemo<SidebarNavGroup[]>(
    () => [
      {
        id: 'grp-dashboard',
        title: 'DASHBOARD & RAPORLAR',
        railLabel: 'DASH',
        icon: <GoogleIcon name="dashboard" size={18} />,
        items: [
          {
            id: 'overview',
            label: 'Dashboard',
            href: '/dashboard/overview',
            icon: <GoogleIcon name="dashboard" size={16} />,
          },
          {
            id: 'analytics',
            label: 'Analytics',
            href: '/dashboard/analytics',
            icon: <GoogleIcon name="trending_up" size={16} />,
            badge: 'Canlı',
            badgeTone: 'info',
          },
          {
            id: 'reports',
            label: 'Reports',
            href: '/dashboard/reports',
            icon: <GoogleIcon name="bar_chart" size={16} />,
            badge: 'Metrik',
            badgeTone: 'primary',
          },
        ],
      },
      {
        id: 'grp-crm',
        title: 'CRM & TİCARET',
        railLabel: 'CRM',
        icon: <GoogleIcon name="shopping_bag" size={18} />,
        items: [
          {
            id: 'users',
            label: 'Users',
            href: '/dashboard/users',
            icon: <GoogleIcon name="group" size={16} />,
          },
          {
            id: 'products',
            label: 'Products',
            href: '/dashboard/products',
            icon: <GoogleIcon name="inventory_2" size={16} />,
          },
          {
            id: 'crm-orders',
            label: 'Orders',
            href: '/dashboard/crm-orders',
            icon: <GoogleIcon name="shopping_bag" size={16} />,
            badge: 'SheetGL',
            badgeTone: 'primary',
          },
        ],
      },
      {
        id: 'grp-forms',
        title: 'FORM BİLEŞENLERİ',
        railLabel: 'FORM',
        icon: <GoogleIcon name="description" size={18} />,
        items: [
          {
            id: 'forms',
            label: 'Kurumsal Form Stüdyosu',
            href: '/dashboard/forms',
            icon: <GoogleIcon name="description" size={16} />,
            badge: 'Stüdyo',
            badgeTone: 'success',
          },
          {
            id: 'input',
            label: 'Input & Textarea',
            href: '/components/inputs/input',
            icon: <GoogleIcon name="edit_note" size={16} />,
          },
          {
            id: 'switch',
            label: 'Switch & Toggle',
            href: '/components/inputs/switch',
            icon: <GoogleIcon name="toggle_on" size={16} />,
          },
          {
            id: 'checkbox',
            label: 'Checkbox & Seçim',
            href: '/components/inputs/checkbox',
            icon: <GoogleIcon name="check_box" size={16} />,
          },
          {
            id: 'slider',
            label: 'Slider & Aralık',
            href: '/components/inputs/slider',
            icon: <GoogleIcon name="tune" size={16} />,
          },
          {
            id: 'button',
            label: 'Button Çeşitleri',
            href: '/components/inputs/button',
            icon: <GoogleIcon name="smart_button" size={16} />,
          },
        ],
      },
      {
        id: 'grp-elements',
        title: 'UI ELEMANLARI',
        railLabel: 'UI',
        icon: <GoogleIcon name="category" size={18} />,
        items: [
          {
            id: 'elements-overview',
            label: 'UI Genel Bakış',
            href: '/dashboard/elements-overview',
            icon: <GoogleIcon name="category" size={16} />,
            badge: 'Katalog',
            badgeTone: 'primary',
          },
          {
            id: 'card',
            label: 'Cards & Yüzeyler',
            href: '/components/surfaces/card',
            icon: <GoogleIcon name="layers" size={16} />,
          },
          {
            id: 'chips-badges',
            label: 'Badges & Chips',
            href: '/components/feedback/chips-badges',
            icon: <GoogleIcon name="verified" size={16} />,
          },
          {
            id: 'modal-command',
            label: 'Modal & Alerts',
            href: '/components/surfaces/modal-command',
            icon: <GoogleIcon name="chat" size={16} />,
          },
          {
            id: 'segmented-control',
            label: 'Segmented Control',
            href: '/components/surfaces/segmented-control',
            icon: <GoogleIcon name="view_week" size={16} />,
          },
          {
            id: 'tabs-accordion',
            label: 'Tabs & Accordion',
            href: '/components/surfaces/tabs-accordion',
            icon: <GoogleIcon name="tab" size={16} />,
          },
          {
            id: 'progress-avatar',
            label: 'Progress & Avatar',
            href: '/components/feedback/progress-avatar',
            icon: <GoogleIcon name="account_circle" size={16} />,
          },
          {
            id: 'datatable-statcard',
            label: 'SheetGL Tablo',
            href: '/components/feedback/datatable-statcard',
            icon: <GoogleIcon name="table_chart" size={16} />,
            badge: 'SheetGL',
            badgeTone: 'primary',
          },
          {
            id: 'filemangl-explorer',
            label: 'FileManGL VFS',
            href: '/components/feedback/filemangl-explorer',
            icon: <GoogleIcon name="folder_open" size={16} />,
            badge: 'VFS',
            badgeTone: 'info',
          },
        ],
      },
      {
        id: 'grp-sidebars',
        title: 'SİDEBAR ÇEŞİTLERİ',
        railLabel: 'SIDE',
        icon: <GoogleIcon name="dock_to_left" size={18} />,
        items: [
          {
            id: 'sidebar-stacked',
            label: '1. Dikey Menü',
            href: '/dashboard/sidebars/stacked',
            icon: <GoogleIcon name="view_sidebar" size={16} />,
          },
          {
            id: 'sidebar-standard',
            label: '2. Açık Standart',
            href: '/dashboard/sidebars/standard',
            icon: <GoogleIcon name="dock_to_left" size={16} />,
          },
          {
            id: 'sidebar-mini',
            label: '3. Kapalı Ray',
            href: '/dashboard/sidebars/mini',
            icon: <GoogleIcon name="menu_open" size={16} />,
          },
          {
            id: 'sidebar-dual',
            label: '4. Çift Kolon',
            href: '/dashboard/sidebars/dual',
            icon: <GoogleIcon name="splitscreen" size={16} />,
            badge: 'Aktif',
            badgeTone: 'primary',
          },
          {
            id: 'sidebar-drawer',
            label: '5. Çekmece Menü',
            href: '/dashboard/sidebars/drawer',
            icon: <GoogleIcon name="menu" size={16} />,
          },
        ],
      },
      {
        id: 'grp-apps',
        title: 'ARAÇLAR & İLETİŞİM',
        railLabel: 'APPS',
        icon: <GoogleIcon name="apps" size={18} />,
        items: [
          {
            id: 'messages',
            label: 'Messages',
            href: '/dashboard/messages',
            icon: <GoogleIcon name="chat" size={16} />,
            badge: '3',
            badgeTone: 'danger',
          },
          {
            id: 'calendar',
            label: 'Calendar',
            href: '/dashboard/calendar',
            icon: <GoogleIcon name="calendar_month" size={16} />,
          },
          {
            id: 'file-manager',
            label: 'Files (VFS)',
            href: '/dashboard/file-manager',
            icon: <GoogleIcon name="folder" size={16} />,
            badge: 'VFS',
            badgeTone: 'info',
          },
        ],
      },
      {
        id: 'grp-admin',
        title: 'SİSTEM & YÖNETİM',
        railLabel: 'ADMI',
        icon: <GoogleIcon name="settings" size={18} />,
        items: [
          {
            id: 'settings',
            label: 'Settings',
            href: '/dashboard/settings',
            icon: <GoogleIcon name="settings" size={16} />,
          },
          {
            id: 'security',
            label: 'Security',
            href: '/dashboard/security',
            icon: <GoogleIcon name="shield" size={16} />,
          },
          {
            id: 'docs-guide',
            label: 'Help & Support',
            href: '/docs/getting-started',
            icon: <GoogleIcon name="help" size={16} />,
            subItems: [
              {
                id: 'getting-started',
                label: '1. Kurulum',
                href: '/docs/getting-started',
              },
              {
                id: 'theming-tokens',
                label: '2. Tema & Font',
                href: '/docs/theming-tokens',
              },
              {
                id: 'layout-shell',
                label: '3. Yerleşim & Mimari',
                href: '/docs/layout-shell',
              },
              {
                id: 'cli-shortcuts',
                label: '4. Bildirim & ⌘K',
                href: '/docs/cli-shortcuts',
              },
            ],
          },
          {
            id: 'landing',
            label: 'Tanıtım Sayfası (/)',
            href: '/',
            icon: <GoogleIcon name="home" size={16} />,
            badge: 'uxiGL',
            badgeTone: 'info',
          },
          {
            id: 'github-repo',
            label: 'GitHub Deposu',
            href: 'https://github.com/umitunc/uxigl',
            icon: <GithubIcon size={16} />,
            badge: `v${__UXIGL_VERSION__}`,
            badgeTone: 'primary',
          },
        ],
      },
    ],
    []
  );

  // Handler when selecting a component inside the InteractivePlayground or Quick Directory
  const handlePlaygroundComponentSelect = (compId: string) => {
    const sectionId = RouteService.getSectionForComponent(compId);
    setActiveSectionId(sectionId);
    setActiveSubItemId(compId);
  };

  // Unified handler when any Sidebar parent or sub-menu item is clicked
  const handleSidebarSelect = (itemId: string, subItemId?: string) => {
    if (itemId === 'landing') {
      setActiveSectionId('landing');
      setActiveSubItemId('home');
      return;
    }

    if (itemId === 'docs-guide') {
      setActiveSectionId('docs-guide');
      setActiveSubItemId(subItemId || 'getting-started');
      return;
    }

    if (
      itemId === 'sidebars' ||
      itemId === 'sidebar-showcase' ||
      itemId.startsWith('sidebar-')
    ) {
      setActiveSectionId('dashboard');
      setActiveSubItemId('sidebars');

      const targetVariantId = subItemId || itemId;
      if (targetVariantId === 'sidebar-stacked') {
        setSidebarVariant('stacked-vertical');
        setSidebarCollapsed(false);
      } else if (targetVariantId === 'sidebar-standard') {
        setSidebarVariant('standard');
        setSidebarCollapsed(false);
      } else if (targetVariantId === 'sidebar-mini') {
        setSidebarVariant('mini-rail');
        setSidebarCollapsed(true);
      } else if (targetVariantId === 'sidebar-dual') {
        setSidebarVariant('dual-column');
        setSidebarCollapsed(false);
      } else if (targetVariantId === 'sidebar-drawer') {
        setSidebarVariant('drawer');
        setMobileSidebarOpen(true);
      }
      return;
    }

    if (itemId === 'forms') {
      if (!subItemId || subItemId === 'forms') {
        setActiveSectionId('dashboard');
        setActiveSubItemId('forms');
      } else {
        handlePlaygroundComponentSelect(subItemId);
      }
      return;
    }

    if (itemId === 'elements' || itemId === 'elements-overview') {
      if (subItemId === 'sidebar') {
        handleSidebarSelect('sidebars');
        return;
      }
      if (
        !subItemId ||
        subItemId === 'elements-overview' ||
        itemId === 'elements-overview'
      ) {
        setActiveSectionId('dashboard');
        setActiveSubItemId('elements-overview');
      } else {
        handlePlaygroundComponentSelect(subItemId);
      }
      return;
    }

    if (
      INPUT_COMPONENT_IDS.has(itemId) ||
      SURFACE_COMPONENT_IDS.has(itemId) ||
      FEEDBACK_COMPONENT_IDS.has(itemId)
    ) {
      handlePlaygroundComponentSelect(itemId);
      return;
    }

    if (DASHBOARD_VIEW_IDS.has(itemId)) {
      setActiveSectionId('dashboard');
      setActiveSubItemId(itemId);
      return;
    }

    if (itemId === 'dashboard') {
      setActiveSectionId('dashboard');
      setActiveSubItemId(subItemId || 'overview');
      return;
    }

    const section = itemId as MainSectionId;
    setActiveSectionId(section);

    if (subItemId) {
      setActiveSubItemId(subItemId);
      return;
    }

    if (section === 'components-inputs') setActiveSubItemId('button');
    if (section === 'components-surfaces') setActiveSubItemId('card');
    if (section === 'components-feedback') setActiveSubItemId('chips-badges');
  };

  // Dynamic Breadcrumbs based on active Sidebar menu & sub-menu with explicit route hrefs
  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      {
        id: 'root',
        label: 'uxiGL',
        href: '/',
        onClick: () => handleSidebarSelect('landing', 'home'),
      },
    ];

    for (const grp of sidebarGroups) {
      for (const navItem of grp.items) {
        const hasSub = Boolean(navItem.subItems && navItem.subItems.length > 0);
        const matchingSub = navItem.subItems?.find(
          (s) => s.id === activeSubItemId
        );
        const isDirectDashboardMatch =
          !hasSub &&
          activeSectionId === 'dashboard' &&
          navItem.id === activeSubItemId;
        const isDirectSectionMatch = navItem.id === activeSectionId;

        if (isDirectDashboardMatch || isDirectSectionMatch || matchingSub) {
          const parentHref =
            navItem.href ??
            RouteService.buildPath(navItem.id, navItem.subItems?.[0]?.id);
          items.push({
            id: navItem.id,
            label: navItem.label,
            href: parentHref,
            onClick: () =>
              handleSidebarSelect(navItem.id, navItem.subItems?.[0]?.id),
          });
          if (matchingSub) {
            items.push({
              id: matchingSub.id,
              label: matchingSub.label,
              href:
                matchingSub.href ??
                RouteService.buildPath(activeSectionId, matchingSub.id),
            });
          }
          return items;
        }
      }
    }

    return items;
  }, [sidebarGroups, activeSectionId, activeSubItemId]);

  // Build universal Spotlight actions
  const commandActions = useMemo<CommandActionItem[]>(() => {
    const componentActions: CommandActionItem[] = COMPONENT_CATALOG.map(
      (entry) => ({
        id: `comp-${entry.id}`,
        title: `${entry.name} — ${entry.turkishTitle}`,
        subtitle: entry.summary,
        category: 'Bileşen Dokümantasyonu',
        icon: <Layers size={16} />,
        onSelect: () => handlePlaygroundComponentSelect(entry.id),
      })
    );

    const viewActions: CommandActionItem[] = [
      {
        id: 'view-get-started',
        title: 'Get Started — Kurulum & Hızlı Başlangıç Rehberi',
        subtitle: 'Adım adım kurulum, ThemeProvider ve ilk bileşen örneği',
        category: 'Başlangıç',
        icon: <Rocket size={16} />,
        shortcut: 'G S',
        onSelect: () => handleSidebarSelect('docs-guide', 'getting-started'),
      },
      {
        id: 'view-theming',
        title: 'Tema, Dark/Light Mode & Renk Paletleri Rehberi',
        subtitle: 'useTheme() kancası ve canlı CSS değişken laboratuvarı',
        category: 'Başlangıç',
        icon: <BookOpen size={16} />,
        shortcut: 'G T',
        onSelect: () => handleSidebarSelect('docs-guide', 'theming-tokens'),
      },
      {
        id: 'view-dash-overview',
        title: 'Komuta Merkezi — Genel Bakış (Dashboard)',
        subtitle: 'KPI kartları, gelir grafiği, canlı akış ve CRM tablosu',
        category: 'Dashboard',
        icon: <LayoutDashboard size={16} />,
        shortcut: 'G D',
        onSelect: () => handleSidebarSelect('dashboard', 'overview'),
      },
      {
        id: 'view-sidebar-showcase',
        title: 'Sidebar Çeşitleri — 5 Farklı Gezinme Modu',
        subtitle: 'Dikey, Standart Açık, Kapalı Ray, Çift Kolonlu ve Çekmece',
        category: 'Bileşenler',
        icon: <Layout size={16} />,
        shortcut: 'S B',
        onSelect: () => handlePlaygroundComponentSelect('sidebar'),
      },
    ];

    const themeActions: CommandActionItem[] = [
      {
        id: 'theme-toggle',
        title: `Tema Modunu Değiştir (${
          resolvedMode === 'dark' ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'
        })`,
        subtitle: 'Dark / Light Mode anlık geçişi',
        category: 'Tema',
        icon: resolvedMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
        shortcut: '⌘J',
        onSelect: () => {
          toggleMode();
          notify({
            title: 'Tema Modu Güncellendi',
            description: `Yeni mod: ${
              resolvedMode === 'dark' ? 'Light (Aydınlık)' : 'Dark (Karanlık)'
            }`,
            tone: 'info',
          });
        },
      },
      ...availablePalettes.map((p) => ({
        id: `palette-${p.id}`,
        title: `Renk Paleti: ${p.name}`,
        subtitle: `${p.inspiration} — ${p.description}`,
        category: 'Tohum Renk (Seed)',
        icon: <Palette size={16} />,
        onSelect: () => {
          setSeedPalette(p.id);
          notify({
            title: `${p.name} Etkinleştirildi`,
            description: p.description,
            tone: 'primary',
          });
        },
      })),
    ];

    return [...viewActions, ...themeActions, ...componentActions];
  }, [resolvedMode, availablePalettes, toggleMode, setSeedPalette, notify]);

  return (
    <div className="uxu-app-frame">
      {/* Hardware-Accelerated WebGL Aurora Borealis & Spatial Shader Canvas */}
      <WebGLAuroraCanvas />

      {activeSectionId === 'landing' ? (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100vh',
            overflowY: 'auto',
          }}
        >
          <UXILandingPage
            onNavigate={handleSidebarSelect}
            onOpenCommandPalette={() => setCmdPaletteOpen(true)}
          />
        </div>
      ) : (
        <>
          {/* Left Main Sidebar with Active Variant Mode */}
          <Sidebar
            variant={sidebarVariant}
            accentColor={sidebarAccent}
            drawerOpen={mobileSidebarOpen}
            onCloseDrawer={() => setMobileSidebarOpen(false)}
            groups={sidebarGroups}
            activeItemId={activeSectionId}
            activeSubItemId={activeSubItemId}
            collapsed={sidebarCollapsed}
            mobileOpen={mobileSidebarOpen}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            onCloseMobile={() => setMobileSidebarOpen(false)}
            onSelect={handleSidebarSelect}
            onOpenCommandPalette={() => setCmdPaletteOpen(true)}
            onOpenThemeStudio={() => setThemeDrawerOpen(true)}
          />

          {/* Right Full-Width Content Column (Fits Viewport 100%, Not Centered!) */}
          <div className="uxu-app-body">
            <TopHeader
              breadcrumbs={breadcrumbs}
              activeRoutePath={activeRoutePath}
              sidebarVariant={sidebarVariant}
              onSidebarVariantChange={(v) => {
                setSidebarVariant(v);
                window.dispatchEvent(
                  new CustomEvent('uxu:sidebar-variant-change', {
                    detail: { variant: v, accentColor: sidebarAccent },
                  })
                );
              }}
              onOpenDrawer={() => setMobileSidebarOpen(true)}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
              onOpenCommandPalette={() => setCmdPaletteOpen(true)}
              onOpenThemeStudio={() => setThemeDrawerOpen(true)}
            />

            <main className="uxu-workspace-viewport">
              {activeSectionId === 'docs-guide' && (
                <ArchitectureDocsView
                  activeTopic={activeSubItemId as DocsTopicId}
                  onTopicChange={(topic) =>
                    handleSidebarSelect('docs-guide', topic)
                  }
                  onSelectComponent={handlePlaygroundComponentSelect}
                  onOpenCommandPalette={() => setCmdPaletteOpen(true)}
                />
              )}

              {activeSectionId === 'dashboard' && (
                <AppleGoogleAppShowcase
                  activeSubView={activeSubItemId as DashboardSubView}
                  onSubViewChange={(sub) =>
                    handleSidebarSelect('dashboard', sub)
                  }
                  onSelectComponent={handlePlaygroundComponentSelect}
                  sidebarVariant={sidebarVariant}
                  onSidebarVariantChange={(v) => {
                    setSidebarVariant(v);
                    if (v === 'mini-rail') setSidebarCollapsed(true);
                    if (v === 'standard') setSidebarCollapsed(false);
                  }}
                  sidebarAccent={sidebarAccent}
                  onSidebarAccentChange={setSidebarAccent}
                  sidebarCollapsed={sidebarCollapsed}
                  onToggleSidebarCollapse={() => setSidebarCollapsed((p) => !p)}
                  onOpenDrawer={() => setMobileSidebarOpen(true)}
                />
              )}

              {(activeSectionId === 'components-inputs' ||
                activeSectionId === 'components-surfaces' ||
                activeSectionId === 'components-feedback') && (
                <InteractivePlayground
                  selectedComponentId={activeSubItemId}
                  onSelectComponent={handlePlaygroundComponentSelect}
                  onOpenCommandPalette={() => setCmdPaletteOpen(true)}
                />
              )}

              {/* Workspace Footer with NPM Usages & Trunçgil Signature */}
              <footer
                style={{
                  marginTop: 28,
                  paddingTop: 16,
                  borderTop: '1px solid var(--uxu-border-subtle)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  fontSize: '0.78rem',
                  color: 'var(--uxu-text-secondary)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                  <strong style={{ color: 'var(--uxu-text-primary)' }}>uxiGL v{__UXIGL_VERSION__}</strong>
                  <span>•</span>
                  <code
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--uxu-radius-sm)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                      fontFamily: 'var(--uxu-font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--uxu-primary)',
                    }}
                  >
                    $ npm i truncgil-uxigl
                  </code>
                  <code
                    style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--uxu-radius-sm)',
                      background: 'var(--uxu-surface-tonal)',
                      border: '1px solid var(--uxu-border-subtle)',
                      fontFamily: 'var(--uxu-font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--uxu-text-primary)',
                    }}
                  >
                    $ npx truncgil-uxigl init
                  </code>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>MIT License • © {new Date().getFullYear()} Crafted with ❤️ by</span>
                  <a
                    href="https://www.truncgil.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 9px',
                      borderRadius: 9999,
                      background:
                        'linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(249, 115, 22, 0.16), rgba(244, 63, 94, 0.16))',
                      border: '1px solid rgba(249, 115, 22, 0.4)',
                      color: resolvedMode === 'dark' ? '#fdba74' : '#ea580c',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    🍊 Trunçgil Teknoloji
                  </a>
                </div>
              </footer>
            </main>
          </div>
        </>
      )}

      {/* Spotlight Command Palette Modal (⌘K) */}
      <CommandPalette
        open={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        actions={commandActions}
      />

      {/* Live Theme Customizer Drawer */}
      <ThemeStudioDrawer
        open={themeDrawerOpen}
        onClose={() => setThemeDrawerOpen(false)}
        sidebarVariant={sidebarVariant}
        onSidebarVariantChange={(v) => {
          setSidebarVariant(v);
          if (v === 'mini-rail') setSidebarCollapsed(true);
          if (v === 'standard') setSidebarCollapsed(false);
          window.dispatchEvent(
            new CustomEvent('uxu:sidebar-variant-change', {
              detail: { variant: v, accentColor: sidebarAccent },
            })
          );
        }}
        sidebarAccent={sidebarAccent}
        onSidebarAccentChange={setSidebarAccent}
      />
    </div>
  );
};
