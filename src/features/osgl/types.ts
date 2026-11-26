import type React from 'react';
import type { OSWallpaperId } from './osglEngine';
import type {
  WidgetCustomField,
  WidgetSizePreset,
  WidgetUserPrefs,
} from './widgetCustomization';

export type { WidgetCustomField, WidgetSizePreset, WidgetUserPrefs };

export type IconBgStyle = 'vivid' | 'gradient' | 'soft' | 'glass' | 'sun' | 'mono';
export type BgMode = 'aurora' | 'gradient' | 'solid' | 'image';
export type QualityMode = 'quality' | 'performance';
export type WindowArrangeMode = 'cascade' | 'grid' | 'side-by-side' | 'quadrants';
export type WindowControlsSide = 'right' | 'left';

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OSWorkspaceApp {
  id: string;
  label: string;
  shortLabel: string;
  /** Google Material Symbol icon name (e.g. 'receipt_long', 'payments') */
  googleIcon: string;
  /** Optional custom React icon node if host prefers Lucide/custom SVG */
  iconNode?: React.ReactNode;
  /** Optional compact action buttons rendered on the window titlebar next to window controls */
  headerActions?: React.ReactNode;
  badge?: string;
  category: string;
  gradient: string;
  description?: string;
  fullBleed?: boolean;
  defaultSize?: { width: number; height: number };
  defaultMaximized?: boolean;
  /** Optional declarative React node rendered inside the window when renderWindowContent is omitted */
  element?: React.ReactNode;
  /** Optional lazy render callback for the window content */
  render?: () => React.ReactNode;
  /** Automatically opens this module window on first visit when no persisted windows exist */
  defaultOpen?: boolean;
}

export interface FloatingWindowState {
  id: string;
  appId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  fullscreen?: boolean;
  restoreBounds?: WindowBounds;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface WidgetRenderContext {
  cardStyle: React.CSSProperties;
  subtleBorder: string;
  subtleBg: string;
  primaryColor: string;
  isDark: boolean;
  locale: 'tr' | 'en';
  width: number;
  height: number;
  scale: number;
  customPrefs?: WidgetUserPrefs;
  getOption?: (key: string, fallback: string) => string;
  openApp: (appId: string) => void;
  openSideBySide: (leftAppId: string, rightAppId: string) => void;
}

export interface OSDesktopWidgetDefinition {
  id: string;
  labelTr: string;
  labelEn?: string;
  defaultEnabled?: boolean;
  defaultSize: WidgetSize;
  sizePresets?: ReadonlyArray<WidgetSizePreset>;
  customFields?: ReadonlyArray<WidgetCustomField>;
  render: (ctx: WidgetRenderContext) => React.ReactNode;
}

export const WIDGET_GRID_STEP = 20;
export const WIDGET_MIN_WIDTH = 220;
export const WIDGET_MAX_WIDTH = 560;
export const WIDGET_MIN_HEIGHT = 96;
export const WIDGET_MAX_HEIGHT = 540;

export const OS_THEME_STUDIO_APP_ID = 'os-theme-studio';
export const CURRENT_ICON_ORDER_VERSION = 3;
export const CURRENT_WINDOW_MAX_VERSION = 2;
export const FOLDER_SLOT_PREFIX = 'folder:';

export interface DesktopFolder {
  id: string;
  name: string;
  appIds: string[];
  color?: string;
  iconNode?: React.ReactNode;
}

export interface PersistedOSGLState {
  locale?: 'tr' | 'en';
  wallpaper?: OSWallpaperId;
  bgMode?: BgMode;
  solidBgColor?: string;
  bgGradColor1?: string;
  bgGradColor2?: string;
  customBgUrl?: string;
  uploadedBgDataUrl?: string;
  customAppIcons?: Record<string, string>;
  qualityMode?: QualityMode;
  dockVisible?: boolean;
  widgetsVisible?: boolean;
  enabledWidgets?: Record<string, boolean>;
  widgetPositions?: Record<string, WidgetPosition>;
  widgetSizes?: Record<string, WidgetSize>;
  widgetUserPrefs?: Record<string, WidgetUserPrefs>;
  windowAnimation?: boolean;
  windowControlsSide?: WindowControlsSide;
  iconBgStyle?: IconBgStyle;
  iconBgColor?: string;
  iconGradColor1?: string;
  iconGradColor2?: string;
  iconColor?: string;
  iconSizePx?: number;
  iconSlots?: Record<string, number>;
  iconOrderVersion?: number;
  windowMaxVersion?: number;
  folders?: DesktopFolder[];
  pinnedDockAppIds?: string[];
  windows?: FloatingWindowState[];
  windowBoundsByApp?: Record<string, WindowBounds>;
  topZ?: number;
}

export function buildScopedOSGLKey(scopeKey?: string): string {
  const clean = (scopeKey || 'default').trim().replace(/[^a-zA-Z0-9._:-]/g, '_');
  return `uxu.osgl.state.v4.${clean}`;
}

export function loadOSGLState(scopeKey?: string): PersistedOSGLState | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(buildScopedOSGLKey(scopeKey));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedOSGLState;
  } catch {
    return null;
  }
}

export function saveOSGLState(scopeKey: string | undefined, payload: PersistedOSGLState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(buildScopedOSGLKey(scopeKey), JSON.stringify(payload));
  } catch {
    // ignore storage quota errors
  }
}

export function buildScopedOSGLWidgetKey(widgetKey: string, scopeKey?: string): string {
  const cleanScope = (scopeKey || 'default').trim().replace(/[^a-zA-Z0-9._:-]/g, '_');
  const cleanWidget = widgetKey.trim().replace(/[^a-zA-Z0-9._:-]/g, '_');
  return `uxu.osgl.widget.v2.${cleanScope}.${cleanWidget}`;
}

export function loadOSGLWidgetData<T>(widgetKey: string, fallback: T, scopeKey?: string): T {
  if (typeof window === 'undefined' || !window.localStorage) return fallback;
  try {
    const raw = window.localStorage.getItem(buildScopedOSGLWidgetKey(widgetKey, scopeKey));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveOSGLWidgetData<T>(widgetKey: string, value: T, scopeKey?: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(
      buildScopedOSGLWidgetKey(widgetKey, scopeKey),
      JSON.stringify(value)
    );
  } catch {
    // ignore storage quota errors
  }
}

export function computeDefaultWidgetPositions(
  widgets: OSDesktopWidgetDefinition[],
  viewportWidth = 1366
): Record<string, WidgetPosition> {
  const result: Record<string, WidgetPosition> = {};
  const maxRightW = Math.max(300, ...widgets.filter((_, i) => i % 2 === 0).map((w) => w.defaultSize.width));
  const maxLeftW = Math.max(300, ...widgets.filter((_, i) => i % 2 === 1).map((w) => w.defaultSize.width));
  const colRight = Math.max(
    20,
    Math.floor((viewportWidth - maxRightW - 24) / WIDGET_GRID_STEP) * WIDGET_GRID_STEP
  );
  const colLeft = Math.max(20, colRight - maxLeftW - 16);
  const twoColumns = viewportWidth >= 1220 && widgets.length > 2;

  let rightY = 16;
  let leftY = 16;
  widgets.forEach((w, idx) => {
    const useRight = !twoColumns || idx % 2 === 0;
    if (useRight) {
      result[w.id] = { x: colRight, y: rightY };
      rightY += w.defaultSize.height + 16;
    } else {
      result[w.id] = { x: colLeft, y: leftY };
      leftY += w.defaultSize.height + 16;
    }
  });
  return result;
}

export function resolveIconSurface(
  app: OSWorkspaceApp,
  style: IconBgStyle,
  primaryColor: string,
  isDark: boolean,
  customIconColor?: string,
  customBgColor?: string,
  gradColor1?: string,
  gradColor2?: string
): { background: string; color: string; border?: string; backdropFilter?: string } {
  const override = customIconColor?.trim() || undefined;
  const monoBg = customBgColor?.trim() || primaryColor;
  const g1 = gradColor1?.trim() || '#3b82f6';
  const g2 = gradColor2?.trim() || '#ec4899';

  switch (style) {
    case 'gradient':
      return {
        background: `linear-gradient(135deg, ${g1}, ${g2})`,
        color: override ?? '#ffffff',
      };
    case 'soft':
      return {
        background: `color-mix(in srgb, ${monoBg} 18%, ${isDark ? '#1e293b' : '#ffffff'})`,
        color: override ?? (isDark ? '#f8fafc' : monoBg),
        border: `1px solid color-mix(in srgb, ${monoBg} 32%, transparent)`,
      };
    case 'glass':
      return {
        background: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.48)',
        color: override ?? (isDark ? '#ffffff' : '#0f172a'),
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.28)'
          : '1px solid rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(14px) saturate(160%)',
      };
    case 'sun':
      return {
        background:
          'linear-gradient(135deg, rgba(251, 191, 36, 0.92), rgba(249, 115, 22, 0.9), rgba(244, 63, 94, 0.88))',
        color: override ?? '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.36)',
      };
    case 'mono':
      return {
        background: monoBg,
        color: override ?? '#ffffff',
      };
    case 'vivid':
    default:
      return {
        background: app.gradient,
        color: override ?? '#ffffff',
      };
  }
}
