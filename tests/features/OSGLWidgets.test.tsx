// @vitest-environment jsdom
import React, { useState } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

vi.hoisted(() => {
  (globalThis as unknown as { __UXIGL_VERSION__: string }).__UXIGL_VERSION__ = '3.0.6';
});

import {
  FocusTimerWidget,
  FOCUS_TIMER_SIZE_PRESETS,
  FOCUS_TIMER_CUSTOM_FIELDS,
} from '../../src/features/osgl/widgets/FocusTimerWidget';
import { TodoListWidget } from '../../src/features/osgl/widgets/TodoListWidget';
import { QuickNotesWidget } from '../../src/features/osgl/widgets/QuickNotesWidget';
import { ClockCalendarWidget } from '../../src/features/osgl/widgets/ClockCalendarWidget';
import { DailyTimelineWidget } from '../../src/features/osgl/widgets/DailyTimelineWidget';
import { WidgetCustomizePopover } from '../../src/features/osgl/WidgetCustomizePopover';
import type {
  OSDesktopWidgetDefinition,
  WidgetRenderContext,
  WidgetSize,
  WidgetUserPrefs,
} from '../../src/features/osgl/types';

function createMockWidgetContext(
  overrides: Partial<WidgetRenderContext> = {}
): WidgetRenderContext {
  return {
    cardStyle: {},
    subtleBorder: 'rgba(148, 163, 184, 0.25)',
    subtleBg: 'rgba(148, 163, 184, 0.12)',
    primaryColor: '#2563eb',
    isDark: false,
    locale: 'tr',
    width: 380,
    height: 240,
    scale: 1,
    getOption: (_key, fallback) => fallback,
    openApp: vi.fn(),
    openSideBySide: vi.fn(),
    ...overrides,
  };
}

describe('OSGL Desktop Widgets — WAI-ARIA & Interactive Behavior', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it('FocusTimerWidget: updates aria-pressed across duration presets and opens custom duration editing via the accessible time readout button', async () => {
    const user = userEvent.setup();
    const ctx = createMockWidgetContext();

    render(<FocusTimerWidget ctx={ctx} storageScopeKey="test-focus-timer" />);

    const preset5m = screen.getByRole('button', { name: '5m' });
    const preset15m = screen.getByRole('button', { name: '15m' });
    const preset25m = screen.getByRole('button', { name: '25m' });
    const customBtn = screen.getByTestId('focus-timer-custom-btn');

    // Default is 25m
    expect(preset25m).toHaveAttribute('aria-pressed', 'true');
    expect(preset15m).toHaveAttribute('aria-pressed', 'false');
    expect(preset5m).toHaveAttribute('aria-pressed', 'false');
    expect(customBtn).toHaveAttribute('aria-pressed', 'false');

    // Selecting 15m updates aria-pressed and time readout
    await user.click(preset15m);
    expect(preset15m).toHaveAttribute('aria-pressed', 'true');
    expect(preset25m).toHaveAttribute('aria-pressed', 'false');

    // Selecting 5m updates aria-pressed
    await user.click(preset5m);
    expect(preset5m).toHaveAttribute('aria-pressed', 'true');
    expect(preset15m).toHaveAttribute('aria-pressed', 'false');

    // Clicking the accessible time readout button opens custom duration editing
    const timeReadoutBtn = screen.getByRole('button', {
      name: /Kalan süre 05:00 — süreyi düzenlemek için tıklayın/i,
    });
    await user.click(timeReadoutBtn);

    expect(customBtn).toHaveAttribute('aria-pressed', 'true');
    expect(preset5m).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('spinbutton', { name: 'Özel odak süresi (dakika)' })
    ).toHaveValue(5);
  });

  it('TodoListWidget: adds a new task, toggles role="checkbox" aria-checked state, and deletes task via contextual aria-label', async () => {
    const user = userEvent.setup();
    const ctx = createMockWidgetContext();

    render(<TodoListWidget ctx={ctx} storageScopeKey="test-todo-list" />);

    const taskInput = screen.getByRole('textbox', { name: 'Yeni görev ekle' });
    await user.type(taskInput, 'WAI-ARIA testlerini tamamla');
    await user.click(screen.getByRole('button', { name: 'Ekle' }));

    expect(screen.getByText('WAI-ARIA testlerini tamamla')).toBeInTheDocument();

    // Find the new task's checkbox by its contextual aria-label
    const taskCheckbox = screen.getByRole('checkbox', {
      name: 'WAI-ARIA testlerini tamamla görevini tamamlandı olarak işaretle',
    });
    expect(taskCheckbox).toHaveAttribute('aria-checked', 'false');

    // Toggle completion -> aria-checked becomes "true", then back to "false"
    await user.click(taskCheckbox);
    expect(taskCheckbox).toHaveAttribute('aria-checked', 'true');

    await user.click(taskCheckbox);
    expect(taskCheckbox).toHaveAttribute('aria-checked', 'false');

    // Contextual delete button removes the task from the DOM
    const deleteBtn = screen.getByRole('button', {
      name: 'WAI-ARIA testlerini tamamla görevini sil',
    });
    await user.click(deleteBtn);
    expect(
      screen.queryByText('WAI-ARIA testlerini tamamla')
    ).not.toBeInTheDocument();
  });

  it('QuickNotesWidget: updates note value in accessible textarea and clears note via accessible Clear Note button', async () => {
    const user = userEvent.setup();
    const ctx = createMockWidgetContext();

    render(<QuickNotesWidget ctx={ctx} storageScopeKey="test-quick-notes" />);

    const textarea = screen.getByRole('textbox', { name: 'Hızlı Notlar' });
    expect(textarea).toHaveValue('');

    await user.type(textarea, 'Sprint planlama notları');
    expect(textarea).toHaveValue('Sprint planlama notları');

    const clearBtn = screen.getByRole('button', { name: 'Notu Temizle' });
    await user.click(clearBtn);
    expect(textarea).toHaveValue('');
  });

  it('ClockCalendarWidget: marks today with aria-current="date", updates aria-pressed on day selection, and exposes accessible Add Event button', async () => {
    const user = userEvent.setup();
    const ctx = createMockWidgetContext({ width: 380, height: 220 });

    render(
      <ClockCalendarWidget ctx={ctx} storageScopeKey="test-clock-calendar" />
    );

    const addEventBtn = screen.getByRole('button', { name: 'Etkinlik Ekle' });
    expect(addEventBtn).toBeInTheDocument();

    const todayDayNum = String(new Date().getDate());
    const todayBtn = screen.getByRole('button', { name: todayDayNum });
    expect(todayBtn).toHaveAttribute('aria-current', 'date');
    expect(todayBtn).toHaveAttribute('aria-pressed', 'true');

    const targetDayNum = todayDayNum === '1' ? '2' : '1';
    const otherDayBtn = screen.getByRole('button', { name: targetDayNum });
    expect(otherDayBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(otherDayBtn);
    expect(otherDayBtn).toHaveAttribute('aria-pressed', 'true');
    expect(todayBtn).toHaveAttribute('aria-pressed', 'false');
    expect(todayBtn).toHaveAttribute('aria-current', 'date');
  });

  it('DailyTimelineWidget: toggles aria-expanded on Add Slot button and appends a new slot via accessible form controls', async () => {
    const user = userEvent.setup();
    const ctx = createMockWidgetContext();

    render(
      <DailyTimelineWidget ctx={ctx} storageScopeKey="test-daily-timeline" />
    );

    const addSlotBtn = screen.getByRole('button', { name: 'Dilim Ekle' });
    expect(addSlotBtn).toHaveAttribute('aria-expanded', 'false');

    await user.click(addSlotBtn);
    expect(addSlotBtn).toHaveAttribute('aria-expanded', 'true');

    const titleInput = screen.getByRole('textbox', { name: 'Dilim Başlığı' });
    const startInput = screen.getByLabelText('Başlangıç Saati');
    const endInput = screen.getByLabelText('Bitiş Saati');
    const saveBtn = screen.getByRole('button', { name: 'Dilimi Kaydet' });

    await user.type(titleInput, 'Mimari Kod İncelemesi');
    fireEvent.change(startInput, { target: { value: '18:30' } });
    fireEvent.change(endInput, { target: { value: '19:30' } });
    await user.click(saveBtn);

    expect(addSlotBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Mimari Kod İncelemesi')).toBeInTheDocument();
    expect(screen.getByText('18:30')).toBeInTheDocument();
  });

  it('WidgetCustomizePopover: renders modal dialog, updates aria-pressed for size/surface/accent selections, and closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onResizeSpy = vi.fn();
    const onUpdatePrefsSpy = vi.fn();

    const mockWidgetDef: OSDesktopWidgetDefinition = {
      id: 'focus-timer',
      labelTr: 'Odak Sayacı',
      labelEn: 'Focus Timer',
      defaultSize: { width: 280, height: 120 },
      sizePresets: FOCUS_TIMER_SIZE_PRESETS,
      customFields: FOCUS_TIMER_CUSTOM_FIELDS,
      render: () => null,
    };

    function StatefulPopoverHarness() {
      const [size, setSize] = useState<WidgetSize>({ width: 280, height: 120 });
      const [prefs, setPrefs] = useState<WidgetUserPrefs>({
        surfaceStyle: 'glass',
      });

      return (
        <WidgetCustomizePopover
          target={{ x: 120, y: 120 }}
          widget={mockWidgetDef}
          currentSize={size}
          prefs={prefs}
          isDark={false}
          primaryColor="#2563eb"
          locale="tr"
          onResize={(nextSize) => {
            onResizeSpy(nextSize);
            setSize(nextSize);
          }}
          onUpdatePrefs={(patch) => {
            onUpdatePrefsSpy(patch);
            setPrefs((prev) => ({ ...prev, ...patch }));
          }}
          onHideWidget={vi.fn()}
          onResetWidget={vi.fn()}
          onClose={onClose}
        />
      );
    }

    render(<StatefulPopoverHarness />);

    const dialog = screen.getByRole('dialog', {
      name: 'Odak Sayacı Özelleştirme',
    });
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Size presets
    const smallBtn = screen.getByRole('button', { name: 'Kompakt' });
    const mediumBtn = screen.getByRole('button', { name: 'Orta' });
    expect(smallBtn).toHaveAttribute('aria-pressed', 'true');
    expect(mediumBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(mediumBtn);
    expect(onResizeSpy).toHaveBeenCalledWith({ width: 360, height: 190 });
    expect(mediumBtn).toHaveAttribute('aria-pressed', 'true');
    expect(smallBtn).toHaveAttribute('aria-pressed', 'false');

    // Surface style buttons
    const glassBtn = screen.getByRole('button', { name: 'Cam' });
    const solidBtn = screen.getByRole('button', { name: 'Opak' });
    expect(glassBtn).toHaveAttribute('aria-pressed', 'true');
    expect(solidBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(solidBtn);
    expect(onUpdatePrefsSpy).toHaveBeenCalledWith({ surfaceStyle: 'solid' });
    expect(solidBtn).toHaveAttribute('aria-pressed', 'true');
    expect(glassBtn).toHaveAttribute('aria-pressed', 'false');

    // Accent color swatches
    const autoSwatch = screen.getByRole('button', { name: 'Tema Rengi' });
    const emeraldSwatch = screen.getByRole('button', { name: 'Zümrüt' });
    expect(autoSwatch).toHaveAttribute('aria-pressed', 'true');
    expect(emeraldSwatch).toHaveAttribute('aria-pressed', 'false');

    await user.click(emeraldSwatch);
    expect(onUpdatePrefsSpy).toHaveBeenCalledWith({ accentHex: '#10b981' });
    expect(emeraldSwatch).toHaveAttribute('aria-pressed', 'true');
    expect(autoSwatch).toHaveAttribute('aria-pressed', 'false');

    // Pressing Escape invokes onClose
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
