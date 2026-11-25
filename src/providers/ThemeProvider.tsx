import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  BorderContrastPreset,
  BuiltinSeedPaletteId,
  FontFamilyPreset,
  GoogleIconStyle,
  IThemeEngine,
  IThemeStorageAdapter,
  RadiusScale,
  ResolvedThemeMode,
  SeedPaletteDefinition,
  SeedPaletteId,
  SidebarLayoutVariant,
  ThemeContextContract,
  ThemeMode,
  ThemePreferences,
  UIDensity,
  WebGLShaderPreset,
  WorkspaceShellPreset,
} from '../core/contracts/ThemeContract';
import {
  DEFAULT_THEME_PREFERENCES,
  FONT_FAMILY_PRESETS,
  SEED_PALETTES,
} from '../core/tokens/designTokens';
import { applyWorkspaceShellPresetToPreferences } from '../core/tokens/workspaceShellPresets';
import { defaultThemeStorageAdapter } from '../core/services/StorageService';
import {
  CssVariableThemeEngine,
  defaultThemeEngine,
  resolveEffectiveModeTokens,
} from '../core/services/ThemeEngineService';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — THEME & WEBGL SHADER PROVIDER
 * ============================================================================
 */

const ThemeContext = createContext<ThemeContextContract | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  storageAdapter?: IThemeStorageAdapter;
  themeEngine?: IThemeEngine;
  initialPreferences?: Partial<ThemePreferences>;
  /** Shorthand alias for initialPreferences.mode */
  defaultMode?: ThemeMode;
  /** Legacy alias for defaultMode */
  defaultTheme?: ThemeMode;
  /** Shorthand alias for initialPreferences.seedPalette (also resolves common aliases like 'ocean') */
  defaultPalette?: SeedPaletteId;
  /** Shorthand alias for initialPreferences.customRadiusPx */
  defaultRadius?: number;
  /** Shorthand alias for initialPreferences.workspaceShell */
  defaultShell?: WorkspaceShellPreset;
  /** Optional custom palettes registered by the host application */
  extraPalettes?: SeedPaletteDefinition[];
  /** Optional initial per-user storage scope key */
  initialUserScopeKey?: string;
}

const PALETTE_ALIASES: Record<string, BuiltinSeedPaletteId> = {
  ocean: 'cupertino-blue',
  blue: 'cupertino-blue',
  cupertino: 'cupertino-blue',
  violet: 'material-violet',
  iris: 'material-violet',
  emerald: 'emerald-mint',
  mint: 'emerald-mint',
  coral: 'sunset-coral',
  sunset: 'sunset-coral',
  amber: 'amber-gold',
  gold: 'amber-gold',
  mono: 'graphite-mono',
  graphite: 'graphite-mono',
};

function resolveSafePaletteAlias(palette?: SeedPaletteId): SeedPaletteId | undefined {
  if (!palette) return undefined;
  const key = String(palette).trim().toLowerCase();
  return PALETTE_ALIASES[key] ?? palette;
}

function getSystemColorScheme(): ResolvedThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  storageAdapter = defaultThemeStorageAdapter,
  themeEngine = defaultThemeEngine,
  initialPreferences,
  defaultMode,
  defaultTheme,
  defaultPalette,
  defaultRadius,
  defaultShell,
  extraPalettes,
  initialUserScopeKey,
}) => {
  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(() =>
    getSystemColorScheme()
  );
  const [userScopeKey, setUserScopeKeyState] = useState<string | undefined>(
    initialUserScopeKey
  );

  const extraPalettesMap = useMemo<Record<string, SeedPaletteDefinition>>(() => {
    const map: Record<string, SeedPaletteDefinition> = {};
    if (extraPalettes) {
      for (const p of extraPalettes) {
        map[p.id] = p;
      }
    }
    return map;
  }, [extraPalettes]);

  const activeEngine = useMemo(() => {
    if (extraPalettes?.length && themeEngine === defaultThemeEngine) {
      return new CssVariableThemeEngine({ extraPalettes });
    }
    return themeEngine;
  }, [extraPalettes, themeEngine]);

  const mergedInitialPreferences = useMemo<Partial<ThemePreferences>>(
    () => ({
      ...(defaultMode ?? defaultTheme ? { mode: defaultMode ?? defaultTheme } : {}),
      ...(defaultPalette ? { seedPalette: resolveSafePaletteAlias(defaultPalette) } : {}),
      ...(typeof defaultRadius === 'number' ? { customRadiusPx: defaultRadius } : {}),
      ...(defaultShell ? { workspaceShell: defaultShell } : {}),
      ...initialPreferences,
    }),
    [defaultMode, defaultTheme, defaultPalette, defaultRadius, defaultShell, initialPreferences]
  );

  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    const stored = storageAdapter.loadPreferences(initialUserScopeKey);
    const merged: ThemePreferences = {
      ...DEFAULT_THEME_PREFERENCES,
      ...mergedInitialPreferences,
      ...(stored ?? {}),
    };
    const initialResolved: ResolvedThemeMode =
      merged.mode === 'system' ? getSystemColorScheme() : merged.mode;
    activeEngine.applyTheme(merged, initialResolved);
    return merged;
  });

  const updatePrefs = useCallback(
    (updater: (prev: ThemePreferences) => ThemePreferences) => {
      setPreferences((prev) => {
        const next = updater(prev);
        const nextResolved: ResolvedThemeMode =
          next.mode === 'system' ? systemMode : next.mode;
        activeEngine.applyTheme(next, nextResolved);
        storageAdapter.savePreferences(next, userScopeKey);
        return next;
      });
    },
    [storageAdapter, activeEngine, systemMode, userScopeKey]
  );

  const setUserScopeKey = useCallback(
    (scopeKey?: string) => {
      setUserScopeKeyState(scopeKey);
      const stored = storageAdapter.loadPreferences(scopeKey);
      if (stored) {
        const merged: ThemePreferences = {
          ...DEFAULT_THEME_PREFERENCES,
          ...initialPreferences,
          ...stored,
        };
        setPreferences(merged);
        const nextResolved: ResolvedThemeMode =
          merged.mode === 'system' ? systemMode : merged.mode;
        activeEngine.applyTheme(merged, nextResolved);
      }
    },
    [storageAdapter, initialPreferences, systemMode, activeEngine]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemMode(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedMode: ResolvedThemeMode =
    preferences.mode === 'system' ? systemMode : preferences.mode;

  useEffect(() => {
    activeEngine.applyTheme(preferences, resolvedMode);
    storageAdapter.savePreferences(preferences, userScopeKey);
  }, [preferences, resolvedMode, activeEngine, storageAdapter, userScopeKey]);

  const setMode = useCallback(
    (mode: ThemeMode) => {
      updatePrefs((prev) => ({ ...prev, mode }));
    },
    [updatePrefs]
  );

  const toggleMode = useCallback(() => {
    updatePrefs((prev) => {
      const currentResolved = prev.mode === 'system' ? systemMode : prev.mode;
      return {
        ...prev,
        mode: currentResolved === 'dark' ? 'light' : 'dark',
      };
    });
  }, [systemMode, updatePrefs]);

  const setSeedPalette = useCallback(
    (seedPalette: SeedPaletteId) => {
      updatePrefs((prev) => ({
        ...prev,
        seedPalette,
        customPrimaryHex: undefined,
        tenantBrandHex: null,
      }));
    },
    [updatePrefs]
  );

  const setCustomPrimaryHex = useCallback(
    (customPrimaryHex?: string) => {
      updatePrefs((prev) => ({
        ...prev,
        customPrimaryHex,
      }));
    },
    [updatePrefs]
  );

  const setTenantBrandHex = useCallback(
    (tenantBrandHex: string | null) => {
      updatePrefs((prev) => ({
        ...prev,
        tenantBrandHex,
      }));
    },
    [updatePrefs]
  );

  const setRadiusScale = useCallback(
    (radiusScale: RadiusScale) => {
      const mappedPx =
        radiusScale === 'sharp' ? 4 : radiusScale === 'pill' ? 22 : 12;
      updatePrefs((prev) => ({
        ...prev,
        radiusScale,
        customRadiusPx: mappedPx,
      }));
    },
    [updatePrefs]
  );

  const setCustomRadiusPx = useCallback(
    (px: number) => {
      const clamped = Math.max(0, Math.min(32, Math.round(px)));
      const inferredScale: RadiusScale =
        clamped <= 6 ? 'sharp' : clamped >= 18 ? 'pill' : 'squircle';
      updatePrefs((prev) => ({
        ...prev,
        customRadiusPx: clamped,
        radiusScale: inferredScale,
      }));
    },
    [updatePrefs]
  );

  const setBorderContrast = useCallback(
    (borderContrast: BorderContrastPreset) => {
      updatePrefs((prev) => ({ ...prev, borderContrast }));
    },
    [updatePrefs]
  );

  const setBorderWidthPx = useCallback(
    (px: number) => {
      const clamped = Math.max(0, Math.min(2.5, Number(px.toFixed(1))));
      updatePrefs((prev) => ({ ...prev, borderWidthPx: clamped }));
    },
    [updatePrefs]
  );

  const setDensity = useCallback(
    (density: UIDensity) => {
      updatePrefs((prev) => ({ ...prev, density }));
    },
    [updatePrefs]
  );

  const setFontScale = useCallback(
    (fontScale: number) => {
      updatePrefs((prev) => ({
        ...prev,
        fontScale: Math.max(80, Math.min(125, Math.round(fontScale))),
      }));
    },
    [updatePrefs]
  );

  const setFontFamilyPreset = useCallback(
    (fontFamilyPreset: FontFamilyPreset) => {
      updatePrefs((prev) => ({ ...prev, fontFamilyPreset }));
    },
    [updatePrefs]
  );

  const setIconStyle = useCallback(
    (iconStyle: GoogleIconStyle) => {
      updatePrefs((prev) => ({ ...prev, iconStyle }));
    },
    [updatePrefs]
  );

  const setIconFilled = useCallback(
    (iconFilled: boolean) => {
      updatePrefs((prev) => ({ ...prev, iconFilled }));
    },
    [updatePrefs]
  );

  const setIconWeight = useCallback(
    (iconWeight: number) => {
      updatePrefs((prev) => ({
        ...prev,
        iconWeight: Math.max(100, Math.min(700, Math.round(iconWeight / 100) * 100)),
      }));
    },
    [updatePrefs]
  );

  const setGlassIntensity = useCallback(
    (glassIntensity: number) => {
      updatePrefs((prev) => ({
        ...prev,
        glassIntensity: Math.max(0, Math.min(100, glassIntensity)),
      }));
    },
    [updatePrefs]
  );

  const setSidebarWidth = useCallback(
    (sidebarWidth: number) => {
      updatePrefs((prev) => ({
        ...prev,
        sidebarWidth: Math.max(180, Math.min(420, sidebarWidth)),
      }));
    },
    [updatePrefs]
  );

  const setSidebarStackedWidth = useCallback(
    (sidebarStackedWidth: number) => {
      updatePrefs((prev) => ({
        ...prev,
        sidebarStackedWidth: Math.max(80, Math.min(180, sidebarStackedWidth)),
      }));
    },
    [updatePrefs]
  );

  const setSidebarVariant = useCallback(
    (sidebarVariant: SidebarLayoutVariant) => {
      updatePrefs((prev) => ({ ...prev, sidebarVariant }));
    },
    [updatePrefs]
  );

  const setWorkspaceShell = useCallback(
    (workspaceShell: WorkspaceShellPreset) => {
      updatePrefs((prev) => applyWorkspaceShellPresetToPreferences(prev, workspaceShell));
    },
    [updatePrefs]
  );

  const setSidebarAccent = useCallback(
    (sidebarAccent?: string) => {
      updatePrefs((prev) => ({ ...prev, sidebarAccent }));
    },
    [updatePrefs]
  );

  const setReducedMotion = useCallback(
    (reducedMotion: boolean) => {
      updatePrefs((prev) => ({ ...prev, reducedMotion }));
    },
    [updatePrefs]
  );

  const setWebglEnabled = useCallback(
    (webglEnabled: boolean) => {
      updatePrefs((prev) => ({ ...prev, webglEnabled }));
    },
    [updatePrefs]
  );

  const setWebglPreset = useCallback(
    (webglPreset: WebGLShaderPreset) => {
      updatePrefs((prev) => ({ ...prev, webglPreset }));
    },
    [updatePrefs]
  );

  const setWebglSpeed = useCallback(
    (webglSpeed: number) => {
      updatePrefs((prev) => ({
        ...prev,
        webglSpeed: Math.max(0, Math.min(200, webglSpeed)),
      }));
    },
    [updatePrefs]
  );

  const setWebglIntensity = useCallback(
    (webglIntensity: number) => {
      updatePrefs((prev) => ({
        ...prev,
        webglIntensity: Math.max(10, Math.min(100, webglIntensity)),
      }));
    },
    [updatePrefs]
  );

  const resetPreferences = useCallback(() => {
    storageAdapter.clearPreferences(userScopeKey);
    const nextPrefs: ThemePreferences = {
      ...DEFAULT_THEME_PREFERENCES,
      ...initialPreferences,
    };
    setPreferences(nextPrefs);
    const nextResolved: ResolvedThemeMode =
      nextPrefs.mode === 'system' ? systemMode : nextPrefs.mode;
    themeEngine.applyTheme(nextPrefs, nextResolved);
    storageAdapter.savePreferences(nextPrefs, userScopeKey);
  }, [storageAdapter, userScopeKey, initialPreferences, systemMode, themeEngine]);

  const availablePalettes = useMemo(() => {
    const extras = extraPalettes ?? [];
    const extraIds = new Set(extras.map((p) => p.id));
    const builtins = Object.values(SEED_PALETTES).filter((p) => !extraIds.has(p.id));
    return [...extras, ...builtins];
  }, [extraPalettes]);

  const availableFontPresets = useMemo(
    () => Object.values(FONT_FAMILY_PRESETS),
    []
  );

  const activePalette = useMemo(() => {
    const basePalette =
      availablePalettes.find((p) => p.id === preferences.seedPalette) ??
      SEED_PALETTES['cupertino-blue'];
    if (!preferences.customPrimaryHex && !preferences.tenantBrandHex) {
      return basePalette;
    }
    return {
      ...basePalette,
      light: resolveEffectiveModeTokens(preferences, 'light', extraPalettes),
      dark: resolveEffectiveModeTokens(preferences, 'dark', extraPalettes),
    };
  }, [availablePalettes, extraPalettes, preferences]);

  const value = useMemo<ThemeContextContract>(
    () => ({
      preferences,
      resolvedMode,
      activePalette,
      availablePalettes,
      availableFontPresets,
      userScopeKey,
      setUserScopeKey,
      setMode,
      toggleMode,
      setSeedPalette,
      setCustomPrimaryHex,
      setTenantBrandHex,
      setRadiusScale,
      setCustomRadiusPx,
      setBorderContrast,
      setBorderWidthPx,
      setDensity,
      setFontScale,
      setFontFamilyPreset,
      setIconStyle,
      setIconFilled,
      setIconWeight,
      setGlassIntensity,
      setSidebarWidth,
      setSidebarStackedWidth,
      setSidebarVariant,
      setWorkspaceShell,
      setSidebarAccent,
      setReducedMotion,
      setWebglEnabled,
      setWebglPreset,
      setWebglSpeed,
      setWebglIntensity,
      resetPreferences,
    }),
    [
      preferences,
      resolvedMode,
      activePalette,
      availablePalettes,
      availableFontPresets,
      userScopeKey,
      setUserScopeKey,
      setMode,
      toggleMode,
      setSeedPalette,
      setCustomPrimaryHex,
      setTenantBrandHex,
      setRadiusScale,
      setCustomRadiusPx,
      setBorderContrast,
      setBorderWidthPx,
      setDensity,
      setFontScale,
      setFontFamilyPreset,
      setIconStyle,
      setIconFilled,
      setIconWeight,
      setGlassIntensity,
      setSidebarWidth,
      setSidebarStackedWidth,
      setSidebarVariant,
      setWorkspaceShell,
      setSidebarAccent,
      setReducedMotion,
      setWebglEnabled,
      setWebglPreset,
      setWebglSpeed,
      setWebglIntensity,
      resetPreferences,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useOptionalTheme(): ThemeContextContract | undefined {
  return useContext(ThemeContext);
}

export function useTheme(): ThemeContextContract {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider />');
  }
  return ctx;
}
