import { useState } from 'react';
import { GoogleIcon } from '../../components/primitives';
import { AppearanceTab, WallpaperTab } from './theme-studio/AppearanceAndWallpaperTabs';
import { DesktopDockTab, IconsTab } from './theme-studio/DesktopAndIconsTabs';
import {
  OS_THEME_CATEGORIES,
  type OSThemeCategory,
  type OSThemeStudioProps,
} from './theme-studio/themeStudioTypes';
import {
  PerformanceResetTab,
  TypographyTab,
} from './theme-studio/TypographyAndPerformanceTabs';

export type { OSThemeStudioProps };

/**
 * Apple HIG Sistem Ayarları düzeninde (sol kategori menüsü + sağ içerik sahnesi)
 * OS Tema Stüdyosu pencere içeriği.
 */
export function OSThemeStudioPanel(props: OSThemeStudioProps) {
  const [activeCategory, setActiveCategory] = useState<OSThemeCategory>('appearance');
  const currentMeta =
    OS_THEME_CATEGORIES.find((c) => c.id === activeCategory) ?? OS_THEME_CATEGORIES[0];

  return (
    <div
      data-testid="os-theme-studio-panel"
      className="osgl-theme-studio"
      style={{
        display: 'grid',
        gridTemplateColumns: '204px minmax(0, 1fr)',
        alignItems: 'stretch',
        flex: 1,
        minHeight: 'calc(100% + 24px)',
        margin: -12,
        overflow: 'hidden',
      }}
    >
      {/* SOL KATEGORİ MENÜSÜ */}
      <aside
        className="osgl-theme-studio-aside macosgl-scroll"
        style={{
          padding: '12px 10px',
          borderRight: '1px solid var(--uxu-border-subtle)',
          background: 'var(--uxu-surface-tonal)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {OS_THEME_CATEGORIES.map((cat) => {
          const active = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              data-testid={`os-theme-tab-${cat.id}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px 10px',
                borderRadius: 10,
                border: 'none',
                background: active ? 'var(--uxu-primary-container)' : 'transparent',
                color: active ? 'var(--uxu-primary)' : 'var(--uxu-text-primary)',
                fontWeight: active ? 700 : 600,
                fontSize: 13,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: cat.badgeBg,
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <GoogleIcon name={cat.googleIcon} size={15} />
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* SAĞ AYAR SAHNESİ */}
      <section className="osgl-theme-studio-main macosgl-scroll" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0, minHeight: 0, overflowY: 'auto' }}>
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--uxu-text-primary)',
            }}
          >
            {currentMeta.label}
          </h3>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 12.5,
              color: 'var(--uxu-text-muted)',
              lineHeight: 1.45,
            }}
          >
            {currentMeta.subtitle}
          </p>
        </div>

        {activeCategory === 'appearance' && <AppearanceTab {...props} />}
        {activeCategory === 'wallpaper' && <WallpaperTab {...props} />}
        {activeCategory === 'desktop' && <DesktopDockTab {...props} />}
        {activeCategory === 'icons' && <IconsTab {...props} />}
        {activeCategory === 'typography' && <TypographyTab {...props} />}
        {activeCategory === 'performance' && <PerformanceResetTab {...props} />}
      </section>
    </div>
  );
}
