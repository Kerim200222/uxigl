// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import {
  Kanban,
  buildSeedKanbanTasks,
  filterKanbanTasks,
  computeKanbanStats,
} from '../../src/components/composites/Kanban';

describe('Kanban Composite & kanbanUtils', () => {
  afterEach(() => {
    cleanup();
  });

  it('builds seed tasks, filters by query and priority, and computes sprint completion stats accurately', () => {
    const tasksTr = buildSeedKanbanTasks('tr');
    const tasksEn = buildSeedKanbanTasks('en');

    expect(tasksTr).toHaveLength(6);
    expect(tasksEn).toHaveLength(6);
    expect(tasksEn[0].title).toContain('8pt Spatial Grid');

    const highOnly = filterKanbanTasks(tasksEn, '', 'high');
    expect(highOnly).toHaveLength(3);

    const sheetMatch = filterKanbanTasks(tasksEn, 'sheetgl', 'all');
    expect(sheetMatch).toHaveLength(1);
    expect(sheetMatch[0].id).toBe('UXI-108');

    const stats = computeKanbanStats(tasksEn);
    expect(stats).toEqual({
      total: 6,
      done: 1,
      inProgress: 2,
      review: 1,
      completionPct: 17,
    });
  });

  it('filters tasks via accessible search input and supports keyboard Enter activation on List View rows', async () => {
    const user = userEvent.setup();
    render(<Kanban locale="en" />);

    const searchInput = screen.getByRole('textbox', {
      name: 'Search task, ID or assignee...',
    });

    await user.type(searchInput, 'Passkey');
    expect(
      screen.getByText(/Passkey \(WebAuthn\) & Biometric Login Flow Integration/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/SheetGL 1M Row Virtualization/i)
    ).not.toBeInTheDocument();

    // Switch to List View
    await user.click(screen.getByRole('tab', { name: /List/i }));

    // Activate list row via keyboard Enter -> opens edit modal
    const listRow = screen
      .getByText(/Passkey \(WebAuthn\) & Biometric Login Flow Integration/i)
      .closest('[role="button"]') as HTMLElement;
    expect(listRow).not.toBeNull();
    listRow.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Edit Task \(UXI-104\)/i })
    ).toBeInTheDocument();
  });

  it('moves a card via keyboard Enter on the nested Move button without opening the task edit modal', async () => {
    const user = userEvent.setup();
    const onTasksChange = vi.fn();

    render(<Kanban locale="en" onTasksChange={onTasksChange} />);

    // Find a 'Move to Next Column' button inside a card and activate via keyboard Enter
    const moveNextButtons = screen.getAllByRole('button', {
      name: 'Move to Next Column',
    });
    expect(moveNextButtons.length).toBeGreaterThan(0);

    moveNextButtons[0].focus();
    await user.keyboard('{Enter}');

    // Task move callback fired, AND no edit modal dialog opened from event bubbling
    expect(onTasksChange).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('creates a new task through the New Task modal dialog and adds it to the board', async () => {
    const user = userEvent.setup();
    const onTasksChange = vi.fn();

    render(<Kanban locale="en" onTasksChange={onTasksChange} />);

    await user.click(screen.getByRole('button', { name: /New Task/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(
      /e\.g\., API Gateway cache layer/i
    );
    await user.type(titleInput, 'Zero-Copy WebGPU Tensor Pipeline');

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(
      screen.getByText('Zero-Copy WebGPU Tensor Pipeline')
    ).toBeInTheDocument();
    expect(onTasksChange).toHaveBeenCalledTimes(1);
  });
});
