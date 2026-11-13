import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Mail,
  Phone,
  CreditCard,
  Download,
  Bell,
  Sun,
  Layers,
  ShieldCheck,
  Cpu,
  Globe,
  Send,
  Plus,
} from 'lucide-react';
import {
  Button,
  Input,
  CurrencyInput,
  type CurrencyCode,
  DateTimePickerInput,
  MultiSelectTagInput,
  FileUploadDropzone,
  type UploadedFileItem,
  Select,
  Textarea,
  Alert,
  Switch,
  Checkbox,
  Slider,
  Badge,
  Chip,
  Avatar,
  AvatarGroup,
  Progress,
  Tooltip,
  Skeleton,
  GoogleIcon,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  Tabs,
  Accordion,
  Stepper,
  Timeline,
  Modal,
  type ModalVariant,
  Drawer,
  type DrawerPlacement,
  StatCard,
  DataTable,
  type NativeTableVariant,
  Pagination,
  SheetGLGridAdapter,
  FileManGLExplorerAdapter,
} from '../../components/composites';
import { UXILogo } from '../../components/brand/UXILogo';
import { CodeGeneratorService } from '../../core/services/CodeGeneratorService';
import { useToast } from '../../providers/ToastProvider';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export interface DocPropRow {
  name: string;
  type: string;
  defaultValue: string;
  required?: boolean;
  description: string;
}

export interface DocComponentGuideItem {
  id: string;
  tag: string;
  titleTr: string;
  titleEn: string;
  categoryLabelTr: string;
  categoryLabelEn: string;
  playgroundId?: string;
  importStatement: string;
  architectureNoteTr: string;
  architectureNoteEn: string;
  summaryTr: string;
  summaryEn: string;
  code: string;
  propsTable: DocPropRow[];
  renderLiveDemo: () => React.ReactNode;
}

export interface ComponentDocCardProps {
  guide: DocComponentGuideItem;
  isTR: boolean;
  onOpenPlayground?: (playgroundId: string) => void;
}

export const ComponentDocCard: React.FC<ComponentDocCardProps> = ({
  guide,
  isTR,
  onOpenPlayground,
}) => {
  const { notify } = useToast();
  const { copiedText, copy } = useCopyToClipboard();
  const isCodeCopied = copiedText === guide.code;
  const isImportCopied = copiedText === guide.importStatement;

  return (
    <div
      id={`doc-comp-${guide.id}`}
      style={{
        borderRadius: 'var(--uxu-radius-lg, 16px)',
        border: '1px solid var(--uxu-border-subtle)',
        background: 'var(--uxu-bg-elevated)',
        padding: 'clamp(16px, 2.5vw, 24px)',
        boxShadow: 'var(--uxu-shadow-card)',
        scrollMarginTop: 24,
      }}
    >
      {/* 1. Card Header (SheetGL ColumnGuideCard Style) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingBottom: 14,
          borderBottom: '1px solid var(--uxu-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              background: 'var(--uxu-primary-container)',
              color: 'var(--uxu-primary)',
              fontFamily: 'var(--uxu-font-mono)',
              fontWeight: 800,
              fontSize: '0.84rem',
            }}
          >
            {guide.tag}
          </span>
          <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800 }}>
            {isTR ? guide.titleTr : guide.titleEn}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="neutral" size="xs">
            {isTR ? guide.categoryLabelTr : guide.categoryLabelEn}
          </Badge>
          {guide.playgroundId && onOpenPlayground && (
            <Button
              variant="tonal"
              size="xs"
              trailingIcon={<ArrowRight size={13} />}
              onClick={() => onOpenPlayground(guide.playgroundId!)}
            >
              {isTR ? 'Playground’da Aç' : 'Open Playground'}
            </Button>
          )}
        </div>
      </div>

      {/* 2. Summary Description */}
      <p
        style={{
          fontSize: '0.9rem',
          lineHeight: 1.65,
          color: 'var(--uxu-text-secondary)',
          margin: '14px 0',
        }}
      >
        {isTR ? guide.summaryTr : guide.summaryEn}
      </p>

      {/* 3. Metadata Grid (Import Statement + Architectural Role) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
          margin: '14px 0 18px',
        }}
      >
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--uxu-radius-md)',
            background: 'var(--uxu-surface-tonal)',
            border: '1px solid var(--uxu-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--uxu-text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {isTR ? 'PAKET İÇE AKTARIMI (IMPORT)' : 'PACKAGE IMPORT'}
            </span>
            <button
              type="button"
              onClick={() => {
                copy(guide.importStatement);
                notify({
                  title: isTR ? 'Import Kopyalandı' : 'Import Copied',
                  description: guide.importStatement,
                  tone: 'success',
                });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-bg-elevated)',
                color: 'var(--uxu-primary)',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isImportCopied ? <Check size={11} /> : <Copy size={11} />}
              {isImportCopied ? (isTR ? 'Kopyalandı' : 'Copied') : isTR ? 'Kopyala' : 'Copy'}
            </button>
          </div>
          <code
            style={{
              fontFamily: 'var(--uxu-font-mono)',
              fontSize: '0.76rem',
              color: 'var(--uxu-primary)',
              wordBreak: 'break-word',
            }}
          >
            {guide.importStatement}
          </code>
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--uxu-radius-md)',
            background: 'var(--uxu-surface-tonal)',
            border: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--uxu-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isTR ? 'MİMARİ ROL & ERİŞİLEBİLİRLİK (ARIA)' : 'ARCHITECTURAL ROLE & A11Y'}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: '0.8rem',
              color: 'var(--uxu-text-primary)',
              lineHeight: 1.5,
            }}
          >
            {isTR ? guide.architectureNoteTr : guide.architectureNoteEn}
          </div>
        </div>
      </div>

      {/* 4. Live Interactive Sandbox Box (SheetGL LiveDemoBox Style) */}
      <div
        style={{
          borderRadius: 'var(--uxu-radius-md)',
          border: '1px solid var(--uxu-border-strong)',
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--uxu-primary) 5%, transparent), var(--uxu-surface-tonal))',
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--uxu-success)',
                boxShadow: '0 0 8px var(--uxu-success)',
              }}
            />
            <strong style={{ fontSize: '0.78rem', letterSpacing: '0.03em' }}>
              {isTR
                ? `CANLI ETKİLEŞİMLİ ÖRNEK — ${guide.tag}`
                : `LIVE INTERACTIVE SANDBOX — ${guide.tag}`}
            </strong>
          </div>
          <Badge tone="success" size="xs">
            {isTR ? 'Canlı Test' : 'Interactive'}
          </Badge>
        </div>

        <div>{guide.renderLiveDemo()}</div>
      </div>

      {/* 5. Props API Reference Table */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--uxu-text-secondary)',
            marginBottom: 8,
          }}
        >
          {isTR
            ? `${guide.tag} Props & API Referans Tablosu (${guide.propsTable.length} Özellik)`
            : `${guide.tag} Props & API Reference (${guide.propsTable.length} Props)`}
        </div>
        <div className="uxu-props-table-scroll">
          <table className="uxu-props-table">
            <thead>
              <tr>
                <th>{isTR ? 'Prop Adı' : 'Prop Name'}</th>
                <th>{isTR ? 'Tip (TypeScript)' : 'Type'}</th>
                <th>{isTR ? 'Varsayılan' : 'Default'}</th>
                <th>{isTR ? 'Açıklama' : 'Description'}</th>
              </tr>
            </thead>
            <tbody>
              {guide.propsTable.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code className="uxu-prop-name">{prop.name}</code>
                    {prop.required && (
                      <Badge
                        tone="danger"
                        variant="tonal"
                        size="xs"
                        style={{ marginLeft: 6 }}
                      >
                        {isTR ? 'Zorunlu' : 'Required'}
                      </Badge>
                    )}
                  </td>
                  <td>
                    <code className="uxu-prop-type">{prop.type}</code>
                  </td>
                  <td>
                    <code className="uxu-prop-default">{prop.defaultValue}</code>
                  </td>
                  <td className="uxu-prop-desc">{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Syntax-Highlighted Copyable Code Block */}
      <div className="uxu-code-panel-wrapper">
        <div className="uxu-code-panel-header">
          <span>
            {guide.tag} — {isTR ? 'Uygulama Kodu (TSX)' : 'Usage Example (TSX)'}
          </span>
          <Button
            variant="tonal"
            size="xs"
            leadingIcon={isCodeCopied ? <Check size={13} /> : <Copy size={13} />}
            onClick={() => {
              copy(guide.code);
              notify({
                title: isTR ? 'Kod Panoya Kopyalandı' : 'Code Copied',
                description: guide.tag,
                tone: 'success',
              });
            }}
          >
            {isCodeCopied
              ? isTR
                ? 'Kopyalandı'
                : 'Copied'
              : isTR
              ? 'Kodu Kopyala'
              : 'Copy Code'}
          </Button>
        </div>
        <pre className="uxu-code-block">
          <code>
            {CodeGeneratorService.tokenize(guide.code).map((tok, idx) =>
              tok.type === 'plain' ? (
                <React.Fragment key={idx}>{tok.value}</React.Fragment>
              ) : (
                <span key={idx} className={`uxu-syn-${tok.type}`}>
                  {tok.value}
                </span>
              )
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

/* ============================================================================
 * LIVE MINI-DEMO COMPONENTS FOR EVERY SINGLE UXIGL COMPONENT
 * ============================================================================ */

const ButtonLiveMiniDemo: React.FC = () => {
  const [syncPressed, setSyncPressed] = useState(true);
  const [filterExpanded, setFilterExpanded] = useState(false);
  return (
    <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
      <Button variant="filled" leadingIcon={<Sparkles size={15} />}>
        Filled (Birincil)
      </Button>
      <Button variant="tonal">Tonal (M3)</Button>
      <Button variant="glass">Liquid Glass</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="success">Success</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
      <Button
        variant="glass"
        toggleable
        statusDot
        pressed={syncPressed}
        onToggle={setSyncPressed}
      >
        Switch Modu: {syncPressed ? 'Açık' : 'Kapalı'}
      </Button>
      <Button
        variant="tonal"
        collapsible
        expanded={filterExpanded}
        badgeCount={4}
        onExpandChange={setFilterExpanded}
      >
        Collapse ({filterExpanded ? 'Açık' : 'Kapalı'})
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
    </div>
  );
};

const InputLiveMiniDemo: React.FC = () => {
  const [email, setEmail] = useState('architect@truncgil.com');
  const [phone, setPhone] = useState('0532 410 88 92');
  const [card, setCard] = useState('4543 6012 8941 0098');
  return (
    <div className="uxu-stage-grid-2">
      <Input
        label="Kurumsal E-Posta (Clearable + Sayaç)"
        value={email}
        onChange={setEmail}
        leadingIcon={<Mail size={15} />}
        clearable
        showCount
        maxLength={64}
      />
      <Input
        label="Telefon Maskesi (mask='phone')"
        mask="phone"
        value={phone}
        onChange={setPhone}
        leadingIcon={<Phone size={15} />}
      />
      <Input
        label="Kredi Kartı Maskesi (mask='credit-card')"
        mask="credit-card"
        value={card}
        onChange={setCard}
        leadingIcon={<CreditCard size={15} />}
        surface="tonal"
      />
      <Input
        label="Prefix & Suffix Subdomain"
        prefixText="https://"
        suffixText=".uxigl.com"
        value="kurumsal"
        onChange={() => {}}
      />
    </div>
  );
};

const CurrencyInputLiveMiniDemo: React.FC = () => {
  const [amount, setAmount] = useState<number>(148500);
  const [currency, setCurrency] = useState<CurrencyCode>('TRY');
  return (
    <CurrencyInput
      label="B2B Hakediş & Fatura Tutarı (Canlı KDV Hesaplayıcı)"
      value={amount}
      onChange={setAmount}
      currency={currency}
      onCurrencyChange={setCurrency}
      vatRate={20}
      showVatBreakdown
    />
  );
};

const DateTimeLiveMiniDemo: React.FC = () => {
  const [date, setDate] = useState('2026-11-15');
  const [time, setTime] = useState('14:30');
  return (
    <DateTimePickerInput
      label="Fatura Vade & Teslimat Zamanı (+15G / +30G Hızlı Çipler)"
      dateValue={date}
      timeValue={time}
      onDateChange={setDate}
      onTimeChange={setTime}
      includeTime
      showPresets
    />
  );
};

const MultiSelectTagsLiveMiniDemo: React.FC = () => {
  const [tags, setTags] = useState<string[]>([
    'e-Fatura Mükellefi',
    'SOC2-Type-II',
    'Öncelikli SLA',
  ]);
  return (
    <MultiSelectTagInput
      label="Kurumsal Cari Etiketler (Enter ile ekle / öneriye tıkla)"
      tags={tags}
      onChange={setTags}
      maxTags={8}
    />
  );
};

const FileDropzoneLiveMiniDemo: React.FC = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([
    {
      id: 'doc-1',
      name: 'GIB_eFatura_Zarf_2026.xml',
      sizeKb: 312,
      type: 'xml',
      progress: 100,
      status: 'completed',
    },
    {
      id: 'doc-2',
      name: 'Kurumsal_SLA_Sozlesmesi.pdf',
      sizeKb: 1420,
      type: 'pdf',
      progress: 100,
      status: 'completed',
    },
  ]);
  return <FileUploadDropzone files={files} onChange={setFiles} />;
};

const SelectTextareaLiveMiniDemo: React.FC = () => {
  const [region, setRegion] = useState('eu-central');
  const [note, setNote] = useState(
    'İrsaliye yerine geçer. 30 gün vadeli B2B kurumsal mutabakat faturasıdır.'
  );
  return (
    <div className="uxu-stage-grid-2">
      <Select
        label="Bulut Dağıtım Bölgesi (<Select />)"
        value={region}
        onChange={setRegion}
        options={[
          {
            value: 'eu-central',
            label: 'Frankfurt M4 Kümesi (eu-central-1)',
            description: '9ms gecikme • Birincil',
            badge: 'Aktif',
          },
          {
            value: 'tr-west',
            label: 'İstanbul Edge Düğümü (tr-west-1)',
            description: '2ms yerel gecikme • GİB Uyumlu',
            badge: '2ms',
          },
          {
            value: 'us-east',
            label: 'Virginia Kuzey (us-east-1)',
            description: 'Yedek felaket kurtarma kümesi',
          },
        ]}
      />
      <Textarea
        label="e-Fatura Açıklama Notu (<Textarea />)"
        value={note}
        onChange={setNote}
        rows={3}
        maxLength={200}
        showCount
        quickTemplates={['İrsaliye yerine geçer.', 'Tevkifatlı Fatura']}
      />
    </div>
  );
};

const SwitchCheckboxSliderLiveMiniDemo: React.FC = () => {
  const [sw, setSw] = useState(true);
  const [chk, setChk] = useState(true);
  const [sld, setSld] = useState(75);
  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2">
        <Switch
          label="Liquid Glass Adaptif Bulanıklık (<Switch />)"
          description="Kaydırıldığında geçici sıvı cam merceği aktifleşir"
          value={sw}
          onChange={setSw}
          tone="primary"
        />
        <Checkbox
          label="GİB e-Fatura & KVKK Onayı (<Checkbox />)"
          description="Animasyonlu SVG onay işareti ve indeterminate desteği"
          value={chk}
          onChange={setChk}
          tone="success"
        />
      </div>
      <Slider
        label="Kontrol Merkezi Çıkış Seviyesi (<Slider />)"
        value={sld}
        onChange={setSld}
        min={0}
        max={100}
        step={5}
        showTicks
        valueSuffix="%"
        leadingIcon={<Sun size={15} />}
      />
    </div>
  );
};

const BrandIconsLiveMiniDemo: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <UXILogo size={48} glow />
        <div>
          <strong style={{ fontSize: '0.92rem' }}>UXILogo (U + X + I Monogram)</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)' }}>
            Tek glif 3D Liquid-Glass amblem
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <GoogleIcon name="dashboard" tone="primary" size={26} />
        <GoogleIcon name="table_chart" tone="success" size={26} filled />
        <GoogleIcon name="folder_open" tone="info" size={26} />
        <GoogleIcon name="verified_user" tone="warning" size={26} filled />
        <GoogleIcon name="bolt" tone="danger" size={26} />
      </div>
    </div>
  );
};

const CardSurfaceLiveMiniDemo: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
      }}
    >
      {(['glass', 'tonal', 'elevated', 'outlined'] as const).map((v) => (
        <Card
          key={v}
          variant={v}
          padding="sm"
          interactive
          glowOnHover={v === 'glass'}
          eyebrow={v.toUpperCase()}
          title={`variant="${v}"`}
          subtitle="Liquid Glass × Dinamik Ton"
        >
          <div style={{ fontSize: '0.76rem', color: 'var(--uxu-text-secondary)' }}>
            Çok katmanlı yüzey kartı
          </div>
        </Card>
      ))}
    </div>
  );
};

const SegmentedTabsAccordionLiveMiniDemo: React.FC = () => {
  const [seg, setSeg] = useState<'glass' | 'tonal' | 'hybrid'>('glass');
  const [tab, setTab] = useState('t1');
  return (
    <div className="uxu-stack-md">
      <SegmentedControl
        value={seg}
        onChange={setSeg}
        fullWidth
        options={[
          { value: 'glass', label: 'Liquid Glass', badge: '8pt' },
          { value: 'tonal', label: 'Dinamik Tonal', badge: 'Tonal' },
          { value: 'hybrid', label: 'uxiGL Hibrit Sentez' },
        ]}
      />
      <Tabs
        variant="pill"
        activeId={tab}
        onChange={setTab}
        items={[
          { id: 't1', label: 'Genel Bakış', count: 4 },
          { id: 't2', label: 'Tasarım Tokenları', count: 24 },
          { id: 't3', label: 'Güvenlik SLA', count: 2 },
        ]}
      />
      <Accordion
        variant="glass"
        defaultExpandedIds={['a1']}
        items={[
          {
            id: 'a1',
            title: 'Accordion Paneli #1 — Yay Fiziği & Çoklu Açılım',
            content:
              'allowMultiple={true} verildiğinde aynı anda birden fazla akordeon paneli açık kalabilir.',
          },
          {
            id: 'a2',
            title: 'Accordion Paneli #2 — Klavye & ARIA Desteği',
            content: 'Başlıklar otomatik aria-expanded niteliği üretir.',
          },
        ]}
      />
    </div>
  );
};

const StepperTimelineLiveMiniDemo: React.FC = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="uxu-stage-grid-2">
      <div className="uxu-stack-md">
        <Stepper
          activeStep={step}
          onStepClick={setStep}
          steps={[
            { id: 's1', title: 'Cari Doğrulama', subtitle: 'VKN Kontrolü', meta: 'Adım 1' },
            { id: 's2', title: 'Teminat Onayı', subtitle: 'Limit Tahsisi', meta: 'Adım 2' },
            { id: 's3', title: 'GİB Aktivasyon', subtitle: 'Canlı Küme', meta: 'Adım 3' },
          ]}
        />
      </div>
      <Timeline
        items={[
          {
            id: 'tl1',
            title: 'e-Fatura Zarfı Onaylandı',
            description: 'ETTN #9482 otomatik muhasebeleşti.',
            timestamp: '10:42',
            tone: 'success',
            badge: 'GİB #200',
          },
          {
            id: 'tl2',
            title: 'SheetGL Veri Senkronizasyonu',
            description: '10.000 satırlık stok hareketi aktarıldı.',
            timestamp: '09:15',
            tone: 'primary',
          },
        ]}
      />
    </div>
  );
};

const ModalDrawerAlertLiveMiniDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<ModalVariant>('default');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPos, setDrawerPos] = useState<DrawerPlacement>('right');

  return (
    <div className="uxu-stack-md">
      <Alert
        tone="info"
        variant="glass"
        title="Satır İçi Bilgi Bandı (<Alert />)"
        description="primary, success, warning, danger, info ve glass tonlarında kalıcı durum mesajları sunar."
      />
      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {(['default', 'confirm', 'danger', 'sheet', 'glass'] as ModalVariant[]).map((mv) => (
          <Button
            key={mv}
            variant={mv === 'danger' ? 'danger' : 'tonal'}
            size="sm"
            onClick={() => {
              setModalVariant(mv);
              setModalOpen(true);
            }}
          >
            Modal Aç: {mv.toUpperCase()}
          </Button>
        ))}
        {(['right', 'left', 'bottom'] as DrawerPlacement[]).map((dp) => (
          <Button
            key={dp}
            variant="outlined"
            size="sm"
            onClick={() => {
              setDrawerPos(dp);
              setDrawerOpen(true);
            }}
          >
            Drawer Aç: {dp.toUpperCase()}
          </Button>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        showMacTrafficLights
        title={`Kurumsal Modal Diyalog (${modalVariant.toUpperCase()})`}
        subtitle="ESC tuşu veya arka plan tıklaması ile kapanır"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Vazgeç
            </Button>
            <Button
              variant={modalVariant === 'danger' ? 'danger' : 'filled'}
              size="sm"
              leadingIcon={<Send size={14} />}
              onClick={() => setModalOpen(false)}
            >
              Onayla
            </Button>
          </div>
        }
      >
        <p className="uxu-muted-p">
          Bu pencere <code>variant=&quot;{modalVariant}&quot;</code> kipinde açıldı.
        </p>
      </Modal>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement={drawerPos}
        title={`Kayar Yan Çekmece (${drawerPos.toUpperCase()})`}
        subtitle="3 yönlü (right, left, bottom) kurumsal denetçi paneli"
      >
        <p className="uxu-muted-p">
          Drawer bileşeni tablo satır detayları, filtre panelleri ve hızlı formlar için idealdir.
        </p>
      </Drawer>
    </div>
  );
};

const BadgesChipsAvatarsLiveMiniDemo: React.FC = () => {
  const [selectedChip, setSelectedChip] = useState('Liquid Glass');
  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <Badge tone="primary" pulse>
          Primary Canlı
        </Badge>
        <Badge tone="success" variant="glass" pulse>
          %99.99 SLA
        </Badge>
        <Badge tone="warning" variant="outlined">
          Bellek %82
        </Badge>
        <Badge tone="danger" variant="filled">
          Kritik (2)
        </Badge>
        {['Liquid Glass', 'Dinamik Ton', 'SheetGL 120Hz'].map((c) => (
          <Chip
            key={c}
            selected={selectedChip === c}
            onClick={() => setSelectedChip(c)}
            tone="primary"
          >
            {c}
          </Chip>
        ))}
      </div>

      <div className="uxu-stage-row" style={{ flexWrap: 'wrap', gap: 16 }}>
        <Tooltip content="Ümit Uz • Baş Sistem Mimarı" shortcut="⌘1">
          <Avatar name="Ümit Uz" status="online" shape="squircle" tone="primary" />
        </Tooltip>
        <AvatarGroup max={3}>
          <Avatar name="Deniz Kaya" status="online" tone="success" />
          <Avatar name="Selin Yılmaz" status="busy" tone="warning" />
          <Avatar name="Mert Can" tone="info" />
          <Avatar name="Elif Su" tone="primary" />
        </AvatarGroup>
        <Progress variant="circular" value={84} tone="success" size="md" />
        <div style={{ flex: 1, minWidth: 160 }}>
          <Skeleton variant="text" width="70%" height={12} />
          <div style={{ height: 6 }} />
          <Skeleton variant="squircle" width="100%" height={22} />
        </div>
      </div>
    </div>
  );
};

const StatCardNativeTableLiveMiniDemo: React.FC = () => {
  const [variant, setVariant] = useState<NativeTableVariant>('striped');
  const [page, setPage] = useState(1);
  return (
    <div className="uxu-stack-md">
      <div className="uxu-stage-grid-2">
        <StatCard
          label="Toplam Bulut İşlem Kapasitesi"
          value="148.6 TFLOPS"
          delta="+18.4%"
          trend="up"
          tone="primary"
          subtitle="Son 24 saatlik küme ortalaması"
          icon={<Cpu size={18} />}
          sparklineData={[32, 45, 41, 64, 72, 85, 96]}
        />
        <StatCard
          label="Küresel Uç Gecikmesi (Edge Latency)"
          value="11.2 ms"
          delta="-3.1 ms"
          trend="up"
          tone="success"
          subtitle="İstanbul • Frankfurt • Tokyo"
          icon={<Globe size={18} />}
          sparklineData={[22, 19, 17, 15, 14, 12, 11]}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SegmentedControl<NativeTableVariant>
          size="sm"
          value={variant}
          onChange={setVariant}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'striped', label: 'Striped' },
            { value: 'bordered', label: 'Bordered' },
            { value: 'minimal', label: 'Minimal' },
          ]}
        />
      </div>

      <DataTable
        rowKey="id"
        variant={variant}
        size="sm"
        selectable
        data={[
          { id: '1', service: 'Auth-Gateway-Edge', owner: 'Ümit Uz', latency: '4.2 ms', status: 'Healthy' },
          { id: '2', service: 'SheetGL-Compute-Engine', owner: 'Deniz Kaya', latency: '8.1 ms', status: 'Healthy' },
          { id: '3', service: 'FileManGL-VFS-Sync', owner: 'Selin Yılmaz', latency: '11.4 ms', status: 'Scaling' },
        ]}
        columns={[
          { key: 'service', header: 'Servis Adı', sortable: true },
          { key: 'owner', header: 'Sorumlu', sortable: true },
          { key: 'latency', header: 'Gecikme', sortable: true },
          {
            key: 'status',
            header: 'Durum',
            align: 'right',
            render: (r) => (
              <Badge tone={r.status === 'Healthy' ? 'success' : 'warning'} size="xs">
                {String(r.status)}
              </Badge>
            ),
          },
        ]}
      />
      <Pagination
        page={page}
        totalPages={5}
        totalItems={48}
        pageSize={10}
        onPageChange={setPage}
      />
    </div>
  );
};

/* ============================================================================
 * COMPLETE REGISTRY OF ALL UXIGL COMPONENT GUIDES
 * ============================================================================ */

export const FORM_CONTROL_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'button',
    tag: '<Button />',
    titleTr: 'Eylem, Switch-Toggle, Collapse & Split Menü Butonları',
    titleEn: 'Action, Switch-Toggle, Collapse & Split Menu Buttons',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'button',
    importStatement: "import { Button, type ButtonVariant } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Akıcı yay (spring) basış fiziği + dinamik tonal/filled yüzeyler. toggleable modda aria-pressed, collapsible modda aria-expanded üretir.',
    architectureNoteEn:
      'Spring press physics + adaptive tonal/filled surfaces. Automatically binds aria-pressed and aria-expanded.',
    summaryTr:
      '8 görsel varyant (filled, tonal, glass, outlined, ghost, success, warning, danger), Switch/Toggle durumu, Collapse/Expand aç-kapa modu, Split (bölünmüş açılır menülü) aksiyon ve Icon-Only kare buton yeteneklerini tek bileşende sunar.',
    summaryEn:
      'Unites 8 visual variants, Switch/Toggle state, Collapse/Expand mode, Split dropdown action menu, and Icon-Only mode in a single primitive.',
    code: `<Button variant="filled" leadingIcon={<Sparkles size={15} />}>Kaydet</Button>
<Button variant="glass" toggleable statusDot pressed={isSync} onToggle={setIsSync}>
  Canlı Senkronizasyon
</Button>
<Button
  variant="filled"
  splitAction
  splitItems={[
    { id: 'xlsx', label: 'Excel (.xlsx) İndir' },
    { id: 'csv', label: 'CSV (.csv) İndir' },
  ]}
>
  Dışa Aktar
</Button>`,
    propsTable: [
      {
        name: 'variant',
        type: "'filled' | 'tonal' | 'glass' | 'outlined' | 'ghost' | 'success' | 'warning' | 'danger'",
        defaultValue: "'filled'",
        description: 'Yüzey ve semantik renk varyantı.',
      },
      {
        name: 'size',
        type: "'xs' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '8pt uzamsal ızgaraya uyumlu buton yüksekliği ve iç dolgusu.',
      },
      {
        name: 'toggleable / pressed / onToggle',
        type: 'boolean / boolean / (next: boolean) => void',
        defaultValue: 'false',
        description: 'Butonu kalıcı açık/kapalı (Switch) anahtarına dönüştürür.',
      },
      {
        name: 'collapsible / expanded / badgeCount',
        type: 'boolean / boolean / number',
        defaultValue: 'false',
        description: 'Dönen ok (Chevron) ve filtre sayacı rozetiyle açılır/kapanır panel kontrolü sağlar.',
      },
      {
        name: 'splitAction / splitItems',
        type: 'boolean / ButtonSplitItem[]',
        defaultValue: 'false / []',
        description: 'Sağ kenarda ikincil seçenekler menüsü açan bölünmüş (Split) buton oluşturur.',
      },
      {
        name: 'loading / disabled / fullWidth / pill',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Asenkron dönen yükleme halkası, devre dışı bırakma, %100 genişlik ve tam kapsül köşe.',
      },
    ],
    renderLiveDemo: () => <ButtonLiveMiniDemo />,
  },
  {
    id: 'input',
    tag: '<Input />',
    titleTr: 'Metin Girişi, Otomatik Maskeleme & Floating Label',
    titleEn: 'Text Input, Auto-Masking & Floating Label',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'input',
    importStatement: "import { Input, type InputMaskPreset } from 'truncgil-uxigl';",
    architectureNoteTr:
      'FormControlContract<string> uygular: value ve onChange(nextValue: string) imzasıyla çalışır. Odaklandığında iç çift çerçeve oluşturmadan dış ışıma verir.',
    architectureNoteEn:
      'Implements FormControlContract<string> with value and onChange(nextValue: string). Clean single-border focus ring.',
    summaryTr:
      '4 yüzey varyantı (glass, tonal, filled, outlined), 5 yerleşik otomatik format maskesi (phone, credit-card, date, tax-id, iban), yüzen etiket (floatingLabel), şifre göster/gizle gözü, prefix/suffix sabit metinleri ve karakter sayacı sunar.',
    summaryEn:
      'Features 4 surface styles, 5 built-in masks (phone, credit-card, date, tax-id, iban), floating label, password reveal toggle, prefix/suffix slots, and character counter.',
    code: `<Input
  label="Kurumsal Telefon"
  mask="phone"
  value={phone}
  onChange={setPhone}
  leadingIcon={<Phone size={15} />}
  clearable
/>
<Input
  label="Çalışma Alanı Adresi"
  floatingLabel
  prefixText="https://"
  suffixText=".uxigl.com"
  value={subdomain}
  onChange={setSubdomain}
/>`,
    propsTable: [
      {
        name: 'value / onChange',
        type: 'string / (nextValue: string) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Kontrollü metin değeri ve doğrudan string döndüren değişim fonksiyonu.',
      },
      {
        name: 'surface',
        type: "'glass' | 'tonal' | 'filled' | 'outlined'",
        defaultValue: "'glass'",
        description: 'Giriş kutusunun materyal yüzeyi.',
      },
      {
        name: 'mask',
        type: "'none' | 'phone' | 'credit-card' | 'date' | 'tax-id' | 'iban'",
        defaultValue: "'none'",
        description: 'Kullanıcı yazarken otomatik boşluk ve rakam formatlaması uygular.',
      },
      {
        name: 'floatingLabel',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Etiketi kutu içinde konumlandırır; odaklandığında veya dolu olduğunda yukarı kaydırır.',
      },
      {
        name: 'validationState / errorText / helperText',
        type: "'default' | 'success' | 'warning' | 'error' / string",
        defaultValue: "'default'",
        description: 'Semantik doğrulama çerçevesi ve alt bilgi/hata mesajı.',
      },
      {
        name: 'clearable / showCharacterCount / maxLength',
        type: 'boolean / boolean / number',
        defaultValue: 'false',
        description: 'Tek tıkla temizleme (×) butonu ve sağ üstte canlı karakter sayacı (42/120).',
      },
    ],
    renderLiveDemo: () => <InputLiveMiniDemo />,
  },
  {
    id: 'currency-input',
    tag: '<CurrencyInput />',
    titleTr: 'Çoklu Döviz (TRY/USD/EUR/GBP) & Canlı KDV Hesaplayıcı',
    titleEn: 'Multi-Currency Accounting Input & Live VAT Breakdown',
    categoryLabelTr: 'Kurumsal B2B Form',
    categoryLabelEn: 'Enterprise B2B Form',
    playgroundId: 'input',
    importStatement: "import { CurrencyInput, type CurrencyCode } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Sayısal değeri yerel binlik/ondalık ayraçlarla biçimlendirir; KDV (%20 vb.) ve Genel Toplam dökümünü anlık hesaplar.',
    architectureNoteEn:
      'Formats numeric values with locale separators and computes live VAT and Grand Total breakdowns.',
    summaryTr:
      'B2B e-Fatura, muhasebe ve sipariş ekranları için tasarlanmış çoklu para birimi seçicili (₺ TRY, $ USD, € EUR, £ GBP), hızlı tutar artırma butonlu (+1.000, +10.000) ve canlı KDV dökümlü finansal giriş bileşeni.',
    summaryEn:
      'Financial input with currency switcher (TRY, USD, EUR, GBP), quick increment pills, and real-time VAT breakdown.',
    code: `<CurrencyInput
  label="Fatura / Hakediş Tutarı"
  value={amount}
  onChange={setAmount}
  currency={currency}
  onCurrencyChange={setCurrency}
  vatRate={20}
  showVatBreakdown={true}
/>`,
    propsTable: [
      {
        name: 'value / onChange',
        type: 'number / (nextAmount: number) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'KDV hariç net sayısal tutar ve değişim geri çağrısı.',
      },
      {
        name: 'currency / onCurrencyChange',
        type: "'TRY' | 'USD' | 'EUR' | 'GBP' / (next: CurrencyCode) => void",
        defaultValue: "'TRY'",
        description: 'Aktif döviz kodu ve döviz değiştirici.',
      },
      {
        name: 'vatRate / showVatBreakdown',
        type: 'number / boolean',
        defaultValue: '20 / true',
        description: 'Uygulanacak KDV yüzdesi ve alt kısımda Net + KDV = Genel Toplam şeridi.',
      },
    ],
    renderLiveDemo: () => <CurrencyInputLiveMiniDemo />,
  },
  {
    id: 'datetime-input',
    tag: '<DateTimePickerInput />',
    titleTr: 'Vade Kısayollu Tarih & Saat Seçici',
    titleEn: 'Date & Time Picker with Payment-Term Presets',
    categoryLabelTr: 'Kurumsal B2B Form',
    categoryLabelEn: 'Enterprise B2B Form',
    playgroundId: 'input',
    importStatement: "import { DateTimePickerInput } from 'truncgil-uxigl';",
    architectureNoteTr:
      'ISO-8601 (YYYY-MM-DD) tarih ve 24 saat (HH:mm) formatında çalışır; kurumsal vade çipleriyle tek tıkla tarih atar.',
    architectureNoteEn:
      'Works with ISO-8601 date and 24h time strings; includes one-click payment term preset chips.',
    summaryTr:
      'Üst başlığında "Bugün", "+15G Vade", "+30G Vade" ve "Ay Sonu" hızlı kısayol çipleri barındıran, tarih ve saat alanlarını yan yana sunan kurumsal zaman seçici.',
    summaryEn:
      'Enterprise date and time picker featuring Today, +15d, +30d, and End-of-Month quick preset chips.',
    code: `<DateTimePickerInput
  label="İşlem & Vade Tarihi"
  dateValue={invoiceDate}
  timeValue={invoiceTime}
  onDateChange={setInvoiceDate}
  onTimeChange={setInvoiceTime}
  includeTime={true}
  showPresets={true}
/>`,
    propsTable: [
      {
        name: 'dateValue / onDateChange',
        type: 'string / (nextDate: string) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'YYYY-MM-DD formatında tarih dizgesi.',
      },
      {
        name: 'timeValue / onTimeChange / includeTime',
        type: 'string / (nextTime: string) => void / boolean',
        defaultValue: "'14:30' / true",
        description: 'HH:mm saat değeri ve saat kutusunun görünürlüğü.',
      },
      {
        name: 'showPresets',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Bugün, +15G Vade, +30G Vade ve Ay Sonu kısayol butonlarını gösterir.',
      },
    ],
    renderLiveDemo: () => <DateTimeLiveMiniDemo />,
  },
  {
    id: 'multiselect-tags',
    tag: '<MultiSelectTagInput />',
    titleTr: 'Çoklu Etiket (Tag/Chip) & Hızlı Öneri Seçici',
    titleEn: 'Multi-Select Tag Input with Quick Suggestions',
    categoryLabelTr: 'Kurumsal B2B Form',
    categoryLabelEn: 'Enterprise B2B Form',
    playgroundId: 'input',
    importStatement: "import { MultiSelectTagInput } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Enter veya virgül (,) ile etiket ekler, Backspace ile son etiketi siler; maksimum etiket sınırını denetler.',
    architectureNoteEn:
      'Adds tags on Enter or comma, removes last tag on Backspace, and enforces maxTags limit.',
    summaryTr:
      'Maliyet merkezleri, izin rolleri veya ürün kategorileri için klavyeden anında etiket oluşturma ve alt kısımdaki hazır öneri listesinden tek tıkla ekleme imkanı sunar.',
    summaryEn:
      'Allows creating removable tags via keyboard or clicking suggested enterprise tags below the field.',
    code: `<MultiSelectTagInput
  label="Kurumsal Etiketler"
  tags={tags}
  onChange={setTags}
  suggestions={['e-Fatura Mükellefi', 'SOC2-Type-II', 'ISO-27001']}
  maxTags={8}
/>`,
    propsTable: [
      {
        name: 'tags / onChange',
        type: 'string[] / (nextTags: string[]) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Seçili etiket dizisi ve güncelleme fonksiyonu.',
      },
      {
        name: 'suggestions / maxTags',
        type: 'string[] / number',
        defaultValue: '[...] / 8',
        description: 'Hızlı ekleme önerileri ve izin verilen maksimum etiket sayısı.',
      },
    ],
    renderLiveDemo: () => <MultiSelectTagsLiveMiniDemo />,
  },
  {
    id: 'file-dropzone',
    tag: '<FileUploadDropzone />',
    titleTr: 'Sürükle-Bırak Dosya Yükleme & Belge Listesi',
    titleEn: 'Drag & Drop File Uploader with Progress List',
    categoryLabelTr: 'Kurumsal B2B Form',
    categoryLabelEn: 'Enterprise B2B Form',
    playgroundId: 'input',
    importStatement: "import { FileUploadDropzone, type UploadedFileItem } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Dosya uzantısına göre (PDF, XML, Image, Doc) otomatik ikon atar; yükleme yüzdesini ve dosya boyutunu gösterir.',
    architectureNoteEn:
      'Auto-detects file type icons (PDF, XML, Image, Doc) and renders upload progress and file size.',
    summaryTr:
      'Sözleşme, UBL-TR e-Fatura XML zarfı veya Excel tablolarını sürükleyip bırakarak yüklemek ve yüklenen belgeleri yönetmek için kullanılan bileşen.',
    summaryEn:
      'Drag-and-drop zone for uploading PDFs, UBL-TR XMLs, and spreadsheets with live file list management.',
    code: `<FileUploadDropzone
  label="Kurumsal Belge & e-Fatura Ekleri"
  files={uploadedFiles}
  onChange={setUploadedFiles}
  maxSizeMb={25}
/>`,
    propsTable: [
      {
        name: 'files / onChange',
        type: 'UploadedFileItem[] / (nextFiles: UploadedFileItem[]) => void',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Yüklü dosyaların listesi ve silme/ekleme geri çağrısı.',
      },
      {
        name: 'acceptLabel / maxSizeMb',
        type: 'string / number',
        defaultValue: "'PDF, UBL-TR XML...' / 25",
        description: 'Kabul edilen dosya tipleri açıklaması ve maksimum MB sınırı.',
      },
    ],
    renderLiveDemo: () => <FileDropzoneLiveMiniDemo />,
  },
  {
    id: 'select-textarea',
    tag: '<Select /> & <Textarea />',
    titleTr: 'Rozetli Açılır Seçim Kutusu & Şablonlu Çok Satırlı Metin',
    titleEn: 'Badge-Enhanced Select & Template-Assisted Textarea',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'input',
    importStatement: "import { Select, Textarea } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Select bileşeni her seçenekte rozet ve alt açıklama destekler; Textarea ise hazır metin şablonu çipleri sunar.',
    architectureNoteEn:
      'Select supports per-option badges and descriptions; Textarea includes quick-insert template chips.',
    summaryTr:
      'Kurumsal bölge/kategori seçimleri için <Select /> ve fatura/denetim notları için hazır şablon butonlarına sahip <Textarea /> bileşenleri.',
    summaryEn:
      '<Select /> with option descriptions/badges and <Textarea /> with character counter and quick-insert template pills.',
    code: `<Select
  label="Dağıtım Bölgesi"
  value={region}
  onChange={setRegion}
  options={[
    { value: 'eu', label: 'Frankfurt M4', badge: 'Aktif' },
    { value: 'tr', label: 'İstanbul Edge', badge: '2ms' },
  ]}
/>
<Textarea
  label="Açıklama Notu"
  value={note}
  onChange={setNote}
  maxLength={200}
  showCharacterCount
  quickTemplates={['İrsaliye yerine geçer.', 'Tevkifatlı Fatura']}
/>`,
    propsTable: [
      {
        name: 'options (Select)',
        type: 'SelectOptionItem[]',
        defaultValue: '[]',
        required: true,
        description: '{ value, label, description?, badge?, disabled? } nesne dizisi.',
      },
      {
        name: 'quickTemplates (Textarea)',
        type: 'string[]',
        defaultValue: 'undefined',
        description: 'Tıklandığında metin alanına otomatik eklenen hazır cümle şablonları.',
      },
    ],
    renderLiveDemo: () => <SelectTextareaLiveMiniDemo />,
  },
  {
    id: 'switch-checkbox-slider',
    tag: '<Switch />, <Checkbox /> & <Slider />',
    titleTr: 'Liquid Glass Anahtar, Onay Kutusu & Control Center Kaydırıcı',
    titleEn: 'Liquid Glass Switch, Indeterminate Checkbox & Control Center Slider',
    categoryLabelTr: 'Form & Eylem',
    categoryLabelEn: 'Form & Action',
    playgroundId: 'switch',
    importStatement: "import { Switch, Checkbox, Slider } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Switch ve Slider kontrol başlıkları etkileşim anında geçici Liquid Glass kapsülüne dönüşür.',
    architectureNoteEn:
      'Switch and Slider thumbs morph into transient Liquid Glass lenses during interaction.',
    summaryTr:
      'Boolean ayarlar için <Switch />, tekli/kısmi (indeterminate) seçimler için <Checkbox /> ve sayısal aralıklar için adım noktalı (showTicks) <Slider /> bileşenleri.',
    summaryEn:
      '<Switch /> for boolean toggles, <Checkbox /> with indeterminate state, and <Slider /> with tick marks.',
    code: `<Switch label="Adaptif Bulanıklık" value={enabled} onChange={setEnabled} tone="primary" />
<Checkbox label="KVKK Onayı" value={checked} indeterminate={isPartial} onChange={setChecked} />
<Slider label="Parlaklık" value={val} onChange={setVal} min={0} max={100} showTicks valueSuffix="%" />`,
    propsTable: [
      {
        name: 'value / onChange (Switch & Checkbox)',
        type: 'boolean / (next: boolean) => void',
        defaultValue: 'false',
        required: true,
        description: 'Açık/kapalı durumu ve değişim geri çağrısı.',
      },
      {
        name: 'indeterminate (Checkbox)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Alt öğelerin bir kısmı seçili olduğunda eksi (-) kısmi seçim ikonu gösterir.',
      },
      {
        name: 'min / max / step / showTicks (Slider)',
        type: 'number / number / number / boolean',
        defaultValue: '0 / 100 / 1 / false',
        description: 'Kaydırıcı sınırları, adım aralığı ve ray üzerindeki kılavuz noktaları.',
      },
    ],
    renderLiveDemo: () => <SwitchCheckboxSliderLiveMiniDemo />,
  },
  {
    id: 'brand-icons',
    tag: '<UXILogo /> & <GoogleIcon />',
    titleTr: '3D Liquid-Glass Monogram & Değişken Vektör Font İkonlar',
    titleEn: '3D Liquid-Glass Emblem & Variable Vector Font Icons',
    categoryLabelTr: 'Marka & İkonografi',
    categoryLabelEn: 'Brand & Iconography',
    importStatement: "import { UXILogo, GoogleIcon } from 'truncgil-uxigl';",
    architectureNoteTr:
      'GoogleIcon; font-variation-settings üzerinden FILL (0/1), wght (100-700) ve stil (rounded/outlined/sharp) eksenlerini canlı yönetir.',
    architectureNoteEn:
      'GoogleIcon drives variable font axes (FILL, wght, grade, opsz) across Rounded, Outlined, and Sharp styles.',
    summaryTr:
      'U, X ve I harflerini tek bir 3B kristal glifte birleştiren <UXILogo /> ve 2.500+ simgeyi sıfır SVG paket yüküyle sunan <GoogleIcon /> bileşeni.',
    summaryEn:
      '<UXILogo /> 3D monogram emblem and <GoogleIcon /> variable font icon component with theme-aware tones.',
    code: `<UXILogo size={42} preserveRatio glow />
<GoogleIcon name="auto_awesome" tone="primary" size={24} filled />
<GoogleIcon name="table_chart" iconStyle="rounded" weight={500} tone="success" />`,
    propsTable: [
      {
        name: 'name (GoogleIcon)',
        type: 'string',
        defaultValue: 'zorunlu',
        required: true,
        description: 'Vektör ikon ligatür adı (örn: "dashboard", "lock", "table_chart").',
      },
      {
        name: 'iconStyle / filled / weight',
        type: "'rounded' | 'outlined' | 'sharp' / boolean / 100..700",
        defaultValue: 'Tema varsayılanı',
        description: 'İkon köşe stili, iç dolgu (FILL) ve çizgi kalınlığı.',
      },
      {
        name: 'size / glow (UXILogo)',
        type: 'number / boolean',
        defaultValue: '36 / false',
        description: 'Logo boyutu (px) ve arka plan neon cam parıltısı.',
      },
    ],
    renderLiveDemo: () => <BrandIconsLiveMiniDemo />,
  },
];

export const SURFACE_NAVIGATION_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'card',
    tag: '<Card />',
    titleTr: 'Çok Katmanlı Yüzey Kartı (Glass, Tonal, Elevated, Outlined)',
    titleEn: 'Multi-Layered Surface Card (Glass, Tonal, Elevated, Outlined)',
    categoryLabelTr: 'Yüzey & Kapsayıcı',
    categoryLabelEn: 'Surface & Container',
    playgroundId: 'card',
    importStatement: "import { Card, type SurfaceVariant } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Standart yüzey materyalleri (ultraThin..thick) ve dinamik tonal konteyner katmanlarını tek bileşende birleştirir.',
    architectureNoteEn:
      'Unites standard surface materials and dynamic tonal surface containers with structured header/footer slots.',
    summaryTr:
      'Üst kaş (eyebrow), başlık, alt başlık, sol ikon, sağ aksiyon rozeti ve altbilgi (footer) yuvalarını hazır prop olarak sunan temel içerik kapsayıcısı.',
    summaryEn:
      'Primary content container featuring built-in eyebrow, title, subtitle, headerIcon, headerAction, and footer slots.',
    code: `<Card
  variant="glass"
  padding="md"
  glowOnHover
  eyebrow="SUNUCU KÜMESİ"
  title="Frankfurt M4 Veri Düğümü"
  subtitle="Liquid Glass + Speküler Üst Kenar Işıması"
  headerAction={<Badge tone="success" pulse>Aktif</Badge>}
>
  <p>Kart içeriği buraya gelir.</p>
</Card>`,
    propsTable: [
      {
        name: 'variant',
        type: "'glass' | 'tonal' | 'elevated' | 'outlined' | 'flat'",
        defaultValue: "'glass'",
        description: 'Kartın yüzey materyali.',
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '8pt ızgarasına uyumlu iç boşluk ölçeği.',
      },
      {
        name: 'eyebrow / title / subtitle / headerIcon / headerAction / footer',
        type: 'string / ReactNode',
        defaultValue: 'undefined',
        description: 'Yapılandırılmış üst başlık ve alt çubuk yuvaları.',
      },
      {
        name: 'interactive / glowOnHover',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Üzerine gelindiğinde hafif yükselme ve vurgu rengi ışıması.',
      },
    ],
    renderLiveDemo: () => <CardSurfaceLiveMiniDemo />,
  },
  {
    id: 'segmented-tabs-accordion',
    tag: '<SegmentedControl />, <Tabs /> & <Accordion />',
    titleTr: 'Kayan Kapsül Seçici, Sekme Çubuğu & Açılır Akordeon Paneller',
    titleEn: 'Sliding Segmented Pill, Tab Bar & Collapsible Accordion',
    categoryLabelTr: 'Gezinme & Органиzasyon',
    categoryLabelEn: 'Navigation & Disclosure',
    playgroundId: 'segmented-control',
    importStatement: "import { SegmentedControl, Tabs, Accordion } from 'truncgil-uxigl';",
    architectureNoteTr:
      'SegmentedControl seçeneklerinde href tanımlandığında semantik <a> etiketi üretir; klavye ok tuşlarıyla gezilebilir.',
    architectureNoteEn:
      'SegmentedControl renders semantic <a> links when href is provided and supports full arrow-key navigation.',
    summaryTr:
      'Görünüm kipi değiştirmek için <SegmentedControl />, içerik sekmeleri için <Tabs variant="pill | underline" /> ve SSS/ayar grupları için <Accordion /> bileşenleri.',
    summaryEn:
      'Mode switching via <SegmentedControl />, content switching via <Tabs />, and progressive disclosure via <Accordion />.',
    code: `<SegmentedControl
  value={mode}
  onChange={setMode}
  options={[
    { value: 'glass', label: 'Liquid Glass', badge: '8pt' },
    { value: 'tonal', label: 'Dynamic Tonal', badge: 'Tonal' },
  ]}
/>
<Tabs activeId={tab} onChange={setTab} variant="pill" items={tabItems} />
<Accordion variant="glass" allowMultiple items={faqItems} />`,
    propsTable: [
      {
        name: 'options (SegmentedControl)',
        type: 'SegmentedOption<T>[]',
        defaultValue: '[]',
        required: true,
        description: '{ value, label, icon?, badge?, href?, disabled? } seçenek listesi.',
      },
      {
        name: 'variant (Tabs)',
        type: "'underline' | 'pill'",
        defaultValue: "'underline'",
        description: 'Alt çizgili veya kapsül dolgulu sekme görünümü.',
      },
      {
        name: 'allowMultiple (Accordion)',
        type: 'boolean',
        defaultValue: 'false',
        description: 'Aynı anda birden fazla akordeon panelinin açık kalmasına izin verir.',
      },
    ],
    renderLiveDemo: () => <SegmentedTabsAccordionLiveMiniDemo />,
  },
  {
    id: 'stepper-timeline',
    tag: '<Stepper /> & <Timeline />',
    titleTr: 'Çok Adımlı Süreç Sihirbazı & Zaman Damgalı Denetim Akışı',
    titleEn: 'Multi-Step Workflow Wizard & Audit Activity Timeline',
    categoryLabelTr: 'Süreç & Akış',
    categoryLabelEn: 'Workflow & Audit',
    playgroundId: 'tabs-accordion',
    importStatement: "import { Stepper, Timeline } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Stepper tamamlanan adımları yeşil onay ikonuyla işaretler; Timeline ise dikey bağlantı çizgisi ve semantik düğümler çizer.',
    architectureNoteEn:
      'Stepper marks completed steps automatically; Timeline renders semantic status nodes and timestamps.',
    summaryTr:
      'Kayıt, ödeme ve kurulum sihirbazları için tıklanabilir <Stepper /> ve sistem logları / sipariş geçmişi için <Timeline /> bileşenleri.',
    summaryEn:
      'Interactive <Stepper /> for multi-stage wizards and <Timeline /> for chronological audit trails.',
    code: `<Stepper
  activeStep={activeStep}
  onStepClick={setActiveStep}
  steps={[
    { id: '1', title: 'Cari Doğrulama', subtitle: 'VKN Kontrolü' },
    { id: '2', title: 'Sözleşme Onayı', subtitle: 'Teminat Limiti' },
  ]}
/>
<Timeline items={auditLogs} />`,
    propsTable: [
      {
        name: 'steps / activeStep / onStepClick (Stepper)',
        type: 'StepItem[] / number / (index: number) => void',
        defaultValue: '[] / 0',
        required: true,
        description: 'Adım tanımları ve 0 tabanlı aktif adım indeksi.',
      },
      {
        name: 'items (Timeline)',
        type: 'TimelineItem[]',
        defaultValue: '[]',
        required: true,
        description: '{ id, title, description?, timestamp?, tone?, badge?, icon? } dizisi.',
      },
    ],
    renderLiveDemo: () => <StepperTimelineLiveMiniDemo />,
  },
  {
    id: 'modal-drawer-alert',
    tag: '<Modal />, <Drawer />, <Alert /> & <CommandPalette />',
    titleTr: '6 Varyantlı Modal, 3 Yönlü Drawer, Uyarı Bandı & Spotlight (⌘K)',
    titleEn: '6-Variant Modal, 3-Way Drawer, Inline Alert & Spotlight (⌘K)',
    categoryLabelTr: 'Katman & Diyalog',
    categoryLabelEn: 'Overlay & Dialog',
    playgroundId: 'modal-command',
    importStatement: "import { Modal, Drawer, CommandPalette, Alert } from 'truncgil-uxigl';",
    architectureNoteTr:
      'ESC tuşuyla kapanma, arka plan bulanıklaştırma (backdrop-filter) ve role="dialog" / aria-modal="true" standartlarını uygular.',
    architectureNoteEn:
      'Supports ESC key dismissal, glass backdrop blur, and WAI-ARIA role="dialog" semantics.',
    summaryTr:
      'Pencere kontrollü 6 diyalog arketipi sunan <Modal />, sağ/sol/alt yönlerden kayan <Drawer />, satır içi <Alert /> bandı ve global <CommandPalette /> (⌘K).',
    summaryEn:
      'Window-styled <Modal /> with 6 archetypes, 3-direction slide-over <Drawer />, inline <Alert />, and <CommandPalette />.',
    code: `<Modal
  open={open}
  onClose={() => setOpen(false)}
  variant="confirm" // 'default' | 'confirm' | 'danger' | 'alert' | 'sheet' | 'glass'
  showMacTrafficLights
  title="Toplu e-Fatura Gönderim Onayı"
>
  <Alert tone="warning" title="Dikkat" description="142 fatura GİB kuyruğuna iletilecek." />
</Modal>`,
    propsTable: [
      {
        name: 'variant (Modal)',
        type: "'default' | 'confirm' | 'danger' | 'alert' | 'sheet' | 'glass'",
        defaultValue: "'default'",
        description: 'Diyalog penceresinin görsel ve anlamsal arketipi.',
      },
      {
        name: 'placement (Drawer)',
        type: "'right' | 'left' | 'bottom'",
        defaultValue: "'right'",
        description: 'Çekmecenin açılacağı ekran kenarı.',
      },
      {
        name: 'tone / dismissible (Alert)',
        type: "'primary' | 'success' | 'warning' | 'danger' | 'info' | 'glass' / boolean",
        defaultValue: "'info' / false",
        description: 'Uyarı bandının renk tonu ve kapatma (×) butonu.',
      },
    ],
    renderLiveDemo: () => <ModalDrawerAlertLiveMiniDemo />,
  },
  {
    id: 'enterprise-settings-template',
    tag: '<EnterpriseSettingsPage /> & <PageTemplatesShowcaseView />',
    titleTr: '8 Hazır Kurumsal Sayfa Şablonu & Kalıcı Çalışma Alanı Ayarları (page-settings)',
    titleEn: '8 Ready-Made Enterprise Page Templates & Persistent Workspace Settings (page-settings)',
    categoryLabelTr: 'Hazır Sayfa Şablonu',
    categoryLabelEn: 'Enterprise Page Template',
    playgroundId: 'page-templates',
    importStatement:
      "import { EnterpriseSettingsPage, PageTemplatesShowcaseView, type PageTemplateId } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Appearance, Account ve Notifications sekmelerini ThemeEngineService ve StorageService (uxigl.workspace.settings.v1) ile çift yönlü senkronize eder.',
    architectureNoteEn:
      'Synchronizes Appearance, Account, and Notifications tabs with ThemeEngineService and StorageService (uxigl.workspace.settings.v1).',
    summaryTr:
      'Kurumsal çalışma alanı yapılandırması için 3 sekmeli (Appearance, Account, Notifications) <EnterpriseSettingsPage /> ve 8 tam sayfa şablonunu (page-login..page-settings) barındıran <PageTemplatesShowcaseView />.',
    summaryEn:
      '3-tab <EnterpriseSettingsPage /> (Appearance, Account, Notifications) and 8-template <PageTemplatesShowcaseView /> suite.',
    code: `import { EnterpriseSettingsPage, PageTemplatesShowcaseView } from 'truncgil-uxigl';

// Doğrudan Kurumsal Ayarlar Sayfası (Appearance | Account | Notifications)
<EnterpriseSettingsPage initialTab="appearance" />

// Veya 8 Hazır Sayfa Şablonu Vitrini Üzerinden:
<PageTemplatesShowcaseView
  activePageId="page-settings"
  onPageChange={setActivePage}
/>`,
    propsTable: [
      {
        name: 'initialTab (EnterpriseSettingsPage)',
        type: "'appearance' | 'account' | 'notifications'",
        defaultValue: "'appearance'",
        description: 'Başlangıçta aktif olan ayar sekmesi.',
      },
      {
        name: 'activePageId (PageTemplatesShowcaseView)',
        type: "'page-login' | 'page-register' | 'page-pricing' | 'page-profile' | 'page-invoice' | 'page-kanban' | 'page-status' | 'page-settings'",
        defaultValue: "'page-login'",
        required: true,
        description: '8 hazır kurumsal sayfa şablonundan hangisinin render edileceğini belirler.',
      },
    ],
    renderLiveDemo: () => <CardSurfaceLiveMiniDemo />,
  },
];

export const DATA_FEEDBACK_WEBGL_GUIDES: DocComponentGuideItem[] = [
  {
    id: 'badges-chips-avatars',
    tag: '<Badge />, <Chip />, <Avatar />, <Progress />, <Skeleton /> & <Tooltip />',
    titleTr: 'Durum Rozetleri, Filtre Çipleri, Squircle Avatarlar & İlerleme',
    titleEn: 'Status Badges, Filter Chips, Squircle Avatars & Progress Indicators',
    categoryLabelTr: 'Geri Bildirim & Durum',
    categoryLabelEn: 'Feedback & Status',
    playgroundId: 'chips-badges',
    importStatement:
      "import { Badge, Chip, Avatar, AvatarGroup, Progress, Skeleton, Tooltip } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Avatar bileşeni squircle (süper-elips) maskesi ve çevrimiçi durum rozeti içerir; Progress ve Skeleton animasyon hızı (speed) özelleştirilebilir.',
    architectureNoteEn:
      'Avatar supports squircle geometry and presence dots; Progress and Skeleton support configurable animation speed.',
    summaryTr:
      'Canlı sinyalli <Badge />, seçilebilir <Chip />, grup yığınlı <AvatarGroup />, dairesel/doğrusal <Progress />, shimmer <Skeleton /> ve kısayol rozetli <Tooltip />.',
    summaryEn:
      'Pulsing <Badge />, filter <Chip />, stacked <AvatarGroup />, linear/circular <Progress />, shimmer <Skeleton />, and <Tooltip />.',
    code: `<Badge tone="success" variant="glass" pulse>%99.99 SLA</Badge>
<Chip selected={isSelected} onClick={toggle} tone="primary">Liquid Glass</Chip>
<Tooltip content="Baş Sistem Mimarı" shortcut="⌘1">
  <Avatar name="Ümit Uz" status="online" shape="squircle" />
</Tooltip>
<Progress variant="circular" value={84} tone="success" />`,
    propsTable: [
      {
        name: 'tone / variant / pulse (Badge)',
        type: "SemanticTone / 'filled' | 'tonal' | 'glass' | 'outlined' / boolean",
        defaultValue: "'primary' / 'tonal' / false",
        description: 'Rozet rengi, yüzey stili ve yanıp sönen canlı durum noktası.',
      },
      {
        name: 'shape / status (Avatar)',
        type: "'squircle' | 'circle' / 'online' | 'busy' | 'away' | 'offline'",
        defaultValue: "'squircle' / undefined",
        description: 'Squircle veya tam daire kesim ve sağ alt durum sinyali.',
      },
      {
        name: 'variant / value / indeterminate / speed (Progress)',
        type: "'linear' | 'circular' / number (0-100) / boolean / number",
        defaultValue: "'linear' / 0 / false / 1.4",
        description: 'Dairesel veya çubuk ilerleme, belirsiz dönen mod ve animasyon hızı (saniye).',
      },
    ],
    renderLiveDemo: () => <BadgesChipsAvatarsLiveMiniDemo />,
  },
  {
    id: 'statcard-datatable',
    tag: '<StatCard />, <DataTable /> & <Pagination />',
    titleTr: 'Sparkline KPI Kartı & Sıfır-WebGL Hafif Native HTML Tablo',
    titleEn: 'Sparkline KPI Card & Zero-WebGL Lightweight Native HTML DataTable',
    categoryLabelTr: 'Veri & Tablo',
    categoryLabelEn: 'Data & Table',
    playgroundId: 'datatable-statcard',
    importStatement: "import { StatCard, DataTable, Pagination } from 'truncgil-uxigl';",
    architectureNoteTr:
      '5–100 satırlık listelerde GPU kanvası başlatmadan semantik <table>, <thead>, <tbody> ile sıfır bellek yükü sağlar.',
    architectureNoteEn:
      'Renders semantic HTML <table> for 5–100 row lists with zero GPU overhead, sorting, search, and selection.',
    summaryTr:
      'SVG mini grafikli <StatCard /> ve 4 görsel varyantlı (default, striped, bordered, minimal), sütun sıralamalı, aramalı ve satır seçimli <DataTable /> + <Pagination />.',
    summaryEn:
      '<StatCard /> with SVG sparklines and <DataTable /> with 4 visual variants, sorting, search filter, and <Pagination />.',
    code: `<StatCard
  label="Toplam Gelir"
  value="$124,580"
  delta="+14.2%"
  trend="up"
  sparklineData={[28, 42, 39, 58, 74, 92]}
/>
<DataTable
  rowKey="id"
  variant="striped"
  selectable
  data={rows}
  columns={[
    { key: 'service', header: 'Servis', sortable: true },
    { key: 'status', header: 'Durum', align: 'right' },
  ]}
/>`,
    propsTable: [
      {
        name: 'variant / size (DataTable)',
        type: "'default' | 'striped' | 'bordered' | 'minimal' / 'sm' | 'md' | 'lg'",
        defaultValue: "'default' / 'md'",
        description: 'Tablo çizgi/zebra stili ve hücre yoğunluğu.',
      },
      {
        name: 'selectable / searchable / columns / data',
        type: 'boolean / boolean / DataTableColumn<T>[] / T[]',
        defaultValue: 'false / true / [] / []',
        description: 'Checkbox satır seçimi, üst arama çubuğu, sütun şeması ve veri dizisi.',
      },
      {
        name: 'sparklineData / trend (StatCard)',
        type: "number[] / 'up' | 'down' | 'neutral'",
        defaultValue: 'undefined',
        description: 'KPI kartının altındaki yumuşak SVG eğrisini çizen sayı dizisi.',
      },
    ],
    renderLiveDemo: () => <StatCardNativeTableLiveMiniDemo />,
  },
  {
    id: 'sheetgl-adapter',
    tag: '<SheetGLGridAdapter />',
    titleTr: 'SheetGL 120 FPS WebGL/Canvas Kurumsal DataGrid Motoru',
    titleEn: 'SheetGL 120 FPS WebGL/Canvas Enterprise DataGrid Engine',
    categoryLabelTr: 'WebGL Veri Motoru',
    categoryLabelEn: 'WebGL Data Engine',
    playgroundId: 'datatable-statcard',
    importStatement: "import { SheetGLGridAdapter } from 'truncgil-uxigl';",
    architectureNoteTr:
      'buildInheritedSheetGLTheme() aracılığıyla aktif uxiGL tohum rengini ve Dark/Light modunu WebGL kanvas hücrelerine anında aktarır.',
    architectureNoteEn:
      'Automatically synchronizes active uxiGL seed palette and Dark/Light mode tokens into the SheetGL canvas.',
    summaryTr:
      'Binlerce satırlık finansal ERP, bulut telemetrisi, İK bordro ve stok matrislerini 120 FPS hızında işleyen, Excel fx formül çubuğu, sabit sütunlar ve CSV dışa aktarma sunan WebGL tablo adaptörü.',
    summaryEn:
      '120 FPS WebGL spreadsheet & DataGrid adapter with 4 enterprise presets, formula bar, pinned columns, and CSV export.',
    code: `<SheetGLGridAdapter
  datasetPreset="finance-erp" // 'finance-erp' | 'cloud-telemetry' | 'hr-payroll' | 'inventory-supply'
  showPresetSwitcher={true}
  initialRowCount={150}
  height={440}
/>`,
    propsTable: [
      {
        name: 'datasetPreset',
        type: "'finance-erp' | 'cloud-telemetry' | 'hr-payroll' | 'inventory-supply'",
        defaultValue: "'finance-erp'",
        description: 'Hazır kurumsal veri ve sütun şeması senaryosu.',
      },
      {
        name: 'initialRowCount / height / showPresetSwitcher',
        type: 'number / number / boolean',
        defaultValue: '150 / 460 / true',
        description: 'Başlangıç satır sayısı, kanvas yüksekliği (px) ve üst senaryo seçici çubuğu.',
      },
    ],
    renderLiveDemo: () => <SheetGLGridAdapter initialRowCount={80} height={380} />,
  },
  {
    id: 'filemangl-adapter',
    tag: '<FileManGLExplorerAdapter />',
    titleTr: 'FileManGL WebGL2 Sanal Dosya Sistemi (VFS) & 3D Disk Haritası',
    titleEn: 'FileManGL WebGL2 Virtual File System & 3D Disk Map Explorer',
    categoryLabelTr: 'WebGL2 Dosya Motoru',
    categoryLabelEn: 'WebGL2 File Engine',
    playgroundId: 'filemangl-explorer',
    importStatement: "import { FileManGLExplorerAdapter } from 'truncgil-uxigl';",
    architectureNoteTr:
      'Tek-Aktif-Motor (Single-Active-Engine) ilkesiyle yalnızca görünür olduğunda WebGL2 bağlamı açar; uxiGL temasıyla tam senkronizedir.',
    architectureNoteEn:
      'Follows Single-Active-Engine lifecycle and syncs dark/light theme tokens with FileManGL.',
    summaryTr:
      'Windows 11 sekmeli gezgin deneyimi, Çift Panel (Dual-Pane) dosya transferi, WebGL2 3D Uzamsal & Sunburst Disk Haritası görünümleri ve 5 katmanlı NTFS ACL + POSIX (0755) izin motoru sunar.',
    summaryEn:
      'WebGL2 VFS explorer featuring Dual-Pane mode, 3D Spatial & Sunburst Disk Map views, and NTFS ACL + POSIX (0755) permissions.',
    code: `<FileManGLExplorerAdapter height={500} />`,
    propsTable: [
      {
        name: 'height',
        type: 'number',
        defaultValue: '520',
        description: 'Dosya yöneticisi çalışma alanının piksel yüksekliği.',
      },
    ],
    renderLiveDemo: () => <FileManGLExplorerAdapter height={440} />,
  },
];
