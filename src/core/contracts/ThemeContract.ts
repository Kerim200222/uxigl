/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — THEME & OPTIONAL WEBGL CONTRACTS (DIP & OCP)
 * ============================================================================
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

export type SeedPaletteId =
  | 'cupertino-blue'
  | 'material-violet'
  | 'emerald-mint'
  | 'sunset-coral'
  | 'amber-gold'
  | 'graphite-mono';

export type RadiusScale = 'sharp' | 'squircle' | 'pill';
export type UIDensity = 'compact' | 'comfortable' | 'spacious';

export type FontFamilyPreset =
  | 'inter-jakarta'
  | 'outfit-material'
  | 'dm-sans'
  | 'space-grotesk'
  | 'system-sf';

export type GoogleIconStyle = 'rounded' | 'outlined' | 'sharp';

export interface FontFamilyPresetDefinition {
  id: FontFamilyPreset;
  name: string;
  badge: string;
  description: string;
  sansStack: string;
  displayStack: string;
  monoStack: string;
}

export type WebGLShaderPreset =
  | 'aurora-borealis'
  | 'spatial-nebula'
  | 'material-lava'
  | 'cyber-horizon';

export interface SeedPaletteModeTokens {
  primary: string;
  primaryHover: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  accentGlow: string;
  /** Tonal surface & background inheritance tokens (Material You × Liquid Glass) */
  bgCanvas: string;
  bgElevated: string;
  surfaceGlass: string;
  surfaceGlassHover: string;
  surfaceTonal: string;
  surfaceTonalHigh: string;
  surfaceElevated: string;
  borderSubtle: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

export interface SeedPaletteDefinition {
  id: SeedPaletteId;
  name: string;
  inspiration: 'Liquid Glass' | 'Dynamic Tonal' | 'Hybrid Fusion';
  description: string;
  auroraColors: {
    colorA: [number, number, number];
    colorB: [number, number, number];
    colorC: [number, number, number];
  };
  light: SeedPaletteModeTokens;
  dark: SeedPaletteModeTokens;
}

export interface ThemePreferences {
  mode: ThemeMode;
  seedPalette: SeedPaletteId;
  /** Optional custom brand primary HEX color (e.g. '#6366F1') that dynamically overrides the seed palette */
  customPrimaryHex?: string;
  radiusScale: RadiusScale;
  /** Exact base border-radius in pixels (0 to 32, default 12) */
  customRadiusPx?: number;
  density: UIDensity;
  /** Global font scale percentage (80 to 125, default 100) */
  fontScale: number;
  /** Google Fonts typography preset (default 'inter-jakarta') */
  fontFamilyPreset?: FontFamilyPreset;
  /** Google Material Symbols variable icon style ('rounded' | 'outlined' | 'sharp') */
  iconStyle?: GoogleIconStyle;
  /** Google Material Symbols variable FILL axis (false = 0, true = 1) */
  iconFilled?: boolean;
  /** Google Material Symbols variable weight axis (100 to 700, default 400) */
  iconWeight?: number;
  /** Sidebar width in pixels (200 to 380, default 256) controlling CSS variable --uxu-sidebar-width */
  sidebarWidth?: number;
  /** Stacked vertical sidebar width in pixels (88 to 160, default 108) controlling CSS variable --uxu-sidebar-stacked-width */
  sidebarStackedWidth?: number;
  glassIntensity: number; // 0 to 100
  reducedMotion: boolean;
  /** WebGL shader is strictly OPTIONAL and OFF by default to save system resources */
  webglEnabled: boolean;
  webglPreset: WebGLShaderPreset;
  webglSpeed: number; // 0 to 200
  webglIntensity: number; // 0 to 100
}

/** [DIP] Abstraction for persisting user theme preferences */
export interface IThemeStorageAdapter {
  loadPreferences(): ThemePreferences | null;
  savePreferences(prefs: ThemePreferences): void;
  clearPreferences(): void;
}

/** [DIP] Abstraction for applying resolved theme tokens to the host environment */
export interface IThemeEngine {
  applyTheme(prefs: ThemePreferences, resolvedMode: ResolvedThemeMode): void;
}

export interface ThemeContextContract {
  preferences: ThemePreferences;
  resolvedMode: ResolvedThemeMode;
  activePalette: SeedPaletteDefinition;
  availablePalettes: SeedPaletteDefinition[];
  availableFontPresets: FontFamilyPresetDefinition[];
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setSeedPalette: (paletteId: SeedPaletteId) => void;
  setCustomPrimaryHex: (hex?: string) => void;
  setRadiusScale: (scale: RadiusScale) => void;
  setCustomRadiusPx: (px: number) => void;
  setDensity: (density: UIDensity) => void;
  setFontScale: (scale: number) => void;
  setFontFamilyPreset: (preset: FontFamilyPreset) => void;
  setIconStyle: (style: GoogleIconStyle) => void;
  setIconFilled: (filled: boolean) => void;
  setIconWeight: (weight: number) => void;
  setGlassIntensity: (intensity: number) => void;
  setSidebarWidth?: (width: number) => void;
  setSidebarStackedWidth?: (width: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setWebglEnabled: (enabled: boolean) => void;
  setWebglPreset: (preset: WebGLShaderPreset) => void;
  setWebglSpeed: (speed: number) => void;
  setWebglIntensity: (intensity: number) => void;
  resetPreferences: () => void;
}
