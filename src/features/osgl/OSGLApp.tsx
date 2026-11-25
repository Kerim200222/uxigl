import React, { useEffect, useMemo, useState } from 'react';
import { Monitor } from 'lucide-react';
import {
  Button,
  GoogleIcon,
} from '../../components/primitives';
import {
  CommandPalette,
  Sidebar,
  TopHeader,
  type CommandActionItem,
} from '../../components/composites';
import type { SidebarNavGroup, SidebarVariant } from '../../core/contracts/NavigationContract';
import type { SeedPaletteId, ThemeMode, WorkspaceShellPreset } from '../../core/contracts/ThemeContract';
import { ThemeProvider, useOptionalTheme, useTheme } from '../../providers/ThemeProvider';
import { ToastProvider, useOptionalToast } from '../../providers/ToastProvider';
import { ThemeStudioDrawer } from '../theme-studio/ThemeStudioDrawer';
import { OSWorkspaceShell, type OSWorkspaceShellProps } from './OSWorkspaceShell';
import type { OSWorkspaceApp } from './types';

export interface OSGLAppProps extends Omit<OSWorkspaceShellProps, 'onSwitchToClassic'> {
  /** Initial theme mode when OSGLApp auto-mounts ThemeProvider (default: 'dark') */
  defaultMode?: ThemeMode;
  /** Initial seed palette when OSGLApp auto-mounts ThemeProvider (default: 'cupertino-blue') */
  defaultPalette?: SeedPaletteId;
  /** Initial border radius in px when OSGLApp auto-mounts ThemeProvider (default: 12) */
  defaultRadius?: number;
  /** Initial workspace shell (default: 'osgl') */
  defaultShell?: WorkspaceShellPreset;
  /** Enables seamless switching between OSGL Desktop and Classic Sidebar shells (default: true) */
  allowClassicSwitch?: boolean;
}

function buildSidebarGroupsFromApps(apps: OSWorkspaceApp[]): SidebarNavGroup[] {
  const byCategory = new Map<string, OSWorkspaceApp[]>();
  for (const app of apps) {
    const cat = app.category || 'Modüller';
    const list = byCategory.get(cat) ?? [];
    list.push(app);
    byCategory.set(cat, list);
  }
  return Array.from(byCategory.entries()).map(([cat, list]) => ({
    id: `cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: cat,
    items: list.map((app) => ({
      id: app.id,
      label: app.label,
      icon: app.iconNode ?? <GoogleIcon name={app.googleIcon} size={18} />,
      badge: app.badge,
    })),
  }));
}

const OSGLAppInner: React.FC<OSGLAppProps> = ({
  apps,
  allowClassicSwitch = true,
  defaultShell = 'osgl',
  renderWindowContent,
  brandTitle = 'uxiGL',
  ...shellProps
}) => {
  const theme = useTheme();
  const activeShell = theme.preferences.workspaceShell ?? defaultShell;
  const isOSGL = activeShell === 'osgl' || (activeShell === 'auto' && defaultShell === 'osgl');

  const [activeAppId, setActiveAppId] = useState<string>(() => apps[0]?.id ?? '');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [sidebarVariant, setSidebarVariant] = useState<SidebarVariant>(
    theme.preferences.sidebarVariant ?? 'standard'
  );

  useEffect(() => {
    if (theme.preferences.sidebarVariant) {
      setSidebarVariant(theme.preferences.sidebarVariant);
    }
  }, [theme.preferences.sidebarVariant]);

  useEffect(() => {
    if (!apps.some((a) => a.id === activeAppId) && apps[0]) {
      setActiveAppId(apps[0].id);
    }
  }, [apps, activeAppId]);

  const sidebarGroups = useMemo(() => buildSidebarGroupsFromApps(apps), [apps]);

  const commandActions = useMemo<CommandActionItem[]>(
    () => [
      ...apps.map((app) => ({
        id: `classic-app-${app.id}`,
        title: app.label,
        subtitle: app.description ?? app.category,
        category: app.category,
        icon: app.iconNode ?? <GoogleIcon name={app.googleIcon} size={18} />,
        onSelect: () => setActiveAppId(app.id),
      })),
      ...(allowClassicSwitch
        ? [
            {
              id: 'switch-to-osgl',
              title: 'OSGL Masaüstüne Dön',
              subtitle: 'Yüzen pencere ve WebGL masaüstü modunu aç',
              category: 'Görünüm',
              onSelect: () => theme.setWorkspaceShell('osgl'),
            },
          ]
        : []),
    ],
    [apps, allowClassicSwitch, theme]
  );

  const resolveClassicContent = (appId: string): React.ReactNode => {
    if (renderWindowContent) {
      const custom = renderWindowContent(appId);
      if (custom !== undefined) return custom;
    }
    const matched = apps.find((a) => a.id === appId);
    if (matched?.render) return matched.render();
    if (matched?.element !== undefined) return matched.element;
    return null;
  };

  if (isOSGL) {
    return (
      <OSWorkspaceShell
        {...shellProps}
        apps={apps}
        brandTitle={brandTitle}
        renderWindowContent={renderWindowContent}
        onSwitchToClassic={
          allowClassicSwitch ? () => theme.setWorkspaceShell('enterprisegl') : undefined
        }
      />
    );
  }

  const activeApp = apps.find((a) => a.id === activeAppId) ?? apps[0];

  return (
    <div
      data-testid="osgl-classic-shell"
      style={{
        display: 'flex',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        isolation: 'isolate',
        backgroundColor: 'var(--uxu-bg-canvas)',
        color: 'var(--uxu-text-primary)',
        fontFamily: 'var(--uxu-font-sans)',
      }}
    >
      <Sidebar
        variant={sidebarVariant}
        groups={sidebarGroups}
        activeItemId={activeAppId}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        drawerOpen={mobileOpen}
        onCloseDrawer={() => setMobileOpen(false)}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        onSelect={(itemId) => {
          setActiveAppId(itemId);
          setMobileOpen(false);
        }}
        onOpenCommandPalette={() => setCmdOpen(true)}
        onOpenThemeStudio={() => setStudioOpen(true)}
      />

      <div className="uxu-app-body" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        <TopHeader
          breadcrumbs={[
            { id: 'root', label: brandTitle },
            ...(activeApp ? [{ id: activeApp.id, label: activeApp.label }] : []),
          ]}
          sidebarVariant={sidebarVariant}
          onSidebarVariantChange={setSidebarVariant}
          onOpenDrawer={() => setMobileOpen(true)}
          onOpenMobileMenu={() => setMobileOpen(true)}
          onOpenCommandPalette={() => setCmdOpen(true)}
          onOpenThemeStudio={() => setStudioOpen(true)}
        />

        {allowClassicSwitch && (
          <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 90 }}>
            <Button
              size="sm"
              onClick={() => theme.setWorkspaceShell('osgl')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
            >
              <Monitor size={14} />
              <span>OSGL Masaüstü</span>
            </Button>
          </div>
        )}

        <main className="uxu-workspace-viewport" style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {activeApp ? resolveClassicContent(activeApp.id) : null}
        </main>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} actions={commandActions} />
      <ThemeStudioDrawer
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        sidebarVariant={sidebarVariant}
        onSidebarVariantChange={setSidebarVariant}
        defaultRoleShell="enterprisegl"
      />
    </div>
  );
};

/**
 * Turnkey OSGL + Multi-Shell Application Wrapper.
 * Automatically wraps with ThemeProvider & ToastProvider if not already present,
 * includes all 6 built-in desktop widgets, Spotlight (⌘K), OS Theme Studio,
 * Global Theme Studio, and seamless Classic Sidebar switching.
 */
export const OSGLApp: React.FC<OSGLAppProps> = ({
  defaultMode = 'dark',
  defaultPalette = 'cupertino-blue',
  defaultRadius = 12,
  defaultShell = 'osgl',
  storageScopeKey,
  ...rest
}) => {
  const existingTheme = useOptionalTheme();
  const existingToast = useOptionalToast();

  let content: React.ReactNode = (
    <OSGLAppInner
      {...rest}
      storageScopeKey={storageScopeKey}
      defaultShell={defaultShell}
    />
  );

  if (!existingToast) {
    content = <ToastProvider>{content}</ToastProvider>;
  }

  if (!existingTheme) {
    content = (
      <ThemeProvider
        defaultMode={defaultMode}
        defaultPalette={defaultPalette}
        defaultRadius={defaultRadius}
        defaultShell={defaultShell}
        initialUserScopeKey={storageScopeKey}
      >
        {content}
      </ThemeProvider>
    );
  }

  return <>{content}</>;
};

export { OSGLApp as UXIAppShell };
export default OSGLApp;
