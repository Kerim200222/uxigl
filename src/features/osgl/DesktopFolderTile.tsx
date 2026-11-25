import React, { useEffect, useRef, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import {
  resolveIconSurface,
  type DesktopFolder,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';

export function DesktopFolderTile({
  folder,
  folderApps,
  slotIdx,
  isRenaming,
  isSelected,
  isDragged,
  isDropHighlight,
  iconBoxSize,
  barTextColor,
  effectiveIsLightBg,
  isDark,
  primaryColor,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  onOpenFolder,
  onCommitRename,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: {
  folder: DesktopFolder;
  folderApps: OSWorkspaceApp[];
  slotIdx: number;
  isRenaming: boolean;
  isSelected: boolean;
  isDragged: boolean;
  isDropHighlight: boolean;
  iconBoxSize: number;
  barTextColor: string;
  effectiveIsLightBg: boolean;
  isDark: boolean;
  primaryColor: string;
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  onOpenFolder: () => void;
  onCommitRename: (nextName: string) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  const [draftName, setDraftName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const accent = folder.color || primaryColor;

  useEffect(() => {
    setDraftName(folder.name);
  }, [folder.name]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const previewApps = folderApps.slice(0, 4);
  const miniSize = Math.max(16, Math.floor((iconBoxSize - 18) / 2));

  return (
    <div
      key={`folder-${folder.id}-${slotIdx}`}
      data-osgl-folder-id={folder.id}
      draggable={!isRenaming}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      onClick={(e) => {
        if (isRenaming) return;
        e.stopPropagation();
        onOpenFolder();
      }}
      className="macosgl-app-btn"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 6,
        border: isDropHighlight
          ? `2px solid ${accent}`
          : isSelected
            ? '1.5px solid rgba(96, 165, 250, 0.85)'
            : '1.5px solid transparent',
        background: isDropHighlight
          ? `color-mix(in srgb, ${accent} 26%, rgba(255,255,255,0.16))`
          : isSelected
            ? 'rgba(59, 130, 246, 0.24)'
            : 'transparent',
        borderRadius: 16,
        padding: '6px 4px',
        cursor: 'pointer',
        opacity: isDragged ? 0.45 : 1,
        transform: isDropHighlight ? 'scale(1.06)' : undefined,
        transition: 'transform 0.14s ease, background 0.14s ease, border-color 0.14s ease',
      }}
    >
      <div
        className="macosgl-app-icon-box"
        style={{
          position: 'relative',
          width: iconBoxSize,
          height: iconBoxSize,
          borderRadius: Math.round(iconBoxSize * 0.26),
          background: isDark
            ? `linear-gradient(145deg, color-mix(in srgb, ${accent} 28%, rgba(30,41,59,0.78)), rgba(15,23,42,0.72))`
            : `linear-gradient(145deg, color-mix(in srgb, ${accent} 22%, rgba(255,255,255,0.82)), rgba(255,255,255,0.62))`,
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.20)'
            : '1px solid rgba(255, 255, 255, 0.55)',
          backdropFilter: 'blur(16px) saturate(165%)',
          WebkitBackdropFilter: 'blur(16px) saturate(165%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          boxShadow:
            '0 12px 26px rgba(0, 0, 0, 0.30), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
        }}
      >
        {previewApps.length === 0 ? (
          <FolderOpen size={Math.round(iconBoxSize * 0.46)} style={{ color: accent }} />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 4,
              width: '100%',
              height: '100%',
              placeItems: 'center',
            }}
          >
            {previewApps.map((app) => {
              const surf = resolveIconSurface(
                app, iconBgStyle, primaryColor, isDark,
                iconColor, iconBgColor, iconGradColor1, iconGradColor2
              );
              return (
                <span
                  key={app.id}
                  style={{
                    width: miniSize,
                    height: miniSize,
                    borderRadius: Math.max(5, Math.round(miniSize * 0.28)),
                    background: surf.background,
                    color: surf.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.22)',
                  }}
                >
                  <GoogleIcon name={app.googleIcon} size={Math.max(10, Math.round(miniSize * 0.62))} />
                </span>
              );
            })}
          </div>
        )}

        {folder.appIds.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 19,
              height: 19,
              padding: '0 5px',
              borderRadius: 999,
              backgroundColor: accent,
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid rgba(255,255,255,0.9)',
            }}
          >
            {folder.appIds.length}
          </span>
        )}
      </div>

      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          aria-label="Klasör Adı"
          value={draftName}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={() => onCommitRename(draftName || folder.name)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') onCommitRename(draftName || folder.name);
            if (e.key === 'Escape') onCommitRename(folder.name);
          }}
          style={{
            width: iconBoxSize + 32,
            padding: '2px 6px',
            borderRadius: 6,
            border: `1.5px solid ${accent}`,
            background: isDark ? 'rgba(15,23,42,0.92)' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: 11.5,
            fontWeight: 700,
            textAlign: 'center',
            outline: 'none',
          }}
        />
      ) : (
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: '#ffffff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.85), 0 0 6px rgba(0, 0, 0, 0.45)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
            textAlign: 'center',
            lineHeight: 1.25,
            maxWidth: iconBoxSize + 34,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {folder.name}
        </span>
      )}
    </div>
  );
}
