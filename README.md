# uxiGL — Modular Liquid Glass × Dynamic Tonal Design System

> **Uniting User Experience (UX), User Interface (UI), and Hardware-Accelerated WebGL (`SheetGL` + `FileManGL`) into a Single Enterprise Architecture.**

[![Version](https://img.shields.io/badge/version-2.8.3-0284c7.svg)](https://github.com/umitunc/uxigl)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-10b981.svg)](https://opensource.org/licenses/MIT)

---

## 🎨 Brand Identity & Single-Glyph Monogram (`U` + `X` + `I`)

**`uxiGL`** is part of the `GL` ecosystem alongside **`SheetGL`** and **`FileManGL`**.

The [`UXILogo`](src/components/brand/UXILogo.tsx) emblem reduces the three letters **U**, **X**, and **I** into a **single unified 3D Liquid-Glass glyph**:
1. **`U` — Outer Liquid-Glass Cradle:** The outer continuous ribbon forms a 3D `U` bowl that holds the entire symbol.
2. **`X` — Intersecting Diagonal Blades:** Two crossed diagonal light ribbons (`\ /`) bridge the arms of the `U`.
3. **`I` — Central Crystalline Pillar:** A vertical luminescent spine passes directly through the center of the `X` and `U`, crowned with a floating diamond node (`•`).

---

## ✨ Key Architectural Highlights

1. **Liquid Glass & Standard Materials:**
   - **Liquid Glass (`Regular` & `Clear`):** Reserved strictly for the floating navigation and transient control layer (`Sidebar`, `TopHeader`, `CommandPalette`, `SegmentedControl`, `Slider` & `Switch` thumbs).
   - **Standard Materials (`UltraThin`, `Thin`, `Regular`, `Thick`):** Applied to the content layer (`Card`, `DataTable`, KPI panels) with 4-tier **Vibrancy** (`label-primary`, `label-secondary`, `label-tertiary`, `fill-vibrant`).
2. **Dynamic Tonal Engine & Live `0px–32px` Border Radius Engine:**
   - **6 Seed Color Palettes:** *Sapphire Blue, Royal Iris, Emerald Mint, Solar Coral, Amber Gold, Titanium Mono* with automatic dark/light tonal adaptation.
   - **Live Corner Geometry (`0px–32px`):** Switch between `Sharp (4px)`, `Squircle (12px)`, `Pill (22px)`, or fine-tune any pixel radius (`0px–32px`) from the TopHeader (`R- | R:12px | R+`), Component Playground, or Theme Studio Drawer.
   - **Global Font Scale (`80%–125%`):** Real-time root `rem` scaling persisted in `localStorage`.
3. **Dual Data Table Architecture (`SheetGL` + Native `<DataTable />`):**
   - **`SheetGLGridAdapter` (WebGL/Canvas DataGrid):** Includes **4 enterprise scenarios** (*SaaS & Enterprise Finance*, *AI & Cloud Node Telemetry*, *Workforce & Payroll Matrix*, *Global Logistics & SKU Inventory*) with live formula evaluation, sorting, filtering, and CSV export.
   - **Native `<DataTable />`:** Zero-GPU semantic HTML table with **4 visual variants** (`default`, `striped`, `bordered`, `compact`), column sorting, search filtering, and row selection.
4. **FileManGL WebGL2 Virtual File System (`FileManGLExplorerAdapter`):**
   - Windows 11 tabbed explorer UX, 3D Spatial View (`webgl_spatial`), Disk Treemap (`webgl_diskmap`), and a 5-layer **NTFS ACL + POSIX (`0755`)** permission engine.
5. **Clean HTML5 History API Routing (`RouteService`):**
   - Every navigation item, tab, breadcrumb, and component renders as a semantic `<a href="...">` with clean URLs (`/`, `/dashboard/*`, `/components/*`, `/docs/*`) and full browser Back/Forward (`popstate`) support.
6. **Zero Idle CPU/GPU Resource Footprint & SOLID Principles:**
   - Single-Active-Engine policy ensures only one heavy canvas (`SheetGL` or `FileManGL`) is mounted per view.
   - Strict Dependency Inversion (`ThemeEngineService`, `StorageService`, `RouteService`) and Open/Closed component contracts.
7. **8 Ready-Made Enterprise Page Templates (`PageTemplatesShowcaseView` & `EnterpriseSettingsPage`):**
   - **Login & Auth (`page-login`):** Split-Screen Enterprise SSO + Centered Floating Liquid Glass card, Passkey/WebAuthn & password visibility toggle.
   - **Register & 2FA (`page-register`):** 3-step onboarding (Account -> Workspace Role -> 6-digit OTP verification) with live password strength meter.
   - **SaaS Pricing (`page-pricing`):** Annual/Monthly billing toggle, interactive Team Seat Calculator (`Slider`), 3-tier pricing cards & FAQ `Accordion`.
   - **User Profile (`page-profile`):** Cover banner, online `Avatar`, 4-KPI strip, skill chips, 2FA/security switches, connected devices & activity timeline.
   - **B2B e-Fatura & Checkout (`page-invoice`):** Printable Turkish GİB e-Invoice line-item table with VAT (%20 KDV) breakdown + live interactive Credit Card preview.
   - **Kanban Sprint Board (`page-kanban`):** 4-column agile board (`Backlog`, `In Progress`, `Code Review`, `Completed`) with instant search filter, task creation & column movement.
   - **404, 500 & Live SLA Status (`page-status`):** 404 Not Found, 500 Planned Cluster Maintenance with Trace ID, and 90-day Uptime SLA Telemetry monitor.
   - **Enterprise Settings & Preferences (`page-settings`):** Tabbed workspace configuration (`General`, `Appearance`, `Notifications`, `Security`) directly wired to `ThemeEngineService`, `StorageService`, and persistent workspace preferences.

---

## 🔗 Application Route Map

| URL Route | View / Module | Description |
| :--- | :--- | :--- |
| `/` | `UXILandingPage` | Full-screen `uxiGL` product landing page with live interactive preview & phonetic guide |
| `/dashboard/overview` | `AppleGoogleAppShowcase` | Command Center Overview (KPIs, neural telemetry, native table & SheetGL summary) |
| `/dashboard/analytics` | `AppleGoogleAppShowcase` | Live Analytics & Regional Performance Matrix |
| `/dashboard/analytics-telemetry` | `AnalyticsDashboardView` | Interactive Multi-Scenario KPI Telemetry Dashboard (`SheetGL` Finance ERP, Cloud Telemetry, HR Payroll & Supply Chain) |
| `/dashboard/crm-orders` | `SheetGLGridAdapter` | Full-page SheetGL (4 enterprise presets) + Native `<DataTable />` comparison |
| `/dashboard/file-manager` | `FileManGLExplorerAdapter` | Full-page FileManGL WebGL2 Virtual File System Explorer |
| `/dashboard/page-login` | `PageTemplatesShowcaseView` | Enterprise Split-Screen SSO & Centered Floating Glass Login Demo |
| `/dashboard/page-register` | `PageTemplatesShowcaseView` | 3-Step Registration, Role Onboarding & 6-Digit 2FA OTP Verification Demo |
| `/dashboard/page-pricing` | `PageTemplatesShowcaseView` | SaaS Pricing Plans, Annual Discount Switcher & Interactive Team Seat Calculator |
| `/dashboard/page-profile` | `PageTemplatesShowcaseView` | Developer Portfolio, Security Switches, Connected Devices & Activity Timeline |
| `/dashboard/page-invoice` | `PageTemplatesShowcaseView` | Printable B2B e-Fatura Table & Live Credit Card Checkout Preview |
| `/dashboard/page-kanban` | `PageTemplatesShowcaseView` | 4-Column Agile Sprint & Task Management Board Demo |
| `/dashboard/page-status` | `PageTemplatesShowcaseView` | 404 Not Found, 500 Cluster Maintenance & 90-Day Live Uptime SLA Monitor |
| `/dashboard/page-settings` | `EnterpriseSettingsPage` | Enterprise Workspace Settings, Live Theme/Appearance Sync, Security & Notification Preferences |
| `/dashboard/smart-cluster` | `AppleGoogleAppShowcase` | AI Neural Engine Compilation & Hardware Cluster Controls |
| `/components/inputs/:id` | `InteractivePlayground` | Form Controls (`button`, `input`, `switch`, `checkbox`, `slider`) |
| `/components/surfaces/:id` | `InteractivePlayground` | Surfaces, Navigation & Page Templates (`card`, `segmented-control`, `tabs-accordion`, `sidebar`, `page-templates`, `modal-command`) |
| `/components/feedback/:id` | `InteractivePlayground` | Data & Feedback (`chips-badges`, `progress-avatar`, `datatable-statcard`, `filemangl-explorer`) |
| `/docs/:topic` | `ArchitectureDocsView` | Interactive Documentation (`getting-started`, `theming-tokens`, `layout-shell`, `cli-shortcuts`, `page-templates`) |

---

## 🚀 Quick Start (Single-Command Setup)

### 1. Install `uxiGL` (All-in-One Design System)

```bash
# SheetGL (WebGL DataGrid), FileManGL (WebGL2 VFS) and Lucide Icons are bundled directly!
npm install truncgil-uxigl
# or: pnpm add truncgil-uxigl | yarn add truncgil-uxigl | bun add truncgil-uxigl
```

### 2. Scaffold Ready-to-Use Workspace via NPX

```bash
# Generates a pre-configured <UXIWorkspace /> component & theme setup
npx truncgil-uxigl init
```

### 3. Usage Example

```tsx
import React from 'react';
import {
  ThemeProvider,
  ToastProvider,
  Button,
  Card,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
} from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" defaultRadius={12}>
      <ToastProvider>
        <Card variant="glass" title="uxiGL Enterprise Dashboard">
          <SheetGLGridAdapter datasetPreset="finance-erp" />
        </Card>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

### 4. Local Development & NPM Library Build

```bash
# Start Vite development server
npm run dev

# Run Vitest unit & component test suite
npm test

# Build both demo SPA (dist/index.html) and npm library bundle (dist/lib)
npm run build

# Or compile the npm library & TypeScript declarations only
npm run build:lib

# Run package diagnostics
npm run doctor
```

---

## 📄 License

MIT License • Crafted with ❤️ by [Trunçgil Teknoloji](https://www.truncgil.com)
