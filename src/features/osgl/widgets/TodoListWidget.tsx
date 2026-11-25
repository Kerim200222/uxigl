import React, { useState } from 'react';
import { Check, CheckSquare, Plus, X } from 'lucide-react';
import {
  loadOSGLWidgetData,
  saveOSGLWidgetData,
  type WidgetCustomField,
  type WidgetRenderContext,
  type WidgetSizePreset,
} from '..';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

const STORAGE_KEY = 'todo_list_items';

const DEFAULT_TODOS: TodoItem[] = [
  { id: 't1', text: 'Tema renklerini kontrol et', done: true },
  { id: 't2', text: 'Çalışma alanı widgetlarını düzenle', done: false },
  { id: 't3', text: 'Günlük hedefleri gözden geçir', done: false },
];

export const TODO_LIST_SIZE_PRESETS: ReadonlyArray<WidgetSizePreset> = [
  { id: 'small', label: 'Kompakt', size: { width: 260, height: 170 } },
  { id: 'medium', label: 'Orta', size: { width: 300, height: 220 } },
  { id: 'large', label: 'Geniş Liste', size: { width: 380, height: 320 } },
];

export const TODO_LIST_CUSTOM_FIELDS: ReadonlyArray<WidgetCustomField> = [
  {
    key: 'hideCompleted',
    label: 'Tamamlananlar',
    defaultValue: 'show',
    options: [
      { value: 'show', label: 'Göster' },
      { value: 'hide', label: 'Gizle' },
    ],
  },
];

export function TodoListWidget({
  ctx,
  storageScopeKey = 'default',
}: {
  ctx: WidgetRenderContext;
  storageScopeKey?: string;
}) {
  const [todos, setTodos] = useState<TodoItem[]>(() =>
    loadOSGLWidgetData<TodoItem[]>(STORAGE_KEY, DEFAULT_TODOS, storageScopeKey)
  );
  const [draft, setDraft] = useState('');

  const updateTodos = (updater: (prev: TodoItem[]) => TodoItem[]) => {
    setTodos((prev) => {
      const next = updater(prev);
      saveOSGLWidgetData(STORAGE_KEY, next, storageScopeKey);
      return next;
    });
  };

  const addTodo = () => {
    const clean = draft.trim();
    if (!clean) return;
    updateTodos((prev) => [...prev, { id: `t-${Date.now()}`, text: clean, done: false }]);
    setDraft('');
  };

  const isTR = ctx.locale === 'tr';
  const hideCompleted = ctx.getOption?.('hideCompleted', 'show') === 'hide';
  const visibleTodos = hideCompleted ? todos.filter((t) => !t.done) : todos;
  const s = Math.max(0.88, Math.min(1.4, ctx.scale));

  return (
    <div
      data-widget-kind="todo-list"
      style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', height: '100%', minHeight: 0, overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: Math.round(12 * s), fontWeight: 700 }}>
          <CheckSquare size={Math.round(13 * s)} color={ctx.primaryColor} />
          <span>{isTR ? 'Yapılacaklar' : 'To-Do List'}</span>
        </span>
        <span style={{ fontSize: Math.round(10.5 * s), opacity: 0.65, fontWeight: 600 }}>
          {todos.filter((t) => t.done).length}/{todos.length}
        </span>
      </div>

      <div onPointerDown={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo();
          }}
          placeholder={isTR ? 'Yeni görev ekle...' : 'Add a task...'}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '5px 8px',
            borderRadius: 8,
            border: `1px solid ${ctx.subtleBorder}`,
            backgroundColor: ctx.subtleBg,
            color: 'inherit',
            fontSize: 11.5,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={addTodo}
          aria-label={isTR ? 'Ekle' : 'Add'}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            border: 'none',
            backgroundColor: ctx.primaryColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minHeight: 0, overflowY: 'auto' }}
      >
        {visibleTodos.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '4px 6px',
              borderRadius: 8,
              backgroundColor: ctx.subtleBg,
              fontSize: Math.round(11.5 * s),
            }}
          >
            <button
              type="button"
              onClick={() =>
                updateTodos((prev) => prev.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t)))
              }
              style={{
                width: 16,
                height: 16,
                borderRadius: 5,
                border: item.done ? 'none' : `1px solid ${ctx.subtleBorder}`,
                backgroundColor: item.done ? ctx.primaryColor : 'transparent',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
              }}
            >
              {item.done && <Check size={11} />}
            </button>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textDecoration: item.done ? 'line-through' : 'none',
                opacity: item.done ? 0.55 : 1,
              }}
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={() => updateTodos((prev) => prev.filter((t) => t.id !== item.id))}
              aria-label={isTR ? 'Sil' : 'Delete'}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'inherit',
                opacity: 0.55,
                cursor: 'pointer',
                padding: 2,
                display: 'flex',
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

