# uxiGL Documentation Index

Welcome to the official documentation for **`truncgil-uxigl` (`uxiGL`)** — the Modular Apple HIG Liquid Glass × Google Material You Design System, uniting UX, UI, and Hardware-Accelerated WebGL (`SheetGL` + `FileManGL`) in React.

---

## 📚 Official Documentation Guides

1. [**Complete Component & Engine API Reference (`COMPONENTS_REFERENCE.md`)**](./COMPONENTS_REFERENCE.md)
   Full TypeScript specifications, Props API tables, and code examples for all **36+ components and WebGL engines**:
   - **Form & Action Primitives (12 Modules):** `Button`, `Input`, `CurrencyInput`, `DateTimePickerInput`, `MultiSelectTagInput`, `FileUploadDropzone`, `Select`, `Textarea`, `Switch`, `Checkbox`, `Slider`, `UXILogo`, `GoogleIcon`.
   - **Surfaces, Navigation & Overlays (11 Modules):** `Card`, `SegmentedControl`, `Tabs`, `Accordion`, `Stepper`, `Timeline`, `Modal`, `Drawer`, `Alert`, `CommandPalette`, `TopHeader`, `Sidebar`.
   - **Data, Feedback & WebGL Engines (11 Modules):** `Badge`, `Chip`, `Avatar`, `AvatarGroup`, `Progress`, `Skeleton`, `Tooltip`, `StatCard`, `DataTable`, `Pagination`, `SheetGLGridAdapter`, `FileManGLExplorerAdapter`, `WebGLAuroraCanvas`.

2. [**Architecture, Apple HIG Spatial Grid & Theming Guide (`ARCHITECTURE_AND_THEMING.md`)**](./ARCHITECTURE_AND_THEMING.md)
   Deep dive into:
   - Apple HIG 8pt Spatial Grid (`44px` minimum interactive touch targets, `8px / 16px / 24px / 32px` rhythm).
   - Liquid Glass (`Regular` & `Clear`) vs. Standard Materials (`ultraThin`, `thin`, `regular`, `thick`) & 4-tier Vibrancy.
   - Google Material You (M3) 6 Seed Palettes, Dark/Light/System adaptation, live `0px–32px` Border Radius engine, and `--uxu-*` CSS custom properties.
   - `useTheme()`, `useToast()`, `useKeyboardShortcut()`, `useCopyToClipboard()`, and `RouteService`.

3. [**Ready-Made Enterprise Page Templates & Sidebar Guide (`PAGE_TEMPLATES_GUIDE.md`)**](./PAGE_TEMPLATES_GUIDE.md)
   Step-by-step guide to the **7 Ready-Made Enterprise Page Templates** (`PageTemplatesShowcaseView`) and **5 Sidebar Navigation Architectures** (`Sidebar`):
   - `page-login` (Split-Screen Enterprise SSO + Apple iCloud Centered Floating Glass + Passkey)
   - `page-register` (3-Step Registration, Workspace Role Onboarding & 6-Digit 2FA OTP)
   - `page-pricing` (SaaS Pricing Plans, Annual 20% Discount Switcher & Live Team Seat Calculator)
   - `page-profile` (Developer Portfolio, KPI Strip, Security Switches, Connected Devices & Activity Timeline)
   - `page-invoice` (Printable Turkish GİB B2B e-Fatura Table + Live Credit Card Checkout Preview)
   - `page-kanban` (4-Column Agile Sprint & Task Management Board)
   - `page-status` (404 Not Found, 500 Planned Cluster Maintenance & 90-Day Live Uptime SLA Monitor)

---

## 🌐 Live Interactive Documentation Portal Routes

When running the application (`npm run dev` or at `https://uxigl.truncgil.com`), every documentation chapter is accessible via clean URLs:

| URL Route | Documentation Chapter |
| :--- | :--- |
| `/docs/getting-started` | **1. Kurulum, Mimari & Hızlı Başlangıç** (NPM/NPX CLI, `ThemeProvider`, `ToastProvider`, SOLID Layers) |
| `/docs/form-controls` | **2. Form & Eylem Bileşenleri Rehberi** (12 Components with Live Sandboxes & Props Tables) |
| `/docs/surfaces-navigation` | **3. Yüzey, Kart, Modal & Gezinme Rehberi** (11 Components with Live Sandboxes & Props Tables) |
| `/docs/data-feedback-webgl` | **4. Veri, Geri Bildirim, SheetGL & FileManGL Rehberi** (Badges, Native Table, SheetGL, FileManGL) |
| `/docs/layout-shell` | **5. 5 Farklı Sidebar Mimarisi & Kurumsal Yerleşim** (Stacked, Standard, Mini-Rail, Dual-Column, Drawer) |
| `/docs/page-templates` | **6. 7 Hazır Kurumsal Sayfa Şablonu** (Interactive Login, 2FA, Pricing, Profile, Invoice, Kanban, Status) |
| `/docs/theming-tokens` | **7. Tema Motoru, Apple HIG Materyalleri & CSS Tokenları** (Live Palette, Radius, Font & Token Lab) |
| `/docs/cli-shortcuts` | **8. 5 Yönlü Toast Bildirim Motoru, Kısayollar & Servisler** (`useToast`, `⌘K`, `RouteService`) |

