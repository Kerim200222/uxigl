# uxiGL Complete Component & Engine API Reference

This document provides the complete TypeScript Props API and usage examples for all primitives, composites, and WebGL engines in **`truncgil-uxigl`**.

---

## 1. Form & Action Primitives

### 1.1 `<Button />`
8 visual variants, Switch/Toggle mode (`toggleable`), Collapse/Expand mode (`collapsible`), Split action dropdown (`splitAction`), and Icon-Only mode.

```tsx
import { Button } from 'truncgil-uxigl';
import { Sparkles, Download } from 'lucide-react';

<Button variant="filled" leadingIcon={<Sparkles size={15} />}>Kaydet</Button>
<Button variant="glass" toggleable statusDot pressed={isSync} onToggle={setIsSync}>
  Canlı Senkronizasyon
</Button>
<Button
  variant="filled"
  leadingIcon={<Download size={14} />}
  splitAction
  splitItems={[
    { id: 'xlsx', label: 'Excel (.xlsx) İndir' },
    { id: 'csv', label: 'CSV (.csv) İndir' },
  ]}
>
  Dışa Aktar
</Button>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'filled' \| 'tonal' \| 'glass' \| 'outlined' \| 'ghost' \| 'success' \| 'warning' \| 'danger'` | `'filled'` | Visual surface and semantic tone |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Button height & padding on 8pt grid |
| `toggleable` | `boolean` | `false` | Converts button into a stateful switch toggle (`aria-pressed`) |
| `collapsible` | `boolean` | `false` | Adds rotating chevron & badge counter (`aria-expanded`) |
| `splitAction` | `boolean` | `false` | Enables secondary dropdown menu trigger via `splitItems` |
| `loading` | `boolean` | `false` | Renders spinner and sets `aria-busy="true"` |

---

### 1.2 `<Input />`
Text input implementing `FormControlContract<string>` (`value` + `onChange(nextValue: string)`), featuring 5 built-in masks (`phone`, `credit-card`, `date`, `tax-id`, `iban`), `floatingLabel`, `clearable`, password reveal toggle, and character counter.

```tsx
import { Input } from 'truncgil-uxigl';
import { Phone } from 'lucide-react';

<Input
  label="Kurumsal Telefon"
  mask="phone"
  value={phone}
  onChange={setPhone}
  leadingIcon={<Phone size={15} />}
  clearable
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | Required | Controlled string value |
| `onChange` | `(nextValue: string) => void` | Required | Direct string value change callback |
| `surface` | `'glass' \| 'tonal' \| 'filled' \| 'outlined'` | `'glass'` | Material surface variant |
| `mask` | `'none' \| 'phone' \| 'credit-card' \| 'date' \| 'tax-id' \| 'iban'` | `'none'` | Automatic input formatting mask |
| `floatingLabel` | `boolean` | `false` | Animates label inside the input box |
| `validationState` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Semantic border and helper text state |
| `clearable` | `boolean` | `false` | Shows one-click clear (`×`) button |
| `showCharacterCount` | `boolean` | `false` | Displays live character count (`maxLength`) |

---

### 1.3 Enterprise B2B Inputs (`<CurrencyInput />`, `<DateTimePickerInput />`, `<MultiSelectTagInput />`, `<FileUploadDropzone />`)

```tsx
import {
  CurrencyInput,
  DateTimePickerInput,
  MultiSelectTagInput,
  FileUploadDropzone,
} from 'truncgil-uxigl';

<CurrencyInput
  label="Fatura Tutarı"
  value={148500}
  onChange={setAmount}
  currency="TRY"
  onCurrencyChange={setCurrency}
  vatRate={20}
  showVatBreakdown
/>

<DateTimePickerInput
  label="Vade Tarihi"
  dateValue="2026-11-15"
  timeValue="14:30"
  onDateChange={setDate}
  onTimeChange={setTime}
  showPresets
/>

<MultiSelectTagInput
  label="Etiketler"
  tags={tags}
  onChange={setTags}
  maxTags={8}
/>

<FileUploadDropzone
  label="Belge & e-Fatura Ekleri"
  files={files}
  onChange={setFiles}
  maxSizeMb={25}
/>
```

---

### 1.4 `<Select />`, `<Textarea />`, `<Switch />`, `<Checkbox />`, `<Slider />`

| Component | Key Props | Description |
| :--- | :--- | :--- |
| `<Select />` | `value`, `onChange`, `options: { value, label, description?, badge? }[]`, `surface` | Dropdown selector with per-option badge and subtitle |
| `<Textarea />` | `value`, `onChange`, `rows`, `maxLength`, `showCharacterCount`, `quickTemplates: string[]` | Multi-line text field with quick-insert template pills |
| `<Switch />` | `value: boolean`, `onChange: (next: boolean) => void`, `label`, `description`, `tone`, `size` | Apple HIG spring thumb with transient Liquid Glass lens |
| `<Checkbox />` | `value: boolean`, `indeterminate?: boolean`, `onChange`, `label`, `description`, `tone` | Animated SVG checkmark and partial (`-`) selection state |
| `<Slider />` | `value: number`, `onChange: (next: number) => void`, `min`, `max`, `step`, `showTicks`, `valueSuffix` | macOS Control Center slider with tick marks |

---

### 1.5 `<UXILogo />` & `<GoogleIcon />`

```tsx
import { UXILogo, GoogleIcon } from 'truncgil-uxigl';

<UXILogo size={42} preserveRatio glow />
<GoogleIcon name="dashboard" tone="primary" size={24} iconStyle="rounded" filled />
```

---

## 2. Surfaces, Dialogs & Navigation Composites

| Component | Key Props | Description |
| :--- | :--- | :--- |
| `<Card />` | `variant: 'glass' \| 'tonal' \| 'elevated' \| 'outlined'`, `padding`, `eyebrow`, `title`, `subtitle`, `headerIcon`, `headerAction`, `footer`, `interactive`, `glowOnHover` | Multi-layered Apple HIG × Material 3 surface container |
| `<SegmentedControl<T> />` | `value: T`, `onChange: (next: T) => void`, `options: { value, label, icon?, badge?, href? }[]`, `fullWidth`, `size` | Sliding pill switcher with semantic `<a>` link support |
| `<Tabs />` | `activeId`, `onChange`, `variant: 'underline' \| 'pill'`, `items: { id, label, icon?, count? }[]` | Horizontal tab bar with counters |
| `<Accordion />` | `items: { id, title, subtitle?, icon?, content }[]`, `allowMultiple`, `defaultExpandedIds`, `variant` | Single or multi-expand collapsible disclosure panels |
| `<Stepper />` | `steps: { id, title, subtitle?, meta? }[]`, `activeStep: number`, `onStepClick` | Interactive multi-step wizard progress bar |
| `<Timeline />` | `items: { id, title, description?, timestamp?, tone?, badge? }[]` | Chronological audit log and activity stream |
| `<Modal />` | `open`, `onClose`, `variant: 'default' \| 'confirm' \| 'danger' \| 'alert' \| 'sheet' \| 'glass'`, `showMacTrafficLights`, `title`, `subtitle`, `footer` | 6 enterprise dialog archetypes with ESC & backdrop dismissal |
| `<Drawer />` | `open`, `onClose`, `placement: 'right' \| 'left' \| 'bottom'`, `title`, `subtitle`, `footer` | 3-direction slide-over inspector panel |
| `<Alert />` | `tone: 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'glass'`, `title`, `description`, `dismissible` | Inline status and warning banner |
| `<CommandPalette />` | `open`, `onClose`, `actions: CommandActionItem[]` | Global `⌘K` / `Ctrl+K` Spotlight search modal |
| `<Sidebar />` | `variant: 'stacked-vertical' \| 'standard' \| 'mini-rail' \| 'dual-column' \| 'drawer'`, `groups`, `activeItemId`, `activeSubItemId`, `accentColor`, `onSelect` | 5-mode enterprise navigation backbone |
| `<TopHeader />` | `breadcrumbs`, `activeRoutePath`, `sidebarVariant`, `onOpenCommandPalette`, `onOpenThemeStudio` | Top workspace bar with live `0–32px` radius & font scaling controls |

---

## 3. Data, Feedback & WebGL Engines

| Component | Key Props | Description |
| :--- | :--- | :--- |
| `<Badge />` | `tone`, `variant: 'filled' \| 'tonal' \| 'glass' \| 'outlined'`, `pulse`, `size`, `pill` | Status indicator badge with live pulsing dot |
| `<Chip />` | `selected`, `onClick`, `onRemove`, `tone`, `size`, `leadingIcon` | Material 3 interactive filter & selection chip |
| `<Avatar />` & `<AvatarGroup />` | `name`, `src`, `shape: 'squircle' \| 'circle'`, `status: 'online' \| 'busy' \| 'away' \| 'offline'`, `max` | Squircle/circle user avatar and stacked overflow group |
| `<Progress />` | `variant: 'linear' \| 'circular'`, `value`, `indeterminate`, `speed`, `tone`, `size` | Linear bar and circular SVG progress ring |
| `<Skeleton />` | `variant: 'text' \| 'circular' \| 'rectangular' \| 'squircle'`, `width`, `height`, `animated`, `speed` | Shimmer loading placeholder |
| `<Tooltip />` | `content`, `shortcut`, `placement` | Floating glass tooltip with keyboard shortcut badge |
| `<StatCard />` | `label`, `value`, `delta`, `trend: 'up' \| 'down' \| 'neutral'`, `sparklineData: number[]`, `tone` | KPI metric card with SVG sparkline |
| `<DataTable<T> />` & `<Pagination />` | `rowKey`, `variant: 'default' \| 'striped' \| 'bordered' \| 'minimal'`, `size`, `selectable`, `searchable`, `columns`, `data` | Zero-WebGL lightweight semantic HTML `<table>` |
| `<SheetGLGridAdapter />` | `datasetPreset: 'finance-erp' \| 'cloud-telemetry' \| 'hr-payroll' \| 'inventory-supply'`, `initialRowCount`, `height`, `showPresetSwitcher` | 120 FPS WebGL/Canvas spreadsheet & enterprise DataGrid |
| `<FileManGLExplorerAdapter />` | `height` | WebGL2 3D Spatial & Sunburst Disk Map VFS file manager |
| `<WebGLAuroraCanvas />` | Controlled via `useTheme()` (`webglEnabled`, `webglPreset`, `webglIntensity`) | Hardware-accelerated GLSL shader background (`aurora`, `nebula`, `cyber-grid`, `liquid-metal`) |
