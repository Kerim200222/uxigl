# uxiGL Mimari ve SOLID Tasarım Dokümantasyonu

Bu belge, **uxiGL Design System** projesinin klasör yapısını, **SOLID** yazılım mühendisliği prensiplerinin TypeScript ortamında nasıl uygulandığını ve **Liquid Glass × Dinamik Tonal** token mimarisini açıklar.

---

## 1. Katmanlı Klasör Mimarisi

```text
src/
├── core/
│   ├── contracts/              # [ISP, LSP, DIP] Soyut TypeScript arayüz kontratları
│   │   ├── ComponentContracts.ts
│   │   ├── NavigationContract.ts
│   │   ├── ThemeContract.ts
│   │   └── NotificationContract.ts
│   ├── tokens/                 # [SRP, OCP] Saf tasarım tokenları ve 6 tohum renk paleti
│   │   └── designTokens.ts
│   └── services/               # [SRP, DIP] DOM, LocalStorage ve Kod Üretim servisleri
│       ├── StorageService.ts
│       ├── ThemeEngineService.ts
│       └── CodeGeneratorService.ts
├── providers/                  # [DIP, SRP] Bağımlılık enjeksiyonlu React Context sağlayıcıları
│   ├── ThemeProvider.tsx
│   └── ToastProvider.tsx
├── hooks/                      # [SRP] Tek sorumluluklu özel React kancaları
│   ├── useKeyboardShortcut.ts
│   └── useCopyToClipboard.ts
├── components/
│   ├── primitives/             # Atomik UI bileşenleri (Button, Input, Switch, Slider, vb.)
│   └── composites/             # Birleşik bileşenler (Card, SegmentedControl, Modal, DataTable, vb.)
├── features/
│   ├── catalog/                # Bileşen kataloğu ve API dokümantasyon veri kaynağı
│   ├── playground/             # Canlı Prop Denetleyicisi, Sahne ve Kod Üretici
│   ├── showcase/               # Canlı Kurumsal Ekosistem Dashboard Uygulaması
│   ├── docs/                   # Etkileşimli SOLID & Token Dokümantasyon Görünümü
│   └── theme-studio/           # Canlı Tema, Geometri, Yoğunluk ve Cam Stüdyosu
└── styles/
    └── uxu-tokens.css          # CSS Custom Properties, Dark/Light temalar ve Responsive kurallar
```

---

## 2. SOLID Prensiplerinin Uygulama Detayları

### S — Single Responsibility Principle (Tek Sorumluluk Prensibi)
- **`ThemeProvider.tsx`**: Yalnızca React durumunu (state) ve işletim sistemi medya sorgusunu (`prefers-color-scheme`) yönetir.
- **`CssVariableThemeEngine` (`ThemeEngineService.ts`)**: Yalnızca soyut tema tercihlerini `--uxu-*` CSS değişkenlerine dönüştürüp `document.documentElement` üzerine yazar.
- **`LocalStorageThemeAdapter` (`StorageService.ts`)**: Yalnızca kullanıcı tercihlerinin JSON serileştirme ve `localStorage` okuma/yazma işlemlerini yürütür.
- **`CodeGeneratorService.ts`**: Yalnızca Playground üzerindeki aktif prop değerlerinden biçimlendirilmiş TSX kodu üretir.

### O — Open/Closed Principle (Açık / Kapalı Prensibi)
- **Renk Paleti Genişletilebilirliği**: Yeni bir tema paleti eklemek için hiçbir bileşenin kaynak koduna dokunulmaz; `SEED_PALETTES` (`designTokens.ts`) sözlüğüne yeni bir tanım eklemek yeterlidir.
- **Kompozisyon Yuvaları (Slots)**: `Button`, `Input`, `Card` ve `Modal` bileşenleri `leadingIcon`, `trailingIcon`, `headerAction`, `footer` gibi ReactNode yuvaları kabul ederek iç mantığı değişmeden sonsuz varyasyona izin verir.

### L — Liskov Substitution Principle (Liskov İkame Prensibi)
- **`FormControlContract<TValue>`**:
  ```ts
  export interface FormControlContract<TValue>
    extends IdentifiableProps, DisableableProps, SizableProps {
    value: TValue;
    onChange: (nextValue: TValue) => void;
    label?: ReactNode;
    helperText?: ReactNode;
    errorText?: ReactNode;
  }
  ```
  `Switch` ve `Checkbox` bileşenleri `FormControlContract<boolean>` kontratını uygular. Uygulama içindeki **Polimorfik Kontrol Merkezi** kartında kullanıcı tek bir düğmeyle tüm ayar satırlarını `Switch` veya `Checkbox` olarak değiştirebilir.

### I — Interface Segregation Principle (Arayüz Ayrımı Prensibi)
- Bileşenlerin kullanmadıkları prop'lara bağımlı kalmaması için arayüzler mikro-kontratlara bölünmüştür:
  - `IdentifiableProps` (`id`, `className`, `style`)
  - `DisableableProps` (`disabled`)
  - `LoadableProps` (`loading`, `loadingText`)
  - `SizableProps` (`size`)
  - `TonalProps` (`tone`)
  - `IconSlotProps` (`leadingIcon`, `trailingIcon`)
  - `DismissibleProps` (`dismissible`, `onDismiss`)

### D — Dependency Inversion Principle (Bağımlılıkların Tersine Çevrilmesi)
- `ThemeProvider` doğrudan `window.localStorage` veya DOM stil atamaları çağrısı yapmaz; bunun yerine `IThemeStorageAdapter` ve `IThemeEngine` arayüzlerini prop olarak kabul eder:
  ```tsx
  <ThemeProvider
    storageAdapter={customStorageAdapter}
    themeEngine={customThemeEngine}
  >
    <App />
  </ThemeProvider>
  ```
  Bu sayede SSR (Server-Side Rendering) veya birim testlerinde sahte (mock) adaptörler kolayca enjekte edilebilir.
