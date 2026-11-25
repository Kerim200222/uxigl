import React, { useMemo, useRef, useState } from 'react';
import { DesktopFolderTile } from './DesktopFolderTile';
import { DesktopIconTile } from './DesktopIconTile';
import { fromFolderSlotKey } from './desktopFoldersAndDock';
import {
  buildDesktopGridOccupants,
  computePreviewDropSlots,
  reorderDesktopGridOnDrop,
} from './desktopGridUtils';
import type { DesktopFolder, FloatingWindowState, IconBgStyle, OSWorkspaceApp } from './types';

export interface DesktopGridProps {
  apps: OSWorkspaceApp[];
  folders?: DesktopFolder[];
  renamingFolderId?: string | null;
  isDark: boolean;
  barTextColor: string;
  effectiveIsLightBg: boolean;
  primaryColor: string;
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  iconSizePx: number;
  viewportSize: { w: number; h: number };
  iconSlots: Record<string, number>;
  setIconSlots: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selectedAppIds: string[];
  setSelectedAppIds: React.Dispatch<React.SetStateAction<string[]>>;
  windows: FloatingWindowState[];
  onOpenApp: (id: string) => void;
  onOpenFolder?: (folderId: string) => void;
  onCommitRenameFolder?: (folderId: string, nextName: string) => void;
  onDropAppsIntoFolder?: (folderId: string, appIds: string[]) => void;
  onDropImageOnDesktop?: (file: File) => void;
  onDropImageOnApp?: (appId: string, file: File) => void;
  onOpenItemContextMenu?: (e: React.MouseEvent, kind: 'app' | 'folder', targetId: string) => void;
  children?: React.ReactNode;
}

export function DesktopGrid({
  apps, folders = [], renamingFolderId = null, isDark, barTextColor, effectiveIsLightBg,
  primaryColor, iconBgStyle, iconBgColor, iconGradColor1, iconGradColor2, iconColor, iconSizePx,
  viewportSize, iconSlots, setIconSlots, selectedAppIds, setSelectedAppIds, windows,
  onOpenApp, onOpenFolder, onCommitRenameFolder, onDropAppsIntoFolder, onDropImageOnDesktop, onDropImageOnApp, onOpenItemContextMenu, children,
}: DesktopGridProps) {
  const extractDroppedImageFile = (e: React.DragEvent): File | null => {
    const file = e.dataTransfer?.files?.[0];
    if (!file) return null;
    if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg|ico)$/i.test(file.name)) {
      return file;
    }
    return null;
  };
  const [draggedSlotKey, setDraggedSlotKey] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [selectionBox, setSelectionBox] = useState<{ left: number; top: number; width: number; height: number } | null>(null);

  const marqueeRef = useRef<{ startX: number; startY: number; active: boolean } | null>(null);
  const desktopIconRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const cachedIconRectsRef = useRef<Array<{ id: string; rect: DOMRect }>>([]);
  const lastHitsRef = useRef<string[]>([]);

  const iconBoxSize = Math.max(44, Math.min(84, iconSizePx));
  const iconGlyphSize = Math.round(iconBoxSize * 0.56);
  const cellHeight = iconBoxSize + 52;
  const cellWidth = iconBoxSize + 40;
  const availableGridHeight = Math.max(cellHeight, viewportSize.h - 156);
  const rowsPerColumn = Math.max(1, Math.floor((availableGridHeight + 8) / (cellHeight + 8)));
  const colsCount = Math.max(4, Math.floor((viewportSize.w - 48 + 12) / (cellWidth + 12)));
  const totalGridSlots = Math.max(apps.length + folders.length, rowsPerColumn * colsCount);

  const slotToOccupant = useMemo(
    () => buildDesktopGridOccupants({ apps, folders, iconSlots, totalGridSlots }),
    [apps, folders, iconSlots, totalGridSlots]
  );

  const previewSlots = useMemo(
    () => computePreviewDropSlots({
      occupantMap: slotToOccupant, draggedSlotKey, targetSlot: dragOverSlot,
      selectedAppIds, rowsPerColumn, colsCount,
    }),
    [slotToOccupant, draggedSlotKey, dragOverSlot, selectedAppIds, rowsPerColumn, colsCount]
  );

  const handleDropOnSlot = (targetSlot: number) => {
    if (!draggedSlotKey) { setDragOverSlot(null); return; }
    const targetOcc = slotToOccupant.get(targetSlot);
    const draggedFolderId = fromFolderSlotKey(draggedSlotKey);

    if (!draggedFolderId && targetOcc?.kind === 'folder' && onDropAppsIntoFolder) {
      const movingApps = selectedAppIds.length > 1 && selectedAppIds.includes(draggedSlotKey)
        ? selectedAppIds : [draggedSlotKey];
      onDropAppsIntoFolder(targetOcc.folder.id, movingApps);
      setSelectedAppIds([]);
      setDraggedSlotKey(null);
      setDragOverSlot(null);
      return;
    }

    setIconSlots((prev) => reorderDesktopGridOnDrop({
      apps, folders, prevSlots: prev, draggedSlotKey, targetSlot, selectedAppIds, rowsPerColumn, colsCount,
    }));
    setDraggedSlotKey(null);
    setDragOverSlot(null);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest(
      'button, input, [data-osgl-folder-id], [data-macos-window="true"], [data-macos-dock="true"], [data-macos-context="true"], [data-desktop-widget]'
    )) return;
    setSelectedAppIds([]);
    lastHitsRef.current = [];
    cachedIconRectsRef.current = Object.entries(desktopIconRefs.current)
      .filter((entry): entry is [string, HTMLButtonElement] => Boolean(entry[1]))
      .map(([id, el]) => ({ id, rect: el.getBoundingClientRect() }));
    marqueeRef.current = { startX: e.clientX, startY: e.clientY, active: true };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = marqueeRef.current;
    if (!m || !m.active) return;
    const left = Math.min(m.startX, e.clientX);
    const top = Math.min(m.startY, e.clientY);
    const width = Math.abs(e.clientX - m.startX);
    const height = Math.abs(e.clientY - m.startY);
    if (width < 4 && height < 4) return;
    const box = { left, top, width, height };
    setSelectionBox(box);
    const hits: string[] = [];
    for (const { id, rect: r } of cachedIconRectsRef.current) {
      if (!(r.right < box.left || r.left > box.left + box.width || r.bottom < box.top || r.top > box.top + box.height)) {
        hits.push(id);
      }
    }
    const prev = lastHitsRef.current;
    if (hits.length !== prev.length || hits.some((id, i) => id !== prev[i])) {
      lastHitsRef.current = hits;
      setSelectedAppIds(hits);
    }
  };

  const handlePointerUp = () => {
    if (marqueeRef.current) { marqueeRef.current.active = false; marqueeRef.current = null; }
    cachedIconRectsRef.current = [];
    setSelectionBox(null);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDragOver={(e) => {
        if (e.dataTransfer?.types?.includes('Files')) {
          e.preventDefault();
        }
      }}
      onDrop={(e) => {
        const imgFile = extractDroppedImageFile(e);
        if (imgFile && onDropImageOnDesktop) {
          e.preventDefault();
          setDragOverSlot(null);
          onDropImageOnDesktop(imgFile);
        }
      }}
      style={{
        position: 'relative', flex: 1, padding: '14px 24px 96px',
        overflow: 'hidden', userSelect: selectionBox ? 'none' : undefined,
      }}
    >
      <div
        className="macosgl-scroll"
        style={{
          display: 'grid', gridAutoFlow: 'column',
          gridTemplateRows: `repeat(${rowsPerColumn}, ${cellHeight}px)`,
          gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))`,
          justifyItems: 'center',
          gap: '8px 12px', padding: '6px 4px', width: '100%',
          height: availableGridHeight + 12, overflow: 'hidden',
        }}
      >
        {Array.from({ length: rowsPerColumn * colsCount }, (_, slotIdx) => {
          const occ = slotToOccupant.get(slotIdx);
          const isDropHighlight = draggedSlotKey !== null && previewSlots.has(slotIdx);

          if (!occ) {
            return (
              <div
                key={`slot-${slotIdx}`}
                onDragOver={(e) => {
                  const isFileDrag = e.dataTransfer?.types?.includes('Files');
                  if (!draggedSlotKey && !isFileDrag) return;
                  e.preventDefault();
                  if (dragOverSlot !== slotIdx) setDragOverSlot(slotIdx);
                }}
                onDragLeave={() => { if (dragOverSlot === slotIdx) setDragOverSlot(null); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const imgFile = extractDroppedImageFile(e);
                  if (imgFile && onDropImageOnDesktop) {
                    e.stopPropagation();
                    setDragOverSlot(null);
                    onDropImageOnDesktop(imgFile);
                    return;
                  }
                  handleDropOnSlot(slotIdx);
                }}
                style={{
                  width: cellWidth, height: cellHeight, borderRadius: 16,
                  border: isDropHighlight ? '1.5px dashed rgba(255,255,255,0.72)' : '1.5px solid transparent',
                  backgroundColor: isDropHighlight ? 'rgba(255,255,255,0.14)' : 'transparent',
                }}
              />
            );
          }

          if (occ.kind === 'folder') {
            const folderApps = occ.folder.appIds
              .map((id) => apps.find((a) => a.id === id))
              .filter((a): a is OSWorkspaceApp => Boolean(a));
            return (
              <DesktopFolderTile
                key={occ.slotKey} folder={occ.folder} folderApps={folderApps} slotIdx={slotIdx}
                isRenaming={renamingFolderId === occ.folder.id} isSelected={false}
                isDragged={draggedSlotKey === occ.slotKey}
                isDropHighlight={isDropHighlight && draggedSlotKey !== occ.slotKey}
                iconBoxSize={iconBoxSize} barTextColor={barTextColor}
                effectiveIsLightBg={effectiveIsLightBg} isDark={isDark} primaryColor={primaryColor}
                iconBgStyle={iconBgStyle} iconBgColor={iconBgColor}
                iconGradColor1={iconGradColor1} iconGradColor2={iconGradColor2} iconColor={iconColor}
                onOpenFolder={() => onOpenFolder?.(occ.folder.id)}
                onCommitRename={(nextName) => onCommitRenameFolder?.(occ.folder.id, nextName)}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onOpenItemContextMenu?.(e, 'folder', occ.folder.id); }}
                onDragStart={() => { setSelectedAppIds([]); setDraggedSlotKey(occ.slotKey); }}
                onDragOver={(e) => { e.preventDefault(); if (dragOverSlot !== slotIdx) setDragOverSlot(slotIdx); }}
                onDragLeave={() => { if (dragOverSlot === slotIdx) setDragOverSlot(null); }}
                onDrop={(e) => {
                e.preventDefault();
                const imgFile = extractDroppedImageFile(e);
                if (imgFile && onDropImageOnApp) {
                  e.stopPropagation();
                  setDragOverSlot(null);
                  onDropImageOnApp(app.id, imgFile);
                  return;
                }
                handleDropOnSlot(slotIdx);
              }}
                onDragEnd={() => { setDraggedSlotKey(null); setDragOverSlot(null); }}
              />
            );
          }

          const app = occ.app;
          const isPartOfDrag = draggedSlotKey === app.id ||
            (draggedSlotKey !== null && selectedAppIds.length > 1 && selectedAppIds.includes(draggedSlotKey) && selectedAppIds.includes(app.id));

          return (
            <DesktopIconTile
              key={app.id} app={app} slotIdx={slotIdx}
              buttonRef={(el) => { desktopIconRefs.current[app.id] = el; }}
              isOpen={windows.some((w) => w.appId === app.id)}
              isSelected={selectedAppIds.includes(app.id)}
              isDragged={isPartOfDrag}
              isDropHighlight={isDropHighlight && !isPartOfDrag}
              iconBoxSize={iconBoxSize} iconGlyphSize={iconGlyphSize}
              barTextColor={barTextColor} effectiveIsLightBg={effectiveIsLightBg}
              isDark={isDark} primaryColor={primaryColor} iconBgStyle={iconBgStyle}
              iconBgColor={iconBgColor} iconGradColor1={iconGradColor1}
              iconGradColor2={iconGradColor2} iconColor={iconColor}
              onDragStart={(e) => {
                e.dataTransfer?.setData('text/osgl-app-id', app.id);
                if (!selectedAppIds.includes(app.id)) setSelectedAppIds([app.id]);
                setDraggedSlotKey(app.id);
              }}
              onDragOver={(e) => { e.preventDefault(); if (dragOverSlot !== slotIdx) setDragOverSlot(slotIdx); }}
              onDragLeave={() => { if (dragOverSlot === slotIdx) setDragOverSlot(null); }}
              onDrop={(e) => {
                e.preventDefault();
                const imgFile = extractDroppedImageFile(e);
                if (imgFile && onDropImageOnApp) {
                  e.stopPropagation();
                  setDragOverSlot(null);
                  onDropImageOnApp(app.id, imgFile);
                  return;
                }
                handleDropOnSlot(slotIdx);
              }}
              onDragEnd={() => { setDraggedSlotKey(null); setDragOverSlot(null); }}
              onContextMenu={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (!selectedAppIds.includes(app.id)) setSelectedAppIds([app.id]);
                onOpenItemContextMenu?.(e, 'app', app.id);
              }}
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                  e.stopPropagation();
                  setSelectedAppIds((prev) => prev.includes(app.id) ? prev.filter((id) => id !== app.id) : [...prev, app.id]);
                  return;
                }
                setSelectedAppIds([app.id]);
                onOpenApp(app.id);
              }}
            />
          );
        })}
      </div>

      {selectionBox && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', left: selectionBox.left, top: selectionBox.top,
            width: selectionBox.width, height: selectionBox.height,
            backgroundColor: 'rgba(59, 130, 246, 0.16)', border: '1px solid rgba(96, 165, 250, 0.78)',
            borderRadius: 5, pointerEvents: 'none', zIndex: 90,
          }}
        />
      )}

      {children}
    </div>
  );
}
