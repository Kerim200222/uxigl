import React from 'react';
import {
  ArrowLeftRight, Columns2, Eye, EyeOff, FolderPlus, Grid2x2, Layers, LayoutGrid,
  LayoutPanelLeft, Maximize2, Monitor, Moon, RotateCcw, SlidersHorizontal, Smartphone, Square, Sun, X,
} from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import { ContextMenuItem, ContextSubMenu } from './WindowChrome';
import type { OSWorkspaceApp, WindowArrangeMode, WindowControlsSide } from './types';
import type { SnapZone } from './windowGeometry';

export { TopWidgetsDropdown } from './TopWidgetsDropdown';

export type TopMenuKey = 'apps' | 'window' | 'view' | 'widgets' | null;

export function TopAppsDropdown({
  appsByCategory,
  isDark,
  dropdownStyle,
  onOpenApp,
  closeAllMenus,
}: {
  appsByCategory: Array<[string, OSWorkspaceApp[]]>;
  isDark: boolean;
  dropdownStyle: React.CSSProperties;
  onOpenApp: (id: string) => void;
  closeAllMenus: () => void;
}) {
  return (
    <div role="menu" className="osgl-menubar-dropdown" onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
      {appsByCategory.map(([cat, catApps]) =>
        catApps.length === 1 ? (
          <ContextMenuItem
            key={catApps[0].id}
            icon={
              <span className="osgl-menu-glyph" style={{ width: 15, height: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {catApps[0].iconNode ?? <GoogleIcon name={catApps[0].googleIcon} size={15} />}
              </span>
            }
            label={catApps[0].label}
            onClick={() => { onOpenApp(catApps[0].id); closeAllMenus(); }}
          />
        ) : (
          <ContextSubMenu
            key={cat}
            icon={
              <span className="osgl-menu-glyph" style={{ width: 15, height: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {catApps[0].iconNode ?? <GoogleIcon name={catApps[0].googleIcon} size={15} />}
              </span>
            }
            label={cat}
            isDark={isDark}
          >
            {catApps.map((app) => (
              <ContextMenuItem
                key={app.id}
                icon={
                  <span className="osgl-menu-glyph" style={{ width: 15, height: 15, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={15} />}
                  </span>
                }
                label={app.label}
                onClick={() => { onOpenApp(app.id); closeAllMenus(); }}
              />
            ))}
          </ContextSubMenu>
        )
      )}
    </div>
  );
}

export function TopWindowDropdown({
  dropdownStyle,
  isDark = false,
  activeWindowMaximized,
  activeWindowFullscreen,
  onMaximizeActive,
  onFullscreenActive,
  onSnapActiveWindow,
  arrangeWindows,
  closeAllWindows,
  closeAllMenus,
}: {
  dropdownStyle: React.CSSProperties;
  isDark?: boolean;
  activeWindowMaximized: boolean;
  activeWindowFullscreen: boolean;
  onMaximizeActive?: () => void;
  onFullscreenActive?: () => void;
  onSnapActiveWindow?: (zone: Exclude<SnapZone, null>) => void;
  arrangeWindows: (mode: WindowArrangeMode) => void;
  closeAllWindows: () => void;
  closeAllMenus: () => void;
}) {
  return (
    <div role="menu" className="osgl-menubar-dropdown" onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
      {onMaximizeActive && (
        <ContextMenuItem
          icon={<Square size={13.5} />}
          label={activeWindowMaximized ? 'Aktif Pencereyi Önceki Boyuta Döndür' : 'Aktif Pencereyi Ekranı Kapla'}
          onClick={() => { onMaximizeActive(); closeAllMenus(); }}
        />
      )}
      {onFullscreenActive && (
        <ContextMenuItem
          icon={<Maximize2 size={13.5} />}
          label={activeWindowFullscreen ? 'Tam Ekrandan Çık (Esc)' : 'Aktif Pencereyi Tam Ekran Yap'}
          onClick={() => { onFullscreenActive(); closeAllMenus(); }}
        />
      )}
      {onSnapActiveWindow && (
        <ContextSubMenu icon={<LayoutGrid size={14} />} label="Aktif Pencereyi Köşeye Yasla" isDark={isDark}>
          <ContextMenuItem icon={<Columns2 size={13.5} />} label="Sol Yarıya Yasla" onClick={() => { onSnapActiveWindow('left-half'); closeAllMenus(); }} />
          <ContextMenuItem icon={<Columns2 size={13.5} />} label="Sağ Yarıya Yasla" onClick={() => { onSnapActiveWindow('right-half'); closeAllMenus(); }} />
          <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '3px 0' }} />
          <ContextMenuItem icon={<Grid2x2 size={13.5} />} label="Sol Üst Çeyrek (1/4)" onClick={() => { onSnapActiveWindow('top-left'); closeAllMenus(); }} />
          <ContextMenuItem icon={<Grid2x2 size={13.5} />} label="Sağ Üst Çeyrek (1/4)" onClick={() => { onSnapActiveWindow('top-right'); closeAllMenus(); }} />
          <ContextMenuItem icon={<Grid2x2 size={13.5} />} label="Sol Alt Çeyrek (1/4)" onClick={() => { onSnapActiveWindow('bottom-left'); closeAllMenus(); }} />
          <ContextMenuItem icon={<Grid2x2 size={13.5} />} label="Sağ Alt Çeyrek (1/4)" onClick={() => { onSnapActiveWindow('bottom-right'); closeAllMenus(); }} />
        </ContextSubMenu>
      )}
      {(onMaximizeActive || onFullscreenActive || onSnapActiveWindow) && (
        <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
      )}
      <ContextMenuItem
        icon={<Columns2 size={14} />}
        label="Yan Yana Diz (Sol / Sağ)"
        onClick={() => { arrangeWindows('side-by-side'); closeAllMenus(); }}
      />
      <ContextMenuItem
        icon={<LayoutGrid size={14} />}
        label="4 Köşeye Böl (2×2 Kadran)"
        onClick={() => { arrangeWindows('quadrants'); closeAllMenus(); }}
      />
      <ContextMenuItem
        icon={<Grid2x2 size={14} />}
        label="Izgara Dizilimi (Grid)"
        onClick={() => { arrangeWindows('grid'); closeAllMenus(); }}
      />
      <ContextMenuItem
        icon={<Layers size={14} />}
        label="Kademeli Dizilim (Cascade)"
        onClick={() => { arrangeWindows('cascade'); closeAllMenus(); }}
      />
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
      <ContextMenuItem
        icon={<X size={14} />}
        label="Tüm Pencereleri Kapat"
        danger
        onClick={() => { closeAllWindows(); closeAllMenus(); }}
      />
    </div>
  );
}

export function TopViewDropdown({
  dropdownStyle,
  isDark,
  dockVisible,
  widgetsVisible,
  windowControlsSide = 'right',
  onToggleWindowControlsSide,
  isMobileViewport,
  previewDevice,
  setPreviewDevice,
  onSwitchToClassic,
  onToggleMode,
  onToggleDock,
  onToggleWidgets,
  onCreateFolder,
  onOpenDockCustomizer,
  onResetIcons,
  closeAllMenus,
}: {
  dropdownStyle: React.CSSProperties;
  isDark: boolean;
  dockVisible: boolean;
  widgetsVisible: boolean;
  windowControlsSide?: WindowControlsSide;
  onToggleWindowControlsSide?: () => void;
  isMobileViewport: boolean;
  previewDevice: 'auto' | 'desktop' | 'mobile';
  setPreviewDevice: React.Dispatch<React.SetStateAction<'auto' | 'desktop' | 'mobile'>>;
  onSwitchToClassic?: () => void;
  onToggleMode: () => void;
  onToggleDock: () => void;
  onToggleWidgets: () => void;
  onCreateFolder?: () => void;
  onOpenDockCustomizer?: () => void;
  onResetIcons: () => void;
  closeAllMenus: () => void;
}) {
  return (
    <div role="menu" className="osgl-menubar-dropdown" onClick={(e) => e.stopPropagation()} style={dropdownStyle}>
      {onCreateFolder && (
        <ContextMenuItem
          icon={<FolderPlus size={14} />}
          label="Yeni Masaüstü Klasörü"
          onClick={() => { onCreateFolder(); closeAllMenus(); }}
        />
      )}
      {onOpenDockCustomizer && (
        <ContextMenuItem
          icon={<SlidersHorizontal size={14} />}
          label="Alt Dock Simgelerini Özelleştir..."
          onClick={() => { onOpenDockCustomizer(); closeAllMenus(); }}
        />
      )}
      {onToggleWindowControlsSide && (
        <ContextMenuItem
          icon={<ArrowLeftRight size={14} />}
          label={windowControlsSide === 'left' ? 'Pencere Düğmelerini Sağa Al' : 'Pencere Düğmelerini Sola Al (macOS)'}
          onClick={() => { onToggleWindowControlsSide(); closeAllMenus(); }}
        />
      )}
      {onSwitchToClassic && (
        <ContextMenuItem
          icon={<LayoutPanelLeft size={14} />}
          label="Klasik Web Görünümüne Geç"
          onClick={() => { onSwitchToClassic(); closeAllMenus(); }}
        />
      )}
      <ContextMenuItem
        icon={isDark ? <Sun size={14} /> : <Moon size={14} />}
        label={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç'}
        onClick={() => { onToggleMode(); closeAllMenus(); }}
      />
      <ContextMenuItem
        icon={<Layers size={14} />}
        label={dockVisible ? "Dock'u Gizle" : "Dock'u Göster"}
        onClick={() => { onToggleDock(); closeAllMenus(); }}
      />
      <ContextMenuItem
        icon={widgetsVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        label={widgetsVisible ? "Widget'ları Gizle" : "Widget'ları Göster"}
        onClick={() => { onToggleWidgets(); closeAllMenus(); }}
      />
      <ContextMenuItem
        icon={<RotateCcw size={14} />}
        label="Simge Sıralamasını Sıfırla"
        onClick={() => { onResetIcons(); closeAllMenus(); }}
      />
      {!isMobileViewport && (
        <ContextMenuItem
          icon={previewDevice === 'mobile' ? <Monitor size={14} /> : <Smartphone size={14} />}
          label={previewDevice === 'mobile' ? 'Masaüstü Moduna Dön' : 'Mobil Uygulama Önizleme'}
          onClick={() => { setPreviewDevice((p) => (p === 'mobile' ? 'desktop' : 'mobile')); closeAllMenus(); }}
        />
      )}
    </div>
  );
}
