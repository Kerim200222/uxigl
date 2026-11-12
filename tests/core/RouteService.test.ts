import { describe, it, expect } from 'vitest';
import {
  RouteService,
  DASHBOARD_VIEW_IDS,
} from '../../src/core/services/RouteService';

describe('RouteService.buildPath', () => {
  it('returns / for landing section', () => {
    expect(RouteService.buildPath('landing')).toBe('/');
  });

  it('returns /docs/getting-started for docs-guide with no subItem', () => {
    expect(RouteService.buildPath('docs-guide')).toBe('/docs/getting-started');
  });

  it('returns /docs/theming-tokens for valid docs topic', () => {
    expect(RouteService.buildPath('docs-guide', 'theming-tokens')).toBe('/docs/theming-tokens');
  });

  it('returns /docs/getting-started for unknown docs topic', () => {
    expect(RouteService.buildPath('docs-guide', 'nonexistent')).toBe('/docs/getting-started');
  });

  it('returns /dashboard/overview for dashboard with no subItem', () => {
    expect(RouteService.buildPath('dashboard')).toBe('/dashboard/overview');
  });

  it('returns /dashboard/analytics for valid dashboard view', () => {
    expect(RouteService.buildPath('dashboard', 'analytics')).toBe('/dashboard/analytics');
  });

  it('resolves both analytics-telemetry and dashboard/analytics-telemetry to /dashboard/analytics-telemetry', () => {
    expect(RouteService.buildPath('dashboard', 'analytics-telemetry')).toBe(
      '/dashboard/analytics-telemetry'
    );
    expect(
      RouteService.buildPath('dashboard', 'dashboard/analytics-telemetry')
    ).toBe('/dashboard/analytics-telemetry');
  });

  it('returns /dashboard/overview for unknown dashboard view', () => {
    expect(RouteService.buildPath('dashboard', 'unknown-view')).toBe('/dashboard/overview');
  });

  it('returns /components/inputs/button for components-inputs with no subItem', () => {
    expect(RouteService.buildPath('components-inputs')).toBe('/components/inputs/button');
  });

  it('returns /components/inputs/input for valid input component', () => {
    expect(RouteService.buildPath('components-inputs', 'input')).toBe('/components/inputs/input');
  });

  it('returns /components/surfaces/card for components-surfaces with no subItem', () => {
    expect(RouteService.buildPath('components-surfaces')).toBe('/components/surfaces/card');
  });

  it('returns /components/feedback/chips-badges for components-feedback with no subItem', () => {
    expect(RouteService.buildPath('components-feedback')).toBe('/components/feedback/chips-badges');
  });

  it('returns /dashboard/overview for unknown section', () => {
    expect(RouteService.buildPath('totally-unknown')).toBe('/dashboard/overview');
  });
});

describe('RouteService.parsePath', () => {
  it('returns landing for empty string', () => {
    const result = RouteService.parsePath('');
    expect(result?.sectionId).toBe('landing');
    expect(result?.subItemId).toBe('home');
    expect(result?.path).toBe('/');
  });

  it('returns landing for /', () => {
    const result = RouteService.parsePath('/');
    expect(result?.sectionId).toBe('landing');
  });

  it('parses /docs/theming-tokens correctly', () => {
    const result = RouteService.parsePath('/docs/theming-tokens');
    expect(result?.sectionId).toBe('docs-guide');
    expect(result?.subItemId).toBe('theming-tokens');
    expect(result?.path).toBe('/docs/theming-tokens');
  });

  it('defaults to getting-started for unknown docs topic', () => {
    const result = RouteService.parsePath('/docs/nonexistent');
    expect(result?.subItemId).toBe('getting-started');
  });

  it('parses /dashboard/users correctly', () => {
    const result = RouteService.parsePath('/dashboard/users');
    expect(result?.sectionId).toBe('dashboard');
    expect(result?.subItemId).toBe('users');
  });

  it('parses /dashboard/analytics-telemetry via parsePath and parseLocation', () => {
    const parsedPath = RouteService.parsePath('/dashboard/analytics-telemetry');
    expect(parsedPath?.sectionId).toBe('dashboard');
    expect(parsedPath?.subItemId).toBe('analytics-telemetry');
    expect(parsedPath?.path).toBe('/dashboard/analytics-telemetry');

    const parsedLocation = RouteService.parseLocation(
      '/dashboard/analytics-telemetry'
    );
    expect(parsedLocation?.sectionId).toBe('dashboard');
    expect(parsedLocation?.subItemId).toBe('analytics-telemetry');
    expect(parsedLocation?.path).toBe('/dashboard/analytics-telemetry');
  });

  it('parses /components/inputs/switch correctly', () => {
    const result = RouteService.parsePath('/components/inputs/switch');
    expect(result?.sectionId).toBe('components-inputs');
    expect(result?.subItemId).toBe('switch');
  });

  it('parses /components/feedback/progress-avatar correctly', () => {
    const result = RouteService.parsePath('/components/feedback/progress-avatar');
    expect(result?.sectionId).toBe('components-feedback');
    expect(result?.subItemId).toBe('progress-avatar');
  });

  it('returns null for completely unknown path', () => {
    const result = RouteService.parsePath('/totally/unknown/path');
    expect(result).toBeNull();
  });

  it('parses /home as landing', () => {
    const result = RouteService.parsePath('/home');
    expect(result?.sectionId).toBe('landing');
  });
});

describe('RouteService.getSectionForComponent', () => {
  it('returns components-inputs for button', () => {
    expect(RouteService.getSectionForComponent('button')).toBe('components-inputs');
  });

  it('returns components-inputs for switch', () => {
    expect(RouteService.getSectionForComponent('switch')).toBe('components-inputs');
  });

  it('returns components-surfaces for card', () => {
    expect(RouteService.getSectionForComponent('card')).toBe('components-surfaces');
  });

  it('returns components-feedback for unknown component', () => {
    expect(RouteService.getSectionForComponent('unknown')).toBe('components-feedback');
  });
});

describe('RouteService.buildComponentPath', () => {
  it('builds correct path for button', () => {
    expect(RouteService.buildComponentPath('button')).toBe('/components/inputs/button');
  });

  it('builds correct path for modal-command', () => {
    expect(RouteService.buildComponentPath('modal-command')).toBe('/components/surfaces/modal-command');
  });
});

describe('DASHBOARD_VIEW_IDS', () => {
  it('contains standard views', () => {
    expect(DASHBOARD_VIEW_IDS.has('overview')).toBe(true);
    expect(DASHBOARD_VIEW_IDS.has('analytics')).toBe(true);
    expect(DASHBOARD_VIEW_IDS.has('analytics-telemetry')).toBe(true);
    expect(DASHBOARD_VIEW_IDS.has('dashboard/analytics-telemetry')).toBe(true);
    expect(DASHBOARD_VIEW_IDS.has('settings')).toBe(true);
    expect(DASHBOARD_VIEW_IDS.has('file-manager')).toBe(true);
  });

  it('does not contain bogus views', () => {
    expect(DASHBOARD_VIEW_IDS.has('bogus')).toBe(false);
  });
});
