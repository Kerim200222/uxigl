import React, { useState } from 'react';
import { StickyNote, Trash2 } from 'lucide-react';
import {
  loadOSGLWidgetData,
  saveOSGLWidgetData,
  type WidgetCustomField,
  type WidgetRenderContext,
  type WidgetSizePreset,
} from '..';

const STORAGE_KEY = 'quick_notes_text';

export const QUICK_NOTES_SIZE_PRESETS: ReadonlyArray<WidgetSizePreset> = [
  { id: 'small', label: 'Kompakt', size: { width: 260, height: 140 } },
  { id: 'medium', label: 'Orta', size: { width: 320, height: 190 } },
  { id: 'large', label: 'Geniş Not', size: { width: 420, height: 280 } },
];

export const QUICK_NOTES_CUSTOM_FIELDS: ReadonlyArray<WidgetCustomField> = [
  {
    key: 'showCounter',
    label: 'Karakter Sayacı',
    defaultValue: 'on',
    options: [
      { value: 'on', label: 'Göster' },
      { value: 'off', label: 'Gizle' },
    ],
  },
];

export function QuickNotesWidget({
  ctx,
  storageScopeKey = 'default',
}: {
  ctx: WidgetRenderContext;
  storageScopeKey?: string;
}) {
  const [noteText, setNoteText] = useState<string>(() =>
    loadOSGLWidgetData<string>(STORAGE_KEY, '', storageScopeKey)
  );

  const handleChange = (next: string) => {
    setNoteText(next);
    saveOSGLWidgetData(STORAGE_KEY, next, storageScopeKey);
  };

  const isTR = ctx.locale === 'tr';
  const showCounter = ctx.getOption?.('showCounter', 'on') !== 'off';
  const s = Math.max(0.88, Math.min(1.45, ctx.scale));

  return (
    <div
      data-widget-kind="quick-notes"
      style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: Math.round(12 * s), fontWeight: 700 }}>
          <StickyNote size={Math.round(13 * s)} color={ctx.primaryColor} />
          <span>{isTR ? 'Hızlı Notlar' : 'Quick Notes'}</span>
        </span>
        <div onPointerDown={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {showCounter && (
            <span style={{ fontSize: 10, opacity: 0.55 }}>{noteText.length}</span>
          )}
          {noteText && (
            <button
              type="button"
              onClick={() => handleChange('')}
              title={isTR ? 'Notu Temizle' : 'Clear Note'}
              aria-label={isTR ? 'Notu Temizle' : 'Clear Note'}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                opacity: 0.6,
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
              }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <textarea
        onPointerDown={(e) => e.stopPropagation()}
        value={noteText}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={isTR ? 'Buraya hızlı not alabilirsiniz...' : 'Jot down a quick note...'}
        aria-label={isTR ? 'Hızlı Notlar' : 'Quick Notes'}
        style={{
          width: '100%',
          flex: 1,
          resize: 'none',
          minHeight: 54,
          padding: '7px 9px',
          borderRadius: 9,
          border: `1px solid ${ctx.subtleBorder}`,
          backgroundColor: ctx.subtleBg,
          color: 'inherit',
          fontSize: Math.round(11.5 * Math.min(1.3, s)),
          lineHeight: 1.4,
          fontFamily: 'inherit',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

