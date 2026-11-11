// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  hexToRgba,
  blendHexColors,
  resolveEffectiveModeTokens,
  generateThemeCssExport,
  buildInheritedSheetGLTheme,
  CssVariableThemeEngine,
  defaultThemeEngine,
} from '../../src/core/services/ThemeEngineService';
import {
  DEFAULT_THEME_PREFERENCES,
  SEED_PALETTES,
} from '../../src/core/tokens/designTokens';
import type { ThemePreferences } from '../../src/core/contracts/ThemeContract';

describe('ThemeEngineService', () => {
  describe('hexToRgba', () => {
    it('converts valid 6-char hex with hash to rgba string', () => {
      expect(hexToRgba('#000000', 0.5)).toBe('rgba(0, 0, 0, 0.5)');
      expect(hexToRgba('#FFFFFF', 1)).toBe('rgba(255, 255, 255, 1)');
      expect(hexToRgba('#FF0000', 0.8)).toBe('rgba(255, 0, 0, 0.8)');
      expect(hexToRgba('#00FF00', 0.25)).toBe('rgba(0, 255, 0, 0.25)');
      expect(hexToRgba('#0000FF', 0)).toBe('rgba(0, 0, 255, 0)');
    });

    it('converts hex without hash', () => {
      expect(hexToRgba('2997FF', 0.75)).toBe('rgba(41, 151, 255, 0.75)');
    });

    it('returns fallback rgba for invalid hex length', () => {
      expect(hexToRgba('#FFF', 0.5)).toBe('rgba(41, 151, 255, 0.5)');
      expect(hexToRgba('invalid', 0.5)).toBe('rgba(41, 151, 255, 0.5)');
      expect(hexToRgba('', 0.5)).toBe('rgba(41, 151, 255, 0.5)');
    });
  });

  describe('blendHexColors', () => {
    it('returns exact base color when tintWeight is 0', () => {
      expect(blendHexColors('#000000', '#FFFFFF', 0)).toBe('#000000');
    });

    it('returns exact tint color when tintWeight is 1', () => {
      expect(blendHexColors('#000000', '#FFFFFF', 1)).toBe('#FFFFFF');
    });

    it('blends 50/50 between black and white to middle grey', () => {
      expect(blendHexColors('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    });

    it('clamps tintWeight outside [0, 1]', () => {
      expect(blendHexColors('#FF0000', '#0000FF', -0.5)).toBe('#FF0000');
      expect(blendHexColors('#FF0000', '#0000FF', 1.5)).toBe('#0000FF');
    });

    it('returns baseHex if either hex has invalid length', () => {
      expect(blendHexColors('#FFF', '#FFFFFF', 0.5)).toBe('#FFF');
      expect(blendHexColors('#000000', 'bad', 0.5)).toBe('#000000');
    });
  });

  describe('resolveEffectiveModeTokens', () => {
    it('returns seed palette dark mode tokens when mode is dark', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        seedPalette: 'cupertino-blue',
      };
      const tokens = resolveEffectiveModeTokens(prefs, 'dark');
      expect(tokens.primary).toBe(SEED_PALETTES['cupertino-blue'].dark.primary);
      expect(tokens.bgCanvas).toBe(SEED_PALETTES['cupertino-blue'].dark.bgCanvas);
    });

    it('returns seed palette light mode tokens when mode is light', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        seedPalette: 'cupertino-blue',
      };
      const tokens = resolveEffectiveModeTokens(prefs, 'light');
      expect(tokens.primary).toBe(SEED_PALETTES['cupertino-blue'].light.primary);
      expect(tokens.bgCanvas).toBe(SEED_PALETTES['cupertino-blue'].light.bgCanvas);
    });

    it('falls back to cupertino-blue if seedPalette is unknown', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        seedPalette: 'unknown-palette' as any,
      };
      const tokens = resolveEffectiveModeTokens(prefs, 'dark');
      expect(tokens.primary).toBe(SEED_PALETTES['cupertino-blue'].dark.primary);
    });

    it('synthesizes custom tonal palette when customPrimaryHex is provided (dark)', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        customPrimaryHex: '#8B5CF6',
      };
      const tokens = resolveEffectiveModeTokens(prefs, 'dark');
      expect(tokens.primary).toBe('#8B5CF6');
      expect(tokens.primaryContainer).toContain('rgba(139, 92, 246');
      expect(tokens.accentGlow).toContain('rgba(139, 92, 246');
    });

    it('synthesizes custom tonal palette when customPrimaryHex is provided (light)', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        customPrimaryHex: '#10B981',
      };
      const tokens = resolveEffectiveModeTokens(prefs, 'light');
      expect(tokens.primary).toBe('#10B981');
      expect(tokens.primaryContainer).toContain('rgba(16, 185, 129');
    });

    it('ignores invalid customPrimaryHex format', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        customPrimaryHex: 'not-a-hex',
      };
      const tokens = resolveEffectiveModeTokens(prefs, 'dark');
      expect(tokens.primary).toBe(SEED_PALETTES['cupertino-blue'].dark.primary);
    });
  });

  describe('generateThemeCssExport', () => {
    it('generates valid CSS Custom Properties export block', () => {
      const css = generateThemeCssExport(DEFAULT_THEME_PREFERENCES, 'dark');
      expect(css).toContain(':root[data-theme="dark"]');
      expect(css).toContain('--uxu-primary:');
      expect(css).toContain('--uxu-bg-canvas:');
      expect(css).toContain('--uxu-surface-glass:');
      expect(css).toContain('--uxu-radius-md:');
      expect(css).toContain('--uxu-font-scale:');
    });

    it('uses customRadiusPx when provided', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        customRadiusPx: 16,
      };
      const css = generateThemeCssExport(prefs, 'light');
      expect(css).toContain('--uxu-radius-md: 16px;');
    });

    it('maps radiusScale presets when customRadiusPx is not a number', () => {
      const sharpPrefs = { ...DEFAULT_THEME_PREFERENCES, customRadiusPx: undefined, radiusScale: 'sharp' as const };
      expect(generateThemeCssExport(sharpPrefs, 'dark')).toContain('--uxu-radius-md: 4px;');

      const pillPrefs = { ...DEFAULT_THEME_PREFERENCES, customRadiusPx: undefined, radiusScale: 'pill' as const };
      expect(generateThemeCssExport(pillPrefs, 'dark')).toContain('--uxu-radius-md: 22px;');

      const squirclePrefs = { ...DEFAULT_THEME_PREFERENCES, customRadiusPx: undefined, radiusScale: 'squircle' as const };
      expect(generateThemeCssExport(squirclePrefs, 'dark')).toContain('--uxu-radius-md: 12px;');
    });
  });

  describe('buildInheritedSheetGLTheme', () => {
    it('builds valid IGridThemeTokens matching active uxiGL theme', () => {
      const theme = buildInheritedSheetGLTheme(DEFAULT_THEME_PREFERENCES, 'dark', 'apple');
      expect(theme.name).toBe('apple-dark');
      expect(theme.isDark).toBe(true);
      expect(theme.canvas.bg).toBeDefined();
      expect(theme.canvas.headerBg).toBeDefined();
      expect(theme.canvas.gridLine).toBeDefined();
      expect(theme.dom.toolbarBg).toBeDefined();
      expect(theme.dom.glassBackdrop).toContain('blur');
    });

    it('supports google style variant', () => {
      const theme = buildInheritedSheetGLTheme(DEFAULT_THEME_PREFERENCES, 'light', 'google');
      expect(theme.name).toBe('google-light');
      expect(theme.isDark).toBe(false);
      expect(theme.dom.glassBackdrop).toBe('none');
    });
  });

  describe('CssVariableThemeEngine', () => {
    let engine: CssVariableThemeEngine;

    beforeEach(() => {
      engine = new CssVariableThemeEngine();
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.removeAttribute('data-seed');
      document.documentElement.removeAttribute('data-density');
    });

    it('applies data attributes and CSS variables to document.documentElement', () => {
      engine.applyTheme(DEFAULT_THEME_PREFERENCES, 'dark');

      const root = document.documentElement;
      expect(root.getAttribute('data-theme')).toBe('dark');
      expect(root.getAttribute('data-seed')).toBe(DEFAULT_THEME_PREFERENCES.seedPalette);
      expect(root.getAttribute('data-density')).toBe(DEFAULT_THEME_PREFERENCES.density);
      expect(root.style.colorScheme).toBe('dark');

      expect(root.style.getPropertyValue('--uxu-primary')).toBeTruthy();
      expect(root.style.getPropertyValue('--uxu-bg-canvas')).toBeTruthy();
      expect(root.style.getPropertyValue('--uxu-surface-glass')).toBeTruthy();
      expect(root.style.getPropertyValue('--uxu-radius-md')).toBeTruthy();
      expect(root.style.getPropertyValue('--uxu-font-sans')).toBeTruthy();
      expect(root.style.getPropertyValue('--uxu-glass-blur')).toBeTruthy();
    });

    it('applies custom radius in pixels clamped between 0 and 32', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        customRadiusPx: 20,
      };
      engine.applyTheme(prefs, 'light');
      expect(document.documentElement.style.getPropertyValue('--uxu-radius-md')).toBe('20px');
      expect(document.documentElement.style.getPropertyValue('--uxu-radius-full')).toBe('9999px');
    });

    it('applies icon tokens according to preferences', () => {
      const prefs: ThemePreferences = {
        ...DEFAULT_THEME_PREFERENCES,
        iconStyle: 'outlined',
        iconFilled: true,
        iconWeight: 600,
      };
      engine.applyTheme(prefs, 'dark');
      const root = document.documentElement;
      expect(root.getAttribute('data-icon-style')).toBe('outlined');
      expect(root.style.getPropertyValue('--uxu-icon-font-family')).toContain('Material Symbols Outlined');
      expect(root.style.getPropertyValue('--uxu-icon-fill')).toBe('1');
      expect(root.style.getPropertyValue('--uxu-icon-weight')).toBe('600');
    });
  });

  describe('defaultThemeEngine', () => {
    it('is an instance of CssVariableThemeEngine', () => {
      expect(defaultThemeEngine).toBeInstanceOf(CssVariableThemeEngine);
    });
  });
});
