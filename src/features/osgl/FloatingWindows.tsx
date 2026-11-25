import React from 'react';
import { Badge } from '../../components/primitives';
import { GoogleIcon } from '../../components/primitives';
import { TrafficLights } from './WindowChrome';
import {
  OS_THEME_STUDIO_APP_ID,
  type FloatingWindowState,
  type OSWorkspaceApp,
  type QualityMode,
  type WindowControlsSide,
} from './types';
import { useFloatingWindowPointer } from './useFloatingWindowPointer';
import { computeSnapBounds, RESIZE_HANDLE_SPECS, type SnapZone } from './windowGeometry';

export function FloatingWindows({
  apps, windows, setWindows, closingWindowIds, highlightedWindowId,
  windowAnimation, windowControlsSide = 'right', qualityMode, glassOpacity, glassBlur,
  customRadiusPx, paletteTokens, dockVisible = true,
  onFocus, onClose, onMinimize, onMaximize, onFullscreen, onSnapWindow,
  renderWindowContent, renderThemeStudio,
}: {
  apps: OSWorkspaceApp[]; windows: FloatingWindowState[];
  setWindows: React.Dispatch<React.SetStateAction<FloatingWindowState[]>>;
  closingWindowIds: string[]; highlightedWindowId: string | null;
  windowAnimation: boolean; windowControlsSide?: WindowControlsSide; qualityMode: QualityMode;
  glassOpacity: number; glassBlur: number; customRadiusPx?: number;
  paletteTokens: {
    primary: string; bgElevated: string; borderStrong: string;
    borderSubtle: string; surfaceTonal: string; textPrimary: string;
  };
  dockVisible?: boolean;
  onFocus: (id: string) => void; onClose: (id: string) => void; onMinimize: (id: string) => void;
  onMaximize: (id: string) => void; onFullscreen: (id: string) => void;
  onSnapWindow: (id: string, zone: Exclude<SnapZone, null>) => void;
  renderWindowContent: (appId: string) => React.ReactNode;
  renderThemeStudio: () => React.ReactNode;
}) {
  const ptr = useFloatingWindowPointer({ setWindows, onFocus, onSnapWindow });

  const visibleWindows = windows.filter((w) => !w.minimized);
  const topmostWinId =
    visibleWindows.length > 0
      ? visibleWindows.reduce((best, cur) => (cur.zIndex >= best.zIndex ? cur : best)).id
      : null;

  const vwNow = typeof window !== 'undefined' ? window.innerWidth : 1366;
  const vhNow = typeof window !== 'undefined' ? window.innerHeight : 860;
  const snapRect = ptr.snapPreview ? computeSnapBounds(ptr.snapPreview, vwNow, vhNow, dockVisible) : null;

  return (
    <>
      {snapRect && (
        <div
          data-osgl-snap-preview={ptr.snapPreview ?? undefined}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: snapRect.x + 6,
            top: snapRect.y + 6,
            width: Math.max(120, snapRect.width - 12),
            height: Math.max(120, snapRect.height - 12),
            borderRadius: 14,
            border: `2px dashed ${paletteTokens.primary}`,
            backgroundColor: `color-mix(in srgb, ${paletteTokens.primary} 16%, transparent)`,
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
            zIndex: 1940,
            transition: 'all 0.12s ease-out',
          }}
        />
      )}

      {visibleWindows.map((win) => {
        const app = apps.find((m) => m.id === win.appId);
        if (!app) return null;
        const isFocused = win.id === topmostWinId;
        const isFullBleed = Boolean(app.fullBleed);
        const isFullscreen = Boolean(win.fullscreen);
        const isMaximized = Boolean(win.maximized) && !isFullscreen;
        const isTallOrExpanded = isFullscreen || isMaximized || win.height >= 680;
        const isClosing = closingWindowIds.includes(win.id);
        const isHighlighted = highlightedWindowId === win.id;
        const radius = isFullscreen ? 0 : customRadiusPx ? customRadiusPx + 6 : isMaximized ? 18 : 16;
        const maxBottomReserve = dockVisible ? 102 : 20;

        const winClasses = [
          'osgl-window-shell',
          windowAnimation && qualityMode === 'quality'
            ? isClosing
              ? 'macosgl-win-anim-close'
              : 'macosgl-win-anim-open'
            : '',
          isHighlighted ? 'osgl-win-highlight' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const bodyHeightVar = isFullscreen
          ? 'calc(100dvh - 38px)'
          : isMaximized
            ? `calc(100dvh - ${44 + maxBottomReserve + 38}px)`
            : `${Math.max(220, win.height - 38)}px`;

        return (
          <div
            key={win.id}
            data-macos-window="true"
            data-osgl-window-app={app.id}
            data-osgl-window-focused={isFocused ? 'true' : 'false'}
            data-osgl-window-maximized={isMaximized ? 'true' : 'false'}
            data-osgl-window-fullscreen={isFullscreen ? 'true' : 'false'}
            className={winClasses}
            ref={(el) => {
              ptr.windowRefs.current[win.id] = el;
            }}
            onMouseDown={() => onFocus(win.id)}
            style={
              {
                '--osgl-win-body-h': bodyHeightVar,
                position: isFullscreen ? 'fixed' : 'absolute',
                left: isFullscreen ? 0 : isMaximized ? 14 : win.x,
                top: isFullscreen ? 0 : isMaximized ? 10 : win.y,
                width: isFullscreen ? '100vw' : isMaximized ? 'calc(100% - 28px)' : win.width,
                height: isFullscreen ? '100dvh' : isMaximized ? `calc(100% - ${maxBottomReserve}px)` : win.height,
                maxWidth: isFullscreen ? '100vw' : isMaximized ? 'calc(100% - 24px)' : '100%',
                maxHeight: isFullscreen ? '100dvh' : isMaximized ? `calc(100% - ${maxBottomReserve}px)` : '100%',
                zIndex: isFullscreen ? 3100 + (win.zIndex % 200) : win.zIndex,
                borderRadius: radius,
                border: isFullscreen
                  ? 'none'
                  : isHighlighted
                    ? `2px solid ${paletteTokens.primary}`
                    : isFocused
                      ? `1px solid color-mix(in srgb, ${paletteTokens.primary} 22%, ${paletteTokens.borderSubtle})`
                      : `1px solid ${paletteTokens.borderSubtle}`,
                boxShadow: isFullscreen
                  ? 'none'
                  : isHighlighted
                    ? `0 0 0 3px color-mix(in srgb, ${paletteTokens.primary} 28%, transparent), 0 28px 80px rgba(0,0,0,0.48)`
                    : isFocused
                      ? `0 28px 70px rgba(0, 0, 0, 0.45), 0 8px 24px rgba(0, 0, 0, 0.24), inset 0 1px 0 ${paletteTokens.surfaceTonal}`
                      : `0 16px 40px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(0, 0, 0, 0.14)`,
                transition: 'border-color 0.18s ease, box-shadow 0.22s ease',
                contain: 'layout style',
                display: 'flex',
                flexDirection: 'column',
                color: paletteTokens.textPrimary,
              } as React.CSSProperties
            }
          >
            {/* Isolated frosted-glass backdrop layer so ancestor has NO backdrop-filter/transform trap */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: radius,
                backgroundColor: `color-mix(in srgb, ${paletteTokens.bgElevated} ${Math.round(glassOpacity * 100)}%, transparent)`,
                backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
                WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(160%)` : undefined,
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <div
              data-osgl-window-titlebar="true"
              onPointerDown={(e) => ptr.handlePointerDownTitle(e, win)}
              onPointerMove={ptr.handlePointerMoveTitle}
              onPointerUp={ptr.finishDragTitle}
              onPointerCancel={ptr.finishDragTitle}
              onDoubleClick={() => {
                if (isFullscreen) onFullscreen(win.id);
                else onMaximize(win.id);
              }}
              style={{
                position: 'relative', zIndex: 2, height: 38, padding: '0 14px',
                borderTopLeftRadius: radius, borderTopRightRadius: radius,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                backgroundColor: isFocused
                  ? `color-mix(in srgb, ${paletteTokens.surfaceTonal} 72%, transparent)`
                  : `color-mix(in srgb, ${paletteTokens.surfaceTonal} 42%, transparent)`,
                borderBottom: `1px solid ${paletteTokens.borderSubtle}`,
                cursor: isFullscreen ? 'default' : 'grab',
                userSelect: 'none', flexShrink: 0, opacity: isFocused ? 1 : 0.85,
              }}
            >
              {windowControlsSide === 'left' && (
                <TrafficLights
                  side="left"
                  maximized={isMaximized}
                  fullscreen={isFullscreen}
                  focused={isFocused}
                  onClose={() => onClose(win.id)}
                  onMinimize={() => onMinimize(win.id)}
                  onMaximize={() => onMaximize(win.id)}
                  onFullscreen={() => onFullscreen(win.id)}
                />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1, justifyContent: windowControlsSide === 'left' ? 'flex-start' : undefined }}>
                <span
                  className="osgl-window-titlebar-icon"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, opacity: 0.92, flexShrink: 0, overflow: 'hidden' }}
                >
                  {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={16} />}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}>
                  {app.category && (
                    <>
                      <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.62, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.category}
                      </span>
                      <span style={{ fontSize: 12, opacity: 0.4, flexShrink: 0 }} aria-hidden="true">/</span>
                    </>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.label}
                  </span>
                </div>
              </div>
              {windowControlsSide !== 'left' && (
                <TrafficLights
                  side="right"
                  maximized={isMaximized}
                  fullscreen={isFullscreen}
                  focused={isFocused}
                  onClose={() => onClose(win.id)}
                  onMinimize={() => onMinimize(win.id)}
                  onMaximize={() => onMaximize(win.id)}
                  onFullscreen={() => onFullscreen(win.id)}
                />
              )}
            </div>

            <div
              className={`macosgl-scroll osgl-window-body ${isTallOrExpanded ? 'osgl-window-body--expanded' : ''}`}
              style={{
                position: 'relative', zIndex: 1, flex: 1, minHeight: 0,
                borderBottomLeftRadius: radius, borderBottomRightRadius: radius,
                display: 'flex', flexDirection: 'column',
                padding: isFullBleed ? 0 : 12,
                overflowY: isFullBleed ? 'hidden' : 'auto',
                overflowX: 'hidden',
                background: 'var(--canvas)',
                color: 'var(--text)',
              }}
            >
              {app.id === OS_THEME_STUDIO_APP_ID ? renderThemeStudio() : renderWindowContent(app.id)}
            </div>

            {!isFullscreen && !isMaximized &&
              RESIZE_HANDLE_SPECS.map((spec) => (
                <div
                  key={spec.dir}
                  data-osgl-resize={spec.dir}
                  aria-label={spec.label}
                  title={spec.dir === 'se' ? 'Pencereyi Boyutlandır' : undefined}
                  className={spec.dir === 'se' ? 'macosgl-resize-handle' : undefined}
                  onPointerDown={(e) => ptr.handlePointerDownResize(e, win, spec.dir)}
                  onPointerMove={ptr.handlePointerMoveResize}
                  onPointerUp={ptr.finishResize}
                  onPointerCancel={ptr.finishResize}
                  style={{ ...spec.style, cursor: spec.cursor, touchAction: 'none' }}
                >
                  {spec.dir === 'se' && (
                    <div
                      style={{
                        width: 8, height: 8,
                        borderRight: '2px solid currentColor',
                        borderBottom: '2px solid currentColor',
                        borderRadius: 1,
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
        );
      })}
    </>
  );
}
