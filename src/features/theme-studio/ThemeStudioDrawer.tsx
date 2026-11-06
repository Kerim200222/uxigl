import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  RotateCcw,
  Sparkles,
  X,
  Copy,
  Check,
  Code2,
  Pipette,
  GripHorizontal,
} from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import { generateThemeCssExport } from '../../core/services/ThemeEngineService';
import {
  Button,
  Slider,
  Switch,
  Badge,
  GoogleIcon,
} from '../../components/primitives';
import { SegmentedControl } from '../../components/composites';
import type {
  FontFamilyPreset,
  GoogleIconStyle,
  RadiusScale,
  ThemeMode,
  UIDensity,
  WebGLShaderPreset,
} from '../../core/contracts/ThemeContract';
import type { SidebarVariant } from '../../core/contracts/NavigationContract';

export interface ThemeStudioDrawerProps {
  open: boolean;
  onClose: () => void;
  sidebarVariant?: SidebarVariant;
  onSidebarVariantChange?: (variant: SidebarVariant) => void;
  sidebarAccent?: string;
  onSidebarAccentChange?: (accent: string) => void;
}

const BRAND_HEX_SWATCHES = [
  { hex: '#6366F1', label: 'Indigo' },
  { hex: '#0EA5E9', label: 'Sky' },
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Amber' },
  { hex: '#EC4899', label: 'Pink' },
  { hex: '#8B5CF6', label: 'Violet' },
  { hex: '#EF4444', label: 'Crimson' },
  { hex: '#14B8A6', label: 'Teal' },
];

export const ThemeStudioDrawer: React.FC<ThemeStudioDrawerProps> = ({
  open,
  onClose,
  sidebarVariant = 'standard',
  onSidebarVariantChange,
  sidebarAccent = '#F59E0B',
  onSidebarAccentChange,
}) => {
  const {
    preferences,
    resolvedMode,
    availablePalettes,
    availableFontPresets,
    setMode,
    setSeedPalette,
    setCustomPrimaryHex,
    setRadiusScale,
    setCustomRadiusPx,
    setDensity,
    setFontScale,
    setFontFamilyPreset,
    setIconStyle,
    setIconFilled,
    setIconWeight,
    setGlassIntensity,
    setSidebarWidth,
    setSidebarStackedWidth,
    setReducedMotion,
    setWebglEnabled,
    setWebglPreset,
    setWebglIntensity,
    resetPreferences,
  } = useTheme();

  const [exportFormat, setExportFormat] = useState<'css' | 'json'>('css');
  const { copied, copy } = useCopyToClipboard();

  // Draggable & Resizable Modal Dimensions & Position State
  const [size, setSize] = useState<{ width: number; height: number }>(() => ({
    width: Math.min(480, typeof window !== 'undefined' ? window.innerWidth - 32 : 480),
    height: Math.min(700, typeof window !== 'undefined' ? window.innerHeight - 80 : 700),
  }));

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  // Initialize position to top-right on initial open
  useEffect(() => {
    if (open && position === null && typeof window !== 'undefined') {
      const defaultX = Math.max(16, window.innerWidth - size.width - 24);
      const defaultY = 72;
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [open, position, size.width]);

  // Dragging logic
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, a')) {
      return;
    }
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    const curPos = position || {
      x: Math.max(16, window.innerWidth - size.width - 24),
      y: 72,
    };
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: curPos.x,
      posY: curPos.y,
    };
  };

  const handleHeaderPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    const maxX = Math.max(10, window.innerWidth - size.width - 10);
    const maxY = Math.max(10, window.innerHeight - 70);
    const newX = Math.max(10, Math.min(maxX, dragStartRef.current.posX + deltaX));
    const newY = Math.max(10, Math.min(maxY, dragStartRef.current.posY + deltaY));
    setPosition({ x: newX, y: newY });
  };

  const handleHeaderPointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Resizing logic
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef<{ startX: number; startY: number; startW: number; startH: number }>({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isResizingRef.current = true;
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
    };
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizingRef.current) return;
    const deltaX = e.clientX - resizeStartRef.current.startX;
    const deltaY = e.clientY - resizeStartRef.current.startY;
    const curX = position?.x ?? (window.innerWidth - size.width - 24);
    const curY = position?.y ?? 72;
    const maxW = Math.max(340, window.innerWidth - curX - 16);
    const maxH = Math.max(340, window.innerHeight - curY - 16);
    const newWidth = Math.max(340, Math.min(maxW, resizeStartRef.current.startW + deltaX));
    const newHeight = Math.max(360, Math.min(maxH, resizeStartRef.current.startH + deltaY));
    setSize({ width: newWidth, height: newHeight });
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleResetPosition = () => {
    const defaultX = Math.max(16, window.innerWidth - 480 - 24);
    const defaultY = 72;
    setPosition({ x: defaultX, y: defaultY });
    setSize({
      width: Math.min(480, window.innerWidth - 32),
      height: Math.min(700, window.innerHeight - 80),
    });
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const exportCodeString =
    exportFormat === 'css'
      ? generateThemeCssExport(preferences, resolvedMode)
      : JSON.stringify(preferences, null, 2);

  return (
    <div
      className="uxu-theme-studio-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="uxu-theme-modal"
        style={{
          width: size.width,
          height: size.height,
          ...(position
            ? {
                left: position.x,
                top: position.y,
                right: 'auto',
                bottom: 'auto',
              }
            : {}),
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="uxiGL Tema & Görünüm Stüdyosu (Sürüklenebilir & Boyutlandırılabilir Yüzen Modal)"
      >
        <div
          className="uxu-theme-modal__header"
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handleHeaderPointerMove}
          onPointerUp={handleHeaderPointerUp}
          onPointerCancel={handleHeaderPointerUp}
          title="Sürüklemek için basılı tutup kaydırın"
        >
          <div className="uxu-theme-modal__title-group">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--uxu-radius-sm, 8px)',
                background: 'var(--uxu-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Palette size={17} className="uxu-text-primary" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700 }}>
                  uxiGL Tema Stüdyosu
                </h3>
                <Badge tone="primary" variant="tonal" size="xs">
                  Sürüklenebilir
                </Badge>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--uxu-text-secondary)',
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <GripHorizontal size={13} style={{ opacity: 0.7 }} />
                Başlıktan sürükleyin • Sağ alttan boyutlandırın
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="uxu-modal__action-btn"
              onClick={handleResetPosition}
              title="Konum ve Boyutu Sıfırla"
              aria-label="Konum ve Boyutu Sıfırla"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              className="uxu-modal__close"
              onClick={onClose}
              aria-label="Paneli kapat (Esc)"
              title="Kapat (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="uxu-theme-modal__body">
          {/* 1. Light / Dark / System Mode */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Görünüm Modu (Dark / Light / System)</span>
              <Badge tone="primary" size="xs">
                Aktif: {resolvedMode.toUpperCase()}
              </Badge>
            </div>
            <SegmentedControl<ThemeMode>
              value={preferences.mode}
              onChange={setMode}
              fullWidth
              size="sm"
              options={[
                {
                  value: 'light',
                  label: 'Aydınlık',
                  icon: <Sun size={14} />,
                },
                {
                  value: 'dark',
                  label: 'Karanlık',
                  icon: <Moon size={14} />,
                },
                {
                  value: 'system',
                  label: 'Sistem',
                  icon: <Monitor size={14} />,
                },
              ]}
            />
          </div>

          {/* 2. Sidebar Navigasyon Çeşitliliği & Aksan Rengi */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Sidebar Navigasyon Çeşitliliği</span>
              <Badge tone="primary" size="xs">
                {sidebarVariant ? sidebarVariant.toUpperCase() : 'STANDARD'}
              </Badge>
            </div>
            <SegmentedControl<SidebarVariant>
              value={sidebarVariant}
              onChange={(v) => {
                if (onSidebarVariantChange) onSidebarVariantChange(v);
              }}
              fullWidth
              size="sm"
              options={[
                { value: 'stacked-vertical', label: 'Dikey' },
                { value: 'standard', label: 'Açık' },
                { value: 'mini-rail', label: 'Kapalı' },
                { value: 'dual-column', label: 'Çift Kolon' },
                { value: 'drawer', label: 'Çekmece' },
              ]}
            />
            {onSidebarAccentChange && (
              <div
                style={{
                  marginTop: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  borderTop: '1px solid var(--uxu-border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--uxu-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  Sidebar Aksan Işıması:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {[
                    { label: 'Amber', color: '#F59E0B' },
                    { label: 'Cyan', color: '#06B6D4' },
                    { label: 'Emerald', color: '#10B981' },
                    { label: 'Indigo', color: '#6366F1' },
                    { label: 'Rose', color: '#F43F5E' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => onSidebarAccentChange(c.color)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: c.color,
                        border:
                          sidebarAccent === c.color
                            ? '2px solid var(--uxu-text-primary)'
                            : '1px solid transparent',
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow:
                          sidebarAccent === c.color
                            ? `0 0 8px ${c.color}`
                            : 'none',
                        transform:
                          sidebarAccent === c.color ? 'scale(1.2)' : 'none',
                        transition: 'all 150ms ease',
                      }}
                      title={c.label}
                      aria-label={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sidebar Genişliği Ayarı (CSS Değişkenleri: --uxu-sidebar-width & --uxu-sidebar-stacked-width) */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: '1px solid var(--uxu-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--uxu-text-secondary)',
                      fontWeight: 600,
                    }}
                  >
                    Sidebar Genişliği:
                  </span>
                  <code
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 5px',
                      borderRadius: 4,
                      background: 'var(--uxu-surface-tonal)',
                      color: 'var(--uxu-primary)',
                      fontFamily: 'var(--uxu-font-mono)',
                    }}
                  >
                    {sidebarVariant === 'stacked-vertical'
                      ? '--uxu-sidebar-stacked-width'
                      : '--uxu-sidebar-width'}
                  </code>
                </div>
                <Badge tone="primary" size="xs">
                  {sidebarVariant === 'stacked-vertical'
                    ? (preferences.sidebarStackedWidth ?? 88)
                    : (preferences.sidebarWidth ?? 256)}
                  px
                </Badge>
              </div>

              {sidebarVariant === 'stacked-vertical' ? (
                <>
                  <Slider
                    min={80}
                    max={160}
                    step={2}
                    value={preferences.sidebarStackedWidth ?? 88}
                    onChange={(v) => {
                      if (setSidebarStackedWidth) setSidebarStackedWidth(v);
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                      marginTop: 2,
                    }}
                  >
                    {[80, 88, 96, 108, 120].map((px) => (
                      <button
                        key={px}
                        type="button"
                        className={`uxu-btn uxu-btn--xs ${
                          (preferences.sidebarStackedWidth ?? 88) === px
                            ? 'uxu-btn--primary'
                            : 'uxu-btn--tonal'
                        }`}
                        onClick={() => setSidebarStackedWidth?.(px)}
                      >
                        {px}px {px === 88 && '(Varsayılan)'}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Slider
                    min={200}
                    max={380}
                    step={4}
                    value={preferences.sidebarWidth ?? 256}
                    onChange={(v) => {
                      if (setSidebarWidth) setSidebarWidth(v);
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                      marginTop: 2,
                    }}
                  >
                    {[220, 240, 256, 280, 320].map((px) => (
                      <button
                        key={px}
                        type="button"
                        className={`uxu-btn uxu-btn--xs ${
                          (preferences.sidebarWidth ?? 256) === px
                            ? 'uxu-btn--primary'
                            : 'uxu-btn--tonal'
                        }`}
                        onClick={() => setSidebarWidth?.(px)}
                      >
                        {px}px {px === 256 && '(Varsayılan)'}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Seed Palettes & Custom Brand HEX Color Picker */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Tohum Renk Paleti (Seed Color Harmony)</span>
              {preferences.customPrimaryHex && (
                <Badge tone="warning" size="xs">
                  Özel HEX: {preferences.customPrimaryHex.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="uxu-palette-grid">
              {availablePalettes.map((palette) => {
                const isSelected =
                  preferences.seedPalette === palette.id &&
                  !preferences.customPrimaryHex;
                const colors =
                  resolvedMode === 'dark' ? palette.dark : palette.light;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => {
                      setCustomPrimaryHex(undefined);
                      setSeedPalette(palette.id);
                    }}
                    className={`uxu-palette-card ${
                      isSelected ? 'uxu-palette-card--active' : ''
                    }`}
                  >
                    <div className="uxu-palette-card__swatches">
                      <span style={{ background: colors.primary }} />
                      <span style={{ background: colors.primaryContainer }} />
                      <span style={{ background: colors.secondary }} />
                    </div>
                    <div className="uxu-palette-card__info">
                      <strong>{palette.name}</strong>
                      <small>{palette.inspiration}</small>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Brand Color Synthesizer */}
            <div className="uxu-custom-hex-box">
              <div className="uxu-custom-hex-box__top">
                <div className="uxu-custom-hex-box__label">
                  <Pipette size={14} className="uxu-text-primary" />
                  <div>
                    <strong>Özel Marka Rengi Sentezleyici (HEX)</strong>
                    <small>
                      Tek bir marka renginden tüm uxiGL, SheetGL &amp; FileManGL
                      tonlarını otomatik üretir
                    </small>
                  </div>
                </div>
                <div className="uxu-custom-hex-box__picker-wrap">
                  <input
                    type="color"
                    aria-label="Özel marka rengi seçin"
                    className="uxu-custom-hex-box__color-input"
                    value={preferences.customPrimaryHex ?? '#6366F1'}
                    onChange={(e) => setCustomPrimaryHex(e.target.value)}
                  />
                  <code className="uxu-custom-hex-box__code">
                    {(preferences.customPrimaryHex ?? 'Palet').toUpperCase()}
                  </code>
                  {preferences.customPrimaryHex && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setCustomPrimaryHex(undefined)}
                    >
                      Temizle
                    </Button>
                  )}
                </div>
              </div>
              <div className="uxu-custom-hex-box__swatches">
                {BRAND_HEX_SWATCHES.map((sw) => {
                  const active =
                    preferences.customPrimaryHex?.toUpperCase() ===
                    sw.hex.toUpperCase();
                  return (
                    <button
                      key={sw.hex}
                      type="button"
                      title={`${sw.label} (${sw.hex})`}
                      className={`uxu-custom-hex-swatch ${
                        active ? 'uxu-custom-hex-swatch--active' : ''
                      }`}
                      style={{ background: sw.hex }}
                      onClick={() => setCustomPrimaryHex(sw.hex)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Google Fonts Family Pairing & Global Font Size Scale */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Google Fonts Yazı Tipi Ailesi</span>
              <Badge tone="primary" size="xs">
                {
                  availableFontPresets.find(
                    (f) => f.id === (preferences.fontFamilyPreset ?? 'inter-jakarta')
                  )?.name ?? 'Inter × Jakarta'
                }
              </Badge>
            </div>
            <div className="uxu-palette-grid">
              {availableFontPresets.map((preset) => {
                const isSelected =
                  (preferences.fontFamilyPreset ?? 'inter-jakarta') === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFontFamilyPreset(preset.id as FontFamilyPreset)}
                    className={`uxu-palette-card ${
                      isSelected ? 'uxu-palette-card--active' : ''
                    }`}
                    style={{ fontFamily: preset.sansStack }}
                  >
                    <div className="uxu-palette-card__info">
                      <strong style={{ fontFamily: preset.displayStack }}>
                        {preset.name}
                      </strong>
                      <small>{preset.badge}</small>
                    </div>
                  </button>
                );
              })}
            </div>

            <Slider
              label="Genel Yazı Boyutu (Font Ölçeği)"
              value={preferences.fontScale ?? 100}
              onChange={setFontScale}
              min={80}
              max={125}
              step={5}
              showTicks
              valueSuffix="%"
            />
            <div className="uxu-stage-row">
              {[85, 95, 100, 110, 120].map((pct) => (
                <Button
                  key={pct}
                  variant={
                    (preferences.fontScale ?? 100) === pct
                      ? 'filled'
                      : 'outlined'
                  }
                  size="xs"
                  onClick={() => setFontScale(pct)}
                >
                  %{pct}
                </Button>
              ))}
            </div>
          </div>

          {/* 3B. Google Material Symbols Variable Font Icons */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Google Material Symbols (Font İkonlar)</span>
              <Badge tone="info" size="xs">
                {(preferences.iconStyle ?? 'rounded').toUpperCase()} • wght:{' '}
                {preferences.iconWeight ?? 400}
              </Badge>
            </div>
            <SegmentedControl<GoogleIconStyle>
              value={preferences.iconStyle ?? 'rounded'}
              onChange={setIconStyle}
              fullWidth
              size="sm"
              options={[
                { value: 'rounded', label: 'Rounded' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'sharp', label: 'Sharp' },
              ]}
            />
            <Slider
              label="İkon Çizgi Kalınlığı (wght: 100 – 700)"
              value={preferences.iconWeight ?? 400}
              onChange={setIconWeight}
              min={100}
              max={700}
              step={100}
              showTicks
            />
            <Switch
              label="Dolgulu İkon Modu (FILL: 1)"
              description="Google Material Symbols FILL eksenini 0 ile 1 arasında değiştirir"
              value={Boolean(preferences.iconFilled)}
              onChange={setIconFilled}
              size="sm"
            />
            <div
              className="uxu-stage-row"
              style={{
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--uxu-radius-md)',
                background: 'var(--uxu-surface-tonal)',
                border: '1px solid var(--uxu-border-subtle)',
              }}
            >
              {[
                { name: 'auto_awesome', tone: 'primary' as const },
                { name: 'dashboard', tone: 'info' as const },
                { name: 'palette', tone: 'secondary' as const },
                { name: 'table_chart', tone: 'success' as const },
                { name: 'folder_open', tone: 'warning' as const },
                { name: 'bolt', tone: 'danger' as const },
                { name: 'verified', tone: 'primary' as const },
                { name: 'terminal', tone: 'info' as const },
              ].map((ic) => (
                <GoogleIcon
                  key={ic.name}
                  name={ic.name}
                  tone={ic.tone}
                  size={22}
                  title={ic.name}
                />
              ))}
            </div>
          </div>

          {/* 4. Corner Radius Scale (Border Radius) & Density */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Köşe Yuvarlaklığı (Border Radius)</span>
              <Badge tone="primary" size="xs">
                {preferences.customRadiusPx ?? 12}px
              </Badge>
            </div>
            <SegmentedControl<RadiusScale>
              value={preferences.radiusScale}
              onChange={setRadiusScale}
              fullWidth
              size="sm"
              options={[
                { value: 'sharp', label: 'Keskin' },
                { value: 'squircle', label: 'Squircle' },
                { value: 'pill', label: 'Kapsül' },
              ]}
            />
            <Slider
              label="Hassas Border Radius (px)"
              value={preferences.customRadiusPx ?? 12}
              onChange={setCustomRadiusPx}
              min={0}
              max={32}
              step={1}
              showTicks
              valueSuffix="px"
            />
            <div className="uxu-stage-row">
              {[0, 6, 12, 18, 26].map((px) => (
                <Button
                  key={px}
                  variant={
                    (preferences.customRadiusPx ?? 12) === px
                      ? 'filled'
                      : 'outlined'
                  }
                  size="xs"
                  onClick={() => setCustomRadiusPx(px)}
                >
                  {px}px
                </Button>
              ))}
            </div>
          </div>

          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span>Arayüz Yoğunluğu</span>
            </div>
            <SegmentedControl<UIDensity>
              value={preferences.density}
              onChange={setDensity}
              fullWidth
              size="sm"
              options={[
                { value: 'compact', label: 'Kompakt' },
                { value: 'comfortable', label: 'Dengeli' },
                { value: 'spacious', label: 'Ferah' },
              ]}
            />
          </div>

          {/* 5. Glass Blur */}
          <div className="uxu-studio-section">
            <Slider
              label="Cam Bulanıklığı (Blur)"
              value={preferences.glassIntensity}
              onChange={setGlassIntensity}
              min={0}
              max={100}
              step={5}
              valueSuffix="%"
              leadingIcon={<Sparkles size={15} />}
            />
          </div>

          {/* 6. Optional WebGL Background Toggle */}
          <div className="uxu-studio-section">
            <Switch
              label="Opsiyonel WebGL Ambiyansı"
              description="Varsayılan kapalı (0% GPU yükü)"
              value={preferences.webglEnabled}
              onChange={setWebglEnabled}
              size="sm"
            />

            {preferences.webglEnabled && (
              <div className="uxu-stack-sm" style={{ marginTop: 8 }}>
                <SegmentedControl<WebGLShaderPreset>
                  value={preferences.webglPreset}
                  onChange={setWebglPreset}
                  fullWidth
                  size="sm"
                  options={[
                    { value: 'aurora-borealis', label: 'Aurora' },
                    { value: 'spatial-nebula', label: 'Nebula' },
                    { value: 'material-lava', label: 'Küreler' },
                  ]}
                />
                <Slider
                  label="Ambiyans Yoğunluğu"
                  value={preferences.webglIntensity}
                  onChange={setWebglIntensity}
                  min={10}
                  max={80}
                  step={5}
                  valueSuffix="%"
                />
              </div>
            )}
          </div>

          {/* 7. Accessibility Motion Toggle */}
          <div className="uxu-studio-section">
            <Switch
              label="Hareketi Azalt (Reduced Motion)"
              description="Yay animasyonlarını sadeleştirir (Erişilebilirlik)"
              value={preferences.reducedMotion}
              onChange={setReducedMotion}
              size="sm"
            />
          </div>

          {/* 8. Theme Export Studio (CSS Variables & JSON Config) */}
          <div className="uxu-studio-section">
            <div className="uxu-studio-section__header">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Code2 size={14} className="uxu-text-primary" />
                Tema Dışa Aktarım Stüdyosu (CSS / JSON)
              </span>
              <Badge tone="success" size="xs">
                Canlı Token Çıktısı
              </Badge>
            </div>
            <SegmentedControl<'css' | 'json'>
              value={exportFormat}
              onChange={setExportFormat}
              fullWidth
              size="sm"
              options={[
                { value: 'css', label: 'CSS Variables (:root)' },
                { value: 'json', label: 'ThemeProvider JSON' },
              ]}
            />
            <pre className="uxu-theme-export-pre">
              <code>{exportCodeString}</code>
            </pre>
            <Button
              variant={copied ? 'success' : 'tonal'}
              size="sm"
              fullWidth
              leadingIcon={copied ? <Check size={15} /> : <Copy size={15} />}
              onClick={() => copy(exportCodeString)}
            >
              {copied
                ? 'Tema Kodu Panoya Kopyalandı!'
                : exportFormat === 'css'
                ? 'CSS Token Değişkenlerini Kopyala'
                : 'ThemeProvider JSON Yapılandırmasını Kopyala'}
            </Button>
          </div>
        </div>

        <div className="uxu-theme-modal__footer">
          <Button
            variant="outlined"
            size="sm"
            fullWidth
            leadingIcon={<RotateCcw size={15} />}
            onClick={resetPreferences}
          >
            Varsayılan Ayarlara Sıfırla
          </Button>
        </div>

        {/* Diagonal Corner Resizer */}
        <div
          className="uxu-theme-modal__resizer"
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={handleResizePointerUp}
          onPointerCancel={handleResizePointerUp}
          title="Boyutlandırmak için sürükleyin"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1L1 9M9 5L5 9M9 9L9 9.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
