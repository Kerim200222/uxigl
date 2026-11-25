import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { GoogleIcon } from '../../components/primitives';
import {
  resolveIconSurface,
  type FloatingWindowState,
  type IconBgStyle,
  type OSWorkspaceApp,
} from './types';
import { useDockMagnification } from './useDockMagnification';

export function Dock({
  dockApps,
  allApps = [],
  isDark,
  effectiveIsLightBg = false,
  glassBlur,
  windows,
  iconBgStyle,
  iconBgColor,
  iconGradColor1,
  iconGradColor2,
  iconColor,
  primaryColor,
  onOpenApp,
  onPinAppToDock,
  onReorderDock,
  onOpenDockCustomizer,
  onOpenDockItemContextMenu,
  onArrangeSideBySide,
  onArrangeGrid,
  onCloseAll,
  maxVisibleApps = 12,
}: {
  dockApps: OSWorkspaceApp[];
  allApps?: OSWorkspaceApp[];
  isDark: boolean;
  effectiveIsLightBg?: boolean;
  glassBlur: number;
  windows: FloatingWindowState[];
  iconBgStyle: IconBgStyle;
  iconBgColor: string;
  iconGradColor1: string;
  iconGradColor2: string;
  iconColor: string;
  primaryColor: string;
  onOpenApp: (id: string) => void;
  onPinAppToDock?: (appId: string) => void;
  onReorderDock?: (draggedAppId: string, targetAppId: string) => void;
  onOpenDockCustomizer?: () => void;
  onOpenDockItemContextMenu?: (e: React.MouseEvent, appId: string) => void;
  onArrangeSideBySide: () => void;
  onArrangeGrid: () => void;
  onCloseAll: () => void;
  maxVisibleApps?: number;
}) {
  const runningUnpinnedApps = allApps.filter(
    (app) => !dockApps.some((d) => d.id === app.id) && windows.some((w) => w.appId === app.id)
  );
  const maxVisible = Math.max(1, maxVisibleApps);
  const visibleDockApps = dockApps.slice(0, maxVisible);
  const remainingSlots = Math.max(0, maxVisible - visibleDockApps.length);
  const visibleRunningUnpinned = runningUnpinnedApps.slice(0, remainingSlots);
  const overflowApps = [
    ...dockApps.slice(maxVisible),
    ...runningUnpinnedApps.slice(remainingSlots),
  ];

  const mag = useDockMagnification(
    visibleDockApps.length + visibleRunningUnpinned.length + (overflowApps.length > 0 ? 1 : 0)
  );
  const [dragOverDock, setDragOverDock] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const renderDockTooltip = (label: string) => (
    <span
      role="tooltip"
      style={{
        position: 'absolute', bottom: 'calc(100% + 12px)', left: 0, right: 0,
        display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 20,
      }}
    >
      <span
        style={{
          padding: '5px 10px', borderRadius: 8,
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
          color: isDark ? '#f8fafc' : '#0f172a',
          backdropFilter: glassBlur > 0 ? 'blur(16px) saturate(160%)' : undefined,
          WebkitBackdropFilter: glassBlur > 0 ? 'blur(16px) saturate(160%)' : undefined,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.14)' : '1px solid rgba(15, 23, 42, 0.10)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
          fontSize: 12, fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </span>
  );

  const hasOpenWindows = windows.some((w) => !w.minimized);
  const utilityActions: Array<{
    id: string; label: string; googleIcon: string; iconNode?: React.ReactNode; danger: boolean; onClick: () => void;
  }> = [
    ...(onOpenDockCustomizer
      ? [{ id: 'dock-customize', label: 'Dock Simgelerini Özelleştir', googleIcon: 'add', iconNode: <Plus size={19} />, danger: false, onClick: onOpenDockCustomizer }]
      : []),
    { id: 'dock-side-by-side', label: 'Pencereleri Yan Yana Diz', googleIcon: 'vertical_split', danger: false, onClick: onArrangeSideBySide },
    { id: 'dock-arrange-grid', label: 'Pencereleri Izgara Diz', googleIcon: 'grid_view', danger: false, onClick: onArrangeGrid },
    ...(hasOpenWindows
      ? [{ id: 'dock-close-all', label: 'Tüm Pencereleri Kapat', googleIcon: 'close', danger: true, onClick: onCloseAll }]
      : []),
  ];

  const useDarkDockGlass = isDark || !effectiveIsLightBg;

  return (
    <div
      data-macos-dock="true"
      onMouseEnter={mag.handleMouseEnter}
      onMouseMove={mag.handleMouseMove}
      onMouseLeave={mag.handleMouseLeave}
      onDragOver={(e) => {
        e.preventDefault();
        if (!dragOverDock) setDragOverDock(true);
      }}
      onDragLeave={() => setDragOverDock(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOverDock(false);
        const draggedId = e.dataTransfer?.getData('text/osgl-app-id');
        if (draggedId && onPinAppToDock) onPinAppToDock(draggedId);
      }}
      style={{
        position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)',
        padding: '9px 13px', borderRadius: 22,
        backgroundColor: useDarkDockGlass ? 'rgba(15, 23, 42, 0.56)' : 'rgba(255, 255, 255, 0.68)',
        backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(165%)` : undefined,
        WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(165%)` : undefined,
        border: dragOverDock
          ? `1.5px dashed ${primaryColor}`
          : useDarkDockGlass
            ? '1px solid rgba(255, 255, 255, 0.18)'
            : '1px solid rgba(255, 255, 255, 0.72)',
        boxShadow: useDarkDockGlass
          ? '0 22px 54px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
          : '0 20px 50px rgba(15, 23, 42, 0.22)',
        display: 'flex', alignItems: 'flex-end', gap: 9, zIndex: 1950,
      }}
    >
      {visibleDockApps.map((app, idx) => {
        const isRunning = windows.some((w) => w.appId === app.id);
        const dockSurf = resolveIconSurface(
          app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
        );
        return (
          <button
            key={app.id}
            ref={(el) => { mag.dockItemRefs.current[idx] = el; }}
            type="button"
            draggable
            aria-label={app.label}
            onDragStart={(e) => e.dataTransfer?.setData('text/osgl-app-id', app.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragOverDock(false);
              const draggedId = e.dataTransfer?.getData('text/osgl-app-id');
              if (draggedId && onReorderDock) onReorderDock(draggedId, app.id);
            }}
            onContextMenu={(e) => {
              if (!onOpenDockItemContextMenu) return;
              e.preventDefault();
              e.stopPropagation();
              onOpenDockItemContextMenu(e, app.id);
            }}
            onMouseEnter={() => mag.setHoveredIdx(idx)}
            onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
            onFocus={() => mag.setHoveredIdx(idx)}
            onBlur={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
            onClick={() => onOpenApp(app.id)}
            style={{
              position: 'relative', width: 46, height: 46, padding: 0, borderRadius: 13,
              border: dockSurf.border ?? 'none', background: dockSurf.background,
              backdropFilter: dockSurf.backdropFilter,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: dockSurf.color,
              boxShadow: '0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
              transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
              flexShrink: 0,
            }}
          >
            {mag.hoveredIdx === idx && renderDockTooltip(app.label)}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
              {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={27} />}
            </span>
            {isRunning && (
              <span
                style={{
                  position: 'absolute', bottom: -7, width: 4.5, height: 4.5, borderRadius: 999,
                  backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
                }}
              />
            )}
          </button>
        );
      })}

      {visibleRunningUnpinned.length > 0 && (
        <>
          <div
            style={{
              width: 1, height: 28, alignSelf: 'center', margin: '0 2px',
              backgroundColor: useDarkDockGlass ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.16)',
            }}
          />
          {visibleRunningUnpinned.map((app, offset) => {
            const idx = visibleDockApps.length + offset;
            const dockSurf = resolveIconSurface(
              app, iconBgStyle, primaryColor, isDark, iconColor, iconBgColor, iconGradColor1, iconGradColor2
            );
            return (
              <button
                key={`running-${app.id}`}
                ref={(el) => { mag.dockItemRefs.current[idx] = el; }}
                type="button"
                aria-label={`${app.label} (Açık — sağ tıkla sabitle)`}
                onContextMenu={(e) => {
                  if (!onOpenDockItemContextMenu) return;
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenDockItemContextMenu(e, app.id);
                }}
                onMouseEnter={() => mag.setHoveredIdx(idx)}
                onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
                onFocus={() => mag.setHoveredIdx(idx)}
                onBlur={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
                onClick={() => onOpenApp(app.id)}
                style={{
                  position: 'relative', width: 46, height: 46, padding: 0, borderRadius: 13,
                  border: dockSurf.border ?? 'none', background: dockSurf.background,
                  backdropFilter: dockSurf.backdropFilter,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: dockSurf.color,
                  boxShadow: '0 8px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.4)',
                  transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
                  flexShrink: 0,
                }}
              >
                {mag.hoveredIdx === idx && renderDockTooltip(`${app.label} · Açık`)}
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
                  {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={27} />}
                </span>
                <span
                  style={{
                    position: 'absolute', bottom: -7, width: 4.5, height: 4.5, borderRadius: 999,
                    backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.45)',
                  }}
                />
              </button>
            );
          })}
        </>
      )}

      {overflowApps.length > 0 && (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button
            ref={(el) => { mag.dockItemRefs.current[visibleDockApps.length + visibleRunningUnpinned.length] = el; }}
            type="button"
            aria-label={`Diğer ${overflowApps.length} uygulama`}
            onMouseEnter={() => mag.setHoveredIdx(visibleDockApps.length + visibleRunningUnpinned.length)}
            onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === visibleDockApps.length + visibleRunningUnpinned.length ? null : prev))}
            onClick={() => setOverflowOpen((v) => !v)}
            style={{
              position: 'relative', width: 46, height: 46, padding: 0, borderRadius: 13,
              border: useDarkDockGlass ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(15, 23, 42, 0.16)',
              background: useDarkDockGlass ? 'rgba(255, 255, 255, 0.14)' : 'rgba(15, 23, 42, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: useDarkDockGlass ? '#f8fafc' : '#0f172a',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
              boxShadow: '0 8px 18px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25)',
              transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
            }}
          >
            {mag.hoveredIdx === visibleDockApps.length + visibleRunningUnpinned.length &&
              renderDockTooltip(`+${overflowApps.length} Açık Uygulama`)}
            +{overflowApps.length}
          </button>
          {overflowOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 14px)',
                right: 0,
                width: 240,
                maxHeight: 320,
                overflowY: 'auto',
                padding: 8,
                borderRadius: 14,
                backgroundColor: useDarkDockGlass ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(165%)` : undefined,
                WebkitBackdropFilter: glassBlur > 0 ? `blur(${glassBlur}px) saturate(165%)` : undefined,
                border: useDarkDockGlass ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(15, 23, 42, 0.12)',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.36)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                zIndex: 2100,
              }}
            >
              {overflowApps.map((app) => (
                <button
                  key={`overflow-${app.id}`}
                  type="button"
                  onClick={() => {
                    onOpenApp(app.id);
                    setOverflowOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 8px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: useDarkDockGlass ? '#f8fafc' : '#0f172a',
                    fontSize: 12,
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {app.iconNode ?? <GoogleIcon name={app.googleIcon} size={16} />}
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          width: 1, height: 28, alignSelf: 'center', margin: '0 2px',
          backgroundColor: useDarkDockGlass ? 'rgba(255,255,255,0.20)' : 'rgba(15,23,42,0.16)',
        }}
      />

      {utilityActions.map((action, offsetIdx) => {
        const idx = visibleDockApps.length + visibleRunningUnpinned.length + (overflowApps.length > 0 ? 1 : 0) + offsetIdx;
        return (
          <button
            key={action.id}
            ref={(el) => { mag.dockItemRefs.current[idx] = el; }}
            type="button"
            aria-label={action.label}
            onMouseEnter={() => mag.setHoveredIdx(idx)}
            onMouseLeave={() => mag.setHoveredIdx((prev) => (prev === idx ? null : prev))}
            onClick={action.onClick}
            style={{
              position: 'relative', width: 40, height: 40, padding: 0, borderRadius: 11,
              border: useDarkDockGlass ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(15, 23, 42, 0.14)',
              background: action.danger ? 'rgba(239, 68, 68, 0.22)' : useDarkDockGlass ? 'rgba(255, 255, 255, 0.11)' : 'rgba(15, 23, 42, 0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: action.danger ? '#fca5a5' : useDarkDockGlass ? '#f8fafc' : '#0f172a',
              transition: 'width 0.1s ease-out, height 0.1s ease-out, border-radius 0.1s ease-out',
              flexShrink: 0,
            }}
          >
            {mag.hoveredIdx === idx && renderDockTooltip(action.label)}
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s ease-out', pointerEvents: 'none' }}>
              {action.iconNode ?? <GoogleIcon name={action.googleIcon} size={20} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
