import { osWasmEngine } from './osglEngine';
import {
  CURRENT_WINDOW_MAX_VERSION,
  OS_THEME_STUDIO_APP_ID,
  type FloatingWindowState,
  type OSWorkspaceApp,
  type WindowArrangeMode,
  type WindowBounds,
} from './types';
import {
  clampWindowToViewport,
  computeSnapBounds,
  DESKTOP_DOCK_RESERVE,
  DESKTOP_TOP_BAR_H,
  type SnapZone,
} from './windowGeometry';

export const MAX_OPEN_WINDOWS = 8;

export function sanitizePersistedWindows(params: {
  rawWindows?: FloatingWindowState[];
  allowedIds: Set<string>;
  winMaxVer?: number;
  vw: number;
  vh: number;
}): FloatingWindowState[] {
  const { rawWindows, allowedIds, winMaxVer, vw, vh } = params;
  if (!rawWindows || rawWindows.length === 0) return [];
  const upgradeMaximized = (winMaxVer ?? 0) < CURRENT_WINDOW_MAX_VERSION;
  return rawWindows
    .filter((w) => allowedIds.has(w.appId))
    .slice(-MAX_OPEN_WINDOWS)
    .map((w) => {
      const next =
        upgradeMaximized && w.appId !== OS_THEME_STUDIO_APP_ID && !w.maximized
          ? {
              ...w,
              maximized: true,
              restoreBounds: w.restoreBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height },
            }
          : w;
      return clampWindowToViewport(next, vw, vh);
    });
}

export function buildOpenedWindowList(params: {
  prev: FloatingWindowState[];
  appId: string;
  apps: OSWorkspaceApp[];
  windowBoundsByApp: Record<string, WindowBounds>;
  nextZ: number;
  vw: number;
  vh: number;
}): FloatingWindowState[] {
  const existing = params.prev.find((w) => w.appId === params.appId);
  if (existing) {
    return params.prev.map((w) =>
      w.id === existing.id ? { ...w, minimized: false, zIndex: params.nextZ } : w
    );
  }

  const appMeta = params.apps.find((a) => a.id === params.appId);
  const savedBounds = params.windowBoundsByApp[params.appId];
  const offset = (params.prev.length % 5) * 26;
  const isStudio = params.appId === OS_THEME_STUDIO_APP_ID;
  const defaultW = isStudio
    ? 820
    : appMeta?.defaultSize?.width ?? Math.min(1120, Math.round(params.vw * 0.76));
  const defaultH = isStudio
    ? 600
    : appMeta?.defaultSize?.height ??
      Math.min(700, Math.round((params.vh - DESKTOP_TOP_BAR_H) * 0.8));

  const initialBounds: WindowBounds = {
    x: savedBounds?.x ?? Math.max(24, Math.round((params.vw - defaultW) / 2) + offset - 26),
    y: savedBounds?.y ?? 16 + offset,
    width: isStudio ? Math.max(760, savedBounds?.width ?? defaultW) : (savedBounds?.width ?? defaultW),
    height: isStudio ? Math.max(540, savedBounds?.height ?? defaultH) : (savedBounds?.height ?? defaultH),
  };

  const startMaximized = appMeta?.defaultMaximized ?? !isStudio;
  const newWin = clampWindowToViewport(
    {
      id: `win-${params.appId}-${Date.now()}`,
      appId: params.appId,
      ...initialBounds,
      zIndex: params.nextZ,
      minimized: false,
      maximized: startMaximized,
      fullscreen: false,
      restoreBounds: startMaximized ? initialBounds : undefined,
    },
    params.vw,
    params.vh
  );
  let baseList = params.prev;
  if (baseList.length >= MAX_OPEN_WINDOWS) {
    // Evict the oldest/lowest-priority background window (minimized first, then lowest zIndex)
    const sorted = [...baseList].sort((a, b) => {
      if (a.minimized !== b.minimized) return a.minimized ? -1 : 1;
      return a.zIndex - b.zIndex;
    });
    const evictCount = baseList.length - MAX_OPEN_WINDOWS + 1;
    const evictIds = new Set(sorted.slice(0, evictCount).map((w) => w.id));
    baseList = baseList.filter((w) => !evictIds.has(w.id));
  }
  return [...baseList, newWin];
}

export function buildSideBySideWindowList(params: {
  prev: FloatingWindowState[];
  leftAppId: string;
  rightAppId: string;
  z1: number;
  vw: number;
  vh: number;
  dockVisible: boolean;
}): FloatingWindowState[] {
  const dockReserve = params.dockVisible ? DESKTOP_DOCK_RESERVE : 16;
  const rects = osWasmEngine.computeArrangeRects(
    2,
    'side-by-side',
    Math.max(640, params.vw - 32),
    Math.max(380, params.vh - DESKTOP_TOP_BAR_H - dockReserve - 12)
  );
  const others = params.prev.filter(
    (w) => w.appId !== params.leftAppId && w.appId !== params.rightAppId
  );
  const leftExisting = params.prev.find((w) => w.appId === params.leftAppId);
  const rightExisting = params.prev.find((w) => w.appId === params.rightAppId);
  const wLeft: FloatingWindowState = {
    id: leftExisting?.id ?? `win-${params.leftAppId}-${Date.now()}-L`,
    appId: params.leftAppId,
    ...(rects[0] ?? { x: 16, y: 12, width: 620, height: 560 }),
    zIndex: params.z1,
    minimized: false,
    maximized: false,
    fullscreen: false,
    restoreBounds: undefined,
  };
  const wRight: FloatingWindowState = {
    id: rightExisting?.id ?? `win-${params.rightAppId}-${Date.now()}-R`,
    appId: params.rightAppId,
    ...(rects[1] ?? { x: 650, y: 12, width: 620, height: 560 }),
    zIndex: params.z1 + 1,
    minimized: false,
    maximized: false,
    fullscreen: false,
    restoreBounds: undefined,
  };
  return [...others, wLeft, wRight];
}

export function applyToggleMaximize(
  prev: FloatingWindowState[],
  winId: string,
  nextZ: number
): FloatingWindowState[] {
  return prev.map((w) => {
    if (w.id !== winId) return w;
    const saved: WindowBounds = w.restoreBounds ?? {
      x: w.x,
      y: w.y,
      width: w.width,
      height: w.height,
    };
    if (w.maximized) {
      return {
        ...w,
        ...saved,
        maximized: false,
        fullscreen: false,
        restoreBounds: undefined,
        zIndex: nextZ,
      };
    }
    return {
      ...w,
      maximized: true,
      fullscreen: false,
      minimized: false,
      restoreBounds: saved,
      zIndex: nextZ,
    };
  });
}

export function applyToggleFullscreen(
  prev: FloatingWindowState[],
  winId: string,
  nextZ: number
): FloatingWindowState[] {
  return prev.map((w) => {
    if (w.id !== winId) return w;
    if (w.fullscreen) {
      const restored = !w.maximized && w.restoreBounds ? w.restoreBounds : {};
      return {
        ...w,
        ...restored,
        fullscreen: false,
        restoreBounds: w.maximized ? w.restoreBounds : undefined,
        zIndex: nextZ,
      };
    }
    const saved: WindowBounds = w.restoreBounds ?? {
      x: w.x,
      y: w.y,
      width: w.width,
      height: w.height,
    };
    return {
      ...w,
      fullscreen: true,
      minimized: false,
      restoreBounds: saved,
      zIndex: nextZ,
    };
  });
}

export function applySnapWindow(
  prev: FloatingWindowState[],
  winId: string,
  zone: Exclude<SnapZone, null>,
  nextZ: number,
  vw: number,
  vh: number,
  dockVisible = false
): FloatingWindowState[] {
  return prev.map((w) => {
    if (w.id !== winId) return w;
    const saved: WindowBounds = w.restoreBounds ?? {
      x: w.x,
      y: w.y,
      width: w.width,
      height: w.height,
    };
    if (zone === 'maximize') {
      return {
        ...w,
        maximized: true,
        fullscreen: false,
        minimized: false,
        restoreBounds: saved,
        zIndex: nextZ,
      };
    }
    const snapped = computeSnapBounds(zone, vw, vh, dockVisible);
    return {
      ...w,
      ...snapped,
      maximized: false,
      fullscreen: false,
      minimized: false,
      restoreBounds: saved,
      zIndex: nextZ,
    };
  });
}

const QUADRANT_ZONES: ReadonlyArray<Exclude<SnapZone, null>> = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

export function applyArrangeWindows(
  prev: FloatingWindowState[],
  mode: WindowArrangeMode,
  vw: number,
  vh: number,
  dockVisible: boolean
): FloatingWindowState[] {
  const visible = prev.filter((w) => !w.minimized);
  if (visible.length === 0) return prev;
  if (mode === 'quadrants') {
    const ordered = [...visible].sort((a, b) => b.zIndex - a.zIndex);
    return prev.map((w) => {
      if (w.minimized) return w;
      const idx = ordered.findIndex((v) => v.id === w.id);
      const zone = QUADRANT_ZONES[idx % QUADRANT_ZONES.length];
      const rect = computeSnapBounds(zone, vw, vh, dockVisible);
      return { ...w, maximized: false, fullscreen: false, restoreBounds: undefined, ...rect };
    });
  }
  const dockReserve = dockVisible ? DESKTOP_DOCK_RESERVE : 16;
  const rects = osWasmEngine.computeArrangeRects(
    visible.length,
    mode,
    Math.max(620, vw - 32),
    Math.max(360, vh - DESKTOP_TOP_BAR_H - dockReserve - 12)
  );
  return prev.map((w) => {
    if (w.minimized) return w;
    const rect = rects[visible.findIndex((v) => v.id === w.id)];
    return rect
      ? { ...w, maximized: false, fullscreen: false, restoreBounds: undefined, ...rect }
      : w;
  });
}
