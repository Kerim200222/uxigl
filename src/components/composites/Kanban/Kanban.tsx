import React, { useCallback, useMemo, useState } from 'react';
import { Columns3, List, Plus, Search } from 'lucide-react';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { Badge } from '../../primitives/Badge/Badge';
import { Button } from '../../primitives/Button/Button';
import { Input } from '../../primitives/Input/Input';
import { Progress } from '../../primitives/Progress/Progress';
import { Card } from '../Card/Card';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { KanbanColumnView } from './KanbanColumnView';
import { KanbanTaskModal } from './KanbanTaskModal';
import {
  buildSeedKanbanTasks,
  computeKanbanStats,
  DEFAULT_KANBAN_COLUMNS,
  filterKanbanTasks,
  KANBAN_PRIORITY_META,
} from './kanbanUtils';
import type {
  KanbanPriority,
  KanbanProps,
  KanbanTask,
  KanbanViewMode,
} from './types';

/**
 * ============================================================================
 * uxiGL COMPOSITE — MODULAR KANBAN & SPRINT BOARD
 * ============================================================================
 * SOLID Architecture:
 * - kanbanUtils: pure filtering, stats & seed builders
 * - KanbanCard: single task card presentation & quick-move controls
 * - KanbanColumnView: column drop target, WIP limits & empty state
 * - KanbanTaskModal: task creation, editing & deletion dialog
 * - Kanban: state orchestration, controlled/uncontrolled sync & storageKey
 */
export const Kanban: React.FC<KanbanProps> = ({
  tasks: controlledTasks,
  onTasksChange,
  initialTasks,
  columns = DEFAULT_KANBAN_COLUMNS,
  locale = 'tr',
  defaultView = 'board',
  showStats = true,
  enableDragDrop = true,
  storageKey,
  onTaskClick,
  className = '',
  style,
}) => {
  const isTR = locale === 'tr';

  const [internalTasks, setInternalTasks] = useState<KanbanTask[]>(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore malformed storage
      }
    }
    return initialTasks ?? buildSeedKanbanTasks(locale);
  });

  const tasks = controlledTasks ?? internalTasks;

  const commitTasks = useCallback(
    (updater: (prev: KanbanTask[]) => KanbanTask[]) => {
      if (controlledTasks !== undefined) {
        onTasksChange?.(updater(controlledTasks));
        return;
      }
      setInternalTasks((prev) => {
        const next = updater(prev);
        if (storageKey && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {
            // ignore storage quota errors
          }
        }
        onTasksChange?.(next);
        return next;
      });
    },
    [controlledTasks, onTasksChange, storageKey]
  );

  const [viewMode, setViewMode] = useState<KanbanViewMode>(defaultView);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<KanbanPriority | 'all'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draftTask, setDraftTask] = useState<Partial<KanbanTask>>({});

  const filteredTasks = useMemo(
    () => filterKanbanTasks(tasks, searchQuery, priorityFilter),
    [tasks, searchQuery, priorityFilter]
  );

  const stats = useMemo(() => computeKanbanStats(tasks), [tasks]);

  const progressForColumn = (colId: string, currentProgress: number) => {
    if (colId === 'done') return 100;
    if (colId === 'review') return Math.max(currentProgress, 80);
    if (colId === 'progress') return Math.max(currentProgress, 40);
    return currentProgress;
  };

  const handleMoveTask = (taskId: string, direction: 'prev' | 'next') => {
    const order = columns.map((c) => c.id);
    commitTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = order.indexOf(t.column);
        if (idx === -1) return t;
        const nextIdx =
          direction === 'next'
            ? Math.min(order.length - 1, idx + 1)
            : Math.max(0, idx - 1);
        const nextCol = order[nextIdx];
        return {
          ...t,
          column: nextCol,
          progress: progressForColumn(nextCol, t.progress),
        };
      })
    );
  };

  const handleDropTask = (taskId: string, targetColumnId: string) => {
    commitTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              column: targetColumnId,
              progress: progressForColumn(targetColumnId, t.progress),
            }
          : t
      )
    );
  };

  const handleOpenCreateModal = (columnId = columns[0]?.id ?? 'backlog') => {
    setEditingTaskId(null);
    setDraftTask({ column: columnId, priority: 'medium', progress: 0 });
    setModalOpen(true);
  };

  const handleOpenEditModal = (task: KanbanTask) => {
    onTaskClick?.(task);
    setEditingTaskId(task.id);
    setDraftTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (
    payload: Omit<KanbanTask, 'id'>,
    editingId?: string | null
  ) => {
    if (editingId) {
      commitTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...payload, id: editingId } : t))
      );
    } else {
      const nextNum = 120 + tasks.length + Math.floor(Math.random() * 50);
      commitTasks((prev) => [{ ...payload, id: `UXI-${nextNum}` }, ...prev]);
    }
  };

  const handleDeleteTask = (id: string) => {
    commitTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className={`uxu-kanban-module ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        width: '100%',
        ...style,
      }}
    >
      {/* Top Sprint KPI Strip */}
      {showStats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
          }}
        >
          {[
            { label: isTR ? 'Toplam Görev' : 'Total Tasks', value: stats.total, tone: 'primary' as const },
            { label: isTR ? 'Geliştiriliyor' : 'In Progress', value: stats.inProgress, tone: 'info' as const },
            { label: isTR ? 'İncelemede' : 'In Review', value: stats.review, tone: 'warning' as const },
            { label: isTR ? 'Tamamlanma' : 'Completion', value: `%${stats.completionPct}`, tone: 'success' as const },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--uxu-radius-md)',
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-surface-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--uxu-text-secondary)', fontWeight: 600 }}>
                {item.label}
              </span>
              <Badge tone={item.tone} variant="tonal" size="sm">
                {item.value}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <Card variant="glass" padding="md">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
            <Input
              aria-label={isTR ? 'Görev, kod veya sorumlu ara...' : 'Search task, ID or assignee...'}
              placeholder={isTR ? 'Görev, kod veya sorumlu ara...' : 'Search task, ID or assignee...'}
              value={searchQuery}
              onChange={setSearchQuery}
              leadingIcon={<Search size={15} />}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <SegmentedControl<KanbanPriority | 'all'>
              size="sm"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { value: 'all', label: isTR ? 'Tümü' : 'All' },
                { value: 'high', label: isTR ? 'Yüksek' : 'High' },
                { value: 'medium', label: isTR ? 'Orta' : 'Medium' },
                { value: 'low', label: isTR ? 'Düşük' : 'Low' },
              ]}
            />

            <SegmentedControl<KanbanViewMode>
              size="sm"
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: 'board', label: isTR ? 'Pano' : 'Board', icon: <Columns3 size={13} /> },
                { value: 'list', label: isTR ? 'Liste' : 'List', icon: <List size={13} /> },
              ]}
            />

            <Button
              type="button"
              variant="filled"
              size="sm"
              leadingIcon={<Plus size={15} />}
              onClick={() => handleOpenCreateModal()}
            >
              {isTR ? 'Yeni Görev' : 'New Task'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Active View */}
      {viewMode === 'board' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 14,
            alignItems: 'start',
          }}
        >
          {columns.map((col, idx) => (
            <KanbanColumnView
              key={col.id}
              column={col}
              columnIndex={idx}
              totalColumns={columns.length}
              tasks={filteredTasks.filter((t) => t.column === col.id)}
              locale={locale}
              enableDragDrop={enableDragDrop}
              onMoveTask={handleMoveTask}
              onDropTask={handleDropTask}
              onTaskClick={handleOpenEditModal}
              onQuickAdd={handleOpenCreateModal}
            />
          ))}
        </div>
      ) : (
        <Card variant="glass" padding="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredTasks.map((task) => {
              const col = columns.find((c) => c.id === task.column);
              const priorityMeta = KANBAN_PRIORITY_META[task.priority];
              return (
                <div
                  key={task.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenEditModal(task)}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenEditModal(task);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 'var(--uxu-radius-md)',
                    background: 'var(--uxu-surface-tonal)',
                    border: '1px solid var(--uxu-border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220, flex: 1 }}>
                    <span style={{ fontFamily: 'var(--uxu-font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--uxu-text-secondary)' }}>
                      {task.id}
                    </span>
                    <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{task.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Badge tone={col?.tone ?? 'neutral'} size="xs">
                      {col ? (isTR && col.titleTr ? col.titleTr : col.title) : task.column}
                    </Badge>
                    <Badge tone={priorityMeta.tone} variant="tonal" size="xs">
                      {isTR ? priorityMeta.labelTr : priorityMeta.labelEn}
                    </Badge>
                    <div style={{ width: 80 }}>
                      <Progress value={task.progress} tone={task.progress >= 100 ? 'success' : 'primary'} />
                    </div>
                    <Avatar name={task.assignee} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <KanbanTaskModal
        open={modalOpen}
        locale={locale}
        columns={columns}
        initialDraft={draftTask}
        editingTaskId={editingTaskId}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
};
