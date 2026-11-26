import { useLayoutEffect, useRef, useState } from 'react';
import {
  Columns2,
  FolderPlus,
  Grid2x2,
  Layers,
  LayoutPanelLeft,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { OS_WALLPAPERS, type OSWallpaperId } from './osglEngine';
import { ContextMenuItem } from './WindowChrome';
import { OS_THEME_STUDIO_APP_ID, type WindowArrangeMode } from './types';

export function ContextMenu({
  position,
  isDark,
  wallpaper,
  selectedAppIds,
  dockVisible,
  onOpenApp,
  onCreateFolder,
  onOpenDockCustomizer,
  onArrange,
  onSelectWallpaper,
  onToggleDock,
  onResetIcons,
  onCloseAll,
  onSwitchToClassic,
  onCloseMenu,
}: {
  position: { x: number; y: number };
  isDark: boolean;
  wallpaper: OSWallpaperId;
  selectedAppIds: string[];
  dockVisible: boolean;
  onOpenApp: (id: string) => void;
  onCreateFolder?: (initialAppIds?: string[]) => void;
  onOpenDockCustomizer?: () => void;
  onArrange: (mode: WindowArrangeMode) => void;
  onSelectWallpaper: (wp: OSWallpaperId) => void;
  onToggleDock: () => void;
  onResetIcons: () => void;
  onCloseAll: () => void;
  onSwitchToClassic?: () => void;
  onCloseMenu: () => void;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ left: number; top: number }>({
    left: position.x,
    top: position.y,
  });

  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const maxLeft = Math.max(8, window.innerWidth - rect.width - 8);
    const maxTop = Math.max(8, window.innerHeight - rect.height - 8);
    setCoords({
      left: Math.max(8, Math.min(position.x, maxLeft)),
      top: Math.max(8, Math.min(position.y, maxTop)),
    });
  }, [position.x, position.y, selectedAppIds.length, dockVisible]);

  return (
    <div
      ref={menuRef}
      className="macosgl-scroll"
      data-macos-context="true"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        left: coords.left,
        top: coords.top,
        width: 248,
        maxHeight: 'calc(100dvh - 16px)',
        overflowY: 'auto',
        padding: 6,
        borderRadius: 14,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.99)',
        color: isDark ? '#f8fafc' : '#0f172a',
        backdropFilter: 'blur(26px)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.16)'
          : '1px solid rgba(15,23,42,0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.36)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: 2200,
      }}
    >
      {onCreateFolder && (() => {
        const selectableApps = selectedAppIds.filter((id) => !id.startsWith('folder:'));
        return (
        <ContextMenuItem
          icon={<FolderPlus size={14} />}
          label={
            selectableApps.length > 0
              ? `Seçilenlerle Klasör Oluştur (${selectableApps.length})`
              : 'Yeni Klasör Oluştur'
          }
          onClick={() => {
            onCreateFolder(selectableApps.length > 0 ? selectableApps : undefined);
            onCloseMenu();
          }}
        />
        );
      })()}
      {selectedAppIds.some((id) => !id.startsWith('folder:')) && (() => {
        const selectableApps = selectedAppIds.filter((id) => !id.startsWith('folder:'));
        return (
        <ContextMenuItem
          icon={<Sparkles size={14} />}
          label={`Seçili Modülleri Aç (${selectableApps.length})`}
          onClick={() => {
            selectableApps.forEach((id) => onOpenApp(id));
            onCloseMenu();
          }}
        />
        );
      })()}
      {onOpenDockCustomizer && (
        <ContextMenuItem
          icon={<SlidersHorizontal size={14} />}
          label="Alt Dock Simgelerini Özelleştir..."
          onClick={() => {
            onOpenDockCustomizer();
            onCloseMenu();
          }}
        />
      )}
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />

      <ContextMenuItem
        icon={<Columns2 size={14} />}
        label="Yan Yana Diz (Sol / Sağ)"
        onClick={() => { onArrange('side-by-side'); onCloseMenu(); }}
      />
      <ContextMenuItem
        icon={<Grid2x2 size={14} />}
        label="4 Köşeye Böl (2×2 Kadran)"
        onClick={() => { onArrange('quadrants'); onCloseMenu(); }}
      />
      <ContextMenuItem
        icon={<Grid2x2 size={14} />}
        label="Pencereleri Izgara Diz"
        onClick={() => { onArrange('grid'); onCloseMenu(); }}
      />
      <ContextMenuItem
        icon={<Layers size={14} />}
        label="Kademeli Diz (Cascade)"
        onClick={() => { onArrange('cascade'); onCloseMenu(); }}
      />
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />

      <div style={{ padding: '4px 8px', fontSize: 10.5, fontWeight: 700, opacity: 0.65 }}>
        Masaüstü Duvar Kağıdı
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '4px 8px 6px', flexWrap: 'wrap' }}>
        {(Object.keys(OS_WALLPAPERS) as OSWallpaperId[]).map((wpId) => (
          <button
            key={wpId}
            type="button"
            title={OS_WALLPAPERS[wpId].name}
            onClick={() => { onSelectWallpaper(wpId); onCloseMenu(); }}
            style={{
              width: 22, height: 22, borderRadius: 999,
              border: wallpaper === wpId ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.4)',
              background: OS_WALLPAPERS[wpId].preview, cursor: 'pointer',
            }}
          />
        ))}
      </div>
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />

      <ContextMenuItem
        icon={<Palette size={14} />}
        label="OS Tema Stüdyosu"
        onClick={() => { onOpenApp(OS_THEME_STUDIO_APP_ID); onCloseMenu(); }}
      />
      {onSwitchToClassic && (
        <ContextMenuItem
          icon={<LayoutPanelLeft size={14} />}
          label="Klasik Web Görünümüne Geç"
          onClick={() => { onSwitchToClassic(); onCloseMenu(); }}
        />
      )}
      <ContextMenuItem
        icon={<Layers size={14} />}
        label={dockVisible ? "Dock'u Gizle" : "Dock'u Göster"}
        onClick={() => { onToggleDock(); onCloseMenu(); }}
      />
      <ContextMenuItem
        icon={<RotateCcw size={14} />}
        label="Simgeleri İlk Haline Sıfırla"
        onClick={() => { onResetIcons(); onCloseMenu(); }}
      />
      <ContextMenuItem
        icon={<Trash2 size={14} />}
        label="Tüm Pencereleri Kapat"
        danger
        onClick={() => { onCloseAll(); onCloseMenu(); }}
      />
    </div>
  );
}
