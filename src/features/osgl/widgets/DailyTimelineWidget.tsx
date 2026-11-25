import React, { useEffect, useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import {
  loadOSGLWidgetData,
  saveOSGLWidgetData,
  type WidgetCustomField,
  type WidgetRenderContext,
  type WidgetSizePreset,
} from '..';

type FlowPresetId = 'work' | 'school' | 'daily';

interface TimeFlowSlot {
  id: string;
  titleTr: string;
  titleEn: string;
  start: string;
  end: string;
}

const STORAGE_KEY = 'daily_timeline_state';

const PRESET_SLOTS: Record<FlowPresetId, TimeFlowSlot[]> = {
  work: [
    { id: 'w1', titleTr: 'Sabah Stand-up', titleEn: 'Morning Stand-up', start: '09:00', end: '09:30' },
    { id: 'w2', titleTr: 'Derin Odak Bloğu I', titleEn: 'Deep Focus I', start: '09:30', end: '12:00' },
    { id: 'w3', titleTr: 'Öğle Arası', titleEn: 'Lunch Break', start: '12:30', end: '13:30' },
    { id: 'w4', titleTr: 'Ekip & Ürün Planlama', titleEn: 'Team & Product Sync', start: '13:30', end: '15:30' },
    { id: 'w5', titleTr: 'Derin Odak Bloğu II', titleEn: 'Deep Focus II', start: '15:45', end: '18:00' },
  ],
  school: [
    { id: 's1', titleTr: '1. Ders', titleEn: '1st Period', start: '08:30', end: '09:15' },
    { id: 's2', titleTr: '2. Ders', titleEn: '2nd Period', start: '09:30', end: '10:15' },
    { id: 's3', titleTr: 'Öğle Arası', titleEn: 'Lunch Break', start: '12:00', end: '13:00' },
    { id: 's4', titleTr: 'Etüt & Çalışma', titleEn: 'Study Block', start: '13:30', end: '15:30' },
  ],
  daily: [
    { id: 'd1', titleTr: 'Sabah Rutini', titleEn: 'Morning Routine', start: '07:30', end: '08:30' },
    { id: 'd2', titleTr: 'Ana Odak & Üretim', titleEn: 'Core Focus', start: '09:00', end: '12:30' },
    { id: 'd3', titleTr: 'Öğleden Sonra Planı', titleEn: 'Afternoon Block', start: '13:30', end: '17:30' },
    { id: 'd4', titleTr: 'Akşam Dinlenme', titleEn: 'Evening Rest', start: '20:00', end: '22:30' },
  ],
};

export const DAILY_TIMELINE_SIZE_PRESETS: ReadonlyArray<WidgetSizePreset> = [
  { id: 'small', label: 'Kompakt', size: { width: 280, height: 150 } },
  { id: 'medium', label: 'Orta', size: { width: 320, height: 210 } },
  { id: 'large', label: 'Geniş Akış', size: { width: 380, height: 300 } },
];

export const DAILY_TIMELINE_CUSTOM_FIELDS: ReadonlyArray<WidgetCustomField> = [
  {
    key: 'preset',
    label: 'Akış Şablonu',
    defaultValue: 'work',
    options: [
      { value: 'work', label: 'İş / Ofis' },
      { value: 'school', label: 'Okul / Ders' },
      { value: 'daily', label: 'Günlük Rutin' },
    ],
  },
];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function DailyTimelineWidget({
  ctx,
  storageScopeKey = 'default',
}: {
  ctx: WidgetRenderContext;
  storageScopeKey?: string;
}) {
  const preset = (ctx.getOption?.('preset', 'work') ?? 'work') as FlowPresetId;
  const [customSlots, setCustomSlots] = useState<Partial<Record<FlowPresetId, TimeFlowSlot[]>>>(() =>
    loadOSGLWidgetData<Partial<Record<FlowPresetId, TimeFlowSlot[]>>>(STORAGE_KEY, {}, storageScopeKey)
  );
  const [now, setNow] = useState(() => new Date());
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftStart, setDraftStart] = useState('16:00');
  const [draftEnd, setDraftEnd] = useState('17:00');

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 10000);
    return () => window.clearInterval(t);
  }, []);

  const slots = [...(customSlots[preset] ?? PRESET_SLOTS[preset])].sort(
    (a, b) => toMinutes(a.start) - toMinutes(b.start)
  );
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const activeSlot = slots.find((sl) => nowMin >= toMinutes(sl.start) && nowMin < toMinutes(sl.end)) ?? null;
  const isTR = ctx.locale === 'tr';

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = draftTitle.trim();
    if (!clean) return;
    const nextList = [...slots, { id: `c-${Date.now()}`, titleTr: clean, titleEn: clean, start: draftStart, end: draftEnd }];
    const nextState = { ...customSlots, [preset]: nextList };
    setCustomSlots(nextState);
    saveOSGLWidgetData(STORAGE_KEY, nextState, storageScopeKey);
    setDraftTitle('');
    setAdding(false);
  };

  return (
    <div
      data-widget-kind="daily-timeline"
      style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}>
          <CalendarClock size={13} color={ctx.primaryColor} />
          <span>{isTR ? 'Günlük Zaman Akışı' : 'Daily Time Flow'}</span>
        </span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setAdding((v) => !v)}
          title={isTR ? 'Dilim Ekle' : 'Add Slot'}
          style={{
            border: 'none',
            backgroundColor: ctx.subtleBg,
            color: ctx.primaryColor,
            width: 22,
            height: 22,
            borderRadius: 6,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Plus size={12} />
        </button>
      </div>

      {activeSlot && (
        <div style={{ padding: '5px 8px', borderRadius: 8, backgroundColor: ctx.subtleBg, border: `1px solid ${ctx.subtleBorder}`, fontSize: 11, flexShrink: 0 }}>
          <div style={{ fontWeight: 700, color: ctx.primaryColor }}>
            {isTR ? activeSlot.titleTr : activeSlot.titleEn}
          </div>
          <div style={{ fontSize: 10, opacity: 0.7 }}>
            {activeSlot.start} – {activeSlot.end}
          </div>
        </div>
      )}

      {adding && (
        <form onSubmit={handleAddSlot} onPointerDown={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder={isTR ? 'Başlık...' : 'Title...'}
            style={{ flex: 1, minWidth: 0, padding: '3px 6px', borderRadius: 6, border: `1px solid ${ctx.subtleBorder}`, backgroundColor: ctx.subtleBg, color: 'inherit', fontSize: 11 }}
          />
          <input type="time" value={draftStart} onChange={(e) => setDraftStart(e.target.value)} style={{ width: 64, padding: '2px 4px', borderRadius: 6, border: `1px solid ${ctx.subtleBorder}`, backgroundColor: ctx.subtleBg, color: 'inherit', fontSize: 10 }} />
          <input type="time" value={draftEnd} onChange={(e) => setDraftEnd(e.target.value)} style={{ width: 64, padding: '2px 4px', borderRadius: 6, border: `1px solid ${ctx.subtleBorder}`, backgroundColor: ctx.subtleBg, color: 'inherit', fontSize: 10 }} />
          <button type="submit" style={{ border: 'none', borderRadius: 6, backgroundColor: ctx.primaryColor, color: '#fff', padding: '0 8px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer' }}>+</button>
        </form>
      )}

      <div onPointerDown={(e) => e.stopPropagation()} style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {slots.map((sl) => {
          const isActive = activeSlot?.id === sl.id;
          return (
            <div
              key={sl.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 7px',
                borderRadius: 7,
                backgroundColor: isActive ? ctx.subtleBg : 'transparent',
                borderLeft: `2px solid ${isActive ? ctx.primaryColor : ctx.subtleBorder}`,
                fontSize: 11,
              }}
            >
              <span style={{ fontWeight: isActive ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isTR ? sl.titleTr : sl.titleEn}
              </span>
              <span style={{ fontSize: 10, opacity: 0.65, flexShrink: 0 }}>
                {sl.start}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

