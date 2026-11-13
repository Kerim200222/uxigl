import type { PropDocItem } from '../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL DESIGN SYSTEM — COMPREHENSIVE HANDS-ON COMPONENT DOCUMENTATION CATALOG
 * ============================================================================
 * Every component includes:
 * - Practical summary & import statement
 * - Multiple real-world usage examples (title, description, code snippet)
 * - UX Best Practices: Do's & Don'ts
 * - Keyboard & Accessibility (ARIA) specs
 * - Full Props API Reference Table
 */

export type ComponentCategoryId =
  | 'inputs'
  | 'surfaces'
  | 'feedback';

export interface PracticalExampleItem {
  id: string;
  title: string;
  description: string;
  code: string;
}

export interface ComponentCatalogEntry {
  id: string;
  name: string;
  turkishTitle: string;
  category: ComponentCategoryId;
  summary: string;
  importPath: string;
  importStatement: string;
  dos: string[];
  donts: string[];
  accessibilityNotes: string[];
  examples: PracticalExampleItem[];
  propsTable: PropDocItem[];
}

export const COMPONENT_CATEGORIES: {
  id: ComponentCategoryId;
  label: string;
}[] = [
  { id: 'inputs', label: 'Form Kontrolleri' },
  { id: 'surfaces', label: 'Yüzey & Gezinme' },
  { id: 'feedback', label: 'Veri & Durum' },
];

export const COMPONENT_CATALOG: ComponentCatalogEntry[] = [
  {
    id: 'button',
    name: 'Button',
    turkishTitle: 'Eylem, Switch, Collapse & Split Butonlar',
    category: 'inputs',
    summary:
      '8 varyant (filled, tonal, glass, outlined, ghost, success, warning, danger), Switch/Toggle modu, Collapse/Expand aksiyon modu, Split (bölünmüş menülü) buton, Icon-only ve Loading durumları sunan zengin eylem bileşeni.',
    importPath: '@/components/primitives',
    importStatement: "import { Button } from '@/components/primitives';",
    dos: [
      'Birincil eylem için variant="filled" kullanın.',
      'Durum değiştiren araç çubuğu filtrelerinde toggleable ve statusDot özelliklerini açın.',
      'Panel açma/kapatma aksiyonlarında collapsible ve expanded prop’larını kullanın.',
      'Alternatif dışa aktarma veya gönderim seçenekleri için splitAction ve splitItems tanımlayın.',
    ],
    donts: [
      'Yan yana birden fazla "filled" buton kullanmayın.',
      'Sadece ikon içeren (iconOnly) butonlarda aria-label unutmayın.',
    ],
    accessibilityNotes: [
      'Tab ile odaklanır, Enter/Space ile tetiklenir.',
      'toggleable modunda aria-pressed, collapsible modunda aria-expanded otomatik atanır.',
      'loading durumunda aria-busy="true" alır.',
    ],
    examples: [
      {
        id: 'btn-variants',
        title: '1. Yüzey & Semantik Varyantlar + Switch / Collapse Modları',
        description:
          'Standart varyantların yanı sıra Switch (toggleable) ve Collapse/Expand (collapsible) butonlar.',
        code: `<div className="uxu-stage-row">
  <Button variant="filled">Kaydet</Button>
  <Button variant="glass" toggleable statusDot pressed={isSync} onToggle={setIsSync}>
    Canlı Senkronizasyon
  </Button>
  <Button variant="tonal" collapsible expanded={isOpen} badgeCount={3} onExpandChange={setIsOpen}>
    Filtreleri Göster
  </Button>
</div>`,
      },
      {
        id: 'btn-split-icon-loading',
        title: '2. Split (Bölünmüş) Buton, Icon-Only & Loading',
        description:
          'Birincil aksiyon + açılır menü (splitAction), kare ikon butonu ve asenkron yükleme.',
        code: `<div className="uxu-stage-row">
  <Button
    variant="filled"
    leadingIcon={<Download size={15} />}
    splitAction
    splitItems={[
      { id: 'xlsx', label: 'Excel (.xlsx) İndir', onClick: exportXlsx },
      { id: 'pdf', label: 'İmzalı e-Fatura PDF', onClick: exportPdf },
    ]}
  >
    Raporu Dışa Aktar
  </Button>
  <Button variant="glass" iconOnly aria-label="Hızlı Ekle">
    <Plus size={16} />
  </Button>
  <Button variant="tonal" loading loadingText="Doğrulanıyor...">
    Gönder
  </Button>
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'variant',
        type: "'filled' | 'tonal' | 'glass' | 'outlined' | 'ghost' | 'success' | 'warning' | 'danger'",
        defaultValue: "'filled'",
        description: 'Butonun görsel hiyerarşi, yüzey ve semantik stilini belirler.',
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: 'Yükseklik, iç boşluk ve yazı boyutunu ayarlar.',
      },
      {
        name: 'toggleable / pressed / onToggle',
        type: 'boolean / boolean / (next: boolean) => void',
        defaultValue: 'false',
        description: 'Switch/Toggle buton modunu, basılı durumu ve durum noktası (statusDot) desteğini açar.',
      },
      {
        name: 'collapsible / expanded / onExpandChange',
        type: 'boolean / boolean / (next: boolean) => void',
        defaultValue: 'false',
        description: 'Collapse/Expand aksiyon butonu modunu ve dönen chevron ikonunu aktif eder.',
      },
      {
        name: 'splitAction / splitItems',
        type: 'boolean / SplitButtonMenuItem[]',
        defaultValue: 'false / []',
        description: 'Sağ kenarda ayrılmış tetikleyici ve açılır bağlamsal aksiyon menüsü oluşturur.',
      },
      {
        name: 'loading / loadingText',
        type: 'boolean / string',
        defaultValue: 'false / undefined',
        description: 'Aktif olduğunda dönen yükleme ikonu gösterir ve tıklamayı kilitler.',
      },
      {
        name: 'iconOnly / badgeCount',
        type: 'boolean / number | string',
        defaultValue: 'false / undefined',
        description: 'Kare/daire ikon butonu modu veya buton içi sayaç rozeti.',
      },
    ],
  },
  {
    id: 'input',
    name: 'Input, Select, Textarea & Enterprise Forms',
    turkishTitle: 'Maskeli Giriş, Combobox Select, Textarea, Döviz & Dosya Yükleme',
    category: 'inputs',
    summary:
      'Maskeli giriş (Telefon, TR IBAN, VKN/TCKN, Kredi Kartı), aranabilir Select Combobox, şablonlu Textarea, CurrencyInput (KDV hesaplamalı döviz), DateTimePickerInput, MultiSelectTagInput ve FileUploadDropzone içeren kurumsal form ailesi.',
    importPath: '@/components/primitives',
    importStatement:
      "import { Input, Select, Textarea, CurrencyInput, DateTimePickerInput, MultiSelectTagInput, FileUploadDropzone } from '@/components/primitives';",
    dos: [
      'Finans ve muhasebe formlarında mask="iban" | "tax-id" | "phone" | "credit-card" kullanın.',
      'Dövizli tutarlarda CurrencyInput ile otomatik KDV hesaplamasını aktif edin.',
      'Doğrulama durumunu validationState="success" | "warning" | "error" ile görselleştirin.',
    ],
    donts: [
      'Yalnızca placeholder metnine güvenmeyin; açıklayıcı label kullanın.',
    ],
    accessibilityNotes: [
      'useId() ile label ve input otomatik eşleştirilir.',
      'errorText veya validationState="error" varken aria-invalid="true" alır.',
    ],
    examples: [
      {
        id: 'input-masks-currency',
        title: '1. Maskeli Kurumsal Girişler (TR IBAN, Telefon, VKN) & Döviz/KDV',
        description:
          'B2B ve muhasebe uygulamaları için otomatik formatlanan alanlar ve para birimi seçici.',
        code: `<div className="uxu-stage-grid-2">
  <Input
    label="Banka Hesabı TR IBAN"
    mask="iban"
    value={iban}
    onChange={setIban}
    validationState="success"
    successText="TR IBAN 26 hane doğrulandı"
  />
  <CurrencyInput
    label="Fatura Net Hizmet Bedeli"
    value={amount}
    onChange={setAmount}
    currency={currency}
    onCurrencyChange={setCurrency}
    vatRate={20}
  />
</div>`,
      },
      {
        id: 'input-tags-dropzone',
        title: '2. Tarih/Saat Seçici, Çoklu Etiket & Dosya Yükleme Alanı',
        description:
          'Vade kısayollu tarih/saat seçici, etiket havuzu ve sürükle-bırak belge yükleme.',
        code: `<div className="uxu-stage-grid-2">
  <DateTimePickerInput
    label="e-Fatura Vade Tarihi"
    dateValue={date}
    timeValue={time}
    onDateChange={setDate}
    onTimeChange={setTime}
  />
  <MultiSelectTagInput
    label="Muhasebe Etiketleri"
    tags={tags}
    onChange={setTags}
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'string / (nextValue: string) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Kontrollü metin değeri ve her tuş vuruşunda tetiklenen geri çağrı.',
      },
      {
        name: 'mask',
        type: "'phone' | 'iban' | 'tax-id' | 'credit-card' | 'date-mask'",
        defaultValue: 'undefined',
        description: 'Yazım esnasında otomatik kurumsal format maskesi uygular.',
      },
      {
        name: 'validationState',
        type: "'default' | 'success' | 'warning' | 'error'",
        defaultValue: "'default'",
        description: 'Alanın çerçeve ve durum mesajı rengini semantik olarak değiştirir.',
      },
      {
        name: 'prefixText / suffixText / revealablePassword',
        type: 'string / string / boolean',
        defaultValue: 'undefined / false',
        description: 'Sabit ön/son ek rozeti (örn. https://, VKN) ve parola göster/gizle düğmesi.',
      },
      {
        name: 'currency / vatRate (CurrencyInput)',
        type: "'TRY' | 'USD' | 'EUR' | 'GBP' / number",
        defaultValue: "'TRY' / 20",
        description: 'Döviz birimi seçici ve alt satırda otomatik KDV dahil toplam hesaplaması.',
      },
      {
        name: 'tags / suggestions (MultiSelectTagInput)',
        type: 'string[] / string[]',
        defaultValue: '[]',
        description: 'Seçili etiket dizisi ve hızlı ekleme öneri havuzu.',
      },
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    turkishTitle: 'Aç/Kapa Anahtar',
    category: 'inputs',
    summary:
      'Sistem ayarlarını anında açıp kapatmak (On/Off) için kullanılan taktil anahtar.',
    importPath: '@/components/primitives',
    importStatement: "import { Switch } from '@/components/primitives';",
    dos: [
      'Anında devreye giren sistem ayarları için kullanın.',
      'Alt açıklama için description prop’unu ekleyin.',
    ],
    donts: [
      'Çoklu seçim listelerinde Switch yerine Checkbox kullanın.',
    ],
    accessibilityNotes: [
      'role="switch" ve aria-checked niteliklerine sahiptir.',
    ],
    examples: [
      {
        id: 'switch-tones',
        title: '1. Anlamsal Renk Tonları & Açıklamalı Ayar Satırları',
        description:
          'primary, success, warning, danger ve info tonlarıyla durum vurgusu.',
        code: `<div className="uxu-stack-md">
  <Switch
    label="Uzamsal Cam Bulanıklığı (Backdrop Blur)"
    description="Pencere katmanlarında gerçek zamanlı ışık kırılmasını etkinleştirir"
    value={blurEnabled}
    onChange={setBlurEnabled}
    tone="primary"
  />
  <Switch
    label="Otomatik Yedekleme Servisi"
    description="Her 15 dakikada bir bulut kümesine anlık görüntü alır"
    value={backupEnabled}
    onChange={setBackupEnabled}
    tone="success"
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'boolean / (next: boolean) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Anahtarın açık/kapalı durumu ve değişim fonksiyonu.',
      },
      {
        name: 'label / description',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Sol tarafta gösterilen ayar başlığı ve alt açıklama metni.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'primary'",
        description: 'Anahtar açıkken kullanılan vurgu rengi.',
      },
      {
        name: 'showThumbIcon',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Topuz (thumb) içinde onay (✓) ve çarpı (✕) ikonlarını gösterir.',
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        defaultValue: "'md'",
        description: 'Anahtar boyut ölçeği.',
      },
    ],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    turkishTitle: 'Onay Kutusu',
    category: 'inputs',
    summary:
      'Çoklu seçim, tablo satırı işaretleme ve kısmi seçim (indeterminate) destekli onay kutusu.',
    importPath: '@/components/primitives',
    importStatement: "import { Checkbox } from '@/components/primitives';",
    dos: [
      'Kısmi seçimlerde indeterminate={true} kullanın.',
      'Tıklama alanını genişletmek için label prop’u verin.',
    ],
    donts: [
      'Anlık mod geçişlerinde Checkbox yerine Switch seçin.',
    ],
    accessibilityNotes: [
      'role="checkbox" ve aria-checked="mixed" destekler.',
    ],
    examples: [
      {
        id: 'checkbox-states',
        title: '1. Seçili, Kısmi Seçili (Indeterminate) ve Tonlar',
        description: 'İzin matrisleri ve görev listeleri için ideal yapı.',
        code: `<div className="uxu-stack-md">
  <Checkbox
    label="Tüm Okuma ve Yazma İzinlerini Ver"
    description="Yönetici rolü için tam yetki tanımlaması"
    value={allChecked}
    onChange={setAllChecked}
    tone="primary"
  />
  <Checkbox
    label="Alt Modüller (Kısmi Seçim / Indeterminate)"
    value={false}
    indeterminate={true}
    onChange={() => {}}
    tone="warning"
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'boolean / (next: boolean) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Seçim durumu ve değişim geri çağrısı.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Kısmi seçim (-) ikonunu gösterir.',
      },
      {
        name: 'label / description',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Onay kutusunun yanındaki başlık ve alt bilgi metni.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info'",
        defaultValue: "'primary'",
        description: 'İşaretlendiğinde kutunun alacağı anlamsal renk.',
      },
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    turkishTitle: 'Değer Kaydırıcı',
    category: 'inputs',
    summary:
      'Parlaklık, ses, bulanıklık veya yüzde gibi sayısal aralıkları seçmek için kullanılan kaydırıcı.',
    importPath: '@/components/primitives',
    importStatement: "import { Slider } from '@/components/primitives';",
    dos: [
      'Birim göstermek için valueSuffix="%" kullanın.',
      'Kademeli ayarlarda step ve showTicks aktif edin.',
    ],
    donts: [
      'Çok geniş aralıklarda tek başına Slider kullanmayın.',
    ],
    accessibilityNotes: [
      'Yön tuşları ile step değerinde artırılıp azaltılır.',
    ],
    examples: [
      {
        id: 'slider-examples',
        title: '1. İkonlu ve Adım Noktalı (Ticks) Kaydırıcılar',
        description: 'Kontrol merkezi ve dinamik tonal tarzı kaydırıcılar.',
        code: `<div className="uxu-stack-md">
  <Slider
    label="Ekran Parlaklığı"
    value={brightness}
    onChange={setBrightness}
    valueSuffix="%"
    leadingIcon={<Sun size={16} />}
  />
  <Slider
    label="Küme Ölçekleme Eşiği"
    value={threshold}
    onChange={setThreshold}
    min={0}
    max={100}
    step={10}
    showTicks
    tone="success"
    valueSuffix=" Düğüm"
  />
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'value / onChange',
        type: 'number / (next: number) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Sayısal değer ve değişim fonksiyonu.',
      },
      {
        name: 'min / max / step',
        type: 'number',
        defaultValue: '0 / 100 / 1',
        description: 'Minimum, maksimum sınırlar ve artış miktarı.',
      },
      {
        name: 'valueSuffix',
        type: 'string',
        defaultValue: "''",
        description: 'Değerin sonuna eklenen birim (%, dB, °C, px).',
      },
      {
        name: 'showTicks',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Kanal üzerinde adım noktalarını görüntüler.',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    turkishTitle: 'Yüzey Kartı',
    category: 'surfaces',
    summary:
      'İçerikleri gruplayan glass, tonal, elevated ve outlined varyantlı temel yüzey kapsayıcısı.',
    importPath: '@/components/composites',
    importStatement: "import { Card } from '@/components/composites';",
    dos: [
      'Başlık ve aksiyon için title ve headerAction kullanın.',
      'Tıklanabilir kartlarda interactive={true} açın.',
    ],
    donts: [
      'İç içe 2 katmandan fazla Glass kart koymayın.',
    ],
    accessibilityNotes: [
      'onClick verildiğinde role="button" ve tabIndex={0} alır.',
    ],
    examples: [
      {
        id: 'card-variants',
        title: '1. Glass, Tonal, Elevated ve Outlined Yüzeyler',
        description: 'Kart başlığı, aksiyon rozeti ve alt çubuk kompozisyonu.',
        code: `<Card
  variant="glass"
  glowOnHover
  eyebrow="SUNUCU KÜMESİ"
  title="Frankfurt M4 Ultra Node"
  subtitle="Son kontrol: 12 saniye önce"
  headerIcon={<Cpu size={20} />}
  headerAction={<Badge tone="success" pulse>Aktif</Badge>}
  footer={
    <div className="uxu-card-footer-row">
      <span>Bant Genişliği: 40 Gbps</span>
      <Button variant="tonal" size="xs">Konsolu Aç</Button>
    </div>
  }
>
  <p>Yüzey içeriği buraya yerleşir.</p>
</Card>`,
      },
    ],
    propsTable: [
      {
        name: 'variant',
        type: "'glass' | 'tonal' | 'elevated' | 'outlined' | 'flat'",
        defaultValue: "'glass'",
        description: 'Kartın arka plan geçirgenliği ve derinlik stili.',
      },
      {
        name: 'title / subtitle / eyebrow',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Kart üst bilgisindeki başlık, alt başlık ve küçük kategori metni.',
      },
      {
        name: 'headerIcon / headerAction',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Başlığın solundaki ikon kutusu ve sağındaki aksiyon/rozet alanı.',
      },
      {
        name: 'footer',
        type: 'ReactNode',
        defaultValue: 'undefined',
        description: 'Ayırıcı çizgi ile ayrılmış alt eylem alanı.',
      },
      {
        name: 'interactive / glowOnHover',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Hover durumunda yükselme ve aktif tema rengiyle ışıma efekti.',
      },
    ],
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    turkishTitle: 'Segment Seçici',
    category: 'surfaces',
    summary:
      '2–5 seçenek arasında kayan animasyonlu kapsül (sliding pill) ile anlık görünüm/filtre geçişi sağlar.',
    importPath: '@/components/composites',
    importStatement: "import { SegmentedControl } from '@/components/composites';",
    dos: [
      'Periyot (24S/7G/30G) ve mod seçimlerinde kullanın.',
    ],
    donts: [
      '5’ten fazla seçenekte Tabs bileşenini tercih edin.',
    ],
    accessibilityNotes: [
      'role="tablist" ve aria-selected niteliklerini barındırır.',
    ],
    examples: [
      {
        id: 'segmented-basic',
        title: '1. İkonlu ve Sayaç Rozetli Segment Seçici',
        description: 'Aktif sekme CSS değişkenleriyle akıcı biçimde kayarak yer değiştirir.',
        code: `<SegmentedControl
  label="Veri Görünüm Modu"
  value={viewMode}
  onChange={setViewMode}
  fullWidth
  options={[
    { value: 'spatial', label: 'Uzamsal Görünüm', icon: <Sparkles size={15} />, badge: 'Yeni' },
    { value: 'tonal', label: 'Tablo Görünümü', icon: <Layers size={15} />, badge: 24 },
    { value: 'adaptive', label: 'Özet Kartlar', icon: <Zap size={15} /> },
  ]}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'options',
        type: 'SegmentedOption<T>[]',
        defaultValue: '[]',
        required: true,
        description: '{ value, label, icon?, badge?, disabled? } nesnelerinden oluşan dizi.',
      },
      {
        name: 'value / onChange',
        type: 'T / (next: T) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Aktif seçeneğin değeri ve değişim fonksiyonu.',
      },
      {
        name: 'fullWidth',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Tüm genişliği eşit bölmeler halinde kaplar.',
      },
    ],
  },
  {
    id: 'tabs-accordion',
    name: 'Tabs, Accordion, Stepper & Timeline',
    turkishTitle: 'Sekme, Akordeon, Süreç Sihirbazı & Denetim Akışı',
    category: 'surfaces',
    summary:
      'Ekran içeriklerini yatay sekmelere (Tabs), açılır-kapanır panellere (Accordion), çok adımlı süreç sihirbazına (Stepper) veya dikey işlem geçmişine (Timeline) böler.',
    importPath: '@/components/composites',
    importStatement: "import { Tabs, Accordion, Stepper, Timeline } from '@/components/composites';",
    dos: [
      'Sekmelerde kayıt sayısı için count prop’unu kullanın.',
      'İlk paneli açık başlatmak için defaultExpandedIds verin.',
    ],
    donts: [
      'Sekme başlıklarını 1-2 kelimeden uzun tutmayın.',
    ],
    accessibilityNotes: [
      'Accordion tetikleyicileri aria-expanded üretir.',
    ],
    examples: [
      {
        id: 'tabs-acc-example',
        title: '1. Alt Çizgili / Kapsül Sekmeler ve Akordeon',
        description: 'Sekme değişimi ve çoklu açılabilir akordeon panelleri.',
        code: `<Tabs
  variant="underline"
  activeId={activeTab}
  onChange={setActiveTab}
  items={[
    { id: 'overview', label: 'Genel Bakış', count: 4 },
    { id: 'security', label: 'Güvenlik Duvarı', count: 12 },
  ]}
/>

<Accordion
  allowMultiple
  defaultExpandedIds={['faq-1']}
  items={[
    {
      id: 'faq-1',
      title: 'Dark ve Light Mod Nasıl Değiştirilir?',
      subtitle: 'ThemeProvider ve useTheme kancası',
      content: 'useTheme() içerisindeki setMode("dark" | "light" | "system") fonksiyonunu çağırabilirsiniz.',
    },
  ]}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'items (Tabs)',
        type: 'TabItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Sekme listesi ({ id, label, icon?, count?, disabled? }).',
      },
      {
        name: 'variant (Tabs)',
        type: "'underline' | 'pill'",
        defaultValue: "'underline'",
        description: 'Alt çizgili veya kapsül sekme görünümü.',
      },
      {
        name: 'allowMultiple (Accordion)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Aynı anda birden fazla akordeon panelinin açık kalmasına izin verir.',
      },
    ],
  },
  {
    id: 'sidebar',
    name: 'Sidebar & Nav Multi-Variant',
    turkishTitle: 'Açık, Kapalı, Dikey, Çift Kolonlu & Çekmece Menü',
    category: 'surfaces',
    summary:
      '5 farklı yerleşim modu sunan kurumsal gezinme omurgası: Standart Açık, Kompakt Kapalı Ray, Dikey İkon-Etiket Yığınlı, Çift Kolonlu ve Çekmece (Off-Canvas).',
    importPath: '@/components/composites',
    importStatement: "import { Sidebar } from '@/components/composites';",
    dos: [
      'Operasyonel telemetri, izleme ve kontrol panellerinde dikey ikon-etiket yığınlı (stacked-vertical) modu tercih edin.',
      'Geniş kurumsal sistemlerde akordeon aç/kapa alt menülü standart açık modu kullanın.',
      'Çalışma alanı ve kanal derinliği yüksek sistemlerde dual-column modunu seçin.',
      'Mobil ve odaklı tam ekran modlarında drawer (off-canvas) varyantını kullanın.',
    ],
    donts: [
      'Gereksiz yere 4 seviyeden derin alt menü hiyerarşisi oluşturmayın; bilişsel yükü artırır.',
      'Dikey (stacked) modda etiketleri 2 kelimeden uzun tutmayın.',
    ],
    accessibilityNotes: [
      'Akordeon menü başlıkları dinamik aria-expanded ve Chevron ok durumu üretir.',
      'Ok tuşları ve Tab ile tam klavye erişilebilirliği.',
      'Otomatik rota ve sayfa durumu senkronizasyonu.',
    ],
    examples: [
      {
        id: 'sidebar-stacked-example',
        title: '1. Dikey Menü (İkon Üstte, Yazı Altta)',
        description:
          'Sol kehribar/altın vurgu çubuğu, ikon üstte, metin altta ve "Active" durum etiketi ile dikey menü.',
        code: `<Sidebar
  variant="stacked-vertical"
  accentColor="#F59E0B"
  groups={navGroups}
  activeItemId={activeItem}
  activeSubItemId={activeSub}
  onSelect={(itemId, subId) => setActive(itemId, subId)}
  brandLogo={<MyLogo size={28} glow />}
/>`,
      },
      {
        id: 'sidebar-standard-example',
        title: '2. Açık Menü (Aç/Kapa Akordeon Alt Ağaç)',
        description:
          'Kullanıcının dilediği zaman açıp kapatabildiği (aç/kapa), Spotlight ⌘K ve rozet destekli klasik kurumsal menü.',
        code: `<Sidebar
  variant="standard"
  collapsed={isCollapsed}
  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
  groups={navGroups}
  activeItemId={activeItem}
  activeSubItemId={activeSub}
  onSelect={(itemId, subId) => setActive(itemId, subId)}
  brandTitle="uxiGL"
  brandSubtitle="Enterprise Design System"
/>`,
      },
      {
        id: 'sidebar-dual-example',
        title: '3. Çift Kolonlu Menü (Master-Detail)',
        description:
          'Sol tarafta 68px birincil modül rayı, sağ tarafta o modüle ait 200px detay ağacı.',
        code: `<Sidebar
  variant="dual-column"
  groups={navGroups}
  activeItemId={activeItem}
  activeSubItemId={activeSub}
  onSelect={(itemId, subId) => setActive(itemId, subId)}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'variant',
        type: "'standard' | 'mini-rail' | 'stacked-vertical' | 'dual-column' | 'drawer'",
        defaultValue: "'standard'",
        description: 'Sidebar yerleşim modeli (Açık, Kapalı, Dikey, Çift Kolonlu, Çekmece).',
      },
      {
        name: 'accentColor',
        type: 'string',
        defaultValue: "var(--uxu-primary)",
        description: 'Aktif eleman göstergesi ve parıltısı için özel renk (örn. #F59E0B).',
      },
      {
        name: 'groups',
        type: 'SidebarNavGroup[]',
        defaultValue: '[]',
        description: 'Menü grupları, başlıkları, ana elemanlar ve subItems ağacı.',
      },
      {
        name: 'activeItemId',
        type: 'string',
        defaultValue: "''",
        description: 'Şu an aktif olan ana menü elemanı ID’si.',
      },
      {
        name: 'activeSubItemId',
        type: 'string',
        defaultValue: "undefined",
        description: 'Şu an aktif olan alt menü (subItem) ID’si.',
      },
      {
        name: 'collapsed',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Standart modda sidebar’ın daraltılmış (mini-rail) olup olmadığı.',
      },
      {
        name: 'drawerOpen',
        type: 'boolean',
        defaultValue: 'false',
        description: 'drawer varyantında off-canvas çekmecenin açık olup olmadığı.',
      },
      {
        name: 'onSelect',
        type: '(itemId: string, subItemId?: string) => void',
        defaultValue: 'undefined',
        description: 'Bir menü veya alt menü elemanı seçildiğinde çağrılan fonksiyon.',
      },
    ],
  },
  {
    id: 'page-templates',
    name: 'PageTemplates',
    turkishTitle: 'Hazır Kurumsal Sayfa Tasarımları (Login, Register/2FA, Pricing, Profile, e-Fatura, Kanban, Status, Settings)',
    category: 'surfaces',
    summary:
      '8pt uzamsal ızgara ve Liquid Glass materyalleriyle tasarlanmış 8 hazır tam sayfa şablonu: Split-Screen & Yüzen Cam Login, 3 Adımlı Kayıt & 2FA OTP, SaaS Fiyatlandırma, Kullanıcı Profili, B2B e-Fatura & Checkout, Kanban Sprint Panosu, 404/500/SLA Sistem Durumu ve Kurumsal Ayarlar & Tercihler (page-settings).',
    importPath: 'truncgil-uxigl',
    importStatement:
      "import { PageTemplatesShowcaseView, EnterpriseSettingsPage, type PageTemplateId } from 'truncgil-uxigl';",
    dos: [
      'Kurumsal B2B girişlerde sol marka/telemetri vitrinli Split-Screen Login şablonunu, son kullanıcı odaklı uygulamalarda Merkezi Yüzen Cam (Floating Glass) Login şablonunu tercih edin.',
      'Kayıt (Register) akışlarını bilişsel yükü azaltmak için Hesap -> Çalışma Alanı Rolü -> 6 Haneli 2FA OTP adımlarına bölün.',
      'Fiyatlandırma (Pricing) sayfasında Yıllık/Aylık SegmentedControl ve canlı koltuk (seat) Slider hesaplayıcısını birlikte sunun.',
      'B2B tahsilat ekranlarında yazdırılabilir GİB e-Fatura kalem tablosu ile canlı kredi kartı önizlemesini yan yana konumlandırın.',
      'Çalışma alanı tema, hesap ve bildirim tercihlerini yönetmek için EnterpriseSettingsPage (page-settings) şablonunu kullanın.',
    ],
    donts: [
      'Kimlik doğrulama formlarında gereksiz 6-7 alanı tek ekranda yığmayın; çok adımlı (multi-step) onboarding kullanın.',
      '404 ve 500 hata sayfalarında kullanıcıyı çıkmaza sokmayın; mutlaka Ana Panele Dön, Canlı Sistem Durumu (SLA) ve ⌘K kısayol aksiyonu sunun.',
    ],
    accessibilityNotes: [
      'Tüm form şablonları semantik <form>, klavye ile odaklanabilir 6 haneli OTP kutuları ve şifre görünürlük (aria-label) anahtarları içerir.',
      'Tam ekran önizleme (isFullscreenPreview) ve tek tıkla JSX kodu kopyalama çekmecesi yerleşik olarak sunulur.',
    ],
    examples: [
      {
        id: 'page-login-template-example',
        title: '1. Kurumsal Split-Screen & Yüzen Cam Login Sayfası',
        description:
          'E-posta/parola doğrulama, WebAuthn Biyometrik Passkey ve SSO sağlayıcılarıyla tam hazır giriş ekranı.',
        code: `import { useState } from 'react';
import { Card, Input, Button, Checkbox, Badge, UXILogo } from 'truncgil-uxigl';
import { Mail, Lock, Fingerprint, ArrowRight } from 'lucide-react';

export function EnterpriseLoginPage() {
  const [email, setEmail] = useState('architect@truncgil.com');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  return (
    <Card variant="glass" padding="lg" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="uxu-stack-md">
        <UXILogo size={36} glow />
        <h2>Kurumsal Hesabınıza Giriş Yapın</h2>
        <Input label="E-Posta" value={email} onChange={setEmail} leadingIcon={<Mail size={15} />} />
        <Input label="Parola" type="password" value={password} onChange={setPassword} leadingIcon={<Lock size={15} />} />
        <Checkbox label="30 gün boyunca oturumu açık tut" value={remember} onChange={setRemember} />
        <Button variant="filled" fullWidth trailingIcon={<ArrowRight size={15} />}>
          Güvenli Oturum Aç
        </Button>
        <Button variant="tonal" fullWidth leadingIcon={<Fingerprint size={16} />}>
          Passkey (Face ID / Touch ID) ile Giriş
        </Button>
      </div>
    </Card>
  );
}`,
      },
      {
        id: 'page-pricing-template-example',
        title: '2. SaaS Fiyatlandırma & Canlı Koltuk Hesaplayıcı Şablonu',
        description:
          'Yıllık %20 indirim anahtarı, Slider ile koltuk sayısı hesaplama ve 3 kademeli paket kartları.',
        code: `<PageTemplatesShowcaseView
  activePageId="page-pricing"
  onPageChange={(nextPage) => setActivePage(nextPage)}
/>`,
      },
      {
        id: 'page-suite-all-example',
        title: '3. 8 Hazır Sayfa Şablonu Vitrin Bileşeni (Tüm Şablonlar & EnterpriseSettingsPage)',
        description:
          'page-login, page-register, page-pricing, page-profile, page-invoice, page-kanban, page-status ve page-settings (EnterpriseSettingsPage) şablonları arasında canlı geçiş.',
        code: `import { useState } from 'react';
import {
  PageTemplatesShowcaseView,
  EnterpriseSettingsPage,
  type PageTemplateId,
} from 'truncgil-uxigl';

export function ReadyPagesDemo() {
  const [pageId, setPageId] = useState<PageTemplateId>('page-settings');
  return (
    <PageTemplatesShowcaseView
      activePageId={pageId}
      onPageChange={setPageId}
    />
  );
}`,
      },
    ],
    propsTable: [
      {
        name: 'activePageId',
        type: "'page-login' | 'page-register' | 'page-pricing' | 'page-profile' | 'page-invoice' | 'page-kanban' | 'page-status' | 'page-settings'",
        defaultValue: "'page-login'",
        required: true,
        description: 'Aktif olarak görüntülenen hazır sayfa şablonu kimliği (8 kurumsal şablon).',
      },
      {
        name: 'onPageChange',
        type: '(pageId: PageTemplateId) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Şablon seçici sekme çubuğundan veya sayfa içi bağlantılardan başka bir şablona geçildiğinde tetiklenir.',
      },
      {
        name: 'onNavigateHome',
        type: '() => void',
        defaultValue: 'undefined',
        description: '404 hata sayfasındaki "Ana Panele Dön" butonuna tıklandığında çağrılan geri dönüş fonksiyonu.',
      },
      {
        name: 'initialTab (EnterpriseSettingsPage)',
        type: "'appearance' | 'account' | 'notifications'",
        defaultValue: "'appearance'",
        description: 'EnterpriseSettingsPage doğrudan çağrıldığında başlangıçta açık olan ayar sekmesi (StorageService uxigl.workspace.settings.v1 ile kalıcı).',
      },
    ],
  },
  {
    id: 'modal-command',
    name: 'Modal, Drawer, Alert, Toast & CommandPalette',
    turkishTitle: 'Diyalog, Yan Çekmece (Drawer), 5 Yönlü Toast, Uyarı Bandı & Komut Paleti',
    category: 'surfaces',
    summary:
      '6 varyantlı Modal diyalog, 3 yönlü (right, left, bottom) kayar Drawer çekmece paneli, 5 ekran yönünde çalışan Toast bildirim motoru, satır içi Alert bandı ve CommandPalette (⌘K).',
    importPath: '@/components/composites',
    importStatement:
      "import { Modal, Drawer, CommandPalette } from '@/components/composites';\nimport { Alert } from '@/components/primitives';\nimport { useToast } from '@/providers/ToastProvider';",
    dos: [
      'Masaüstü pencere görünümü için showMacTrafficLights aktif edin; yıkıcı işlemlerde variant="danger" Modal kullanın.',
      'Toast bildirimlerinde ekran yönünü placement="top-right | top-left | bottom-right | bottom-left | top-center" ile belirleyin.',
      'Sayfa içi kalıcı durum duyurularında <Alert tone="success | warning | danger | info | glass" /> kullanın.',
    ],
    donts: [
      'Basit bildirimler için Modal yerine useToast kullanın.',
    ],
    accessibilityNotes: [
      'ESC tuşu ve ok tuşlarıyla tam klavye navigasyonu.',
      'Alert ve Toast bileşenleri role="status" / aria-live="polite" niteliklerine sahiptir.',
    ],
    examples: [
      {
        id: 'modal-toast-example',
        title: '1. 5 Yönlü & 6 Tonlu Canlı Toast Bildirimi + Modal Varyantları',
        description:
          'Farklı ekran köşelerinde ve semantik/glass tonlarda tetiklenen bildirimler ve diyalog arketipleri.',
        code: `const { notify } = useToast();

// Sağ Üstte Başarı Bildirimi
notify({
  title: 'e-Fatura GİB Kuyruğuna İletildi',
  description: 'Zarf ID: #984102 başarıyla imzalandı.',
  tone: 'success',        // 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'glass'
  placement: 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
});

// Yıkıcı İşlem Onay Diyaloğu
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  variant="danger"
  showMacTrafficLights
  title="Üretim Kümesini Kalıcı Olarak Sil?"
  subtitle="Bu işlem geri alınamaz."
>
  <Alert tone="danger" title="Kritik Uyarı" description="Tüm anlık görüntüler silinecektir." />
</Modal>`,
      },
    ],
    propsTable: [
      {
        name: 'open / onClose (Modal)',
        type: 'boolean / () => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Pencerenin açık/kapalı durumu ve kapatma fonksiyonu.',
      },
      {
        name: 'variant (Modal)',
        type: "'default' | 'alert' | 'confirm' | 'danger' | 'sheet' | 'glass'",
        defaultValue: "'default'",
        description: 'Modal diyaloğunun görsel ve davranışsal arketipi (alt çekmece sheet, yıkıcı danger vb.).',
      },
      {
        name: 'placement (useToast)',
        type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'",
        defaultValue: "'bottom-right'",
        description: 'Toast bildiriminin ekranda belireceği köşe veya merkez konumu.',
      },
      {
        name: 'tone (useToast & Alert)',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'glass'",
        defaultValue: "'info'",
        description: 'Toast ve satır içi Alert bileşeninin semantik veya buzlu cam (Liquid Glass) renk tonu.',
      },
      {
        name: 'showMacTrafficLights (Modal)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Sol üst köşeye kırmızı/sarı/yeşil pencere kontrollerini ekler.',
      },
      {
        name: 'actions (CommandPalette)',
        type: 'CommandActionItem[]',
        defaultValue: '[]',
        required: true,
        description: 'Aranabilir ve çalıştırılabilir komutların listesi.',
      },
    ],
  },
  {
    id: 'chips-badges',
    name: 'Chip & Badge',
    turkishTitle: 'Filtre Çipi & Rozet',
    category: 'feedback',
    summary:
      'Çoklu filtreleme için etkileşimli Chip; canlı durum ve sayaç gösterimi için Badge.',
    importPath: '@/components/primitives',
    importStatement: "import { Chip, Badge } from '@/components/primitives';",
    dos: [
      'Canlı servislerde Badge pulse={true} özelliğini açın.',
      'Seçilebilir filtrelerde Chip selected={true} kullanın.',
    ],
    donts: [
      'Badge içine 1-2 kelimeden uzun metin yazmayın.',
    ],
    accessibilityNotes: [
      'Tıklanabilir Chip otomatik aria-pressed alır.',
    ],
    examples: [
      {
        id: 'chip-badge-example',
        title: '1. Etkileşimli Filtre Çipleri ve Canlı Sinyal Rozetleri',
        description: 'Seçildiğinde otomatik onay ikonu çıkaran çipler ve nefes alan rozetler.',
        code: `<div className="uxu-stage-row">
  <Chip selected={isSelected} onClick={() => setIsSelected(!isSelected)}>
    Sadece Aktif Düğümler
  </Chip>
  <Chip dismissible onDismiss={() => removeTag('typescript')}>
    TypeScript 5
  </Chip>
  <Badge tone="success" pulse>Sistem Çevrimiçi</Badge>
  <Badge tone="warning" variant="outlined">Bakım Modu</Badge>
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'selected (Chip)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Seçili durumu ve sol onay (✓) ikonunu aktif eder.',
      },
      {
        name: 'dismissible / onDismiss (Chip)',
        type: 'boolean / () => void',
        defaultValue: 'false',
        description: 'Sağ kenara silme (X) düğmesi ekler.',
      },
      {
        name: 'pulse (Badge)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Rozetin soluna nefes alan canlı sinyal noktası ekler.',
      },
      {
        name: 'tone',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'",
        defaultValue: "'primary'",
        description: 'Anlamsal renk tonu.',
      },
    ],
  },
  {
    id: 'progress-avatar',
    name: 'Progress & Avatar',
    turkishTitle: 'İlerleme & Avatar',
    category: 'feedback',
    summary:
      'Doğrusal/dairesel Progress, çevrimiçi durumlu Avatar/AvatarGroup, Skeleton ve Tooltip bileşenleri.',
    importPath: '@/components/primitives',
    importStatement:
      "import { Progress, Avatar, AvatarGroup, Skeleton, Tooltip } from '@/components/primitives';",
    dos: [
      'Dar alanlarda variant="circular" Progress kullanın.',
      'Çoklu profilde AvatarGroup max={4} tercih edin.',
    ],
    donts: [
      'Yükleme esnasında boş ekran yerine Skeleton kullanın.',
    ],
    accessibilityNotes: [
      'Progress role="progressbar" ve aria-valuenow içerir.',
    ],
    examples: [
      {
        id: 'progress-avatar-example',
        title: '1. Dairesel Halka, Avatar Grubu ve Tooltip',
        description: 'Çevrimiçi durum noktası (online/busy/away) ve grup taşması.',
        code: `<div className="uxu-stage-row">
  <Progress variant="circular" value={84} tone="success" />
  <Tooltip content="Deniz Kaya (Çevrimiçi)" shortcut="⌘1">
    <Avatar name="Deniz Kaya" status="online" shape="squircle" size="lg" />
  </Tooltip>
  <AvatarGroup max={3}>
    <Avatar name="Selin Yılmaz" tone="primary" />
    <Avatar name="Mert Can" tone="success" />
    <Avatar name="Zeynep Ak" tone="warning" />
    <Avatar name="Bora Öz" tone="info" />
  </AvatarGroup>
</div>`,
      },
    ],
    propsTable: [
      {
        name: 'variant (Progress)',
        type: "'linear' | 'circular'",
        defaultValue: "'linear'",
        description: 'Yatay çubuk veya dairesel SVG halka görünümü.',
      },
      {
        name: 'indeterminate / speed (Progress & Skeleton)',
        type: "boolean / 'slow' | 'normal' | 'fast' | number",
        defaultValue: 'false / 2.6s (Progress), 2.8s (Skeleton)',
        description:
          'Belirsiz yükleme animasyonu ve animasyon döngü hızı (ör. speed="slow" veya speed={3.5} saniye).',
      },
      {
        name: 'status (Avatar)',
        type: "'online' | 'busy' | 'away' | 'offline'",
        defaultValue: 'undefined',
        description: 'Sağ alt köşede kullanıcı mevcudiyet durum noktası.',
      },
      {
        name: 'shape (Avatar)',
        type: "'squircle' | 'circle'",
        defaultValue: "'squircle'",
        description: 'Squircle veya tam daire kesim.',
      },
    ],
  },
  {
    id: 'datatable-statcard',
    name: 'SheetGL & Native DataTable',
    turkishTitle: 'SheetGL Çoklu Tablo & Basit Native Tablo',
    category: 'feedback',
    summary:
      'Büyük veri setleri için 4 farklı kurumsal şemaya sahip SheetGL WebGL/Canvas DataGrid (Finans, Bulut Telemetri, İK & Bordro, Stok) ve hafif listeler için 4 varyantlı basit Native HTML <DataTable />.',
    importPath: 'sheetgl / src/components/composites/DataTable',
    importStatement:
      "import { SheetGL } from 'sheetgl';\nimport { DataTable, SheetGLGridAdapter } from './components/composites';",
    dos: [
      'Büyük veri setlerinde (1.000 - 50.000+ satır), Excel formüllerinde ve toplu CRUD işlemlerinde SheetGLGridAdapter (finance-erp, cloud-telemetry, hr-payroll, inventory-supply) kullanın.',
      '5 - 100 satırlık basit özet listeleri, ayar tabloları ve sıfır GPU yükü gereken durumlarda hafif Native <DataTable variant="default | striped | bordered | minimal" /> bileşenini tercih edin.',
      'uxiGL tema rengini IGridThemeTokens üzerinden SheetGL ile eşitleyin.',
    ],
    donts: [
      'On binlerce satırı klasik DOM tablo düğümleriyle render etmeyin.',
      'Sadece 4-5 satırlık basit bir durum listesi için gereksiz yere ağır WebGL kanvası başlatmayın; Native DataTable kullanın.',
    ],
    accessibilityNotes: [
      'SheetGL: Excel klavye navigasyonu (Ok tuşları, Enter, Tab, Esc, Ctrl+C/V) tam desteklidir.',
      'Native DataTable: Semantik <table>, <thead>, <tbody> ve klavye ile sıralanabilir sütun başlıkları içerir.',
    ],
    examples: [
      {
        id: 'sheetgl-table-example',
        title: '1. SheetGL Çoklu Senaryo Tabloları (Finans, Telemetri, İK, Stok)',
        description:
          '4 hazır kurumsal tablo şeması, 14 sütun tipi, sabit (pinned) sütunlar, Excel formül çubuğu ve alt özet satırı.',
        code: `// 4 farklı kurumsal SheetGL tablo şeması:
// 'finance-erp' | 'cloud-telemetry' | 'hr-payroll' | 'inventory-supply'
<SheetGLGridAdapter
  datasetPreset="finance-erp"
  showPresetSwitcher={true}
  initialRowCount={150}
  height={480}
/>`,
      },
      {
        id: 'native-datatable-example',
        title: '2. Basit Native HTML Tablo (<DataTable />)',
        description:
          'Sıfır WebGL yüküyle çalışan, default / striped / bordered / minimal varyantlı ve checkbox seçimli hafif HTML tablo.',
        code: `<DataTable
  rowKey="id"
  variant="striped" // 'default' | 'striped' | 'bordered' | 'minimal'
  size="md"         // 'sm' | 'md' | 'lg'
  selectable={true}
  searchable={true}
  data={deployments}
  columns={[
    { key: 'service', header: 'Servis', sortable: true },
    { key: 'owner', header: 'Sorumlu', sortable: true },
    { key: 'status', header: 'Durum', align: 'right' },
  ]}
/>`,
      },
    ],
    propsTable: [
      {
        name: 'dataSource / columns (SheetGL)',
        type: 'any[] | IDataStore / ColumnDef[]',
        defaultValue: 'zorunlu',
        required: true,
        description:
          'Veri kaynağı ve 14 sütun tipini (currency, dropdown, multiselect, sparkline vb.) destekleyen sütun tanımları.',
      },
      {
        name: 'theme (SheetGL)',
        type: 'IGridThemeTokens',
        defaultValue: 'Otomatik uxiGL teması',
        description: 'Liquid Glass veya Dinamik Tonal WebGL/Canvas tema şablonu.',
      },
      {
        name: 'batchEditMode / showFormulaBar',
        type: 'boolean / boolean',
        defaultValue: 'true / true',
        description: 'DevExtreme tarzı toplu CRUD düzenleme ve Excel fx formül çubuğu.',
      },
      {
        name: 'sparklineData (StatCard)',
        type: 'number[]',
        defaultValue: '[28, 42, 36, ...]',
        description: 'SVG mini grafiğini çizen sayısal veri dizisi.',
      },
    ],
  },
  {
    id: 'filemangl-explorer',
    name: 'FileManGL Explorer',
    turkishTitle: 'FileManGL Dosya Yöneticisi',
    category: 'feedback',
    summary:
      'WebGL2 hızlandırmalı 3D Spatial & Disk Haritası görünümleri, Çift Panel (Dual-Pane), Hibrit ACL+POSIX izin motoru ve ZIP arşivleme sunan dosya yöneticisi.',
    importPath: 'filemangl',
    importStatement:
      "import { FileManGL, I18nProvider, DEFAULT_FILE_MANAGER_CONFIG } from 'filemangl';\nimport 'filemangl/style.css';",
    dos: [
      'uxiGL resolvedMode değerini config.theme ("dark" | "light") ve .theme-light sınıfı ile senkronize edin.',
      'Büyük klasör analizlerinde disk_map_webgl veya spatial_webgl görünümlerini açın.',
      'İki dizin arası hızlı transfer için enableDualPane={true} aktif edin.',
    ],
    donts: [
      'FileManGL bileşenini I18nProvider sarmalayıcısı olmadan çağırmayın.',
    ],
    accessibilityNotes: [
      'Klavye kısayolları (Ctrl+C/X/V, Delete, F2, Ctrl+A) ve sağ tık bağlam menüsü tam desteklidir.',
    ],
    examples: [
      {
        id: 'filemangl-basic-example',
        title: '1. WebGL2 Hızlandırmalı Kurumsal Dosya Yöneticisi (VFS & REST)',
        description:
          'TR/EN/DE/RU çoklu dil, Dual-Pane çift panel ve ACL+POSIX güvenlik denetçisi.',
        code: `<I18nProvider locale="tr" onLocaleChange={setLocale}>
  <div className={resolvedMode === 'light' ? 'theme-light' : 'theme-dark'}>
    <FileManGL
      config={{
        ...DEFAULT_FILE_MANAGER_CONFIG,
        theme: resolvedMode,
        defaultViewMode: 'grid',
        enableDualPane: false,
        enableWebGLAcceleration: true,
      }}
      onConfigChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
    />
  </div>
</I18nProvider>`,
      },
    ],
    propsTable: [
      {
        name: 'config (FileManGL)',
        type: 'IFileManagerConfig',
        defaultValue: 'DEFAULT_FILE_MANAGER_CONFIG',
        required: true,
        description:
          'Görünüm modu, VFS/REST sürücüsü, WebGL2 hızlandırma, Dual-Pane ve ACL/POSIX izin ayarlarını içeren yapılandırma nesnesi.',
      },
      {
        name: 'config.defaultViewMode',
        type: "'grid' | 'details' | 'compact' | 'tiles' | 'spatial_webgl' | 'disk_map_webgl'",
        defaultValue: "'grid'",
        description: 'Klasik liste/grid veya WebGL2 3D uzamsal / Sunburst disk haritası modu.',
      },
      {
        name: 'config.enableDualPane',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Yan yana iki bağımsız gezgin sekmesi (Dual-Pane) açar.',
      },
      {
        name: 'config.driverType',
        type: "'vfs_localstorage' | 'vfs_memory' | 'rest_connector'",
        defaultValue: "'vfs_localstorage'",
        description: 'Sanal Dosya Sistemi (VFS) veya uzak REST API bağlayıcısı.',
      },
    ],
  },
];
