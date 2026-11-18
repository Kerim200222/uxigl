// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import {
  CommandPalette,
  type CommandActionItem,
} from '../../src/components/composites/CommandPalette/CommandPalette';

describe('CommandPalette', () => {
  afterEach(() => {
    cleanup();
  });

  const createActions = () => {
    const onSelectDashboard = vi.fn();
    const onSelectTelemetry = vi.fn();
    const onSelectTheme = vi.fn();

    const actions: CommandActionItem[] = [
      {
        id: 'cmd-dashboard',
        title: 'Dashboard Genel Bakış',
        subtitle: 'Komuta merkezi ve KPI kartları',
        category: 'Dashboard',
        shortcut: 'G D',
        onSelect: onSelectDashboard,
      },
      {
        id: 'cmd-telemetry',
        title: 'Analytics & Financial Telemetry',
        subtitle: 'SheetGL multi-scenario finans ve bulut telemetri',
        category: 'Dashboard',
        shortcut: 'G A',
        onSelect: onSelectTelemetry,
      },
      {
        id: 'cmd-theme',
        title: 'Dark Mode Değiştir',
        subtitle: 'Liquid Glass gece moduna geç',
        category: 'Appearance',
        onSelect: onSelectTheme,
      },
    ];

    return {
      actions,
      onSelectDashboard,
      onSelectTelemetry,
      onSelectTheme,
    };
  };

  it('renders nothing when open is false and renders dialog, listbox, and options when open is true', () => {
    const { actions } = createActions();
    const { rerender } = render(
      <CommandPalette open={false} onClose={() => {}} actions={actions} />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <CommandPalette open={true} onClose={() => {}} actions={actions} />
    );

    expect(
      screen.getByRole('dialog', { name: 'Komut Paleti' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('listbox', { name: 'Komut listesi' })
    ).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('filters commands by title, subtitle, and category, shows empty state, and clears query via clear button', async () => {
    const user = userEvent.setup();
    const { actions } = createActions();

    render(
      <CommandPalette
        open={true}
        onClose={() => {}}
        actions={actions}
        placeholder="Komut ara..."
      />
    );

    const searchInput = screen.getByRole('textbox', { name: 'Komut ara...' });

    // Filter by subtitle keyword ('sheetgl')
    await user.type(searchInput, 'sheetgl');
    let options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Analytics & Financial Telemetry');

    // Clear button resets query and restores all options
    const clearBtn = screen.getByRole('button', { name: 'Aramayı Temizle' });
    await user.click(clearBtn);
    expect(searchInput).toHaveValue('');
    expect(screen.getAllByRole('option')).toHaveLength(3);

    // Non-matching query displays empty state
    await user.type(searchInput, 'nonexistent-xyz');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(
      screen.getByText(/ile eşleşen bir komut bulunamadı/i)
    ).toBeInTheDocument();
  });

  it('navigates options with ArrowDown/ArrowUp, executes selected action on Enter, and closes on Escape or backdrop click', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { actions, onSelectTelemetry } = createActions();

    const { container } = render(
      <CommandPalette
        open={true}
        onClose={onClose}
        actions={actions}
        placeholder="Komut ara..."
      />
    );

    const searchInput = screen.getByRole('textbox', { name: 'Komut ara...' });
    searchInput.focus();

    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // ArrowDown moves selection to second item ('Analytics & Financial Telemetry')
    await user.keyboard('{ArrowDown}');
    expect(options[0]).toHaveAttribute('aria-selected', 'false');
    expect(options[1]).toHaveAttribute('aria-selected', 'true');

    // ArrowUp moves selection back to first item, then wraps to last item
    await user.keyboard('{ArrowUp}');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowUp}');
    expect(options[2]).toHaveAttribute('aria-selected', 'true');

    // Move to second item and press Enter -> invokes onSelectTelemetry and onClose
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelectTelemetry).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Pressing Escape invokes onClose
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);

    // Clicking backdrop invokes onClose
    const backdrop = container.querySelector('.uxu-cmd-backdrop');
    expect(backdrop).not.toBeNull();
    await user.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
