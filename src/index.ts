/**
 * ============================================================================
 * uxiGL — Modular Liquid Glass × Google Material You Design System
 * ============================================================================
 */

// Styles & Tokens
import './styles/uxu-tokens.css';

// 1. Brand Emblem
export { UXILogo, type UXILogoProps } from './components/brand/UXILogo';
export { GithubIcon, type GithubIconProps } from './components/brand/GithubIcon';

// 2. Primitives (Button, Input, Switch, Checkbox, Slider, Badge, Chip, Avatar, Progress, Skeleton, Tooltip, GoogleIcon)
export * from './components/primitives';

// 3. Composites (Card, SegmentedControl, Tabs, Accordion, Modal, CommandPalette, Sidebar, TopHeader, StatCard, DataTable, SheetGLGridAdapter, FileManGLExplorerAdapter, WebGLAuroraCanvas)
export * from './components/composites';
export { SidebarShowcaseView } from './features/showcase/SidebarShowcaseView';
export {
  PageTemplatesShowcaseView,
  type PageTemplateId,
  type PageTemplatesShowcaseViewProps,
} from './features/showcase/PageTemplatesShowcaseView';
export { EnterpriseSettingsPage } from './features/showcase/EnterpriseSettingsPage';
export {
  AnalyticsDashboardView,
  type AnalyticsDashboardViewProps,
} from './features/showcase/AnalyticsDashboardView';

// 4. Providers & Hooks
export { ThemeProvider, useTheme } from './providers/ThemeProvider';
export { ToastProvider, useToast } from './providers/ToastProvider';
export { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
export { useCopyToClipboard } from './hooks/useCopyToClipboard';

// 5. Core Contracts, Tokens & Services
export * from './core/contracts/ComponentContracts';
export * from './core/contracts/NavigationContract';
export * from './core/contracts/NotificationContract';
export * from './core/contracts/ThemeContract';
export * from './core/tokens/designTokens';
export { RouteService } from './core/services/RouteService';
export { CodeGeneratorService } from './core/services/CodeGeneratorService';
export {
  CssVariableThemeEngine,
  buildInheritedSheetGLTheme,
  resolveEffectiveModeTokens,
  generateThemeCssExport,
  hexToHSL,
  getLogoFilterByTheme,
} from './core/services/ThemeEngineService';
export { defaultThemeStorageAdapter } from './core/services/StorageService';
