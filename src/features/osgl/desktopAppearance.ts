import { isLightHex } from './desktopGridUtils';
import { OS_WALLPAPERS, type OSWallpaperId } from './osglEngine';
import { reconcileIconSlotsWithNewApps } from './stateMigration';
import {
  CURRENT_ICON_ORDER_VERSION,
  type BgMode,
  type OSWorkspaceApp,
  type PersistedOSGLState,
  type QualityMode,
} from './types';

export function buildInitialSlots(appList: OSWorkspaceApp[]): Record<string, number> {
  const map: Record<string, number> = {};
  appList.forEach((app, idx) => {
    map[app.id] = idx;
  });
  return map;
}

export function resolvePersistedIconSlots(
  saved: PersistedOSGLState | null,
  appList: OSWorkspaceApp[]
): Record<string, number> {
  if (
    saved?.iconSlots &&
    Object.keys(saved.iconSlots).length > 0 &&
    (saved.iconOrderVersion ?? 0) >= CURRENT_ICON_ORDER_VERSION
  ) {
    return reconcileIconSlotsWithNewApps(saved.iconSlots, appList, saved.folders ?? []);
  }
  return buildInitialSlots(appList);
}

export function computeDesktopAppearance({
  wallpaper,
  bgMode,
  solidBgColor,
  bgGradColor1,
  bgGradColor2,
  customBgUrl,
  uploadedBgDataUrl,
  useWebGLAurora: _useWebGLAurora,
  isDark,
  glassIntensity,
  qualityMode,
}: {
  wallpaper: OSWallpaperId;
  bgMode: BgMode;
  solidBgColor: string;
  bgGradColor1: string;
  bgGradColor2: string;
  customBgUrl: string;
  uploadedBgDataUrl: string;
  useWebGLAurora: boolean;
  isDark: boolean;
  glassIntensity: number;
  qualityMode: QualityMode;
}) {
  const wp = OS_WALLPAPERS[wallpaper] ?? OS_WALLPAPERS['dijios-oxford'];
  const activeImageSrc = uploadedBgDataUrl || customBgUrl.trim();
  const effectiveIsLightBg =
    bgMode === 'solid'
      ? isLightHex(solidBgColor)
      : bgMode === 'gradient'
        ? isLightHex(bgGradColor1) && isLightHex(bgGradColor2)
        : bgMode === 'aurora'
          ? wp.isLight && !isDark
          : false;

  const desktopBackground =
    bgMode === 'solid'
      ? solidBgColor
      : bgMode === 'gradient'
        ? `linear-gradient(135deg, ${bgGradColor1} 0%, ${bgGradColor2} 100%)`
        : bgMode === 'image' && activeImageSrc
          ? `url("${activeImageSrc}") center / cover no-repeat`
          : isDark
            ? 'linear-gradient(160deg, #050811 0%, #0b1222 55%, #111827 100%)'
            : wp.fallbackCss;

  const barTextColor = effectiveIsLightBg ? '#0f172a' : '#f8fafc';
  const glassFactor = glassIntensity / 100;
  const glassOpacity =
    qualityMode === 'performance'
      ? 0.96
      : Math.max(0.72, Math.min(0.98, 0.72 + glassFactor * 0.25));
  const glassBlur =
    qualityMode === 'performance' ? 0 : Math.min(20, Math.round(10 + glassFactor * 10));

  const chromeBarBg = isDark
    ? `rgba(10, 15, 28, ${(0.38 + glassFactor * 0.36).toFixed(2)})`
    : `rgba(255, 255, 255, ${(0.34 + glassFactor * 0.36).toFixed(2)})`;
  const chromeText = isDark ? '#f8fafc' : '#0f172a';
  const chromeBorder = isDark
    ? '1px solid rgba(255, 255, 255, 0.14)'
    : '1px solid rgba(255, 255, 255, 0.56)';
  const chromePillBg = isDark
    ? `rgba(15, 23, 42, ${(0.42 + glassFactor * 0.32).toFixed(2)})`
    : `rgba(255, 255, 255, ${(0.46 + glassFactor * 0.32).toFixed(2)})`;

  return {
    effectiveIsLightBg,
    desktopBackground,
    barTextColor,
    glassOpacity,
    glassBlur,
    chromeBarBg,
    chromeText,
    chromeBorder,
    chromePillBg,
  };
}
