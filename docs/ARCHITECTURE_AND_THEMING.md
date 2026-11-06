# uxiGL Architecture, Apple HIG Spatial Grid & Theming Guide

`truncgil-uxigl` is engineered around **SOLID principles**, **Apple Human Interface Guidelines (HIG) 8pt spatial metrics**, **Liquid Glass & Standard Materials**, and **Google Material You (M3) dynamic tonal color generation**.

---

## 1. Apple HIG 8pt Spatial Grid & Touch Target Standards

Every container, card, sidebar rail, and interactive control adheres to the 8pt spatial grid:

- **Spatial Rhythm (`8px` Multiples):**
  - `--uxu-space-1`: `4px` (0.5x micro gap)
  - `--uxu-space-2`: `8px` (1x base unit)
  - `--uxu-space-3`: `12px` (1.5x compact inset)
  - `--uxu-space-4`: `16px` (2x standard Apple iOS/macOS margin & card padding)
  - `--uxu-space-5`: `24px` (3x standard desktop card & viewport padding)
  - `--uxu-space-6`: `32px` (4x major section separation)
- **Minimum Hit Target (`44px × 44px`):**
  - Primary interactive buttons, sidebar rail buttons, and mobile touch controls maintain a minimum hit region of `44px` (`36px–44px` on desktop depending on `UIDensity`).

---

## 2. Apple HIG Materials: Liquid Glass vs. Standard Materials

Following Apple's Human Interface Guidelines on Materials:

1. **Liquid Glass (`Regular` & `Clear`):**
   - Reserved strictly for the **floating navigation and transient control layer** (`Sidebar`, `TopHeader`, `CommandPalette`, `SegmentedControl` sliding thumb, and active `Slider`/`Switch` thumbs).
   - Features optical lensing, specular top-edge highlights (`--uxu-glass-specular`), and adaptive backdrop blur (`--uxu-glass-blur`).
2. **Standard Materials (`ultraThin`, `thin`, `regular`, `thick`):**
   - Applied to the **content layer** (`Card`, `DataTable`, KPI panels) with 4-tier **Vibrancy** (`--uxu-vibrancy-label`, `--uxu-vibrancy-secondary-label`, `--uxu-vibrancy-tertiary-label`, `--uxu-vibrancy-fill`).

---

## 3. Google Material You (M3) & Live Theme Engine (`useTheme()`)

### 6 Built-In Seed Color Palettes
1. `cupertino-blue` — Apple iOS/macOS System Blue (`#0284C7` / `#38BDF8`)
2. `material-iris` — Google Material 3 Indigo/Violet (`#4F46E5` / `#818CF8`)
3. `emerald-mint` — FinTech & Sustainability Emerald (`#059669` / `#34D399`)
4. `sunset-coral` — Warm Creative Coral (`#E11D48` / `#FB7185`)
5. `amber-gold` — Industrial Telemetry Amber (`#D97706` / `#FBBF24`)
6. `graphite-mono` — Pro Studio Neutral Monochrome (`#475569` / `#94A3B8`)

### `useTheme()` Hook API

```tsx
import { useTheme } from 'truncgil-uxigl';

const {
  preferences,        // Current ThemePreferences state
  resolvedMode,       // 'dark' | 'light'
  activePalette,      // Active SeedPaletteDefinition
  availablePalettes,  // All 6 SeedPaletteDefinitions
  setMode,            // (mode: 'dark' | 'light' | 'system') => void
  toggleMode,         // () => void
  setSeedPalette,     // (id: SeedPaletteId) => void
  setRadiusScale,     // (scale: 'sharp' | 'squircle' | 'pill') => void
  setCustomRadiusPx,  // (px: number) => void (0px to 32px)
  setDensity,         // (density: 'compact' | 'comfortable' | 'spacious') => void
  setFontScale,       // (scale: number) => void (0.85 to 1.15)
  setFontFamilyPreset,// (preset: FontFamilyPreset) => void
  setGlassIntensity,  // (intensity: number) => void (15 to 100)
  setWebglEnabled,    // (enabled: boolean) => void
  setWebglPreset,     // (preset: 'aurora' | 'nebula' | 'cyber-grid' | 'liquid-metal') => void
} = useTheme();
```

---

## 4. Multi-Viewport Toast Engine (`useToast()`)

Trigger notifications in any of the **5 screen positions** (`top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-right`) and **6 tones** (`primary`, `success`, `warning`, `danger`, `info`, `glass`):

```tsx
import { useToast } from 'truncgil-uxigl';

const { notify, dismiss, clearAll } = useToast();

notify({
  title: 'e-Fatura Onaylandı',
  description: 'GİB zarfı başarıyla imzalandı.',
  tone: 'success',
  placement: 'bottom-right',
  durationMs: 4000,
  actionLabel: 'Görüntüle',
  onAction: () => {},
});
```
