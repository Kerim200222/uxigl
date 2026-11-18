import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { useKeyboardShortcut } from '../../../hooks/useKeyboardShortcut';

/**
 * ============================================================================
 * uxiGL COMPOSITE — SPOTLIGHT COMMAND PALETTE (⌘K / Ctrl+K)
 * ============================================================================
 * Inspired by Apple macOS Spotlight & Raycast + Google Search Assist chips.
 */

/**
 * Action item descriptor for {@link CommandPalette}.
 */
export interface CommandActionItem {
  /** Unique identifier for the command action. */
  id: string;
  /** Primary display title of the command. */
  title: string;
  /** Optional secondary description or keyword subtitle. */
  subtitle?: string;
  /** Grouping category label shown on the right side of the row. */
  category: string;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional keyboard shortcut badge string (e.g. `'G A'`, `'⌘K'`). */
  shortcut?: string;
  /** Callback executed when the command is triggered via click or `Enter`. */
  onSelect: () => void;
}

/** Backwards-compatible alias for CommandActionItem */
export type CommandPaletteAction = CommandActionItem;

/**
 * Props contract for {@link CommandPalette}.
 */
export interface CommandPaletteProps {
  /** Controls whether the command palette dialog is mounted and visible. */
  open: boolean;
  /** Callback fired when the user dismisses the palette via backdrop, `Escape`, or command selection. */
  onClose: () => void;
  /** List of searchable and executable command action items. */
  actions: CommandActionItem[];
  /** Search input placeholder and accessible label. */
  placeholder?: string;
}

const CLEAR_BUTTON_STYLE: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--uxu-text-tertiary, #94a3b8)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  marginRight: '6px',
  borderRadius: '50%',
  transition: 'all 0.15s ease',
};

/**
 * macOS Spotlight & Raycast-inspired global `<CommandPalette />` (`⌘K` / `Ctrl+K`)
 * with instant search filtering, WAI-ARIA `dialog` / `listbox` / `option` semantics,
 * and keyboard navigation (`ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`, `Escape`).
 *
 * @param props - {@link CommandPaletteProps} configuration options.
 * @returns Rendered modal command palette or `null` when closed.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   actions={[
 *     {
 *       id: 'nav-overview',
 *       title: 'Go to Dashboard Overview',
 *       category: 'Navigation',
 *       shortcut: 'G D',
 *       onSelect: () => navigate('/dashboard/overview'),
 *     },
 *   ]}
 * />
 * ```
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  actions,
  placeholder = 'Bileşen, tema, sayfa veya komut ara...',
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mouseDownOnBackdropRef = useRef(false);

  const handleClose = () => {
    setQuery('');
    setSelectedIndex(0);
    onClose();
  };

  useKeyboardShortcut('Escape', handleClose, { enabled: open });

  // Whenever the palette opens, clear query, reset index, and auto-focus
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const item = listRef.current.children[selectedIndex] as
      | HTMLElement
      | undefined;
    item?.scrollIntoView?.({ block: 'nearest' });
  }, [open, selectedIndex]);

  if (!open) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredActions.length > 0 ? (prev + 1) % filteredActions.length : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredActions.length > 0
          ? (prev - 1 + filteredActions.length) % filteredActions.length
          : 0
      );
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSelectedIndex(Math.max(0, filteredActions.length - 1));
    } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
      e.preventDefault();
      filteredActions[selectedIndex].onSelect();
      handleClose();
    }
  };

  const content = (
    <div
      className="uxu-modal-backdrop uxu-cmd-backdrop"
      style={{ zIndex: 9999 }}
      onMouseDown={(e) => {
        mouseDownOnBackdropRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (mouseDownOnBackdropRef.current && e.target === e.currentTarget) {
          handleClose();
        }
        mouseDownOnBackdropRef.current = false;
      }}
      role="presentation"
    >
      <div
        className="uxu-cmd-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Komut Paleti"
        onMouseDown={() => {
          mouseDownOnBackdropRef.current = false;
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="uxu-cmd-palette__search">
          <Search size={19} className="uxu-cmd-palette__search-icon" />
          <input
            ref={inputRef}
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder={placeholder}
            aria-label={placeholder}
            className="uxu-cmd-palette__input"
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              className="uxu-cmd-palette__clear"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              title="Aramayı Temizle"
              aria-label="Aramayı Temizle"
              style={CLEAR_BUTTON_STYLE}
            >
              <X size={15} />
            </button>
          )}
          <kbd className="uxu-cmd-palette__esc" onClick={handleClose}>
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          className="uxu-cmd-palette__list"
          role="listbox"
          aria-label="Komut listesi"
        >
          {filteredActions.length === 0 ? (
            <div className="uxu-cmd-palette__empty">
              <Sparkles size={22} />
              <p>&ldquo;{query}&rdquo; ile eşleşen bir komut bulunamadı.</p>
            </div>
          ) : (
            filteredActions.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    item.onSelect();
                    handleClose();
                  }}
                  className={`uxu-cmd-palette__item ${
                    isSelected ? 'uxu-cmd-palette__item--selected' : ''
                  }`.trim()}
                >
                  <div className="uxu-cmd-palette__item-left">
                    {item.icon && (
                      <span className="uxu-cmd-palette__item-icon">
                        {item.icon}
                      </span>
                    )}
                    <div>
                      <div className="uxu-cmd-palette__item-title">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="uxu-cmd-palette__item-sub">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="uxu-cmd-palette__item-right">
                    <span className="uxu-cmd-palette__category">
                      {item.category}
                    </span>
                    {item.shortcut ? (
                      <kbd className="uxu-cmd-palette__kbd">
                        {item.shortcut}
                      </kbd>
                    ) : (
                      <CornerDownLeft
                        size={14}
                        className="uxu-cmd-palette__enter-icon"
                      />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="uxu-cmd-palette__footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> Gezin
          </span>
          <span>
            <kbd>↵</kbd> Çalıştır
          </span>
          <span>
            <kbd>ESC</kbd> Kapat
          </span>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
};
