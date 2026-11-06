import type { IThemeStorageAdapter, ThemePreferences } from '../contracts/ThemeContract';
import { DEFAULT_THEME_PREFERENCES } from '../tokens/designTokens';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — PERSISTENT STORAGE ADAPTER SERVICE (DIP & SRP)
 * ============================================================================
 * [SRP] Responsible for reliably persisting and restoring user theme & layout
 * preferences across browser refreshes (F5).
 */

const STORAGE_KEY = 'uxu.theme.preferences';
const LEGACY_KEYS = [
  'uxu.design_system.theme_preferences.v3',
  'uxu.design_system.theme_preferences.v2',
  'uxu.design_system.theme_preferences.v1',
];

const NAV_STORAGE_KEY = 'uxu.nav.state';

export interface PersistedNavState {
  activeSectionId: string;
  activeSubItemId: string;
  sidebarCollapsed: boolean;
  sidebarVariant?: string;
  sidebarAccent?: string;
}

export class LocalStorageThemeAdapter implements IThemeStorageAdapter {
  public loadPreferences(): ThemePreferences | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      let raw = window.localStorage.getItem(STORAGE_KEY);

      // Migrate from any previous version key if primary key is not yet populated
      if (!raw) {
        for (const legacyKey of LEGACY_KEYS) {
          const legacyRaw = window.localStorage.getItem(legacyKey);
          if (legacyRaw) {
            raw = legacyRaw;
            window.localStorage.setItem(STORAGE_KEY, legacyRaw);
            break;
          }
        }
      }

      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<ThemePreferences>;
      return {
        ...DEFAULT_THEME_PREFERENCES,
        ...parsed,
      };
    } catch {
      return null;
    }
  }

  public savePreferences(prefs: ThemePreferences): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // Fail gracefully in private browsing / quota exceeded
    }
  }

  public clearPreferences(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.removeItem(STORAGE_KEY);
      for (const legacyKey of LEGACY_KEYS) {
        window.localStorage.removeItem(legacyKey);
      }
    } catch {
      // Ignore
    }
  }

  public loadNavState(): PersistedNavState | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const raw = window.localStorage.getItem(NAV_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PersistedNavState;
    } catch {
      return null;
    }
  }

  public saveNavState(state: PersistedNavState): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  }
}

export const defaultThemeStorageAdapter = new LocalStorageThemeAdapter();
