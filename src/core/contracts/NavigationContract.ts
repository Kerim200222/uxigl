import type { ReactNode } from 'react';
import type { IdentifiableProps, SemanticTone } from './ComponentContracts';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — SIDEBAR & HIERARCHICAL NAVIGATION CONTRACTS (ISP & OCP)
 * ============================================================================
 * Adheres to:
 * - [I] Interface Segregation Principle (ISP): Focused contracts for hierarchical
 *   navigation items, sub-menus, and breadcrumbs.
 * - [O] Open/Closed Principle (OCP): Sidebar menu tree is data-driven and
 *   extensible without modifying the Sidebar component implementation.
 */

export type SidebarVariant =
  | 'standard'
  | 'mini-rail'
  | 'stacked-vertical'
  | 'dual-column'
  | 'drawer';

export interface SidebarSubMenuItem {
  id: string;
  label: string;
  href?: string;
  badge?: string | number;
  badgeTone?: SemanticTone;
  dotColor?: string;
  icon?: ReactNode;
}

export interface SidebarNavItem {
  id: string;
  label: string;
  href?: string;
  icon: ReactNode;
  badge?: string | number;
  badgeTone?: SemanticTone;
  subItems?: SidebarSubMenuItem[];
  /** Subtitle / status text (e.g. 'Active', 'Live', '12 online' for stacked vertical rail) */
  subLabel?: string;
  /** Custom accent color override for active indicator */
  accentColor?: string;
}

export interface SidebarNavGroup {
  id: string;
  title: string;
  items: SidebarNavItem[];
  icon?: ReactNode;
  railLabel?: string;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface SidebarProps extends IdentifiableProps {
  groups: SidebarNavGroup[];
  activeItemId: string;
  activeSubItemId?: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onSelect: (itemId: string, subItemId?: string) => void;
  onOpenCommandPalette: () => void;
  onOpenThemeStudio: () => void;
  /** Sidebar layout variant: standard (açık), mini-rail (kapalı), stacked-vertical (dikey ikon-etiket), dual-column (tam açık çift kolon), drawer (tam kapalı off-canvas) */
  variant?: SidebarVariant;
  /** Accent color for active indicator (e.g. '#F59E0B' for gold glow) */
  accentColor?: string;
  /** For 'drawer' variant: whether off-canvas drawer is visible */
  drawerOpen?: boolean;
  /** For 'drawer' variant: callback to close off-canvas drawer */
  onCloseDrawer?: () => void;
  /** Secondary navigation groups for dual-column mode */
  secondaryGroups?: SidebarNavGroup[];
  /** Custom Brand Title (e.g. 'Qmi' or 'Stellar Qmi') */
  brandTitle?: ReactNode;
  /** Custom Brand Subtitle (e.g. 'QA / QC / QMS' or 'Enterprise Quality') */
  brandSubtitle?: ReactNode;
  /** Custom Brand Badge (e.g. '2.0' or 'QMS') */
  brandBadge?: ReactNode;
  /** Custom Brand Logo element */
  brandLogo?: ReactNode;
  /** Custom Brand Click handler */
  onBrandClick?: () => void;
}
