import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CommandPalette } from '../../components/composites';
import { ContextMenu } from './ContextMenu';
import { DesktopFolderPopoverModal } from './DesktopFolderPopoverModal';
import { DesktopGrid } from './DesktopGrid';
import { DesktopWidgetsHost } from './DesktopWidgetsHost';
import { Dock } from './Dock';
import { DockCustomizerPopover } from './DockCustomizerPopover';
import { FloatingWindows } from './FloatingWindows';
import { ItemContextMenu } from './ItemContextMenu';
import { MobileLauncher } from './MobileLauncher';
import { OSThemeStudioPanel } from './OSThemeStudioPanel';
import { ThemeStudioDrawer } from '../theme-studio/ThemeStudioDrawer';
import type { OSWallpaperId } from './osglEngine';
import { buildSpotlightActions, OSGL_SHELL_CSS } from './osglShellStyles';
import { TopMenuBar } from './TopMenuBar';
import type { BgMode, DesktopFolder, OSDesktopWidgetDefinition, OSWorkspaceApp } from './types';
import { useDesktopState } from './useDesktopState';
import { WidgetCustomizePopover } from './WidgetCustomizePopover';
import { createDefaultOSGLWidgets } from './widgets';

export interface OSWorkspaceShellProps {
  apps: OSWorkspaceApp[]; dockAppIds?: string[]; defaultFolders?: DesktopFolder[]; widgets?: OSDesktopWidgetDefinition[];
  /** Extra host-specific widgets merged alongside default/custom widgets without collision */
  extraWidgets?: OSDesktopWidgetDefinition[];
  /** When widgets prop is omitted, automatically includes the 6 built-in OSGL desktop widgets (default: true) */
  includeDefaultWidgets?: boolean;
  storageScopeKey?: string; initialWallpaper?: OSWallpaperId; brandLogo?: React.ReactNode;
  brandTitle?: string; brandSubtitle?: string; onBrandClick?: () => void; headerRightSlot?: React.ReactNode;
  topBannerSlot?: React.ReactNode;
  /** Optional window content renderer; falls back to app.render?.() ?? app.element */
  renderWindowContent?: (appId: string) => React.ReactNode;
  onSwitchToClassic?: () => void; onOpenGlobalThemeStudio?: () => void;
  /** Automatically provides built-in ThemeStudioDrawer when onOpenGlobalThemeStudio is omitted (default: true) */
  enableBuiltInGlobalThemeStudio?: boolean;
  defaultOpenAppIds?: string[];
  externalOpenRequest?: { appId: string; nonce: number } | null;
  locale?: 'tr' | 'en' | 'ru';
  /** Optional project login background URL exposed as a quick background option in OS Theme Studio */
  loginBgUrl?: string;
  /** Optional external background state synced from host Theme Studio */
  externalBackground?: {
    wallpaper?: OSWallpaperId;
    bgMode?: BgMode;
    solidBgColor?: string;
    bgGradColor1?: string;
    bgGradColor2?: string;
    customBgUrl?: string;
  };
}

export const OSWorkspaceShell: React.FC<OSWorkspaceShellProps> = ({
  apps, dockAppIds, defaultFolders, widgets, extraWidgets = [], includeDefaultWidgets = true,
  storageScopeKey, initialWallpaper = 'dijios-oxford',
  brandLogo, brandTitle = 'uxiGL', brandSubtitle, onBrandClick, headerRightSlot, topBannerSlot,
  renderWindowContent, onSwitchToClassic, onOpenGlobalThemeStudio,
  enableBuiltInGlobalThemeStudio = true, defaultOpenAppIds, externalOpenRequest, locale = 'tr',
  loginBgUrl, externalBackground,
}) => {
  const effectiveWidgets = useMemo<OSDesktopWidgetDefinition[]>(() => {
    const base = widgets ?? (includeDefaultWidgets ? createDefaultOSGLWidgets({ storageScopeKey }) : []);
    if (!extraWidgets.length) return base;
    const seen = new Set(base.map((w) => w.id));
    return [...base, ...extraWidgets.filter((w) => !seen.has(w.id))];
  }, [widgets, includeDefaultWidgets, storageScopeKey, extraWidgets]);

  const [internalStudioOpen, setInternalStudioOpen] = useState(false);
  const handleOpenGlobalThemeStudio = onOpenGlobalThemeStudio
    ?? (enableBuiltInGlobalThemeStudio ? () => setInternalStudioOpen(true) : undefined);

  const resolvedRenderWindowContent = useMemo(() => {
    return (appId: string): React.ReactNode => {
      if (renderWindowContent) {
        const custom = renderWindowContent(appId);
        if (custom !== undefined) return custom;
      }
      const matched = apps.find((a) => a.id === appId);
      if (matched?.render) return matched.render();
      if (matched?.element !== undefined) return matched.element;
      return null;
    };
  }, [renderWindowContent, apps]);

  const os = useDesktopState({
    apps, dockAppIds, defaultFolders, widgets: effectiveWidgets, scopeKey: storageScopeKey, initialWallpaper, defaultOpenAppIds,
  });
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [customizingWidget, setCustomizingWidget] = useState<{ id: string; x: number; y: number } | null>(null);
  const activeCustomWidget = customizingWidget ? effectiveWidgets.find((w) => w.id === customizingWidget.id) ?? null : null;

  const prevWorkspaceShellRef = useRef(os.theme.preferences.workspaceShell);
  useEffect(() => {
    const nextShell = os.theme.preferences.workspaceShell;
    if (prevWorkspaceShellRef.current === nextShell) return;
    prevWorkspaceShellRef.current = nextShell;
    if (nextShell && nextShell !== 'auto' && nextShell !== 'osgl' && onSwitchToClassic) {
      onSwitchToClassic();
    }
  }, [os.theme.preferences.workspaceShell, onSwitchToClassic]);

  useEffect(() => {
    if (externalOpenRequest?.appId) os.openApp(externalOpenRequest.appId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalOpenRequest?.nonce]);

  useEffect(() => {
    if (!externalBackground) return;
    if (externalBackground.wallpaper !== undefined) os.setWallpaper(externalBackground.wallpaper);
    if (externalBackground.bgMode !== undefined) os.setBgMode(externalBackground.bgMode);
    if (externalBackground.solidBgColor !== undefined) os.setSolidBgColor(externalBackground.solidBgColor);
    if (externalBackground.bgGradColor1 !== undefined) os.setBgGradColor1(externalBackground.bgGradColor1);
    if (externalBackground.bgGradColor2 !== undefined) os.setBgGradColor2(externalBackground.bgGradColor2);
    if (externalBackground.customBgUrl !== undefined) {
      os.setUploadedBgDataUrl('');
      os.setCustomBgUrl(externalBackground.customBgUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    externalBackground?.wallpaper,
    externalBackground?.bgMode,
    externalBackground?.solidBgColor,
    externalBackground?.bgGradColor1,
    externalBackground?.bgGradColor2,
    externalBackground?.customBgUrl,
  ]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); e.stopImmediatePropagation(); setSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  const topActiveWindow = useMemo(() => {
    const visible = os.windows.filter((w) => !w.minimized);
    return visible.length === 0 ? null : visible.reduce((best, cur) => (cur.zIndex >= best.zIndex ? cur : best));
  }, [os.windows]);

  const hasExpandedWindow = os.windows.some((w) => !w.minimized && (w.maximized || w.fullscreen));
  const hasFullscreenWindow = os.windows.some((w) => !w.minimized && Boolean(w.fullscreen));

  const spotlightActions = useMemo(
    () => buildSpotlightActions({ allApps: os.allApps, openApp: os.openApp, arrangeWindows: os.arrangeWindows, onSwitchToClassic }),
    [onSwitchToClassic, os.allApps, os.openApp, os.arrangeWindows]
  );
  const activeOpenFolder = useMemo(() => os.folders.find((f) => f.id === os.openFolderId) ?? null, [os.folders, os.openFolderId]);

  const renderThemeStudio = () => (
    <OSThemeStudioPanel
      theme={os.theme} wallpaper={os.wallpaper} setWallpaper={os.setWallpaper}
      bgMode={os.bgMode} setBgMode={os.setBgMode} solidBgColor={os.solidBgColor} setSolidBgColor={os.setSolidBgColor}
      bgGradColor1={os.bgGradColor1} setBgGradColor1={os.setBgGradColor1} bgGradColor2={os.bgGradColor2} setBgGradColor2={os.setBgGradColor2}
      customBgUrl={os.customBgUrl} setCustomBgUrl={os.setCustomBgUrl} uploadedBgDataUrl={os.uploadedBgDataUrl} setUploadedBgDataUrl={os.setUploadedBgDataUrl}
      qualityMode={os.qualityMode} setQualityMode={os.setQualityMode} dockVisible={os.dockVisible} setDockVisible={os.setDockVisible}
      widgetsVisible={os.widgetsVisible} setWidgetsVisible={os.setWidgetsVisible} windowAnimation={os.windowAnimation} setWindowAnimation={os.setWindowAnimation}
      windowControlsSide={os.windowControlsSide} setWindowControlsSide={os.setWindowControlsSide} iconBgStyle={os.iconBgStyle} setIconBgStyle={os.setIconBgStyle}
      iconBgColor={os.iconBgColor} setIconBgColor={os.setIconBgColor} iconGradColor1={os.iconGradColor1} setIconGradColor1={os.setIconGradColor1}
      iconGradColor2={os.iconGradColor2} setIconGradColor2={os.setIconGradColor2} iconColor={os.iconColor} setIconColor={os.setIconColor}
      iconSizePx={os.iconSizePx} setIconSizePx={os.setIconSizePx} onResetIcons={os.resetIconSlots} onResetWidgets={os.resetWidgetPositions}
      onCreateFolder={() => os.createFolder()} onOpenDockCustomizer={() => os.setDockCustomizerOpen(true)} onResetDock={os.resetDockToDefault}
      onSwitchToClassic={onSwitchToClassic} onOpenFullThemeStudio={handleOpenGlobalThemeStudio}
      loginBgUrl={loginBgUrl}
    />
  );

  return (
    <div
      data-testid="osgl-workspace-shell"
      onContextMenu={(e) => {
        if (os.showMobileLayout || (e.target as HTMLElement).closest('[data-macos-window="true"]')) return;
        e.preventDefault(); os.setArrangeMenuOpen(false); os.setItemContextMenu(null);
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 820;
        os.setContextMenu({ x: Math.min(e.clientX, vw - 256), y: Math.min(e.clientY, vh - 380) });
      }}
      style={{
        position: 'relative', width: '100%', height: '100dvh', maxHeight: '100dvh',
        isolation: 'isolate',
        background: os.desktopBackground, color: os.barTextColor, fontFamily: 'var(--uxu-font-sans)',
        WebkitFontSmoothing: 'antialiased', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}
    >
      <style>{OSGL_SHELL_CSS}</style>

      {os.useWebGLAurora && (
        <canvas
          ref={os.canvasRef} aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        />
      )}

      <TopMenuBar
        brandLogo={brandLogo} brandTitle={brandTitle} brandSubtitle={brandSubtitle} onBrandClick={onBrandClick}
        headerRightSlot={headerRightSlot} apps={os.allApps} widgets={effectiveWidgets}
        showMobileLayout={os.showMobileLayout} isMobileViewport={os.isMobileViewport}
        previewDevice={os.previewDevice} setPreviewDevice={os.setPreviewDevice}
        arrangeMenuOpen={os.arrangeMenuOpen} setArrangeMenuOpen={os.setArrangeMenuOpen}
        arrangeWindows={os.arrangeWindows} closeAllWindows={() => os.setWindows([])}
        activeWindowMaximized={Boolean(topActiveWindow?.maximized)}
        activeWindowFullscreen={Boolean(topActiveWindow?.fullscreen)}
        onMaximizeActive={topActiveWindow ? () => os.toggleMaximize(topActiveWindow.id) : undefined}
        onFullscreenActive={topActiveWindow ? () => os.toggleFullscreen(topActiveWindow.id) : undefined}
        onSnapActiveWindow={topActiveWindow ? (zone) => os.snapWindow(topActiveWindow.id, zone) : undefined}
        windowControlsSide={os.windowControlsSide}
        onToggleWindowControlsSide={() => os.setWindowControlsSide((s) => (s === 'left' ? 'right' : 'left'))}
        dockVisible={os.dockVisible} onToggleDock={() => os.setDockVisible((v) => !v)}
        widgetsVisible={os.widgetsVisible} onToggleWidgets={() => os.setWidgetsVisible((v) => !v)}
        enabledWidgets={os.enabledWidgets} onToggleWidgetItem={os.toggleWidgetItem}
        onCustomizeWidget={(id, x, y) => {
          if (os.enabledWidgets[id] === false) os.toggleWidgetItem(id);
          if (!os.widgetsVisible) os.setWidgetsVisible(true);
          setCustomizingWidget({ id, x, y });
        }}
        onResetWidgetPositions={os.resetWidgetPositions} onResetIcons={os.resetIconSlots}
        onCreateFolder={() => os.createFolder()}
        onOpenDockCustomizer={() => os.setDockCustomizerOpen(true)}
        onOpenApp={os.openApp} onOpenGlobalThemeStudio={handleOpenGlobalThemeStudio}
        onOpenSpotlight={() => setSpotlightOpen(true)} onToggleMode={os.theme.toggleMode}
        onSwitchToClassic={onSwitchToClassic} isDark={os.isDark} effectiveIsLightBg={os.effectiveIsLightBg}
        locale={locale}
      />

      {topBannerSlot && <div style={{ position: 'relative', zIndex: 1990 }}>{topBannerSlot}</div>}

      {os.showMobileLayout ? (
        <MobileLauncher
          apps={os.desktopApps} dockApps={os.effectiveDockApps} isMobileViewport={os.isMobileViewport}
          desktopBackground={os.desktopBackground} isDark={os.isDark} chromePillBg={os.chromePillBg}
          chromeBorder={os.chromeBorder} chromeText={os.chromeText} glassBlur={os.glassBlur}
          barTextColor={os.barTextColor} effectiveIsLightBg={os.effectiveIsLightBg} paletteTokens={os.paletteTokens}
          iconBgStyle={os.iconBgStyle} iconBgColor={os.iconBgColor} iconGradColor1={os.iconGradColor1}
          iconGradColor2={os.iconGradColor2} iconColor={os.iconColor} searchQuery={os.searchQuery}
          setSearchQuery={os.setSearchQuery} mobileOpenAppId={os.mobileOpenAppId}
          setMobileOpenAppId={os.setMobileOpenAppId} dockVisible={os.dockVisible}
          onOpenApp={os.openApp} renderWindowContent={resolvedRenderWindowContent} renderThemeStudio={renderThemeStudio}
        />
      ) : (
        <DesktopGrid
          apps={os.desktopApps} folders={os.folders} renamingFolderId={os.renamingFolderId}
          isDark={os.isDark} barTextColor={os.barTextColor}
          effectiveIsLightBg={os.effectiveIsLightBg} primaryColor={os.paletteTokens.primary}
          iconBgStyle={os.iconBgStyle} iconBgColor={os.iconBgColor} iconGradColor1={os.iconGradColor1}
          iconGradColor2={os.iconGradColor2} iconColor={os.iconColor} iconSizePx={os.iconSizePx}
          viewportSize={os.viewportSize} iconSlots={os.iconSlots} setIconSlots={os.setIconSlots}
          selectedAppIds={os.selectedAppIds} setSelectedAppIds={os.setSelectedAppIds}
          windows={os.windows} onOpenApp={os.openApp}
          onOpenFolder={(folderId) => os.setOpenFolderId(folderId)}
          onCommitRenameFolder={os.renameFolder}
          onDropAppsIntoFolder={os.moveAppsToFolder}
          onDropImageOnDesktop={os.dropImageFileOnDesktop}
          onDropImageOnApp={os.dropImageFileOnApp}
          onOpenItemContextMenu={(e, kind, targetId) => {
            os.setContextMenu(null);
            os.setItemContextMenu({ x: e.clientX, y: e.clientY, kind, targetId });
          }}
        >
          {os.widgetsVisible &&
            effectiveWidgets.length > 0 &&
            !hasExpandedWindow &&
            !os.windows.some((w) => !w.minimized && w.x + w.width > os.viewportSize.w - 340) && (
              <DesktopWidgetsHost
                widgets={effectiveWidgets} locale={os.locale} isDark={os.isDark}
                glassOpacity={os.glassOpacity} glassBlur={os.glassBlur} primaryColor={os.paletteTokens.primary}
                enabledWidgets={os.enabledWidgets} widgetPositions={os.widgetPositions}
                onMoveWidget={os.updateWidgetPosition} widgetSizes={os.widgetSizes}
                onResizeWidget={os.updateWidgetSize} widgetUserPrefs={os.widgetUserPrefs}
                onOpenCustomize={(id, x, y) => setCustomizingWidget({ id, x, y })}
                viewportSize={os.viewportSize} onOpenApp={os.openApp} onOpenSideBySide={os.openSideBySidePair}
              />
            )}

          <FloatingWindows
            apps={os.allApps} windows={os.windows} setWindows={os.setWindows}
            closingWindowIds={os.closingWindowIds} highlightedWindowId={os.highlightedWindowId}
            windowAnimation={os.windowAnimation} windowControlsSide={os.windowControlsSide}
            qualityMode={os.qualityMode} glassOpacity={os.glassOpacity} glassBlur={os.glassBlur}
            customRadiusPx={os.theme.preferences.customRadiusPx} paletteTokens={os.paletteTokens}
            dockVisible={os.dockVisible}
            onFocus={os.focusWindow} onClose={os.closeWindow} onMinimize={os.toggleMinimize}
            onMaximize={os.toggleMaximize} onFullscreen={os.toggleFullscreen} onSnapWindow={os.snapWindow}
            renderWindowContent={resolvedRenderWindowContent} renderThemeStudio={renderThemeStudio}
          />

          {os.contextMenu && (
            <ContextMenu
              position={os.contextMenu} isDark={os.isDark} wallpaper={os.wallpaper}
              selectedAppIds={os.selectedAppIds} dockVisible={os.dockVisible}
              onOpenApp={os.openApp}
              onCreateFolder={(ids) => { os.createFolder({ initialAppIds: ids }); os.setSelectedAppIds([]); }}
              onOpenDockCustomizer={() => os.setDockCustomizerOpen(true)}
              onArrange={os.arrangeWindows}
              onSelectWallpaper={(wpId) => { os.setCustomBgUrl(''); os.setWallpaper(wpId); }}
              onToggleDock={() => os.setDockVisible((v) => !v)} onResetIcons={os.resetIconSlots}
              onCloseAll={() => os.setWindows([])} onSwitchToClassic={onSwitchToClassic}
              onCloseMenu={() => os.setContextMenu(null)}
            />
          )}

          {os.itemContextMenu && (
            <ItemContextMenu
              menu={os.itemContextMenu} isDark={os.isDark} allApps={os.allApps}
              folders={os.folders} windows={os.windows} effectiveDockIds={os.effectiveDockIds}
              selectedAppIds={os.selectedAppIds}
              onOpenApp={os.openApp} onMinimizeWindow={os.toggleMinimize} onCloseWindow={os.closeWindow}
              onOpenFolder={(folderId) => os.setOpenFolderId(folderId)}
              onStartRenameFolder={(folderId) => os.setRenamingFolderId(folderId)}
              onDissolveFolder={os.dissolveFolder} onTogglePinToDock={os.togglePinToDock}
              onOpenDockCustomizer={() => os.setDockCustomizerOpen(true)}
              onMoveAppsToFolder={(fId, ids) => { os.moveAppsToFolder(fId, ids); os.setSelectedAppIds([]); }}
              onCreateFolderWithApps={(ids) => { os.createFolder({ initialAppIds: ids }); os.setSelectedAppIds([]); }}
              onCloseMenu={() => os.setItemContextMenu(null)}
            />
          )}

          {os.dockVisible && !hasFullscreenWindow && (
            <Dock
              dockApps={os.effectiveDockApps} allApps={os.allApps} isDark={os.isDark} effectiveIsLightBg={os.effectiveIsLightBg}
              glassBlur={os.glassBlur} windows={os.windows} iconBgStyle={os.iconBgStyle}
              iconBgColor={os.iconBgColor} iconGradColor1={os.iconGradColor1} iconGradColor2={os.iconGradColor2}
              iconColor={os.iconColor} primaryColor={os.paletteTokens.primary} onOpenApp={os.openApp}
              onPinAppToDock={os.pinAppToDock} onReorderDock={os.reorderDock}
              onOpenDockCustomizer={() => os.setDockCustomizerOpen(true)}
              onOpenDockItemContextMenu={(e, appId) => {
                os.setContextMenu(null);
                os.setItemContextMenu({ x: e.clientX, y: e.clientY, kind: 'dock-app', targetId: appId });
              }}
              onArrangeSideBySide={() => os.arrangeWindows('side-by-side')}
              onArrangeGrid={() => os.arrangeWindows('grid')} onCloseAll={() => os.setWindows([])}
            />
          )}
        </DesktopGrid>
      )}

      <DesktopFolderPopoverModal
        folder={activeOpenFolder} allDesktopApps={os.desktopApps} isDark={os.isDark}
        primaryColor={os.paletteTokens.primary} iconBgStyle={os.iconBgStyle} iconBgColor={os.iconBgColor}
        iconGradColor1={os.iconGradColor1} iconGradColor2={os.iconGradColor2} iconColor={os.iconColor}
        onClose={() => os.setOpenFolderId(null)} onOpenApp={os.openApp}
        onRenameFolder={os.renameFolder} onRecolorFolder={os.recolorFolder}
        onSetFolderApps={os.setFolderApps} onRemoveAppFromFolder={os.removeAppFromFolder}
        onDissolveFolder={os.dissolveFolder}
      />

      <DockCustomizerPopover
        open={os.dockCustomizerOpen} allDesktopApps={os.desktopApps}
        effectiveDockIds={os.effectiveDockIds} isDark={os.isDark}
        primaryColor={os.paletteTokens.primary} iconBgStyle={os.iconBgStyle} iconBgColor={os.iconBgColor}
        iconGradColor1={os.iconGradColor1} iconGradColor2={os.iconGradColor2} iconColor={os.iconColor}
        onTogglePinToDock={os.togglePinToDock} onReorderDock={os.reorderDock}
        onResetDockToDefault={os.resetDockToDefault} onClose={() => os.setDockCustomizerOpen(false)}
      />

      {customizingWidget && activeCustomWidget && (
        <WidgetCustomizePopover
          target={{ x: customizingWidget.x, y: customizingWidget.y }}
          widget={activeCustomWidget}
          currentSize={os.widgetSizes[activeCustomWidget.id] ?? activeCustomWidget.defaultSize}
          prefs={os.widgetUserPrefs[activeCustomWidget.id] ?? {}}
          isDark={os.isDark} primaryColor={os.paletteTokens.primary}
          onUpdatePrefs={(patch) => os.updateWidgetUserPrefs(activeCustomWidget.id, patch)}
          onResize={(sz) => os.updateWidgetSize(activeCustomWidget.id, sz)}
          onHideWidget={() => os.toggleWidgetItem(activeCustomWidget.id)}
          onResetWidget={() => os.resetSingleWidgetPrefs(activeCustomWidget.id)}
          onClose={() => setCustomizingWidget(null)}
        />
      )}

      <CommandPalette
        open={spotlightOpen} onClose={() => setSpotlightOpen(false)}
        actions={spotlightActions} placeholder="Modül, pencere düzeni veya görünüm ara..."
      />

      {!onOpenGlobalThemeStudio && enableBuiltInGlobalThemeStudio && (
        <ThemeStudioDrawer
          open={internalStudioOpen}
          onClose={() => setInternalStudioOpen(false)}
          defaultRoleShell="osgl"
        />
      )}
    </div>
  );
};
