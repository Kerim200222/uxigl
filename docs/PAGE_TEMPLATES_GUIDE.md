# uxiGL Ready-Made Enterprise Page Templates & Sidebar Guide

`truncgil-uxigl` includes **7 full-page interactive enterprise templates** (`PageTemplatesShowcaseView`) and **5 Sidebar navigation architectures** (`Sidebar` / `SidebarShowcaseView`) ready to drop into SaaS, B2B ERP, FinTech, and cloud admin applications.

---

## 1. Ready-Made Enterprise Page Templates (`<PageTemplatesShowcaseView />`)

### Quick Usage

```tsx
import { useState } from 'react';
import {
  PageTemplatesShowcaseView,
  type PageTemplateId,
} from 'truncgil-uxigl';

export function EnterprisePagesDemo() {
  const [activePage, setActivePage] = useState<PageTemplateId>('page-login');

  return (
    <PageTemplatesShowcaseView
      activePageId={activePage}
      onPageChange={setActivePage}
      onNavigateHome={() => setActivePage('page-login')}
    />
  );
}
```

### Included Templates (`PageTemplateId`)

| Template ID | Route | Features |
| :--- | :--- | :--- |
| `'page-login'` | `/dashboard/page-login` | **Login & Auth:** Switch between **Split-Screen Enterprise SSO** (with live system telemetry brand panel) and **Apple iCloud Centered Floating Liquid Glass** card. Includes Passkey/WebAuthn (Face ID / Touch ID), SSO buttons, and password reveal toggle. |
| `'page-register'` | `/dashboard/page-register` | **Register, Onboarding & 2FA:** 3-step registration wizard: Step 1 (Account + live password strength meter), Step 2 (Workspace slug + Architect/Designer/DevOps/Product role selector), Step 3 (6-digit 2FA OTP input boxes). |
| `'page-pricing'` | `/dashboard/page-pricing` | **SaaS Pricing & Billing Plans:** Annual (20% discount) vs. Monthly `SegmentedControl`, interactive **Team Seat Calculator** (`Slider` from 1 to 50 seats), 3-tier pricing cards (`Starter`, `Pro Studio`, `Enterprise Cloud`), and FAQ `Accordion`. |
| `'page-profile'` | `/dashboard/page-profile` | **User Profile & Portfolio:** Gradient cover banner, squircle `Avatar` with online dot, 4-KPI strip, bio & skill `Chip`s, 2FA/security `Switch` controls, active session devices, and activity `Timeline`. |
| `'page-invoice'` | `/dashboard/page-invoice` | **B2B e-Fatura & Credit Card Checkout:** Printable Turkish GİB e-Invoice line-item table with 20% KDV breakdown + interactive Credit Card live preview and one-click payment. |
| `'page-kanban'` | `/dashboard/page-kanban` | **Kanban Sprint & Task Board:** 4 agile columns (`Backlog`, `In Progress`, `Code Review`, `Completed`), live task search filter, new task creation form, progress bars, and `←` / `→` column movement. |
| `'page-status'` | `/dashboard/page-status` | **404, 500 Maintenance & Live SLA Status:** 3 tabs featuring `404 Not Found`, `500 Planned Cluster Maintenance` (with copyable Trace ID), and a `90-Day Live Uptime SLA Monitor` across global edge nodes. |

---

## 2. 5 Sidebar Navigation Architectures (`<Sidebar />`)

| Variant (`SidebarVariant`) | Width (`8pt` Grid) | Best Used For |
| :--- | :--- | :--- |
| `'stacked-vertical'` | `88px` | Operational telemetry & dark studio dashboards with centered icon above concise 1-word label (`22px` icon, `8px` item gap) |
| `'standard'` | `256px` | Classic enterprise admin systems with collapsible accordion sub-menus, badges, and `⌘K` search bar |
| `'mini-rail'` | `64px` | Maximum horizontal canvas space for wide `SheetGL` spreadsheets and `FileManGL` dual-pane explorers (`22px` centered icons) |
| `'dual-column'` | `68px + 208px` (`276px`) | Deep multi-workspace applications: left `68px` primary module rail (`48×48px` buttons) + right `208px` sub-navigation tree |
| `'drawer'` | `280px` (Off-Canvas) | Mobile viewports and distraction-free full-screen focus modes |

