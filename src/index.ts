/**
 * ============================================================================
 * uxiGL — Modular Liquid Glass × Google Material You Design System
 * ============================================================================
 */
import './styles/uxu-tokens.css';

// 1. Brand Emblems
export { UXILogo, type UXILogoProps } from './components/brand/UXILogo';
export { GithubIcon, type GithubIconProps } from './components/brand/GithubIcon';

// 2. Primitives & Composites
export * from './components/primitives';
export * from './components/composites';

// 3. Showcase & Demo Templates
export { SidebarShowcaseView } from './features/showcase/SidebarShowcaseView';
export {
  PageTemplatesShowcaseView,
  type PageTemplateId,
  type PageTemplatesShowcaseViewProps,
} from './features/showcase/PageTemplatesShowcaseView';
export {
  LoginPage,
  RegisterPage,
  PricingPage,
  ProfilePage,
  InvoicePage,
  KanbanPage,
  StatusPage,
  type LoginPageProps,
  type RegisterPageProps,
  type PricingPageProps,
  type StatusPageProps,
} from './features/showcase/pages';
export { EnterpriseSettingsPage } from './features/showcase/EnterpriseSettingsPage';
export {
  AnalyticsDashboardView,
  type AnalyticsDashboardViewProps,
} from './features/showcase/AnalyticsDashboardView';
export {
  AnalyticsDashboardView as EnterpriseGLTemplate,
} from './features/showcase/AnalyticsDashboardView';
export {
  FlowWorkspaceDemo as FlowGLTemplate,
  FlowWorkspaceDemo,
  type FlowWorkspaceDemoProps,
} from './features/demos/FlowWorkspaceDemo';
export {
  CargoGLDemo as CargoGLTemplate,
  CargoGLDemo,
  type CargoGLDemoProps,
} from './features/demos/CargoGLDemo';
export {
  SynthGLDemo as SynthGLTemplate,
  SynthGLDemo,
  type SynthGLDemoProps,
} from './features/demos/SynthGLDemo';
/**
 * @deprecated Showcase demo only — use `OSGLApp` or `OSWorkspaceShell` for real applications.
 */
export {
  OSGLDemo as OSGLTemplate,
  OSGLDemo as MacOSGLTemplate,
  OSGLDemo,
  type OSGLDemoProps,
  type OSWallpaperId as OSGLDemoWallpaperId,
  type IconBgStyle as OSGLDemoIconBgStyle,
} from './features/demos/OSGLDemo';
export {
  TesseraGLDemo as TesseraGLTemplate,
  TesseraGLDemo,
  type TesseraGLDemoProps,
} from './features/demos/TesseraGLDemo';

// 4. Parametric OSGL Workspace Engine & Theme Studio
export * from './features/osgl';
export {
  ThemeStudioDrawer,
  type ThemeStudioDrawerProps,
} from './features/theme-studio/ThemeStudioDrawer';
export {
  WorkspaceShellGallery,
} from './features/theme-studio/WorkspaceShellGallery';

// 5. Providers & Hooks
export {
  ThemeProvider,
  useTheme,
  useOptionalTheme,
  type ThemeProviderProps,
} from './providers/ThemeProvider';
export {
  ToastProvider,
  useToast,
  useOptionalToast,
} from './providers/ToastProvider';
export { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
export { useCopyToClipboard } from './hooks/useCopyToClipboard';

// 6. Core Contracts, Tokens & Services
export * from './core/contracts/ComponentContracts';
export * from './core/contracts/NavigationContract';
export * from './core/contracts/NotificationContract';
export * from './core/contracts/ThemeContract';
export * from './core/tokens/designTokens';
export * from './core/tokens/workspaceShellPresets';
export { RouteService } from './core/services/RouteService';
export { CodeGeneratorService } from './core/services/CodeGeneratorService';
export {
  CssVariableThemeEngine,
  type CssVariableThemeEngineOptions,
  buildInheritedSheetGLTheme,
  resolveEffectiveModeTokens,
  generateThemeCssExport,
  hexToHSL,
  hexToRgba,
  blendHexColors,
  getLogoFilterByTheme,
} from './core/services/ThemeEngineService';
export { defaultThemeStorageAdapter } from './core/services/StorageService';
