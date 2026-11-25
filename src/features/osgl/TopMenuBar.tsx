import React, { useMemo, useState } from 'react';
import { LayoutGrid, Moon, Palette, Search, Sun } from 'lucide-react';
import {
  TopAppsDropdown, TopViewDropdown, TopWidgetsDropdown, TopWindowDropdown, type TopMenuKey,
} from './TopMenuDropdowns';
import { MenuBarClock } from './WindowChrome';
import {
  OS_THEME_STUDIO_APP_ID, type OSDesktopWidgetDefinition, type OSWorkspaceApp,
  type WindowArrangeMode, type WindowControlsSide,
} from './types';
import type { SnapZone } from './windowGeometry';

export interface TopMenuBarProps {
  brandLogo?: React.ReactNode; brandTitle?: string; brandSubtitle?: string; onBrandClick?: () => void;
  headerRightSlot?: React.ReactNode; apps: OSWorkspaceApp[]; widgets: OSDesktopWidgetDefinition[];
  showMobileLayout: boolean; isMobileViewport: boolean;
  previewDevice: 'auto' | 'desktop' | 'mobile';
  setPreviewDevice: React.Dispatch<React.SetStateAction<'auto' | 'desktop' | 'mobile'>>;
  arrangeMenuOpen: boolean; setArrangeMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  arrangeWindows: (mode: WindowArrangeMode) => void; closeAllWindows: () => void;
  activeWindowMaximized?: boolean; activeWindowFullscreen?: boolean;
  onMaximizeActive?: () => void; onFullscreenActive?: () => void;
  onSnapActiveWindow?: (zone: Exclude<SnapZone, null>) => void;
  windowControlsSide?: WindowControlsSide; onToggleWindowControlsSide?: () => void;
  dockVisible: boolean; onToggleDock: () => void;
  widgetsVisible: boolean; onToggleWidgets: () => void;
  enabledWidgets: Record<string, boolean>; onToggleWidgetItem: (id: string) => void;
  onCustomizeWidget?: (id: string, anchorX: number, anchorY: number) => void;
  onResetWidgetPositions: () => void; onResetIcons: () => void;
  onCreateFolder?: () => void; onOpenDockCustomizer?: () => void;
  onOpenApp: (id: string) => void; onOpenGlobalThemeStudio?: () => void;
  onOpenSpotlight: () => void; onToggleMode: () => void;
  onSwitchToClassic?: () => void; isDark: boolean; effectiveIsLightBg?: boolean;
}

export function TopMenuBar({
  brandLogo, brandTitle = 'uxiGL', brandSubtitle, onBrandClick, headerRightSlot, apps, widgets,
  showMobileLayout, isMobileViewport, previewDevice, setPreviewDevice,
  arrangeMenuOpen, setArrangeMenuOpen, arrangeWindows, closeAllWindows,
  activeWindowMaximized = false, activeWindowFullscreen = false,
  onMaximizeActive, onFullscreenActive, onSnapActiveWindow,
  windowControlsSide = 'right', onToggleWindowControlsSide,
  dockVisible, onToggleDock, widgetsVisible, onToggleWidgets, enabledWidgets, onToggleWidgetItem,
  onCustomizeWidget, onResetWidgetPositions, onResetIcons, onCreateFolder, onOpenDockCustomizer, onOpenApp,
  onOpenSpotlight, onToggleMode, onSwitchToClassic, isDark, effectiveIsLightBg = false,
}: TopMenuBarProps) {
  const [openMenu, setOpenMenu] = useState<TopMenuKey>(null);
  const activeMenu: TopMenuKey = arrangeMenuOpen ? 'window' : openMenu;
  const topTextColor = effectiveIsLightBg ? '#0f172a' : '#f8fafc';
  const topPillBg = effectiveIsLightBg ? 'rgba(15, 23, 42, 0.09)' : 'rgba(255, 255, 255, 0.16)';
  const topPillBorder = effectiveIsLightBg ? 'rgba(15, 23, 42, 0.18)' : 'rgba(255, 255, 255, 0.24)';
  const topTextShadow = effectiveIsLightBg
    ? '0 1px 1px rgba(255, 255, 255, 0.55)'
    : '0 1px 3px rgba(2, 6, 23, 0.48)';

  const appsByCategory = useMemo(() => {
    const groups = new Map<string, OSWorkspaceApp[]>();
    apps.forEach((app) => {
      if (app.id === OS_THEME_STUDIO_APP_ID) return;
      const list = groups.get(app.category) ?? [];
      list.push(app);
      groups.set(app.category, list);
    });
    return Array.from(groups.entries());
  }, [apps]);

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute', top: 36, left: 0, width: 248, padding: 6, borderRadius: 13,
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    textShadow: 'none',
    backdropFilter: 'blur(30px) saturate(190%)',
    WebkitBackdropFilter: 'blur(30px) saturate(190%)',
    border: isDark ? '1px solid rgba(255,255,255,0.20)' : '1px solid rgba(15,23,42,0.14)',
    boxShadow: isDark
      ? '0 22px 54px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.12)'
      : '0 20px 48px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.9)',
    display: 'flex', flexDirection: 'column', gap: 2, zIndex: 2260,
  };

  const menuBtnStyle = (active: boolean): React.CSSProperties => ({
    border: 'none', background: active ? topPillBg : 'transparent', color: topTextColor,
    textShadow: topTextShadow,
    fontSize: 12.5, fontWeight: 650, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', whiteSpace: 'nowrap',
  });

  const trayIconBtnStyle = (active = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28,
    padding: 0, borderRadius: 7, border: 'none', backgroundColor: active ? topPillBg : 'transparent',
    color: topTextColor, cursor: 'pointer',
  });

  const activateHoverMenu = (key: Exclude<TopMenuKey, null>) => {
    if (activeMenu === null || activeMenu === key) return;
    if (key === 'window') { setOpenMenu(null); setArrangeMenuOpen(true); return; }
    setArrangeMenuOpen(false);
    setOpenMenu(key);
  };

  const toggleMenu = (key: Exclude<TopMenuKey, null>, e: React.MouseEvent) => {
    e.stopPropagation();
    if (key === 'window') { setOpenMenu(null); setArrangeMenuOpen((v) => !v); return; }
    setArrangeMenuOpen(false);
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const closeAllMenus = () => { setOpenMenu(null); setArrangeMenuOpen(false); };

  return (
    <>
      {activeMenu !== null && (
        <div aria-hidden="true" onClick={closeAllMenus} style={{ position: 'fixed', inset: 0, zIndex: 2190 }} />
      )}
      <header
        data-testid="osgl-top-menubar"
        data-menubar-light={effectiveIsLightBg ? 'true' : 'false'}
        onClick={closeAllMenus}
        style={
          {
            '--osgl-bar-fg': topTextColor,
            '--osgl-bar-pill-bg': topPillBg,
            '--osgl-bar-pill-border': topPillBorder,
            position: 'relative',
            height: 44,
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            color: topTextColor,
            textShadow: topTextShadow,
            background: effectiveIsLightBg
              ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.56) 0%, rgba(255, 255, 255, 0.28) 72%, rgba(255, 255, 255, 0.12) 100%)'
              : 'linear-gradient(180deg, rgba(8, 13, 26, 0.48) 0%, rgba(8, 13, 26, 0.22) 72%, rgba(8, 13, 26, 0.08) 100%)',
            backdropFilter: 'blur(24px) saturate(185%)',
            WebkitBackdropFilter: 'blur(24px) saturate(185%)',
            borderBottom: effectiveIsLightBg
              ? '1px solid rgba(15, 23, 42, 0.08)'
              : '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: effectiveIsLightBg
              ? '0 4px 18px rgba(15, 23, 42, 0.04)'
              : '0 4px 20px rgba(2, 6, 23, 0.16)',
            zIndex: 2200,
            flexShrink: 0,
          } as React.CSSProperties
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'visible' }}>
          <div
            onClick={onBrandClick ? (e) => { e.stopPropagation(); onBrandClick(); } : undefined}
            role={onBrandClick ? 'button' : undefined}
            tabIndex={onBrandClick ? 0 : undefined}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '2px 6px 2px 2px', marginRight: 2, minWidth: 0, cursor: onBrandClick ? 'pointer' : undefined }}
          >
            {brandLogo}
            <span style={{ fontWeight: 800, fontSize: 13.5, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>{brandTitle}</span>
            {brandSubtitle && !showMobileLayout && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, backgroundColor: topPillBg, border: `1px solid ${topPillBorder}`, whiteSpace: 'nowrap' }}>
                {brandSubtitle}
              </span>
            )}
          </div>

          {!showMobileLayout && (
            <>
              <div style={{ position: 'relative' }} onMouseEnter={() => activateHoverMenu('apps')}>
                <button
                  type="button"
                  data-testid="osgl-menubar-apps-btn"
                  aria-haspopup="menu"
                  aria-expanded={activeMenu === 'apps'}
                  className="osgl-menubar-btn"
                  onClick={(e) => toggleMenu('apps', e)}
                  style={menuBtnStyle(activeMenu === 'apps')}
                >
                  Modüller ({apps.filter((a) => a.id !== OS_THEME_STUDIO_APP_ID).length})
                </button>
                {activeMenu === 'apps' && (
                  <TopAppsDropdown appsByCategory={appsByCategory} isDark={isDark} dropdownStyle={dropdownStyle} onOpenApp={onOpenApp} closeAllMenus={closeAllMenus} />
                )}
              </div>

              <div style={{ position: 'relative' }} onMouseEnter={() => activateHoverMenu('window')}>
                <button
                  type="button"
                  data-testid="osgl-menubar-window-btn"
                  aria-haspopup="menu"
                  aria-expanded={activeMenu === 'window'}
                  className="osgl-menubar-btn"
                  onClick={(e) => toggleMenu('window', e)}
                  style={menuBtnStyle(activeMenu === 'window')}
                >
                  Pencere
                </button>
                {activeMenu === 'window' && (
                  <TopWindowDropdown
                    dropdownStyle={dropdownStyle} isDark={isDark} activeWindowMaximized={activeWindowMaximized}
                    activeWindowFullscreen={activeWindowFullscreen} onMaximizeActive={onMaximizeActive}
                    onFullscreenActive={onFullscreenActive} onSnapActiveWindow={onSnapActiveWindow}
                    arrangeWindows={arrangeWindows} closeAllWindows={closeAllWindows} closeAllMenus={closeAllMenus}
                  />
                )}
              </div>

              <div style={{ position: 'relative' }} onMouseEnter={() => activateHoverMenu('view')}>
                <button
                  type="button"
                  data-testid="osgl-menubar-view-btn"
                  aria-haspopup="menu"
                  aria-expanded={activeMenu === 'view'}
                  className="osgl-menubar-btn"
                  onClick={(e) => toggleMenu('view', e)}
                  style={menuBtnStyle(activeMenu === 'view')}
                >
                  Görünüm
                </button>
                {activeMenu === 'view' && (
                  <TopViewDropdown
                    dropdownStyle={dropdownStyle} isDark={isDark} dockVisible={dockVisible}
                    widgetsVisible={widgetsVisible} windowControlsSide={windowControlsSide}
                    onToggleWindowControlsSide={onToggleWindowControlsSide}
                    isMobileViewport={isMobileViewport}
                    previewDevice={previewDevice} setPreviewDevice={setPreviewDevice}
                    onSwitchToClassic={onSwitchToClassic} onToggleMode={onToggleMode}
                    onToggleDock={onToggleDock} onToggleWidgets={onToggleWidgets}
                    onCreateFolder={onCreateFolder} onOpenDockCustomizer={onOpenDockCustomizer}
                    onResetIcons={onResetIcons} closeAllMenus={closeAllMenus}
                  />
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: showMobileLayout ? 2 : 4, flexShrink: 0 }}>
          {headerRightSlot}
          <button
            type="button"
            data-testid="osgl-open-theme-studio-btn"
            onClick={() => onOpenApp(OS_THEME_STUDIO_APP_ID)}
            title="OS Tema Stüdyosu (Kabuk, Duvar Kağıdı, Simgeler & Görünüm Ayarları)"
            aria-label="OS Tema Stüdyosu"
            style={trayIconBtnStyle()}
          >
            <Palette size={15.5} />
          </button>

          <button type="button" onClick={onOpenSpotlight} title="Modül & Pencere Ara (Ctrl+K)" aria-label="Modül Ara" style={trayIconBtnStyle()}>
            <Search size={15.5} />
          </button>

          <button
            type="button" onClick={onToggleMode}
            title={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
            aria-label={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
            style={trayIconBtnStyle()}
          >
            {isDark ? <Sun size={15.5} /> : <Moon size={15.5} />}
          </button>

          {!showMobileLayout && widgets.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button
                type="button" aria-label="Widget Ayarları" title="Masaüstü Widget Ayarları"
                onClick={(e) => toggleMenu('widgets', e)} style={trayIconBtnStyle(activeMenu === 'widgets')}
              >
                <LayoutGrid size={15.5} />
              </button>
              {activeMenu === 'widgets' && (
                <TopWidgetsDropdown
                  dropdownStyle={dropdownStyle} isDark={isDark} widgets={widgets} widgetsVisible={widgetsVisible}
                  enabledWidgets={enabledWidgets} onToggleWidgets={onToggleWidgets}
                  onToggleWidgetItem={onToggleWidgetItem} onCustomizeWidget={onCustomizeWidget}
                  onResetWidgetPositions={onResetWidgetPositions} closeAllMenus={closeAllMenus}
                />
              )}
            </div>
          )}

          <MenuBarClock />
        </div>
      </header>
    </>
  );
}
