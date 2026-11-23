import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../../primitives/Button/Button';
import { Input } from '../../primitives/Input/Input';
import { Textarea } from '../../primitives/Textarea/Textarea';
import { Modal } from '../Modal/Modal';
import type { KanbanColumn, KanbanPriority, KanbanTagTone, KanbanTask } from './types';

/**
 * Props contract for {@link KanbanTaskModal}.
 */
export interface KanbanTaskModalProps {
  open: boolean;
  locale: 'tr' | 'en';
  columns: KanbanColumn[];
  initialDraft: Partial<KanbanTask>;
  editingTaskId: string | null;
  onClose: () => void;
  onSave: (payload: Omit<KanbanTask, 'id'>, editingId?: string | null) => void;
  onDelete?: (id: string) => void;
}

/**
 * Modal dialog for creating, editing, and deleting a {@link KanbanTask}.
 *
 * @param props - {@link KanbanTaskModalProps} configuration options.
 * @returns Rendered task editor modal dialog.
 */
export const KanbanTaskModal: React.FC<KanbanTaskModalProps> = ({
  open,
  locale,
  columns,
  initialDraft,
  editingTaskId,
  onClose,
  onSave,
  onDelete,
}) => {
  const isTR = locale === 'tr';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Feature');
  const [tagTone, setTagTone] = useState<KanbanTagTone>('primary');
  const [priority, setPriority] = useState<KanbanPriority>('medium');
  const [assignee, setAssignee] = useState('Ümit Uz');
  const [column, setColumn] = useState<string>(columns[0]?.id ?? 'backlog');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) return;
    setTitle(initialDraft.title ?? '');
    setDescription(initialDraft.description ?? '');
    setTag(initialDraft.tag ?? 'Feature');
    setTagTone(initialDraft.tagTone ?? 'primary');
    setPriority(initialDraft.priority ?? 'medium');
    setAssignee(initialDraft.assignee ?? 'Ümit Uz');
    setColumn(initialDraft.column ?? columns[0]?.id ?? 'backlog');
    setDueDate(initialDraft.dueDate ?? (isTR ? 'Bu Hafta' : 'This Week'));
    setProgress(initialDraft.progress ?? 0);
  }, [open, initialDraft, columns, isTR]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        tag: tag.trim() || 'Feature',
        tagTone,
        priority,
        assignee: assignee.trim() || 'Unassigned',
        column,
        dueDate: dueDate.trim() || (isTR ? 'Belirsiz' : 'TBD'),
        progress: Math.max(0, Math.min(100, Number(progress) || 0)),
      },
      editingTaskId
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        editingTaskId
          ? `${isTR ? 'Görevi Düzenle' : 'Edit Task'} (${editingTaskId})`
          : isTR
            ? 'Yeni Kanban Görevi'
            : 'New Kanban Task'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input
          label={isTR ? 'Görev Başlığı' : 'Task Title'}
          placeholder={isTR ? 'Örn: API Gateway önbellek katmanı' : 'e.g., API Gateway cache layer'}
          value={title}
          onChange={setTitle}
          required
        />

        <Textarea
          label={isTR ? 'Açıklama' : 'Description'}
          placeholder={isTR ? 'Kısa teknik detaylar...' : 'Brief technical details...'}
          value={description}
          onChange={setDescription}
          rows={2}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.76rem', fontWeight: 600 }}>
            <span>{isTR ? 'Sütun' : 'Column'}</span>
            <select
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              style={{
                height: 36,
                padding: '0 10px',
                borderRadius: 'var(--uxu-radius-sm)',
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-surface-tonal)',
                color: 'var(--uxu-text-primary)',
                fontSize: '0.82rem',
              }}
            >
              {columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {isTR && c.titleTr ? c.titleTr : c.title}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.76rem', fontWeight: 600 }}>
            <span>{isTR ? 'Öncelik' : 'Priority'}</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as KanbanPriority)}
              style={{
                height: 36,
                padding: '0 10px',
                borderRadius: 'var(--uxu-radius-sm)',
                border: '1px solid var(--uxu-border-subtle)',
                background: 'var(--uxu-surface-tonal)',
                color: 'var(--uxu-text-primary)',
                fontSize: '0.82rem',
              }}
            >
              <option value="high">{isTR ? 'Yüksek' : 'High'}</option>
              <option value="medium">{isTR ? 'Orta' : 'Medium'}</option>
              <option value="low">{isTR ? 'Düşük' : 'Low'}</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input
            label={isTR ? 'Etiket' : 'Tag'}
            value={tag}
            onChange={setTag}
          />
          <Input
            label={isTR ? 'Sorumlu' : 'Assignee'}
            value={assignee}
            onChange={setAssignee}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Input
            label={isTR ? 'Termin' : 'Due Date'}
            value={dueDate}
            onChange={setDueDate}
          />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.76rem', fontWeight: 600 }}>
            <span>{isTR ? `İlerleme (${progress}%)` : `Progress (${progress}%)`}</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{ marginTop: 8 }}
            />
          </label>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTop: '1px solid var(--uxu-border-subtle)',
          }}
        >
          <div>
            {editingTaskId && onDelete && (
              <Button
                type="button"
                variant="tonal"
                size="sm"
                leadingIcon={<Trash2 size={14} />}
                style={{ color: 'var(--uxu-danger)' }}
                onClick={() => {
                  onDelete(editingTaskId);
                  onClose();
                }}
              >
                {isTR ? 'Sil' : 'Delete'}
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {isTR ? 'İptal' : 'Cancel'}
            </Button>
            <Button type="submit" variant="filled" size="sm">
              {editingTaskId ? (isTR ? 'Güncelle' : 'Update') : isTR ? 'Oluştur' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
