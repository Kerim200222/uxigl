import React, { useMemo, useRef } from 'react';
import type { FormControlContract } from '../../../core/contracts/ComponentContracts';
import { RouteService } from '../../../core/services/RouteService';

/**
 * ============================================================================
 * uxiGL COMPOSITE — SEGMENTED CONTROL
 * ============================================================================
 * Signature Apple HIG Segmented Control with tactile sliding active pill.
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `FormControlContract<T>` for single-choice selection.
 */

/**
 * Option item descriptor for {@link SegmentedControl}.
 */
export interface SegmentedOption<T extends string = string> {
  /** Unique string value representing the segment option. */
  value: T;
  /** Visible label node rendered inside the segment pill. */
  label: React.ReactNode;
  /** Optional SPA route href; when provided, renders a semantic `<a>` tag. */
  href?: string;
  /** Optional leading icon node. */
  icon?: React.ReactNode;
  /** Optional count or status badge displayed next to the label. */
  badge?: string | number;
  /** Disables selection and keyboard focus for this individual segment. */
  disabled?: boolean;
}

/**
 * Props contract for {@link SegmentedControl}.
 */
export interface SegmentedControlProps<T extends string = string>
  extends FormControlContract<T> {
  /** Array of segment options to render. */
  options: SegmentedOption<T>[];
  /** Stretches the segmented control to 100% of its parent container width. */
  fullWidth?: boolean;
}

/**
 * Apple HIG Liquid Glass Segmented Control with tactile sliding active thumb,
 * semantic `<a>`/`<button>` rendering, and WAI-ARIA keyboard navigation
 * (`ArrowRight`, `ArrowLeft`, `Home`, `End`).
 *
 * @param props - {@link SegmentedControlProps} configuration options.
 * @returns Rendered WAI-ARIA `tablist` segmented control.
 */
export function SegmentedControl<T extends string = string>({
  id,
  className = '',
  style,
  value,
  onChange,
  options,
  size = 'md',
  disabled = false,
  fullWidth = false,
  label,
}: SegmentedControlProps<T>) {
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  const activeIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  const trackStyle = useMemo<React.CSSProperties>(
    () =>
      ({
        '--segment-count': options.length,
        '--active-index': activeIndex,
      }) as React.CSSProperties,
    [options.length, activeIndex]
  );

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    currentIndex: number
  ) => {
    if (disabled) return;
    if (
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'Home' &&
      e.key !== 'End'
    ) {
      return;
    }

    const enabledIndices = options
      .map((opt, idx) => (!opt.disabled ? idx : -1))
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
    const nextOption = options[nextIndex];
    if (nextOption) {
      onChange(nextOption.value);
      itemRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      id={id}
      className={`uxu-segmented-wrapper ${
        fullWidth ? 'uxu-segmented-wrapper--full' : ''
      } ${className}`.trim()}
      style={style}
    >
      {label && <div className="uxu-field__label">{label}</div>}
      <div
        role="tablist"
        aria-label={typeof label === 'string' ? label : undefined}
        className={`uxu-segmented uxu-segmented--${size} ${
          fullWidth ? 'uxu-segmented--full' : ''
        } ${disabled ? 'uxu-segmented--disabled' : ''}`.trim()}
        style={trackStyle}
      >
        <div className="uxu-segmented__thumb" aria-hidden="true" />
        {options.map((option, idx) => {
          const isSelected = option.value === value;
          const isOptionDisabled = Boolean(disabled || option.disabled);
          const inner = (
            <>
              {option.icon && (
                <span className="uxu-segmented__icon">{option.icon}</span>
              )}
              <span className="uxu-segmented__label">{option.label}</span>
              {option.badge !== undefined && (
                <span className="uxu-segmented__badge">{option.badge}</span>
              )}
            </>
          );

          if (option.href && !isOptionDisabled) {
            return (
              <a
                key={option.value}
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                href={option.href}
                title={option.href}
                role="tab"
                aria-selected={isSelected}
                aria-disabled={isOptionDisabled || undefined}
                tabIndex={isSelected ? 0 : -1}
                className={`uxu-segmented__item ${
                  isSelected ? 'uxu-segmented__item--active' : ''
                }`.trim()}
                onClick={(e) => {
                  if (RouteService.isModifiedClick(e)) return;
                  e.preventDefault();
                  onChange(option.value);
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
              >
                {inner}
              </a>
            );
          }

          return (
            <button
              key={option.value}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-disabled={isOptionDisabled || undefined}
              tabIndex={isSelected && !isOptionDisabled ? 0 : -1}
              disabled={isOptionDisabled}
              className={`uxu-segmented__item ${
                isSelected ? 'uxu-segmented__item--active' : ''
              }`.trim()}
              onClick={() => !isOptionDisabled && onChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
