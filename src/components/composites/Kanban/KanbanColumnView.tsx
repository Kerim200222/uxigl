import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Badge } from '../../primitives/Badge/Badge';
import { Card } from '../Card/Card';
import { KanbanCard } from './KanbanCard';
import type { KanbanColumn, KanbanTask } from './types';

/**
 * Props contract for {@link KanbanColumnView}.
 */
export interface KanbanColumnViewProps {
  column: KanbanColumn;
  columnIndex: number;
  totalColumns: number;
  tasks: KanbanTask[];
  locale: 'tr' | 'en';
  enableDragDrop: boolean;
  onMoveTask: (taskId: string, direction: 'prev' | 'next') => void;
  onDropTask: (taskId: string, targetColumnId: string) => void;
  onTaskClick: (task: KanbanTask) => void;
  onQuickAdd: (columnId: string) => void;
}

/**
 * Single Kanban board column with HTML5 drop target handling, WIP limit warning
 * badge, quick-add trigger, and task card list.
 *
 * @param props - {@link KanbanColumnViewProps} configuration options.
 * @returns Rendered Kanban board column.
 */
export const KanbanColumnView: React.FC<KanbanColumnViewProps> = ({
  column,
  columnIndex,
  totalColumns,
  tasks,
  locale,
  enableDragDrop,
  onMoveTask,
  onDropTask,
  onTaskClick,
  onQuickAdd,
}) => {
  const isTR = locale === 'tr';
  const [isDragOver, setIsDragOver] = useState(false);
  const wipExceeded =
    typeof column.wipLimit === 'number' && tasks.length > column.wipLimit;

  return (
    <Card
      variant="glass"
      padding="md"
      style={{
        borderColor: isDragOver
          ? 'var(--uxu-primary)'
          : wipExceeded
            ? 'var(--uxu-danger)'
            : undefined,
        transition: 'border-color 150ms ease',
      }}
    >
      <div
        onDragOver={(e) => {
          if (!enableDragDrop) return;
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          if (!enableDragDrop) return;
          e.preventDefault();
          setIsDragOver(false);
          const taskId = e.dataTransfer.getData('text/plain');
          if (taskId) onDropTask(taskId, column.id);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 160 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 8,
            borderBottom: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <strong style={{ fontSize: '0.86rem' }}>
              {isTR && column.titleTr ? column.titleTr : column.title}
            </strong>
            <Badge tone={wipExceeded ? 'danger' : column.tone} size="xs">
              {column.wipLimit ? `${tasks.length}/${column.wipLimit}` : tasks.length}
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => onQuickAdd(column.id)}
            title={isTR ? 'Bu sütuna görev ekle' : 'Add task to column'}
            aria-label={isTR ? 'Bu sütuna görev ekle' : 'Add task to column'}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: '1px solid var(--uxu-border-subtle)',
              background: 'var(--uxu-bg-elevated)',
              color: 'var(--uxu-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
          </button>
        </div>

        {tasks.length === 0 ? (
          <div
            style={{
              padding: '22px 12px',
              borderRadius: 'var(--uxu-radius-md)',
              border: '1px dashed var(--uxu-border-subtle)',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: 'var(--uxu-text-muted)',
            }}
          >
            {isTR ? 'Görev yok — sürükleyip bırakın' : 'No tasks — drag & drop here'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                locale={locale}
                canMovePrev={columnIndex > 0}
                canMoveNext={columnIndex < totalColumns - 1}
                enableDragDrop={enableDragDrop}
                onMove={onMoveTask}
                onClick={onTaskClick}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
