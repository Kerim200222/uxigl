import React, { useRef } from 'react';
import type {
  IdentifiableProps,
  SizableProps,
} from '../../../core/contracts/ComponentContracts';
import { RouteService } from '../../../core/services/RouteService';

/**
 * ============================================================================
 * uxiGL COMPOSITE — TABS
 * ============================================================================
 * Material Design 3 Primary & Secondary Tabs with active indicator bar.
 */

/**
 * Individual tab descriptor for {@link Tabs}.
 */
export interface TabItem {
  /** Unique identifier for the tab item. */
  id: string;
  /** Visible label node rendered inside the tab button/link. */
  label: React.ReactNode;
  /** Optional SPA route href; when provided, renders a semantic `<a>` tag. */
  href?: string;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional numeric badge count displayed beside the label. */
  count?: number;
  /** Disables selection and keyboard focus for this tab. */
  disabled?: boolean;
}

/**
 * Props contract for {@link Tabs}.
 */
export interface TabsProps extends IdentifiableProps, SizableProps {
  /** Array of tab item descriptors. */
  items: TabItem[];
  /** Currently active tab identifier. */
  activeId: string;
  /** Callback fired when a tab is activated via click or keyboard navigation. */
  onChange: (id: string) => void;
  /** Visual indicator variant (`'underline'` or `'pill'`, defaults to `'underline'`). */
  variant?: 'underline' | 'pill';
}

/**
 * Material Design 3 & Liquid Glass `<Tabs />` navigation bar with `'underline'`
 * and `'pill'` variants, semantic `<a>`/`<button>` rendering, and WAI-ARIA
 * keyboard navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
 *
 * @param props - {@link TabsProps} configuration options.
 * @returns Rendered WAI-ARIA `tablist` element.
 */
export const Tabs: React.FC<TabsProps> = ({
  id,
  className = '',
  style,
  items,
  activeId,
  onChange,
  size = 'md',
  variant = 'underline',
}) => {
  const tabRefs = useRef<Array<HTMLElement | null>>([]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    currentIndex: number
  ) => {
    if (
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'Home' &&
      e.key !== 'End'
    ) {
      return;
    }

    const enabledIndices = items
      .map((item, idx) => (!item.disabled ? idx : -1))
      .filter((idx) => idx !== -1);

    if (enabledIndices.length === 0) return;

    e.preventDefault();

    const posInEnabled = enabledIndices.indexOf(currentIndex);
    let targetEnabledPos = 0;

    if (e.key === 'Home') {
      targetEnabledPos = 0;
    } else if (e.key === 'End') {
      targetEnabledPos = enabledIndices.length - 1;
    } else if (e.key === 'ArrowRight') {
      targetEnabledPos =
        posInEnabled === -1 ? 0 : (posInEnabled + 1) % enabledIndices.length;
    } else if (e.key === 'ArrowLeft') {
      targetEnabledPos =
        posInEnabled === -1
          ? enabledIndices.length - 1
          : (posInEnabled - 1 + enabledIndices.length) % enabledIndices.length;
    }

    const nextIndex = enabledIndices[targetEnabledPos];
    const nextItem = items[nextIndex];
    if (nextItem) {
      onChange(nextItem.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      id={id}
      role="tablist"
      className={`uxu-tabs uxu-tabs--${variant} uxu-tabs--${size} ${className}`.trim()}
      style={style}
    >
      {items.map((item, idx) => {
        const isActive = item.id === activeId;
        const isDisabled = Boolean(item.disabled);
        const inner = (
          <>
            {item.icon && <span className="uxu-tabs__icon">{item.icon}</span>}
            <span className="uxu-tabs__label">{item.label}</span>
            {item.count !== undefined && (
              <span className="uxu-tabs__count">{item.count}</span>
            )}
            {variant === 'underline' && isActive && (
              <span className="uxu-tabs__indicator" aria-hidden="true" />
            )}
          </>
        );

        if (item.href && !isDisabled) {
          return (
            <a
              key={item.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              href={item.href}
              title={item.href}
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDisabled || undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={(e) => {
                if (RouteService.isModifiedClick(e)) return;
                e.preventDefault();
                onChange(item.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`uxu-tabs__tab ${
                isActive ? 'uxu-tabs__tab--active' : ''
              }`.trim()}
            >
              {inner}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled || undefined}
            tabIndex={isActive && !isDisabled ? 0 : -1}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`uxu-tabs__tab ${
              isActive ? 'uxu-tabs__tab--active' : ''
            }`.trim()}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
};
