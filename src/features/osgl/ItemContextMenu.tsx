import {
  ExternalLink,
  FolderInput,
  FolderOpen,
  FolderPlus,
  Minus,
  Pencil,
  Pin,
  PinOff,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from 'lucide-react';
import { ContextMenuItem, ContextSubMenu } from './WindowChrome';
import type { DesktopFolder, FloatingWindowState, OSWorkspaceApp } from './types';
import type { ItemContextMenuState } from './useFoldersAndDockState';

export function ItemContextMenu({
  menu,
  isDark,
  allApps,
  folders,
  windows = [],
  effectiveDockIds,
  selectedAppIds,
  onOpenApp,
  onMinimizeWindow,
  onCloseWindow,
  onOpenFolder,
  onStartRenameFolder,
  onDissolveFolder,
  onTogglePinToDock,
  onOpenDockCustomizer,
  onMoveAppsToFolder,
  onCreateFolderWithApps,
  onCloseMenu,
}: {
  menu: ItemContextMenuState;
  isDark: boolean;
  allApps: OSWorkspaceApp[];
  folders: DesktopFolder[];
  windows?: FloatingWindowState[];
  effectiveDockIds: string[];
  selectedAppIds: string[];
  onOpenApp: (appId: string) => void;
  onMinimizeWindow?: (winId: string) => void;
  onCloseWindow?: (winId: string) => void;
  onOpenFolder: (folderId: string) => void;
  onStartRenameFolder: (folderId: string) => void;
  onDissolveFolder: (folderId: string) => void;
  onTogglePinToDock: (appId: string) => void;
  onOpenDockCustomizer: () => void;
  onMoveAppsToFolder: (folderId: string, appIds: string[]) => void;
  onCreateFolderWithApps: (appIds: string[]) => void;
  onCloseMenu: () => void;
}) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 820;
  const clampedX = Math.max(8, Math.min(menu.x, vw - 252));
  const clampedY = Math.max(8, Math.min(menu.y, vh - 260));

  if (menu.kind === 'folder') {
    const folder = folders.find((f) => f.id === menu.targetId);
    if (!folder) return null;

    return (
      <div
        data-macos-context="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', left: clampedX, top: clampedY, width: 236, padding: 6,
          borderRadius: 14,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.96)',
          color: isDark ? '#f8fafc' : '#0f172a',
          backdropFilter: 'blur(26px)',
          border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.12)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.36)',
          display: 'flex', flexDirection: 'column', gap: 2, zIndex: 2250,
        }}
      >
        <div style={{ padding: '4px 8px', fontSize: 11, fontWeight: 800, opacity: 0.7 }}>
          {folder.name} ({folder.appIds.length} modül)
        </div>
        <ContextMenuItem
          icon={<FolderOpen size={14} />}
          label="Klasörü Aç"
          onClick={() => { onOpenFolder(folder.id); onCloseMenu(); }}
        />
        <ContextMenuItem
          icon={<Pencil size={14} />}
          label="Adını Değiştir"
          onClick={() => { onStartRenameFolder(folder.id); onCloseMenu(); }}
        />
        <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
        <ContextMenuItem
          icon={<Trash2 size={14} />}
          label="Klasörü Dağıt (Masaüstüne Çıkar)"
          danger
          onClick={() => { onDissolveFolder(folder.id); onCloseMenu(); }}
        />
      </div>
    );
  }

  const targetApp = allApps.find((a) => a.id === menu.targetId);
  if (!targetApp) return null;

  const isPinned = effectiveDockIds.includes(targetApp.id);
  const openWin = windows.find((w) => w.appId === targetApp.id);
  const batchIds =
    menu.kind === 'app' && selectedAppIds.length > 1 && selectedAppIds.includes(targetApp.id)
      ? selectedAppIds
      : [targetApp.id];

  return (
    <div
      data-macos-context="true"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed', left: clampedX, top: clampedY, width: 244, padding: 6,
        borderRadius: 14,
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.96)',
        color: isDark ? '#f8fafc' : '#0f172a',
        backdropFilter: 'blur(26px)',
        border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,23,42,0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.36)',
        display: 'flex', flexDirection: 'column', gap: 2, zIndex: 2250,
      }}
    >
      <div style={{ padding: '4px 8px', fontSize: 11, fontWeight: 800, opacity: 0.7 }}>
        {batchIds.length > 1 ? `${batchIds.length} Modül Seçili` : targetApp.label}
      </div>
      <ContextMenuItem
        icon={<ExternalLink size={14} />}
        label={
          batchIds.length > 1
            ? batchIds.length > 6
              ? `Seçilenleri Aç (İlk 6 / ${batchIds.length})`
              : `Seçilenleri Aç (${batchIds.length})`
            : openWin
              ? openWin.minimized
                ? 'Pencereyi Göster'
                : 'Öne Getir'
              : 'Modülü Aç'
        }
        onClick={() => {
          batchIds.slice(0, 6).forEach((id) => onOpenApp(id));
          onCloseMenu();
        }}
      />
      <ContextMenuItem
        icon={isPinned ? <PinOff size={14} /> : <Pin size={14} />}
        label={isPinned ? "Alt Dock'tan Kaldır" : "Alt Dock'a Sabitle"}
        onClick={() => { onTogglePinToDock(targetApp.id); onCloseMenu(); }}
      />

      {menu.kind === 'dock-app' && (
        <>
          <ContextMenuItem
            icon={<SlidersHorizontal size={14} />}
            label="Dock Simgelerini Özelleştir..."
            onClick={() => { onOpenDockCustomizer(); onCloseMenu(); }}
          />
          {openWin && (
            <>
              <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
              {!openWin.minimized && onMinimizeWindow && (
                <ContextMenuItem
                  icon={<Minus size={14} />}
                  label="Küçült"
                  onClick={() => { onMinimizeWindow(openWin.id); onCloseMenu(); }}
                />
              )}
              {onCloseWindow && (
                <ContextMenuItem
                  icon={<XCircle size={14} />}
                  label="Pencereyi Kapat"
                  danger
                  onClick={() => { onCloseWindow(openWin.id); onCloseMenu(); }}
                />
              )}
            </>
          )}
        </>
      )}

      {menu.kind === 'app' && (
        <>
          <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
          {folders.length > 0 && (
            <ContextSubMenu
              icon={<FolderInput size={14} />}
              label="Klasöre Taşı"
              isDark={isDark}
            >
              {folders.map((fld) => (
                <ContextMenuItem
                  key={fld.id}
                  icon={<FolderOpen size={14} />}
                  label={fld.name}
                  onClick={() => {
                    onMoveAppsToFolder(fld.id, batchIds);
                    onCloseMenu();
                  }}
                />
              ))}
            </ContextSubMenu>
          )}
          <ContextMenuItem
            icon={<FolderPlus size={14} />}
            label={
              batchIds.length > 1
                ? `Seçilenlerle Yeni Klasör (${batchIds.length})`
                : 'Yeni Klasör Oluştur ve Taşı'
            }
            onClick={() => {
              onCreateFolderWithApps(batchIds);
              onCloseMenu();
            }}
          />
        </>
      )}
    </div>
  );
}
