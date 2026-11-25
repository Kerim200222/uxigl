import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderOutput, Plus, Settings, Trash2, X } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import { FOLDER_COLOR_PRESETS } from './desktopFoldersAndDock';
import { FolderAppCatalogEditor } from './FolderAppCatalogEditor';
import {
  resolveIconSurface,
  type DesktopFolder,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';

export function DesktopFolderPopoverModal({
  folder, allDesktopApps, isDark, primaryColor, iconBgStyle, iconBgColor,
  iconGradColor1, iconGradColor2, iconColor, onClose, onOpenApp,
  onRenameFolder, onRecolorFolder, onSetFolderApps, onRemoveAppFromFolder, onDissolveFolder,
}: {
  folder: DesktopFolder | null; allDesktopApps: OSWorkspaceApp[]; isDark: boolean;
  primaryColor: string; iconBgStyle: IconBgStyle; iconBgColor: string;
  iconGradColor1: string; iconGradColor2: string; iconColor: string;
  onClose: () => void; onOpenApp: (appId: string) => void;
  onRenameFolder: (folderId: string, nextName: string) => void;
  onRecolorFolder: (folderId: string, color: string) => void;
  onSetFolderApps: (folderId: string, nextAppIds: string[]) => void;
  onRemoveAppFromFolder: (folderId: string, appId: string) => void;
  onDissolveFolder: (folderId: string) => void;
}) {
  const [editingApps, setEditingApps] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [titleDraft, setTitleDraft] = useState(folder?.name ?? '');
  const [filterText, setFilterText] = useState('');
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  const [outsideHover, setOutsideHover] = useState(false);

  useEffect(() => {
    if (folder) {
      setTitleDraft(folder.name);
      setEditingApps(folder.appIds.length === 0);
      setSettingsOpen(false);
      setFilterText('');
      setDraggingAppId(null);
      setOutsideHover(false);
    }
  }, [folder]);

  const folderApps = useMemo(() => {
    if (!folder) return [];
    return folder.appIds
      .map((id) => allDesktopApps.find((a) => a.id === id))
      .filter((a): a is OSWorkspaceApp => Boolean(a));
  }, [folder, allDesktopApps]);

  const filteredCatalog = useMemo(() => {
    const q = filterText.trim().toLocaleLowerCase('tr-TR');
    if (!q) return allDesktopApps;
    return allDesktopApps.filter(
      (a) => a.label.toLocaleLowerCase('tr-TR').includes(q) || a.category.toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [allDesktopApps, filterText]);

  if (!folder) return null;
  const accent = folder.color || primaryColor;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const popoverW = Math.min(360, vw - 24);
  const anchorEl =
    typeof document !== 'undefined'
      ? document.querySelector(`[data-osgl-folder-id="${folder.id}"]`)
      : null;
  const anchorRect = anchorEl?.getBoundingClientRect();
  const leftPos = anchorRect
    ? anchorRect.right + 12 + popoverW <= vw - 12
      ? anchorRect.right + 12
      : Math.max(12, anchorRect.left - popoverW - 12)
    : Math.round((vw - popoverW) / 2);
  const topPos = anchorRect
    ? Math.max(44, Math.min(vh - 380, anchorRect.top))
    : Math.round((vh - 340) / 2);

  const modal = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${folder.name} Klasörü`}
      data-macos-context="true"
      data-folder-drop-backdrop="true"
      onClick={onClose}
      onDragOver={(e) => {
        if (!draggingAppId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!outsideHover) setOutsideHover(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setOutsideHover(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedId = draggingAppId || e.dataTransfer.getData('text/osgl-folder-app');
        setDraggingAppId(null);
        setOutsideHover(false);
        if (droppedId) {
          const wasLast = folder.appIds.length <= 1;
          onRemoveAppFromFolder(folder.id, droppedId);
          if (wasLast) onClose();
        }
      }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2300,
        background: outsideHover ? 'rgba(14, 165, 233, 0.12)' : 'transparent',
        boxShadow: outsideHover ? `inset 0 0 0 3px ${accent}` : 'none',
        transition: 'background 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      {draggingAppId && (
        <div
          data-testid="folder-drag-out-banner"
          style={{
            position: 'fixed', top: 52, left: '50%', transform: 'translateX(-50%)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 16px', borderRadius: 999,
            background: outsideHover ? accent : 'rgba(15, 23, 42, 0.88)',
            color: '#ffffff', fontSize: 12.5, fontWeight: 700,
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35)', pointerEvents: 'none',
          }}
        >
          <FolderOutput size={14} />
          <span>
            {outsideHover
              ? 'Bırakın: Masaüstüne Çıkarılacak'
              : 'Masaüstüne çıkarmak için klasör penceresinin dışına sürükleyin'}
          </span>
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        onDragOver={(e) => {
          if (!draggingAppId) return;
          e.preventDefault();
          e.stopPropagation();
          if (outsideHover) setOutsideHover(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDraggingAppId(null);
          setOutsideHover(false);
        }}
        style={{
          position: 'fixed', left: leftPos, top: topPos,
          width: popoverW, maxHeight: 'min(420px, 72vh)', borderRadius: 18,
          background: isDark ? 'rgba(15, 23, 42, 0.90)' : 'rgba(255, 255, 255, 0.92)',
          color: isDark ? '#f8fafc' : '#0f172a',
          backdropFilter: 'blur(26px) saturate(175%)',
          WebkitBackdropFilter: 'blur(26px) saturate(175%)',
          border: `1px solid color-mix(in srgb, ${accent} 32%, rgba(255,255,255,0.22))`,
          boxShadow: '0 22px 56px rgba(0, 0, 0, 0.38)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            padding: '10px 12px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(15,23,42,0.08)',
          }}
        >
          <input
            type="text"
            aria-label="Klasör Adını Düzenle"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={() => onRenameFolder(folder.id, titleDraft || folder.name)}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
            style={{
              fontSize: 14, fontWeight: 800, background: 'transparent',
              border: '1px solid transparent', borderRadius: 6, padding: '2px 6px',
              color: 'inherit', outline: 'none', flex: 1, minWidth: 0,
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <button
              type="button"
              aria-label="Klasör Ayarları"
              title="Klasör Ayarları"
              onClick={() => setSettingsOpen((v) => !v)}
              style={{
                width: 26, height: 26, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: settingsOpen ? accent : isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.07)',
                color: settingsOpen ? '#ffffff' : 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Settings size={13} />
            </button>
            <button
              type="button" aria-label="Klasörü Kapat" onClick={onClose}
              style={{
                width: 26, height: 26, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.07)',
                color: 'inherit', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {settingsOpen && (
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap',
              padding: '8px 12px',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
            }}
          >
            <div style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
              {FOLDER_COLOR_PRESETS.map((hex) => (
                <button
                  key={hex} type="button" aria-label={`Klasör rengi ${hex}`}
                  onClick={() => onRecolorFolder(folder.id, hex)}
                  style={{
                    width: 14, height: 14, borderRadius: '50%', background: hex, padding: 0, cursor: 'pointer',
                    border: accent === hex ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.2)',
                    boxShadow: accent === hex ? `0 0 0 1.5px ${hex}` : 'none',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button" onClick={() => setEditingApps((v) => !v)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 999, border: 'none',
                  background: editingApps ? accent : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)',
                  color: editingApps ? '#ffffff' : 'inherit', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}
              >
                <Plus size={12} /> {editingApps ? 'Bitti' : 'Ekle / Çıkar'}
              </button>
              <button
                type="button" title="Klasörü dağıt (modülleri masaüstüne geri çıkar)"
                onClick={() => onDissolveFolder(folder.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 999, border: 'none',
                  background: 'rgba(239, 68, 68, 0.14)', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}
              >
                <Trash2 size={12} /> Dağıt
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: 12, overflowY: 'auto', flex: 1 }}>
          {editingApps ? (
            <FolderAppCatalogEditor
              folder={folder} filteredCatalog={filteredCatalog}
              filterText={filterText} setFilterText={setFilterText}
              isDark={isDark} accent={accent} onSetFolderApps={onSetFolderApps}
            />
          ) : folderApps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 10px', opacity: 0.78, fontSize: 12 }}>
              Bu klasörde henüz modül yok. Ayarlardan modül ekleyebilirsiniz.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: 8 }}>
                {folderApps.map((app) => {
                  const surf = resolveIconSurface(
                    app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
                  );
                  const isBeingDragged = draggingAppId === app.id;
                  return (
                    <div
                      key={app.id} draggable data-folder-app-item={app.id}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('text/osgl-folder-app', app.id);
                        setDraggingAppId(app.id);
                      }}
                      onDragEnd={() => { setDraggingAppId(null); setOutsideHover(false); }}
                      style={{
                        position: 'relative', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 6, cursor: 'grab',
                        opacity: isBeingDragged ? 0.45 : 1, transition: 'opacity 0.14s ease',
                      }}
                    >
                      <button
                        type="button" onClick={() => { onOpenApp(app.id); onClose(); }}
                        style={{
                          width: 56, height: 56, borderRadius: 15, border: surf.border ?? 'none',
                          background: surf.background, color: surf.color, cursor: 'grab',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 8px 18px rgba(0,0,0,0.24)',
                        }}
                      >
                        <GoogleIcon name={app.googleIcon} size={28} />
                      </button>
                      <button
                        type="button" title="Masaüstüne Çıkar" aria-label={`${app.label} modülünü masaüstüne çıkar`}
                        onClick={() => onRemoveAppFromFolder(folder.id, app.id)}
                        style={{
                          position: 'absolute', top: -4, right: 14, width: 20, height: 20, borderRadius: '50%',
                          border: 'none', background: 'rgba(15,23,42,0.78)', color: '#ffffff',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}
                      >
                        <FolderOutput size={11} />
                      </button>
                      <span style={{ fontSize: 11.5, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
                        {app.shortLabel || app.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11.5, opacity: 0.62, textAlign: 'center' }}>
                İpucu: Bir modülü basılı tutup klasör dışına sürükleyerek masaüstüne çıkarabilirsiniz.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
}
