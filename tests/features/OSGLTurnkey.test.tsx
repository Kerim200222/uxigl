// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.hoisted(() => {
  (globalThis as unknown as { __UXIGL_VERSION__: string }).__UXIGL_VERSION__ = '3.0.5';
});
import {
  ThemeProvider,
  useTheme,
  OSGLApp,
  OSWorkspaceShell,
  reconcileIconSlotsWithNewApps,
  reconcileWidgetsOnUpgrade,
  createDefaultOSGLWidgets,
  type OSWorkspaceApp,
} from '../../src';

const SAMPLE_APPS: OSWorkspaceApp[] = [
  {
    id: 'home',
    label: 'Ana Sayfa',
    shortLabel: 'Ana',
    googleIcon: 'home',
    category: 'Genel',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    element: <div data-testid="home-window-body">Home Content</div>,
  },
  {
    id: 'reports',
    label: 'Raporlar',
    shortLabel: 'Rapor',
    googleIcon: 'monitoring',
    category: 'Analitik',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    render: () => <div data-testid="reports-window-body">Reports Content</div>,
  },
];

describe('OSGL Turnkey Integration & Zero-Collision Upgradeability', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('supports ThemeProvider shorthand props and palette aliases', () => {
    const Probe = () => {
      const { preferences } = useTheme();
      return (
        <div data-testid="theme-probe">
          {preferences.mode}|{preferences.seedPalette}|{preferences.customRadiusPx}
        </div>
      );
    };

    render(
      <ThemeProvider defaultMode="dark" defaultPalette="ocean" defaultRadius={16}>
        <Probe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-probe').textContent).toBe('dark|cupertino-blue|16');
  });

  it('renders OSGLApp without external providers, includes built-in widgets, and opens declarative app content', () => {
    render(<OSGLApp apps={SAMPLE_APPS} storageScopeKey="test-turnkey" />);

    expect(screen.getByTestId('osgl-workspace-shell')).toBeTruthy();
    // Built-in widgets are active automatically
    expect(document.querySelector('[data-widget-kind="focus-timer"]')).toBeTruthy();
    expect(document.querySelector('[data-widget-kind="todo-list"]')).toBeTruthy();
    expect(document.querySelector('[data-widget-kind="quick-notes"]')).toBeTruthy();

    // Clicking desktop icon opens declarative element content
    fireEvent.click(screen.getAllByText('Ana')[0]);
    expect(screen.getByTestId('home-window-body')).toBeTruthy();
  });

  it('switches seamlessly between OSGL Desktop and Classic Sidebar shell', () => {
    render(<OSGLApp apps={SAMPLE_APPS} storageScopeKey="test-switch" defaultShell="enterprisegl" />);

    expect(screen.getByTestId('osgl-classic-shell')).toBeTruthy();
    expect(screen.getByTestId('home-window-body')).toBeTruthy();

    // Return back to OSGL Desktop
    fireEvent.click(screen.getByText('OSGL Masaüstü'));
    expect(screen.getByTestId('osgl-workspace-shell')).toBeTruthy();
  });

  it('reconciles new apps and new core widgets without overwriting existing user layout', () => {
    const savedSlots = { home: 2 };
    const nextSlots = reconcileIconSlotsWithNewApps(savedSlots, SAMPLE_APPS, []);
    expect(nextSlots.home).toBe(2);
    expect(nextSlots.reports).toBe(0);

    const defaults = createDefaultOSGLWidgets({ storageScopeKey: 'mig' });
    const prevPositions = { 'focus-timer': { x: 100, y: 120 } };
    const prevEnabled = { 'focus-timer': false };
    const reconciled = reconcileWidgetsOnUpgrade(defaults, prevEnabled, prevPositions, {}, 1366);

    expect(reconciled.enabledWidgets['focus-timer']).toBe(false);
    expect(reconciled.widgetPositions['focus-timer']).toEqual({ x: 100, y: 120 });
    expect(reconciled.enabledWidgets['todo-list']).toBe(true);
  });

  it('respects e.defaultPrevented inside OSWorkspaceShell keyboard listener', () => {
    render(<OSGLApp apps={SAMPLE_APPS} storageScopeKey="test-kbd" />);
    const ev = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    ev.preventDefault();
    window.dispatchEvent(ev);
    expect(screen.queryByPlaceholderText('Modül, pencere düzeni veya görünüm ara...')).toBeNull();
  });
});
