import React, { useState, useEffect } from 'react';
import {
  Layout,
  Layers,
  Sparkles,
  Settings,
  Shield,
  LayoutDashboard,
  Code2,
  Check,
  Copy,
  PanelLeft,
  ChevronRight,
  Menu,
  Activity,
  Sliders,
  Maximize2,
  Zap,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Card, SegmentedControl } from '../../components/composites';
import { Badge, Button, Chip } from '../../components/primitives';
import type { SidebarVariant } from '../../core/contracts/NavigationContract';
import { useToast } from '../../providers/ToastProvider';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export interface SidebarShowcaseViewProps {
  currentVariant?: SidebarVariant;
  onVariantChange?: (variant: SidebarVariant) => void;
  accentColor?: string;
  onAccentColorChange?: (color: string) => void;
  onOpenDrawer?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarShowcaseView: React.FC<SidebarShowcaseViewProps> = ({
  currentVariant = 'stacked-vertical',
  onVariantChange,
  accentColor: externalAccent = '#F59E0B',
  onAccentColorChange,
  onOpenDrawer,
  collapsed = false,
  onToggleCollapse,
}) => {
  const { notify } = useToast();
  const { copy, copied } = useCopyToClipboard();

  const [activeVariant, setActiveVariant] = useState<SidebarVariant>(currentVariant);
  const [accent, setAccent] = useState<string>(externalAccent);

  useEffect(() => {
    if (currentVariant) {
      setActiveVariant(currentVariant);
    }
  }, [currentVariant]);

  useEffect(() => {
    if (externalAccent) {
      setAccent(externalAccent);
    }
  }, [externalAccent]);

  const handleVariantChange = (val: SidebarVariant) => {
    setActiveVariant(val);
    onVariantChange?.(val);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('uxu:sidebar-variant-change', {
          detail: { variant: val, accentColor: accent },
        })
      );
    }

    notify({
      title: 'Sol Menü Modu Güncellendi',
      description: `Ana sol menü ${getVariantTitle(val)} moduna dönüştürüldü.`,
      tone: 'info',
    });
  };

  const handleAccentChange = (color: string) => {
    setAccent(color);
    onAccentColorChange?.(color);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('uxu:sidebar-variant-change', {
          detail: { variant: activeVariant, accentColor: color },
        })
      );
    }
  };

  const getVariantTitle = (variant: SidebarVariant): string => {
    switch (variant) {
      case 'stacked-vertical':
        return 'Dikey Menü';
      case 'standard':
        return 'Açık Menü';
      case 'mini-rail':
        return 'Kapalı Menü (Ray)';
      case 'dual-column':
        return 'Çift Kolon Menü';
      case 'drawer':
        return 'Çekmece Menü';
    }
  };

  const getSnippetForVariant = (variant: SidebarVariant): string => {
    switch (variant) {
      case 'stacked-vertical':
        return `import { Sidebar } from 'truncgil-uxigl';

// 1. Dikey İkon-Etiket Yığınlı Menü (108px)
<Sidebar
  variant="stacked-vertical"
  groups={navGroups}
  activeItemId={activeSectionId}
  activeSubItemId={activeSubItemId}
  onSelect={(itemId, subId) => handleNavigate(itemId, subId)}
  brandLogo={<UXILogo size={36} preserveRatio glow />}
/>`;

      case 'standard':
        return `import { Sidebar } from 'truncgil-uxigl';

// 2. Standart Hiyerarşik Açık Menü (256px)
<Sidebar
  variant="standard"
  collapsed={isCollapsed}
  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
  groups={navGroups}
  activeItemId={activeSectionId}
  activeSubItemId={activeSubItemId}
  onSelect={(itemId, subId) => handleNavigate(itemId, subId)}
  onOpenCommandPalette={() => setCmdOpen(true)}
  brandTitle="uxiGL"
  brandSubtitle="Enterprise Design System"
/>`;

      case 'mini-rail':
        return `import { Sidebar } from 'truncgil-uxigl';

// 3. Kompakt Kapalı Ray Menü (68px)
<Sidebar
  variant="mini-rail"
  collapsed={true}
  groups={navGroups}
  activeItemId={activeSectionId}
  onSelect={(itemId) => handleNavigate(itemId)}
  onToggleCollapse={() => setIsCollapsed(false)}
/>`;

      case 'dual-column':
        return `import { Sidebar } from 'truncgil-uxigl';

// 4. Çift Kolonlu Gezinme Menüsü (78px + 222px = 300px)
<Sidebar
  variant="dual-column"
  groups={navGroups}
  activeItemId={activeSectionId}
  activeSubItemId={activeSubItemId}
  onSelect={(itemId, subId) => handleNavigate(itemId, subId)}
/>`;

      case 'drawer':
        return `import { useState } from 'react';
import { Sidebar, Button } from 'truncgil-uxigl';

// 5. Açılır Çekmece Menü (Off-Canvas Drawer)
const [drawerOpen, setDrawerOpen] = useState(false);

<Button onClick={() => setDrawerOpen(true)}>Menüyü Aç</Button>

<Sidebar
  variant="drawer"
  drawerOpen={drawerOpen}
  onCloseDrawer={() => setDrawerOpen(false)}
  groups={navGroups}
  activeItemId={activeSectionId}
  onSelect={(itemId) => {
    handleNavigate(itemId);
    setDrawerOpen(false);
  }}
/>`;
    }
  };

  const handleCopyCode = () => {
    copy(getSnippetForVariant(activeVariant));
    notify({
      title: 'Kod Panoya Kopyalandı',
      description: `${getVariantTitle(activeVariant)} kurulum kodu panoda.`,
      tone: 'success',
    });
  };

  const ACCENT_COLORS = [
    { label: 'Amber', color: '#F59E0B' },
    { label: 'Cyan', color: '#06B6D4' },
    { label: 'Emerald', color: '#10B981' },
    { label: 'Indigo', color: '#6366F1' },
    { label: 'Rose', color: '#F43F5E' },
  ];

  const VARIANT_DETAILS: Record<
    SidebarVariant,
    {
      title: string;
      width: string;
      layout: string;
      desc: string;
      scenario: string;
      benefits: string[];
    }
  > = {
    'stacked-vertical': {
      title: 'Dikey Menü',
      width: '92px',
      layout: 'İkon üstte, etiket altta dikey yığın + sol aktif dikey çubuk',
      desc: 'Yüksek bilgi yoğunluğuna sahip kontrol odaları ve endüstriyel paneller için optimize edilmiş dikey yerleşim düzeni.',
      scenario: 'Operasyonel kontrol merkezleri, SCADA ve telemetri ekranları',
      benefits: [
        'Kompakt 92px dikey ray ile ana içerik alanına maksimum genişlik kazandırır',
        'İkon üstte metin altta dikey hizalama sayesinde göz tarama süresini minimuma indirir',
        'Sol kenar dikey aksan çubuğu ve neon ışıma ile aktif modülü belirginleştirir',
      ],
    },
    standard: {
      title: 'Açık Menü',
      width: '256px',
      layout: 'Yatay ikon + etiket hiyerarşisi + akordeon açılır alt menüler',
      desc: 'Geniş kurumsal yönetim sistemleri için standart çok katmanlı akordeon menü yapısı.',
      scenario: 'Kurumsal yönetim, ERP, CRM ve çok seviyeli yönetim panelleri',
      benefits: [
        'Açılır/kapanır akordeon alt başlıklar ile derin modül ağaçlarını eksiksiz sergiler',
        'Her menü maddesi için durum rozetleri (New, Hot, SheetGL vb.) tam görünür',
        'Hızlı daraltma/genişletme butonu ile tek tıkla kompakt moda geçiş imkanı',
      ],
    },
    'mini-rail': {
      title: 'Kapalı Menü (Ray)',
      width: '68px',
      layout: 'Merkezi dikey tekil ikon rayı + araç ipucu (tooltip)',
      desc: 'İçerik alanına odaklanılması gereken büyük veri tabloları ve çizim panelleri için minimum yer kaplayan mod.',
      scenario: 'Büyük SheetGL tabloları, kod editörleri, analitik veri çalışma alanları',
      benefits: [
        'Yalnızca 68px genişlik kullanarak ekranın %95+ alanını veri tablolarına ayırır',
        'İkonlar üzerine gelindiğinde zengin araç ipuçları ile açıklama sunar',
        'Üst başlıktan tek tıklama ile açık menüye geri genişletilebilir',
      ],
    },
    'dual-column': {
      title: 'Çift Kolon Menü',
      width: '284px (68px + 216px)',
      layout: 'Sol birincil modül rayı + Sağ ikincil detay gezgini paneli',
      desc: 'İki kademeli çalışma alanı organizasyonu: Solda ana modül geçişi, sağda o modülün detay sayfaları.',
      scenario: 'Gelişmiş mesajlaşma, dokümantasyon, dosya gezgini ve modüler sistemler',
      benefits: [
        'Birinci rayda ana ekosistem alanları arasında anında geçiş',
        'İkinci kolonda o alana ait tüm alt ağaç ve sayfaların sürekli açık kalması',
        'Zihinsel modül ayrımını kusursuz sağlayan iki aşamalı navigasyon deneyimi',
      ],
    },
    drawer: {
      title: 'Çekmece Menü',
      width: '280px (Kayan Panel)',
      layout: 'Gerektiğinde soldan kayan off-canvas panel + karartmalı zemin',
      desc: 'Normalde ekranda sıfır piksel yer kaplayan, yalnızca butona tıklandığında açılan çekmece menü.',
      scenario: 'Geniş ekran odaklanma modları, mobil/tablet ve tam sayfa sunum görünümleri',
      benefits: [
        'Aktif çalışma esnasında sıfır sol kenar kaplar, tam ekran odaklanma sağlar',
        'Arka planı hafifçe karartarak kullanıcı dikkatini doğrudan menüye odaklar',
        'Esc tuşuna basılarak veya zemin tıklamasıyla pürüzsüz yay animasyonuyla kapanır',
      ],
    },
  };

  const currentDetail = VARIANT_DETAILS[activeVariant];

  return (
    <div className="uxu-stack-lg" style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      {/* 1. Header Banner */}
      <div className="uxu-docs-header">
        <div className="uxu-docs-header__badge">
          <Badge tone="primary" variant="tonal" size="sm">
            <PanelLeft size={13} style={{ marginRight: 6 }} />
            Canlı Sol Menü (Base Sidebar) Yönetim Merkezi
          </Badge>
        </div>
        <h1 className="uxu-docs-header__title">Sidebar & Gezinme Çeşitleri</h1>
        <p className="uxu-docs-header__lead">
          Buradaki kontroller ve sol menüdeki <strong>Sidebars</strong> başlığı altındaki seçenekler
          doğrudan <strong>sol taraftaki ana sistem menüsünü</strong> dönüştürür.
        </p>
      </div>

      {/* 2. Interactive Base Sidebar Controller Card */}
      <Card variant="glass" padding="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                Sol Ana Menü Görünüm Modunu Seçin
              </h3>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '0.8rem',
                  color: 'var(--uxu-text-secondary)',
                }}
              >
                Seçtiğiniz mod sol taraftaki ana menüye canlı olarak anında yansıtılır:
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--uxu-text-secondary)' }}>
                Vurgu Rengi:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => handleAccentChange(c.color)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: c.color,
                      border: accent === c.color ? '2px solid white' : '1px solid transparent',
                      boxShadow: accent === c.color ? `0 0 10px ${c.color}` : 'none',
                      cursor: 'pointer',
                      transition: 'all 160ms ease',
                    }}
                    title={c.label}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <SegmentedControl<SidebarVariant>
            value={activeVariant}
            onChange={handleVariantChange}
            fullWidth
            size="md"
            options={[
              { value: 'stacked-vertical', label: 'Dikey' },
              { value: 'standard', label: 'Açık' },
              { value: 'mini-rail', label: 'Kapalı' },
              { value: 'dual-column', label: 'Çift Kolon' },
              { value: 'drawer', label: 'Çekmece' },
            ]}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              paddingTop: 8,
              borderTop: '1px solid var(--uxu-border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {activeVariant === 'standard' && (
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={onToggleCollapse}
                  leadingIcon={<PanelLeft size={14} />}
                >
                  {collapsed ? 'Menüyü Genişlet (Aç)' : 'Menüyü Daralt (Ray)'}
                </Button>
              )}

              {activeVariant === 'drawer' && (
                <Button
                  size="sm"
                  variant="filled"
                  onClick={onOpenDrawer}
                  leadingIcon={<Menu size={14} />}
                >
                  Çekmece Menüyü Soldan Aç
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  handleVariantChange('stacked-vertical');
                  handleAccentChange('#F59E0B');
                }}
              >
                Varsayılana Sıfırla (Dikey / Kehribar)
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--uxu-text-muted)' }}>
                Sol Menü Durumu:
              </span>
              <Badge tone="success" variant="tonal" size="xs">
                Canlı Bağlantı Aktif
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. Active Mode Status Bento Card */}
      <Card
        variant="tonal"
        padding="md"
        style={{
          borderLeft: `4px solid ${accent}`,
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.08)`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Badge tone="primary" variant="filled" size="sm">
                Aktif Mod: {currentDetail.title}
              </Badge>
              <Chip size="sm" tone="info">
                Genişlik: {currentDetail.width}
              </Chip>
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--uxu-text-secondary)' }}>
              Düzen: <strong>{currentDetail.layout}</strong>
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--uxu-text-primary)', lineHeight: 1.5 }}>
            {currentDetail.desc}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 8,
              marginTop: 4,
            }}
          >
            {currentDetail.benefits.map((b, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  fontSize: '0.82rem',
                  color: 'var(--uxu-text-secondary)',
                  padding: '6px 10px',
                  background: 'var(--uxu-surface-glass)',
                  borderRadius: 'var(--uxu-radius-sm)',
                }}
              >
                <CheckCircle2
                  size={15}
                  style={{ color: accent, marginTop: 2, flexShrink: 0 }}
                />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 4. 5-Variant Cards Grid (Quick Switch Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
        {(
          [
            { id: 'stacked-vertical', label: '1. Dikey Menü', width: '108px', desc: 'İkon üstte, etiket altta. Tema renginde ferah dikey gezinme.' },
            { id: 'standard', label: '2. Açık Menü', width: '256px', desc: 'Klasik yatay hiyerarşi ve akordeon açılır alt menüler.' },
            { id: 'mini-rail', label: '3. Kapalı Menü', width: '68px', desc: 'Tekil dikey ikon rayı. Maksimum veri çalışma alanı.' },
            { id: 'dual-column', label: '4. Çift Kolon', width: '300px', desc: 'Sol ana ray + sağ detay ağacı. İki aşamalı navigasyon.' },
            { id: 'drawer', label: '5. Çekmece Menü', width: '280px', desc: 'Soldan kayan off-canvas panel. Tam ekran odaklanma.' },
          ] as const
        ).map((item) => {
          const isSelected = activeVariant === item.id;
          return (
            <Card
              key={item.id}
              variant={isSelected ? 'glass' : 'tonal'}
              padding="sm"
              style={{
                borderColor: isSelected ? accent : undefined,
                boxShadow: isSelected ? `0 0 14px ${accent}33` : undefined,
                transition: 'all 200ms ease',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.9rem', color: isSelected ? accent : 'var(--uxu-text-primary)' }}>
                    {item.label}
                  </strong>
                  <Badge size="xs" tone={isSelected ? 'primary' : 'neutral'}>
                    {item.width}
                  </Badge>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--uxu-text-secondary)', flex: 1 }}>
                  {item.desc}
                </p>
                <Button
                  size="xs"
                  variant={isSelected ? 'filled' : 'outlined'}
                  onClick={() => handleVariantChange(item.id)}
                  style={{ width: '100%', marginTop: 4 }}
                >
                  {isSelected ? 'Şu An Aktif' : 'Bu Modu Uygula'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 5. Variant Comparison Matrix */}
      <Card variant="glass" padding="md">
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', fontWeight: 800 }}>
          Sidebar Varyant Karşılaştırma Matrisi
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--uxu-text-secondary)' }}>
          Kullanım senaryolarına ve ekran gereksinimlerine göre önerilen yerleşim modelleri:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--uxu-border-strong)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Varyant</th>
                <th style={{ padding: '10px 12px' }}>Düzen & Hizalama</th>
                <th style={{ padding: '10px 12px' }}>Genişlik</th>
                <th style={{ padding: '10px 12px' }}>Önerilen Senaryo</th>
                <th style={{ padding: '10px 12px' }}>Avantaj</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--uxu-border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: '#F59E0B' }}>1. Dikey Menü</td>
                <td style={{ padding: '12px' }}>İkon üstte, metin altta dikey hizalama, sol aktif çubuğu</td>
                <td style={{ padding: '12px', fontFamily: 'var(--uxu-font-mono)' }}>92px</td>
                <td style={{ padding: '12px' }}>Operasyonel kontrol ve izleme ekranları</td>
                <td style={{ padding: '12px' }}>Kompakt dikey alan, yüksek bilgi yoğunluğu ve net odak</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--uxu-border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--uxu-primary)' }}>2. Açık Menü</td>
                <td style={{ padding: '12px' }}>Yatay ikon + etiket, açılır/kapanır akordeon alt ağaç</td>
                <td style={{ padding: '12px', fontFamily: 'var(--uxu-font-mono)' }}>256px</td>
                <td style={{ padding: '12px' }}>Geniş kurumsal yönetim ve operasyon sistemleri</td>
                <td style={{ padding: '12px' }}>Derin hiyerarşik netlik, arama ve rozet görünürlüğü</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--uxu-border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 700 }}>3. Kapalı Menü (Ray)</td>
                <td style={{ padding: '12px' }}>Dikey ortalanmış tekil ikonlar</td>
                <td style={{ padding: '12px', fontFamily: 'var(--uxu-font-mono)' }}>68px</td>
                <td style={{ padding: '12px' }}>Geniş çalışma alanı gerektiren tablolar ve paneller</td>
                <td style={{ padding: '12px' }}>Minimum genişlik, maksimum veri alanı</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--uxu-border-subtle)' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--uxu-info)' }}>4. Çift Kolonlu</td>
                <td style={{ padding: '12px' }}>Sol modül rayı + sağ detay ağacı paneli</td>
                <td style={{ padding: '12px', fontFamily: 'var(--uxu-font-mono)' }}>284px (68+216)</td>
                <td style={{ padding: '12px' }}>Çalışma alanı ve modül derinliği yüksek yapılar</td>
                <td style={{ padding: '12px' }}>Ana modüller ile alt menüler arasında hızlı geçiş</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--uxu-danger)' }}>5. Çekmece Menü</td>
                <td style={{ padding: '12px' }}>Soldan kayan off-canvas panel + karartmalı backdrop</td>
                <td style={{ padding: '12px', fontFamily: 'var(--uxu-font-mono)' }}>280px</td>
                <td style={{ padding: '12px' }}>Mobil arayüzler, tam ekran odaklanma gerektiren görünümler</td>
                <td style={{ padding: '12px' }}>Sıfır sabit yer işgali, istenildiğinde pürüzsüz açılma</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. Integration TSX Code Card */}
      <Card
        variant="glass"
        padding="md"
        headerAction={
          <Button
            size="xs"
            variant="tonal"
            onClick={handleCopyCode}
            leadingIcon={copied ? <Check size={13} /> : <Copy size={13} />}
          >
            {copied ? 'Kopyalandı' : 'Kodu Kopyala'}
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Code2 size={16} style={{ color: 'var(--uxu-primary)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
              Aktif Varyant Kurulum Kodu ({getVariantTitle(activeVariant)})
            </h4>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 16,
              borderRadius: 'var(--uxu-radius-md)',
              background: 'var(--uxu-surface-tonal)',
              fontSize: '0.82rem',
              fontFamily: 'var(--uxu-font-mono)',
              overflowX: 'auto',
              border: '1px solid var(--uxu-border-subtle)',
            }}
          >
            <code>{getSnippetForVariant(activeVariant)}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
};
