import { ThemeEngine as SheetGLThemeEngine, type IGridThemeTokens } from 'sheetgl';
import type {
  IThemeEngine,
  ResolvedThemeMode,
  SeedPaletteModeTokens,
  ThemePreferences,
} from '../contracts/ThemeContract';
import {
  DENSITY_SCALE_TOKENS,
  FONT_FAMILY_PRESETS,
  RADIUS_SCALE_TOKENS,
  SEED_PALETTES,
} from '../tokens/designTokens';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — CSS VARIABLE & EMBEDDED ENGINE THEME BRIDGE (SRP & DIP)
 * ============================================================================
 * [SRP] Translates abstract `ThemePreferences` into DOM CSS Custom Properties
 * (`--uxu-*`) and synchronizes embedded Canvas/WebGL engines (`SheetGL`, `FileManGL`).
 * [DIP] Implements `IThemeEngine` contract injected into `ThemeProvider`.
 */

export function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '').trim();
  if (cleaned.length !== 6) return `rgba(41, 151, 255, ${alpha})`;
  const num = parseInt(cleaned, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function blendHexColors(baseHex: string, tintHex: string, tintWeight: number): string {
  const cleanA = baseHex.replace('#', '').trim();
  const cleanB = tintHex.replace('#', '').trim();
  if (cleanA.length !== 6 || cleanB.length !== 6) return baseHex;
  const numA = parseInt(cleanA, 16);
  const numB = parseInt(cleanB, 16);
  const w = Math.max(0, Math.min(1, tintWeight));
  const r = Math.round(((numA >> 16) & 255) * (1 - w) + ((numB >> 16) & 255) * w);
  const g = Math.round(((numA >> 8) & 255) * (1 - w) + ((numB >> 8) & 255) * w);
  const b = Math.round((numA & 255) * (1 - w) + (numB & 255) * w);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Resolves the effective mode tokens for a given `ThemePreferences` and `ResolvedThemeMode`.
 * If `prefs.customPrimaryHex` is provided (e.g. `#6366F1`), dynamically synthesizes a complete
 * Material You × Liquid Glass tonal surface & accent palette around that brand color.
 */
export function resolveEffectiveModeTokens(
  prefs: ThemePreferences,
  resolvedMode: ResolvedThemeMode,
): SeedPaletteModeTokens {
  const palette = SEED_PALETTES[prefs.seedPalette] ?? SEED_PALETTES['cupertino-blue'];
  const baseTokens: SeedPaletteModeTokens =
    resolvedMode === 'dark' ? palette.dark : palette.light;

  const customHex = prefs.customPrimaryHex?.trim();
  if (!customHex || !/^#[0-9A-Fa-f]{6}$/.test(customHex)) {
    return baseTokens;
  }

  const isDark = resolvedMode === 'dark';
  const primary = customHex.toUpperCase();
  const primaryHover = blendHexColors(primary, isDark ? '#FFFFFF' : '#000000', 0.16);
  const secondary = blendHexColors(primary, '#38BDF8', 0.32);

  if (isDark) {
    const bgCanvas = blendHexColors('#070A12', primary, 0.08);
    const bgElevated = blendHexColors('#0D1220', primary, 0.12);
    const surfaceTonal = blendHexColors('#131A2E', primary, 0.16);
    const surfaceTonalHigh = blendHexColors('#1B243D', primary, 0.22);
    return {
      ...baseTokens,
      primary,
      primaryHover,
      primaryContainer: hexToRgba(primary, 0.22),
      onPrimaryContainer: blendHexColors(primary, '#FFFFFF', 0.68),
      secondary,
      accentGlow: hexToRgba(primary, 0.42),
      bgCanvas,
      bgElevated,
      surfaceGlass: hexToRgba(bgElevated, 0.72),
      surfaceGlassHover: hexToRgba(surfaceTonal, 0.82),
      surfaceTonal,
      surfaceTonalHigh,
      surfaceElevated: bgElevated,
      borderSubtle: hexToRgba(primary, 0.18),
      borderStrong: hexToRgba(primary, 0.34),
    };
  }

  const bgCanvas = blendHexColors('#F8FAFC', primary, 0.05);
  const bgElevated = blendHexColors('#FFFFFF', primary, 0.02);
  const surfaceTonal = blendHexColors('#F1F5F9', primary, 0.10);
  const surfaceTonalHigh = blendHexColors('#E2E8F0', primary, 0.16);
  return {
    ...baseTokens,
    primary,
    primaryHover,
    primaryContainer: hexToRgba(primary, 0.14),
    onPrimaryContainer: blendHexColors(primary, '#0F172A', 0.55),
    secondary,
    accentGlow: hexToRgba(primary, 0.25),
    bgCanvas,
    bgElevated,
    surfaceGlass: hexToRgba(bgElevated, 0.82),
    surfaceGlassHover: hexToRgba(surfaceTonal, 0.90),
    surfaceTonal,
    surfaceTonalHigh,
    surfaceElevated: bgElevated,
    borderSubtle: hexToRgba(primary, 0.15),
    borderStrong: hexToRgba(primary, 0.28),
  };
}

/**
 * Generates a copy-ready CSS Custom Properties export snippet for the active theme.
 */
export function generateThemeCssExport(
  prefs: ThemePreferences,
  resolvedMode: ResolvedThemeMode,
): string {
  const t = resolveEffectiveModeTokens(prefs, resolvedMode);
  const px =
    typeof prefs.customRadiusPx === 'number'
      ? prefs.customRadiusPx
      : prefs.radiusScale === 'sharp'
      ? 4
      : prefs.radiusScale === 'pill'
      ? 22
      : 12;

  return `:root[data-theme="${resolvedMode}"] {
  --uxu-primary: ${t.primary};
  --uxu-primary-hover: ${t.primaryHover};
  --uxu-primary-container: ${t.primaryContainer};
  --uxu-on-primary-container: ${t.onPrimaryContainer};
  --uxu-secondary: ${t.secondary};
  --uxu-bg-canvas: ${t.bgCanvas};
  --uxu-bg-elevated: ${t.bgElevated};
  --uxu-surface-glass: ${t.surfaceGlass};
  --uxu-surface-tonal: ${t.surfaceTonal};
  --uxu-surface-tonal-high: ${t.surfaceTonalHigh};
  --uxu-border-subtle: ${t.borderSubtle};
  --uxu-border-strong: ${t.borderStrong};
  --uxu-radius-md: ${px}px;
  --uxu-font-scale: ${((prefs.fontScale ?? 100) / 100).toFixed(2)};
  --uxu-sidebar-width: ${prefs.sidebarWidth ?? 256}px;
  --uxu-sidebar-stacked-width: ${prefs.sidebarStackedWidth ?? 88}px;
}`;
}

/**
 * Builds a 100% theme-inherited `IGridThemeTokens` configuration for SheetGL
 * so that Canvas 2D surfaces (`bg`, `headerBg`, `rowNumberBg`, `groupRowBg`, `gridLine`)
 * and DOM overlays (`toolbarBg`, `popoverBg`, `inputBg`, `badgeBg`) match uxiGL's active palette.
 */
export function buildInheritedSheetGLTheme(
  prefs: ThemePreferences,
  resolvedMode: ResolvedThemeMode,
  styleVariant: 'apple' | 'google' = 'apple',
): IGridThemeTokens {
  const modeTokens: SeedPaletteModeTokens = resolveEffectiveModeTokens(
    prefs,
    resolvedMode,
  );
  const isDark = resolvedMode === 'dark';

  const fontPreset =
    FONT_FAMILY_PRESETS[prefs.fontFamilyPreset ?? 'inter-jakarta'] ??
    FONT_FAMILY_PRESETS['inter-jakarta'];

  const userFontScale = (prefs.fontScale ?? 100) / 100;
  const baseFontSize = styleVariant === 'apple' ? 13 : 12.5;
  const resolvedFontSize = Math.max(11, Math.min(16, Math.round(baseFontSize * userFontScale)));
  const resolvedHeaderFontSize = Math.max(10, Math.min(15, Math.round(11.5 * userFontScale)));

  // Distinct yet harmonious opaque hex surfaces for Canvas 2D rendering
  const canvasBg =
    styleVariant === 'apple'
      ? modeTokens.bgElevated
      : blendHexColors(modeTokens.bgElevated, modeTokens.surfaceTonal, 0.35);

  const headerBg =
    styleVariant === 'apple'
      ? modeTokens.surfaceTonal
      : modeTokens.surfaceTonalHigh;

  const rowNumberBg = blendHexColors(
    modeTokens.bgElevated,
    modeTokens.surfaceTonal,
    styleVariant === 'apple' ? 0.65 : 0.85,
  );

  const groupRowBg = blendHexColors(
    modeTokens.surfaceTonal,
    modeTokens.primary,
    isDark ? 0.14 : 0.09,
  );

  const gridLineColor = blendHexColors(
    canvasBg,
    modeTokens.primary,
    isDark ? 0.15 : 0.12,
  );

  const headerBorderColor = blendHexColors(
    headerBg,
    modeTokens.primary,
    isDark ? 0.24 : 0.18,
  );

  const blurPx = Math.max(8, Math.round((prefs.glassIntensity / 100) * 24));
  const saturation = Math.round(110 + (prefs.glassIntensity / 100) * 70);

  return {
    name: `${styleVariant}-${resolvedMode}`,
    isDark,
    fontFamily: fontPreset.sansStack,
    fontSize: resolvedFontSize,
    headerFontSize: resolvedHeaderFontSize,
    fontFeatureSettings: '"tnum"',
    canvas: {
      bg: canvasBg,
      zebraRowBg: blendHexColors(canvasBg, modeTokens.surfaceTonal, isDark ? 0.40 : 0.28),
      rowHoverBg: hexToRgba(modeTokens.primary, isDark ? 0.08 : 0.04),
      gridLine: gridLineColor,
      headerBg,
      headerText: modeTokens.textPrimary,
      headerBorder: headerBorderColor,
      cellText: modeTokens.textPrimary,
      rowNumberBg,
      rowNumberText: modeTokens.textSecondary,
      rowNumberBorder: gridLineColor,
      frozenDividerShadow: isDark
        ? 'rgba(0, 0, 0, 0.52)'
        : hexToRgba(modeTokens.primary, 0.14),
      groupRowBg,
      groupRowText: isDark ? modeTokens.onPrimaryContainer : modeTokens.textPrimary,
      groupRowBorder: headerBorderColor,
      selectionBorder: modeTokens.primary,
      selectionFill: hexToRgba(modeTokens.primary, isDark ? 0.20 : 0.12),
      fillHandleColor: modeTokens.primary,
      searchHighlight: hexToRgba(modeTokens.secondary, isDark ? 0.35 : 0.25),
      skeletonBar: modeTokens.surfaceTonalHigh,
    },
    dom: {
      toolbarBg:
        styleVariant === 'apple'
          ? modeTokens.surfaceGlass
          : modeTokens.surfaceTonal,
      toolbarBorder: modeTokens.borderSubtle,
      toolbarText: modeTokens.textPrimary,
      glassBackdrop:
        styleVariant === 'apple'
          ? `blur(${blurPx}px) saturate(${saturation}%)`
          : 'none',
      popoverBg: modeTokens.bgElevated,
      popoverBorder: modeTokens.borderStrong,
      popoverShadow: isDark
        ? `0 18px 42px rgba(0, 0, 0, 0.62), 0 0 0 1px ${hexToRgba(modeTokens.primary, 0.14)}`
        : `0 14px 34px rgba(15, 23, 42, 0.12), 0 0 0 1px ${hexToRgba(modeTokens.primary, 0.10)}`,
      popoverText: modeTokens.textPrimary,
      inputBg: modeTokens.bgCanvas,
      inputText: modeTokens.textPrimary,
      inputBorder: modeTokens.borderStrong,
      inputFocusBorder: modeTokens.primary,
      accentColor: modeTokens.primary,
      buttonHoverBg: hexToRgba(modeTokens.primary, isDark ? 0.15 : 0.09),
      badgeBg: hexToRgba(modeTokens.primary, isDark ? 0.22 : 0.14),
      badgeText: isDark ? modeTokens.onPrimaryContainer : modeTokens.primary,
    },
  };
}

export class CssVariableThemeEngine implements IThemeEngine {
  public applyTheme(prefs: ThemePreferences, resolvedMode: ResolvedThemeMode): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const modeTokens = resolveEffectiveModeTokens(prefs, resolvedMode);
    const radiusTokens = RADIUS_SCALE_TOKENS[prefs.radiusScale] ?? RADIUS_SCALE_TOKENS.squircle;
    const densityTokens = DENSITY_SCALE_TOKENS[prefs.density] ?? DENSITY_SCALE_TOKENS.comfortable;

    root.setAttribute('data-theme', resolvedMode);
    root.setAttribute('data-seed', prefs.seedPalette);
    root.setAttribute('data-density', prefs.density);
    root.setAttribute('data-reduced-motion', String(prefs.reducedMotion));
    root.setAttribute('data-webgl', String(Boolean(prefs.webglEnabled)));
    root.style.colorScheme = resolvedMode;

    // 1. Seed & Tonal Accent Tokens (Material You + Apple Vibrancy)
    root.style.setProperty('--uxu-primary', modeTokens.primary);
    root.style.setProperty('--uxu-primary-hover', modeTokens.primaryHover);
    root.style.setProperty('--uxu-primary-container', modeTokens.primaryContainer);
    root.style.setProperty('--uxu-on-primary-container', modeTokens.onPrimaryContainer);
    root.style.setProperty('--uxu-secondary', modeTokens.secondary);
    root.style.setProperty('--uxu-accent-glow', modeTokens.accentGlow);

    // 2. Palette-Inherited Surface, Background, Border & Text Tokens
    root.style.setProperty('--uxu-bg-canvas', modeTokens.bgCanvas);
    root.style.setProperty('--uxu-bg-elevated', modeTokens.bgElevated);
    root.style.setProperty('--uxu-surface-glass', modeTokens.surfaceGlass);
    root.style.setProperty('--uxu-surface-glass-hover', modeTokens.surfaceGlassHover);
    root.style.setProperty('--uxu-surface-tonal', modeTokens.surfaceTonal);
    root.style.setProperty('--uxu-surface-tonal-high', modeTokens.surfaceTonalHigh);
    root.style.setProperty('--uxu-surface-elevated', modeTokens.surfaceElevated);
    root.style.setProperty('--uxu-border-subtle', modeTokens.borderSubtle);
    root.style.setProperty('--uxu-border-strong', modeTokens.borderStrong);
    root.style.setProperty('--uxu-text-primary', modeTokens.textPrimary);
    root.style.setProperty('--uxu-text-secondary', modeTokens.textSecondary);
    root.style.setProperty('--uxu-text-muted', modeTokens.textMuted);

    // Synchronize Apple HIG Material Layers with active palette surfaces
    root.style.setProperty('--uxu-mat-ultrathin-bg', hexToRgba(modeTokens.bgElevated, resolvedMode === 'dark' ? 0.42 : 0.55));
    root.style.setProperty('--uxu-mat-thin-bg', hexToRgba(modeTokens.bgElevated, resolvedMode === 'dark' ? 0.58 : 0.70));
    root.style.setProperty('--uxu-mat-regular-bg', modeTokens.surfaceGlass);
    root.style.setProperty('--uxu-mat-thick-bg', hexToRgba(modeTokens.surfaceTonal, resolvedMode === 'dark' ? 0.90 : 0.92));
    root.style.setProperty('--uxu-liquid-regular-bg', hexToRgba(modeTokens.bgElevated, resolvedMode === 'dark' ? 0.68 : 0.78));

    // 3. Synchronize SheetGL Preset Registry so internal toolbar theme switches also inherit palette
    try {
      SheetGLThemeEngine.registerPreset(
        'apple-dark',
        buildInheritedSheetGLTheme(prefs, 'dark', 'apple'),
      );
      SheetGLThemeEngine.registerPreset(
        'apple-light',
        buildInheritedSheetGLTheme(prefs, 'light', 'apple'),
      );
      SheetGLThemeEngine.registerPreset(
        'google-dark',
        buildInheritedSheetGLTheme(prefs, 'dark', 'google'),
      );
      SheetGLThemeEngine.registerPreset(
        'google-light',
        buildInheritedSheetGLTheme(prefs, 'light', 'google'),
      );
    } catch {
      // Safe fallback if SheetGL preset registry is unavailable
    }

    // 4. Corner Radius Tokens (Supports both preset scale and exact customRadiusPx 0px-32px)
    if (typeof prefs.customRadiusPx === 'number') {
      const px = Math.max(0, Math.min(32, prefs.customRadiusPx));
      root.style.setProperty('--uxu-radius-sm', `${Math.round(px * 0.65)}px`);
      root.style.setProperty('--uxu-radius-md', `${px}px`);
      root.style.setProperty('--uxu-radius-lg', `${Math.round(px * 1.45)}px`);
      root.style.setProperty('--uxu-radius-xl', `${Math.round(px * 2)}px`);
      root.style.setProperty('--uxu-radius-full', '9999px');
    } else {
      root.style.setProperty('--uxu-radius-sm', radiusTokens.sm);
      root.style.setProperty('--uxu-radius-md', radiusTokens.md);
      root.style.setProperty('--uxu-radius-lg', radiusTokens.lg);
      root.style.setProperty('--uxu-radius-xl', radiusTokens.xl);
      root.style.setProperty('--uxu-radius-full', radiusTokens.full);
    }

    // 5. Density, Global Font Size Scale & Spacing Tokens
    const userFontScale = (prefs.fontScale ?? 100) / 100;
    const densityFontScale = parseFloat(densityTokens.fontSizeScale || '1');
    const combinedFontScale = +(userFontScale * densityFontScale).toFixed(3);

    root.style.setProperty('--uxu-density-scale', densityTokens.spacingUnit);
    root.style.setProperty('--uxu-control-height-md', densityTokens.controlHeightMd);
    root.style.setProperty('--uxu-card-padding', densityTokens.cardPadding);
    root.style.setProperty('--uxu-font-scale', String(combinedFontScale));

    // 6. Google Fonts Typography Preset Tokens
    const fontPreset =
      FONT_FAMILY_PRESETS[prefs.fontFamilyPreset ?? 'inter-jakarta'] ??
      FONT_FAMILY_PRESETS['inter-jakarta'];
    root.setAttribute('data-font-preset', fontPreset.id);
    root.style.setProperty('--uxu-font-sans', fontPreset.sansStack);
    root.style.setProperty('--uxu-font-display', fontPreset.displayStack);
    root.style.setProperty('--uxu-font-mono', fontPreset.monoStack);

    // 7. Google Material Symbols Variable Font Icon Tokens (opsz, wght, FILL, GRAD)
    const iconStyle = prefs.iconStyle ?? 'rounded';
    const iconFontFamily =
      iconStyle === 'outlined'
        ? "'Material Symbols Outlined'"
        : iconStyle === 'sharp'
        ? "'Material Symbols Sharp'"
        : "'Material Symbols Rounded'";
    const iconFill = prefs.iconFilled ? '1' : '0';
    const iconWeight = String(Math.max(100, Math.min(700, prefs.iconWeight ?? 400)));
    const iconGrade = resolvedMode === 'dark' ? '-25' : '0';

    root.setAttribute('data-icon-style', iconStyle);
    root.setAttribute('data-icon-fill', iconFill);
    root.style.setProperty('--uxu-icon-font-family', iconFontFamily);
    root.style.setProperty('--uxu-icon-fill', iconFill);
    root.style.setProperty('--uxu-icon-weight', iconWeight);
    root.style.setProperty('--uxu-icon-grade', iconGrade);

    // 8. Apple Glassmorphism Blur & Specular Intensity
    const blurPx = Math.round((prefs.glassIntensity / 100) * 32);
    const saturation = Math.round(100 + (prefs.glassIntensity / 100) * 90);
    root.style.setProperty('--uxu-glass-blur', `${blurPx}px`);
    root.style.setProperty('--uxu-glass-saturation', `${saturation}%`);

    // 9. Sidebar Width Dynamic Tokens (Controllable via CSS Variables)
    const sidebarWidth = Math.max(180, Math.min(420, prefs.sidebarWidth ?? 256));
    const sidebarStackedWidth = Math.max(80, Math.min(180, prefs.sidebarStackedWidth ?? 88));
    root.style.setProperty('--uxu-sidebar-width', `${sidebarWidth}px`);
    root.style.setProperty('--uxu-sidebar-stacked-width', `${sidebarStackedWidth}px`);
  }
}

export const defaultThemeEngine = new CssVariableThemeEngine();
