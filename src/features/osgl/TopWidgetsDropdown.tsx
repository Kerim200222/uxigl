import React from 'react';
import { Check, Eye, EyeOff, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { ContextMenuItem } from './WindowChrome';
import { resolveWidgetLabel, type OSDesktopWidgetDefinition } from './types';

export function TopWidgetsDropdown({
  dropdownStyle,
  isDark = false,
  locale = 'tr',
  widgets,
  widgetsVisible,
  enabledWidgets,
  onToggleWidgets,
  onToggleWidgetItem,
  onCustomizeWidget,
  onResetWidgetPositions,
  closeAllMenus,
}: {
  dropdownStyle: React.CSSProperties;
  isDark?: boolean;
  locale?: 'tr' | 'en' | 'ru';
  widgets: OSDesktopWidgetDefinition[];
  widgetsVisible: boolean;
  enabledWidgets: Record<string, boolean>;
  onToggleWidgets: () => void;
  onToggleWidgetItem: (id: string) => void;
  onCustomizeWidget?: (id: string, anchorX: number, anchorY: number) => void;
  onResetWidgetPositions: () => void;
  closeAllMenus: () => void;
}) {
  const txt = locale === 'en'
    ? {
        heading: 'Desktop Widgets',
        hideAll: 'Hide All Widgets',
        showAll: 'Show Widgets',
        settingsSuffix: 'Settings',
      }
    : locale === 'ru'
      ? {
          heading: 'Виджеты рабочего стола',
          hideAll: 'Скрыть все виджеты',
          showAll: 'Показать виджеты',
          settingsSuffix: 'Настройки',
        }
      : {
          heading: "Masaüstü Widget'ları",
          hideAll: "Tüm Widget'ları Gizle",
          showAll: "Widget'ları Göster",
          settingsSuffix: 'Ayarları',
        };
  return (
    <div
      role="menu"
      className="osgl-menubar-dropdown"
      onClick={(e) => e.stopPropagation()}
      style={{ ...dropdownStyle, left: 'auto', right: 0, width: 274, transformOrigin: 'top right' }}
    >
      <div style={{ padding: '5px 10px 3px', fontSize: 10.5, fontWeight: 750, opacity: 0.58, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
        {txt.heading}
      </div>
      <ContextMenuItem
        icon={widgetsVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        label={widgetsVisible ? txt.hideAll : txt.showAll}
        onClick={onToggleWidgets}
      />
      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {widgets.map((w) => {
          const enabled = enabledWidgets[w.id] !== false;
          return (
            <div
              key={w.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 4,
                padding: '2px 4px 2px 2px',
                borderRadius: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.045)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <button
                type="button"
                onClick={() => onToggleWidgetItem(w.id)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 6px 5px 8px',
                  border: 'none',
                  borderRadius: 6,
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12.5,
                  fontWeight: 550,
                  letterSpacing: '-0.008em',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    width: 14,
                    flexShrink: 0,
                    display: 'inline-flex',
                    justifyContent: 'center',
                    color: enabled ? '#2563eb' : 'transparent',
                  }}
                >
                  <Check size={13.5} strokeWidth={2.5} />
                </span>
                <span style={{ lineHeight: 1.25 }}>{resolveWidgetLabel(w, locale)}</span>
              </button>

              {onCustomizeWidget && (
                <button
                  type="button"
                  data-menu-widget-settings={w.id}
                  title={`${resolveWidgetLabel(w, locale)} ${txt.settingsSuffix}`}
                  aria-label={`${resolveWidgetLabel(w, locale)} ${txt.settingsSuffix}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    closeAllMenus();
                    onCustomizeWidget(w.id, rect.right - 304, rect.bottom + 8);
                  }}
                  style={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    borderRadius: 7,
                    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.10)',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)',
                    color: isDark ? '#cbd5e1' : '#475569',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'background-color 0.14s ease, color 0.14s ease, border-color 0.14s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(59,130,246,0.22)' : 'rgba(37,99,235,0.12)';
                    e.currentTarget.style.color = isDark ? '#93c5fd' : '#2563eb';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(96,165,250,0.4)' : 'rgba(37,99,235,0.32)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)';
                    e.currentTarget.style.color = isDark ? '#cbd5e1' : '#475569';
                    e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)';
                  }}
                >
                  <SlidersHorizontal size={12.5} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ height: 1, backgroundColor: 'rgba(148,163,184,0.2)', margin: '4px 0' }} />
      <ContextMenuItem
        icon={<RotateCcw size={14} />}
        label="Widget Konumlarını Sıfırla"
        onClick={() => { onResetWidgetPositions(); closeAllMenus(); }}
      />
    </div>
  );
}
