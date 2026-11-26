import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { useToast } from '../../providers/ToastProvider';
import {
  computeDesktopAppearance,
  resolvePersistedIconSlots,
} from './desktopAppearance';
import { buildResetDesktopSlots } from './desktopGridUtils';
import { OS_WALLPAPERS, startOSWebGLWallpaper, type OSWallpaperId } from './osglEngine';
import {
  computeDefaultWidgetPositions,
  CURRENT_ICON_ORDER_VERSION,
  CURRENT_WINDOW_MAX_VERSION,
  loadOSGLState,
  OS_THEME_STUDIO_APP_ID,
  saveOSGLState,
  type BgMode,
  type DesktopFolder,
  type IconBgStyle,
  type OSDesktopWidgetDefinition,
  type OSWorkspaceApp,
  type QualityMode,
  type WidgetPosition,
  type WidgetSize,
  type WidgetUserPrefs,
  type WindowControlsSide,
} from './types';
import { useFoldersAndDockState } from './useFoldersAndDockState';
import { useWindowManager } from './useWindowManager';
import {
  reconcilePersistedOSGLState,
  reconcileWidgetsOnUpgrade,
} from './stateMigration';

export { computeDesktopAppearance };

function readImageFileAsDataUrl(file: File, maxDim: number, preferPng = false): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.onload = () => {
      const rawUrl = String(reader.result || '');
      if (file.type === 'image/svg+xml' || !rawUrl.startsWith('data:image/')) {
        resolve(rawUrl);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(rawUrl);
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const mime = preferPng || file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, 0.88));
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function useDesktopState({
  apps,
  dockAppIds,
  defaultFolders,
  widgets,
  scopeKey,
  initialWallpaper = 'dijios-oxford',
  defaultOpenAppIds,
}: {
  apps: OSWorkspaceApp[];
  dockAppIds?: string[];
  defaultFolders?: DesktopFolder[];
  widgets: OSDesktopWidgetDefinition[];
  scopeKey?: string;
  initialWallpaper?: OSWallpaperId;
  defaultOpenAppIds?: string[];
}) {
  const theme = useTheme();
  const isDark = theme.resolvedMode === 'dark';
  const paletteTokens = isDark ? theme.activePalette.dark : theme.activePalette.light;
  const { notify } = useToast();

  const savedState = useMemo(() => reconcilePersistedOSGLState(loadOSGLState(scopeKey)), [scopeKey]);

  const allApps = useMemo<OSWorkspaceApp[]>(() => {
    if (apps.some((a) => a.id === OS_THEME_STUDIO_APP_ID)) return apps;
    return [
      ...apps,
      {
        id: OS_THEME_STUDIO_APP_ID,
        label: 'OS Tema Stüdyosu',
        shortLabel: 'Tema',
        googleIcon: 'palette',
        category: 'Sistem',
        gradient: 'linear-gradient(135deg, #d946ef, #7c3aed)',
        description: 'Arayüz görünümü, duvar kağıdı, simge ve pencere ayarları',
      },
    ];
  }, [apps]);

  const [locale, setLocale] = useState<'tr' | 'en'>(savedState?.locale ?? 'tr');
  const [wallpaper, setWallpaper] = useState<OSWallpaperId>(savedState?.wallpaper ?? initialWallpaper);
  const [bgMode, setBgMode] = useState<BgMode>(savedState?.bgMode ?? 'aurora');
  const [solidBgColor, setSolidBgColor] = useState<string>(savedState?.solidBgColor ?? '#0f172a');
  const [bgGradColor1, setBgGradColor1] = useState<string>(savedState?.bgGradColor1 ?? '#002147');
  const [bgGradColor2, setBgGradColor2] = useState<string>(savedState?.bgGradColor2 ?? '#457b9d');
  const [customBgUrl, setCustomBgUrl] = useState(savedState?.customBgUrl ?? '');
  const [uploadedBgDataUrl, setUploadedBgDataUrl] = useState<string>(savedState?.uploadedBgDataUrl ?? '');
  const [customAppIcons, setCustomAppIcons] = useState<Record<string, string>>(savedState?.customAppIcons ?? {});
  const [qualityMode, setQualityMode] = useState<QualityMode>(savedState?.qualityMode ?? 'quality');
  const [dockVisible, setDockVisible] = useState<boolean>(savedState?.dockVisible ?? true);
  const [widgetsVisible, setWidgetsVisible] = useState<boolean>(savedState?.widgetsVisible ?? true);

  const buildDefaultEnabledWidgets = () => {
    const map: Record<string, boolean> = {};
    widgets.forEach((w) => { map[w.id] = w.defaultEnabled !== false; });
    return map;
  };
  const buildDefaultWidgetSizes = () => {
    const map: Record<string, WidgetSize> = {};
    widgets.forEach((w) => { map[w.id] = w.defaultSize; });
    return map;
  };
  const mergeWidgetSizes = (persisted?: Record<string, WidgetSize>) => {
    const base = buildDefaultWidgetSizes();
    if (!persisted) return base;
    for (const w of widgets) {
      const s = persisted[w.id];
      if (s) base[w.id] = s;
    }
    return base;
  };

  const [enabledWidgets, setEnabledWidgets] = useState<Record<string, boolean>>(() => ({
    ...buildDefaultEnabledWidgets(), ...(savedState?.enabledWidgets ?? {}),
  }));
  const [widgetPositions, setWidgetPositions] = useState<Record<string, WidgetPosition>>(() => ({
    ...computeDefaultWidgetPositions(widgets, typeof window !== 'undefined' ? window.innerWidth : 1366),
    ...(savedState?.widgetPositions ?? {}),
  }));
  const [widgetSizes, setWidgetSizes] = useState<Record<string, WidgetSize>>(() =>
    mergeWidgetSizes(savedState?.widgetSizes)
  );
  const [widgetUserPrefs, setWidgetUserPrefs] = useState<Record<string, WidgetUserPrefs>>(
    () => savedState?.widgetUserPrefs ?? {}
  );

  const [windowAnimation, setWindowAnimation] = useState<boolean>(savedState?.windowAnimation ?? true);
  const [windowControlsSide, setWindowControlsSide] = useState<WindowControlsSide>(
    savedState?.windowControlsSide ?? 'right'
  );
  const [iconBgStyle, setIconBgStyle] = useState<IconBgStyle>(savedState?.iconBgStyle ?? 'vivid');
  const [iconBgColor, setIconBgColor] = useState<string>(savedState?.iconBgColor ?? '');
  const [iconGradColor1, setIconGradColor1] = useState<string>(savedState?.iconGradColor1 ?? '#0284c7');
  const [iconGradColor2, setIconGradColor2] = useState<string>(savedState?.iconGradColor2 ?? '#4f46e5');
  const [iconColor, setIconColor] = useState<string>(savedState?.iconColor ?? '');
  const [iconSizePx, setIconSizePx] = useState<number>(savedState?.iconSizePx ?? 60);
  const [iconSlots, setIconSlots] = useState<Record<string, number>>(() =>
    resolvePersistedIconSlots(savedState, allApps)
  );

  const foldersAndDock = useFoldersAndDockState({
    desktopApps: apps,
    defaultDockAppIds: dockAppIds,
    defaultFolders,
    savedState,
    scopeKey,
    iconSlots,
    setIconSlots,
    notify,
  });

  const prevScopeRef = useRef(scopeKey);
  useEffect(() => {
    if (prevScopeRef.current === scopeKey) return;
    prevScopeRef.current = scopeKey;
    const nextSaved = loadOSGLState(scopeKey);
    setWallpaper(nextSaved?.wallpaper ?? initialWallpaper);
    setBgMode(nextSaved?.bgMode ?? 'aurora');
    setDockVisible(nextSaved?.dockVisible ?? true);
    setWidgetsVisible(nextSaved?.widgetsVisible ?? true);
    setWindowControlsSide(nextSaved?.windowControlsSide ?? 'right');
    setEnabledWidgets({ ...buildDefaultEnabledWidgets(), ...(nextSaved?.enabledWidgets ?? {}) });
    setWidgetPositions({
      ...computeDefaultWidgetPositions(widgets, typeof window !== 'undefined' ? window.innerWidth : 1366),
      ...(nextSaved?.widgetPositions ?? {}),
    });
    setWidgetSizes(mergeWidgetSizes(nextSaved?.widgetSizes));
    setWidgetUserPrefs(nextSaved?.widgetUserPrefs ?? {});
    setIconSlots(resolvePersistedIconSlots(nextSaved, allApps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeKey]);

  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1366,
    h: typeof window !== 'undefined' ? window.innerHeight : 860,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'auto' | 'desktop' | 'mobile'>('auto');
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [arrangeMenuOpen, setArrangeMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [mobileOpenAppId, setMobileOpenAppId] = useState<string | null>(null);

  const showMobileLayout = previewDevice === 'mobile' || (previewDevice === 'auto' && isMobileViewport);

  const windowMgr = useWindowManager({
    apps: allApps, savedState, scopeKey, showMobileLayout, setMobileOpenAppId,
    windowAnimation, qualityMode, dockVisible, notify,
  });

  // Open defaultOpenAppIds on first visit when no persisted windows exist
  const initialOpenAppliedRef = useRef(false);
  useEffect(() => {
    if (initialOpenAppliedRef.current) return;
    initialOpenAppliedRef.current = true;
    if ((savedState?.windows?.length ?? 0) > 0) return;
    const idsToOpen = defaultOpenAppIds?.length
      ? defaultOpenAppIds
      : apps.filter((a) => a.defaultOpen).map((a) => a.id);
    idsToOpen.forEach((id) => windowMgr.openApp(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reconcile newly introduced widgets on package upgrade without overwriting user layout
  const widgetIdsKey = widgets.map((w) => w.id).join('|');
  useEffect(() => {
    const reconciled = reconcileWidgetsOnUpgrade(
      widgets,
      enabledWidgets,
      widgetPositions,
      widgetSizes,
      viewportSize.w
    );
    if (Object.keys(reconciled.enabledWidgets).length !== Object.keys(enabledWidgets).length) {
      setEnabledWidgets(reconciled.enabledWidgets);
      setWidgetPositions(reconciled.widgetPositions);
      setWidgetSizes(reconciled.widgetSizes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetIdsKey]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wallpaperRef = useRef<OSWallpaperId>(wallpaper);
  wallpaperRef.current = wallpaper;
  const isDarkRef = useRef<boolean>(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    const onGlobalClick = () => {
      setContextMenu(null);
      foldersAndDock.setItemContextMenu(null);
      setArrangeMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('click', onGlobalClick);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('click', onGlobalClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    saveOSGLState(scopeKey, {
      locale, wallpaper, bgMode, solidBgColor, bgGradColor1, bgGradColor2, customBgUrl,
      uploadedBgDataUrl, customAppIcons, qualityMode, dockVisible, widgetsVisible, enabledWidgets,
      widgetPositions, widgetSizes, widgetUserPrefs, windowAnimation, windowControlsSide, iconBgStyle, iconBgColor,
      iconGradColor1, iconGradColor2, iconColor, iconSizePx, iconSlots,
      iconOrderVersion: CURRENT_ICON_ORDER_VERSION,
      windowMaxVersion: CURRENT_WINDOW_MAX_VERSION,
      folders: foldersAndDock.folders.map(({ iconNode: _iconNode, ...rest }) => rest),
      pinnedDockAppIds: foldersAndDock.pinnedDockAppIds,
      windows: windowMgr.windows, windowBoundsByApp: windowMgr.windowBoundsByApp, topZ: windowMgr.topZ,
    });
  }, [
    scopeKey, locale, wallpaper, bgMode, solidBgColor, bgGradColor1, bgGradColor2, customBgUrl,
    uploadedBgDataUrl, customAppIcons, qualityMode, dockVisible, widgetsVisible, enabledWidgets, widgetPositions,
    widgetSizes, widgetUserPrefs, windowAnimation, windowControlsSide, iconBgStyle, iconBgColor, iconGradColor1, iconGradColor2,
    iconColor, iconSizePx, iconSlots, foldersAndDock.folders, foldersAndDock.pinnedDockAppIds,
    windowMgr.windows, windowMgr.windowBoundsByApp, windowMgr.topZ,
  ]);

  const useWebGLAurora = bgMode === 'aurora' && qualityMode === 'quality' && !theme.preferences.reducedMotion;
  const hasExpandedWindowRef = useRef(false);
  hasExpandedWindowRef.current = windowMgr.windows.some((w) => !w.minimized && (w.maximized || w.fullscreen));
  useEffect(() => {
    if (!canvasRef.current || !useWebGLAurora) return;
    return startOSWebGLWallpaper(
      canvasRef.current,
      () => OS_WALLPAPERS[wallpaperRef.current] ?? OS_WALLPAPERS['dijios-oxford'],
      () => isDarkRef.current,
      undefined,
      () => hasExpandedWindowRef.current
    );
  }, [useWebGLAurora]);

  const appearance = computeDesktopAppearance({
    wallpaper, bgMode, solidBgColor, bgGradColor1, bgGradColor2, customBgUrl,
    uploadedBgDataUrl, useWebGLAurora, isDark, glassIntensity: theme.preferences.glassIntensity, qualityMode,
  });

  const resetWidgetPositions = () => {
    setWidgetPositions(computeDefaultWidgetPositions(widgets, viewportSize.w));
    setWidgetSizes(buildDefaultWidgetSizes());
  };
  const resetIconSlots = () => {
    const nextFolders = foldersAndDock.resetFoldersToDefault();
    setIconSlots(buildResetDesktopSlots(apps, nextFolders));
  };

  const applyCustomIcon = (list: OSWorkspaceApp[]) =>
    list.map((app) =>
      customAppIcons[app.id]
        ? {
            ...app,
            iconNode: createElement('img', {
              src: customAppIcons[app.id],
              alt: app.label,
              style: { width: '76%', height: '76%', objectFit: 'contain', borderRadius: 6 },
            }),
          }
        : app
    );

  const resolvedApps = useMemo(() => applyCustomIcon(apps), [apps, customAppIcons]);
  const resolvedAllApps = useMemo(() => applyCustomIcon(allApps), [allApps, customAppIcons]);

  const dropImageFileOnDesktop = (file: File) => {
    void readImageFileAsDataUrl(file, 1920, false)
      .then((dataUrl) => {
        setUploadedBgDataUrl(dataUrl);
        setBgMode('image');
        notify({ title: 'Arka Plan Güncellendi', description: file.name, tone: 'success' });
      })
      .catch(() => {
        notify({ title: 'Yükleme Hatası', description: 'Görsel arka plan olarak yüklenemedi.', tone: 'danger' });
      });
  };

  const dropImageFileOnApp = (appId: string, file: File) => {
    void readImageFileAsDataUrl(file, 128, true)
      .then((dataUrl) => {
        setCustomAppIcons((prev) => ({ ...prev, [appId]: dataUrl }));
        const appLabel = apps.find((a) => a.id === appId)?.label || appId;
        notify({ title: 'Simge Güncellendi', description: `${appLabel} (${file.name})`, tone: 'success' });
      })
      .catch(() => {
        notify({ title: 'Yükleme Hatası', description: 'Görsel simge olarak yüklenemedi.', tone: 'danger' });
      });
  };

  return {
    desktopApps: resolvedApps, allApps: resolvedAllApps, theme, locale, setLocale, isDark, paletteTokens, canvasRef, useWebGLAurora,
    dropImageFileOnDesktop, dropImageFileOnApp, customAppIcons, setCustomAppIcons,
    ...appearance, showMobileLayout, isMobileViewport, previewDevice, setPreviewDevice, viewportSize,
    wallpaper, setWallpaper, bgMode, setBgMode, solidBgColor, setSolidBgColor, bgGradColor1, setBgGradColor1,
    bgGradColor2, setBgGradColor2, customBgUrl, setCustomBgUrl, uploadedBgDataUrl, setUploadedBgDataUrl,
    qualityMode, setQualityMode, dockVisible, setDockVisible, widgetsVisible, setWidgetsVisible,
    enabledWidgets, toggleWidgetItem: (id: string) => setEnabledWidgets((prev) => ({ ...prev, [id]: !prev[id] })),
    widgetPositions, updateWidgetPosition: (id: string, pos: WidgetPosition) => setWidgetPositions((prev) => ({ ...prev, [id]: pos })),
    widgetSizes, updateWidgetSize: (id: string, size: WidgetSize) => setWidgetSizes((prev) => ({ ...prev, [id]: size })),
    widgetUserPrefs,
    updateWidgetUserPrefs: (id: string, patch: Partial<WidgetUserPrefs>) =>
      setWidgetUserPrefs((prev) => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...patch } })),
    resetSingleWidgetPrefs: (id: string) => {
      setWidgetUserPrefs((prev) => { const n = { ...prev }; delete n[id]; return n; });
      const def = widgets.find((w) => w.id === id);
      if (def) setWidgetSizes((prev) => ({ ...prev, [id]: def.defaultSize }));
    },
    resetWidgetPositions, windowAnimation, setWindowAnimation, windowControlsSide, setWindowControlsSide, iconBgStyle, setIconBgStyle,
    iconBgColor, setIconBgColor, iconGradColor1, setIconGradColor1, iconGradColor2, setIconGradColor2,
    iconColor, setIconColor, iconSizePx, setIconSizePx, iconSlots, setIconSlots, resetIconSlots,
    selectedAppIds, setSelectedAppIds, searchQuery, setSearchQuery, arrangeMenuOpen, setArrangeMenuOpen,
    contextMenu, setContextMenu, mobileOpenAppId, setMobileOpenAppId,
    ...foldersAndDock, ...windowMgr,
  };
}
