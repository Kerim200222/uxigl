// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ThemeProvider } from '../../src/providers/ThemeProvider';
import { ToastProvider } from '../../src/providers/ToastProvider';
import {
  EnterpriseSettingsPage,
  type EnterpriseSettingsPageProps,
  WORKSPACE_SETTINGS_STORAGE_KEY,
  DEFAULT_WORKSPACE_SETTINGS,
  loadWorkspaceSettings,
  saveWorkspaceSettings,
  clearWorkspaceSettings,
} from '../../src/features/showcase/EnterpriseSettingsPage';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

function setNativeInputValue(input: HTMLInputElement, nextValue: string) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;
  nativeInputValueSetter?.call(input, nextValue);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('EnterpriseSettingsPage & Workspace Settings Persistence', () => {
  let container: HTMLDivElement;
  let root: Root;

  const renderSettingsPage = (props?: EnterpriseSettingsPageProps) => {
    act(() => {
      root.render(
        React.createElement(
          ThemeProvider,
          null,
          React.createElement(
            ToastProvider,
            null,
            React.createElement(EnterpriseSettingsPage, props)
          )
        )
      );
    });
  };

  beforeEach(() => {
    window.localStorage.clear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.localStorage.clear();
  });

  describe('1. Storage Helpers (WORKSPACE_SETTINGS_STORAGE_KEY)', () => {
    it('loads DEFAULT_WORKSPACE_SETTINGS when localStorage is empty', () => {
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);
    });

    it('saves, loads, and clears workspace settings in localStorage', () => {
      const customSettings = {
        fullName: 'Ada Lovelace',
        email: 'ada@analytical.engine',
        emailNotifications: false,
        pushNotifications: true,
      };

      saveWorkspaceSettings(customSettings);
      const raw = window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY);
      expect(raw).toBeTruthy();
      expect(loadWorkspaceSettings()).toEqual(customSettings);

      clearWorkspaceSettings();
      expect(
        window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY)
      ).toBeNull();
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);
    });

    it('gracefully falls back to defaults on malformed JSON or partial payloads', () => {
      window.localStorage.setItem(
        WORKSPACE_SETTINGS_STORAGE_KEY,
        '{corrupted-json'
      );
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);

      window.localStorage.setItem(
        WORKSPACE_SETTINGS_STORAGE_KEY,
        JSON.stringify({ fullName: 'Custom User' })
      );
      expect(loadWorkspaceSettings()).toEqual({
        ...DEFAULT_WORKSPACE_SETTINGS,
        fullName: 'Custom User',
      });
    });
  });

  describe('2. Default & initialTab Rendering', () => {
    it('renders the Appearance tab by default with theme, accent, and radius controls', () => {
      renderSettingsPage({ className: 'custom-enterprise-settings' });

      const rootEl = container.querySelector('.uxu-enterprise-settings-page');
      expect(rootEl).not.toBeNull();
      expect(rootEl?.classList.contains('custom-enterprise-settings')).toBe(
        true
      );

      expect(container.querySelector('#settings-theme-mode')).not.toBeNull();
      expect(container.querySelector('#settings-accent-color')).not.toBeNull();
      expect(container.querySelector('#settings-corner-radius')).not.toBeNull();
      expect(container.textContent).toContain('Appearance & Design Tokens');
    });

    it('renders directly into the Account or Notifications tab when initialTab is provided', () => {
      renderSettingsPage({ initialTab: 'account' });
      expect(container.querySelector('#settings-account-name')).not.toBeNull();
      expect(container.querySelector('#settings-account-email')).not.toBeNull();

      renderSettingsPage({ initialTab: 'notifications' });
      expect(container.querySelector('#settings-notify-email')).not.toBeNull();
      expect(container.querySelector('#settings-notify-push')).not.toBeNull();
    });
  });

  describe('3. Account Tab Persistence', () => {
    it('persists updated fullName and email to localStorage and displays Changes Saved badge', () => {
      renderSettingsPage({ initialTab: 'account' });

      const nameInput = container.querySelector<HTMLInputElement>(
        '#settings-account-name'
      );
      const emailInput = container.querySelector<HTMLInputElement>(
        '#settings-account-email'
      );
      expect(nameInput).not.toBeNull();
      expect(emailInput).not.toBeNull();

      act(() => {
        setNativeInputValue(nameInput!, 'Deniz Kaya');
        setNativeInputValue(emailInput!, 'deniz.kaya@truncgil.com');
      });

      const saveBtn = Array.from(
        container.querySelectorAll<HTMLButtonElement>('button')
      ).find((b) => b.textContent?.includes('Save Changes'));
      expect(saveBtn).toBeDefined();

      act(() => {
        saveBtn!.click();
      });

      expect(container.textContent).toContain('Changes Saved');
      expect(container.textContent).toContain('Active Profile: Deniz Kaya');

      const persisted = loadWorkspaceSettings();
      expect(persisted.fullName).toBe('Deniz Kaya');
      expect(persisted.email).toBe('deniz.kaya@truncgil.com');
    });
  });

  describe('4. Notifications Tab Persistence', () => {
    it('immediately persists emailNotifications and pushNotifications toggles to localStorage', () => {
      renderSettingsPage({ initialTab: 'notifications' });

      const emailSwitch = container.querySelector<HTMLButtonElement>(
        '#settings-notify-email'
      );
      const pushSwitch = container.querySelector<HTMLButtonElement>(
        '#settings-notify-push'
      );
      expect(emailSwitch).not.toBeNull();
      expect(pushSwitch).not.toBeNull();
      expect(emailSwitch?.getAttribute('aria-checked')).toBe('true');
      expect(pushSwitch?.getAttribute('aria-checked')).toBe('false');

      act(() => {
        emailSwitch!.click();
      });
      expect(loadWorkspaceSettings().emailNotifications).toBe(false);
      expect(emailSwitch?.getAttribute('aria-checked')).toBe('false');

      act(() => {
        pushSwitch!.click();
      });
      expect(loadWorkspaceSettings().pushNotifications).toBe(true);
      expect(pushSwitch?.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('5. Reset Defaults Action', () => {
    it('clears persisted workspace settings and restores DEFAULT_WORKSPACE_SETTINGS', () => {
      saveWorkspaceSettings({
        fullName: 'Temporary Admin',
        email: 'temp@uxigl.io',
        emailNotifications: false,
        pushNotifications: true,
      });

      renderSettingsPage({ initialTab: 'appearance' });
      expect(container.textContent).toContain(
        'Active Profile: Temporary Admin'
      );

      const resetBtn = Array.from(
        container.querySelectorAll<HTMLButtonElement>('button')
      ).find((b) => b.textContent?.includes('Reset Defaults'));
      expect(resetBtn).toBeDefined();

      act(() => {
        resetBtn!.click();
      });

      expect(
        window.localStorage.getItem(WORKSPACE_SETTINGS_STORAGE_KEY)
      ).toBeNull();
      expect(loadWorkspaceSettings()).toEqual(DEFAULT_WORKSPACE_SETTINGS);
      expect(container.textContent).toContain(
        `Active Profile: ${DEFAULT_WORKSPACE_SETTINGS.fullName}`
      );
    });
  });
});

