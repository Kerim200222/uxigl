import React from 'react';
import { GripHorizontal } from 'lucide-react';
import type {
  OSDesktopWidgetDefinition,
  WidgetPosition,
  WidgetRenderContext,
  WidgetSize,
  WidgetUserPrefs,
} from './types';
import { useWidgetDragResize } from './useWidgetDragResize';
import { resolveCustomizedWidgetCardStyle } from './widgetCustomization';
import {
  clampWidgetPosition,
  clampWidgetSize,
  resolveWidgetOverlaps,
  snapWidgetToGrid,
} from './widgetLayout';

export function DesktopWidgetsHost({
  widgets, locale, isDark, glassOpacity, glassBlur, primaryColor,
  enabledWidgets, widgetPositions, onMoveWidget, widgetSizes, onResizeWidget,
  widgetUserPrefs = {}, onOpenCustomize, viewportSize, onOpenApp, onOpenSideBySide,
}: {
  widgets: OSDesktopWidgetDefinition[]; locale: 'tr' | 'en'; isDark: boolean;
  glassOpacity: number; glassBlur: number; primaryColor: string;
  enabledWidgets: Record<string, boolean>; widgetPositions: Record<string, WidgetPosition>;
  onMoveWidget: (id: string, pos: WidgetPosition) => void;
  widgetSizes: Record<string, WidgetSize>;
  onResizeWidget: (id: string, size: WidgetSize) => void;
  widgetUserPrefs?: Record<string, WidgetUserPrefs>;
  onOpenCustomize?: (id: string, anchorX: number, anchorY: number) => void;
  viewportSize: { w: number; h: number };
  onOpenApp: (id: string) => void;
  onOpenSideBySide: (leftAppId: string, rightAppId: string) => void;
}) {
  const [maximizedId, setMaximizedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!maximizedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMaximizedId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [maximizedId]);

  const {
    draggingId, dragPreviewPos, resizingId, resizePreviewSize,
    handlePointerDown, handlePointerMove, handlePointerUp,
    handleResizeDown, handleResizeMove, handleResizeUp,
  } = useWidgetDragResize({ viewportSize, onMoveWidget, onResizeWidget });

  const baseCardStyle: React.CSSProperties = {
    width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden',
    borderRadius: 16, padding: 13,
    backgroundColor: isDark ? '#0d1322' : '#ffffff',
    backgroundImage: isDark
      ? 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 45%, rgba(2,6,23,0.12) 100%)'
      : undefined,
    color: isDark ? '#f8fafc' : '#0f172a',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(15, 23, 42, 0.10)',
    boxShadow: isDark
      ? '0 18px 40px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
      : '0 14px 34px rgba(15, 23, 42, 0.15)',
    display: 'flex', flexDirection: 'column', gap: 8,
  };

  const visible = widgets
    .filter((def) => enabledWidgets[def.id] !== false)
    .map((def) => {
      const isDragging = draggingId === def.id;
      const isResizing = resizingId === def.id;
      const rawSize = isResizing && resizePreviewSize ? resizePreviewSize : (widgetSizes[def.id] ?? def.defaultSize);
      const pos = isDragging && dragPreviewPos
        ? dragPreviewPos
        : clampWidgetPosition(
            widgetPositions[def.id]?.x ?? 20, widgetPositions[def.id]?.y ?? 20,
            rawSize.width, rawSize.height, viewportSize.w, viewportSize.h
          );
      return {
        def, isDragging, isResizing, rawSize, pos,
        size: clampWidgetSize(rawSize.width, rawSize.height, pos.x, pos.y, viewportSize.w, viewportSize.h),
      };
    });

  const resolved = resolveWidgetOverlaps(
    visible
      .filter((v) => v.def.id !== maximizedId)
      .map((v) => ({ id: v.def.id, pos: v.pos, size: v.size, locked: v.isDragging || v.isResizing })),
    viewportSize.h
  );

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      {visible.map(({ def, isDragging, isResizing, rawSize }) => {
        const isMaximized = maximizedId === def.id;
        const basePos = isMaximized ? { x: 12, y: 12 } : (resolved[def.id] ?? { x: 20, y: 20 });
        const size = isMaximized
          ? { width: Math.max(220, viewportSize.w - 24), height: Math.max(96, viewportSize.h - 24) }
          : clampWidgetSize(rawSize.width, rawSize.height, basePos.x, basePos.y, viewportSize.w, viewportSize.h);
        const scale = Math.max(0.85, Math.min(2.1, Math.min(size.width / def.defaultSize.width, size.height / def.defaultSize.height)));
        const prefs = widgetUserPrefs[def.id];
        const effectiveAccent = prefs?.accentHex || primaryColor;
        const cardStyle = resolveCustomizedWidgetCardStyle({ baseCardStyle, isDark, effectiveAccent, prefs });

        const ctx: WidgetRenderContext = {
          cardStyle,
          subtleBorder: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.09)',
          subtleBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.045)',
          primaryColor: effectiveAccent,
          isDark, locale, width: size.width, height: size.height, scale,
          customPrefs: prefs,
          getOption: (key, fallback) => prefs?.options?.[key] ?? fallback,
          openApp: onOpenApp, openSideBySide: onOpenSideBySide,
        };

        const ghostPos = isDragging ? { x: snapWidgetToGrid(basePos.x), y: snapWidgetToGrid(basePos.y) } : basePos;
        const ghostSize = isResizing ? { width: snapWidgetToGrid(size.width), height: snapWidgetToGrid(size.height) } : size;

        return (
          <React.Fragment key={def.id}>
            {(isDragging || isResizing) && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', left: 0, top: 0, width: ghostSize.width, height: ghostSize.height,
                  transform: `translate3d(${ghostPos.x}px, ${ghostPos.y}px, 0)`,
                  borderRadius: 16, border: `2px dashed ${effectiveAccent}`,
                  backgroundColor: isDark ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.08)', pointerEvents: 'none',
                }}
              />
            )}

            <div
              data-desktop-widget={def.id}
              aria-label={locale === 'tr' ? def.labelTr : def.labelEn ?? def.labelTr}
              onMouseDown={(e) => e.stopPropagation()}
              onDoubleClick={(e) => {
                const target = e.target as HTMLElement | null;
                if (target?.closest('button, a, input, select, textarea, [data-widget-resize="true"]')) return;
                e.stopPropagation();
                setMaximizedId((prev) => (prev === def.id ? null : def.id));
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenCustomize?.(def.id, e.clientX, e.clientY);
              }}
              onPointerDown={(e) => {
                if (isMaximized) return;
                handlePointerDown(e, def, basePos, size);
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                position: 'absolute', left: 0, top: 0, width: size.width, height: size.height,
                transform: `translate3d(${basePos.x}px, ${basePos.y}px, 0)`,
                zIndex: isMaximized ? 20 : undefined,
                pointerEvents: 'auto', cursor: isMaximized ? 'default' : isDragging ? 'grabbing' : 'grab',
                userSelect: isDragging || isResizing ? 'none' : undefined,
                opacity: isDragging ? 0.92 : 1,
                transition: isDragging || isResizing
                  ? 'none'
                  : 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1), width 160ms ease, height 160ms ease',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                  color: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(15, 23, 42, 0.25)',
                  pointerEvents: 'none', zIndex: 2, display: 'inline-flex',
                }}
              >
                <GripHorizontal size={12} />
              </span>

              <div style={cardStyle}>{def.render(ctx)}</div>

              <div
                data-widget-resize="true"
                title="Yeniden boyutlandırmak için sürükleyin"
                onPointerDown={(e) => handleResizeDown(e, def.id, basePos, size)}
                onPointerMove={handleResizeMove}
                onPointerUp={handleResizeUp}
                style={{
                  position: 'absolute', right: 3, bottom: 3, width: 16, height: 16,
                  cursor: 'nwse-resize', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                  padding: 3, zIndex: 3, color: isDark ? 'rgba(255, 255, 255, 0.34)' : 'rgba(15, 23, 42, 0.30)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M9 3L3 9M9 6.5L6.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
