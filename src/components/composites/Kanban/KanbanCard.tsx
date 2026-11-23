import React from 'react';
import { ArrowLeft, ArrowRight, Calendar, CheckSquare, GripVertical } from 'lucide-react';
import { Avatar } from '../../primitives/Avatar/Avatar';
import { Badge } from '../../primitives/Badge/Badge';
import { Progress } from '../../primitives/Progress/Progress';
import { KANBAN_PRIORITY_META } from './kanbanUtils';
import type { KanbanTask } from './types';

/**
 * Props contract for {@link KanbanCard}.
 */
export interface KanbanCardProps {
  task: KanbanTask;
  locale: 'tr' | 'en';
  canMovePrev: boolean;
  canMoveNext: boolean;
  enableDragDrop: boolean;
  onMove: (taskId: string, direction: 'prev' | 'next') => void;
  onClick: (task: KanbanTask) => void;
}

/**
 * Draggable and keyboard-accessible Kanban task card with priority badges,
 * progress indicator, assignee avatar, and quick column move buttons.
 *
 * @param props - {@link KanbanCardProps} configuration options.
 * @returns Rendered Kanban task card.
 */
export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  locale,
  canMovePrev,
  canMoveNext,
  enableDragDrop,
  onMove,
  onClick,
}) => {
  const isTR = locale === 'tr';
  const priorityMeta = KANBAN_PRIORITY_META[task.priority];

  return (
    <div
      draggable={enableDragDrop}
      onDragStart={(e) => {
        if (!enableDragDrop) return;
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(task);
        }
      }}
      style={{
        padding: 12,
        borderRadius: 'var(--uxu-radius-md)',
        background: 'var(--uxu-surface-tonal)',
        border: '1px solid var(--uxu-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        cursor: enableDragDrop ? 'grab' : 'pointer',
        transition: 'transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {enableDragDrop && (
            <GripVertical size={13} color="var(--uxu-text-muted)" aria-hidden="true" />
          )}
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--uxu-font-mono)',
              color: 'var(--uxu-text-secondary)',
              fontWeight: 700,
            }}
          >
            {task.id}
          </span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Badge tone={priorityMeta.tone} variant="tonal" size="xs">
            {isTR ? priorityMeta.labelTr : priorityMeta.labelEn}
          </Badge>
          <Badge tone={task.tagTone} size="xs">
            {task.tag}
          </Badge>
        </div>
      </div>

      <div
        style={{
          fontSize: '0.83rem',
          fontWeight: 600,
          lineHeight: 1.38,
          color: 'var(--uxu-text-primary)',
        }}
      >
        {task.title}
      </div>

      {task.description && (
        <div
          style={{
            fontSize: '0.73rem',
            lineHeight: 1.4,
            color: 'var(--uxu-text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </div>
      )}

      <Progress
        value={task.progress}
        tone={task.progress >= 100 ? 'success' : 'primary'}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 4,
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Avatar name={task.assignee} size="sm" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.71rem', color: 'var(--uxu-text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={11} />
              {task.dueDate}
            </span>
            {typeof task.subtasksTotal === 'number' && task.subtasksTotal > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <CheckSquare size={11} />
                {task.subtasksDone ?? 0}/{task.subtasksTotal}
              </span>
            )}
          </div>
        </div>

        <div
          style={{ display: 'flex', gap: 4 }}
          onClick={(e) => e.stopPropagation()}
        >
          {canMovePrev && (
            <button
              type="button"
              onClick={() => onMove(task.id, 'prev')}
              title={isTR ? 'Önceki Sütuna Taşı' : 'Move to Previous Column'}
              aria-label={isTR ? 'Önceki Sütuna Taşı' : 'Move to Previous Column'}
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
              <ArrowLeft size={12} />
            </button>
          )}
          {canMoveNext && (
            <button
              type="button"
              onClick={() => onMove(task.id, 'next')}
              title={isTR ? 'Sonraki Sütuna Taşı' : 'Move to Next Column'}
              aria-label={isTR ? 'Sonraki Sütuna Taşı' : 'Move to Next Column'}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-bg-elevated)',
                color: 'var(--uxu-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
