import { Button, Input, Slider } from '../../../components/primitives';
import type { ThemeMode } from '../../../core/contracts/ThemeContract';
import { WorkspaceShellGallery } from '../../theme-studio/WorkspaceShellGallery';
import { OS_WALLPAPERS, type OSWallpaperId } from '../osglEngine';
import type { BgMode } from '../types';
import {
  StudioChoicePill,
  StudioFieldLabel,
  type OSThemeStudioProps,
} from './themeStudioTypes';

export function AppearanceTab({
  theme,
  onOpenFullThemeStudio,
}: Pick<OSThemeStudioProps, 'theme' | 'onOpenFullThemeStudio'>) {
  const { preferences } = theme;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 8,
            flexWrap: 'wrap',
          }}
        >
          <StudioFieldLabel>Çalışma Alanı Kabuğu (6 Tasarım)</StudioFieldLabel>
          {onOpenFullThemeStudio && (
            <Button size="sm" variant="outlined" onClick={onOpenFullThemeStudio}>
              Tam Çekmece Görünümü
            </Button>
          )}
        </div>
        <WorkspaceShellGallery
          value={preferences.workspaceShell}
          onChange={theme.setWorkspaceShell}
          defaultRoleShell="osgl"
          compact
        />
      </div>

      <div>
        <StudioFieldLabel>Renk Modu</StudioFieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'light', label: 'Aydınlık' },
              { id: 'dark', label: 'Karanlık' },
              { id: 'system', label: 'Sistem' },
            ] as Array<{ id: ThemeMode; label: string }>
          ).map((m) => (
            <StudioChoicePill
              key={m.id}
              active={preferences.mode === m.id}
              onClick={() => theme.setMode(m.id)}
            >
              {m.label}
            </StudioChoicePill>
          ))}
        </div>
      </div>

      <div>
        <StudioFieldLabel>Vurgu Renk Paleti</StudioFieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {theme.availablePalettes.map((pal) => {
            const active =
              !preferences.customPrimaryHex && preferences.seedPalette === pal.id;
            return (
              <button
                key={pal.id}
                type="button"
                onClick={() => theme.setSeedPalette(pal.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '6px 11px',
                  borderRadius: 10,
                  border: active
                    ? '2px solid var(--uxu-primary)'
                    : '1px solid var(--uxu-border-subtle)',
                  background: 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: pal.light.primary,
                  }}
                />
                <span>{pal.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <StudioFieldLabel>
          Pencere Köşe Yuvarlaklığı ({preferences.customRadiusPx ?? 14}px)
        </StudioFieldLabel>
        <Slider
          min={4}
          max={26}
          value={preferences.customRadiusPx ?? 14}
          onChange={theme.setCustomRadiusPx}
        />
      </div>

      <div>
        <StudioFieldLabel>
          Liquid Glass Saydamlık Yoğunluğu (%{preferences.glassIntensity})
        </StudioFieldLabel>
        <Slider
          min={20}
          max={100}
          value={preferences.glassIntensity}
          onChange={theme.setGlassIntensity}
        />
      </div>
    </div>
  );
}

export function WallpaperTab({
  wallpaper,
  setWallpaper,
  bgMode,
  setBgMode,
  solidBgColor,
  setSolidBgColor,
  bgGradColor1,
  setBgGradColor1,
  bgGradColor2,
  setBgGradColor2,
  customBgUrl,
  setCustomBgUrl,
  uploadedBgDataUrl,
  setUploadedBgDataUrl,
  loginBgUrl,
}: Pick<
  OSThemeStudioProps,
  | 'wallpaper'
  | 'setWallpaper'
  | 'bgMode'
  | 'setBgMode'
  | 'solidBgColor'
  | 'setSolidBgColor'
  | 'bgGradColor1'
  | 'setBgGradColor1'
  | 'bgGradColor2'
  | 'setBgGradColor2'
  | 'customBgUrl'
  | 'setCustomBgUrl'
  | 'uploadedBgDataUrl'
  | 'setUploadedBgDataUrl'
  | 'loginBgUrl'
>) {
  const normalizedLoginBg = (loginBgUrl || '').trim();
  const isLoginBgActive =
    Boolean(normalizedLoginBg) &&
    bgMode === 'image' &&
    !uploadedBgDataUrl &&
    customBgUrl.trim() === normalizedLoginBg;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <StudioFieldLabel>Arka Plan Türü</StudioFieldLabel>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {(
            [
              { id: 'aurora', label: 'Aurora (WebGL)' },
              { id: 'gradient', label: 'Gradyan' },
              { id: 'solid', label: 'Düz Renk' },
              { id: 'image', label: 'Özel Görsel' },
            ] as Array<{ id: BgMode; label: string }>
          ).map((m) => (
            <StudioChoicePill
              key={m.id}
              active={bgMode === m.id}
              onClick={() => setBgMode(m.id)}
            >
              {m.label}
            </StudioChoicePill>
          ))}
        </div>
      </div>

      {normalizedLoginBg && (
        <div>
          <StudioFieldLabel>Giriş Ekranı Arka Planı</StudioFieldLabel>
          <button
            type="button"
            onClick={() => {
              setUploadedBgDataUrl('');
              setCustomBgUrl(normalizedLoginBg);
              setBgMode('image');
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 8,
              borderRadius: 12,
              border: isLoginBgActive
                ? '2px solid var(--uxu-primary)'
                : '1px solid var(--uxu-border-subtle)',
              background: 'var(--uxu-bg-elevated)',
              color: 'var(--uxu-text-primary)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 72,
                height: 42,
                borderRadius: 8,
                flexShrink: 0,
                background: `url("${normalizedLoginBg}") center / cover no-repeat`,
                border: '1px solid var(--uxu-border-subtle)',
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Login Background</div>
              <div style={{ fontSize: 11, color: 'var(--uxu-text-muted)' }}>
                {isLoginBgActive ? 'Aktif masaüstü arka planı' : 'Giriş arka planını kullan'}
              </div>
            </div>
          </button>
        </div>
      )}

      {bgMode === 'aurora' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(124px, 1fr))', gap: 10 }}>
          {(Object.keys(OS_WALLPAPERS) as OSWallpaperId[]).map((key) => {
            const item = OS_WALLPAPERS[key];
            const active = wallpaper === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setWallpaper(key)}
                style={{
                  padding: 7,
                  borderRadius: 12,
                  border: active
                    ? '2px solid var(--uxu-primary)'
                    : '1px solid var(--uxu-border-subtle)',
                  background: 'var(--uxu-bg-elevated)',
                  color: 'var(--uxu-text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    height: 38,
                    borderRadius: 8,
                    background: item.preview,
                    marginBottom: 6,
                  }}
                />
                <div style={{ fontSize: 11.5, fontWeight: 700 }}>{item.name}</div>
              </button>
            );
          })}
        </div>
      )}

      {bgMode === 'gradient' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <span>Başlangıç Rengi</span>
            <input
              type="color"
              value={bgGradColor1}
              onChange={(e) => setBgGradColor1(e.target.value)}
            />
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
            <span>Bitiş Rengi</span>
            <input
              type="color"
              value={bgGradColor2}
              onChange={(e) => setBgGradColor2(e.target.value)}
            />
          </label>
        </div>
      )}

      {bgMode === 'solid' && (
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12.5 }}>
          <span>Düz Arka Plan Rengi</span>
          <input
            type="color"
            aria-label="Düz Arka Plan Rengi"
            value={solidBgColor}
            onChange={(e) => setSolidBgColor(e.target.value)}
          />
        </label>
      )}

      {bgMode === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Input
            placeholder="https://... görsel adresi"
            value={customBgUrl}
            onChange={setCustomBgUrl}
          />
          {uploadedBgDataUrl && (
            <Button size="sm" variant="outlined" onClick={() => setUploadedBgDataUrl('')}>
              Görseli Temizle
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
