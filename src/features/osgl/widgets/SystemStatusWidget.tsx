import React from 'react';
import { Activity, Columns2, Palette } from 'lucide-react';
import { OS_THEME_STUDIO_APP_ID, type WidgetRenderContext, type WidgetSizePreset } from '..';

export const SYSTEM_STATUS_SIZE_PRESETS: ReadonlyArray<WidgetSizePreset> = [
  { id: 'small', label: 'Kompakt', size: { width: 280, height: 130 } },
  { id: 'medium', label: 'Orta', size: { width: 320, height: 160 } },
];

export function SystemStatusWidget({
  ctx,
  leftAppId,
  rightAppId,
}: {
  ctx: WidgetRenderContext;
  leftAppId?: string;
  rightAppId?: string;
}) {
  const isTR = ctx.locale === 'tr';

  return (
    <div
      data-widget-kind="system-status"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}>
          <Activity size={13} color={ctx.primaryColor} />
          <span>{isTR ? 'Sistem & Hızlı Eylem' : 'System & Actions'}</span>
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, backgroundColor: ctx.subtleBg, color: ctx.primaryColor }}>
          OSGL v4
        </span>
      </div>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ display: 'grid', gridTemplateColumns: leftAppId && rightAppId ? '1fr 1fr' : '1fr', gap: 6 }}
      >
        <button
          type="button"
          onClick={() => ctx.openApp(OS_THEME_STUDIO_APP_ID)}
          style={{
            border: `1px solid ${ctx.subtleBorder}`,
            backgroundColor: ctx.subtleBg,
            color: 'inherit',
            borderRadius: 8,
            padding: '7px 9px',
            fontSize: 11,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            cursor: 'pointer',
          }}
        >
          <Palette size={13} color={ctx.primaryColor} />
          <span>{isTR ? 'Tema Stüdyosu' : 'Theme Studio'}</span>
        </button>

        {leftAppId && rightAppId && (
          <button
            type="button"
            onClick={() => ctx.openSideBySide(leftAppId, rightAppId)}
            style={{
              border: `1px solid ${ctx.subtleBorder}`,
              backgroundColor: ctx.subtleBg,
              color: 'inherit',
              borderRadius: 8,
              padding: '7px 9px',
              fontSize: 11,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
          >
            <Columns2 size={13} color={ctx.primaryColor} />
            <span>{isTR ? 'Yan Yana Aç' : 'Side by Side'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

