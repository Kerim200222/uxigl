import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Plus } from 'lucide-react';
import { AnalogDigitalClock } from '../../../components/composites/Clock/AnalogDigitalClock';
import { CalendarTaskModal } from '../../../components/composites/Calendar/CalendarTaskModal';
import {
  buildSeedCalendarEvents,
  CATEGORY_META,
  toIsoDate,
} from '../../../components/composites/Calendar/calendarUtils';
import type { CalendarTaskEvent } from '../../../components/composites/Calendar/types';
import {
  loadOSGLWidgetData,
  saveOSGLWidgetData,
  type WidgetCustomField,
  type WidgetRenderContext,
  type WidgetSizePreset,
} from '..';

const STORAGE_KEY = 'clock_calendar_events';

export const CLOCK_CALENDAR_SIZE_PRESETS: ReadonlyArray<WidgetSizePreset> = [
  { id: 'small', label: 'Kompakt Saat', size: { width: 280, height: 120 } },
  { id: 'medium', label: 'Saat & Takvim', size: { width: 380, height: 220 } },
  { id: 'large', label: 'Geniş Ajanda', size: { width: 440, height: 320 } },
];

export const CLOCK_CALENDAR_CUSTOM_FIELDS: ReadonlyArray<WidgetCustomField> = [
  {
    key: 'clockMode',
    label: 'Saat Görünümü',
    defaultValue: 'both',
    options: [
      { value: 'both', label: 'Analog + Dijital' },
      { value: 'digital', label: 'Sadece Dijital' },
      { value: 'analog', label: 'Sadece Analog' },
    ],
  },
];

export function ClockCalendarWidget({
  ctx,
  storageScopeKey = 'default',
  calendarAppId,
}: {
  ctx: WidgetRenderContext;
  storageScopeKey?: string;
  calendarAppId?: string;
}) {
  const [events, setEvents] = useState<CalendarTaskEvent[]>(() =>
    loadOSGLWidgetData<CalendarTaskEvent[]>(STORAGE_KEY, buildSeedCalendarEvents(), storageScopeKey)
  );
  const todayIso = toIsoDate(new Date());
  const [selectedIso, setSelectedIso] = useState<string>(todayIso);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [draftEvent, setDraftEvent] = useState<Partial<CalendarTaskEvent>>({
    date: todayIso,
    startHour: 9,
    startMinute: 0,
    durationMinutes: 60,
    category: 'work',
  });

  const persistEvents = (updater: (prev: CalendarTaskEvent[]) => CalendarTaskEvent[]) => {
    setEvents((prev) => {
      const next = updater(prev);
      saveOSGLWidgetData(STORAGE_KEY, next, storageScopeKey);
      return next;
    });
  };

  const openCreateModal = (dateIso: string = selectedIso) => {
    setEditingEventId(null);
    setDraftEvent({
      title: '',
      date: dateIso,
      startHour: 10,
      startMinute: 0,
      durationMinutes: 60,
      category: 'work',
      location: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleSaveEvent = (payload: Omit<CalendarTaskEvent, 'id'>, editId?: string | null) => {
    if (editId) {
      persistEvents((prev) => prev.map((ev) => (ev.id === editId ? { ...payload, id: editId } : ev)));
    } else {
      persistEvents((prev) => [...prev, { ...payload, id: `osgl-cal-${Date.now()}` }]);
    }
    setSelectedIso(payload.date);
    setModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    persistEvents((prev) => prev.filter((ev) => ev.id !== id));
    setModalOpen(false);
  };

  const clockMode = (ctx.getOption?.('clockMode', 'both') ?? 'both') as 'both' | 'analog' | 'digital';
  const showMiniCalendar = ctx.width >= 350 && ctx.height >= 170;
  const showDayEvents = ctx.width >= 340 && ctx.height >= 260;
  const dialSize = Math.round(Math.max(54, Math.min(ctx.height * 0.45, 130)));
  const isTR = ctx.locale === 'tr';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleDateString(isTR ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' });
  const dayEvents = events.filter((e) => e.date === selectedIso);

  return (
    <div
      data-widget-kind="clock-calendar"
      style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: showMiniCalendar ? '0 0 auto' : 1, minWidth: 0 }}>
          <AnalogDigitalClock
            size={dialSize}
          />
        </div>

        {showMiniCalendar && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4, height: '100%', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
              <button
                type="button"
                onClick={() => (calendarAppId ? ctx.openApp(calendarAppId) : openCreateModal(selectedIso))}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Calendar size={12} color={ctx.primaryColor} />
                <span style={{ textTransform: 'capitalize' }}>{monthLabel}</span>
              </button>
              <button
                type="button"
                onClick={() => openCreateModal(selectedIso)}
                title={isTR ? 'Etkinlik Ekle' : 'Add Event'}
                style={{
                  border: 'none',
                  backgroundColor: ctx.subtleBg,
                  color: ctx.primaryColor,
                  width: 20,
                  height: 20,
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 9.5, textAlign: 'center' }}>
              {(isTR ? ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S']).map((d, i) => (
                <span key={i} style={{ opacity: 0.55, fontWeight: 700 }}>{d}</span>
              ))}
              {Array.from({ length: startOffset }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const day = idx + 1;
                const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = iso === selectedIso;
                const isToday = iso === todayIso;
                const hasEv = events.some((e) => e.date === iso);
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedIso(iso)}
                    style={{
                      border: isToday && !isSelected ? `1px solid ${ctx.primaryColor}` : 'none',
                      borderRadius: 5,
                      padding: '2px 0',
                      fontSize: 9.5,
                      fontWeight: isSelected || isToday ? 800 : 500,
                      backgroundColor: isSelected ? ctx.primaryColor : 'transparent',
                      color: isSelected ? '#ffffff' : 'inherit',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    {day}
                    {hasEv && !isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 1,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 3,
                          height: 3,
                          borderRadius: 99,
                          backgroundColor: ctx.primaryColor,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showDayEvents && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{ borderTop: `1px solid ${ctx.subtleBorder}`, paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 84, overflowY: 'auto' }}
        >
          {dayEvents.length === 0 ? (
            <span style={{ fontSize: 10.5, opacity: 0.6 }}>{isTR ? 'Seçili günde etkinlik yok.' : 'No events for this day.'}</span>
          ) : (
            dayEvents.slice(0, 3).map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => {
                  setEditingEventId(ev.id);
                  setDraftEvent(ev);
                  setModalOpen(true);
                }}
                style={{
                  border: 'none',
                  backgroundColor: ctx.subtleBg,
                  color: 'inherit',
                  borderRadius: 6,
                  padding: '3px 7px',
                  fontSize: 10.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 99, backgroundColor: CATEGORY_META[ev.category]?.color ?? ctx.primaryColor, flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</span>
                </span>
                <span style={{ opacity: 0.65, fontSize: 9.5, flexShrink: 0 }}>
                  {String(ev.startHour).padStart(2, '0')}:{String(ev.startMinute).padStart(2, '0')}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {modalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <CalendarTaskModal
            open={modalOpen}
            locale={ctx.locale === 'tr' ? 'tr' : 'en'}
            initialDraft={draftEvent}
            editingEventId={editingEventId}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={editingEventId ? handleDeleteEvent : undefined}
          />,
          document.body
        )}
    </div>
  );
}
