import { describe, it, expect } from 'vitest';
import {
  DEFAULT_THEME_PREFERENCES,
  SEED_PALETTES,
  RADIUS_SCALE_TOKENS,
  DENSITY_SCALE_TOKENS,
  FONT_FAMILY_PRESETS,
} from '../../src/core/tokens/designTokens';

describe('designTokens', () => {
  describe('DEFAULT_THEME_PREFERENCES', () => {
    it('provides sensible dark mode defaults', () => {
      expect(DEFAULT_THEME_PREFERENCES.mode).toBe('dark');
      expect(DEFAULT_THEME_PREFERENCES.seedPalette).toBe('cupertino-blue');
      expect(DEFAULT_THEME_PREFERENCES.radiusScale).toBe('squircle');
      expect(DEFAULT_THEME_PREFERENCES.customRadiusPx).toBe(12);
      expect(DEFAULT_THEME_PREFERENCES.density).toBe('comfortable');
      expect(DEFAULT_THEME_PREFERENCES.fontScale).toBe(100);
      expect(DEFAULT_THEME_PREFERENCES.iconStyle).toBe('rounded');
      expect(DEFAULT_THEME_PREFERENCES.iconWeight).toBe(400);
      expect(DEFAULT_THEME_PREFERENCES.glassIntensity).toBe(82);
    });

    it('has webgl disabled by default for zero idle GPU load', () => {
      expect(DEFAULT_THEME_PREFERENCES.webglEnabled).toBe(false);
    });
  });

  describe('SEED_PALETTES', () => {
    const paletteIds = Object.keys(SEED_PALETTES);

    it('contains standard Apple and Google inspired seed palettes', () => {
      expect(paletteIds).toContain('cupertino-blue');
      expect(paletteIds).toContain('material-violet');
      expect(paletteIds).toContain('emerald-mint');
    });

    it('every palette definition has complete metadata, aurora colors, and light/dark modes', () => {
      for (const id of paletteIds) {
        const p = SEED_PALETTES[id as keyof typeof SEED_PALETTES];
        expect(p.id).toBe(id);
        expect(p.name).toBeTruthy();
        expect(p.inspiration).toBeTruthy();

        // Aurora RGB Triples (must be floats between 0 and 1)
        expect(p.auroraColors.colorA).toHaveLength(3);
        expect(p.auroraColors.colorB).toHaveLength(3);
        expect(p.auroraColors.colorC).toHaveLength(3);
        for (const c of [...p.auroraColors.colorA, ...p.auroraColors.colorB, ...p.auroraColors.colorC]) {
          expect(c).toBeGreaterThanOrEqual(0);
          expect(c).toBeLessThanOrEqual(1);
        }

        // Light mode tokens
        expect(p.light.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(p.light.bgCanvas).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(p.light.bgElevated).toMatch(/^#[0-9A-Fa-f]{6}$/);

        // Dark mode tokens
        expect(p.dark.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(p.dark.bgCanvas).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(p.dark.bgElevated).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe('RADIUS_SCALE_TOKENS', () => {
    it('defines sharp, squircle, and pill radius scales', () => {
      expect(RADIUS_SCALE_TOKENS.sharp).toBeDefined();
      expect(RADIUS_SCALE_TOKENS.squircle).toBeDefined();
      expect(RADIUS_SCALE_TOKENS.pill).toBeDefined();
    });

    it('each scale provides sm, md, lg, xl, and full tokens', () => {
      for (const scale of Object.values(RADIUS_SCALE_TOKENS)) {
        expect(scale.sm).toBeTruthy();
        expect(scale.md).toBeTruthy();
        expect(scale.lg).toBeTruthy();
        expect(scale.xl).toBeTruthy();
        expect(scale.full).toBeTruthy();
      }
    });
  });

  describe('DENSITY_SCALE_TOKENS', () => {
    it('defines compact, comfortable, and spacious density settings', () => {
      expect(DENSITY_SCALE_TOKENS.compact).toBeDefined();
      expect(DENSITY_SCALE_TOKENS.comfortable).toBeDefined();
      expect(DENSITY_SCALE_TOKENS.spacious).toBeDefined();
    });

    it('each density mode contains control height and card padding', () => {
      for (const d of Object.values(DENSITY_SCALE_TOKENS)) {
        expect(d.spacingUnit).toBeTruthy();
        expect(d.controlHeightMd).toBeTruthy();
        expect(d.cardPadding).toBeTruthy();
      }
    });
  });

  describe('FONT_FAMILY_PRESETS', () => {
    it('defines popular typography presets with valid stacks', () => {
      expect(FONT_FAMILY_PRESETS['inter-jakarta']).toBeDefined();
      expect(FONT_FAMILY_PRESETS['outfit-material']).toBeDefined();

      for (const font of Object.values(FONT_FAMILY_PRESETS)) {
        expect(font.id).toBeTruthy();
        expect(font.sansStack).toBeTruthy();
        expect(font.displayStack).toBeTruthy();
        expect(font.monoStack).toBeTruthy();
      }
    });
  });
});
