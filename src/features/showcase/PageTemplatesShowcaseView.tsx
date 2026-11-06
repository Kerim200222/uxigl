import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Fingerprint,
  Building2,
  UserCheck,
  CreditCard,
  Download,
  Printer,
  Share2,
  Plus,
  Search,
  AlertTriangle,
  RefreshCw,
  Home,
  CheckCircle2,
  MapPin,
  Globe,
  Terminal,
  Copy,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Star,
} from 'lucide-react';
import {
  Button,
  Input,
  Switch,
  Checkbox,
  Badge,
  Chip,
  Avatar,
  Progress,
  Slider,
  Textarea,
  GoogleIcon,
} from '../../components/primitives';
import {
  Card,
  SegmentedControl,
  Accordion,
} from '../../components/composites';
import { UXILogo } from '../../components/brand/UXILogo';
import { useToast } from '../../providers/ToastProvider';

export type PageTemplateId =
  | 'page-login'
  | 'page-register'
  | 'page-pricing'
  | 'page-profile'
  | 'page-invoice'
  | 'page-kanban'
  | 'page-status';

export interface PageTemplatesShowcaseViewProps {
  activePageId: PageTemplateId;
  onPageChange: (pageId: PageTemplateId) => void;
  onNavigateHome?: () => void;
}

interface KanbanTask {
  id: string;
  title: string;
  tag: string;
  tagTone: 'primary' | 'info' | 'warning' | 'success' | 'danger';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  progress: number;
  column: 'backlog' | 'progress' | 'review' | 'done';
  dueDate: string;
}

const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: 'UXI-101',
    title: 'Apple HIG 8pt Grid & Liquid Glass Sidebar Standardizasyonu',
    tag: 'Design System',
    tagTone: 'primary',
    priority: 'High',
    assignee: 'Ümit Uz',
    progress: 100,
    column: 'done',
    dueDate: 'Bugün',
  },
  {
    id: 'UXI-104',
    title: 'Passkey (WebAuthn) ve Biyometrik Giriş Akışı Entegrasyonu',
    tag: 'Security',
    tagTone: 'danger',
    priority: 'High',
    assignee: 'Selin Kaya',
    progress: 75,
    column: 'review',
    dueDate: 'Yarın',
  },
  {
    id: 'UXI-108',
    title: 'SheetGL 1M Satır Sanallaştırma & Zebra Satır Performans Testi',
    tag: 'WebGL Engine',
    tagTone: 'info',
    priority: 'High',
    assignee: 'Mert Demir',
    progress: 60,
    column: 'progress',
    dueDate: '12 Kas',
  },
  {
    id: 'UXI-112',
    title: 'Kurumsal e-Fatura PDF Şablonu ve QR Doğrulama Modülü',
    tag: 'Billing',
    tagTone: 'success',
    priority: 'Medium',
    assignee: 'Zeynep Ak',
    progress: 40,
    column: 'progress',
    dueDate: '15 Kas',
  },
  {
    id: 'UXI-115',
    title: 'Çoklu Dil (i18n) Otomatik Sözlük Senkronizasyonu',
    tag: 'Core',
    tagTone: 'warning',
    priority: 'Medium',
    assignee: 'Caner Yılmaz',
    progress: 10,
    column: 'backlog',
    dueDate: '19 Kas',
  },
  {
    id: 'UXI-119',
    title: 'visionOS Spatial Ornaments için Derinlik Gölgeleri',
    tag: 'Design System',
    tagTone: 'primary',
    priority: 'Low',
    assignee: 'Ümit Uz',
    progress: 0,
    column: 'backlog',
    dueDate: '24 Kas',
  },
];

const PAGE_TEMPLATE_META: Record<
  PageTemplateId,
  {
    label: string;
    shortLabel: string;
    icon: string;
    subtitle: string;
    badge: string;
  }
> = {
  'page-login': {
    label: 'Login & Kimlik Doğrulama',
    shortLabel: 'Login',
    icon: 'lock',
    subtitle: 'Split-Screen Enterprise SSO, Apple Passkey ve Yüzen Liquid Glass Giriş Ekranları',
    badge: 'Auth UI',
  },
  'page-register': {
    label: 'Kayıt, Onboarding & 2FA',
    shortLabel: 'Register & 2FA',
    icon: 'verified_user',
    subtitle: 'Çok adımlı kurumsal hesap oluşturma, canlı şifre güvenliği ve 6 haneli OTP doğrulama',
    badge: '3-Step',
  },
  'page-pricing': {
    label: 'SaaS Fiyatlandırma & Paketler',
    shortLabel: 'Pricing',
    icon: 'sell',
    subtitle: 'Aylık/Yıllık geçişli, koltuk hesaplayıcılı ve karşılaştırma tablolu SaaS paket sayfası',
    badge: 'Commerce',
  },
  'page-profile': {
    label: 'Kullanıcı Profili & Portfolyo',
    shortLabel: 'Profile',
    icon: 'person',
    subtitle: 'Kapak görseli, aktivite akışı, bağlı OAuth hesapları ve aktif cihaz oturumları',
    badge: 'Account',
  },
  'page-invoice': {
    label: 'B2B e-Fatura & Ödeme (Checkout)',
    shortLabel: 'Invoice',
    icon: 'receipt_long',
    subtitle: 'Baskıya uygun kurumsal e-Fatura görünümü, KDV dökümü ve hızlı kart ödeme paneli',
    badge: 'FinTech',
  },
  'page-kanban': {
    label: 'Kanban Proje & Sprint Panosu',
    shortLabel: 'Kanban',
    icon: 'view_kanban',
    subtitle: 'Sütunlar arası taşınabilir görev kartları, öncelik etiketleri ve hızlı görev oluşturucu',
    badge: 'Agile',
  },
  'page-status': {
    label: '404 / 500 & Sistem Durumu',
    shortLabel: 'Status & 404',
    icon: 'monitoring',
    subtitle: '404 Bulunamadı, 500 Bakım ekranı ve gerçek zamanlı 90 günlük SLA Uptime monitörü',
    badge: 'System',
  },
};

export const PageTemplatesShowcaseView: React.FC<PageTemplatesShowcaseViewProps> = ({
  activePageId,
  onPageChange,
  onNavigateHome,
}) => {
  const { notify } = useToast();
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // --- 1. LOGIN STATE ---
  const [loginStyle, setLoginStyle] = useState<'split' | 'centered'>('split');
  const [loginEmail, setLoginEmail] = useState('umit.uz@truncgil.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- 2. REGISTER & 2FA STATE ---
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regName, setRegName] = useState('Ümit Uz');
  const [regEmail, setRegEmail] = useState('umit@truncgil.com');
  const [regPass, setRegPass] = useState('Truncgil!2026');
  const [regRole, setRegRole] = useState<'architect' | 'designer' | 'devops' | 'product'>('architect');
  const [regWorkspace, setRegWorkspace] = useState('truncgil-cloud');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '9', '1', '6']);

  // --- 3. PRICING STATE ---
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [teamSeats, setTeamSeats] = useState(12);

  // --- 4. PROFILE STATE ---
  const [profileBio, setProfileBio] = useState(
    'Apple HIG ve Google Material You tasarım sistemleri, WebGL2 veri sanallaştırma motorları (SheetGL, FileManGL) ve yüksek performanslı bulut mimarileri üzerine çalışıyorum.'
  );
  const [profilePublic, setProfilePublic] = useState(true);
  const [twoFactorActive, setTwoFactorActive] = useState(true);

  // --- 5. INVOICE STATE ---
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'applepay'>('card');
  const [cardHolder, setCardHolder] = useState('ÜMİT UZ');
  const [cardNumber, setCardNumber] = useState('4543 8910 2234 8892');
  const [cardCvv, setCardCvv] = useState('842');
  const [invoicePaid, setInvoicePaid] = useState(false);

  // --- 6. KANBAN STATE ---
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(INITIAL_KANBAN_TASKS);
  const [kanbanFilter, setKanbanFilter] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // --- 7. STATUS / ERROR STATE ---
  const [statusTab, setStatusTab] = useState<'404' | '500' | 'uptime'>('404');

  const currentMeta = PAGE_TEMPLATE_META[activePageId] || PAGE_TEMPLATE_META['page-login'];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      notify({
        title: 'Oturum Açıldı',
        description: `${loginEmail} hesabıyla güvenli çalışma alanına giriş yapıldı.`,
        tone: 'success',
      });
    }, 600);
  };

  const moveKanbanTask = (taskId: string, direction: 'prev' | 'next') => {
    const order: KanbanTask['column'][] = ['backlog', 'progress', 'review', 'done'];
    setKanbanTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = order.indexOf(t.column);
        const nextIdx = direction === 'next' ? Math.min(3, idx + 1) : Math.max(0, idx - 1);
        const nextCol = order[nextIdx];
        return {
          ...t,
          column: nextCol,
          progress: nextCol === 'done' ? 100 : nextCol === 'review' ? 80 : nextCol === 'progress' ? 50 : 10,
        };
      })
    );
  };

  const handleAddKanbanTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: KanbanTask = {
      id: `UXI-${Math.floor(120 + Math.random() * 80)}`,
      title: newTaskTitle.trim(),
      tag: 'Feature',
      tagTone: 'primary',
      priority: 'Medium',
      assignee: 'Ümit Uz',
      progress: 0,
      column: 'backlog',
      dueDate: '28 Kas',
    };
    setKanbanTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    notify({
      title: 'Yeni Görev Eklendi',
      description: `${newTask.id}: ${newTask.title}`,
      tone: 'primary',
    });
  };

  const getTemplateSnippet = (id: PageTemplateId): string => {
    switch (id) {
      case 'page-login':
        return `import { useState } from 'react';
import { Card, Button, Input, Checkbox, UXILogo } from 'truncgil-uxigl';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  return (
    <div className="uxu-auth-page">
      <Card variant="glass" padding="lg" style={{ maxWidth: 440, width: '100%' }}>
        <UXILogo size={36} preserveRatio glow />
        <h2>uxiGL Cloud'a Hoş Geldiniz</h2>
        <Input label="Kurumsal E-Posta" value={email} onChange={setEmail} />
        <Input label="Parola" type="password" value={password} onChange={setPassword} />
        <Checkbox label="Oturumu 30 gün açık tut" value={remember} onChange={setRemember} />
        <Button variant="filled" fullWidth>Giriş Yap</Button>
      </Card>
    </div>
  );
}`;
      case 'page-register':
        return `import { useState } from 'react';
import { Card, Button, Input, Progress } from 'truncgil-uxigl';

export function OnboardingPage() {
  const [name, setName] = useState('Ümit Uz');
  const [workspace, setWorkspace] = useState('truncgil-cloud');

  return (
    <Card variant="glass" padding="lg" title="Yeni Çalışma Alanı Oluştur">
      <Progress value={66} tone="primary" showValueLabel />
      <Input label="Tam Adınız" value={name} onChange={setName} />
      <Input label="Çalışma Alanı URL" value={workspace} onChange={setWorkspace} />
      <Button variant="filled" fullWidth>Devam Et</Button>
    </Card>
  );
}`;
      case 'page-pricing':
        return `import { Card, Button, Badge, SegmentedControl, Slider } from 'truncgil-uxigl';

export function PricingPage() {
  return (
    <div className="uxu-pricing-grid">
      <Card variant="glass" title="Pro Studio" eyebrow="EN POPÜLER">
        <div className="price">$24 <span>/ ay</span></div>
        <Button variant="filled" fullWidth>14 Gün Ücretsiz Dene</Button>
      </Card>
    </div>
  );
}`;
      default:
        return `import { Card, Button, Badge, Avatar } from 'truncgil-uxigl';

export function EnterprisePageTemplate() {
  return (
    <Card variant="glass" padding="lg" title="${currentMeta.label}">
      {/* Apple HIG 8pt Grid & Liquid Glass Ready-Made Page */}
    </Card>
  );
}`;
    }
  };

  const wrapperStyle: React.CSSProperties = isFullscreenPreview
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--uxu-bg-canvas)',
        overflowY: 'auto',
        padding: '24px',
      }
    : {};

  return (
    <div className="uxu-stack-lg" style={wrapperStyle}>
      {/* Top Template Switcher Bar */}
      <Card variant="glass" padding="md">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-primary-container)',
                color: 'var(--uxu-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GoogleIcon name={currentMeta.icon} size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                  {currentMeta.label}
                </h2>
                <Badge tone="primary" size="xs">
                  {currentMeta.badge}
                </Badge>
              </div>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--uxu-text-secondary)',
                  margin: '2px 0 0 0',
                }}
              >
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Button
              variant="tonal"
              size="sm"
              leadingIcon={<Terminal size={14} />}
              onClick={() => setShowCodeModal((p) => !p)}
            >
              {showCodeModal ? 'Kodu Gizle' : 'JSX Kodunu Gör'}
            </Button>
            <Button
              variant={isFullscreenPreview ? 'filled' : 'glass'}
              size="sm"
              leadingIcon={
                isFullscreenPreview ? <Minimize2 size={14} /> : <Maximize2 size={14} />
              }
              onClick={() => setIsFullscreenPreview((p) => !p)}
            >
              {isFullscreenPreview ? 'Normal Görünüme Dön' : 'Tam Ekran Önizle'}
            </Button>
          </div>
        </div>

        {/* Horizontal Page Template Pill Selector */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            marginTop: 14,
            paddingTop: 12,
            borderTop: '1px solid var(--uxu-border-subtle)',
          }}
        >
          {(Object.keys(PAGE_TEMPLATE_META) as PageTemplateId[]).map((id) => {
            const meta = PAGE_TEMPLATE_META[id];
            const active = activePageId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onPageChange(id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 12px',
                  borderRadius: 'var(--uxu-radius-sm, 8px)',
                  border: active
                    ? '1px solid var(--uxu-primary)'
                    : '1px solid var(--uxu-border-subtle)',
                  background: active
                    ? 'var(--uxu-primary-container)'
                    : 'var(--uxu-surface-tonal)',
                  color: active
                    ? 'var(--uxu-primary)'
                    : 'var(--uxu-text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 140ms ease',
                }}
              >
                <GoogleIcon name={meta.icon} size={16} filled={active} />
                <span>{meta.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Optional Collapsible JSX Code Drawer */}
        {showCodeModal && (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 'var(--uxu-radius-md)',
              background: 'var(--uxu-code-bg)',
              border: '1px solid var(--uxu-code-border)',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--uxu-primary)',
                  fontFamily: 'var(--uxu-font-mono)',
                }}
              >
                {activePageId}.tsx — Hazır Sayfa Şablonu
              </span>
              <Button
                variant="tonal"
                size="sm"
                leadingIcon={<Copy size={13} />}
                onClick={() => {
                  navigator.clipboard.writeText(getTemplateSnippet(activePageId));
                  notify({
                    title: 'Şablon Kodu Kopyalandı',
                    description: 'Sayfa bileşen kodu panoya kopyalandı.',
                    tone: 'info',
                  });
                }}
              >
                Kopyala
              </Button>
            </div>
            <pre
              style={{
                margin: 0,
                fontSize: '0.76rem',
                fontFamily: 'var(--uxu-font-mono)',
                color: 'var(--uxu-code-text)',
                overflowX: 'auto',
              }}
            >
              {getTemplateSnippet(activePageId)}
            </pre>
          </div>
        )}
      </Card>

      {/* =========================================================================
       * 1. LOGIN & AUTHENTICATION PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-login' && (
        <div className="uxu-stack-md">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SegmentedControl<'split' | 'centered'>
              size="sm"
              value={loginStyle}
              onChange={setLoginStyle}
              options={[
                { value: 'split', label: 'Split-Screen Kurumsal (2 Kolon)' },
                { value: 'centered', label: 'Apple iCloud Yüzen Cam (Merkezi)' },
              ]}
            />
          </div>

          {loginStyle === 'split' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                borderRadius: 'var(--uxu-radius-xl, 24px)',
                overflow: 'hidden',
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-surface-glass)',
                boxShadow: 'var(--uxu-shadow-elevated)',
                minHeight: 580,
              }}
            >
              {/* Left Brand & Visual Showcase Panel */}
              <div
                style={{
                  padding: '40px 36px',
                  background:
                    'linear-gradient(145deg, color-mix(in srgb, var(--uxu-primary) 22%, var(--uxu-bg-elevated)), var(--uxu-bg-canvas))',
                  borderRight: '1px solid var(--uxu-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <UXILogo size={36} preserveRatio glow />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                      uxiGL Enterprise
                    </div>
                    <div style={{ fontSize: '0.73rem', color: 'var(--uxu-text-secondary)' }}>
                      Apple HIG × Google Material You
                    </div>
                  </div>
                </div>

                <div style={{ margin: '16px 0' }}>
                  <Badge tone="primary" size="sm">
                    ZERO-TRUST CLOUD AUTH v2.8
                  </Badge>
                  <h1
                    style={{
                      fontSize: '1.85rem',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      marginTop: 12,
                      marginBottom: 12,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Yeni Nesil Arayüz ve Veri Motoruna Giriş Yapın
                  </h1>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--uxu-text-secondary)',
                      lineHeight: 1.6,
                    }}
                  >
                    Tek oturumla SheetGL 120 FPS veri tablolarına, FileManGL 3D dosya
                    uzayına ve canlı tema stüdyosuna tam erişim sağlayın.
                  </p>

                  {/* Mini Floating Glass KPI Cards */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                      marginTop: 24,
                    }}
                  >
                    <div
                      style={{
                        padding: 14,
                        borderRadius: 'var(--uxu-radius-md)',
                        background: 'var(--uxu-surface-glass)',
                        border: '1px solid var(--uxu-border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: 'var(--uxu-success)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <ShieldCheck size={15} />
                        <span>Donanım Anahtarı</span>
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 4 }}>
                        WebAuthn / FIDO2
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                        Uçtan uca biyometrik koruma
                      </div>
                    </div>

                    <div
                      style={{
                        padding: 14,
                        borderRadius: 'var(--uxu-radius-md)',
                        background: 'var(--uxu-surface-glass)',
                        border: '1px solid var(--uxu-border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: 'var(--uxu-primary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        <Sparkles size={15} />
                        <span>SLA Kararlılığı</span>
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 4 }}>
                        99.99% Uptime
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                        4 küresel edge bölgesi aktif
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Footer */}
                <div
                  style={{
                    padding: 14,
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-surface-tonal)',
                    border: '1px solid var(--uxu-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Avatar name="Ümit Uz" size="sm" status="online" shape="squircle" />
                  <div style={{ fontSize: '0.76rem', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600, color: 'var(--uxu-text-primary)' }}>
                      "Apple akıcılığı ve Google renk uyumu tek bir kurumsal çatı altında."
                    </div>
                    <div style={{ color: 'var(--uxu-text-secondary)', marginTop: 2 }}>
                      Trunçgil Teknoloji • Sistem Mimarisi Ekibi
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Login Form Panel */}
              <div
                style={{
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  maxWidth: 460,
                  width: '100%',
                  margin: '0 auto',
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                    Tekrar Hoş Geldiniz
                  </h2>
                  <p
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--uxu-text-secondary)',
                      marginTop: 6,
                    }}
                  >
                    Kurumsal kimliğiniz veya Passkey anahtarınız ile oturum açın.
                  </p>
                </div>

                {/* SSO Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                  <Button
                    variant="tonal"
                    size="sm"
                    leadingIcon={<Fingerprint size={15} />}
                    onClick={() =>
                      notify({
                        title: 'Apple Passkey Doğrulaması',
                        description: 'Touch ID / Face ID biyometrik anahtarınız doğrulandı.',
                        tone: 'info',
                      })
                    }
                  >
                    Passkey ile Giriş
                  </Button>
                  <Button
                    variant="tonal"
                    size="sm"
                    leadingIcon={<Globe size={15} />}
                    onClick={() =>
                      notify({
                        title: 'Google Workspace SSO',
                        description: 'Kurumsal Google OAuth 2.0 yönlendirmesi başlatıldı.',
                        tone: 'primary',
                      })
                    }
                  >
                    Google SSO
                  </Button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 20,
                    color: 'var(--uxu-text-muted)',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: 'var(--uxu-border-subtle)' }} />
                  <span>veya e-posta ile</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--uxu-border-subtle)' }} />
                </div>

                <form onSubmit={handleLoginSubmit} className="uxu-stack-md">
                  <Input
                    label="Kurumsal E-Posta"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    leadingIcon={<Mail size={15} />}
                    placeholder="ad.soyad@truncgil.com"
                    required
                  />

                  <div>
                    <Input
                      label="Parola"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={setLoginPassword}
                      leadingIcon={<Lock size={15} />}
                      trailingIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--uxu-text-secondary)',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                          }}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      }
                      required
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                    }}
                  >
                    <Checkbox
                      label="Oturumu 30 gün açık tut"
                      value={rememberMe}
                      onChange={setRememberMe}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        notify({
                          title: 'Parola Sıfırlama Bağlantısı',
                          description: `${loginEmail} adresine sıfırlama bağlantısı gönderildi.`,
                          tone: 'info',
                        })
                      }
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--uxu-primary)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                      }}
                    >
                      Şifremi Unuttum?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="filled"
                    fullWidth
                    trailingIcon={<ArrowRight size={15} />}
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Doğrulanıyor...' : 'Güvenli Oturum Aç'}
                  </Button>
                </form>

                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 16,
                    borderTop: '1px solid var(--uxu-border-subtle)',
                    textAlign: 'center',
                    fontSize: '0.78rem',
                    color: 'var(--uxu-text-secondary)',
                  }}
                >
                  Henüz kurumsal hesabınız yok mu?{' '}
                  <button
                    type="button"
                    onClick={() => onPageChange('page-register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--uxu-primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Ücretsiz Çalışma Alanı Oluşturun →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Centered Apple iCloud / Lock Screen Style Floating Liquid Glass Login */
            <div
              style={{
                minHeight: 540,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 16px',
                borderRadius: 'var(--uxu-radius-xl, 24px)',
                background:
                  'radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--uxu-primary) 26%, transparent), var(--uxu-bg-canvas) 75%)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <Card
                variant="glass"
                padding="lg"
                style={{
                  maxWidth: 400,
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: 'var(--uxu-shadow-elevated)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <UXILogo size={42} preserveRatio glow />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '6px 0 0 0' }}>
                    uxiGL ID ile Giriş
                  </h2>
                  <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                    Apple HIG Liquid Glass Kimlik Doğrulama
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="uxu-stack-md" style={{ textAlign: 'left' }}>
                  <Input
                    label="uxiGL ID veya E-Posta"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    leadingIcon={<Mail size={15} />}
                  />
                  <Input
                    label="Parola"
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={setLoginPassword}
                    leadingIcon={<KeyRound size={15} />}
                  />
                  <Button type="submit" variant="filled" fullWidth trailingIcon={<ArrowRight size={15} />}>
                    Devam Et
                  </Button>
                  <Button
                    type="button"
                    variant="tonal"
                    fullWidth
                    leadingIcon={<Fingerprint size={16} />}
                    onClick={() =>
                      notify({
                        title: 'Touch ID / Passkey Aktif',
                        description: 'Biyometrik doğrulama başarıyla tamamlandı.',
                        tone: 'success',
                      })
                    }
                  >
                    Touch ID / Passkey Kullan
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
       * 2. REGISTER, ONBOARDING & 2FA OTP PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-register' && (
        <div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <Card variant="glass" padding="lg">
            {/* Step Indicator Header */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Badge tone="primary" size="sm">
                  ADIM {regStep} / 3
                </Badge>
                <span style={{ fontSize: '0.76rem', color: 'var(--uxu-text-secondary)' }}>
                  {regStep === 1 && 'Hesap Bilgileri & Güvenlik'}
                  {regStep === 2 && 'Rol & Çalışma Alanı Yapılandırması'}
                  {regStep === 3 && 'İki Faktörlü (2FA) Kod Doğrulaması'}
                </span>
              </div>
              <Progress value={regStep === 1 ? 33 : regStep === 2 ? 66 : 100} tone="primary" />
            </div>

            {regStep === 1 && (
              <div className="uxu-stack-md">
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                    Kurumsal Geliştirici Hesabı Oluşturun
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                    14 gün boyunca tüm kurumsal WebGL bileşenlerini ücretsiz deneyimleyin.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <Input
                    label="Ad Soyad"
                    value={regName}
                    onChange={setRegName}
                    leadingIcon={<UserCheck size={15} />}
                  />
                  <Input
                    label="İş E-Postası"
                    value={regEmail}
                    onChange={setRegEmail}
                    leadingIcon={<Mail size={15} />}
                  />
                </div>

                <Input
                  label="Güçlü Parola Oluşturun"
                  type="text"
                  value={regPass}
                  onChange={setRegPass}
                  leadingIcon={<Lock size={15} />}
                  helperText="En az 8 karakter, bir büyük harf ve bir özel sembol içermelidir."
                />

                {/* Password Strength Meter */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-surface-tonal)',
                    border: '1px solid var(--uxu-border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>Parola Güvenlik Seviyesi</span>
                    <span style={{ color: 'var(--uxu-success)', fontWeight: 700 }}>
                      Kurumsal Düzey (Güçlü)
                    </span>
                  </div>
                  <Progress value={regPass.length >= 10 ? 100 : 60} tone="success" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                  <Button variant="tonal" onClick={() => onPageChange('page-login')}>
                    Zaten Hesabım Var
                  </Button>
                  <Button
                    variant="filled"
                    trailingIcon={<ChevronRight size={15} />}
                    onClick={() => setRegStep(2)}
                  >
                    Çalışma Alanı Ayarlarına Geç
                  </Button>
                </div>
              </div>
            )}

            {regStep === 2 && (
              <div className="uxu-stack-md">
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                    Ekip Rolünüzü ve Çalışma Alanınızı Seçin
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                    Panonuz seçtiğiniz role göre hazır bileşenlerle özelleştirilecektir.
                  </p>
                </div>

                <Input
                  label="Çalışma Alanı Adı (Workspace Slug)"
                  value={regWorkspace}
                  onChange={setRegWorkspace}
                  leadingIcon={<Building2 size={15} />}
                  helperText={`Özel erişim adresiniz: https://${regWorkspace || 'ekip'}.uxigl.truncgil.com`}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    {
                      id: 'architect',
                      title: 'System / Frontend Architect',
                      desc: 'Tasarım tokenları, SOLID mimari ve WebGL veri tabloları',
                      icon: 'architecture',
                    },
                    {
                      id: 'designer',
                      title: 'UI / UX Product Designer',
                      desc: 'Apple HIG & Material 3 tema stüdyosu ve cam efektleri',
                      icon: 'palette',
                    },
                    {
                      id: 'devops',
                      title: 'Cloud & DevOps Lead',
                      desc: 'Küme telemetrisi, SLA raporları ve VFS dosya yöneticisi',
                      icon: 'dns',
                    },
                    {
                      id: 'product',
                      title: 'Product Manager',
                      desc: 'Analitik hunisi, CRM siparişleri ve Kanban sprint panosu',
                      icon: 'insights',
                    },
                  ].map((r) => {
                    const active = regRole === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setRegRole(r.id as typeof regRole)}
                        style={{
                          padding: 14,
                          borderRadius: 'var(--uxu-radius-md)',
                          border: active
                            ? '1.5px solid var(--uxu-primary)'
                            : '1px solid var(--uxu-border-subtle)',
                          background: active
                            ? 'var(--uxu-primary-container)'
                            : 'var(--uxu-surface-tonal)',
                          cursor: 'pointer',
                          transition: 'all 140ms ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <GoogleIcon name={r.icon} size={20} filled={active} />
                          <strong style={{ fontSize: '0.84rem' }}>{r.title}</strong>
                        </div>
                        <p style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                          {r.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                  <Button variant="tonal" leadingIcon={<ChevronLeft size={15} />} onClick={() => setRegStep(1)}>
                    Geri
                  </Button>
                  <Button variant="filled" trailingIcon={<ChevronRight size={15} />} onClick={() => setRegStep(3)}>
                    2FA Doğrulamasına Geç
                  </Button>
                </div>
              </div>
            )}

            {regStep === 3 && (
              <div className="uxu-stack-md" style={{ textAlign: 'center', padding: '12px 0' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--uxu-primary-container)',
                    color: 'var(--uxu-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
                  <ShieldCheck size={26} />
                </div>

                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                    6 Haneli Güvenlik Kodunu Girin
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                    <strong>{regEmail}</strong> adresine gönderilen tek kullanımlık doğrulama kodunu girin.
                  </p>
                </div>

                {/* 6-Digit OTP Input Boxes */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '12px 0' }}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setOtpDigits((prev) => prev.map((d, i) => (i === idx ? val : d)));
                      }}
                      style={{
                        width: 48,
                        height: 54,
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        fontFamily: 'var(--uxu-font-mono)',
                        borderRadius: 'var(--uxu-radius-md)',
                        border: '1.5px solid var(--uxu-primary)',
                        background: 'var(--uxu-surface-tonal)',
                        color: 'var(--uxu-text-primary)',
                        outline: 'none',
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12 }}>
                  <Button variant="tonal" leadingIcon={<ChevronLeft size={15} />} onClick={() => setRegStep(2)}>
                    Geri
                  </Button>
                  <Button
                    variant="filled"
                    leadingIcon={<Check size={15} />}
                    onClick={() => {
                      notify({
                        title: 'Kurumsal Hesap Hazır!',
                        description: `${regWorkspace}.uxigl.truncgil.com çalışma alanınız oluşturuldu.`,
                        tone: 'success',
                      });
                    }}
                  >
                    Hesabı Doğrula ve Başlat
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* =========================================================================
       * 3. SAAS PRICING & BILLING PLANS PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-pricing' && (
        <div className="uxu-stack-lg">
          {/* Header & Billing Switcher */}
          <Card variant="glass" padding="lg">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div>
                <Badge tone="primary" size="sm">
                  ŞEFFAF LİSANSLAMA • %20 YILLIK AVANTAJ
                </Badge>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 4px 0' }}>
                  Ekibinizin Ölçeğine Uygun Paketi Seçin
                </h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                  Tüm paketlerde Apple HIG & Material You tema motoru ve temel bileşenler dahildir.
                </p>
              </div>

              <SegmentedControl<'annual' | 'monthly'>
                size="sm"
                value={billingCycle}
                onChange={setBillingCycle}
                options={[
                  { value: 'annual', label: 'Yıllık Faturalandırma (%20 İndirim)' },
                  { value: 'monthly', label: 'Aylık Faturalandırma' },
                ]}
              />
            </div>

            {/* Interactive Team Seat Calculator */}
            <div
              style={{
                marginTop: 20,
                padding: 16,
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  Geliştirici Koltuk Sayısı (Team Seats): <strong>{teamSeats} Kişi</strong>
                </span>
                <Badge tone="success" size="sm">
                  Tahmini Pro Maliyet: $
                  {billingCycle === 'annual' ? teamSeats * 24 : teamSeats * 29} / ay
                </Badge>
              </div>
              <Slider
                min={1}
                max={50}
                step={1}
                value={teamSeats}
                onChange={setTeamSeats}
              />
            </div>
          </Card>

          {/* 3-Column Pricing Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {/* Starter Plan */}
            <Card variant="glass" padding="lg">
              <div className="uxu-stack-md">
                <div>
                  <Badge tone="neutral" size="xs">
                    COMMUNITY
                  </Badge>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px 0' }}>
                    Starter Open-Source
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                    Bireysel geliştiriciler ve açık kaynak projeler için.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>$0</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
                    / sonsuza dek ücretsiz
                  </span>
                </div>

                <Button
                  variant="tonal"
                  fullWidth
                  onClick={() =>
                    notify({
                      title: 'NPM Kurulum Komutu',
                      description: 'npm i truncgil-uxigl komutu panoya kopyalandı.',
                      tone: 'info',
                    })
                  }
                >
                  Ücretsiz Başla ($ npm i)
                </Button>

                <div className="uxu-stack-sm" style={{ fontSize: '0.8rem', paddingTop: 8 }}>
                  {[
                    '30+ Apple HIG × Material 3 Bileşen',
                    '6 Tohum Renk Paleti & Dark/Light Mod',
                    '5 Farklı Sidebar Varyantı',
                    'MIT Lisansı ile Ticari Kullanım',
                  ].map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={15} style={{ color: 'var(--uxu-success)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Pro Studio Plan (Highlighted) */}
            <Card
              variant="glass"
              padding="lg"
              style={{
                border: '2px solid var(--uxu-primary)',
                boxShadow: '0 0 28px var(--uxu-accent-glow)',
              }}
            >
              <div className="uxu-stack-md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Badge tone="primary" size="xs">
                    EN ÇOK TERCİH EDİLEN
                  </Badge>
                  <Star size={16} style={{ color: 'var(--uxu-primary)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '4px 0' }}>
                    Pro Studio
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                    Hızlı büyüyen SaaS ekipleri ve kurumsal paneller için.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--uxu-primary)' }}>
                    ${billingCycle === 'annual' ? 24 : 29}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
                    / kullanıcı / ay
                  </span>
                </div>

                <Button
                  variant="filled"
                  fullWidth
                  onClick={() => onPageChange('page-invoice')}
                >
                  Pro Pakete Geç →
                </Button>

                <div className="uxu-stack-sm" style={{ fontSize: '0.8rem', paddingTop: 8 }}>
                  {[
                    'Starter paketteki tüm özellikler',
                    'SheetGL 120 FPS WebGL DataGrid Motoru',
                    'FileManGL 3D VFS Dosya Yöneticisi',
                    'Hazır Sayfa Şablonları (Auth, Fatura, Kanban)',
                    'Öncelikli Discord & GitHub Desteği',
                  ].map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={15} style={{ color: 'var(--uxu-primary)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Enterprise Plan */}
            <Card variant="glass" padding="lg">
              <div className="uxu-stack-md">
                <div>
                  <Badge tone="warning" size="xs">
                    KURUMSAL SLA
                  </Badge>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px 0' }}>
                    Enterprise Cloud
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', margin: 0 }}>
                    Sınırsız koltuk, özel tasarım token ve yerinde kurulum.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                    ${billingCycle === 'annual' ? 79 : 99}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
                    / kullanıcı / ay
                  </span>
                </div>

                <Button
                  variant="tonal"
                  fullWidth
                  onClick={() =>
                    notify({
                      title: 'Kurumsal Satış Ekibi',
                      description: 'Özel SLA teklifi için talebiniz alındı.',
                      tone: 'primary',
                    })
                  }
                >
                  Kurumsal Teklif Alın
                </Button>

                <div className="uxu-stack-sm" style={{ fontSize: '0.8rem', paddingTop: 8 }}>
                  {[
                    'Sınırsız SheetGL & FileManGL Lisansı',
                    'Özel Kurumsal Marka Paleti & Font Entegrasyonu',
                    'SAML 2.0 / Okta / Azure AD Tek Oturum (SSO)',
                    '7/24 Özel Çözüm Mimarı & %99.99 SLA Garantisi',
                  ].map((feat) => (
                    <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={15} style={{ color: 'var(--uxu-warning)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* FAQ Accordion */}
          <Card variant="glass" padding="md" title="Sıkça Sorulan Sorular (SSS)">
            <Accordion
              items={[
                {
                  id: 'faq-1',
                  title: 'truncgil-uxigl paketini ticari projelerde kullanabilir miyim?',
                  content:
                    'Evet! Temel tasarım sistemi, Apple HIG ve Google Material You token mimarisi tamamen açık kaynaklıdır ve ticari SaaS projelerinizde doğrudan kullanılabilir.',
                },
                {
                  id: 'faq-2',
                  title: 'Mevcut React / Vite projeme nasıl entegre edebilirim?',
                  content:
                    'Terminalde npm i truncgil-uxigl komutunu çalıştırdıktan sonra kök dosyanıza import "truncgil-uxigl/style.css" eklemeniz ve uygulamanızı <ThemeProvider> ile sarmalamanız yeterlidir.',
                },
                {
                  id: 'faq-3',
                  title: 'Fatura ve ödeme işlemlerinde e-Fatura desteği var mı?',
                  content:
                    'Evet, kurumsal aboneliklerde Türkiye GİB uyumlu B2B e-Fatura ve uluslararası Stripe / SWIFT faturalandırma otomatik olarak oluşturulur.',
                },
              ]}
            />
          </Card>
        </div>
      )}

      {/* =========================================================================
       * 4. USER PROFILE & DEVELOPER PORTFOLIO PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-profile' && (
        <div className="uxu-stack-lg">
          {/* Profile Cover & Avatar Header Card */}
          <Card variant="glass" padding="none" style={{ overflow: 'hidden' }}>
            <div
              style={{
                height: 130,
                background:
                  'linear-gradient(120deg, var(--uxu-primary), color-mix(in srgb, var(--uxu-secondary) 70%, #0f172a))',
                position: 'relative',
              }}
            />
            <div style={{ padding: '0 24px 24px 24px' }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: 16,
                  marginTop: -36,
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                  <div
                    style={{
                      padding: 4,
                      borderRadius: 20,
                      background: 'var(--uxu-bg-elevated)',
                      boxShadow: 'var(--uxu-shadow-elevated)',
                    }}
                  >
                    <Avatar name="Ümit Uz" size="lg" status="online" shape="squircle" />
                  </div>
                  <div style={{ paddingBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                        Ümit Uz
                      </h2>
                      <Badge tone="primary" size="xs">
                        SYSTEM ARCHITECT
                      </Badge>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        fontSize: '0.78rem',
                        color: 'var(--uxu-text-secondary)',
                        marginTop: 4,
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} /> İstanbul, Türkiye
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Globe size={13} /> uxigl.truncgil.com
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    variant="tonal"
                    size="sm"
                    leadingIcon={<Share2 size={14} />}
                    onClick={() =>
                      notify({
                        title: 'Profil Bağlantısı Kopyalandı',
                        description: 'https://uxigl.truncgil.com/@umituz',
                        tone: 'info',
                      })
                    }
                  >
                    Profili Paylaş
                  </Button>
                  <Button
                    variant="filled"
                    size="sm"
                    onClick={() =>
                      notify({
                        title: 'Profil Güncellendi',
                        description: 'Değişiklikleriniz bulut profilinize kaydedildi.',
                        tone: 'success',
                      })
                    }
                  >
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </div>

              {/* 4 KPI Strip inside Profile */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: 12,
                  paddingTop: 12,
                  borderTop: '1px solid var(--uxu-border-subtle)',
                }}
              >
                {[
                  { label: 'Toplam Commit (2026)', val: '4,820', delta: '+18% bu ay' },
                  { label: 'Yayınlanan NPM Paketi', val: '14 Paket', delta: 'v2.8.0 aktif' },
                  { label: 'Açık Kaynak Yıldızı', val: '3.4K ★', delta: 'GitHub Trending' },
                  { label: 'Mimari Uyum Skoru', val: '99.4%', delta: 'Apple HIG 8pt' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--uxu-radius-md)',
                      background: 'var(--uxu-surface-tonal)',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: 2 }}>
                      {stat.val}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--uxu-primary)', marginTop: 2 }}>
                      {stat.delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 16,
            }}
          >
            {/* Left Column: Bio & Skills & Security */}
            <Card variant="glass" padding="md" title="Hakkında & Uzmanlık Alanları">
              <div className="uxu-stack-md">
                <Textarea
                  label="Kısa Biyografi"
                  value={profileBio}
                  onChange={setProfileBio}
                  rows={3}
                />

                <div>
                  <div
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: 'var(--uxu-text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    Teknoloji & Mimari Etiketleri
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[
                      'TypeScript 5.8',
                      'React 19',
                      'WebGL2 Shaders',
                      'Apple HIG',
                      'Material You',
                      'SheetGL',
                      'FileManGL',
                      'Zero-Trust IAM',
                    ].map((skill) => (
                      <Chip key={skill} tone="primary" selected>
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--uxu-border-subtle)',
                  }}
                  className="uxu-stack-sm"
                >
                  <Switch
                    label="Herkese Açık Geliştirici Profili"
                    helperText="Profiliniz arama motorlarında ve ekip dizininde görüntülensin"
                    value={profilePublic}
                    onChange={setProfilePublic}
                  />
                  <Switch
                    label="Donanım Anahtarı (Passkey 2FA) Zorunluluğu"
                    helperText="Yeni cihaz girişlerinde biyometrik onay iste"
                    value={twoFactorActive}
                    onChange={setTwoFactorActive}
                  />
                </div>
              </div>
            </Card>

            {/* Right Column: Active Sessions & Activity Timeline */}
            <Card variant="glass" padding="md" title="Aktif Cihazlar & Son Aktiviteler">
              <div className="uxu-stack-md">
                <div className="uxu-stack-sm">
                  {[
                    {
                      device: 'MacBook Pro 16" (M4 Max • macOS Sequoia)',
                      loc: 'İstanbul, TR • Mevcut Oturum',
                      active: true,
                    },
                    {
                      device: 'iPhone 16 Pro Max (iOS 18.4 • Safari)',
                      loc: 'İstanbul, TR • 14 dk önce',
                      active: false,
                    },
                  ].map((sess) => (
                    <div
                      key={sess.device}
                      style={{
                        padding: 12,
                        borderRadius: 'var(--uxu-radius-md)',
                        background: 'var(--uxu-surface-tonal)',
                        border: '1px solid var(--uxu-border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{sess.device}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                          {sess.loc}
                        </div>
                      </div>
                      <Badge tone={sess.active ? 'success' : 'neutral'} size="xs">
                        {sess.active ? 'Aktif' : 'Mobil'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    paddingTop: 12,
                    borderTop: '1px solid var(--uxu-border-subtle)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: 'var(--uxu-text-secondary)',
                      marginBottom: 10,
                    }}
                  >
                    Son Sistem Hareketleri
                  </div>
                  <div className="uxu-stack-sm">
                    {[
                      {
                        time: '10 dk önce',
                        text: 'truncgil-uxigl@2.8.0 paketi NPM üzerinde yayınlandı.',
                        tone: 'primary' as const,
                      },
                      {
                        time: '1 saat önce',
                        text: 'Apple HIG 8pt uzamsal grid tokenları güncellendi.',
                        tone: 'success' as const,
                      },
                      {
                        time: 'Dün',
                        text: 'SheetGL finans veri kümesi (150K satır) senkronize edildi.',
                        tone: 'info' as const,
                      },
                    ].map((act) => (
                      <div
                        key={act.text}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.78rem',
                          padding: '6px 0',
                        }}
                      >
                        <span>{act.text}</span>
                        <Badge tone={act.tone} size="xs">
                          {act.time}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* =========================================================================
       * 5. B2B E-INVOICE & CHECKOUT PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-invoice' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 16,
            alignItems: 'start',
          }}
        >
          {/* Left: Printable E-Invoice Document */}
          <Card variant="glass" padding="lg">
            <div className="uxu-stack-md">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 12,
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--uxu-border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <UXILogo size={36} preserveRatio glow />
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                      TRUNÇGİL TEKNOLOJİ A.Ş.
                    </h2>
                    <div style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)' }}>
                      e-Fatura Seri: UXI2026000000842 • VKN: 8590421890
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <Badge tone={invoicePaid ? 'success' : 'warning'} size="sm">
                    {invoicePaid ? 'ÖDENDİ (PAID)' : 'ÖDEME BEKLİYOR'}
                  </Badge>
                  <div style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)', marginTop: 4 }}>
                    Tarih: 07 Kasım 2026
                  </div>
                </div>
              </div>

              {/* Billing Parties */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '0.8rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--uxu-text-secondary)', fontSize: '0.72rem' }}>
                    HİZMET SAĞLAYICI
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>Trunçgil Bulut Sistemleri</div>
                  <div style={{ color: 'var(--uxu-text-secondary)' }}>
                    Maslak Teknopark No: 42, Sarıyer / İstanbul
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--uxu-text-secondary)', fontSize: '0.72rem' }}>
                    SAYIN / KURUMSAL ALICI
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>Global FinTech Holding A.Ş.</div>
                  <div style={{ color: 'var(--uxu-text-secondary)' }}>
                    Levent Büyükdere Cad. No: 194, İstanbul
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div
                style={{
                  borderRadius: 'var(--uxu-radius-md)',
                  border: '1px solid var(--uxu-border-subtle)',
                  overflow: 'hidden',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr
                      style={{
                        background: 'var(--uxu-surface-tonal)',
                        textAlign: 'left',
                        borderBottom: '1px solid var(--uxu-border-subtle)',
                      }}
                    >
                      <th style={{ padding: '10px 12px' }}>Hizmet / Lisans Kalemi</th>
                      <th style={{ padding: '10px 12px' }}>Miktar</th>
                      <th style={{ padding: '10px 12px' }}>Birim Fiyat</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Tutar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: 'uxiGL Enterprise Design System Lisansı (Yıllık)',
                        qty: '1 Kurumsal',
                        unit: '$1,200.00',
                        total: '$1,200.00',
                      },
                      {
                        name: 'SheetGL 120 FPS WebGL DataGrid Motoru',
                        qty: '12 Koltuk',
                        unit: '$40.00',
                        total: '$480.00',
                      },
                      {
                        name: 'FileManGL 3D VFS Bulut Depolama Kümesi',
                        qty: '1 Paket',
                        unit: '$320.00',
                        total: '$320.00',
                      },
                    ].map((row) => (
                      <tr
                        key={row.name}
                        style={{ borderBottom: '1px solid var(--uxu-border-subtle)' }}
                      >
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.name}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--uxu-text-secondary)' }}>
                          {row.qty}
                        </td>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--uxu-font-mono)' }}>
                          {row.unit}
                        </td>
                        <td
                          style={{
                            padding: '10px 12px',
                            textAlign: 'right',
                            fontWeight: 700,
                            fontFamily: 'var(--uxu-font-mono)',
                          }}
                        >
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 6,
                  fontSize: '0.84rem',
                  paddingTop: 8,
                }}
              >
                <div>
                  Ara Toplam: <strong style={{ fontFamily: 'var(--uxu-font-mono)' }}>$2,000.00</strong>
                </div>
                <div>
                  KDV (%20): <strong style={{ fontFamily: 'var(--uxu-font-mono)' }}>$400.00</strong>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--uxu-primary)' }}>
                  Genel Toplam: <span style={{ fontFamily: 'var(--uxu-font-mono)' }}>$2,400.00</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8 }}>
                <Button
                  variant="tonal"
                  size="sm"
                  leadingIcon={<Printer size={14} />}
                  onClick={() => window.print()}
                >
                  Yazdır
                </Button>
                <Button
                  variant="tonal"
                  size="sm"
                  leadingIcon={<Download size={14} />}
                  onClick={() =>
                    notify({
                      title: 'e-Fatura PDF İndirildi',
                      description: 'UXI2026000000842.pdf dosyası indirildi.',
                      tone: 'info',
                    })
                  }
                >
                  PDF İndir
                </Button>
              </div>
            </div>
          </Card>

          {/* Right: Quick Checkout & Card Payment */}
          <Card variant="glass" padding="lg" title="Hızlı Kurumsal Ödeme (Checkout)">
            <div className="uxu-stack-md">
              <SegmentedControl<'card' | 'applepay' | 'wire'>
                size="sm"
                fullWidth
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={[
                  { value: 'card', label: 'Kredi Kartı' },
                  { value: 'applepay', label: 'Apple Pay' },
                  { value: 'wire', label: 'EFT / SWIFT' },
                ]}
              />

              {/* Visual Credit Card Preview */}
              <div
                style={{
                  padding: 20,
                  borderRadius: 'var(--uxu-radius-lg, 16px)',
                  background:
                    'linear-gradient(135deg, var(--uxu-primary), color-mix(in srgb, var(--uxu-secondary) 80%, #090d16))',
                  color: '#ffffff',
                  boxShadow: 'var(--uxu-shadow-elevated)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 164,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, opacity: 0.9 }}>
                    TRUNÇGİL CORPORATE CARD
                  </span>
                  <CreditCard size={20} />
                </div>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontFamily: 'var(--uxu-font-mono)',
                    letterSpacing: '0.12em',
                    margin: '16px 0',
                  }}
                >
                  {cardNumber || '4543 •••• •••• 8892'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span>{cardHolder || 'ÜMİT UZ'}</span>
                  <span>08 / 29</span>
                </div>
              </div>

              <Input label="Kart Üzerindeki İsim" value={cardHolder} onChange={setCardHolder} />
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <Input label="Kart Numarası" value={cardNumber} onChange={setCardNumber} />
                <Input label="CVV" value={cardCvv} onChange={setCardCvv} />
              </div>

              <Button
                variant="filled"
                fullWidth
                leadingIcon={<CheckCircle2 size={16} />}
                disabled={invoicePaid}
                onClick={() => {
                  setInvoicePaid(true);
                  notify({
                    title: 'Ödeme Başarıyla Alındı',
                    description: '$2,400.00 tutarındaki e-Fatura ödendi olarak işaretlendi.',
                    tone: 'success',
                  });
                }}
              >
                {invoicePaid ? 'Fatura Ödendi ($2,400.00)' : '$2,400.00 Güvenli Öde'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
       * 6. KANBAN SPRINT & PROJECT BOARD PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-kanban' && (
        <div className="uxu-stack-md">
          {/* Kanban Toolbar */}
          <Card variant="glass" padding="md">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
                <Input
                  placeholder="Görev veya kod ara (örn: UXI-108)..."
                  value={kanbanFilter}
                  onChange={setKanbanFilter}
                  leadingIcon={<Search size={15} />}
                />
              </div>

              <form
                onSubmit={handleAddKanbanTask}
                style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}
              >
                <Input
                  placeholder="Yeni görev başlığı..."
                  value={newTaskTitle}
                  onChange={setNewTaskTitle}
                />
                <Button type="submit" variant="filled" size="sm" leadingIcon={<Plus size={15} />}>
                  Görev Ekle
                </Button>
              </form>
            </div>
          </Card>

          {/* 4 Kanban Columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 14,
              alignItems: 'start',
            }}
          >
            {(
              [
                { id: 'backlog', title: 'Backlog', tone: 'neutral' as const },
                { id: 'progress', title: 'In Progress', tone: 'primary' as const },
                { id: 'review', title: 'Code Review', tone: 'warning' as const },
                { id: 'done', title: 'Completed', tone: 'success' as const },
              ] as const
            ).map((col) => {
              const colTasks = kanbanTasks.filter(
                (t) =>
                  t.column === col.id &&
                  (t.title.toLowerCase().includes(kanbanFilter.toLowerCase()) ||
                    t.id.toLowerCase().includes(kanbanFilter.toLowerCase()))
              );

              return (
                <Card key={col.id} variant="glass" padding="md">
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
                    <strong style={{ fontSize: '0.86rem' }}>{col.title}</strong>
                    <Badge tone={col.tone} size="xs">
                      {colTasks.length}
                    </Badge>
                  </div>

                  <div className="uxu-stack-sm">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          padding: 12,
                          borderRadius: 'var(--uxu-radius-md)',
                          background: 'var(--uxu-surface-tonal)',
                          border: '1px solid var(--uxu-border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontFamily: 'var(--uxu-font-mono)',
                              color: 'var(--uxu-text-secondary)',
                              fontWeight: 600,
                            }}
                          >
                            {task.id}
                          </span>
                          <Badge tone={task.tagTone} size="xs">
                            {task.tag}
                          </Badge>
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.35 }}>
                          {task.title}
                        </div>

                        <Progress
                          value={task.progress}
                          tone={task.progress === 100 ? 'success' : 'primary'}
                        />

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: 4,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Avatar name={task.assignee} size="sm" />
                            <span style={{ fontSize: '0.72rem', color: 'var(--uxu-text-secondary)' }}>
                              {task.dueDate}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: 4 }}>
                            {col.id !== 'backlog' && (
                              <button
                                type="button"
                                onClick={() => moveKanbanTask(task.id, 'prev')}
                                title="Önceki Sütuna Taşı"
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  border: '1px solid var(--uxu-border-subtle)',
                                  background: 'var(--uxu-bg-elevated)',
                                  color: 'var(--uxu-text-secondary)',
                                  cursor: 'pointer',
                                }}
                              >
                                ←
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                type="button"
                                onClick={() => moveKanbanTask(task.id, 'next')}
                                title="Sonraki Sütuna Taşı"
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  border: '1px solid var(--uxu-border-subtle)',
                                  background: 'var(--uxu-bg-elevated)',
                                  color: 'var(--uxu-primary)',
                                  cursor: 'pointer',
                                }}
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
       * 7. ERROR (404 / 500) & LIVE SYSTEM STATUS PAGE TEMPLATE
       * ========================================================================= */}
      {activePageId === 'page-status' && (
        <div className="uxu-stack-md">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SegmentedControl<'404' | '500' | 'uptime'>
              size="sm"
              value={statusTab}
              onChange={setStatusTab}
              options={[
                { value: '404', label: '404 Sayfa Bulunamadı' },
                { value: '500', label: '500 Bakım & Hata Ekranı' },
                { value: 'uptime', label: 'Canlı Sistem Durumu (SLA)' },
              ]}
            />
          </div>

          {statusTab === '404' && (
            <Card
              variant="glass"
              padding="lg"
              style={{
                textAlign: 'center',
                padding: '56px 24px',
              }}
            >
              <div
                style={{
                  fontSize: '4.5rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  background:
                    'linear-gradient(135deg, var(--uxu-primary), var(--uxu-secondary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 12,
                }}
              >
                404
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0' }}>
                Aradığınız Uzamsal Görünüm Bulunamadı
              </h2>
              <p
                style={{
                  fontSize: '0.86rem',
                  color: 'var(--uxu-text-secondary)',
                  maxWidth: 460,
                  margin: '0 auto 24px auto',
                }}
              >
                Taşınmış, silinmiş veya geçici olarak erişime kapatılmış bir adrese ulaştınız.
                Komut paletini (⌘K) kullanarak istediğiniz bileşene anında geçebilirsiniz.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <Button
                  variant="filled"
                  leadingIcon={<Home size={15} />}
                  onClick={() => (onNavigateHome ? onNavigateHome() : onPageChange('page-login'))}
                >
                  Ana Panele Dön
                </Button>
                <Button
                  variant="tonal"
                  leadingIcon={<RefreshCw size={15} />}
                  onClick={() => setStatusTab('uptime')}
                >
                  Sistem Durumunu Kontrol Et
                </Button>
              </div>
            </Card>
          )}

          {statusTab === '500' && (
            <Card
              variant="glass"
              padding="lg"
              style={{
                textAlign: 'center',
                padding: '56px 24px',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--uxu-warning-bg)',
                  color: 'var(--uxu-warning)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <AlertTriangle size={28} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px 0' }}>
                Planlı Küme Güncellemesi & Senkronizasyon
              </h2>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--uxu-text-secondary)',
                  maxWidth: 480,
                  margin: '0 auto 16px auto',
                }}
              >
                WebGL veri düğümlerimiz v2.8.0 sürümüne yükseltiliyor. İşlemleriniz güvenli
                önbellekte korunmaktadır.
              </p>
              <code
                style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: 'var(--uxu-code-bg)',
                  border: '1px solid var(--uxu-code-border)',
                  fontFamily: 'var(--uxu-font-mono)',
                  fontSize: '0.75rem',
                  marginBottom: 20,
                }}
              >
                TRACE_ID: UXI_EDGE_IST_2026_99482A
              </code>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <Button
                  variant="filled"
                  leadingIcon={<RefreshCw size={15} />}
                  onClick={() =>
                    notify({
                      title: 'Bağlantı Yenilendi',
                      description: 'Tüm servisler aktif ve yanıt veriyor.',
                      tone: 'success',
                    })
                  }
                >
                  Şimdi Yeniden Dene
                </Button>
              </div>
            </Card>
          )}

          {statusTab === 'uptime' && (
            <Card variant="glass" padding="lg">
              <div className="uxu-stack-md">
                <div
                  style={{
                    padding: 16,
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-success-bg)',
                    border: '1px solid var(--uxu-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={22} style={{ color: 'var(--uxu-success)' }} />
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>
                        Tüm Sistemler Sorunsuz Çalışıyor (All Systems Operational)
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--uxu-text-secondary)' }}>
                        Son 90 günlük ortalama kesintisizlik oranı: %99.99
                      </div>
                    </div>
                  </div>
                  <Badge tone="success" size="sm">
                    99.99% SLA
                  </Badge>
                </div>

                <div className="uxu-stack-sm">
                  {[
                    { name: 'uxiGL CDN & Design Tokens API', latency: '4.2 ms', uptime: '100%' },
                    { name: 'SheetGL Real-Time WebSocket Engine', latency: '8.1 ms', uptime: '99.99%' },
                    { name: 'FileManGL Cloud VFS Storage', latency: '11.4 ms', uptime: '99.98%' },
                    { name: 'Zero-Trust Passkey & OAuth SSO', latency: '6.5 ms', uptime: '100%' },
                  ].map((srv) => (
                    <div
                      key={srv.name}
                      style={{
                        padding: 14,
                        borderRadius: 'var(--uxu-radius-md)',
                        background: 'var(--uxu-surface-tonal)',
                        border: '1px solid var(--uxu-border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <strong style={{ fontSize: '0.84rem' }}>{srv.name}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--uxu-text-secondary)' }}>
                            {srv.latency}
                          </span>
                          <Badge tone="success" size="xs">
                            {srv.uptime}
                          </Badge>
                        </div>
                      </div>
                      {/* 36-Bar Green Uptime Strip */}
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: 36 }).map((_, idx) => (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              height: 16,
                              borderRadius: 3,
                              background:
                                idx === 19 && srv.uptime !== '100%'
                                  ? 'var(--uxu-warning)'
                                  : 'var(--uxu-success)',
                              opacity: 0.85,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
