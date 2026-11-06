import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  IThemeEngine,
  IThemeStorageAdapter,
  RadiusScale,
  ResolvedThemeMode,
  SeedPaletteId,
  ThemeContextContract,
  ThemeMode,
  ThemePreferences,
  UIDensity,
  WebGLShaderPreset,
} from '../core/contracts/ThemeContract';
import {
  DEFAULT_THEME_PREFERENCES,
  FONT_FAMILY_PRESETS,
  SEED_PALETTES,
} from '../core/tokens/designTokens';
import { defaultThemeStorageAdapter } from '../core/services/StorageService';
import {
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
}) => {
  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(() =>
    getSystemColorScheme()
  );

  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    const stored = storageAdapter.loadPreferences();
    const merged: ThemePreferences = {
      ...DEFAULT_THEME_PREFERENCES,
      ...initialPreferences,
      ...(stored ?? {}),
    };
    const initialResolved: ResolvedThemeMode =
      merged.mode === 'system' ? getSystemColorScheme() : merged.mode;
    themeEngine.applyTheme(merged, initialResolved);
    return merged;
  });

  // Helper that updates state AND persists immediately to localStorage (survives instant F5)
  const updatePrefs = useCallback(
    (updater: (prev: ThemePreferences) => ThemePreferences) => {
      setPreferences((prev) => {
        const next = updater(prev);
        const nextResolved: ResolvedThemeMode =
          next.mode === 'system' ? systemMode : next.mode;
        themeEngine.applyTheme(next, nextResolved);
        storageAdapter.savePreferences(next);
        return next;
      });
    },
    [storageAdapter, themeEngine, systemMode]
  );

  // Listen to OS dark/light mode changes
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

  // Apply tokens via injected ThemeEngine & persist via StorageAdapter
  useEffect(() => {
    themeEngine.applyTheme(preferences, resolvedMode);
    storageAdapter.savePreferences(preferences);
  }, [preferences, resolvedMode, themeEngine, storageAdapter]);

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
    storageAdapter.clearPreferences();
    setPreferences(DEFAULT_THEME_PREFERENCES);
    const nextResolved: ResolvedThemeMode =
      DEFAULT_THEME_PREFERENCES.mode === 'system'
        ? systemMode
        : DEFAULT_THEME_PREFERENCES.mode;
    themeEngine.applyTheme(DEFAULT_THEME_PREFERENCES, nextResolved);
    storageAdapter.savePreferences(DEFAULT_THEME_PREFERENCES);
  }, [storageAdapter, systemMode, themeEngine]);

  const availablePalettes = useMemo(() => Object.values(SEED_PALETTES), []);
  const availableFontPresets = useMemo(
    () => Object.values(FONT_FAMILY_PRESETS),
    []
  );
  const activePalette = useMemo(() => {
    const basePalette =
      SEED_PALETTES[preferences.seedPalette] ?? SEED_PALETTES['cupertino-blue'];
    if (!preferences.customPrimaryHex) {
      return basePalette;
    }
    return {
      ...basePalette,
      light: resolveEffectiveModeTokens(preferences, 'light'),
      dark: resolveEffectiveModeTokens(preferences, 'dark'),
    };
  }, [preferences]);

  const value = useMemo<ThemeContextContract>(
    () => ({
      preferences,
      resolvedMode,
      activePalette,
      availablePalettes,
      availableFontPresets,
      setMode,
      toggleMode,
      setSeedPalette,
      setCustomPrimaryHex,
      setRadiusScale,
      setCustomRadiusPx,
      setDensity,
      setFontScale,
      setFontFamilyPreset,
      setIconStyle,
      setIconFilled,
      setIconWeight,
      setGlassIntensity,
      setSidebarWidth,
      setSidebarStackedWidth,
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
      setMode,
      toggleMode,
      setSeedPalette,
      setCustomPrimaryHex,
      setRadiusScale,
      setCustomRadiusPx,
      setDensity,
      setFontScale,
      setFontFamilyPreset,
      setIconStyle,
      setIconFilled,
      setIconWeight,
      setGlassIntensity,
      setSidebarWidth,
      setSidebarStackedWidth,
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

export function useTheme(): ThemeContextContract {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider />');
  }
  return ctx;
}
