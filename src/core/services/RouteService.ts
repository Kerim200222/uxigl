/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — URL ROUTER & HISTORY SYNCHRONIZATION SERVICE (SRP)
 * ============================================================================
 * Provides deterministic, clean HTML5 History API URL routing for every
 * section, sub-menu, documentation topic, dashboard view, and playground
 * component without external router bloat.
 */

export type RouteMainSectionId =
  | 'landing'
  | 'docs-guide'
  | 'dashboard'
  | 'components-inputs'
  | 'components-surfaces'
  | 'components-feedback';

export interface ResolvedRouteState {
  sectionId: RouteMainSectionId;
  subItemId: string;
  path: string;
}

export const INPUT_COMPONENT_IDS = new Set([
  'button',
  'input',
  'switch',
  'checkbox',
  'slider',
]);

export const SURFACE_COMPONENT_IDS = new Set([
  'card',
  'segmented-control',
  'tabs-accordion',
  'sidebar',
  'modal-command',
  'page-templates',
]);

export const FEEDBACK_COMPONENT_IDS = new Set([
  'chips-badges',
  'progress-avatar',
  'datatable-statcard',
  'filemangl-explorer',
]);

const DOCS_TOPIC_IDS = new Set([
  'getting-started',
  'form-controls',
  'surfaces-navigation',
  'data-feedback-webgl',
  'layout-shell',
  'page-templates',
  'theming-tokens',
  'cli-shortcuts',
]);

export const DASHBOARD_VIEW_IDS = new Set([
  'overview',
  'analytics',
  'analytics-telemetry',
  'dashboard/analytics-telemetry',
  'users',
  'products',
  'crm-orders',
  'forms',
  'sidebars',
  'sidebar-stacked',
  'sidebar-standard',
  'sidebar-mini',
  'sidebar-dual',
  'sidebar-drawer',
  'elements-overview',
  'sidebar-showcase',
  'reports',
  'messages',
  'calendar',
  'file-manager',
  'smart-cluster',
  'settings',
  'security',
  'page-login',
  'page-register',
  'page-pricing',
  'page-profile',
  'page-invoice',
  'page-kanban',
  'page-status',
  'page-settings',
]);

export class RouteService {
  /**
   * Returns the canonical URL pathname for any `(sectionId, subItemId)` pair.
   */
  public static buildPath(sectionId: string, subItemId?: string): string {
    switch (sectionId) {
      case 'landing':
        return '/';
      case 'docs-guide': {
        const sub =
          subItemId && DOCS_TOPIC_IDS.has(subItemId)
            ? subItemId
            : 'getting-started';
        return `/docs/${sub}`;
      }
      case 'dashboard': {
        const normalized = subItemId?.replace(/^dashboard\//, '');
        const sub =
          normalized && DASHBOARD_VIEW_IDS.has(normalized)
            ? normalized
            : 'overview';
        return `/dashboard/${sub}`;
      }
      case 'components-inputs': {
        const sub =
          subItemId && INPUT_COMPONENT_IDS.has(subItemId)
            ? subItemId
            : 'button';
        return `/components/inputs/${sub}`;
      }
      case 'components-surfaces': {
        const sub =
          subItemId && SURFACE_COMPONENT_IDS.has(subItemId)
            ? subItemId
            : 'card';
        return `/components/surfaces/${sub}`;
      }
      case 'components-feedback': {
        const sub =
          subItemId && FEEDBACK_COMPONENT_IDS.has(subItemId)
            ? subItemId
            : 'chips-badges';
        return `/components/feedback/${sub}`;
      }
      default:
        return '/dashboard/overview';
    }
  }

  /**
   * Returns the canonical URL pathname for a specific component catalog ID.
   */
  public static buildComponentPath(componentId: string): string {
    const sectionId = this.getSectionForComponent(componentId);
    return this.buildPath(sectionId, componentId);
  }

  /**
   * Determines which parent section owns a given component ID.
   */
  public static getSectionForComponent(
    componentId: string
  ): RouteMainSectionId {
    if (INPUT_COMPONENT_IDS.has(componentId)) return 'components-inputs';
    if (SURFACE_COMPONENT_IDS.has(componentId)) return 'components-surfaces';
    return 'components-feedback';
  }

  /**
   * Parses any browser `window.location.pathname` into a valid `ResolvedRouteState`.
   * Returns `null` if the pathname is empty or root `/` so caller can optionally
   * fall back to saved state before normalizing the URL.
   */
  public static parsePath(pathname: string): ResolvedRouteState | null {
    const clean = pathname.replace(/\/+$/, '').trim();
    if (!clean || clean === '') {
      return {
        sectionId: 'landing',
        subItemId: 'home',
        path: '/',
      };
    }

    const parts = clean.split('/').filter(Boolean);
    if (parts.length === 0) {
      return {
        sectionId: 'landing',
        subItemId: 'home',
        path: '/',
      };
    }

    const [first, second, third] = parts;

    if (first === 'home' || first === 'landing') {
      return {
        sectionId: 'landing',
        subItemId: 'home',
        path: '/',
      };
    }

    // 1. /docs/:topic
    if (first === 'docs' || first === 'docs-guide') {
      const sub =
        second && DOCS_TOPIC_IDS.has(second) ? second : 'getting-started';
      return {
        sectionId: 'docs-guide',
        subItemId: sub,
        path: `/docs/${sub}`,
      };
    }

    // 2. /dashboard/:view
    if (first === 'dashboard') {
      const sub =
        second && DASHBOARD_VIEW_IDS.has(second) ? second : 'overview';
      return {
        sectionId: 'dashboard',
        subItemId: sub,
        path: `/dashboard/${sub}`,
      };
    }

    // 3. /components/:category/:componentId OR /components/:componentId
    if (first === 'components') {
      if (second === 'inputs') {
        const sub =
          third && INPUT_COMPONENT_IDS.has(third) ? third : 'button';
        return {
          sectionId: 'components-inputs',
          subItemId: sub,
          path: `/components/inputs/${sub}`,
        };
      }
      if (second === 'surfaces') {
        const sub =
          third && SURFACE_COMPONENT_IDS.has(third) ? second && third : 'card';
        return {
          sectionId: 'components-surfaces',
          subItemId: sub,
          path: `/components/surfaces/${sub}`,
        };
      }
      if (second === 'feedback') {
        const sub =
          third && FEEDBACK_COMPONENT_IDS.has(third) ? third : 'chips-badges';
        return {
          sectionId: 'components-feedback',
          subItemId: sub,
          path: `/components/feedback/${sub}`,
        };
      }

      // Shorthand: /components/button, /components/card, etc.
      if (second) {
        const sectionId = this.getSectionForComponent(second);
        const path = this.buildPath(sectionId, second);
        return {
          sectionId,
          subItemId: second,
          path,
        };
      }
    }

    return null;
  }

  /**
   * Standard SPA link click helper: allows Ctrl/Cmd/Shift/Middle click to open
   * in a new browser tab natively, while intercepting normal left-clicks for
   * instant SPA navigation.
   */
  public static isModifiedClick(
    e: React.MouseEvent<HTMLAnchorElement>
  ): boolean {
    return (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    );
  }
}
