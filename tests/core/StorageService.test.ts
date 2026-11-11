// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  LocalStorageThemeAdapter,
  defaultThemeStorageAdapter,
} from '../../src/core/services/StorageService';
import type { PersistedNavState } from '../../src/core/services/StorageService';
import { DEFAULT_THEME_PREFERENCES } from '../../src/core/tokens/designTokens';

const STORAGE_KEY = 'uxu.theme.preferences';
const LEGACY_KEYS = [
  'uxu.design_system.theme_preferences.v3',
  'uxu.design_system.theme_preferences.v2',
  'uxu.design_system.theme_preferences.v1',
];
const NAV_STORAGE_KEY = 'uxu.nav.state';

describe('LocalStorageThemeAdapter', () => {
  let adapter: LocalStorageThemeAdapter;

  beforeEach(() => {
    adapter = new LocalStorageThemeAdapter();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('loadPreferences', () => {
    it('returns null when localStorage is empty', () => {
      expect(adapter.loadPreferences()).toBeNull();
    });

    it('returns merged preferences with defaults when preferences exist', () => {
      const prefs = { mode: 'light', seedPalette: 'emerald-spring' };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      const result = adapter.loadPreferences();
      expect(result).not.toBeNull();
      expect(result!.mode).toBe('light');
      expect(result!.seedPalette).toBe('emerald-spring');
      // Falls back to DEFAULT for unspecified fields
      expect(result!.density).toBe(DEFAULT_THEME_PREFERENCES.density);
      expect(result!.fontScale).toBe(DEFAULT_THEME_PREFERENCES.fontScale);
    });

    it('migrates from legacy v3 key when primary key is absent', () => {
      const prefs = { mode: 'dark', seedPalette: 'cherry-blossom' };
      localStorage.setItem(LEGACY_KEYS[0], JSON.stringify(prefs));
      const result = adapter.loadPreferences();
      expect(result).not.toBeNull();
      expect(result!.seedPalette).toBe('cherry-blossom');
      // Migration: primary key should now be populated
      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    });

    it('migrates from legacy v2 key when v3 is absent', () => {
      const prefs = { mode: 'light', density: 'compact' };
      localStorage.setItem(LEGACY_KEYS[1], JSON.stringify(prefs));
      const result = adapter.loadPreferences();
      expect(result).not.toBeNull();
      expect(result!.density).toBe('compact');
    });

    it('returns null when stored JSON is malformed', () => {
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{');
      expect(adapter.loadPreferences()).toBeNull();
    });

    it('prefers primary key over legacy keys when both exist', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: 'dark' }));
      localStorage.setItem(LEGACY_KEYS[0], JSON.stringify({ mode: 'light' }));
      const result = adapter.loadPreferences();
      expect(result!.mode).toBe('dark');
    });
  });

  describe('savePreferences', () => {
    it('persists preferences to localStorage', () => {
      adapter.savePreferences(DEFAULT_THEME_PREFERENCES);
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.mode).toBe(DEFAULT_THEME_PREFERENCES.mode);
      expect(parsed.seedPalette).toBe(DEFAULT_THEME_PREFERENCES.seedPalette);
    });

    it('round-trips: save then load returns same values', () => {
      const prefs = { ...DEFAULT_THEME_PREFERENCES, mode: 'light' as const, fontScale: 115 };
      adapter.savePreferences(prefs);
      const loaded = adapter.loadPreferences();
      expect(loaded!.mode).toBe('light');
      expect(loaded!.fontScale).toBe(115);
    });
  });

  describe('clearPreferences', () => {
    it('removes primary key from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_THEME_PREFERENCES));
      adapter.clearPreferences();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('removes all legacy keys from localStorage', () => {
      for (const key of LEGACY_KEYS) {
        localStorage.setItem(key, '{}');
      }
      adapter.clearPreferences();
      for (const key of LEGACY_KEYS) {
        expect(localStorage.getItem(key)).toBeNull();
      }
    });

    it('returns null after clear', () => {
      adapter.savePreferences(DEFAULT_THEME_PREFERENCES);
      adapter.clearPreferences();
      expect(adapter.loadPreferences()).toBeNull();
    });
  });

  describe('loadNavState', () => {
    it('returns null when no nav state saved', () => {
      expect(adapter.loadNavState()).toBeNull();
    });

    it('returns parsed nav state when present', () => {
      const state: PersistedNavState = {
        activeSectionId: 'dashboard',
        activeSubItemId: 'overview',
        sidebarCollapsed: false,
      };
      localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(state));
      const result = adapter.loadNavState();
      expect(result?.activeSectionId).toBe('dashboard');
      expect(result?.activeSubItemId).toBe('overview');
      expect(result?.sidebarCollapsed).toBe(false);
    });

    it('returns null when nav state JSON is malformed', () => {
      localStorage.setItem(NAV_STORAGE_KEY, 'invalid-json');
      expect(adapter.loadNavState()).toBeNull();
    });
  });

  describe('saveNavState', () => {
    it('persists nav state to localStorage', () => {
      const state: PersistedNavState = {
        activeSectionId: 'docs-guide',
        activeSubItemId: 'theming-tokens',
        sidebarCollapsed: true,
      };
      adapter.saveNavState(state);
      const raw = localStorage.getItem(NAV_STORAGE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!) as PersistedNavState;
      expect(parsed.activeSectionId).toBe('docs-guide');
      expect(parsed.sidebarCollapsed).toBe(true);
    });

    it('round-trips nav state: save then load', () => {
      const state: PersistedNavState = {
        activeSectionId: 'components-inputs',
        activeSubItemId: 'button',
        sidebarCollapsed: false,
      };
      adapter.saveNavState(state);
      const loaded = adapter.loadNavState();
      expect(loaded?.activeSectionId).toBe('components-inputs');
      expect(loaded?.activeSubItemId).toBe('button');
    });
  });
});

describe('defaultThemeStorageAdapter', () => {
  it('is an instance of LocalStorageThemeAdapter', () => {
    expect(defaultThemeStorageAdapter).toBeInstanceOf(LocalStorageThemeAdapter);
  });
});
