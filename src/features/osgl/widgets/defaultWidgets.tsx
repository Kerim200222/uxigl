import React from 'react';
import type { OSDesktopWidgetDefinition } from '../types';
import {
  CLOCK_CALENDAR_CUSTOM_FIELDS,
  CLOCK_CALENDAR_SIZE_PRESETS,
  ClockCalendarWidget,
} from './ClockCalendarWidget';
import {
  DAILY_TIMELINE_CUSTOM_FIELDS,
  DAILY_TIMELINE_SIZE_PRESETS,
  DailyTimelineWidget,
} from './DailyTimelineWidget';
import {
  FOCUS_TIMER_CUSTOM_FIELDS,
  FOCUS_TIMER_SIZE_PRESETS,
  FocusTimerWidget,
} from './FocusTimerWidget';
import {
  QUICK_NOTES_CUSTOM_FIELDS,
  QUICK_NOTES_SIZE_PRESETS,
  QuickNotesWidget,
} from './QuickNotesWidget';
import { SYSTEM_STATUS_SIZE_PRESETS, SystemStatusWidget } from './SystemStatusWidget';
import {
  TODO_LIST_CUSTOM_FIELDS,
  TODO_LIST_SIZE_PRESETS,
  TodoListWidget,
} from './TodoListWidget';

export type BuiltInOSGLWidgetId =
  | 'clock-calendar'
  | 'focus-timer'
  | 'todo-list'
  | 'quick-notes'
  | 'daily-timeline'
  | 'system-status';

export interface CreateDefaultOSGLWidgetsOptions {
  storageScopeKey?: string;
  enabledByDefault?: Partial<Record<BuiltInOSGLWidgetId, boolean>>;
  includeIds?: ReadonlyArray<BuiltInOSGLWidgetId>;
  calendarAppId?: string;
  sideBySidePair?: [string, string];
}

export function createDefaultOSGLWidgets(
  options: CreateDefaultOSGLWidgetsOptions = {}
): OSDesktopWidgetDefinition[] {
  const {
    storageScopeKey = 'default',
    enabledByDefault = {},
    includeIds,
    calendarAppId,
    sideBySidePair,
  } = options;

  const all: Array<{ id: BuiltInOSGLWidgetId; def: OSDesktopWidgetDefinition }> = [
    {
      id: 'clock-calendar',
      def: {
        id: 'clock-calendar',
        labelTr: 'Saat & Takvim',
        labelEn: 'Clock & Calendar',
        defaultEnabled: enabledByDefault['clock-calendar'] ?? true,
        defaultSize: { width: 380, height: 220 },
        sizePresets: CLOCK_CALENDAR_SIZE_PRESETS,
        customFields: CLOCK_CALENDAR_CUSTOM_FIELDS,
        render: (ctx) => (
          <ClockCalendarWidget
            ctx={ctx}
            storageScopeKey={storageScopeKey}
            calendarAppId={calendarAppId}
          />
        ),
      },
    },
    {
      id: 'focus-timer',
      def: {
        id: 'focus-timer',
        labelTr: 'Odak Sayacı',
        labelEn: 'Focus Timer',
        defaultEnabled: enabledByDefault['focus-timer'] ?? true,
        defaultSize: { width: 320, height: 150 },
        sizePresets: FOCUS_TIMER_SIZE_PRESETS,
        customFields: FOCUS_TIMER_CUSTOM_FIELDS,
        render: (ctx) => <FocusTimerWidget ctx={ctx} storageScopeKey={storageScopeKey} />,
      },
    },
    {
      id: 'todo-list',
      def: {
        id: 'todo-list',
        labelTr: 'Yapılacaklar',
        labelEn: 'To-Do List',
        defaultEnabled: enabledByDefault['todo-list'] ?? true,
        defaultSize: { width: 300, height: 210 },
        sizePresets: TODO_LIST_SIZE_PRESETS,
        customFields: TODO_LIST_CUSTOM_FIELDS,
        render: (ctx) => <TodoListWidget ctx={ctx} storageScopeKey={storageScopeKey} />,
      },
    },
    {
      id: 'quick-notes',
      def: {
        id: 'quick-notes',
        labelTr: 'Hızlı Notlar',
        labelEn: 'Quick Notes',
        defaultEnabled: enabledByDefault['quick-notes'] ?? true,
        defaultSize: { width: 300, height: 160 },
        sizePresets: QUICK_NOTES_SIZE_PRESETS,
        customFields: QUICK_NOTES_CUSTOM_FIELDS,
        render: (ctx) => <QuickNotesWidget ctx={ctx} storageScopeKey={storageScopeKey} />,
      },
    },
    {
      id: 'daily-timeline',
      def: {
        id: 'daily-timeline',
        labelTr: 'Günlük Zaman Akışı',
        labelEn: 'Daily Time Flow',
        defaultEnabled: enabledByDefault['daily-timeline'] ?? false,
        defaultSize: { width: 320, height: 210 },
        sizePresets: DAILY_TIMELINE_SIZE_PRESETS,
        customFields: DAILY_TIMELINE_CUSTOM_FIELDS,
        render: (ctx) => <DailyTimelineWidget ctx={ctx} storageScopeKey={storageScopeKey} />,
      },
    },
    {
      id: 'system-status',
      def: {
        id: 'system-status',
        labelTr: 'Sistem & Hızlı Eylem',
        labelEn: 'System & Actions',
        defaultEnabled: enabledByDefault['system-status'] ?? false,
        defaultSize: { width: 280, height: 130 },
        sizePresets: SYSTEM_STATUS_SIZE_PRESETS,
        render: (ctx) => (
          <SystemStatusWidget
            ctx={ctx}
            leftAppId={sideBySidePair?.[0]}
            rightAppId={sideBySidePair?.[1]}
          />
        ),
      },
    },
  ];

  if (!includeIds) return all.map((x) => x.def);
  const allow = new Set(includeIds);
  return all.filter((x) => allow.has(x.id)).map((x) => x.def);
}

