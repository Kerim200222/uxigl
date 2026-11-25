# OSGL Desktop Workspace Engine Guide (TR / EN)

> **Live Interactive Portal:** `/docs/osgl-workspace`  
> **Primary Export:** `OSWorkspaceShell` from `truncgil-uxigl` (`src/features/osgl/OSWorkspaceShell.tsx`)

---

## 1. Genel Bakış / Overview

**[TR]**  
Yeni bir uygulamaya OSGL’nin tüm masaüstü yeteneklerini (pencere yöneticisi, klasörler, Dock, widget’lar, WebGL duvar kağıtları, Tema Stüdyosu, Spotlight ve mobil başlatıcı) eksiksiz taşımak için vitrin kabuğu olan `OSGLTemplate` yerine parametrik **`OSWorkspaceShell`** motorunu kullanın.

**[EN]**  
To carry all OSGL desktop capabilities (WASM window manager, desktop folders, Dock, widgets, WebGL wallpapers, OS Theme Studio, Spotlight, and mobile launcher) into a new application, import the parametric **`OSWorkspaceShell`** engine rather than the showcase demo wrapper `OSGLTemplate`.

---

## 2. Hızlı Kurulum / Quick Start

### Tek Satır Anahtar Teslim Kurulum (`<OSGLApp />`)
`ThemeProvider`, `ToastProvider`, 6 yerleşik masaüstü widget'ı, Global Tema Stüdyosu ve Klasik Sidebar geçişi otomatik dahildir:

```tsx
import { OSGLApp, type OSWorkspaceApp } from 'truncgil-uxigl';
import 'truncgil-uxigl/styles';

const APPS: OSWorkspaceApp[] = [
  {
    id: 'analytics',
    label: 'Canlı Telemetri',
    shortLabel: 'Telemetri',
    googleIcon: 'monitoring',
    category: 'Operasyon',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    defaultOpen: true,
    element: <div>Analytics Content</div>,
  },
];

export function App() {
  return <OSGLApp apps={APPS} storageScopeKey="my-app-os" brandTitle="MyWorkspace" />;
}
```

### İleri Seviye Parametrik Kurulum (`<OSWorkspaceShell />`)

```tsx
import React, { useState } from 'react';
import {
  ThemeProvider,
  ToastProvider,
  OSWorkspaceShell,
  FocusTimerWidget,
  FOCUS_TIMER_SIZE_PRESETS,
  FOCUS_TIMER_CUSTOM_FIELDS,
  type OSWorkspaceApp,
  type OSDesktopWidgetDefinition,
} from 'truncgil-uxigl';

const APPS: OSWorkspaceApp[] = [
  {
    id: 'analytics',
    label: 'Canlı Telemetri',
    shortLabel: 'Telemetri',
    googleIcon: 'monitoring',
    category: 'Operasyon',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    defaultSize: { width: 920, height: 600 },
  },
  {
    id: 'files',
    label: 'FileManGL',
    shortLabel: 'Dosyalar',
    googleIcon: 'folder_open',
    category: 'Depolama',
    gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    fullBleed: true,
  },
];

const WIDGETS: OSDesktopWidgetDefinition[] = [
  {
    id: 'focus-timer',
    labelTr: 'Odak Sayacı',
    labelEn: 'Focus Timer',
    defaultEnabled: true,
    defaultSize: { width: 360, height: 190 },
    sizePresets: FOCUS_TIMER_SIZE_PRESETS,
    customFields: FOCUS_TIMER_CUSTOM_FIELDS,
    render: (ctx) => <FocusTimerWidget ctx={ctx} storageScopeKey="my-app-os" />,
  },
];

export function App() {
  const [openReq, setOpenReq] = useState<{ appId: string; nonce: number } | null>(null);

  return (
    <ThemeProvider defaultMode="dark" defaultPalette="cupertino-blue">
      <ToastProvider>
        <OSWorkspaceShell
          apps={APPS}
          dockAppIds={['analytics', 'files']}
          widgets={WIDGETS}
          storageScopeKey="my-app-os"
          initialWallpaper="dijios-oxford"
          brandTitle="MyWorkspace"
          brandSubtitle="OSGL"
          externalOpenRequest={openReq}
          onOpenGlobalThemeStudio={() =>
            setOpenReq({ appId: 'os-theme-studio', nonce: Date.now() })
          }
          renderWindowContent={(appId) => <div>Active Module: {appId}</div>}
        />
      </ToastProvider>
    </ThemeProvider>
  );
}
```

---

## 3. `OSWorkspaceShellProps` API

| Prop | Type | Default | Description (TR / EN) |
| :--- | :--- | :--- | :--- |
| `apps` *(required)* | `OSWorkspaceApp[]` | — | **TR:** Masaüstü, Dock, Üst Menü ve Spotlight (⌘K) modül listesi.<br>**EN:** Application modules shown on Desktop, Dock, Top Bar, and Spotlight. |
| `renderWindowContent` *(required)* | `(appId: string) => React.ReactNode` | — | **TR:** Her pencere ve mobil tam ekran sayfası için içerik üreticisi.<br>**EN:** Content renderer for floating windows and mobile active sheets. |
| `dockAppIds` | `string[]` | First 6 apps | **TR:** Varsayılan sabitlenmiş Dock simgeleri.<br>**EN:** Default pinned Dock app IDs. |
| `widgets` | `OSDesktopWidgetDefinition[]` | `[]` | **TR:** 20px ızgaraya oturan masaüstü widget tanımları.<br>**EN:** Desktop widget definitions snapping to a 20px grid. |
| `storageScopeKey` | `string` | `'default'` | **TR:** `localStorage` kalıcılık kapsam anahtarı (`uxu.osgl.state.v4.<scope>`).<br>**EN:** Scoped persistence key (`uxu.osgl.state.v4.<scope>`). |
| `initialWallpaper` | `OSWallpaperId` | `'dijios-oxford'` | **TR:** Başlangıç WebGL duvar kağıdı.<br>**EN:** Initial WebGL Aurora shader wallpaper. |
| `brandLogo` / `brandTitle` / `brandSubtitle` | `ReactNode / string / string` | `'uxiGL'` | **TR:** Üst Menü Çubuğu sol marka alanı.<br>**EN:** Top Menu Bar left brand slot. |
| `headerRightSlot` / `topBannerSlot` | `ReactNode` | `undefined` | **TR:** Üst sağ tepsi önü ve üst çubuk altı özel alanlar.<br>**EN:** Custom slots before the top-right tray or below the Top Menu Bar. |
| `onSwitchToClassic` | `() => void` | `undefined` | **TR:** Klasik arayüz düzenine dönüş geri çağrısı.<br>**EN:** Callback to switch back to classic shell layout. |
| `onOpenGlobalThemeStudio` | `() => void` | `undefined` | **TR:** Global Tema Stüdyosu çekmecesini açma geri çağrısı.<br>**EN:** Callback to open the global Theme Studio drawer. |
| `externalOpenRequest` | `{ appId: string; nonce: number } \| null` | `null` | **TR:** Dışarıdan programatik pencere açma/odaklama tetikleyicisi.<br>**EN:** Programmatic trigger to open/focus a window externally. |

---

## 4. `OSWorkspaceApp` Sözleşmesi / Contract

- `id`, `label`, `shortLabel`: Benzersiz kimlik, tam pencere başlığı ve kısa simge etiketi.
- `googleIcon` / `iconNode`: Material Symbols ikon adı veya özel React ikonu.
- `category` / `gradient`: Üst menü/Spotlight kategori grubu ve canlı ikon gradyanı.
- `badge` / `description`: İkon rozeti ve mobil/Spotlight açıklaması.
- `fullBleed`: `true` olduğunda pencere iç boşluğu kaldırılır (`SheetGL`, `FileManGL`).
- `defaultSize` / `defaultMaximized`: İlk açılış boyutu veya tam ekran başlangıcı.

---

## 5. Tüm Yerleşik Özellikler / Complete Feature Inventory

### 5.1 WASM Pencere Yöneticisi (`osWasmEngine` & `useWindowManager`)
- **8 Yönlü Boyutlandırma:** `n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw` tutamaçları (min `380×220px`).
- **7 Snap Bölgesi:** `maximize`, `left-half`, `right-half`, `top-left`, `top-right`, `bottom-left`, `bottom-right`.
- **4 Düzenleme Modu:** `cascade`, `grid`, `side-by-side`, `quadrants` (2×2).
- **Kontrol Tarafı (`windowControlsSide`):** `'right'` (Windows/Linux) veya `'left'` (macOS trafik ışıkları).
- **Kalıcı Pencere Boyutları:** `windowBoundsByApp` + viewport yeniden boyutlandırma koruması (`clampWindowToViewport`).

### 5.2 Masaüstü Izgarası, Klasörler & Sağ Tık Menüleri
- **Serbest Slot Izgarası (`DesktopGrid`):** Sütun öncelikli `iconSlots` yerleşimi, canlı bırakma önizlemesi ve sürükle-bırak sıralama.
- **Marquee Çoklu Seçim:** Boş alana sürükleyerek birden fazla uygulamayı seçme, topluca açma veya klasörleme.
- **Klasör Sistemi (`DesktopFolderPopoverModal`):** Seçili uygulamalardan veya boş alandan klasör oluşturma, simgeyi klasör üzerine bırakma, satır içi adlandırma, 6 renk etiketi (`FOLDER_COLOR_PRESETS`) ve klasörü masaüstüne dağıtma.
- **Bağlamsal Menüler (`ContextMenu` & `ItemContextMenu`):** Masaüstü, uygulama simgesi, klasör ve Dock simgesi için ayrı akıllı sağ tık menüleri.

### 5.3 Akıllı Dock (`Dock`, `DockCustomizerPopover`, `useDockMagnification`)
- İmleç mesafesine duyarlı macOS büyütme animasyonu ve açık pencere gösterge noktaları.
- Masaüstünden Dock’a sürükleyerek sabitleme, Dock içi sürükle-bırak sıralama.
- Sabitlenmemiş açık uygulamaların Dock sağ bölümünde otomatik gösterimi.
- Hızlı Yan Yana / Izgara / Tümünü Kapat eylemleri ve `DockCustomizerPopover`.

### 5.4 Masaüstü Widget’ları & `FocusTimerWidget`
- **20px Izgara:** `WIDGET_GRID_STEP = 20`, genişlik `220–560px`, yükseklik `96–540px`.
- **Özelleştirme (`WidgetCustomizePopover`):** `glass | solid | tinted` yüzey, 7 vurgu rengi (`WIDGET_ACCENT_SWATCHES`), özel başlık, `small | medium | large` önayarları ve `WidgetCustomField` seçenekleri.
- **Otomatik Gizleme:** Tam ekran/büyütülmüş veya widget alanıyla çakışan pencere açıldığında widget’lar otomatik gizlenir.
- **Yerleşik `FocusTimerWidget`:** 5/15/25 dk + sınırsız özel dakika, SVG ilerleme halkası, Web Audio API zil sesi ve otomatik döngü.

### 5.5 WebGL Duvar Kağıtları & OS Tema Stüdyosu (`os-theme-studio`)
- **7 WebGL Sahnesi (`OSWallpaperId`):** `dijios-oxford`, `sequoia`, `sonoma`, `ventura`, `monterey`, `bigsur`, `midnight`.
- **4 Arka Plan Modu (`BgMode`):** `aurora`, `gradient`, `solid`, `image` (URL veya dosya yükleme).
- **6 Simge Stili (`IconBgStyle`):** `vivid`, `gradient`, `soft`, `glass`, `sun`, `mono` + `44–84px` boyut ayarı.
- **Otomatik `os-theme-studio` Penceresi:** Görünüm, Duvar Kağıdı, Masaüstü & Dock, Simgeler, Yazı Tipi, Performans & Sıfırla sekmeleri.

### 5.6 Üst Menü, Spotlight (`⌘K`), Mobil Başlatıcı & Kalıcılık
- **TopMenuBar:** Kategori gruplu Uygulamalar, Pencere, Görünüm, Widget menüleri, cihaz önizleme (`auto | desktop | mobile`) ve canlı saat.
- **Spotlight (`Ctrl/Cmd + K`):** Tüm uygulamalar ve pencere düzeni komutları için `CommandPalette`.
- **MobileLauncher & MobileActiveSheet:** Mobil ekranlarda arama çubuklu ana ekran, Dock ve tam ekran uygulama sayfası.
- **İzole Kalıcılık Yardımcıları:** `loadOSGLState`, `saveOSGLState` (`uxu.osgl.state.v4.<scope>`) ve `loadOSGLWidgetData`, `saveOSGLWidgetData` (`uxu.osgl.widget.v2.<scope>.<widget>`).

