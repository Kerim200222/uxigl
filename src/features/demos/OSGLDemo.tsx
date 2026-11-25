import React, { useEffect, useMemo, useState } from 'react';
import {
  CommandPalette,
  type CommandActionItem,
} from '../../components/composites/CommandPalette/CommandPalette';
import { GoogleIcon } from '../../components/primitives';
import type { OSWallpaperId } from './OSGLEngine';
import { ENTERPRISE_APPS, type IconBgStyle } from './osgl/types';
import { useDesktopState } from './osgl/useDesktopState';
import { TopMenuBar } from './osgl/TopMenuBar';
import { MobileLauncher } from './osgl/MobileLauncher';
import { DesktopGrid } from './osgl/DesktopGrid';
import { FloatingWindows } from './osgl/FloatingWindows';
import { ContextMenu } from './osgl/ContextMenu';
import { DesktopWidgets } from './osgl/DesktopWidgets';
import { Dock } from './osgl/Dock';
import { OSGLApp } from '../osgl/OSGLApp';
import type { OSWorkspaceApp } from '../osgl/types';

export type { IconBgStyle, OSWallpaperId };

export interface OSGLDemoProps {
  onNavigate?: (sectionId: string, subItemId?: string) => void;
  onOpenThemeStudio?: () => void;
  initialWallpaper?: OSWallpaperId;
  renderWindowContent?: (appId: string) => React.ReactNode;
  /** When provided, delegates to the full parametric v4 OSGLApp engine */
  apps?: OSWorkspaceApp[];
}

export function OSGLDemo({
  onNavigate,
  onOpenThemeStudio,
  initialWallpaper = 'sequoia',
  renderWindowContent,
  apps,
}: OSGLDemoProps) {
  if (apps && apps.length > 0) {
    return (
      <OSGLApp
        apps={apps}
        initialWallpaper={initialWallpaper}
        renderWindowContent={renderWindowContent}
        onOpenGlobalThemeStudio={onOpenThemeStudio}
      />
    );
  }
  const os = useDesktopState(initialWallpaper);
  const [spotlightOpen, setSpotlightOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);

  const spotlightActions = useMemo<CommandActionItem[]>(() => {
    const appActions: CommandActionItem[] = ENTERPRISE_APPS.map((app) => ({
      id: `os-app-${app.id}`,
      title: app.label,
      subtitle: os.locale === 'tr' ? `${app.category} penceresini aç` : `Open ${app.category} window`,
      category: app.category,
      icon: <GoogleIcon name={app.googleIcon} size={18} />,
      onSelect: () => os.openApp(app.id),
    }));

    return [
      ...appActions,
      {
        id: 'os-arrange-grid',
        title: os.locale === 'tr' ? 'Pencereleri Izgara Diz' : 'Tile Windows (Grid)',
        subtitle: os.locale === 'tr' ? 'Açık pencereleri düzenli ızgaraya yerleştir' : 'Arrange open windows in a grid',
        category: os.locale === 'tr' ? 'Pencere' : 'Window',
        onSelect: () => os.arrangeWindows('grid'),
      },
      {
        id: 'os-arrange-cascade',
        title: os.locale === 'tr' ? 'Pencereleri Kademeli Diz' : 'Cascade Windows',
        subtitle: os.locale === 'tr' ? 'Açık pencereleri üst üste sırala' : 'Cascade open windows',
        category: os.locale === 'tr' ? 'Pencere' : 'Window',
        onSelect: () => os.arrangeWindows('cascade'),
      },
    ];
  }, [os]);

  return (
    <div
      onContextMenu={(e) => {
        if (os.showMobileLayout) return;
        e.preventDefault();
        os.setArrangeMenuOpen(false);
        os.setContextMenu({
          x: Math.min(e.clientX, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 240),
          y: Math.min(e.clientY, (typeof window !== 'undefined' ? window.innerHeight : 800) - 310),
        });
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        maxHeight: '100vh',
        background: os.desktopBackground,
        color: os.barTextColor,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Inter', system-ui, sans-serif",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        .macosgl-scroll { scrollbar-width: thin; scrollbar-color: transparent transparent; }
        .macosgl-scroll:hover { scrollbar-color: rgba(148, 163, 184, 0.35) transparent; }
        .macosgl-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .macosgl-scroll::-webkit-scrollbar-track { background: transparent; }
        .macosgl-scroll::-webkit-scrollbar-thumb { background: transparent; border-radius: 999px; }
        .macosgl-scroll:hover::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.38); }
        .macosgl-app-btn { outline: none; }
        .macosgl-app-icon-box { transition: transform 0.16s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.16s ease; }
        .macosgl-app-btn:hover .macosgl-app-icon-box { transform: translateY(-3px) scale(1.05); }
        .macosgl-app-btn:active .macosgl-app-icon-box { transform: translateY(0) scale(0.96); }
        .macosgl-resize-handle { opacity: 0; transition: opacity 0.15s ease; }
        .macosgl-resize-handle:hover { opacity: 0.55; }
        .macosgl-fullbleed,
        .macosgl-fullbleed > div,
        .macosgl-fullbleed .uxu-filemangl-host,
        .macosgl-fullbleed .uxu-sheetgl-host {
          height: 100% !important; width: 100% !important; flex: 1 1 auto !important;
          min-height: 0 !important; display: flex !important; flex-direction: column !important;
        }
        @keyframes macosglWinOpen {
          from { opacity: 0; filter: brightness(0.92); }
          to { opacity: 1; filter: brightness(1); }
        }
        .macosgl-win-anim-open { animation: macosglWinOpen 0.18s cubic-bezier(0.22, 1, 0.36, 1); }
        .macosgl-win-anim-close { opacity: 0 !important; transition: opacity 0.15s ease-out !important; }
        @keyframes osglWinPulse {
          0%, 100% { filter: brightness(1); }
          40% { filter: brightness(1.12); }
        }
        .osgl-win-highlight { animation: osglWinPulse 0.45s ease-out; }
        .osgl-mobile-compact .uxu-card { padding: 8px !important; border-radius: 12px !important; }
        .osgl-mobile-compact .uxu-card:has(.uxu-sheetgl-wrapper) { padding: 0 !important; border: none !important; background: transparent !important; box-shadow: none !important; }
        .osgl-mobile-compact .uxu-card__header { padding: 0 0 6px 0 !important; margin-bottom: 6px !important; gap: 6px !important; }
        .osgl-mobile-compact .uxu-card__header:not(:has(.uxu-card__header-action)) { display: none !important; }
        .osgl-mobile-compact .uxu-card__eyebrow,
        .osgl-mobile-compact .uxu-card__subtitle,
        .osgl-mobile-compact .uxu-card__header-icon { display: none !important; }
        .osgl-mobile-compact .uxu-card__title { font-size: 13px !important; line-height: 1.2 !important; }
        .osgl-mobile-compact .uxu-card__body { padding: 0 !important; }
        .osgl-mobile-compact .uxu-stat-card { padding: 10px 12px !important; }
        .osgl-mobile-compact .uxu-stat-card__value { font-size: 1.15rem !important; }
        .osgl-mobile-compact .uxu-stat-card__subtitle { display: none !important; }
        .osgl-mobile-compact .uxu-sheetgl-toolbar,
        .osgl-mobile-compact .uxu-sheetgl-statusbar,
        .osgl-mobile-compact .sg-toolbar,
        .osgl-mobile-compact .sg-formula-bar { display: none !important; }
      `}</style>

      {os.useWebGLAurora && (
        <canvas
          ref={os.canvasRef}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        />
      )}

      <TopMenuBar
        onNavigate={onNavigate}
        locale={os.locale}
        setLocale={os.setLocale}
        showMobileLayout={os.showMobileLayout}
        isMobileViewport={os.isMobileViewport}
        previewDevice={os.previewDevice}
        setPreviewDevice={os.setPreviewDevice}
        arrangeMenuOpen={os.arrangeMenuOpen}
        setArrangeMenuOpen={os.setArrangeMenuOpen}
        arrangeWindows={os.arrangeWindows}
        closeAllWindows={() => os.setWindows([])}
        dockVisible={os.dockVisible}
        onToggleDock={() => os.setDockVisible((v) => !v)}
        widgetsVisible={os.widgetsVisible}
        onToggleWidgets={() => os.setWidgetsVisible((v) => !v)}
        enabledWidgets={os.enabledWidgets}
        onToggleWidgetItem={os.toggleWidgetItem}
        onResetWidgetPositions={os.resetWidgetPositions}
        onResetIcons={() => {
          const reset: Record<string, number> = {};
          ENTERPRISE_APPS.forEach((app, idx) => { reset[app.id] = idx; });
          os.setIconSlots(reset);
        }}
        onOpenApp={os.openApp}
        onOpenThemeStudio={() => (onOpenThemeStudio ? onOpenThemeStudio() : os.openApp('os-theme-studio'))}
        onOpenSpotlight={() => setSpotlightOpen(true)}
        sharedStudioProps={os.sharedStudioProps}
        isDark={os.isDark}
        effectiveIsLightBg={os.effectiveIsLightBg}
      />

      {os.showMobileLayout ? (
        <MobileLauncher
          isMobileViewport={os.isMobileViewport}
          viewportWidth={os.viewportSize.w}
          desktopBackground={os.desktopBackground}
          isDark={os.isDark}
          chromePillBg={os.chromePillBg}
          chromeBorder={os.chromeBorder}
          chromeText={os.chromeText}
          glassBlur={os.glassBlur}
          barTextColor={os.barTextColor}
          effectiveIsLightBg={os.effectiveIsLightBg}
          paletteTokens={os.paletteTokens}
          iconBgStyle={os.iconBgStyle}
          iconBgColor={os.iconBgColor}
          iconGradColor1={os.iconGradColor1}
          iconGradColor2={os.iconGradColor2}
          iconColor={os.iconColor}
          searchQuery={os.searchQuery}
          setSearchQuery={os.setSearchQuery}
          mobileOpenAppId={os.mobileOpenAppId}
          setMobileOpenAppId={os.setMobileOpenAppId}
          dockVisible={os.dockVisible}
          onOpenApp={os.openApp}
          renderWindowContent={renderWindowContent}
          sharedStudioProps={os.sharedStudioProps}
          locale={os.locale}
          glassOpacity={os.glassOpacity}
          qualityMode={os.qualityMode}
          setQualityMode={os.sharedStudioProps.setQualityMode}
          openWindowCount={os.windows.length}
          widgetsVisible={os.widgetsVisible}
          onToggleWidgets={() => os.setWidgetsVisible((v) => !v)}
          enabledWidgets={os.enabledWidgets}
          onToggleWidgetItem={os.toggleWidgetItem}
        />
      ) : (
        <DesktopGrid
          isDark={os.isDark}
          barTextColor={os.barTextColor}
          effectiveIsLightBg={os.effectiveIsLightBg}
          primaryColor={os.paletteTokens.primary}
          iconBgStyle={os.iconBgStyle}
          iconBgColor={os.iconBgColor}
          iconGradColor1={os.iconGradColor1}
          iconGradColor2={os.iconGradColor2}
          iconColor={os.iconColor}
          iconSizePx={os.iconSizePx}
          iconLabelScale={os.iconLabelScale}
          viewportSize={os.viewportSize}
          iconSlots={os.iconSlots}
          setIconSlots={os.setIconSlots}
          selectedAppIds={os.selectedAppIds}
          setSelectedAppIds={os.setSelectedAppIds}
          windows={os.windows}
          onOpenApp={os.openApp}
        >
          {os.widgetsVisible && (
            <DesktopWidgets
              locale={os.locale}
              isDark={os.isDark}
              glassOpacity={os.glassOpacity}
              glassBlur={os.glassBlur}
              primaryColor={os.paletteTokens.primary}
              qualityMode={os.qualityMode}
              setQualityMode={os.sharedStudioProps.setQualityMode}
              openWindowCount={os.windows.length}
              enabledWidgets={os.enabledWidgets}
              widgetPositions={os.widgetPositions}
              onMoveWidget={os.updateWidgetPosition}
              widgetSizes={os.widgetSizes}
              onResizeWidget={os.updateWidgetSize}
              viewportSize={os.viewportSize}
              onOpenApp={os.openApp}
            />
          )}

          <FloatingWindows
            windows={os.windows}
            setWindows={os.setWindows}
            closingWindowIds={os.closingWindowIds}
            highlightedWindowId={os.highlightedWindowId}
            windowAnimation={os.windowAnimation}
            qualityMode={os.qualityMode}
            glassOpacity={os.glassOpacity}
            glassBlur={os.glassBlur}
            customRadiusPx={os.preferences.customRadiusPx}
            paletteTokens={os.paletteTokens}
            onFocus={os.focusWindow}
            onClose={os.closeWindow}
            onMinimize={os.toggleMinimize}
            onMaximize={os.toggleMaximize}
            renderWindowContent={renderWindowContent}
            sharedStudioProps={os.sharedStudioProps}
          />

          {os.contextMenu && (
            <ContextMenu
              position={os.contextMenu}
              isDark={os.isDark}
              wallpaper={os.wallpaper}
              selectedAppIds={os.selectedAppIds}
              dockVisible={os.dockVisible}
              dockAppIds={os.dockAppIds}
              onOpenApp={os.openApp}
              onArrange={os.arrangeWindows}
              onSelectWallpaper={(wpId) => {
                os.setCustomBgUrl('');
                os.setWallpaper(wpId);
              }}
              onToggleDock={() => os.setDockVisible((v) => !v)}
              onTogglePinToDock={os.togglePinToDock}
              onResetIcons={() => {
                const reset: Record<string, number> = {};
                ENTERPRISE_APPS.forEach((app, idx) => { reset[app.id] = idx; });
                os.setIconSlots(reset);
              }}
              onCloseAll={() => os.setWindows([])}
              onCloseMenu={() => os.setContextMenu(null)}
            />
          )}

          {os.dockVisible && (
            <Dock
              isDark={os.isDark}
              glassBlur={os.glassBlur}
              windows={os.windows}
              dockAppIds={os.dockAppIds}
              onTogglePinToDock={os.togglePinToDock}
              onReorderDockApps={os.reorderDockApps}
              locale={os.locale}
              iconBgStyle={os.iconBgStyle}
              iconBgColor={os.iconBgColor}
              iconGradColor1={os.iconGradColor1}
              iconGradColor2={os.iconGradColor2}
              iconColor={os.iconColor}
              primaryColor={os.paletteTokens.primary}
              onOpenApp={os.openApp}
              onCloseApp={(appId) => {
                const win = os.windows.find((w) => w.appId === appId);
                if (win) os.closeWindow(win.id);
              }}
              onArrangeGrid={() => os.arrangeWindows('grid')}
              onResetWindows={() =>
                os.setWindows([
                  {
                    id: `win-overview-${Date.now()}`,
                    appId: 'overview',
                    x: 320,
                    y: 62,
                    width: 680,
                    height: 480,
                    zIndex: os.topZ + 1,
                    minimized: false,
                    maximized: false,
                  },
                ])
              }
              onCloseAll={() => os.setWindows([])}
            />
          )}
        </DesktopGrid>
      )}

      <CommandPalette
        open={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
        actions={spotlightActions}
        placeholder={
          os.locale === 'tr'
            ? 'Uygulama, pencere veya komut ara...'
            : 'Search apps, windows or commands...'
        }
      />
    </div>
  );
}

export default OSGLDemo;
