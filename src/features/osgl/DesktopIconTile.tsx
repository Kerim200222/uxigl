import React from 'react';
import { GoogleIcon } from '../../components/primitives';
import { useOptionalTheme } from '../../providers/ThemeProvider';
import { resolveIconSurface, type IconBgStyle, type OSWorkspaceApp } from './types';

export function DesktopIconTile({
  app,
  slotIdx,
  buttonRef,
  isOpen,
  isSelected,
  isDragged,
  isDropHighlight,
  iconBoxSize,
  iconGlyphSize,
  barTextColor,
  effectiveIsLightBg,
  isDark,
  primaryColor,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onClick,
  onContextMenu,
}: {
  app: OSWorkspaceApp;
  slotIdx: number;
  buttonRef: (el: HTMLButtonElement | null) => void;
  isOpen: boolean;
  isSelected: boolean;
  isDragged: boolean;
  isDropHighlight: boolean;
  iconBoxSize: number;
  iconGlyphSize: number;
  barTextColor: string;
  effectiveIsLightBg: boolean;
  isDark: boolean;
  primaryColor: string;
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onClick: (e: React.MouseEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  const theme = useOptionalTheme();
  const rawScale = (theme?.preferences as { fontScale?: number } | undefined)?.fontScale ?? 1;
  const scaleFactor = rawScale > 3 ? rawScale / 100 : rawScale;
  const labelFontSize = Math.max(9, Math.min(20, Math.round(12 * scaleFactor)));
  const hasBadge = Boolean(app.badge && String(app.badge).trim() !== '0');
  const iconSurf = resolveIconSurface(
    app,
    iconBgStyle,
    primaryColor,
    isDark,
    iconColor,
    iconBgColor,
    iconGradColor1,
    iconGradColor2
  );

  return (
    <button
      key={`${app.id}-${slotIdx}`}
      ref={buttonRef}
      type="button"
      data-osgl-app-icon={app.id}
      title={app.description ? `${app.label} — ${app.description}` : app.label}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onContextMenu={onContextMenu}
      className="macosgl-app-btn"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 6,
        border: isDropHighlight
          ? '1.5px dashed rgba(255,255,255,0.75)'
          : isSelected
            ? '1.5px solid rgba(96, 165, 250, 0.85)'
            : '1.5px solid transparent',
        background: isDropHighlight
          ? 'rgba(255,255,255,0.14)'
          : isSelected
            ? 'rgba(59, 130, 246, 0.24)'
            : 'transparent',
        borderRadius: 16,
        padding: '6px 4px',
        cursor: 'pointer',
        opacity: isDragged ? 0.45 : 1,
      }}
    >
      <div
        className="macosgl-app-icon-box"
        style={{
          position: 'relative',
          width: iconBoxSize,
          height: iconBoxSize,
          borderRadius: Math.round(iconBoxSize * 0.26),
          background: iconSurf.background,
          border: iconSurf.border,
          backdropFilter: iconSurf.backdropFilter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 12px 26px rgba(0, 0, 0, 0.32), 0 2px 6px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.42)',
          color: iconSurf.color,
        }}
      >
        {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={iconGlyphSize} />}
        {hasBadge && (
          <span
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 19,
              height: 19,
              padding: '0 5px',
              borderRadius: 999,
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: 10.5,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
              border: '2px solid rgba(255,255,255,0.92)',
            }}
          >
            {app.badge}
          </span>
        )}
      </div>
      <span
        style={{
          fontSize: labelFontSize,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#ffffff',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.55), 0 2px 10px rgba(0, 0, 0, 0.25)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          textAlign: 'center',
          lineHeight: 1.25,
          padding: '4px 8px',
          margin: '-4px -8px',
          maxWidth: iconBoxSize + 48,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {app.shortLabel || app.label}
      </span>
      {isOpen && (
        <span
          style={{
            width: 4.5,
            height: 4.5,
            borderRadius: 999,
            marginTop: -3,
            backgroundColor: barTextColor,
            opacity: 0.9,
          }}
        />
      )}
    </button>
  );
}
